import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Expense Tracker</h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your finances with ease. Track, categorize, and analyze your expenses in one place.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card">
          <h3 className="text-xl font-semibold text-primary">Track Expenses</h3>
          <p className="text-gray-600">Easily add and categorize your daily expenses.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold text-primary">Analyze Spending</h3>
          <p className="text-gray-600">Visualize your spending with insightful charts.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold text-primary">Manage Profile</h3>
          <p className="text-gray-600">Update your details and preferences.</p>
        </div>
      </div>
      <Link to="/dashboard" className="btn-primary">
        Get Started
      </Link>
    </div>
  );
}

export default Landing;