-- Fix PUBLIC_DATA_EXPOSURE: Add admin SELECT policy for profiles table
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'owner'::app_role)
);

-- Fix MISSING_RLS: Add admin write policies for traffic_incidents table
CREATE POLICY "Admins can insert traffic incidents"
ON traffic_incidents FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'owner'::app_role)
);

CREATE POLICY "Admins can update traffic incidents"
ON traffic_incidents FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'owner'::app_role)
);

CREATE POLICY "Admins can delete traffic incidents"
ON traffic_incidents FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'owner'::app_role)
);