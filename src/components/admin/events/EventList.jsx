import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Search } from "lucide-react";
import { formatDate } from "../../../lib/utils";

function EventList({ events }) {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    const eventDate = new Date(date);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return (
      eventDate.getDate() === tomorrow.getDate() &&
      eventDate.getMonth() === tomorrow.getMonth() &&
      eventDate.getFullYear() === tomorrow.getFullYear()
    );
  };

  const isPast = (endDate) => {
    const now = new Date();
    return new Date(endDate) < now;
  };

  // 🔍 Filter by search term (name or venue)
  const filteredEvents = events.filter(
    (event) =>
      event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate upcoming and past events
  const upcomingEvents = filteredEvents.filter(
    (event) => !isPast(event.end_date)
  );
  const pastEvents = filteredEvents.filter((event) => isPast(event.end_date));

  // Sort upcoming events: today first, then tomorrow, then others
  const sortedUpcomingEvents = upcomingEvents.sort((a, b) => {
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

  return (
    <div className="space-y-8">
      {/* 🔍 Search Bar */}
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
      {/* Upcoming Events Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
          </div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedUpcomingEvents.map((event, index) => (
            <Link
              key={event.id}
              to={`/admin/events/${event.id}`}
              className="group relative block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Outer glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-lg group-hover:blur-xl"></div>

              {/* Main card */}
              <div
                className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100 dark:border-gray-800 ${
                  isToday(event.start_date)
                    ? "ring-2 ring-orange-400 shadow-orange-200/50 dark:shadow-orange-900/50"
                    : ""
                }`}
              >
                {/* Banner with event image + hover zoom */}
                <div className="relative h-32 overflow-hidden rounded-t-2xl group-hover:cursor-pointer">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out transform group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${
                        event.event_image || "/default-banner.jpg"
                      })`,
                    }}
                  ></div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/40 via-purple-600/30 to-indigo-700/40 transition-transform duration-500 ease-in-out group-hover:scale-110"></div>

                  {/* Animated particles */}
                  <div className="absolute top-3 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                  <div className="absolute top-6 right-6 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>

                  {/* TODAY / TOMORROW badge */}
                  {isToday(event.start_date) && (
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur animate-pulse"></div>
                        <span className="relative px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-lg border border-orange-300">
                          🔥 TODAY
                        </span>
                      </div>
                    </div>
                  )}
                  {isTomorrow(event.start_date) &&
                    !isToday(event.start_date) && (
                      <div className="absolute top-4 right-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400 rounded-full blur animate-pulse"></div>
                          <span className="relative px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg border border-yellow-300">
                            🔜 TOMORROW
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Floating icon */}
                  <div className="absolute bottom-4 left-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Event title */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                      {event.event_name}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full group-hover:w-20 transition-all duration-500"></div>
                  </div>

                  {/* Event details */}
                  <div className="space-y-4">
                    {/* Start date */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30 group-hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        {formatDate(event.start_date)}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30 group-hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300 truncate">
                        {event.venue}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30 group-hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-violet-800 dark:text-violet-300 truncate">
                        {formatDate(event.start_date)} -{" "}
                        {formatDate(event.end_date)}
                      </span>
                    </div>
                  </div>

                  {/* View details button */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Available
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        <span className="text-sm">View Details</span>
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-xs">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Show Past Events Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPastEvents(!showPastEvents)}
          className="group relative px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-2 h-2 bg-gray-400 group-hover:bg-white rounded-full transition-colors duration-300"></div>
            <span>
              {showPastEvents ? "🙈 Hide Past Events" : "👁️ Show Past Events"}
            </span>
            <div className="w-2 h-2 bg-gray-400 group-hover:bg-white rounded-full transition-colors duration-300"></div>
          </div>
        </button>
      </div>

      {/* Past Events Section */}
      {showPastEvents && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent">
                Past Events
              </h2>
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <Link
                key={event.id}
                to={`/admin/events/${event.id}`}
                className="group relative block opacity-80 hover:opacity-100 transition-opacity duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Main card with muted styling */}
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Banner for past events */}
                  <div
                    className="relative h-32 overflow-hidden rounded-t-2xl"
                    style={{
                      backgroundImage: `url(${
                        event.event_image || "/default-banner.jpg"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gray-600/40"></div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Event title */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {event.event_name}
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </div>

                    {/* Event details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {formatDate(event.start_date)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          {event.venue}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          {formatDate(event.start_date)} -{" "}
                          {formatDate(event.end_date)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 font-semibold group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                          <span className="text-sm">View Details</span>
                          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white text-xs">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventList;
