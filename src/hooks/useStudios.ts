import { useState, useEffect } from 'react';
import { getSupabase, type Studio } from '../lib/supabase';

export function useStudios(options: { 
  featuredOnly?: boolean; 
  nearby?: { lat: number; lng: number; radius: number };
  amenityIds?: string[];
} = {}) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudios() {
      const supabase = getSupabase();
      
      // Initialize with mock data and local storage data
      const localStudiosJson = localStorage.getItem('kinetic_local_studios');
      const localStudios: Studio[] = localStudiosJson ? JSON.parse(localStudiosJson) : [];
      
      // Mock data for new categories
      const mockExtensions: Studio[] = [
        {
          id: 'barber-1',
          name: "NOTORIOUS BARBERSHOP",
          slug: "notorious-barber",
          description: "The sharpest fades in the Plateau. Industrial vibe, elite precision.",
          address: "4633 Boul. Saint-Laurent",
          city: "Montreal",
          province: "QC",
          rating: 4.9,
          image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2070",
          is_featured: true,
          lat: 45.5215,
          lng: -73.5855,
          neighborhood: { name: "Plateau", city: "Montreal" },
          amenities: [
            { amenity: { name: "FADE", icon_name: "scissors" } },
            { amenity: { name: "BEARD", icon_name: "flame" } }
          ]
        },
        {
          id: 'tanning-1',
          name: "SOLARIS KINETIC TAN",
          slug: "solaris-tan",
          description: "High-intensity UV exposure. Optimized vitamin D synthesis and urban glow.",
          address: "1455 Rue Peel",
          city: "Montreal",
          province: "QC",
          rating: 4.7,
          image_url: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=2070",
          is_featured: true,
          lat: 45.4995,
          lng: -73.5715,
          neighborhood: { name: "Downtown", city: "Montreal" },
          amenities: [
            { amenity: { name: "UV-MAX", icon_name: "sun" } },
            { amenity: { name: "HYDRATE", icon_name: "waves" } }
          ]
        },
        {
          id: 'wholefood-1',
          name: "KINETIC FUEL DEPOT",
          slug: "kinetic-fuel-depot",
          description: "Bio-available nutrients for the high-performance operator. Organic, raw, and micronutrient-dense.",
          address: "5333 Casgrain Ave",
          city: "Montreal",
          province: "QC",
          rating: 4.9,
          image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2070",
          is_featured: true,
          lat: 45.5265,
          lng: -73.5995,
          neighborhood: { name: "Mile End", city: "Montreal" },
          amenities: [
            { amenity: { name: "ORGANIC", icon_name: "leaf" } },
            { amenity: { name: "RAW", icon_name: "flame" } }
          ]
        }
      ];

      const initialData = [...localStudios, ...mockExtensions];

      if (!supabase) {
        setStudios(initialData);
        setLoading(false);
        return;
      }

      try {
        let data: Studio[] = [];

        if (options.nearby) {
          // Use the PostGIS RPC for spatial search
          const { data: spatialData, error: spatialError } = await supabase.rpc('get_studios_nearby', {
            lat: options.nearby.lat,
            long: options.nearby.lng,
            radius_meters: options.nearby.radius
          });

          if (spatialError) throw spatialError;
          data = spatialData as unknown as Studio[];
          
          // Client-side filter for amenities if spatial search is used
          // (In production, we'd update the RPC to handle this)
          if (options.amenityIds && options.amenityIds.length > 0) {
            data = data.filter(studio => 
              options.amenityIds?.every(id => 
                studio.amenities?.some(a => (a as any).amenity_id === id)
              )
            );
          }
        } else {
          // Standard retrieval
          let query = supabase
            .from('studios')
            .select(`
              *,
              lat:location_lat,
              lng:location_lng,
              neighborhood:neighborhood_id(name, city),
              amenities:studio_amenities(
                amenity_id,
                amenity:amenity_id(name, icon_name)
              ),
              translations:studio_translations(locale, tagline)
            `);

          if (options.featuredOnly) {
            query = query.eq('is_featured', true);
          }

          const { data: standardData, error: standardError } = await query;
          if (standardError) throw standardError;
          
          let filteredData = standardData as unknown as Studio[];
          
          // Filter by amenities
          if (options.amenityIds && options.amenityIds.length > 0) {
            filteredData = filteredData.filter(studio => 
              options.amenityIds?.every(id => 
                studio.amenities?.some(a => (a as any).amenity_id === id)
              )
            );
          }
          
          data = filteredData;
        }

        setStudios([...data, ...initialData]);
      } catch (err) {
        console.error('Error fetching studios:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStudios();
  }, [options.featuredOnly, options.nearby?.lat, options.nearby?.lng, options.nearby?.radius, JSON.stringify(options.amenityIds)]);

  return { studios, loading, error };
}

export function useAmenities() {
  const [amenities, setAmenities] = useState<{ id: string; name: string; icon_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmenities() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('amenities').select('*').order('name');
      if (!error && data) {
        setAmenities(data);
      }
      setLoading(false);
    }
    fetchAmenities();
  }, []);

  return { amenities, loading };
}
