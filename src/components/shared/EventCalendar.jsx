import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import api from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, X, MapPin, Clock } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import "react-calendar/dist/Calendar.css";

function EventCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [popupDate, setPopupDate] = useState(null);
  const [popupEvents, setPopupEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await api.get("/events");
        setEvents(eventsResponse.data.rows);

        if (user) {
          const registrationsResponse = await api.get(
            "/registrations/my-registrations"
          );
          const paidRegistrations = registrationsResponse.data.filter(
            (reg) => reg.payment_status === "paid"
          );
          setRegistrations(paidRegistrations);
        }
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
        toast.error("Failed to load events");
      }
    };

    fetchData();
  }, [user]);

  // Organize events by date
  const eventsByDate = events.reduce((acc, event) => {
    const startDate = format(new Date(event.start_date), "yyyy-MM-dd");
    const endDate = format(new Date(event.end_date), "yyyy-MM-dd");

    // Add event to all dates between start and end
    for (
      let date = new Date(startDate);
      date <= new Date(endDate);
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = format(date, "yyyy-MM-dd");
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(event);
    }
    return acc;
  }, {});

  // Handle date click
  const handleDateClick = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const eventsOnDate = eventsByDate[formattedDate];
    
    if (eventsOnDate && eventsOnDate.length > 0) {
      setPopupDate(date);
      setPopupEvents(eventsOnDate);
      setShowPopup(true);
    }
    setSelectedDate(date);
  };

  // Tile Class Logic
  const tileClassName = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const eventsOnTile = eventsByDate[formattedDate];
    const isRegistered = registrations.some(
      (reg) =>
        eventsOnTile && eventsOnTile.some((event) => event.id === reg.event_id)
    );

    return cn(
      "calendar-tile relative overflow-visible transition-all duration-300 hover:scale-105 cursor-pointer",
      eventsOnTile && "has-event",
      isRegistered && "is-registered",
      formattedDate === format(new Date(), "yyyy-MM-dd") && "today-highlight"
    );
  };

  // Tile Content Logic
  const tileContent = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const eventsOnDate = eventsByDate[formattedDate];
    const isRegistered = registrations.some(
      (reg) =>
        eventsOnDate && eventsOnDate.some((event) => event.id === reg.event_id)
    );

    if (eventsOnDate && eventsOnDate.length > 0) {
      return (
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-1 pointer-events-none z-10">
          <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${
            isRegistered 
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse' 
              : 'bg-gradient-to-r from-violet-400 to-purple-600 animate-pulse'
          }`}>
          </div>
          {eventsOnDate.length > 1 && (
            <div className="text-[10px] font-bold text-white bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-4 h-4 flex items-center justify-center mt-0.5 shadow-lg">
              {eventsOnDate.length}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="p-4 md:p-8relative overflow-hidden min-h-screen">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <CalendarIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Event Calendar
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Discover and explore upcoming events
        </p>
      </div>

      {/* Calendar Container */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-slate-700/30">
          <Calendar
            value={selectedDate}
            onClickDay={handleDateClick}
            tileClassName={tileClassName}
            tileContent={tileContent}
            next2Label={
              <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200">
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
            }
            prev2Label={
              <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200">
                <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
            }
            showNeighboringMonth={false}
            className="w-full border-none bg-transparent custom-calendar"
            locale="en-US"
            maxDetail="month"
            minDetail="month"
            onChange={setSelectedDate}
          />
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20 dark:border-slate-700/30">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-400 to-purple-600 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Available Events</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/20 dark:border-slate-700/30">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Registered Events</span>
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-90 duration-300">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Events</h3>
                  <p className="text-indigo-100 text-sm">
                    {format(popupDate, "MMMM d, yyyy")}
                  </p>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {popupEvents.map((event, index) => {
                  const isRegistered = registrations.some(reg => reg.event_id === event.id);
                  return (
                    <div
                      key={event.id}
                      className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                          isRegistered 
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                            : 'bg-gradient-to-r from-violet-400 to-purple-600'
                        } animate-pulse`}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 break-words">
                            {event.event_name}
                          </h4>
                          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">
                                {format(new Date(event.start_date), "MMM d")} - {format(new Date(event.end_date), "MMM d, yyyy")}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                          {isRegistered && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Registered
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .custom-calendar {
          font-family: inherit;
          width: 100%;
        }
        
        .custom-calendar .react-calendar__viewContainer {
          width: 100%;
        }
        
        .custom-calendar .react-calendar__month-view {
          width: 100%;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          display: flex !important;
          width: 100%;
          gap: 3px;
        }
        
        .custom-calendar .react-calendar__month-view__days {
          display: flex !important;
          flex-wrap: wrap !important;
          width: 100%;
          gap: 3px;
        }
        
        .custom-calendar .react-calendar__tile {
          position: relative;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          color: #1f2937;
          border-radius: 16px;
          height: 70px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: visible;
          flex: 1 0 calc(14.28571% - 3px);
          max-width: calc(14.28571% - 3px);
          margin: 0;
        }

        .dark .custom-calendar .react-calendar__tile {
          background: rgba(30, 41, 59, 0.8);
          color: #f1f5f9;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .custom-calendar .react-calendar__tile:hover {
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
        }

        .dark .custom-calendar .react-calendar__tile:hover {
          background: rgba(79, 70, 229, 0.3);
          color: #a5b4fc;
        }
        
        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
          color: white !important;
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
          transform: translateY(-2px);
        }
        
        .custom-calendar .react-calendar__tile--now {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: white !important;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4) !important;
          transform: translateY(-2px);
        }

        .custom-calendar .react-calendar__tile.has-event {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15));
          border: 2px solid rgba(139, 92, 246, 0.3);
        }

        .dark .custom-calendar .react-calendar__tile.has-event {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.25));
          border: 2px solid rgba(139, 92, 246, 0.4);
        }

        .custom-calendar .react-calendar__tile.is-registered {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15));
          border: 2px solid rgba(34, 197, 94, 0.3);
        }

        .dark .custom-calendar .react-calendar__tile.is-registered {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.25));
          border: 2px solid rgba(34, 197, 94, 0.4);
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          font-weight: 700;
          font-size: 14px;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          padding: 0;
          width: 100%;
        }

        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 8px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 12px;
          text-align: center;
          flex: 1 0 calc(14.28571% - 3px);
          max-width: calc(14.28571% - 3px);
        }

        .dark .custom-calendar .react-calendar__month-view__weekdays {
          color: #9ca3af;
        }

        .dark .custom-calendar .react-calendar__month-view__weekdays__weekday {
          background: rgba(99, 102, 241, 0.2);
        }
        
        .custom-calendar .react-calendar__navigation {
          height: 60px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .custom-calendar .react-calendar__navigation button {
          background: rgba(255, 255, 255, 0.8);
          border: none;
          font-size: 18px;
          font-weight: 700;
          color: #374151;
          padding: 12px 20px;
          border-radius: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dark .custom-calendar .react-calendar__navigation button {
          background: rgba(30, 41, 59, 0.8);
          color: #d1d5db;
        }
        
        .custom-calendar .react-calendar__navigation button:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #4338ca, #6d28d9);
        }

        @media (max-width: 768px) {
          .custom-calendar .react-calendar__tile {
            height: 60px;
            font-size: 14px;
            padding: 6px;
          }
          
          .custom-calendar .react-calendar__navigation {
            height: 50px;
          }

          .custom-calendar .react-calendar__navigation button {
            padding: 8px 12px;
            font-size: 16px;
          }

          .custom-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 8px 4px;
            font-size: 12px;
          }
        }

        @media (max-width: 640px) {
          .custom-calendar .react-calendar__tile {
            height: 50px;
            font-size: 12px;
            padding: 4px;
          }

          .custom-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 6px 2px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default EventCalendar;