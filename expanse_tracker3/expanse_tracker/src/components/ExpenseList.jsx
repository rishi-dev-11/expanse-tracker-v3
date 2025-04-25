import axios from 'axios';

function ExpenseList({ expenses, setExpenses, setEditing }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary mb-4">Expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Amount</th>
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="border-b">
                <td className="p-2">${exp.amount}</td>
                <td className="p-2">{exp.category}</td>
                <td className="p-2">{exp.description}</td>
                <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => setEditing(exp)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;