import React, { useEffect, useState, useMemo } from "react";
import {
  GraduationCap,
  Book,
  Users,
  Award,
  ArrowRight,
  FileCheck,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function PremiumLandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div
      className="min-h-screen 
      bg-gradient-to-br from-slate-100 via-blue-100 to-slate-50 
      dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 
      relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-60 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Hackademia Particles */}
        <div className="absolute inset-0">
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
              <span className="block text-sm font-extrabold animate-pulse">
                N
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Premium Banner Section */}
      <div className="relative z-10">
        <div className="w-full overflow-hidden">
          <div
            className="relative h-80"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
            }}
          >
            {/* Soft fade overlay that blends into background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                backdropFilter: "blur(12px)",
              }}
            ></div>

            {/* Pattern Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                opacity: 0.3,
              }}
            ></div>

            {/* Banner Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                NARAYANA
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Engineering College
              </h2>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl font-light">
                Pioneering excellence in engineering education since 2001
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-cyan-400 mt-6">
                NRolEHub
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Hero Statistics Bar */}
            <div className="mb-20">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    {
                      value: "5000+",
                      label: "Students",
                      color: "from-blue-400 to-cyan-400",
                    },
                    {
                      value: "200+",
                      label: "Faculty",
                      color: "from-purple-400 to-pink-400",
                    },
                    {
                      value: "95%",
                      label: "Placement Rate",
                      color: "from-emerald-400 to-teal-400",
                    },
                    {
                      value: "50+",
                      label: "Events/Year",
                      color: "from-orange-400 to-red-400",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center group cursor-pointer"
                    >
                      <div
                        className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {stat.value}
                      </div>
                      <p className="text-slate-800 dark:text-white/80 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: Users,
                  title: "NRolEHub",
                  description:
                    "Your comprehensive platform for managing and participating in campus events with real-time updates",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Book,
                  title: "Academic Excellence",
                  description:
                    "NAAC 'A' Grade accredited institution delivering world-class education with cutting-edge facilities",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: Award,
                  title: "Student Achievements",
                  description:
                    "Celebrating outstanding performance in academics, sports, and extracurricular excellence",
                  gradient: "from-emerald-500 to-teal-500",
                },
                {
                  icon: FileCheck,
                  title: "Certificate Verification",
                  description:
                    "Instantly verify student certificates and participation records",
                  gradient: "from-orange-500 to-red-500",
                  hasLink: true,
                },
                {
                  icon: Sparkles,
                  title: "Hackademia 2K24",
                  description:
                    "Join the ultimate tech fest with workshops, coding battles, and innovative challenges!",
                  gradient: "from-pink-500 to-purple-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 shadow-2xl hover:shadow-blue-500/10"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                      <div
                        className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    {feature.hasLink && (
                      <a href="/verify-certificate">
                        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group-hover:transform group-hover:scale-105">
                          Verify Now
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
                <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-400 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Ready to Shape Your Future?
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of successful engineers who started their
                  journey at Narayana Engineering College
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://www.necn.ac.in/">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                      Explore Programs
                    </button>
                  </a>
                  <a href="https://www.necn.ac.in/ug-programmes.php">
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-slate-900 dark:text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                      Contact Admissions
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
