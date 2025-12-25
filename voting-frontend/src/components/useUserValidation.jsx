import { useEffect } from 'react';
import axios from 'axios';

const useUserValidation = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem('voteyatra_token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/vote/auth/check-valid-user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.valid) {
          localStorage.clear();
          alert('❌ Your account was deleted by the admin. You will be logged out.');
          window.location.href = '/login'; // 🚨 Direct page reload
        }
      } catch (err) {
        if (err.response?.status === 404) {
          localStorage.clear();
          alert('❌ Your account no longer exists. You will be logged out.');
          window.location.href = '/login';
        }
      }
    }, 1000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);
};

export default useUserValidation;
