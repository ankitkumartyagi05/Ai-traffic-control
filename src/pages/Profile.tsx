import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Car,
  Award,
  History,
  Settings,
  Edit,
  Save,
  Star,
  Navigation,
  Clock,
  Fuel
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    vehicleType: "Sedan",
    licenseNumber: "CA-ABC-1234"
  });
  const { toast } = useToast();

  const tripHistory = [
    {
      id: "TRP123456",
      route: "San Francisco → Los Angeles",
      date: "2024-01-15",
      distance: "380 miles",
      duration: "5h 45m",
      status: "Completed",
      ecoPoints: 150
    },
    {
      id: "TRP123457", 
      route: "Oakland → Sacramento",
      date: "2024-01-12",
      distance: "90 miles",
      duration: "1h 30m", 
      status: "Completed",
      ecoPoints: 80
    },
    {
      id: "TRP123458",
      route: "San Jose → Santa Cruz",
      date: "2024-01-10",
      distance: "35 miles",
      duration: "45m",
      status: "Completed",
      ecoPoints: 60
    }
  ];

  const savedRoutes = [
    {
      id: "1",
      name: "Home to Office",
      route: "Market St → Financial District",
      frequency: "Daily",
      avgTime: "25 min",
      trafficPattern: "moderate"
    },
    {
      id: "2", 
      name: "Weekend Getaway",
      route: "SF → Napa Valley",
      frequency: "Weekly", 
      avgTime: "1h 15m",
      trafficPattern: "free"
    }
  ];

  const ecoStats = {
    totalPoints: 1250,
    currentLevel: "Gold",
    nextLevel: "Platinum",
    pointsToNext: 250,
    achievements: [
      { name: "Eco Warrior", description: "Used eco routes 50 times", earned: true },
      { name: "Public Transport Pro", description: "Used PT 25 times", earned: true },
      { name: "Carbon Saver", description: "Saved 100kg CO2", earned: false },
      { name: "Route Master", description: "Registered 100 trips", earned: false }
    ]
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and track your travel history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{userData.name}</CardTitle>
                  <CardDescription>{userData.email}</CardDescription>
                  <Badge className="mt-1 bg-status-success text-white">
                    {ecoStats.currentLevel} Member
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.vehicleType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{ecoStats.totalPoints} Eco Points</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trips">Trip History</TabsTrigger>
                <TabsTrigger value="routes">Saved Routes</TabsTrigger>
                <TabsTrigger value="rewards">Eco Rewards</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={userData.location}
                          onChange={(e) => setUserData({...userData, location: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-4 flex space-x-2">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-primary">{tripHistory.length}</div>
                      <p className="text-sm text-muted-foreground">Total Trips</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-status-success">{ecoStats.totalPoints}</div>
                      <p className="text-sm text-muted-foreground">Eco Points</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-status-info">{savedRoutes.length}</div>
                      <p className="text-sm text-muted-foreground">Saved Routes</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Trip History Tab */}
              <TabsContent value="trips" className="space-y-4">
                {tripHistory.map((trip) => (
                  <Card key={trip.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{trip.route}</h3>
                        <Badge className="bg-status-success text-white">
                          {trip.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{trip.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{trip.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <History className="h-3 w-3" />
                          <span>{trip.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-status-success">
                          <Award className="h-3 w-3" />
                          <span>+{trip.ecoPoints} points</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Saved Routes Tab */}
              <TabsContent value="routes" className="space-y-4">
                {savedRoutes.map((route) => (
                  <Card key={route.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{route.name}</h3>
                        <Badge variant="secondary">{route.frequency}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{route.route}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{route.avgTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Navigation className="h-3 w-3 text-primary" />
                          <span className="capitalize">{route.trafficPattern} traffic</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Eco Rewards Tab */}
              <TabsContent value="rewards" className="space-y-6">
                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-status-success" />
                      Eco Rewards Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{ecoStats.currentLevel}</span>
                        <span className="text-sm text-muted-foreground">
                          {ecoStats.pointsToNext} points to {ecoStats.nextLevel}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-status-success h-2 rounded-full transition-all"
                          style={{ width: `${((ecoStats.totalPoints % 500) / 500) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-center text-2xl font-bold text-status-success">
                        {ecoStats.totalPoints} Points
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ecoStats.achievements.map((achievement, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border ${
                            achievement.earned 
                              ? 'border-status-success bg-status-success/10' 
                              : 'border-muted bg-muted/10'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className={`h-5 w-5 ${
                              achievement.earned ? 'text-status-success fill-status-success' : 'text-muted-foreground'
                            }`} />
                            <span className="font-semibold">{achievement.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;