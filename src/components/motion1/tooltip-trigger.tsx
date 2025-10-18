import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { TooltipTrigger as TooltipTriggerPrimitive } from "@/components/mine/tooltip/static/tooltip-trigger";
import { WithAsChild } from "@/components/animate-ui/primitives/animate/slot";
import { Slot } from "@/components/animate-ui/primitives/animate/slot";

type TooltipTriggerProps = WithAsChild<HTMLMotionProps<"div">>;

function TooltipTrigger({ asChild = false, ...props }: TooltipTriggerProps) {
  const Comp = asChild ? Slot : motion.div;
  return (
    <TooltipTriggerPrimitive asChild={true}>
      <Comp {...props} />
    </TooltipTriggerPrimitive>
  );
}

export { TooltipTrigger, type TooltipTriggerProps };
