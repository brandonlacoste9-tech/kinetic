import { useState, useEffect } from 'react';
import { getSupabase, type Booking, type Studio } from '../lib/supabase';

export interface OperatorStats {
  rank: string;
  totalSessions: number;
  intensityHours: number;
  ironMovedKg: number;
  sovereignty: Record<string, number>; // neighborhood name -> session count
  recentBookings: (Booking & { studio: Studio })[];
}

export function useOperator() {
  const [stats, setStats] = useState<OperatorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOperatorData() {
      const supabase = getSupabase();
      
      const mockStats: OperatorStats = {
        rank: 'ELITE OPERATIVE',
        totalSessions: 42,
        intensityHours: 63.5,
        ironMovedKg: 52500,
        sovereignty: {
          'Plateau': 15,
          'Griffintown': 12,
          'Hochelaga': 8,
          'Mile End': 7
        },
        recentBookings: []
      };

      if (!supabase) {
        setStats(mockStats);
        setLoading(false);
        return;
      }

      try {
        // In a real app, we'd filter by the current user's ID
        // For this demo, we'll fetch all bookings to simulate a profile
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            studio:studio_id(*)
          `)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        const bookings = (bookingsData || []) as (Booking & { studio: Studio })[];
        
        // Calculate stats
        const sovereignty: Record<string, number> = {};
        bookings.forEach(b => {
          const neighborhood = b.studio.neighborhood?.name || b.studio.city;
          sovereignty[neighborhood] = (sovereignty[neighborhood] || 0) + 1;
        });

        // Mock some additional stats for the "Operator" feel
        const mockStats: OperatorStats = {
          rank: bookings.length > 10 ? 'ELITE OPERATIVE' : bookings.length > 5 ? 'VETERAN' : 'RECRUIT',
          totalSessions: bookings.length,
          intensityHours: bookings.length * 1.5,
          ironMovedKg: bookings.length * 1250,
          sovereignty,
          recentBookings: bookings
        };

        setStats(mockStats);
      } catch (err) {
        console.error('Error fetching operator data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOperatorData();
  }, []);

  return { stats, loading };
}
