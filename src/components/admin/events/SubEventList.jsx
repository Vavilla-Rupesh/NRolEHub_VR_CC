import React from "react";
import { Link } from "react-router-dom";
import { Award, Users, FileCheck, Download } from "lucide-react";
import EmptyState from "../../shared/EmptyState";
import { toast } from "react-hot-toast";
import api from "../../../lib/api";

function SubEventList({ subevents, eventId }) {
  const handleExportRegistrations = async () => {
    try {
      const response = await api.get(
        `/admin/events/${eventId}/export-registrations`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `event_${eventId}_registrations.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Registrations exported successfully");
    } catch (error) {
      toast.error("Failed to export registrations");
    }
  };

  if (!eventId) {
    return (
      <EmptyState
        title="Invalid Event"
        message="Event ID is missing or invalid"
        icon={Users}
      />
    );
  }

  if (!subevents?.length) {
    return (
      <EmptyState
        title="No Sub-events"
        message="No sub-events available for this event"
        icon={Users}
      />
    );
  }

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-12">
          {/* Main Content Only */}
          <div className="relative backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 shadow-2xl p-8 overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Sub Events
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  Manage and oversee all sub-events
                </p>
              </div>

              <button
                onClick={handleExportRegistrations}
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <Download className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" />
                  <span>Export Registrations</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sub Events Grid */}
        <div className="grid gap-8 auto-rows-max">
          {subevents.map((subevent, index) => (
            <div
              key={subevent.id}
              className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out forwards`,
              }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating Orbs */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150"></div>

              <div className="relative z-10 p-8">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {subevent.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-3xl">
                      {subevent.description}
                    </p>

                    {subevent.is_team_event && (
                      <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                        <Users className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-800 dark:text-blue-300 font-semibold">
                          Team Event ({subevent.min_team_size}-
                          {subevent.max_team_size} members)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-75 animate-pulse"></div>
                    <div className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xl shadow-xl">
                      {subevent.is_free ? "🎉 FREE" : `₹${subevent.fee}`}
                    </div>
                  </div>
                </div>

                {subevent.id && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to={`/admin/events/${eventId}/subevents/${subevent.id}/${
                        subevent.is_team_event
                          ? "team-attendance"
                          : "attendance"
                      }`}
                      className="group/btn relative overflow-hidden px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-3">
                        <Users className="h-5 w-5 transform group-hover/btn:rotate-12 transition-transform duration-300" />
                        <span className="text-center">
                          {subevent.is_team_event
                            ? "Team Attendance"
                            : "Manage Attendance"}
                        </span>
                      </div>
                    </Link>

                    <Link
                      to={`/admin/events/${eventId}/subevents/${subevent.id}/${
                        subevent.is_team_event
                          ? "team-leaderboard"
                          : "leaderboard"
                      }`}
                      className="group/btn relative overflow-hidden px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-3">
                        <Award className="h-5 w-5 transform group-hover/btn:rotate-12 transition-transform duration-300" />
                        <span className="text-center">
                          {subevent.is_team_event
                            ? "Team Leaderboard"
                            : "Manage Leaderboard"}
                        </span>
                      </div>
                    </Link>

                    <Link
                      to={`/admin/events/${eventId}/subevents/${subevent.id}/${
                        subevent.is_team_event
                          ? "team-certificates"
                          : "certificates"
                      }`}
                      className="group/btn relative overflow-hidden px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-3">
                        <FileCheck className="h-5 w-5 transform group-hover/btn:rotate-12 transition-transform duration-300" />
                        <span className="text-center">
                          {subevent.is_team_event
                            ? "Team Certificates"
                            : "Manage Certificates"}
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

export default SubEventList;
