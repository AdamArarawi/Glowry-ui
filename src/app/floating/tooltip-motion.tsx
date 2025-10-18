import * as React from "react";
import * as motion from "motion/react-client";

import {
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  TooltipGroup as TooltipGroupPrimitive,
  type TooltipGroupProps as TooltipGroupPrimitiveProps,
  TooltipArrow as TooltipArrowPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
  type TooltipTriggerProps as TooltipTriggerPrimitiveProps,
  TooltipContent as TooltipContentPrimitive,
  type TooltipContentProps as TooltipContentPrimitiveProps,
} from "@/components/mine/tooltip/tooltip";

import { cn } from "@/lib/utils";

type TooltipGroupProps = TooltipGroupPrimitiveProps;

function TooltipGroup({ openDelay = 0, ...props }: TooltipGroupProps) {
  return <TooltipGroupPrimitive openDelay={openDelay} {...props} />;
}

type TooltipProps = TooltipPrimitiveProps;

function Tooltip({ sideOffset = 6, ...props }: TooltipProps) {
  return <TooltipPrimitive sideOffset={sideOffset} {...props} />;
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps;

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipTriggerPrimitive {...props} />;
}

type TooltipContentProps = Omit<TooltipContentPrimitiveProps, "asChild"> & {
  children: React.ReactNode;
  layout?: boolean | "position" | "size" | "preserve-aspect";
};

function TooltipContent({
  className,
  children,
  layout = "preserve-aspect",
  ...props
}: TooltipContentProps) {
  return (
    <TooltipContentPrimitive
      className={cn(
        "p-2 bg-primary-foreground text-primary rounded-md shadow-md",
        className
      )}
      {...props}
    >
      <motion.div className="overflow-hidden text-xs text-balance">
        <motion.div layout={layout}>{children}</motion.div>
      </motion.div>
      <TooltipArrowPrimitive className="fill-primary size-2.5" tipRadius={2} />
    </TooltipContentPrimitive>
  );
}

export {
  TooltipGroup,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  type TooltipGroupProps,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
};
