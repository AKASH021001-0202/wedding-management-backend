import express from "express";
import { Eventmodel, BookingModel } from "../db.utils/model.js";
import { authApi } from "./auth/auth.js";

const EventRouter = express.Router();

// GET all events
EventRouter.get("/", async (req, res) => {
  try {
    const events = await Eventmodel.find().populate("bookings");
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  } 
});

// GET events by user_id
EventRouter.get("/:user_id", async (req, res) => {
  try {
    const events = await Eventmodel.find({ user_id: req.params.user_id });
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for this user' });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (update) an event by ID
EventRouter.put("/:_id", async (req, res) => {
  const { _id } = req.params;
  const { user_id, name, category, description, location, budget, imageUrl } = req.body;

  try {
    const updatedEvent = await Eventmodel.findByIdAndUpdate(
      _id,
      { user_id, name, category, description, location, budget, imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).send({ message: "Event not found" });
    }

    res.status(200).send({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    console.error("Error updating event:", err.message);
    res.status(500).send({ message: "Error updating event", error: err.message });
  }
});

// GET events with filtering
EventRouter.get("/filtered", async (req, res) => {
  const { category, location, min_budget, max_budget } = req.query;
  const query = {};

  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: "i" };
  if (min_budget || max_budget) {
    query.budget = {};
    if (min_budget) query.budget.$gte = Number(min_budget);
    if (max_budget) query.budget.$lte = Number(max_budget);
  }

  try {
    const events = await Eventmodel.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new event (with image URL)
EventRouter.post("/", authApi, async (req, res) => {
  const { user_id, name, category, description, location, budget, imageUrl } = req.body;

  if (!user_id) {
    return res.status(401).send({ message: "USER ID IS REQUIRED" });
  }

  const newEvent = new Eventmodel({
    user_id,
    name,
    category,
    description,
    location,
    budget,
    imageUrl,
  });

  try {
    await newEvent.save();
    res.status(201).send({ message: "Event planned successfully", event: newEvent });
  } catch (error) {
    res.status(500).send({ message: "Error saving event", error: error.message });
  }
});

// POST a new event with specified ID (with image URL)
EventRouter.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (!body.imageUrl) {
    return res.status(400).send({ message: "Image URL is required" });
  }

  const newEvent = new Eventmodel({
    ...body,
    user_id: id,
  });

  try {
    await newEvent.save();
    res.status(201).send({ message: "Event planned successfully", event: newEvent });
  } catch (error) {
    res.status(500).send({ message: "Error saving event", error: error.message });
  }
});
EventRouter.get('/vendor/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendorEventCount = await Eventmodel.countDocuments({ vendor: vendorId });
    res.status(200).send({ count: vendorEventCount });
  } catch (err) {
    console.error('Error fetching vendor-specific event count:', err);
    res.status(500).send({ message: 'Failed to fetch vendor-specific event count', error: err.message });
  }
});

// DELETE an event by ID
EventRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Eventmodel.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).send({ message: "Event not found" });
    }
    res.status(200).send({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting event", error: err.message });
  }
});

export default EventRouter;
