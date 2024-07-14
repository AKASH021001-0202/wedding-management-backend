import express from 'express'; 
import { Usermodel } from '../db.utils/model.js';

const UserRouter = express.Router();

// GET all users
UserRouter.get('/', async (req, res) => {
  try {
    const users = await Usermodel.find();
    res.send(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send({ message: 'Failed to fetch users', error: err.message });
  }
});
UserRouter.get('/count', async (req, res) => {
  try {
    const userCount = await Usermodel.countDocuments();
    res.status(200).send({ count: userCount });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.status(500).send({ message: 'Failed to fetch user count', error: err.message });
  }
});

// GET a user by ID
UserRouter.get('/:id', async (req, res) => {
  try {
    const user = await Usermodel.findById(req.params.id); // Use params.id to fetch the user by ID
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send({ message: 'Failed to fetch user', error: err.message });
  }
});

// POST a new user
UserRouter.post('/', async (req, res) => {
  const { body } = req;

  try {
    const newUser = new Usermodel(body);
    await newUser.save();
    res.status(201).send({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Failed to create user', error: error.message });
  }
});

// PATCH a user to update vendor status
UserRouter.patch('/:id/vendor', async (req, res) => {
  const { id } = req.params;
  const { is_vendor } = req.body;

  console.log(`Updating user ${id} to be a vendor with is_vendor: ${is_vendor}`);

  try {
    const updatedUser = await Usermodel.findByIdAndUpdate(
      id,
      { is_vendor: true },
      { new: true }
    );
    if (!updatedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User updated successfully:', updatedUser);
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// PUT (update) a user by ID
UserRouter.put('/:id', async (req, res) => {
  const { body, params } = req;

  try {
    const updatedUser = await Usermodel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send({ message: 'Failed to update user', error: err.message });
  }
});

// DELETE a user by ID
UserRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await Usermodel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send({ message: 'Failed to delete user', error: err.message });
  }
});

export default UserRouter;
