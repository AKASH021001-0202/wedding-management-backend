import express from 'express';
const budgetRouter = express.Router();
import { Budgetmodel } from '../db.utils/model.js';

// GET all budgets
budgetRouter.get('/budgets', async (req, res) => {
  try {
    const budgets = await Budgetmodel.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one budget
budgetRouter.get('/budgets/:id', getBudget, (req, res) => {
  res.json(res.budget);
});

// POST a new budget
budgetRouter.post('/budgets', async (req, res) => {
  const budget = new Budgetmodel({
    event_id: req.body.event_id,
    category: req.body.category,
    amount_allocated: req.body.amount_allocated,
    amount_spent: req.body.amount_spent
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a budget
budgetRouter.put('/budgets/:id', getBudget, async (req, res) => {
  if (req.body.event_id != null) {
    res.budget.event_id = req.body.event_id;
  }
  if (req.body.category != null) {
    res.budget.category = req.body.category;
  }
  if (req.body.amount_allocated != null) {
    res.budget.amount_allocated = req.body.amount_allocated;
  }
  if (req.body.amount_spent != null) {
    res.budget.amount_spent = req.body.amount_spent;
  }
  try {
    const updatedBudget = await res.budget.save();
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a budget
budgetRouter.delete('/budgets/:id', getBudget, async (req, res) => {
  try {
    await res.budget.remove();
    res.json({ message: 'Deleted budget' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBudget(req, res, next) {
  let budget;
  try {
    budget = await Budgetmodel.findById(req.params.id);
    if (budget == null) {
      return res.status(404).json({ message: 'Cannot find budget' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.budget = budget;
  next();
}

export default budgetRouter;
