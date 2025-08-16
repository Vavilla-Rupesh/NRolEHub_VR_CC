import React, { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import api from "../../../lib/api";
import EventList from "./EventList";
import CreateEventModal from "./CreateEventModal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      // Show all events for admins, not just their own
      setEvents(response.data.rows);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="group">
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center transform transition-all duration-500 hover:scale-105">
            <Calendar className="h-8 w-8 lg:h-10 lg:w-10 mr-3 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            Event Management
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
        <div className="group">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-sm px-4 py-2 font-semibold rounded-md border-2 border-blue-500 text-blue-500 bg-white dark:bg-gray-900 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2 text-blue-500 group-hover:text-white transition-colors duration-300" />
            Create Event
          </button>

          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </div>

      <EventList events={events} onEventUpdate={fetchEvents} />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={fetchEvents}
      />
    </div>
  );
}
export default EventManagement;
