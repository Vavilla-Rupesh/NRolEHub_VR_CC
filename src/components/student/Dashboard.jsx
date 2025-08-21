import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentHome from './Home';
import EventRegistration from './events/EventRegistration';
import EventDetails from './events/EventDetails';
import MyEvents from './events/MyEvents';
import Certificates from './certificates/Certificates';
import StudentProfile from './profile/StudentProfile';
import EventCalendar from '../shared/EventCalendar';
import PointsDisplay from './points/PointsDisplay';

function StudentDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/events" element={<EventRegistration />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/calendar" element={<EventCalendar />} />
        <Route path="/points" element={<PointsDisplay />} />
      </Routes>
    </div>
  );
}

export default StudentDashboard;
