import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Navigation, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripSlipProps {
  tripId: string;
  origin: string;
  destination: string;
  state: string;
  district: string;
  vehicleType: string;
  travelDate: string;
}

export function TripSlip({ tripId, origin, destination, state, district, vehicleType, travelDate }: TripSlipProps) {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleFindRoute = () => {
    navigate(`/route-finder?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  return (
    <Card className="border-status-success bg-status-success/5 print:border-2 print:border-black">
      <CardContent className="p-6 space-y-6">
        <div className="text-center border-b pb-4">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-status-success mr-2" />
            <h2 className="text-2xl font-bold text-status-success">Trip Registered!</h2>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1 bg-status-success text-white">
            {tripId}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">Origin:</p>
            <p className="font-semibold">{origin}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Destination:</p>
            <p className="font-semibold">{destination}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">State:</p>
            <p className="font-semibold">{state}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">District:</p>
            <p className="font-semibold">{district || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Vehicle Type:</p>
            <p className="font-semibold">{vehicleType}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Travel Date:</p>
            <p className="font-semibold">{new Date(travelDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            This permit is valid for the registered journey. Please carry this document during travel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Print Permit
          </Button>
          <Button onClick={handleFindRoute} className="flex-1">
            <Navigation className="mr-2 h-4 w-4" />
            Find Best Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
