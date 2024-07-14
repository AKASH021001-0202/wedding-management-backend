// routes/expenses.js

import express from 'express';
import { ExpenseModel } from '../db.utils/model.js';
import { authApi, authenticateUser } from './auth/auth.js';

const ExpenseRouter = express.Router();

ExpenseRouter.use(authApi); // Ensure user is authenticated for all expense routes
// POST route to create an expense
ExpenseRouter.post('/', async (req, res) => {
    try {
      const { userId } = req.user; // Extract userId from req.user
      const { category, amount, description } = req.body;
  
      // Validate inputs
      if (!category || !amount || !description) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create new expense instance with user assigned
      const newExpense = new ExpenseModel({
        user: userId, // Assign userId to user field
        category,
        amount,
        description
      });
  
      // Save the expense to the database
      const savedExpense = await newExpense.save();
  
      // Respond with the saved expense data
      res.status(201).json(savedExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  ExpenseRouter.put('/:id', async (req, res) => {
    const { category, amount, description } = req.body;
    const { id } = req.params;
  
    try {
      const updatedExpense = await ExpenseModel.findByIdAndUpdate(
        id,
        { category, amount, description },
        { new: true }
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.json(updatedExpense);
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// GET route to fetch all expenses for a user
ExpenseRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.user;
    const expenses = await ExpenseModel.find({ user: userId });

    if (!expenses) {
      return res.status(404).json({ error: 'No expenses found' });
    }

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE route to delete an expense by ID
ExpenseRouter.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const deletedExpense = await ExpenseModel.findOneAndDelete({ _id: id, user: userId });

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default ExpenseRouter;
