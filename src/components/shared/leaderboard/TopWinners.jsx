import React from "react";
import { Trophy, Crown, Medal, Award, Star, Sparkles } from "lucide-react";

export default function TopWinners({ winners }) {
  const getPosition = (index) => {
    switch (index) {
      case 0:
        return {
          text: "1st Place",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case 1:
        return {
          text: "2nd Place",
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
      case 2:
        return {
          text: "3rd Place",
          color: "bg-amber-100 text-amber-800 border-amber-200",
        };
      default:
        return {
          text: `${index + 1}th Place`,
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
    }
  };

  const getPositionIcon = (index) => {
    const base = "h-8 w-8";
    switch (index) {
      case 0:
        return <Crown className={`${base} text-white dark:text-yellow-400`} />;
      case 1:
        return <Medal className={`${base} text-gray-500 dark:text-gray-300`} />;
      case 2:
        return (
          <Award className={`${base} text-amber-600 dark:text-amber-400`} />
        );
      default:
        return <Star className={`${base} text-blue-500 dark:text-blue-400`} />;
    }
  };

  const getGradientClasses = (index) => {
    switch (index) {
      case 0:
        return {
          card: "from-yellow-400/10 via-yellow-500/5 to-amber-500/10",
          border: "border-yellow-400/40",
          glow: "shadow-yellow-500/20",
          iconBg: "from-yellow-400 via-yellow-500 to-amber-500",
          accent: "from-yellow-400 to-amber-500",
        };
      case 1:
        return {
          card: "from-slate-400/10 via-gray-300/5 to-slate-500/10",
          border: "border-slate-400/40",
          glow: "shadow-slate-400/20",
          iconBg: "from-slate-300 via-slate-400 to-slate-500",
          accent: "from-slate-400 to-slate-500",
        };
      case 2:
        return {
          card: "from-amber-500/10 via-orange-400/5 to-amber-600/10",
          border: "border-amber-400/40",
          glow: "shadow-amber-500/20",
          iconBg: "from-amber-400 via-amber-500 to-orange-500",
          accent: "from-amber-400 to-orange-500",
        };
      default:
        return {
          card: "from-blue-500/10 via-blue-400/5 to-indigo-500/10",
          border: "border-blue-400/40",
          glow: "shadow-blue-500/20",
          iconBg: "from-blue-400 via-blue-500 to-indigo-500",
          accent: "from-blue-400 to-indigo-500",
        };
    }
  };

  return (
   <div className="relative min-h-screen from-gray-50 to-white dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative space-y-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Winners Podium
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-slate-300 font-medium">
            Celebrating our champions with style and grandeur
          </p>
        </div>

        {/* Winners grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner, index) => {
            const { text } = getPosition(index);
            const gradients = getGradientClasses(index);

            return (
              <div
                key={winner.id}
                className={`w-full group relative backdrop-blur-xl bg-gradient-to-r ${gradients.card} 
    border ${gradients.border} rounded-2xl p-6 flex flex-col items-center text-center
    shadow-xl hover:shadow-2xl ${gradients.glow}
    transform hover:scale-105 hover:-translate-y-1 
    transition-all duration-500 overflow-hidden`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: "fadeInUp 0.8s ease-out forwards",
                }}
              >
                {/* Rank badge */}
                {index < 3 && (
                  <div
                    className={`absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r ${gradients.iconBg} 
                    rounded-full flex items-center justify-center shadow-xl
                    animate-spin-slow border-2 border-white/20`}
                  >
                    <span className="text-white font-bold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                )}

                {/* Row 1 - Icon */}
                <div
                  className={`relative p-3 bg-gradient-to-r ${gradients.iconBg} rounded-xl shadow-xl mb-4`}
                >
                  {getPositionIcon(index)}
                </div>

                {/* Row 2 - Points */}
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  {winner.score}
                </div>
                <div
                  className={`text-sm font-semibold bg-gradient-to-r ${gradients.accent} bg-clip-text text-transparent mb-4`}
                >
                  points
                </div>

                {/* Row 3 - Name */}
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {winner.student_name}
                </p>

                {/* Row 4 - Email */}
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {winner.student_email || "Champion"}
                </p>

                {/* Glow effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradients.accent} 
                  opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-4 mt-10">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl animate-bounce shadow-2xl">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl animate-bounce delay-200 shadow-2xl">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl animate-bounce delay-400 shadow-2xl">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
