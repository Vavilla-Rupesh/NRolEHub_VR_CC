import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import InputField from './InputField';
import { handleLoginError, validateLoginCredentials } from '../../lib/auth';
import toast from 'react-hot-toast';

export default function LoginForm({ onSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateLoginCredentials(credentials.email, credentials.password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const user = await login(credentials.email, credentials.password);
      onSuccess(user);
    } catch (error) {
      const errorMessage = handleLoginError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
      {/* Enhanced Input Fields */}
      <div className="space-y-5 sm:space-y-6">
        <div className="group">
          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full"
          />
        </div>

        <div className="group">
          <InputField
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full"
          />
        </div>
      </div>

      {/* Premium Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full py-3 sm:py-4 px-6 rounded-2xl font-semibold text-white text-base sm:text-lg
                   bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                   hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500
                   transform transition-all duration-500 ease-out
                   hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   focus:outline-none focus:ring-4 focus:ring-purple-500/50
                   overflow-hidden active:scale-[0.98]"
        >
          {/* Button background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          {/* Loading spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Button content */}
          <span className={`relative z-10 flex items-center justify-center space-x-2 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            {!loading && (
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </span>
          
          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="ripple-effect"></div>
          </div>
        </button>
      </div>

      {/* Security indicator */}
      {/* <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400 mt-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>Secure 256-bit SSL encryption</span>
      </div> */}

      <style jsx>{`
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect:active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
        }
        
        @keyframes ripple {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
        
        @media (max-width: 640px) {
          .group:focus-within {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </form>
  );
}
