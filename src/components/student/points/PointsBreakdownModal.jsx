import React from 'react';
import Modal from '../../shared/Modal';
import { Calendar, Trophy, Target, Info, Award, Medal } from 'lucide-react';
import { PointsService } from '../../../lib/services/points.service';

export default function PointsBreakdownModal({ isOpen, onClose, pointsData }) {
  if (!pointsData || !pointsData.detailedBreakdown) {
    return null;
  }

  const { totalPoints, detailedBreakdown } = pointsData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Points Calculation Breakdown" size="lg">
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">
                  Total Achievement Points
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Calculated using event duration rules
                </p>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {totalPoints}
            </div>
          </div>
        </div>

        {/* Calculation Rules */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Info className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">
              Calculation Rules
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Medal className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Merit/Winning: 3 points
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Participation: 2 points
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Max 2 sub-events per day
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Top scoring sub-events only
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Event-wise Breakdown</span>
          </h3>

          {detailedBreakdown.map((event, index) => (
            <div
              key={event.eventId}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {event.eventName}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>Duration: {event.duration} day{event.duration > 1 ? 's' : ''}</span>
                    <span>Max considered: {event.maxSubEventsConsidered} sub-events</span>
                    <span>Registered: {event.totalSubEventsRegistered}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {event.points}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
                </div>
              </div>

              {/* Counted Sub-Events */}
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span>Counted Sub-Events:</span>
                </h5>
                {event.subEvents.map((subEvent, subIndex) => (
                  <div
                    key={subEvent.subEventId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
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

                {/* Excluded Sub-Events */}
                {event.excludedSubEvents.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50">
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-2">
                      ⚠️ Excluded from calculation (exceeded daily limit):
                    </p>
                    <div className="space-y-1">
                      {event.excludedSubEvents.map((excluded, exIndex) => (
                        <div key={exIndex} className="text-xs text-amber-600 dark:text-amber-400">
                          • {excluded.subevent_title || 'Sub Event'} 
                          {excluded.rank && ` (${excluded.rank}${PointsService.getRankSuffix(excluded.rank)} place)`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Points are calculated based on event duration to ensure fair scoring across different event types.
          </p>
        </div>
      </div>
    </Modal>
  );
}