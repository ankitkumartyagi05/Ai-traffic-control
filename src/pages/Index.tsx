import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  MapPin,
  Navigation,
  AlertTriangle,
  Award,
  MessageCircle,
  Users,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { TrafficStatusBadge } from "@/components/TrafficComponents/TrafficStatusBadge";
import { EmergencySOSButton } from "@/components/TrafficComponents/EmergencySOSButton";
import heroImage from "@/assets/hero-traffic.jpg";

const Index = () => {
  const features = [
    {
      icon: MapPin,
      title: "Trip Registration",
      description: "Get official permits and track your journeys with smart route planning",
      color: "text-primary",
      href: "/register-trip"
    },
    {
      icon: Navigation,
      title: "Smart Route Finder", 
      description: "AI-powered route optimization with real-time traffic analysis",
      color: "text-status-info",
      href: "/route-finder"
    },
    {
      icon: AlertTriangle,
      title: "Live Traffic Monitoring",
      description: "Real-time traffic updates, alerts, and congestion predictions",
      color: "text-status-warning",
      href: "/tracking"
    },
    {
      icon: Shield,
      title: "Emergency SOS",
      description: "Instant emergency assistance with location sharing and alerts",
      color: "text-status-emergency",
      href: "/emergency"
    },
    {
      icon: Award,
      title: "Eco Rewards",
      description: "Earn points for eco-friendly travel choices and unlock rewards", 
      color: "text-status-success",
      href: "/rewards"
    },
    {
      icon: MessageCircle,
      title: "AI Support Chat",
      description: "24/7 intelligent assistance for all your traffic queries",
      color: "text-accent",
      href: "/support"
    }
  ];

  const stats = [
    { label: "Active Users", value: "2.4M+", icon: Users },
    { label: "Traffic Accuracy", value: "98.5%", icon: TrendingUp },
    { label: "Response Time", value: "<2s", icon: Clock },
    { label: "Cities Covered", value: "150+", icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Traffic System Dashboard" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-background/50" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🚀 Next-Gen Traffic Intelligence
          </Badge>
          
          <h1 className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            AI Pocket Traffic System
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of traffic management with AI-powered route optimization, 
            real-time monitoring, and intelligent emergency assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="shadow-glow" asChild>
              <Link to="/register-trip">
                <Car className="mr-2 h-5 w-5" />
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/route-finder">
                <Navigation className="mr-2 h-5 w-5" />
                Find Routes
              </Link>
            </Button>
          </div>

          {/* Live Traffic Status */}
          <div className="flex flex-wrap gap-3 justify-center">
            <TrafficStatusBadge status="free" />
            <TrafficStatusBadge status="moderate" />
            <TrafficStatusBadge status="heavy" />
            <span className="text-sm text-muted-foreground">Live Traffic Status</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligent Traffic Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for safe, efficient, and eco-friendly travel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-traffic transition-all duration-300 border-border/50 hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-background ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <Link to={feature.href}>
                      Explore Feature
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency SOS Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6 text-status-emergency">
              Emergency Assistance
            </h3>
            <EmergencySOSButton />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Travel?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of smart travelers using AI-powered traffic intelligence
          </p>
          <Button size="lg" variant="secondary" className="shadow-elevated" asChild>
            <Link to="/register-trip">
              <MapPin className="mr-2 h-5 w-5" />
              Get Started Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
