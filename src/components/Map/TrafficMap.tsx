import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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

export function TrafficMap({ incidents = [], center = [78.9629, 20.5937], zoom = 5 }: TrafficMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        // In a real scenario, this would come from your backend
        // For now, we'll let users input it
        const token = localStorage.getItem('mapbox_token');
        if (token) {
          setMapboxToken(token);
          setIsTokenSet(true);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for incidents
    incidents.forEach((incident) => {
      if (map.current && incident.latitude && incident.longitude) {
        const color = 
          incident.severity === 'high' ? '#ef4444' :
          incident.severity === 'medium' ? '#f97316' :
          '#22c55e';

        const el = document.createElement('div');
        el.className = 'traffic-marker';
        el.style.backgroundColor = color;
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${incident.type}</h3>
            <p style="margin: 0; font-size: 12px;">${incident.description || 'No description'}</p>
            <p style="margin-top: 4px; font-size: 11px; color: ${color};">Severity: ${incident.severity}</p>
          </div>`
        );

        new mapboxgl.Marker(el)
          .setLngLat([incident.longitude, incident.latitude])
          .setPopup(popup)
          .addTo(map.current);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken, incidents, center, zoom]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Map Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGl..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Get your token from{' '}
                <a
                  href="https://account.mapbox.com/access-tokens/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Load Map
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
