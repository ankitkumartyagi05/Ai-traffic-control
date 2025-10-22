import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, profile } = await req.json();

    // Input validation for coordinates
    if (!origin || typeof origin !== 'object' || typeof origin.lat !== 'number' || typeof origin.lon !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid origin: must be an object with lat and lon numbers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!destination || typeof destination !== 'object' || typeof destination.lat !== 'number' || typeof destination.lon !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid destination: must be an object with lat and lon numbers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate coordinate ranges
    if (Math.abs(origin.lat) > 90 || Math.abs(origin.lon) > 180) {
      return new Response(
        JSON.stringify({ error: 'Invalid origin coordinates: latitude must be between -90 and 90, longitude between -180 and 180' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (Math.abs(destination.lat) > 90 || Math.abs(destination.lon) > 180) {
      return new Response(
        JSON.stringify({ error: 'Invalid destination coordinates: latitude must be between -90 and 90, longitude between -180 and 180' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate profile if provided
    const validProfiles = ['driving-traffic', 'driving', 'walking', 'cycling'];
    if (profile && !validProfiles.includes(profile)) {
      return new Response(
        JSON.stringify({ error: `Invalid profile: must be one of ${validProfiles.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    console.log('Processing route request');

    // Map profile to Google Maps travel mode
    const travelMode = profile === 'walking' ? 'walking' : 
                      profile === 'cycling' ? 'bicycling' :
                      'driving';

    // Google Maps Directions API
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lon}&destination=${destination.lat},${destination.lon}&mode=${travelMode}&alternatives=true&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Maps API error:', response.status, errorText);
      throw new Error(`Google Maps API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Google Maps API returned error:', data.status, data.error_message);
      throw new Error(`Google Maps API error: ${data.status}`);
    }

    console.log('Route data retrieved successfully');

    return new Response(
      JSON.stringify(data), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in map-routes function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to fetch route data from Google Maps API'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
