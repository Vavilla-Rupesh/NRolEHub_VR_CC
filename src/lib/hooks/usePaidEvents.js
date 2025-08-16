import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function usePaidEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaidRegistrations = async () => {
      try {
        const response = await api.get('/registrations/my-registrations');
        // Filter only paid registrations
        const paidRegistrations = response.data.filter(reg => reg.payment_status === 'paid');
        
        // Enhance registrations with event and subevent details
        const enhancedRegistrations = await Promise.all(
          paidRegistrations.map(async (reg) => {
            try {
              const [eventResponse, subeventsResponse] = await Promise.all([
                api.get(`/events/${reg.event_id}`),
                api.get(`/subevents/${reg.event_id}`)
              ]);
              
              const event = eventResponse.data;
              const subevent = subeventsResponse.data.subevents.find(
                se => se.id === reg.subevent_id
              );
              
              return {
                ...reg,
                event_name: event?.event_name || reg.event_name,
                subevent_title: subevent?.title || 'Sub Event'
              };
            } catch (error) {
              console.error('Failed to fetch event/subevent details:', error);
              return {
                ...reg,
                subevent_title: 'Sub Event'
              };
            }
          })
        );
        
        setRegistrations(enhancedRegistrations);
      } catch (error) {
        toast.error('Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchPaidRegistrations();
  }, []);

  return { registrations, loading };
}