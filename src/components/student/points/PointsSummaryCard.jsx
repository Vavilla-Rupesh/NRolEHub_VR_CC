import React, { useState } from "react";
import { Trophy, TrendingUp, Eye, Calendar, Award, EyeOff } from "lucide-react";
import { useStudentPoints } from "../../../lib/hooks/useStudentPoints";
import { useAuth } from "../../../contexts/AuthContext";
import PointsBreakdownModal from "./PointsBreakdownModal";
import LoadingSpinner from "../../shared/LoadingSpinner";

export default function PointsSummaryCard({ className = "" }) {
  const { user } = useAuth();
  const pointsData = useStudentPoints(user?.id);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFullDiv, setShowFullDiv] = useState(true);
  if (pointsData.loading) {
    return (
      <div
        className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30 ${className}`}
      >
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (pointsData.error) {
    return (
      <div
        className={`bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-700/50 ${className}`}
      >
        <p className="text-red-600 dark:text-red-400 text-sm text-center">
          Failed to load points data
        </p>
      </div>
    );
  }

  const { totalPoints, detailedBreakdown } = pointsData;
  const totalEvents = detailedBreakdown?.length || 0;
  const totalMeritAchievements =
    detailedBreakdown?.reduce(
      (count, event) =>
        count + event.subEvents.filter((se) => se.rank && se.rank <= 3).length,
      0
    ) || 0;
  const toggleShowFullDiv = () => {
    setShowFullDiv(!showFullDiv);
  };
  return (
    <>
      <div
        className={`group relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${className}`}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
                  Achievement Points
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Duration-based calculation
                </p>
              </div>
            </div>
            <button
              onClick={toggleShowFullDiv}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showFullDiv ? (
                <EyeOff className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover/btn:scale-110 transition-transform duration-200" />
              ) : (
                <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover/btn:scale-110 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Points Display */}
          <div className={showFullDiv ? "block" : "hidden"}>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {totalPoints}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Total Points
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-lg mb-2 mx-auto">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {totalEvents}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Events
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg mb-2 mx-auto">
                  <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {totalMeritAchievements}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Merit
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-800/30 rounded-lg mb-2 mx-auto">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {Math.round(
                    (totalPoints / Math.max(totalEvents * 6, 1)) * 100
                  )}
                  %
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Efficiency
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setShowBreakdown(true)}
              className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <Eye className="h-4 w-4" />
              <span>View Detailed Breakdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown Modal */}
      <PointsBreakdownModal
        isOpen={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        pointsData={pointsData}
      />
    </>
  );
}
