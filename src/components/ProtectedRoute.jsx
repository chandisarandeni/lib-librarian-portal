import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AppContext);
  
  // Show loading while checking authentication
  
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
