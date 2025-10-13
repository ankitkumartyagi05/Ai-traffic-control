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
    const MAPBOX_API_KEY = Deno.env.get('MAPBOX_API_KEY');

    if (!MAPBOX_API_KEY) {
      throw new Error('MAPBOX_API_KEY is not configured');
    }

    console.log('Fetching route from', origin, 'to', destination);

    // Mapbox Directions API
    const coordinates = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile || 'driving-traffic'}/${coordinates}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPBOX_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mapbox API error:', response.status, errorText);
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();
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
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
