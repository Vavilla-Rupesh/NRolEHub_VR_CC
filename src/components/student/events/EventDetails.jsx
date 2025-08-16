import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Tag, Download, X } from "lucide-react";
import api from "../../../lib/api";
import SubEventList from "./SubEventList";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { formatDate } from "../../../lib/utils";
import toast from "react-hot-toast";

function EventImage({ event }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <>
      {/* Main Event Image Display */}
      {event?.event_image && (
        <div className="relative group h-[57vh] overflow-hidden rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
          <img
            src={event.event_image}
            alt={event.event_name}
            className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110 cursor-pointer relative z-10"
            onClick={() => setIsPopupOpen(true)}
          />

          <div className="absolute inset-0 flex items-end justify-center pb-4 z-20 transition-all duration-300 pointer-events-none">
            <p className="text-white font-semibold text-lg drop-shadow-lg">
              Click to view full image
            </p>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={event.event_image}
              alt={event.event_name}
              className="w-full h-auto max-h-[80vh] object-cover rounded-2xl"
            />
            <div className="absolute top-4 right-4 flex space-x-3">
              <a
                href={event.event_image}
                download={event.event_name}
                className="group p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl shadow-lg"
              >
                <Download className="h-6 w-6 group-hover:animate-bounce" />
              </a>
              <button
                className="group p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl shadow-lg"
                onClick={() => setIsPopupOpen(false)}
              >
                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [subevents, setSubevents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const [eventResponse, subeventsResponse] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/subevents/${id}`),
      ]);
      setEvent(eventResponse.data);
      setSubevents(subeventsResponse.data.subevents || []);
    } catch (error) {
      toast.error("Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Event Image */}
        <div className="flex-1">
          <EventImage event={event} />
        </div>

        {/* Event Details Card */}
        <div className="flex-1 relative group rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="relative h-[57vh] flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500">
            {/* Header with Gradient */}
            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
              <div className="relative flex flex-col items-center text-center">
                {/* Centered Event Name */}
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 drop-shadow-sm leading-tight w-full animate-in slide-in-from-left duration-700">
                  {event?.event_name}
                </h1>

                {/* IQAC and Category in a Row */}
                <div className="flex flex-row justify-between gap-4 w-full mt-2">
                  <span className="w-1/2 inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                    <Tag className="h-4 w-4 mr-2" />
                    {event?.nature_of_activity}
                  </span>
                  <span className="w-1/2 inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                    IQAC: {event?.iqac_reference}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-2.5">
              {/* Description */}
              <div className="animate-in slide-in-from-bottom duration-500">
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                  {event?.description}
                </p>
              </div>

              {/* Start & End Dates */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                {/* Start Date */}
                <div className="group flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] w-full md:w-1/2">
                  <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30 transition-colors duration-300">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">
                    Starts: {formatDate(event?.start_date)}
                  </span>
                </div>

                {/* End Date */}
                <div className="group flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] w-full md:w-1/2">
                  <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">
                    Ends: {formatDate(event?.end_date)}
                  </span>
                </div>
              </div>

              {/* Venue & Eligibility (Side by Side) */}
              {/* Venue (Own Row) */}
              <div className="w-full animate-in slide-in-from-bottom duration-700">
                <div className="group flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {event?.venue}
                  </span>
                </div>
              </div>

              {/* Eligibility Criteria (Own Row, No Wrapping) */}
              {/* Eligibility (One Row) */}
              <div className="w-full animate-in slide-in-from-bottom duration-700">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-t-4 dark:border-amber-500 border border-amber-200 dark:border-amber-700/50 overflow-x-auto">
                  {/* Icon and Label */}
                  <div className="flex items-center flex-shrink-0">
                    <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-xl mr-2">
                      <Tag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-base font-bold text-amber-900 dark:text-amber-100">
                      Eligibility:
                    </span>
                  </div>

                  {/* Value (No Wrapping) */}
                  <p className="text-amber-800 dark:text-amber-200 text-sm whitespace-nowrap overflow-x-auto">
                    {event?.eligibility_criteria}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Events Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Sub Events
          </h2>
        </div>
        <SubEventList
          subevents={subevents}
          eventId={id}
          onUpdate={fetchEventDetails}
        />
      </div>
    </div>
  );
}

export default EventDetails;
