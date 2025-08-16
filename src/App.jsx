import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ChatBot from './components/shared/ChatBot';
import AdminDashboard from './components/admin/Dashboard';
import StudentDashboard from './components/student/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import LandingPage from './components/LandingPage';
import EventCalendar from './components/shared/EventCalendar';
import CertificateVerification from './components/public/CertificateVerification';
import AnimatedBackgroundWrapper from './components/shared/AnimatedBackgroundWrapper'; // ✅ new import

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AnimatedBackgroundWrapper> {/* ✅ animated wrapper added here */}
      <div className="min-h-screen flex flex-col">
        <Navbar 
          showLoginButton={!user} 
          onLoginClick={() => navigate('/login')} 
        />

        <main className={`flex-grow ${!user && 'p-0'}`}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Certificate Verification Route */}
            <Route path="/verify-certificate" element={<CertificateVerification />} />

            {/* Landing Page */}
            <Route 
              path="/" 
              element={
                user 
                  ? <Navigate to={user.role === 'super_admin' || user.role === 'admin' ? '/admin' : `/${user.role}`} /> 
                  : <LandingPage />
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        {user && (
          <>
            <Footer />
            {user.role === 'student' && <ChatBot />}
          </>
        )}
        <Toaster position="top-right" />
      </div>
    </AnimatedBackgroundWrapper>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
