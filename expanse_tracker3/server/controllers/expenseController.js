const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'guest';
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.headers['x-user-id'] || 'guest' });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create expense' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete expense' });
  }
};