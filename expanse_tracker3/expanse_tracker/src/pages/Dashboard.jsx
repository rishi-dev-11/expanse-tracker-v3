import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

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

  const handleSubmit = () => {
    setEditing(null);
    fetchExpenses();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>
      <ExpenseForm expense={editing} onSubmit={handleSubmit} />
      <ExpenseList expenses={expenses} setExpenses={setExpenses} setEditing={setEditing} />
    </div>
  );
}

export default Dashboard;