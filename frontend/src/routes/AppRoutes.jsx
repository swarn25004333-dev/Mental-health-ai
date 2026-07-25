import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import VerifyEmail from '../pages/VerifyEmail';
import Dashboard from '../pages/Dashboard';
import Chatbot from '../pages/Chatbot';
import MoodTracker from '../pages/MoodTracker';
import MoodHistory from '../pages/MoodHistory';
import Phq2 from '../pages/Phq2';
import ChatHistory from '../pages/ChatHistory';
import EmergencyHelp from '../pages/EmergencyHelp';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected App Routes enclosed in MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/mood-history" element={<MoodHistory />} />
          <Route path="/phq-2" element={<Phq2 />} />
          <Route path="/chat-history" element={<ChatHistory />} />
          <Route path="/emergency" element={<EmergencyHelp />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
