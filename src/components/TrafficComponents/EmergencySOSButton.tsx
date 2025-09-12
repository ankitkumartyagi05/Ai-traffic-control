import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, MapPin, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmergencySOSButton() {
  const [isActivated, setIsActivated] = useState(false);
  const { toast } = useToast();

  const handleSOSActivation = () => {
    setIsActivated(true);
    toast({
      title: "🚨 SOS ACTIVATED",
      description: "Emergency services have been notified. Stay calm, help is on the way.",
      variant: "destructive",
    });
    
    // Simulate location sharing
    setTimeout(() => {
      toast({
        title: "📍 Location Shared",
        description: "Your location has been shared with emergency contacts and authorities.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="lg"
            className={`w-full h-16 text-lg font-bold animate-pulse ${
              isActivated ? "bg-status-emergency" : ""
            }`}
          >
            <AlertTriangle className="mr-2 h-6 w-6" />
            EMERGENCY SOS
            {isActivated && (
              <Badge className="ml-2 bg-white text-status-emergency">
                ACTIVE
              </Badge>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-status-emergency">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Activate Emergency SOS?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately:
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Alert emergency services</li>
                <li>• Share your current location</li>
                <li>• Notify your emergency contacts</li>
                <li>• Connect you to the nearest police station</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSOSActivation}
              className="bg-status-emergency hover:bg-status-emergency/90"
            >
              Activate SOS
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isActivated && (
        <div className="space-y-3 p-4 border border-status-emergency rounded-lg bg-status-emergency/10">
          <h3 className="font-semibold text-status-emergency">Emergency Services</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Phone className="mr-2 h-4 w-4" />
              Police: 100
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Phone className="mr-2 h-4 w-4" />
              Ambulance: 108
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <MapPin className="mr-2 h-4 w-4" />
              Share Location
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}