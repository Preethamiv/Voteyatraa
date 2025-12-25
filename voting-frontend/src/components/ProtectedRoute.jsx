// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('voteyatra_token');

  if (!token) {
    // ⛔ Set flash message in session storage
    sessionStorage.setItem('flashMessage', 'Please log in to access this page');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
