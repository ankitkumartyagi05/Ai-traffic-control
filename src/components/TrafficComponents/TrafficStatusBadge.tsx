import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TrafficStatus = "free" | "moderate" | "slow" | "heavy" | "gridlock";

interface TrafficStatusBadgeProps {
  status: TrafficStatus;
  className?: string;
}

const statusConfig = {
  free: {
    label: "Free Flow",
    className: "bg-traffic-free text-white border-traffic-free",
  },
  moderate: {
    label: "Moderate",
    className: "bg-traffic-moderate text-black border-traffic-moderate",
  },
  slow: {
    label: "Slow",
    className: "bg-traffic-slow text-white border-traffic-slow",
  },
  heavy: {
    label: "Heavy",
    className: "bg-traffic-heavy text-white border-traffic-heavy",
  },
  gridlock: {
    label: "Gridlock",
    className: "bg-traffic-gridlock text-white border-traffic-gridlock",
  },
};

export function TrafficStatusBadge({ status, className }: TrafficStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold animate-pulse",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}