import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import api from '../../../lib/api';
import SubEventList from './SubEventList';
import CreateSubEventModal from './subevents/CreateSubEventModal';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { formatDate } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [subevents, setSubevents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const [eventResponse, subeventsResponse] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/subevents/${id}`)
      ]);

      setEvent(eventResponse.data);
      setSubevents(subeventsResponse.data.subevents || []);
    } catch (error) {
      toast.error('Failed to fetch event details');
      if (error.response?.status === 403) {
        navigate('/admin/events');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {/* Premium Event Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 opacity-60 animate-pulse"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-600/20 rounded-full blur-2xl transform -translate-x-8 translate-y-8"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {event?.event_name}
            </h1>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <span className="relative px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                {event?.venue}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              {event?.description}
            </p>
            
            {/* Enhanced date/time grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg group-hover:shadow-emerald-500/25 transition-shadow duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(event?.start_date)}</p>
                </div>
              </div>
              
              <div className="group flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg group-hover:shadow-orange-500/25 transition-shadow duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">End Date</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(event?.end_date)}</p>
                </div>
              </div>
            </div>
            
            {/* Enhanced eligibility section */}
            <div className="border-t border-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent pt-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Eligibility Criteria
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed pl-5">
                {event?.eligibility_criteria}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Sub Events Header */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center space-x-4">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Sub Events
          </h2>
        </div>
        
        {/* Premium Create Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-lg">Create Sub-event</span>
          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
        </button>
      </div>

      {/* Keep existing components unchanged */}
      <SubEventList
        subevents={subevents}
        eventId={id}
        onUpdate={fetchEventDetails}
      />
      <CreateSubEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventId={id}
        onSubEventCreated={fetchEventDetails}
      />
    </div>
  );
}

export default EventDetails;