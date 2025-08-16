import React, { useState, useEffect } from "react";
import { Search, Calendar, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../lib/api";
import EventCard from "./EventCard";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { cn } from "../../../lib/utils";
import toast from "react-hot-toast";

function EventRegistration() {
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      const allEvents = response.data.rows || [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const isToday = (date) => {
        const today = new Date();
        const eventDate = new Date(date);
        return (
          eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      };

      const isTomorrow = (date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const eventDate = new Date(date);
        return (
          eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear()
        );
      };

      const upcoming = allEvents
        .filter((event) => new Date(event.end_date) >= now)
        .sort((a, b) => {
          const aPriority = isToday(a.start_date)
            ? 0
            : isTomorrow(a.start_date)
            ? 1
            : 2;
          const bPriority = isToday(b.start_date)
            ? 0
            : isTomorrow(b.start_date)
            ? 1
            : 2;

          if (aPriority !== bPriority) return aPriority - bPriority;
          return new Date(a.start_date) - new Date(b.start_date);
        });

      const past = allEvents
        .filter((event) => new Date(event.end_date) < now)
        .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

      setEvents({ upcoming, past });
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredEvents = {
    upcoming: events.upcoming.filter((e) =>
      e.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    past: events.past.filter((e) =>
      e.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="group">
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center transform transition-all duration-500 hover:scale-105">
            <Calendar className="h-8 w-8 lg:h-10 lg:w-10 mr-3 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            Events
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Available & Upcoming Events
            </h2>
          </div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
        </div>

        {filteredEvents.upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.upcoming.map((event) => (
              <Link
                key={event.id}
                to={`/student/events/${event.id}`}
                className={cn(
                  "transform transition-all duration-300 hover:scale-105"
                )}
              >
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-300">
              No upcoming events available
            </p>
          </div>
        )}
      </div>

      {/* Show/Hide Past Events Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPast(!showPast)}
          className="group relative px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-2 h-2 bg-gray-400 group-hover:bg-white rounded-full transition-colors duration-300"></div>
            <span>
              {showPast ? "🙈 Hide Past Events" : "👁️ Show Past Events"}
            </span>
            <div className="w-2 h-2 bg-gray-400 group-hover:bg-white rounded-full transition-colors duration-300"></div>
          </div>
        </button>
      </div>

      {/* Past Events */}
      {showPast && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent">
              Past Events
            </h2>
          </div>
          {filteredEvents.past.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.past.map((event) => (
                <div
                  key={event.id}
                  className="relative opacity-75 cursor-not-allowed p-4 backdrop-blur-md rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center p-6">
                    <div className="text-white text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-medium">Event Ended</p>
                    </div>
                  </div>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-300">No past events</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EventRegistration;
