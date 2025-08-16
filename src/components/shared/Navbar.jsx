import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, UserPlus, FileCheck } from "lucide-react";
import NavbarMenu from "./NavbarMenu";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .glass-navbar {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }
        
        .glass-navbar:hover {
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .dark .glass-navbar {
          background: rgba(17, 24, 39, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .dark .glass-navbar:hover {
          background: rgba(17, 24, 39, 0.9);
        }

        .glass-icon-container {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .dark .glass-icon-container {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .premium-gradient-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
          font-weight: 700;
          font-size: 1.5rem;
          text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #374151;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .glass-button:active {
          transform: translateY(0);
        }
        
        .dark .glass-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }
        
        .dark .glass-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .premium-link {
          position: relative;
          display: flex;
          align-items: center;
          space-x: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          text-decoration: none;
        }
        
        .premium-link:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .premium-link:hover:before {
          left: 100%;
        }
        
        .premium-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .verify-link {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
        }
        
        .verify-link:hover {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .auth-link {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
        }
        
        .auth-link:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
        }
        
        .dark .glass-morphism {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .nav-link {
          color: #374151;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
          text-decoration: none;
        }
        
        .nav-link:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          transform: translateY(-1px);
        }
        
        .dark .nav-link {
          color: #e5e7eb;
        }
        
        .dark .nav-link:hover {
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }

        .mobile-menu-enter {
          animation: slideDown 0.3s ease-out;
        }

        /* Enhanced text visibility */
        .text-primary {
          color: #374151;
        }
        
        .dark .text-primary {
          color: #e5e7eb;
        }
        
        .text-primary-dark {
          color: #e5e7eb;
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .premium-gradient-text {
            font-size: 1.25rem;
          }
          
          .glass-navbar {
            padding: 0.5rem 0;
          }
          
          .premium-link {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      <header className="glass-navbar fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="glass-icon-container p-2 rounded-full group-hover:scale-110 transition-all duration-300">
                <div className="w-15 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg"><img src="/logo.png" alt="logo" width={100} height={30}/></span>
                </div>
              </div>
              <span className="premium-gradient-text">
                NRolEHub
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4 w-full justify-end">
              {user ? (
                <>
                  <NavbarMenu />
                  <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    <UserMenu />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <a
                      href="/verify-certificate"
                      className="premium-link verify-link"
                    >
                      <FileCheck className="h-5 w-5" />
                      <span>Verify Certificate</span>
                    </a>
                    <a
                      href="/login"
                      className="premium-link auth-link"
                    >
                      <User className="h-5 w-5" />
                      <span>Login</span>
                    </a>
                    <a
                      href="/register"
                      className="premium-link auth-link"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Register</span>
                    </a>
                    <ThemeToggle />
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="glass-button p-2 rounded-lg"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="glass-morphism md:hidden mx-4 my-2 p-4 animate-float space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <UserMenu />
                  <span className="text-primary font-medium">{user.username}</span>
                </div>
                <NavbarMenu isMobile />
              </>
            ) : (
              <div className="space-y-3">
                <a
                  href="/verify-certificate"
                  className="premium-link verify-link w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileCheck className="h-5 w-5" />
                  <span>Verify Certificate</span>
                </a>
                <a
                  href="/login"
                  className="premium-link auth-link w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </a>
                <a
                  href="/register"
                  className="premium-link auth-link w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </a>
              </div>
            )}
          </div>
        )}
      </header>
      <div style={{ paddingTop: '4.5rem' }} />
    </>
  );
}