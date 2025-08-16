import React, { useMemo } from "react";

const AnimatedBackgroundWrapper = ({ children }) => {
  const particles = useMemo(
    () =>
      [...Array(20)].map(() => ({
        id: crypto.randomUUID(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 2}s`,
      })),
    []
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-slate-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-60 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-4 h-4 text-blue-400 dark:text-cyan-400 animate-float"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              <span className="block text-sm font-extrabold animate-pulse">N</span>
            </div>
          ))}
        </div>
      </div>

      {/* Foreground App Content */}
      <div className="relative z-20">{children}</div>

      {/* Custom Animation */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackgroundWrapper;
