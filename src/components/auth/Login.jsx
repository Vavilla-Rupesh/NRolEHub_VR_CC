import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    toast.success('Login successful!');
    navigate('/'); // Redirect to LandingPage after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[15%] w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-lg transform transition-all duration-300 hover:scale-[1.02]">
        <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 rounded-3xl shadow-2xl border border-white/30 p-10 relative overflow-hidden">
          
          {/* Subtle background gradient inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <LoginHeader />
            
            {/* Login Form with nice spacing */}
            <div className="mt-6">
              <LoginForm onSuccess={handleLoginSuccess} />
            </div>

            {/* Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
