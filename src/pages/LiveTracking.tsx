import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrafficStatusBadge } from "@/components/TrafficComponents/TrafficStatusBadge";
import { EmergencySOSButton } from "@/components/TrafficComponents/EmergencySOSButton";
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  Clock, 
  Car,
  Bus,
  Bike,
  Truck,
  RefreshCw,
  Zap
} from "lucide-react";

interface TrafficIncident {
  id: string;
  type: "accident" | "construction" | "congestion" | "weather";
  location: string;
  severity: "low" | "medium" | "high";
  description: string;
  estimatedDelay: string;
  lastUpdated: string;
}

const LiveTracking = () => {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([
    {
      id: "1",
      type: "accident",
      location: "Highway 101, Mile 25",
      severity: "high",
      description: "Multi-vehicle accident blocking 2 lanes",
      estimatedDelay: "25-30 min",
      lastUpdated: "2 min ago"
    },
    {
      id: "2", 
      type: "construction",
      location: "Main Street Bridge",
      severity: "medium",
      description: "Bridge maintenance, single lane operation",
      estimatedDelay: "10-15 min",
      lastUpdated: "5 min ago"
    },
    {
      id: "3",
      type: "congestion",
      location: "Downtown Financial District", 
      severity: "medium",
      description: "Heavy rush hour traffic",
      estimatedDelay: "15-20 min",
      lastUpdated: "1 min ago"
    }
  ]);

  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // Simulate real-time updates
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "accident": return AlertTriangle;
      case "construction": return Car;
      case "congestion": return Navigation;
      case "weather": return Clock;
      default: return AlertTriangle;
    }
  };

  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case "high": return "border-status-emergency bg-status-emergency/10";
      case "medium": return "border-status-warning bg-status-warning/10";
      case "low": return "border-status-info bg-status-info/10";
      default: return "border-muted";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return <Badge className="bg-status-emergency text-white">Critical</Badge>;
      case "medium": return <Badge className="bg-status-warning text-black">Moderate</Badge>;
      case "low": return <Badge className="bg-status-info text-white">Minor</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Live Traffic Monitoring</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Real-time traffic updates and incident tracking
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className={`${isLiveMode ? 'bg-status-success' : 'bg-muted'} text-white`}>
              {isLiveMode ? (
                <>
                  <Zap className="mr-1 h-3 w-3" />
                  LIVE
                </>
              ) : (
                'PAUSED'
              )}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiveMode(!isLiveMode)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isLiveMode ? 'Pause' : 'Resume'} Updates
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Live Traffic Map
                </CardTitle>
                <CardDescription>
                  Interactive map showing real-time traffic conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="relative w-full h-[500px] bg-card rounded-lg border border-border overflow-hidden">
                  {/* Map placeholder with traffic visualization */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MapPin className="h-16 w-16 text-primary mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold">Interactive Traffic Map</h3>
                        <p className="text-muted-foreground">
                          Live traffic visualization with color-coded routes
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <TrafficStatusBadge status="free" />
                        <TrafficStatusBadge status="moderate" />
                        <TrafficStatusBadge status="heavy" />
                        <TrafficStatusBadge status="gridlock" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Simulated traffic indicators */}
                  <div className="absolute top-4 left-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-traffic-free rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-traffic-moderate rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-traffic-heavy rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incidents Panel */}
          <div className="space-y-6">
            {/* Current Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-status-warning" />
                  Active Incidents ({incidents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => {
                    const IncidentIcon = getIncidentIcon(incident.type);
                    return (
                      <div
                        key={incident.id}
                        className={`p-4 rounded-lg border ${getIncidentColor(incident.severity)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <IncidentIcon className="h-4 w-4" />
                            <span className="font-medium">{incident.location}</span>
                          </div>
                          {getSeverityBadge(incident.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {incident.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center text-status-warning">
                            <Clock className="mr-1 h-3 w-3" />
                            Delay: {incident.estimatedDelay}
                          </span>
                          <span className="text-muted-foreground">
                            {incident.lastUpdated}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="mr-2 h-5 w-5 text-primary" />
                  Vehicle Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span>Cars</span>
                    </div>
                    <TrafficStatusBadge status="moderate" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bus className="h-4 w-4 text-accent" />
                      <span>Public Transport</span>
                    </div>
                    <TrafficStatusBadge status="free" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-status-warning" />
                      <span>Heavy Vehicles</span>
                    </div>
                    <TrafficStatusBadge status="heavy" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bike className="h-4 w-4 text-status-success" />
                      <span>Two-wheelers</span>
                    </div>
                    <TrafficStatusBadge status="free" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Section */}
            <Card className="border-status-emergency">
              <CardHeader>
                <CardTitle className="text-status-emergency">Emergency Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <EmergencySOSButton />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTracking;