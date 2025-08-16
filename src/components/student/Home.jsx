import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Award, TrendingUp, Clock, Users, Star, Trophy, Zap, Eye } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/api";
import { formatDate } from "../../lib/utils";
import LoadingSpinner from "../shared/LoadingSpinner";
import toast from "react-hot-toast";

function StudentHome() {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsByDate, setPointsByDate] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const registrationsResponse = await api.get(
        "/registrations/my-registrations"
      );
      const registrations = registrationsResponse.data.filter(
        (reg) => reg.payment_status === "paid"
      );

      const leaderboardPromises = registrations.map((reg) =>
        api
          .get(`/leaderboard/${reg.event_id}`, {
            params: { subevent_id: reg.subevent_id },
          })
          .catch(() => ({ data: [] }))
      );
      const leaderboardResponses = await Promise.all(leaderboardPromises);

      const winnersMap = new Map();
      leaderboardResponses.forEach((response, index) => {
        const reg = registrations[index];
        const winners = response.data;
        const eventKey = `${reg.event_id}-${reg.subevent_id}`;
        const userRank = winners.find((w) => w.student_id === user.id)?.rank;
        if (userRank) {
          winnersMap.set(eventKey, userRank);
        }
      });

      const enhancedRegistrations = registrations.map((reg) => {
        const eventKey = `${reg.event_id}-${reg.subevent_id}`;
        const rank = winnersMap.get(eventKey);
        return { ...reg, rank };
      });

      const { total, pointsByDate } = calculatePointsByDate(
        enhancedRegistrations
      );
      setTotalPoints(total);
      setPointsByDate(pointsByDate);
      setRegisteredEvents(enhancedRegistrations);

      const eventsResponse = await api.get("/events");
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcoming = eventsResponse.data.rows
        .filter((event) => new Date(event.start_date) >= now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 5);

      const available = eventsResponse.data.rows
        .filter(
          (event) =>
            new Date(event.start_date) <= now &&
            new Date(event.end_date) >= now
        )
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 5);

      setUpcomingEvents(upcoming);
      setAvailableEvents(available);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculatePointsByDate = (registrations) => {
    const eventsByDate = registrations.reduce((acc, reg) => {
      const date = new Date(reg.registration_date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reg);
      return acc;
    }, {});

    let totalPoints = 0;
    const pointsByDate = {};

    Object.entries(eventsByDate).forEach(([date, regs]) => {
      const eventPoints = regs.map((reg) => ({
        ...reg,
        points: reg.rank ? 3 : reg.attendance ? 2 : 0,
        type: reg.rank
          ? `${reg.rank}${getRankSuffix(reg.rank)} Place`
          : reg.attendance
          ? "Participation"
          : "Registered",
      }));

      const topEvents = eventPoints
        .sort((a, b) => b.points - a.points)
        .slice(0, 2);

      const datePoints = topEvents.reduce(
        (sum, event) => sum + event.points,
        0
      );
      totalPoints += datePoints;

      pointsByDate[date] = {
        events: topEvents,
        totalPoints: datePoints,
      };
    });

    return { total: totalPoints, pointsByDate };
  };

  const getRankSuffix = (rank) => {
    if (!rank) return "";
    if (rank >= 11 && rank <= 13) return "th";
    const lastDigit = rank % 10;
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    {
      title: 'Total Points',
      value: totalPoints,
      icon: Trophy,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Events Registered',
      value: registeredEvents.length,
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Clock,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Available Now',
      value: availableEvents.length,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Welcome Header with Points */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl animate-gradient">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  Welcome back, {user?.username}!
                </h1>
                <div className="flex items-center space-x-4 text-indigo-100">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {registeredEvents.length} Events Registered
                    </span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-indigo-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Student Dashboard</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-indigo-100 uppercase tracking-wide">Total Points</p>
                  <p className="text-2xl font-bold">{totalPoints}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-4 -mb-4 h-20 w-20 rounded-full bg-white/5 animate-bounce"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-700"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 ${stat.bgColor} rounded-xl mb-3 transform group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Available Events */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Zap className="h-6 w-6 text-emerald-600" />
                <span>Available Events</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 animate-pulse">
                  Live Now
                </span>
              </h2>
            </div>
          </div>

          <div className="p-6">
            {availableEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative">
                  <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <div className="absolute inset-0 animate-ping">
                    <Calendar className="h-16 w-16 text-emerald-400 mx-auto opacity-20" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No events available right now</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back later for new opportunities!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableEvents.map((event, index) => (
                  <Link
                    key={event.id}
                    to={`/student/events/${event.id}`}
                    className="group block relative overflow-hidden bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-slate-700 dark:via-slate-700 dark:to-slate-600 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-emerald-100 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-teal-400"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInLeft 0.6s ease-out forwards'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                          <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 truncate">
                          {event.event_name}
                        </h3>
                        {event.subevent_title && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                            {event.subevent_title}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-200 shadow-md">
                          Join Now
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <span>Upcoming Events</span>
              </h2>
              <Link 
                to="/student/events" 
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>View all events</span>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative">
                  <Clock className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <div className="absolute inset-0 animate-spin">
                    <Clock className="h-16 w-16 text-blue-400 mx-auto opacity-20" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No upcoming events</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">New events will appear here soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <Link
                    key={event.id}
                    to={`/student/events/${event.id}`}
                    className="group block relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-slate-700 dark:via-slate-700 dark:to-slate-600 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-blue-100 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInRight 0.6s ease-out forwards'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                          {event.event_name}
                        </h3>
                        {event.subevent_title && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                            {event.subevent_title}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-2">
                          <Star className="h-4 w-4" />
                          <span>{formatDate(event.start_date)}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-200 shadow-md">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentHome;