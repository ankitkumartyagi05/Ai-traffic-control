import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { INDIAN_STATES, ECO_TRANSPORT_MODES } from "@/lib/constants";
import { TripSlip } from "./TripSlip";
import { tripRegistrationSchema } from "@/lib/validations";

export function TripRegistration() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    state: "",
    district: "",
    vehicleType: "",
    travelDate: "",
  });
  const [tripId, setTripId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register a trip.",
        variant: "destructive",
      });
      return;
    }

    const validationResult = tripRegistrationSchema.safeParse({
      origin: formData.origin,
      destination: formData.destination,
      state: formData.state,
      district: formData.district,
      vehicleType: formData.vehicleType,
      travelDate: formData.travelDate
    });

    if (!validationResult.success) {
      toast({
        title: "Validation Error",
        description: validationResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate trip ID
      const id = `TRP${Date.now().toString().slice(-6)}`;
      
      // Save trip to database
      const { error } = await supabase.from('trips').insert({
        user_id: user.id,
        trip_id: id,
        origin: formData.origin,
        destination: formData.destination,
        state: formData.state,
        district: formData.district,
        vehicle_type: formData.vehicleType,
        travel_date: formData.travelDate,
        status: 'pending',
      });

      if (error) throw error;

      setTripId(id);
      
      toast({
        title: "Trip Registered Successfully! 🎉",
        description: `Your Trip ID: ${id}. Permit is ready for download.`,
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPermit = () => {
    toast({
      title: "📄 Permit Downloaded",
      description: "Trip permit has been saved to your device.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            Register New Trip
          </CardTitle>
          <CardDescription>
            Register your journey to get official permits and tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  placeholder="Starting location"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Destination location"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State / Union Territory</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  placeholder="District name"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  placeholder="e.g., Car, Bus, Truck, Motorcycle"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelDate">Travel Date</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              <Car className="mr-2 h-4 w-4" />
              {isSubmitting ? "Registering..." : "Register Trip"}
            </Button>
          </form>

          {tripId && (
            <div className="mt-6">
              <TripSlip
                tripId={tripId}
                origin={formData.origin}
                destination={formData.destination}
                state={formData.state}
                district={formData.district}
                vehicleType={formData.vehicleType}
                travelDate={formData.travelDate}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
