import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, Clock, Shield } from 'lucide-react';
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

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
              <p className="text-2xl font-bold">{stats.activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</p>
              <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</p>
              <p className="text-2xl font-bold">{stats.totalRegistrations}</p>
            </div>
          </div>
        </div>

        {user?.role === 'super_admin' && (
          <div className="glass-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Admins</p>
                <p className="text-2xl font-bold">{stats.pendingAdmins}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Events</h2>
          <Link to="/admin/events" className="text-primary hover:text-primary/80">
            View all
          </Link>
        </div>

        {user?.role === 'super_admin' && stats.pendingAdmins > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                  {stats.pendingAdmins} admin request(s) awaiting approval
                </span>
              </div>
              <Link
                to="/admin/pending-admins"
                className="btn btn-warning btn-sm"
              >
                Review Requests
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {recentEvents.map((event) => (
            <Link 
              key={event.id}
              to={`/admin/events/${event.id}`}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{event.event_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(event.start_date)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {event.venue}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;