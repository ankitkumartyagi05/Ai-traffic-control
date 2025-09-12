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
  Car
} from "lucide-react";

const RouteFinder = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const findRoutes = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRoutes([
        {
          id: 1,
          name: "Highway Route (Fastest)",
          distance: "24.5 km",
          time: "32 min",
          fuel: "2.1L",
          traffic: "moderate" as const,
          pros: ["Fastest route", "Good road conditions", "Less traffic lights"],
          cons: ["Toll charges apply", "Highway traffic possible"]
        },
        {
          id: 2,
          name: "City Route (Economic)",
          distance: "28.7 km", 
          time: "45 min",
          fuel: "1.8L",
          traffic: "heavy" as const,
          pros: ["No toll charges", "Fuel efficient", "Scenic route"],
          cons: ["Heavy city traffic", "Multiple signals", "Longer duration"]
        },
        {
          id: 3,
          name: "Alternate Route",
          distance: "26.1 km",
          time: "38 min", 
          fuel: "2.0L",
          traffic: "free" as const,
          pros: ["Balanced option", "Less congested", "Good connectivity"],
          cons: ["Some construction work", "Narrow sections"]
        }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Smart Route Finder</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered route optimization with real-time traffic analysis
          </p>
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
                  <Input id="origin" placeholder="Starting location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">To</Label>
                  <Input id="destination" placeholder="Destination" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Motorcycle</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Route priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fastest">Fastest</SelectItem>
                      <SelectItem value="shortest">Shortest</SelectItem>
                      <SelectItem value="economic">Most Economic</SelectItem>
                      <SelectItem value="scenic">Scenic Route</SelectItem>
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
                    Find Routes
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
                          <Badge className="ml-2 bg-primary">Recommended</Badge>
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
                          {route.pros.map((pro: string, i: number) => (
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
                          {route.cons.map((con: string, i: number) => (
                            <li key={i} className="text-muted-foreground">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1">
                        Select Route
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
                Live Traffic Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-status-warning/10 rounded-lg">
                  <Badge className="bg-status-warning text-white">Heavy</Badge>
                  <div>
                    <p className="font-medium">Highway Junction Congestion</p>
                    <p className="text-sm text-muted-foreground">
                      Heavy traffic reported at Main Highway Junction. Expected delay: 15-20 minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-status-info/10 rounded-lg">
                  <Badge className="bg-status-info text-white">Info</Badge>
                  <div>
                    <p className="font-medium">Construction Work</p>
                    <p className="text-sm text-muted-foreground">
                      Road construction on Park Street. One lane closed until 6 PM.
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