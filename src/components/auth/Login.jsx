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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden from-indigo-900 via-purple-900 to-pink-800">
      
      {/* Enhanced Background Effects */}
      {/* <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        Primary animated blobs */}
        {/* <div className="absolute -top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-3xl opacity-25 animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
         */}
        {/* Floating particles */}
        {/* <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-white rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '3s'}}></div>
         */}
        {/* Grid pattern overlay */}
        {/* <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div> */}

      {/* Enhanced Login Card */}
      <div className="relative w-full max-w-md sm:max-w-lg transform transition-all duration-500 hover:scale-[1.02] z-10">
        {/* Glow effect behind card */}
        <div className="absolute inset-0 from-cyan-500/20 to-pink-500/20 rounded-3xl blur-xl transform scale-105"></div>
        
        <div className="relative backdrop-blur-2xl bg-white/10 dark:bg-gray-900/20 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-6 sm:p-8 lg:p-10 overflow-hidden group hover:shadow-cyan-500/25 hover:shadow-2xl transition-all duration-500">
          
          {/* Dynamic gradient background inside card */}
          <div className="absolute inset-0 from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none rounded-3xl transition-all duration-700"></div>
          
          {/* Animated border effect */}
          
          {/* Content */}
          <div className="relative z-20">
            <LoginHeader />
            
            {/* Login Form with enhanced spacing */}
            <div className="mt-6 sm:mt-8">
              <LoginForm onSuccess={handleLoginSuccess} />
            </div>

            {/* Enhanced Links Section */}
            <div className="mt-8 sm:mt-10 text-center space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
              
              <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-cyan-500 bg-clip-text from-cyan-400 to-pink-400 hover:from-cyan-300 hover:to-pink-300 font-semibold transition-all duration-300 hover:scale-105 inline-block transform"
                >
                  Sign up
                </button>
              </p>
              <p className="text-gray-300 dark:text-gray-400 text-sm sm:text-base">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-300 hover:to-purple-300 font-medium transition-all duration-300 hover:scale-105 inline-block transform"
                >
                  Forgot password?
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-specific enhancements */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Secure login powered by advanced encryption
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
