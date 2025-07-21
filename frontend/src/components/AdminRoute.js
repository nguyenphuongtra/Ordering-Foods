import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Hoặc một spinner đẹp hơn
  }

  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return children;
  }

  // Nếu không phải admin, chuyển về trang đăng nhập
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;