// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import CompleteRegistration from './pages/CompleteRegistration';
import Login from './pages/Login';
import CandidateList from './pages/CandidateList';
import VotingTutorial from './pages/VotingTutorial';
import BookSlot from './pages/BookSlot';
import Announcement from './pages/Announcement';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';          
import CastVote from './pages/CastVote';
import useUserValidation from './components/useUserValidation'

function App() {
  useUserValidation();
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-register" element={<CompleteRegistration />} />
        <Route path="/login" element={<Login />} />  {/* ✅ Add this */}
        <Route path="/candidates" element={<CandidateList />} />
        <Route path="/tutorial" element={<VotingTutorial />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cast-vote" element={<CastVote />} />

        <Route
        path="/book-slot"
        element={
          <ProtectedRoute>
            <BookSlot />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/cast-vote"
        element={
          <ProtectedRoute>
            <CastVote />
          </ProtectedRoute>
        }
      /> */}
      </Routes>
    </Router>
  );
}

export default App;
