import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function ExpenseForm({ expense, onSubmit }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(
    expense || {
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    }
  );

  const categories = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, userId: user?._id || 'guest' };
      if (expense) {
        await axios.put(`http://localhost:5000/api/expenses/${expense._id}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/expenses', payload);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-2xl font-bold text-primary mb-4">
        {expense ? 'Edit Expense' : 'Add Expense'}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn-primary mt-4">
        {expense ? 'Update' : 'Add'} Expense
      </button>
    </form>
  );
}

export default ExpenseForm;