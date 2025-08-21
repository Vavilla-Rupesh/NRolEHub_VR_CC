import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Award,
  Users,
  FileCheck,
  MessageSquare,
  CalendarDays,
  Shield,
  Bell,
} from 'lucide-react';

export default function NavbarMenu({ isMobile = false }) {
  const { user } = useAuth();

  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Complaints', path: '/admin/complaints', icon: MessageSquare },
  ];

  const superAdminMenuItems = [
    ...adminMenuItems,
    { label: 'Pending Admins', path: '/admin/pending-admins', icon: Shield }
  ];

  const studentMenuItems = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Events', path: '/student/events', icon: Calendar },
    { label: 'Calendar', path: '/student/calendar', icon: CalendarDays },
    { label: 'My Events', path: '/student/my-events', icon: Users },
    { label: 'Points', path: '/student/points', icon: Award },
  ];

  const menuItems = user?.role === 'super_admin' ? superAdminMenuItems :
                   user?.role === 'admin' ? adminMenuItems :
                   user?.role === 'student' ? studentMenuItems : [];

  // Updated className with better spacing and flex properties
  const className = isMobile
    ? 'flex flex-col space-y-3 w-full'
    : 'hidden md:flex md:items-center md:space-x-4 lg:space-x-6 xl:space-x-8 md:flex-wrap md:justify-end md:flex-1';

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .premium-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          space-x: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #374151;
          text-decoration: none;
          animation: slideIn 0.5s ease-out;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .premium-nav-link:nth-child(1) { animation-delay: 0.1s; }
        .premium-nav-link:nth-child(2) { animation-delay: 0.2s; }
        .premium-nav-link:nth-child(3) { animation-delay: 0.3s; }
        .premium-nav-link:nth-child(4) { animation-delay: 0.4s; }
        .premium-nav-link:nth-child(5) { animation-delay: 0.5s; }
        .premium-nav-link:nth-child(6) { animation-delay: 0.6s; }
        .premium-nav-link:nth-child(7) { animation-delay: 0.7s; }
        
        .dark .premium-nav-link {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }
        
        .premium-nav-link:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .premium-nav-link:hover:before {
          left: 100%;
        }
        
        .premium-nav-link:hover {
          transform: translateY(-2px) scale(1.01);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1));
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.1),
            0 0 15px rgba(99, 102, 241, 0.2);
          color: #6366f1;
        }
        
        .dark .premium-nav-link:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.15));
          border-color: rgba(139, 92, 246, 0.4);
          color: #a78bfa;
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.2),
            0 0 15px rgba(139, 92, 246, 0.3);
        }
        
        .premium-nav-link:active {
          transform: translateY(-1px) scale(1.0);
        }

        .nav-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.375rem;
          transition: all 0.3s ease;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
          flex-shrink: 0;
        }
        
        .premium-nav-link:hover .nav-icon {
          animation: bounce-subtle 0.6s ease-in-out;
          filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
        }

        .role-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: bold;
          color: white;
          animation: glow 2s ease-in-out infinite;
        }
        
        .admin-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .super-admin-badge {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        
        .student-badge {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .mobile-nav {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 1rem;
          margin: 0.5rem 0;
        }
        
        .dark .mobile-nav {
          background: rgba(17, 24, 39, 0.8);
        }

        .auth-links {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .auth-link {
          position: relative;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          white-space: nowrap;
        }
        
        .login-link {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: 1px solid transparent;
        }
        
        .login-link:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        
        .register-link {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: 1px solid transparent;
        }
        
        .register-link:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .mobile-auth-links {
          flex-direction: column;
        }
        
        .mobile-auth-links .auth-link {
          width: 100%;
          text-align: center;
          justify-content: center;
          display: flex;
        }

        /* Enhanced text visibility */
        .text-visible-light {
          color: #374151;
        }
        
        .dark .text-visible-light {
          color: #e5e7eb;
        }
        
        .text-visible-dark {
          color: #e5e7eb;
        }

        /* Responsive improvements for better logo/title visibility */
        @media (max-width: 1280px) {
          .premium-nav-link {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
          }
          
          .nav-icon {
            width: 0.875rem;
            height: 0.875rem;
            margin-right: 0.25rem;
          }
          
          .auth-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 1024px) {
          .premium-nav-link {
            padding: 0.375rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .nav-icon {
            width: 0.75rem;
            height: 0.75rem;
          }
          
          .auth-link {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .premium-nav-link {
            padding: 0.65rem 1rem;
            font-size: 0.9rem;
          }
          
          .nav-icon {
            width: 1.1rem;
            height: 1.1rem;
            margin-right: 0.5rem;
          }
        }

        /* Ensure navbar doesn't overflow and wraps properly */
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 4rem;
        }

        /* Compact mode for admin panels with many items */
        .compact-nav {
          gap: 0.25rem !important;
        }
        
        .compact-nav .premium-nav-link {
          padding: 0.375rem 0.5rem !important;
          font-size: 0.75rem !important;
        }
        
        .compact-nav .nav-icon {
          width: 0.875rem !important;
          height: 0.875rem !important;
          margin-right: 0.25rem !important;
        }
      `}</style>
      
      <nav className={className}>
        {user ? (
          // Display menu for logged-in users
          <>
            {isMobile && (
              <div className="mobile-nav">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <span className="text-sm font-medium text-visible-light">
                      {user.role.replace('_', ' ').toUpperCase()} PANEL
                    </span>
                    <div className={`role-badge ${
                      user.role === 'super_admin' ? 'super-admin-badge' :
                      user.role === 'admin' ? 'admin-badge' : 'student-badge'
                    }`}>
                      {user.role === 'super_admin' ? 'SA' :
                       user.role === 'admin' ? 'A' : 'S'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Apply compact mode for admin/super_admin with many menu items */}
            <div className={`${!isMobile && (user.role === 'admin' || user.role === 'super_admin') ? 'compact-nav' : ''} ${isMobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-2'}`}>
              {menuItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="premium-nav-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          // Display Login and Register options when user is not logged in
          <div className={`auth-links ${isMobile ? 'mobile-auth-links' : ''}`}>
            <Link
              to="/login"
              className="auth-link login-link"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="auth-link register-link"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
