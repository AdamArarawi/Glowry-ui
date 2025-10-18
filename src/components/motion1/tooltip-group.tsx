// TooltipGroupCore.tsx
import React from "react";
import { GlobalTooltipProvider } from "./hooks/use-tooltip-contexts";
import { useTooltipGroupCore } from "./hooks/useTooltipGroupCore";
import { TooltipOverlayMotion } from "./tooltip-overlay";
import { LayoutGroup } from "motion/react";

export type TooltipGroupProps = {
  children: React.ReactNode;
  id?: string;
  openDelay?: number;
  closeDelay?: number;
};

export function TooltipGroup({
  children,
  id,
  openDelay,
  closeDelay,
}: TooltipGroupProps) {
  const globalId = React.useId();
  const core = useTooltipGroupCore({ openDelay, closeDelay });

  return (
    <GlobalTooltipProvider
      value={{
        ...core,
        globalId: id ?? globalId,
      }}
    >
      <LayoutGroup>
        {children}
        <TooltipOverlayMotion />
      </LayoutGroup>
    </GlobalTooltipProvider>
  );
}
