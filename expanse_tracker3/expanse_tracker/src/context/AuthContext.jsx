// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/auth/me', {
//           headers: { 'x-user-id': localStorage.getItem('userId') },
//         });
//         setUser(res.data.user);
//       } catch (error) {
//         setUser(null);
//       }
//     };
//     checkAuth();
//   }, []);

//   const login = async (email, password) => {
//     const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//     setUser(res.data.user);
//     localStorage.setItem('userId', res.data.user._id);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('userId');
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
