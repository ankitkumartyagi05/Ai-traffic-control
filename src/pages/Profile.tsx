import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EcoRewardsCard } from "@/components/EcoRewards/EcoRewardsCard";
import { User, Mail, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTrips();
    } else {
      navigate("/login");
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
      });
    }
  };

  const loadTrips = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setTrips(data);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
      loadProfile();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and view your eco rewards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {formData.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{formData.full_name || "User"}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        className="pl-10"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        className="pl-10"
                        value={user.email}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <Button onClick={handleUpdateProfile} className="w-full">
                      Save Changes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Trips</CardTitle>
                <CardDescription>Your recent registered trips</CardDescription>
              </CardHeader>
              <CardContent>
                {trips.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No trips registered yet</p>
                ) : (
                  <div className="space-y-3">
                    {trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{trip.origin} → {trip.destination}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(trip.travel_date).toLocaleDateString()} • {trip.vehicle_type}
                          </p>
                        </div>
                        <Badge>{trip.trip_id}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-status-emergency">
              <CardContent className="pt-6">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <EcoRewardsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
