# API Setup Guide

This document provides information about the backend APIs and configuration for the AI Traffic Management System.

## Backend Architecture

The project uses Lovable Cloud for backend services, which includes:
- **Database**: PostgreSQL database for storing data
- **Authentication**: Built-in user authentication system
- **Edge Functions**: Serverless functions for API integrations
- **Secrets Management**: Secure storage for API keys

## Edge Functions

### 1. Chat Function (`/functions/v1/chat`)

**Purpose**: AI-powered chatbot for traffic assistance

**Request Format**:
```json
{
  "message": "What's the traffic like on Highway 101?"
}
```

**Response Format**:
```json
{
  "generatedText": "Current traffic on Highway 101 shows moderate congestion..."
}
```

**Configuration**:
- Uses OpenAI GPT-4o-mini model
- API Key: `OPENAI_API_KEY` (configured in backend secrets)
- Public endpoint (no authentication required)

---

### 2. Traffic Data Function (`/functions/v1/traffic-data`)

**Purpose**: Fetches real-time traffic incidents from third-party API

**Request Format**:
```json
{
  "location": {
    "lat": 37.7749,
    "lon": -122.4194
  },
  "radius": 5000
}
```

**Response Format**:
```json
{
  "incidents": [
    {
      "type": "accident",
      "location": "Highway 101 at Exit 42",
      "severity": "high",
      "description": "Multi-vehicle collision",
      "timestamp": "2025-01-13T10:30:00Z"
    }
  ]
}
```

**Configuration**:
- API Key: `TRAFFIC_API_KEY` (configured in backend secrets)
- Adjust the API endpoint URL in `supabase/functions/traffic-data/index.ts` to match your provider
- Public endpoint (no authentication required)

---

### 3. Map Routes Function (`/functions/v1/map-routes`)

**Purpose**: Calculates optimal routes using Mapbox Directions API

**Request Format**:
```json
{
  "origin": {
    "lat": 37.7749,
    "lon": -122.4194
  },
  "destination": {
    "lat": 37.8044,
    "lon": -122.2712
  },
  "profile": "driving-traffic"
}
```

**Response Format**: Mapbox Directions API response (GeoJSON format)

**Configuration**:
- API Key: `MAPBOX_API_KEY` (configured in backend secrets)
- Supported profiles: `driving-traffic`, `driving`, `walking`, `cycling`
- Public endpoint (no authentication required)

---

## API Keys Configuration

All API keys are securely stored in the backend secrets and are already configured:

1. ✅ **OPENAI_API_KEY** - For AI chat functionality
2. ✅ **MAPBOX_API_KEY** - For maps and routing
3. ✅ **TRAFFIC_API_KEY** - For third-party traffic data

### How to Update API Keys

If you need to update any API key:
1. Contact your administrator or use the backend management interface
2. API keys are encrypted and stored securely
3. Changes take effect immediately without redeployment

---

## Using the APIs in Your Code

### Example: Chat API

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke('chat', {
  body: { message: "How's the traffic on I-95?" }
});

if (data) {
  console.log(data.generatedText);
}
```

### Example: Traffic Data API

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke('traffic-data', {
  body: { 
    location: { lat: 37.7749, lon: -122.4194 },
    radius: 5000 
  }
});
```

### Example: Map Routes API

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke('map-routes', {
  body: { 
    origin: { lat: 37.7749, lon: -122.4194 },
    destination: { lat: 37.8044, lon: -122.2712 },
    profile: 'driving-traffic'
  }
});
```

---

## API Endpoints URLs

When deployed, your edge functions will be available at:

```
https://gdtyrukgdtbjfhaxwkhg.supabase.co/functions/v1/chat
https://gdtyrukgdtbjfhaxwkhg.supabase.co/functions/v1/traffic-data
https://gdtyrukgdtbjfhaxwkhg.supabase.co/functions/v1/map-routes
```

---

## Environment Variables

The following environment variables are automatically configured:

- `VITE_SUPABASE_URL` - Backend API base URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key for client-side requests
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

These are available in your frontend code via `import.meta.env.VITE_*`

---

## Third-Party Traffic API Integration

### Important: Update the API Endpoint

In `supabase/functions/traffic-data/index.ts`, update line 24 with your actual traffic API provider's endpoint:

```typescript
// Replace this with your provider's actual endpoint
const apiUrl = `https://api.trafficprovider.com/v1/incidents?lat=${location.lat}&lon=${location.lon}&radius=${radius || 5000}`;
```

Common traffic data providers:
- TomTom Traffic API
- HERE Traffic API
- Google Maps Traffic Layer
- INRIX Traffic API
- Mapbox Traffic API

Refer to your provider's documentation for the correct endpoint format and parameters.

---

## Deployment & GitHub Sync

### Automatic Deployment

All edge functions are **automatically deployed** when you:
- Make changes to files in `supabase/functions/`
- Update the `supabase/config.toml` file
- Push changes to your GitHub repository

### GitHub Integration

This project features **bidirectional sync** with GitHub:

✅ **Changes in Lovable → Automatically pushed to GitHub**
✅ **Changes in GitHub → Automatically synced to Lovable**

No manual deployment steps required!

### GitHub Repository

Your code is automatically synced to your connected GitHub repository. Any changes you make will be:
1. Committed automatically
2. Pushed to the main branch
3. Available for download/cloning

### Downloading the Project

To download and run locally:

```bash
# Clone your repository
git clone <your-github-repo-url>

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and add your local values

# Run development server
npm run dev
```

---

## Security Notes

🔒 **All API keys are encrypted and stored securely**
🔒 **Edge functions run in isolated environments**
🔒 **No API keys are exposed in client-side code**
🔒 **CORS is configured for your domain only in production**

---

## Troubleshooting

### Chat not working?
- Verify `OPENAI_API_KEY` is set correctly
- Check browser console for error messages
- Ensure you're using a supported OpenAI model

### Maps not loading?
- Verify `MAPBOX_API_KEY` is valid
- Check that the Mapbox API endpoint is accessible
- Ensure you have sufficient API quota

### Traffic data issues?
- Update the API endpoint in `traffic-data/index.ts` to match your provider
- Verify `TRAFFIC_API_KEY` is correct
- Check provider's API documentation for correct parameters

---

## Support

For backend-related issues:
- Check edge function logs in the backend management interface
- Review API provider documentation
- Verify all API keys are correctly configured

---

Last Updated: January 2025
