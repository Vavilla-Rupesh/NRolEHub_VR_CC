import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  Download,
  CheckCircle,
  UserPlus,
  Calendar,
  Target,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRegistration } from "../../../lib/hooks/useRegistration";
import { formatCurrency } from "../../../lib/utils";
import TeamRegistration from "./TeamRegistration";
import api from "../../../lib/api";
import toast from "react-hot-toast";

function SubEventCard({ subevent, eventId, onUpdate }) {
  const { user } = useAuth();
  const { handleRegistration, registering, isRegistered, loading } =
    useRegistration(eventId, subevent.id);
  const [downloading, setDownloading] = useState(false);
  const [showTeamRegistration, setShowTeamRegistration] = useState(false);
  const [myTeam, setMyTeam] = useState(null);

  useEffect(() => {
    if (subevent.is_team_event && isRegistered) {
      checkTeamStatus();
    }
  }, [isRegistered, eventId, subevent.id]);

  const checkTeamStatus = async () => {
    try {
      const response = await api.get(
        `/teams/my-team/${eventId}/${subevent.id}`
      );
      setMyTeam(response.data);
    } catch (error) {
      console.error("Failed to fetch team status:", error);
    }
  };

  const handleRegister = () => {
    const isFree = subevent.is_free || subevent.fee === 0;
    handleRegistration(
      {
        student_id: user.id,
        student_name: user.username,
        student_email: user.email,
        event_id: eventId,
        subevent_id: subevent.id,
        event_name: subevent.title,
        fee: subevent.fee,
      },
      onUpdate,
      isFree
    );
  };

  const handleTeamAction = () => {
    if (!isRegistered) {
      toast.error("Please register and complete payment first");
      return;
    }
    setShowTeamRegistration(true);
  };

  const handleDownloadResources = async () => {
    if (downloading) return;

    try {
      setDownloading(true);
      const response = await api.get(`/subevents/${subevent.id}/resources`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${subevent.title}_resources.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Resources downloaded successfully");
    } catch (error) {
      toast.error("Failed to download resources");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-pulse"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:rotate-[0.5deg]">
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse"></div>
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50"></div>

        <div className="relative p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <div className="flex items-start space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight">
                    {subevent.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">
                    {subevent.description}
                  </p>
                </div>
              </div>

              {/* Team Event Badge */}
              {subevent.is_team_event && (
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 via-blue-50 to-purple-50 text-blue-800 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-purple-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Users className="h-4 w-4 mr-2 animate-pulse" />
                  Team Event ({subevent.min_team_size} -{" "}
                  {subevent.max_team_size} members)
                </div>
              )}

              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-300">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Participants
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {subevent.participants_count || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-300">
                  <div
                    className={`p-2 rounded-lg shadow-sm ${
                      subevent.is_free
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gradient-to-br from-orange-500 to-red-600"
                    }`}
                  >
                    <IndianRupee className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Fee
                    </p>
                    {subevent.is_free ? (
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        FREE
                      </p>
                    ) : (
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(subevent.fee)}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          + tax
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isRegistered ? (
              <>
                <button
                  className="flex-1 sm:flex-grow-[5] flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-default"
                  disabled
                >
                  <CheckCircle className="h-5 w-5 mr-2 animate-bounce" />
                  Registered Successfully
                </button>
                {subevent.is_team_event && (
                  <button
                    onClick={handleTeamAction}
                    className="flex-1 sm:flex-grow-[5] flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    {myTeam ? "View Team" : "Join/Create Team"}
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="flex-1 sm:flex-grow-[5] flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed"
              >
                {registering ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Register Now"
                )}
              </button>
            )}

            {subevent.has_resources && (
              <button
                onClick={handleDownloadResources}
                disabled={downloading}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/30 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Guidelines</span>
                    <span className="sm:hidden">Info</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>
      </div>

      {/* Team Registration Modal Placeholder */}
      {showTeamRegistration && (
        <TeamRegistration
          isOpen={showTeamRegistration}
          onClose={() => setShowTeamRegistration(false)}
          eventId={eventId}
          subEventId={subevent.id}
          minTeamSize={subevent.min_team_size}
          maxTeamSize={subevent.max_team_size}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

export default SubEventCard;
