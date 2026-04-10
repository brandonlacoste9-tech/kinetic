-- Kinetic Database Schema (Supabase/Postgres)
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Neighborhoods Table
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  boundary GEOMETRY(Polygon, 4326), -- Optional: for strict polygon mapping
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Amenities Table
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL, -- Lucide icon name
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Studios Table
CREATE TABLE studios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id),
  neighborhood_id UUID REFERENCES neighborhoods(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  image_url TEXT,
  location GEOGRAPHY(Point, 4326), -- PostGIS Point for radius searches
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Studio Amenities (Many-to-Many)
CREATE TABLE studio_amenities (
  studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (studio_id, amenity_id)
);

-- 5. Translations (Joual/French/English)
CREATE TABLE studio_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
  locale TEXT NOT NULL, -- 'en', 'fr', 'joual'
  tagline TEXT,
  description_localized TEXT,
  UNIQUE(studio_id, locale)
);

-- 6. RPC for Spatial Search
-- This function allows us to find studios within a certain radius (in meters)
CREATE OR REPLACE FUNCTION get_studios_nearby(
  lat FLOAT,
  long FLOAT,
  radius_meters FLOAT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  rating DECIMAL,
  image_url TEXT,
  is_featured BOOLEAN,
  dist_meters FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.slug,
    s.description,
    s.address,
    s.city,
    s.province,
    s.rating,
    s.image_url,
    s.is_featured,
    ST_Distance(s.location, ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography) AS dist_meters
  FROM studios s
  WHERE ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography, radius_meters)
  ORDER BY dist_meters ASC;
END;
$$;

-- Enable Row Level Security
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_translations ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public read access for neighborhoods" ON neighborhoods FOR SELECT USING (true);
CREATE POLICY "Public read access for amenities" ON amenities FOR SELECT USING (true);
CREATE POLICY "Public read access for studios" ON studios FOR SELECT USING (true);
CREATE POLICY "Public read access for studio_amenities" ON studio_amenities FOR SELECT USING (true);
CREATE POLICY "Public read access for studio_translations" ON studio_translations FOR SELECT USING (true);
