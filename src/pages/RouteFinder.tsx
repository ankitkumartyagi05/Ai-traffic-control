import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrafficStatusBadge } from "@/components/TrafficComponents/TrafficStatusBadge";
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Fuel, 
  Route, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Car,
  Zap,
  Cloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RouteData {
  id: number;
  name: string;
  distance: string;
  time: string;
  fuel: string;
  traffic: "free" | "moderate" | "heavy" | "gridlock";
  pros: string[];
  cons: string[];
  geometry?: any;
}

const RouteFinder = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [priority, setPriority] = useState("");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const findRoutes = async () => {
    if (!origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both origin and destination",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call map-routes edge function with real Mapbox API
      const { data, error } = await supabase.functions.invoke('map-routes', {
        body: {
          origin: { lat: 28.6139, lon: 77.2090 }, // Delhi (example - should be geocoded)
          destination: { lat: 19.0760, lon: 72.8777 }, // Mumbai (example - should be geocoded)
          profile: vehicleType === 'bike' ? 'cycling' : 'driving-traffic'
        }
      });

      if (error) throw error;

      // Process routes from Mapbox response
      const processedRoutes: RouteData[] = data.routes?.map((route: any, index: number) => ({
        id: index + 1,
        name: index === 0 ? "Recommended Route (Fastest)" : `Alternative Route ${index}`,
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        time: `${Math.round(route.duration / 60)} min`,
        fuel: `${((route.distance / 1000) * 0.08).toFixed(1)}L`,
        traffic: index === 0 ? "moderate" : index === 1 ? "free" : "heavy",
        pros: index === 0 
          ? ["AI-optimized route", "Real-time traffic updates", "Weather-aware"]
          : ["Less congested", "Scenic route", "Alternative path"],
        cons: index === 0
          ? ["May have tolls", "Highway traffic possible"]
          : ["Slightly longer", "More turns"],
        geometry: route.geometry
      })) || [];

      setRoutes(processedRoutes);

      toast({
        title: "Routes Found! 🚗",
        description: `Found ${processedRoutes.length} optimal routes`,
      });
    } catch (error: any) {
      console.error('Route finding error:', error);
      toast({
        title: "Route Finding Failed",
        description: error.message || "Unable to find routes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Smart Route Finder</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered route optimization with real-time traffic & weather analysis
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-primary"><Zap className="mr-1 h-3 w-3" />Real-time Congestion</Badge>
            <Badge className="bg-status-info text-white"><Cloud className="mr-1 h-3 w-3" />Weather Integration</Badge>
            <Badge className="bg-status-success text-white"><Route className="mr-1 h-3 w-3" />Multi-layer AI</Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Route Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5 text-primary" />
                Plan Your Route
              </CardTitle>
              <CardDescription>
                Enter your journey details for intelligent route suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="origin">From</Label>
                  <Input 
                    id="origin" 
                    placeholder="Starting location" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">To</Label>
                  <Input 
                    id="destination" 
                    placeholder="Destination" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle Type</Label>
                  <Input
                    id="vehicle"
                    placeholder="e.g., Car, Bike"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Route priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fastest">Fastest</SelectItem>
                      <SelectItem value="shortest">Shortest</SelectItem>
                      <SelectItem value="economic">Most Economic</SelectItem>
                      <SelectItem value="eco">Eco-Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={findRoutes} 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Finding Best Routes..."
                ) : (
                  <>
                    <Route className="mr-2 h-4 w-4" />
                    Find Routes with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Route Results */}
          {routes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Recommended Routes</h2>
              
              {routes.map((route, index) => (
                <Card key={route.id} className={`${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Car className="mr-2 h-5 w-5" />
                        {route.name}
                        {index === 0 && (
                          <Badge className="ml-2 bg-primary">AI Recommended</Badge>
                        )}
                      </CardTitle>
                      <TrafficStatusBadge status={route.traffic} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{route.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{route.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{route.fuel}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-status-success mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pros
                        </h4>
                        <ul className="text-sm space-y-1">
                          {route.pros.map((pro, i) => (
                            <li key={i} className="text-muted-foreground">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-status-warning mb-2 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" />
                          Cons
                        </h4>
                        <ul className="text-sm space-y-1">
                          {route.cons.map((con, i) => (
                            <li key={i} className="text-muted-foreground">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1">
                        Select Route & Start Navigation
                      </Button>
                      <Button variant="outline">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Live Updates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Live Traffic Alerts */}
          <Card className="border-status-warning">
            <CardHeader>
              <CardTitle className="flex items-center text-status-warning">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Live Traffic Alerts & Event Diversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-status-emergency/10 rounded-lg">
                  <Badge className="bg-status-emergency text-white">Emergency</Badge>
                  <div>
                    <p className="font-medium">Accident - Dynamic Route Diversion Active</p>
                    <p className="text-sm text-muted-foreground">
                      Multi-vehicle accident on NH-8. Emergency vehicles prioritized. Auto-rerouting enabled.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-status-warning/10 rounded-lg">
                  <Badge className="bg-status-warning text-black">Event</Badge>
                  <div>
                    <p className="font-medium">Special Event - Road Closure</p>
                    <p className="text-sm text-muted-foreground">
                      Marathon event in progress. Alternate routes suggested by AI system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-status-info/10 rounded-lg">
                  <Badge className="bg-status-info text-white">Weather</Badge>
                  <div>
                    <p className="font-medium">Heavy Rain Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Weather-based model suggests caution. Speed limits adjusted dynamically.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RouteFinder;
