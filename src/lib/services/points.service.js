/**
 * Points calculation service based on event duration and sub-event performance
 */

import api from '../api';

export class PointsService {
  /**
   * Calculate points for a student based on event duration rules
   * @param {Array} registrations - Student's paid registrations
   * @returns {Object} - { totalPoints, pointsByEvent, detailedBreakdown }
   */
  static async calculateStudentPoints(registrations) {
    try {
      // Group registrations by event
      const eventGroups = this.groupRegistrationsByEvent(registrations);
      
      let totalPoints = 0;
      const pointsByEvent = {};
      const detailedBreakdown = [];

      // Process each event separately
      for (const [eventId, eventRegistrations] of Object.entries(eventGroups)) {
        const eventPoints = await this.calculateEventPoints(eventId, eventRegistrations);
        totalPoints += eventPoints.points;
        pointsByEvent[eventId] = eventPoints;
        detailedBreakdown.push(eventPoints);
      }

      return {
        totalPoints,
        pointsByEvent,
        detailedBreakdown
      };
    } catch (error) {
      console.error('Error calculating student points:', error);
      throw error;
    }
  }

  /**
   * Group registrations by event ID
   */
  static groupRegistrationsByEvent(registrations) {
    return registrations.reduce((groups, registration) => {
      const eventId = registration.event_id;
      if (!groups[eventId]) {
        groups[eventId] = [];
      }
      groups[eventId].push(registration);
      return groups;
    }, {});
  }

  /**
   * Calculate points for a specific event based on duration rules
   */
  static async calculateEventPoints(eventId, registrations) {
    try {
      // Get event details to determine duration
      const eventResponse = await api.get(`/events/${eventId}`);
      const event = eventResponse.data;
      
      // Calculate event duration in days
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      // Maximum sub-events to consider (2 per day)
      const maxSubEvents = durationInDays * 2;
      
      // Get leaderboard data for all registrations
      const registrationsWithRanks = await Promise.all(
        registrations.map(async (reg) => {
          try {
            const leaderboardResponse = await api.get(`/leaderboard/${reg.event_id}`, {
              params: { subevent_id: reg.subevent_id }
            });
            
            const userRank = leaderboardResponse.data.find(
              entry => entry.student_id === reg.student_id
            )?.rank;
            
            return {
              ...reg,
              rank: userRank,
              points: this.calculateSubEventPoints(userRank, reg.attendance)
            };
          } catch (error) {
            console.error(`Failed to get leaderboard for subevent ${reg.subevent_id}:`, error);
            return {
              ...reg,
              rank: null,
              points: this.calculateSubEventPoints(null, reg.attendance)
            };
          }
        })
      );

      // Sort by points (highest first) and take top sub-events based on duration
      const topSubEvents = registrationsWithRanks
        .sort((a, b) => b.points - a.points)
        .slice(0, maxSubEvents);

      // Calculate total points for this event
      const eventTotalPoints = topSubEvents.reduce((sum, reg) => sum + reg.points, 0);

      return {
        eventId: parseInt(eventId),
        eventName: event.event_name,
        duration: durationInDays,
        maxSubEventsConsidered: maxSubEvents,
        totalSubEventsRegistered: registrations.length,
        points: eventTotalPoints,
        subEvents: topSubEvents.map(reg => ({
          subEventId: reg.subevent_id,
          subEventTitle: reg.subevent_title || 'Sub Event',
          rank: reg.rank,
          attendance: reg.attendance,
          points: reg.points,
          type: reg.rank ? `${reg.rank}${this.getRankSuffix(reg.rank)} Place` : 
                reg.attendance ? 'Participation' : 'Registered'
        })),
        excludedSubEvents: registrationsWithRanks.slice(maxSubEvents)
      };
    } catch (error) {
      console.error(`Error calculating points for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate points for a single sub-event
   */
  static calculateSubEventPoints(rank, attendance) {
    if (rank && rank <= 3) {
      return 3; // Merit/winning performance
    }
    if (attendance) {
      return 2; // Participation without winning
    }
    return 0; // No points for non-attendance
  }

  /**
   * Get rank suffix (1st, 2nd, 3rd, etc.)
   */
  static getRankSuffix(rank) {
    if (!rank) return '';
    if (rank >= 11 && rank <= 13) return 'th';
    const lastDigit = rank % 10;
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  /**
   * Get detailed points breakdown for display
   */
  static getPointsBreakdownText(pointsData) {
    const { totalPoints, detailedBreakdown } = pointsData;
    
    let breakdown = `Total Points: ${totalPoints}\n\n`;
    
    detailedBreakdown.forEach(event => {
      breakdown += `📅 ${event.eventName} (${event.duration} day${event.duration > 1 ? 's' : ''})\n`;
      breakdown += `   Max considered: ${event.maxSubEventsConsidered} sub-events (2 per day)\n`;
      breakdown += `   Event points: ${event.points}\n\n`;
      
      event.subEvents.forEach(subEvent => {
        breakdown += `   • ${subEvent.subEventTitle}: ${subEvent.points} pts (${subEvent.type})\n`;
      });
      
      if (event.excludedSubEvents.length > 0) {
        breakdown += `   ⚠️ ${event.excludedSubEvents.length} sub-event(s) excluded from calculation\n`;
      }
      
      breakdown += '\n';
    });
    
    return breakdown;
  }
}
