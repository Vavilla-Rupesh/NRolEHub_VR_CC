import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, Clock, Shield, TrendingUp, Eye } from 'lucide-react';
import api from '../../lib/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeStudents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    pendingAdmins: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events data
        const eventsResponse = await api.get('/events');
        const events = eventsResponse.data.rows || [];
        
        // Fetch registrations
        const registrationsResponse = await api.get('/admin/events/1/registrations');
        const registrations = registrationsResponse.data || [];

        // Calculate stats
        const now = new Date();
        const activeEvents = events.filter(event => new Date(event.end_date) >= now);
        const uniqueStudents = new Set(registrations.map(reg => reg.student_id));

        setStats({
          totalEvents: events.length,
          activeStudents: uniqueStudents.size,
          upcomingEvents: activeEvents.length,
          totalRegistrations: registrations.length,
          pendingAdmins: 0
        });

        // Fetch pending admins count for super admins
        if (user?.role === 'super_admin') {
          try {
            const pendingResponse = await api.get('/auth/pending-admins');
            setStats(prev => ({
              ...prev,
              pendingAdmins: pendingResponse.data.length
            }));
          } catch (error) {
            console.error('Failed to fetch pending admins:', error);
          }
        }

        // Get recent events
        const sortedEvents = events
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentEvents(sortedEvents);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'from-violet-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20',
      iconColor: 'text-violet-600 dark:text-violet-400'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents,
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Clock,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: BarChart3,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  Welcome back, {user?.username || 'Admin'}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Here's what's happening with your events today
                </p>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Dashboard Overview</span>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-6 -mb-6 h-24 w-24 rounded-full bg-white/5 animate-bounce"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, index) => (
            <div
              key={card.title}
              className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-700"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10 flex items-center space-x-4">
                <div className={`p-3 sm:p-4 ${card.bgColor} rounded-xl sm:rounded-2xl shadow-inner transform group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${card.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300"></div>
            </div>
          ))}

          {/* Super Admin Card */}
          {user?.role === 'super_admin' && (
            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-amber-200 dark:border-amber-700/50">
              <div className="flex items-center space-x-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl sm:rounded-2xl shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 truncate">
                    Pending Admins
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                    {stats.pendingAdmins}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Events Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span>Recent Events</span>
              </h2>
              <Link 
                to="/admin/events" 
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>View all events</span>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Pending Admins Alert */}
            {user?.role === 'super_admin' && stats.pendingAdmins > 0 && (
              <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg animate-pulse">
                      <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200">
                        Action Required
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {stats.pendingAdmins} admin request{stats.pendingAdmins !== 1 ? 's' : ''} awaiting approval
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/admin/pending-admins"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Review Requests
                  </Link>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No recent events found</p>
                </div>
              ) : (
                recentEvents.map((event, index) => (
                  <Link 
                    key={event.id}
                    to={`/admin/events/${event.id}`}
                    className="group block p-4 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-600 dark:hover:to-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInLeft 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                            {event.event_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(event.start_date)}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                          {event.venue}
                        </span>
                      </div>
                      <div className="sm:hidden text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-20">
                          {event.venue}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
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

export default AdminHome;