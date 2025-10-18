// TooltipGroupCore.tsx
import React from "react";
import { GlobalTooltipProvider } from "./use-tooltip-contexts";
import { useTooltipGroupCore } from "@/components/mine/tooltip/hooks/useTooltipGroupCore";
import { TooltipOverlay } from "./tooltip-overlay";
import { TooltipData } from "./types";

export type TooltipGroupProps = {
  children: React.ReactNode;
  id?: string;
  openDelay?: number;
  closeDelay?: number;
  renderTooltipOverlay?: React.ReactNode;
  render?: (children: React.ReactNode) => React.ReactNode;
};

export function TooltipGroup({
  children,
  id,
  openDelay,
  closeDelay,
  renderTooltipOverlay,
  render,
}: TooltipGroupProps) {
  const globalId = React.useId();
  const core = useTooltipGroupCore<TooltipData>({ openDelay, closeDelay });

  return (
    <GlobalTooltipProvider
      value={{
        ...core,
        globalId: id ?? globalId,
      }}
    >
      {render ? render(children) : children}
      {renderTooltipOverlay ? renderTooltipOverlay : <TooltipOverlay />}
    </GlobalTooltipProvider>
  );
}
