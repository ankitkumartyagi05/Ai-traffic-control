import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Award, TrendingUp, Bike, Bus, Footprints } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function EcoRewardsCard() {
  const [ecoPoints, setEcoPoints] = useState(0);
  const [recentRewards, setRecentRewards] = useState<any[]>([]);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadEcoRewards();
    }
  }, [user]);

  const loadEcoRewards = async () => {
    if (!user) return;

    try {
      // Load profile with eco points
      const { data: profile } = await supabase
        .from('profiles')
        .select('eco_points')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setEcoPoints(profile.eco_points || 0);
      }

      // Load recent eco rewards
      const { data: rewards } = await supabase
        .from('eco_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false })
        .limit(5);

      if (rewards) {
        setRecentRewards(rewards);
        const totalCO2 = rewards.reduce((sum, r) => sum + (parseFloat(String(r.co2_saved_kg || 0)) || 0), 0);
        setTotalCO2Saved(totalCO2);
      }
    } catch (error: any) {
      console.error('Error loading eco rewards:', error);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'bicycle': return <Bike className="h-4 w-4" />;
      case 'public_transport': return <Bus className="h-4 w-4" />;
      default: return <Footprints className="h-4 w-4" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'public_transport': return 'Public Transport';
      case 'bicycle': return 'Bicycle';
      case 'walking': return 'Walking';
      case 'running': return 'Running';
      case 'jogging': return 'Jogging';
      default: return mode;
    }
  };

  return (
    <Card className="border-status-success">
      <CardHeader>
        <CardTitle className="flex items-center text-status-success">
          <Leaf className="mr-2 h-5 w-5" />
          Eco Rewards
        </CardTitle>
        <CardDescription>
          Earn points by using eco-friendly transport modes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Points */}
        <div className="text-center p-6 bg-status-success/10 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-8 w-8 text-status-success mr-2" />
            <h3 className="text-4xl font-bold text-status-success">{ecoPoints}</h3>
          </div>
          <p className="text-muted-foreground">Total Eco Points</p>
        </div>

        {/* CO2 Saved */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-status-success" />
            <span className="font-medium">CO₂ Saved</span>
          </div>
          <Badge className="bg-status-success text-white">
            {totalCO2Saved.toFixed(2)} kg
          </Badge>
        </div>

        {/* Points by Mode */}
        <div className="space-y-3">
          <h4 className="font-semibold">Earn Points:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="flex items-center text-sm">
                <Bus className="h-3 w-3 mr-1" />
                Public Transport
              </span>
              <Badge variant="secondary">+10</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="flex items-center text-sm">
                <Bike className="h-3 w-3 mr-1" />
                Bicycle
              </span>
              <Badge variant="secondary">+20</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="flex items-center text-sm">
                <Footprints className="h-3 w-3 mr-1" />
                Walking
              </span>
              <Badge variant="secondary">+25</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="flex items-center text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                Running
              </span>
              <Badge variant="secondary">+25</Badge>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentRewards.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Recent Activity:</h4>
            {recentRewards.slice(0, 3).map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2">
                  {getModeIcon(reward.transport_mode)}
                  <span className="text-sm">{getModeLabel(reward.transport_mode)}</span>
                </div>
                <Badge className="bg-status-success text-white">
                  +{reward.points_earned} pts
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Progress to Next Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress to Next Level</span>
            <span className="font-medium">{ecoPoints % 100}/100</span>
          </div>
          <Progress value={(ecoPoints % 100)} />
        </div>
      </CardContent>
    </Card>
  );
}
