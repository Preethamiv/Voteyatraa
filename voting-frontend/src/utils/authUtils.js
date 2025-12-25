// src/utils/authUtils.js

export const isLoggedIn = () => {
  return localStorage.getItem('userEmail') !== null;
};

export const logout = () => {
  localStorage.removeItem('userEmail');
  window.location.href = '/'; // reloads the page to reflect logout
};
