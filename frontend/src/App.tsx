import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PollProvider } from './context/PollContext';
import LandingPage from './pages/LandingPage';
import NameEntry from './pages/NameEntry';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentWaiting from './pages/StudentWaiting';
import PollQuestion from './pages/PollQuestion';
import PollResults from './pages/PollResults';
import PollHistory from './pages/PollHistory';
import KickedOut from './pages/KickedOut';

function App() {
  return (
    <PollProvider>
      <div className="min-h-screen gradient-bg">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/name-entry" element={<NameEntry />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-waiting" element={<StudentWaiting />} />
          <Route path="/poll-question" element={<PollQuestion />} />
          <Route path="/poll-results" element={<PollResults />} />
          <Route path="/poll-history" element={<PollHistory />} />
          <Route path="/kicked-out" element={<KickedOut />} />
        </Routes>
      </div>
    </PollProvider>
  );
}

export default App;