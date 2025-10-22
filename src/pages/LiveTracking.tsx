import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrafficStatusBadge } from "@/components/TrafficComponents/TrafficStatusBadge";
import { EmergencySOSButton } from "@/components/TrafficComponents/EmergencySOSButton";
import { TrafficMap } from "@/components/Map/TrafficMap";
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
  Zap,
  Shield,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrafficIncident {
  id: string;
  type: "accident" | "construction" | "congestion" | "weather" | "event";
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  estimated_delay_minutes: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

const LiveTracking = () => {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadTrafficIncidents();

    if (isLiveMode) {
      const interval = setInterval(() => {
        loadTrafficIncidents();
        setLastUpdate(new Date());
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const loadTrafficIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('traffic_incidents')
        .select('*')
        .eq('status', 'active')
        .order('severity', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        setIncidents(data as TrafficIncident[]);
      }
    } catch (error: any) {
      console.error('Error loading traffic incidents:', error);
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "accident": return AlertTriangle;
      case "construction": return Car;
      case "congestion": return Navigation;
      case "event": return Users;
      case "weather": return Clock;
      default: return AlertTriangle;
    }
  };

  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-status-emergency bg-status-emergency/10";
      case "high": return "border-status-emergency bg-status-emergency/10";
      case "medium": return "border-status-warning bg-status-warning/10";
      case "low": return "border-status-info bg-status-info/10";
      default: return "border-muted";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return <Badge className="bg-status-emergency text-white">Critical</Badge>;
      case "high": return <Badge className="bg-status-emergency text-white">High</Badge>;
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
            Real-time traffic updates with AI-powered incident tracking
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
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
            <Badge className="bg-primary"><Shield className="mr-1 h-3 w-3" />Emergency Priority Active</Badge>
            <Badge className="bg-status-info text-white"><Users className="mr-1 h-3 w-3" />Pedestrian Optimization</Badge>
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
          {/* Traffic Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Live Traffic Map
                </CardTitle>
                <CardDescription>
                  Interactive map with real-time traffic incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrafficMap 
                  incidents={incidents.map(inc => ({
                    id: inc.id,
                    latitude: Number(inc.latitude) || 0,
                    longitude: Number(inc.longitude) || 0,
                    type: inc.type,
                    severity: inc.severity,
                    description: inc.description || undefined,
                  }))}
                />
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
                <CardDescription>Real-time incident detection & dynamic rerouting</CardDescription>
              </CardHeader>
              <CardContent>
                {incidents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No active incidents</p>
                ) : (
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
                              Delay: {incident.estimated_delay_minutes} min
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(incident.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="mr-2 h-5 w-5 text-primary" />
                  Vehicle Categories
                </CardTitle>
                <CardDescription>Real-time tracking by vehicle type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span>Private Cars</span>
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
                <CardTitle className="text-status-emergency flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Emergency Assistance
                </CardTitle>
                <CardDescription>Instant emergency vehicle prioritization</CardDescription>
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
