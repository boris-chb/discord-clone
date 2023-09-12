"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const SidebarTooltip: React.FC<SidebarTooltipProps> = ({
  children,
  label,
  align,
  side,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarTooltip;
