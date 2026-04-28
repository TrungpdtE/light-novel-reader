import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && user.roles) {
    const hasPermission = user.roles.some(role => 
      role.permissions.includes(requiredPermission)
    );

    if (!hasPermission) {
      return <div>Access Denied</div>;
    }
  }

  return children;
};

export default ProtectedRoute;
