import React from "react";
import { Calendar, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .premium-footer {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(248, 250, 252, 0.95) 50%,
            rgba(255, 255, 255, 0.95) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(99, 102, 241, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .dark .premium-footer {
          background: linear-gradient(135deg,
            rgba(17, 24, 39, 0.95) 0%,
            rgba(31, 41, 55, 0.95) 50%,
            rgba(17, 24, 39, 0.95) 100%);
          border-top: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .premium-footer:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            #6366f1, #8b5cf6, #ec4899, #06b6d4, #10b981, #6366f1);
          background-size: 300% 300%;
          animation: gradient-shift 4s ease infinite;
        }

        .footer-logo-container {
          display: flex;
          align-items: center;
          space-x: 0.5rem;
          animation: slideUp 0.6s ease-out;
        }
        
        .footer-logo-icon {
          width: 1.5rem;
          height: 1.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .footer-logo-icon:before {
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
        
        .footer-logo-icon:hover {
          animation: glow 1s ease-in-out infinite, float 3s ease-in-out infinite;
          transform: scale(1.1);
        }
        
        .footer-logo-icon .lucide {
          color: white;
          width: 1rem;
          height: 1rem;
          z-index: 1;
          position: relative;
        }

        .footer-brand-text {
          font-size: 1.125rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
          transition: all 0.3s ease;
        }
        
        .footer-brand-text:hover {
          animation: gradient-shift 1s ease infinite, pulse 0.5s ease;
        }

        .footer-description {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.3s ease;
        }
        
        .dark .footer-description {
          color: #9ca3af;
        }
        
        .footer-description:hover {
          color: #6366f1;
        }
        
        .dark .footer-description:hover {
          color: #a78bfa;
        }

        .footer-section {
          animation: slideUp 0.6s ease-out;
        }
        
        .footer-section:nth-child(2) { animation-delay: 0.2s; }
        .footer-section:nth-child(3) { animation-delay: 0.4s; }

        .footer-heading {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #374151;
          margin-bottom: 1rem;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .dark .footer-heading {
          color: #e5e7eb;
        }
        
        .footer-heading:after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .footer-heading:hover:after {
          width: 100%;
        }
        
        .footer-heading:hover {
          color: #6366f1;
          transform: translateY(-2px);
        }
        
        .dark .footer-heading:hover {
          color: #a78bfa;
        }

        .contact-item {
          display: flex;
          align-items: center;
          space-x: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0.5rem 0;
          border-radius: 0.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .dark .contact-item {
          color: #9ca3af;
        }
        
        .contact-item:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .contact-item:hover:before {
          left: 100%;
        }
        
        .contact-item:hover {
          color: #6366f1;
          transform: translateX(8px);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.03));
        }
        
        .dark .contact-item:hover {
          color: #a78bfa;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05));
        }
        
        .contact-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .contact-item:hover .contact-icon {
          transform: scale(1.2) rotate(5deg);
          color: #8b5cf6;
        }

        .footer-link {
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          padding: 0.5rem 0;
          border-radius: 0.5rem;
          display: inline-block;
          position: relative;
          overflow: hidden;
        }
        
        .dark .footer-link {
          color: #9ca3af;
        }
        
        .footer-link:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .footer-link:hover:before {
          left: 100%;
        }
        
        .footer-link:hover {
          color: #6366f1;
          transform: translateX(8px);
        }
        
        .dark .footer-link:hover {
          color: #a78bfa;
        }

        .footer-divider {
          border-color: rgba(99, 102, 241, 0.2);
          margin-top: 2rem;
          padding-top: 2rem;
        }
        
        .dark .footer-divider {
          border-color: rgba(139, 92, 246, 0.3);
        }

        .footer-copyright {
          text-align: center;
          animation: slideUp 0.8s ease-out 0.6s both;
        }
        
        .copyright-text {
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.3s ease;
        }
        
        .dark .copyright-text {
          color: #9ca3af;
        }
        
        .copyright-text:hover {
          color: #6366f1;
        }
        
        .dark .copyright-text:hover {
          color: #a78bfa;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .footer-brand-text {
            font-size: 1rem;
          }
          
          .footer-logo-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .footer-logo-icon .lucide {
            width: 0.875rem;
            height: 0.875rem;
          }
          
          .contact-item,
          .footer-link {
            font-size: 0.8rem;
          }
          
          .footer-heading {
            font-size: 0.8rem;
          }
        }

        /* Enhanced visibility for both themes */
        .text-visible {
          color: #374151;
        }
        
        .dark .text-visible {
          color: #e5e7eb;
        }
        
        .text-muted {
          color: #6b7280;
        }
        
        .dark .text-muted {
          color: #9ca3af;
        }

        .premium-footer .footer-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 3rem;
          position: relative;
          z-index: 1;
        }
        
        @media (min-width: 640px) {
          .premium-footer .footer-container {
            padding: 3rem 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .premium-footer .footer-container {
            padding: 3rem 2rem;
          }
        }
      `}</style>

      <footer className="premium-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <a href="/" className="flex items-center space-x-3 group">
                <div className="glass-icon-container p-2 rounded-full group-hover:scale-110 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      <img src="/logo.png" alt="logo" width={100} height={30} />
                    </span>
                  </div>
                </div>
                <span className="premium-gradient-text">NRolEHub</span>
              </a>
              <p className="footer-description">
                Connecting campus events with students through innovation
              </p>
              <p className="footer-description">and excellence</p>
            </div>

            <div className="footer-section">
              <h3 className="footer-heading">Contact</h3>
              <ul className="space-y-1">
                <li className="contact-item">
                  <Mail className="contact-icon" />
                  <span>support@nrolehub.com</span>
                </li>
                <li className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-heading">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-divider border-t">
            <div className="footer-copyright">
              <p className="copyright-text">
                © {new Date().getFullYear()} NRolEHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
