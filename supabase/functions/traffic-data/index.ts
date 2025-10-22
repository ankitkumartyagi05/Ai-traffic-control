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
    const { location, radius } = await req.json();

    // Input validation for location
    if (!location || typeof location !== 'object' || typeof location.lat !== 'number' || typeof location.lon !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid location: must be an object with lat and lon numbers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate coordinate ranges
    if (Math.abs(location.lat) > 90 || Math.abs(location.lon) > 180) {
      return new Response(
        JSON.stringify({ error: 'Invalid location coordinates: latitude must be between -90 and 90, longitude between -180 and 180' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate radius
    if (radius && (typeof radius !== 'number' || radius < 100 || radius > 50000)) {
      return new Response(
        JSON.stringify({ error: 'Invalid radius: must be a number between 100 and 50000 meters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const TRAFFIC_API_KEY = Deno.env.get('TRAFFIC_API_KEY');

    if (!TRAFFIC_API_KEY) {
      throw new Error('TRAFFIC_API_KEY is not configured');
    }

    console.log('Processing traffic data request');

    // Replace this URL with your actual third-party traffic API endpoint
    // Example format - adjust based on your provider's documentation
    const apiUrl = `https://api.trafficprovider.com/v1/incidents?lat=${location.lat}&lon=${location.lon}&radius=${radius || 5000}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TRAFFIC_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Traffic API error:', response.status, errorText);
      throw new Error(`Traffic API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Traffic data retrieved successfully');

    return new Response(
      JSON.stringify(data), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in traffic-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
