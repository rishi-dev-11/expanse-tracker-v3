import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ExpenseChart from '../components/ExpenseChart';
import { AuthContext } from '../context/AuthContext';

function Reports() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { 'x-user-id': user?._id || 'guest' },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = filter === 'all' ? expenses : expenses.filter((exp) => exp.category === filter);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Spending Reports</h1>
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Categories</option>
          {['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <ExpenseChart expenses={filteredExpenses} />
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p>Total Expenses: ${filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
        <p>Number of Transactions: {filteredExpenses.length}</p>
      </div>
    </div>
  );
}

export default Reports;