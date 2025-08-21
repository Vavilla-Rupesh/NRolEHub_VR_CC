import { useState, useEffect } from 'react';
import { PointsService } from '../services/points.service';
import api from '../api';
import toast from 'react-hot-toast';

export function useStudentPoints(userId) {
  const [pointsData, setPointsData] = useState({
    totalPoints: 0,
    pointsByEvent: {},
    detailedBreakdown: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (userId) {
      calculatePoints();
    }
  }, [userId]);

  const calculatePoints = async () => {
    try {
      setPointsData(prev => ({ ...prev, loading: true, error: null }));

      // Get student's paid registrations
      const registrationsResponse = await api.get('/registrations/my-registrations');
      const paidRegistrations = registrationsResponse.data.filter(
        reg => reg.payment_status === 'paid'
      );

      // Enhance registrations with subevent details
      const enhancedRegistrations = await Promise.all(
        paidRegistrations.map(async (reg) => {
          try {
            const subeventsResponse = await api.get(`/subevents/${reg.event_id}`);
            const subevent = subeventsResponse.data.subevents.find(
              se => se.id === reg.subevent_id
            );
            
            return {
              ...reg,
              subevent_title: subevent?.title || 'Sub Event'
            };
          } catch (error) {
            console.error('Failed to fetch subevent details:', error);
            return {
              ...reg,
              subevent_title: 'Sub Event'
            };
          }
        })
      );

      // Calculate points using the new service
      const calculatedPoints = await PointsService.calculateStudentPoints(enhancedRegistrations);

      setPointsData({
        ...calculatedPoints,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Failed to calculate points:', error);
      setPointsData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to calculate points'
      }));
      toast.error('Failed to calculate points');
    }
  };

  const refreshPoints = () => {
    calculatePoints();
  };

  return {
    ...pointsData,
    refreshPoints
  };
}
