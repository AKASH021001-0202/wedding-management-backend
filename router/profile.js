import express from 'express';
import { Usermodel } from '../db.utils/model.js';

const ProfileRouter = express.Router();

// Route to fetch all user profiles
ProfileRouter.get('/',  async (req, res) => {
  try {
    const profiles = await Usermodel.find().select('-password');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profiles', error: err.message });
  }
});

// Route to fetch user profile by ID
ProfileRouter.get('/:id',  async (req, res) => {
  try {
    const user = await Usermodel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to update user profile by ID
ProfileRouter.put('/:id',  async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await Usermodel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: 'Unauthorized action' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user = await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to delete user profile by ID
ProfileRouter.delete('/:id',  async (req, res) => {
  try {
    const user = await Usermodel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Ensure the logged-in user is deleting their own profile
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: 'Unauthorized action' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default ProfileRouter;
