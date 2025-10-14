-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  eco_points INTEGER DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id TEXT NOT NULL UNIQUE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  vehicle_type TEXT NOT NULL,
  travel_date DATE NOT NULL,
  route_data JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create eco rewards table
CREATE TABLE public.eco_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  transport_mode TEXT NOT NULL, -- 'public_transport', 'bicycle', 'walking', 'running', 'jogging'
  points_earned INTEGER NOT NULL DEFAULT 0,
  distance_km NUMERIC(10,2),
  duration_minutes INTEGER,
  co2_saved_kg NUMERIC(10,2),
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create traffic incidents table
CREATE TABLE public.traffic_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'accident', 'construction', 'congestion', 'weather', 'event'
  location TEXT NOT NULL,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT,
  estimated_delay_minutes INTEGER,
  status TEXT DEFAULT 'active', -- 'active', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_incidents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trips policies
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

-- Eco rewards policies
CREATE POLICY "Users can view their own eco rewards"
  ON public.eco_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create eco rewards"
  ON public.eco_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Traffic incidents policies (public read, admin write)
CREATE POLICY "Anyone can view active incidents"
  ON public.traffic_incidents FOR SELECT
  USING (status = 'active');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_traffic_incidents_updated_at
  BEFORE UPDATE ON public.traffic_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();