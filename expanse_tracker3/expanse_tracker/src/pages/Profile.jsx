// import { useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// function Profile() {
//   const { user, setUser } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     password: '',
//   });
//   const [isLogin, setIsLogin] = useState(true);
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isLogin) {
//         const res = await axios.post('http://localhost:5000/api/auth/login', {
//           email: formData.email,
//           password: formData.password,
//         });
//         setUser(res.data.user);
//         setMessage('Login successful!');
//       } else {
//         const res = await axios.post('http://localhost:5000/api/auth/register', formData);
//         setUser(res.data.user);
//         setMessage('Registration successful!');
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'An error occurred');
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
//         headers: { 'x-user-id': user._id },
//       });
//       setUser(res.data.user);
//       setMessage('Profile updated successfully!');
//     } catch (error) {
//       setMessage('Failed to update profile');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h1 className="text-3xl font-bold text-primary mb-6">Profile</h1>
//       {user ? (
//         <div className="card">
//           <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">New Password (optional)</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <button onClick={handleUpdate} className="btn-primary">
//               Update Profile
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="card">
//           <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
//           <div className="space-y-4">
//             {!isLogin && (
//               <div>
//                 <label className="block text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             )}
//             <div>
//               <label className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <button onClick={handleSubmit} className="btn-primary">
//               {isLogin ? 'Login' : 'Register'}
//             </button>
//             <button
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-blue-600 hover:underline"
//             >
//               {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
//             </button>
//           </div>
//         </div>
//       )}
//       {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
//     </div>
//   );
// }

// export default Profile;


import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser, token, setToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch {
          setUser(null);
          setToken(null);
          setMessage('Session expired. Please login again.');
        }
      }
    };
    fetchUser();
  }, [token, user, setUser, setToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token); // Store token in localStorage
      setMessage(`${isLogin ? 'Login' : 'Registration'} successful!`);
      setFormData({ name: '', email: '', password: '' }); // Clear the form after submission
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.user);
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
    setMessage('Logged out');
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      {user ? (
        <>
          <h2 className="text-xl font-bold mb-4">Welcome, {user.name}</h2>
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
            <p
              className="text-sm text-blue-600 cursor-pointer text-center"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </p>
          </form>
        </>
      )}
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default Profile;
