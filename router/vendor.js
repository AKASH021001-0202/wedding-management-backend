// vendorRouter.js

import express from 'express';
import { Usermodel, Vendormodel } from '../db.utils/model.js';
import { authApi } from './auth/auth.js';

const vendorRouter = express.Router();

// Middleware to log requests
vendorRouter.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// PATCH /vendors/:userId/vendors - Update user to vendor
vendorRouter.patch('/:userId/vendors', authApi, async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await Usermodel.findByIdAndUpdate(
      userId,
      { is_vendor: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// GET /vendors - Fetch all vendors
vendorRouter.get('/', async (req, res) => {
  try {
    const vendors = await Vendormodel.find()
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: 'Error fetching vendors', error: error.message });
  }
});

// GET /vendors/:id - Fetch vendor by ID
vendorRouter.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendormodel.findById(req.params.id).populate('user_id', 'name email');
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ message: 'Error fetching vendor', error: error.message });
  }
});

// POST /vendors - Add a new vendor
vendorRouter.post('/', authApi, async (req, res) => {
  const { user_id, name, service_type, contact_info, rating } = req.body;

  try {
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    // Check if the user_id already exists in Vendormodel
    const existingVendor = await Vendormodel.findOne({ user_id });

    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor with this user_id already exists' });
    }

    const newVendor = new Vendormodel({
      user_id,
      name,
      service_type,
      contact_info,
      rating
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor saved successfully', vendor: newVendor });
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).json({ message: 'Error adding vendor', error: error.message });
  }
});

// PUT /vendors/:id - Update vendor by ID
vendorRouter.put('/:id', authApi, async (req, res) => {
  const { name, service_type, contact_info, rating } = req.body;

  try {
    const vendor = await Vendormodel.findById(req.params.id);

    if (vendor) {
      vendor.name = name || vendor.name;
      vendor.service_type = service_type || vendor.service_type;
      vendor.contact_info = contact_info || vendor.contact_info;
      vendor.rating = rating || vendor.rating;

      const updatedVendor = await vendor.save();
      res.json(updatedVendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Error updating vendor', error: error.message });
  }
});

// DELETE /vendors/:id - Delete vendor by ID
vendorRouter.delete('/:id', authApi, async (req, res) => {
  try {
    const vendor = await Vendormodel.findById(req.params.id);

    if (vendor) {
      await vendor.remove();
      res.json({ message: 'Vendor removed' });
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Error deleting vendor', error: error.message });
  }
});

export default vendorRouter;
