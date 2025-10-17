-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is admin or owner
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'owner')
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'owner'));

-- Update profiles table to track eco transport
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_transport_mode TEXT;

-- Function to award eco points
CREATE OR REPLACE FUNCTION public.award_eco_points(
  p_user_id UUID,
  p_trip_id UUID,
  p_transport_mode TEXT,
  p_distance_km NUMERIC,
  p_duration_minutes INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_points INTEGER := 0;
  v_co2_saved NUMERIC := 0;
BEGIN
  -- Calculate points based on transport mode
  CASE p_transport_mode
    WHEN 'public_transport' THEN
      v_points := 10;
      v_co2_saved := p_distance_km * 0.05; -- 50g CO2 per km saved
    WHEN 'bicycle' THEN
      v_points := 20;
      v_co2_saved := p_distance_km * 0.12; -- 120g CO2 per km saved
    WHEN 'walking', 'running', 'jogging' THEN
      v_points := 25;
      v_co2_saved := p_distance_km * 0.12; -- 120g CO2 per km saved
    ELSE
      v_points := 0;
  END CASE;

  -- Only award if eco-friendly transport
  IF v_points > 0 THEN
    -- Insert eco reward
    INSERT INTO public.eco_rewards (
      user_id,
      trip_id,
      transport_mode,
      points_earned,
      distance_km,
      duration_minutes,
      co2_saved_kg
    ) VALUES (
      p_user_id,
      p_trip_id,
      p_transport_mode,
      v_points,
      p_distance_km,
      p_duration_minutes,
      v_co2_saved
    );

    -- Update profile eco points
    UPDATE public.profiles
    SET eco_points = COALESCE(eco_points, 0) + v_points,
        last_transport_mode = p_transport_mode
    WHERE user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'points_awarded', v_points,
    'co2_saved_kg', v_co2_saved
  );
END;
$$;