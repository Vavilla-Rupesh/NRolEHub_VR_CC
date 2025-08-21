import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Info, 
  Calendar, 
  Target,
  Medal,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStudentPoints } from '../../../lib/hooks/useStudentPoints';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../shared/LoadingSpinner';

export default function PointsDisplay({ compact = false, showBreakdown = true }) {
  const { user } = useAuth();
  const { totalPoints, detailedBreakdown, loading, error } = useStudentPoints(user?.id);
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 dark:text-red-400">
        <p>Failed to load points data</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-indigo-100 uppercase tracking-wide">Total Points</p>
          <p className="text-2xl font-bold text-white">{totalPoints}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Points Card */}
      <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 rounded-3xl"></div>

        {/* Decorative elements */}
        <div className="absolute top-6 right-6">
          <Star className="h-6 w-6 text-yellow-500 animate-spin-slow" />
        </div>
        <div className="absolute top-12 left-6">
          <Star className="h-4 w-4 text-orange-500 animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-12 right-8">
          <Star className="h-3 w-3 text-red-500 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative p-8 text-center">
          {/* Award Icon */}
          <div className="mb-8">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-5 shadow-xl hover:scale-110 transition-transform duration-300">
                <Award className="h-14 w-14 text-white animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Total Points
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Based on event duration rules
            </p>
          </div>

          {/* Points Display */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative">
              <p className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                {totalPoints}
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Points Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/30">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Calculation Method
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Points calculated using event duration rules: max 2 sub-events per day
              </p>
            </div>

            <div className="space-y-3">
              <div className="group/item flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-700/30 hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <Medal className="h-5 w-5 text-yellow-600 dark:text-yellow-400 group-hover/item:rotate-12 transition-transform duration-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Merit/Winning
                  </span>
                </div>
                <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-bold">
                  3 pts
                </span>
              </div>

              <div className="group/item flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/30 hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Participation
                  </span>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-700 dark:text-blue-300 text-sm font-bold">
                  2 pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showBreakdown && detailedBreakdown.length > 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Points Breakdown
                </h3>
              </div>
              {showDetails ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {showDetails && (
            <div className="p-6 space-y-6">
              {detailedBreakdown.map((event, index) => (
                <div
                  key={event.eventId}
                  className="group relative p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/30 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          {event.eventName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.duration} day{event.duration > 1 ? 's' : ''} • 
                          Max {event.maxSubEventsConsidered} sub-events considered
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {event.points}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
                    </div>
                  </div>

                  {/* Sub-events */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Counted Sub-Events:
                    </h5>
                    {event.subEvents.map((subEvent, subIndex) => (
                      <div
                        key={subEvent.subEventId}
                        className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/30 dark:border-gray-600/30"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            subEvent.rank ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {subEvent.subEventTitle}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            subEvent.rank 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {subEvent.type}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          +{subEvent.points} pts
                        </span>
                      </div>
                    ))}

                    {event.excludedSubEvents.length > 0 && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50">
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                          ⚠️ {event.excludedSubEvents.length} sub-event(s) excluded due to duration limit
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Calculation Rules */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Calculation Rules
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Maximum 2 sub-events per day are considered for points</li>
                  <li>• Merit/Winning performance: 3 points</li>
                  <li>• Participation (attended): 2 points</li>
                  <li>• Only top-scoring sub-events within the limit are counted</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}