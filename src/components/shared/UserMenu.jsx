import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate function

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');  // Navigate to the landing page after logout
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        .premium-user-button {
          position: relative;
          display: flex;
          align-items: center;
          space-x: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #374151;
          cursor: pointer;
          overflow: hidden;
        }
        
        .dark .premium-user-button {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }
        
        .premium-user-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }
        
        .premium-user-button:hover:before {
          left: 100%;
        }
        
        .premium-user-button:hover {
          transform: translateY(-2px) scale(1.02);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1));
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.15),
            0 0 20px rgba(99, 102, 241, 0.2);
          animation: glow 2s ease-in-out infinite;
        }
        
        .dark .premium-user-button:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.15));
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(139, 92, 246, 0.3);
        }
        
        .premium-user-button:active {
          transform: translateY(-1px) scale(1.01);
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .user-avatar:before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(-45deg);
          animation: shimmer 3s linear infinite;
        }
        
        .premium-user-button:hover .user-avatar {
          animation: pulse 1s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        
        .user-avatar .user-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: white;
          z-index: 1;
          position: relative;
        }
        
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          z-index: 1;
          position: relative;
        }

        .username-text {
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #374151, #6b7280);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .dark .username-text {
          background: linear-gradient(135deg, #e5e7eb, #d1d5db);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .premium-user-button:hover .username-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .premium-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          width: 12rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            0 0 30px rgba(99, 102, 241, 0.1);
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          overflow: hidden;
        }
        
        .dark .premium-dropdown {
          background: rgba(17, 24, 39, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.2),
            0 0 30px rgba(139, 92, 246, 0.2);
        }

        .dropdown-content {
          padding: 0.5rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        
        .dropdown-item:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.4s ease;
        }
        
        .dropdown-item:hover:before {
          left: 100%;
        }

        .profile-item {
          color: #374151;
        }
        
        .dark .profile-item {
          color: #e5e7eb;
        }
        
        .profile-item:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.05));
          color: #3b82f6;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        
        .dark .profile-item:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1));
          color: #a78bfa;
        }

        .logout-item {
          color: #dc2626;
        }
        
        .dark .logout-item {
          color: #f87171;
        }
        
        .logout-item:hover {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05));
          color: #dc2626;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
        }
        
        .dark .logout-item:hover {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.1));
          color: #fca5a5;
        }

        .dropdown-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .dropdown-item:hover .dropdown-icon {
          transform: scale(1.1);
        }

        .status-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .dark .status-indicator {
          border-color: #1f2937;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .premium-dropdown {
            width: 10rem;
            right: -1rem;
          }
          
          .dropdown-item {
            padding: 0.65rem 0.85rem;
            font-size: 0.8rem;
          }
          
          .username-text {
            font-size: 0.85rem;
          }
        }
        
        /* Click ripple effect */
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }
        
        .ripple-effect:active:before {
          width: 300px;
          height: 300px;
          animation: ripple 0.6s ease-out;
        }
      `}</style>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="premium-user-button ripple-effect"
        >
          <div className="user-avatar">
            {user.profile_image ? (
              <img 
                src={user.profile_image} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <User className="user-icon" />
            )}
            <div className="status-indicator"></div>
          </div>
          <span className="ml-2 username-text hidden md:block">{user.username}</span>
        </button>

        {isOpen && (
          <div className="premium-dropdown">
            <div className="dropdown-content">
              <Link
                to={user.role === 'super_admin' ? '/admin/profile' : `/${user.role}/profile`}
                className="dropdown-item profile-item"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="dropdown-icon" />
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="dropdown-item logout-item"
              >
                <LogOut className="dropdown-icon" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}