import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Expense Tracker
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-secondary">
            Dashboard
          </Link>
          <Link to="/reports" className="hover:text-secondary">
            Reports
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-secondary">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-secondary">
                Logout
              </button>
            </>
          ) : (
            <Link to="/profile" className="hover:text-secondary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;