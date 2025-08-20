import React from 'react';
import { Calendar } from 'lucide-react';

export default function LoginHeader() {
  return (
    <div className="text-center transform transition-all duration-700 hover:scale-105">
      {/* Enhanced Logo Container */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 scale-110"></div>
          
          {/* Middle ring */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 p-1 group-hover:border-white/50 transition-all duration-500">
            
            {/* Inner container with enhanced effects */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden group-hover:from-white/20 group-hover:to-white/10 transition-all duration-500">
              
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
              
              {/* Logo */}
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                <img 
                  src="/logo.png" 
                  alt="logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain animate-pulse group-hover:animate-none transition-all duration-500"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))',
                  }}
                />
              </div>
              
              {/* Sparkle effects */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Welcome Text */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent
                       transform hover:scale-105 transition-all duration-500 leading-tight
                       animate-gradient-x bg-300% bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-cyan-400">
          Welcome Back
        </h2>
        
        <p className="mt-3 sm:mt-4 text-gray-700 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-medium
                      opacity-80 hover:opacity-100 transition-opacity duration-300">
          Sign in to continue to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">
            NRolEHub
          </span>
        </p>
      </div>

      {/* Animated underline */}
      <div className="mt-4 sm:mt-6 flex justify-center">
        <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full
                        transform scale-x-0 hover:scale-x-100 transition-transform duration-700 origin-center">
        </div>
      </div>

      {/* Floating elements for premium feel */}
      <div className="absolute -top-4 -left-4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute -top-2 -right-6 w-1 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s', animationDuration: '2.5s'}}></div>
      <div className="absolute top-6 -right-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-50 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 300% 300%;
          animation: gradient-x 3s ease infinite;
        }
        
        .bg-300\% {
          background-size: 300%;
        }
        
        @media (max-width: 640px) {
          h2 {
            font-size: 2rem;
            line-height: 1.2;
          }
        }
        
        @media (min-width: 1024px) {
          .group:hover img {
            filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8)) 
                   drop-shadow(0 0 60px rgba(236, 72, 153, 0.4));
          }
        }
      `}</style>
    </div>
  );
}
