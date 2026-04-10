import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    console.warn('Supabase credentials missing or invalid. Please check your .env file.');
    return null;
  }

  try {
    // Basic URL validation to prevent createClient from throwing
    if (!supabaseUrl.startsWith('http')) {
      console.warn('Invalid Supabase URL. Must start with http/https.');
      return null;
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};

// For backward compatibility in hooks, but we'll update them to use getSupabase()
export const supabase = getSupabase();

export type Studio = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  province: string;
  rating: number;
  image_url: string;
  is_featured: boolean;
  lat?: number;
  lng?: number;
  dist_meters?: number; // Added for spatial queries
  neighborhood?: {
    name: string;
    city: string;
  };
  amenities?: {
    amenity: {
      name: string;
      icon_name: string;
    }
  }[];
  translations?: {
    locale: string;
    tagline: string;
  }[];
};

export type Booking = {
  id: string;
  studio_id: string;
  user_id: string;
  session_time: string;
  status: 'confirmed' | 'cancelled';
  access_code: string;
  created_at: string;
};
