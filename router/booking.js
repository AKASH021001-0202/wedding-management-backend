import express from 'express';
import { BookingModel, Eventmodel } from '../db.utils/model.js';
import { authApi } from './auth/auth.js';
import mongoose from 'mongoose';

const BookingRouter = express.Router();

// Ensure `event_id` is a valid ObjectId before saving/updating
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all bookings
BookingRouter.get('/', async (req, res) => {
  try {
    const bookings = await BookingModel.find().populate('event_id');
    const count = bookings.length;
    console.log(count)
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one booking by ID
BookingRouter.get('/edit/:_id', authApi, async (req, res) => {
  const bookingId = req.params._id;
  try {
    const bookings = await BookingModel.find({ _id: bookingId }).populate('event_id');
    if (!bookings) {
      return res.status(404).json({ msg: 'No bookings found for this booking ID' });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET bookings by vendor ID
BookingRouter.get('/:user_id', authApi, async (req, res) => {
  const userId = req.params.user_id;
  try {
    const bookings = await BookingModel.find({ vendor_id: userId }).populate('event_id');
    if (!bookings) {
      return res.status(404).json({ msg: 'No bookings found for this user' });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST a new booking

// GET bookings by user_id
BookingRouter.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const bookings = await BookingModel.find({ vendor_id: user_id }).populate('event_id');
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET bookings by event_id.user_id
// GET bookings by event_id.user_id
BookingRouter.get('/event/user/:userId', authApi, async (req, res) => {
  const vendorId = req.params.userId; // Assuming userId in the route parameter corresponds to vendor_id

  console.log('Fetching bookings for vendor ID:', vendorId);

  try {
    // Find bookings where vendor_id matches
    const bookings = await BookingModel.find({ vendor_id: vendorId }).populate('event_id');

    console.log('Fetched bookings:', bookings);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// POST a new booking


BookingRouter.post('/', authApi, async (req, res) => {
  const { user_id, event_id, customerName, date } = req.body;

  try {
    if (!isValidObjectId(event_id)) {
      return res.status(400).json({ message: 'Invalid event_id format' });
    }

    // Fetch the event to get vendor_id
    const event = await Eventmodel.findOne({ _id: event_id });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const vendor_id = event.user_id;

    const newBooking = new BookingModel({
      event_id,
      vendor_id,
      user_id,
      customerName,
      date,
    });

    const savedBooking = await newBooking.save();

    const updatedEvent = await Eventmodel.findByIdAndUpdate(
      event_id,
      { $push: { bookings: savedBooking._id } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(201).json({ booking: savedBooking, event: updatedEvent });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// PUT update a booking by ID
BookingRouter.put('/:id', async (req, res) => {
  const { customerName, date } = req.body;


  const { id } = req.params;


  try {
    const updateFields = {
      customerName,
      date,
    };

    const booking = await BookingModel.findByIdAndUpdate(id, updateFields, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE a booking by ID
BookingRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await BookingModel.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message1: error.message });
  }
});

export default BookingRouter;
