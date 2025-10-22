import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";

interface TrafficMapProps {
  incidents?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    type: string;
    severity: string;
    description?: string;
  }>;
  center?: [number, number];
  zoom?: number;
}

declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
}

export function TrafficMap({ incidents = [], center = [78.9629, 20.5937], zoom = 5 }: TrafficMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key is not configured');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      setError('Failed to load Google Maps');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (map.current && window.google?.maps) {
      // Update markers when incidents change
      updateMarkers();
    }
  }, [incidents]);

  const initializeMap = () => {
    if (!mapContainer.current || !window.google?.maps) return;

    try {
      map.current = new window.google.maps.Map(mapContainer.current, {
        center: { lat: center[1], lng: center[0] },
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      updateMarkers();
      setIsLoaded(true);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  };

  const updateMarkers = () => {
    if (!map.current || !window.google?.maps) return;

    // Add markers for incidents
    incidents.forEach((incident) => {
      if (incident.latitude && incident.longitude) {
        const color = 
          incident.severity === 'high' ? '#ef4444' :
          incident.severity === 'medium' ? '#f97316' :
          '#22c55e';

        const marker = new window.google.maps.Marker({
          position: { lat: incident.latitude, lng: incident.longitude },
          map: map.current!,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 10,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; color: ${color};">${incident.type}</h3>
              <p style="margin: 0; font-size: 12px;">${incident.description || 'No description'}</p>
              <p style="margin-top: 4px; font-size: 11px; color: ${color};">Severity: ${incident.severity}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open({
            anchor: marker,
            map: map.current!,
          });
        });
      }
    });
  };

  if (error) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
