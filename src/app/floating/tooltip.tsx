import * as React from "react";

import {
  TooltipGroup as TooltipGroupPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipArrow as TooltipArrowPrimitive,
  TooltipOverlay as TooltipOverlayPrimitive,
  type TooltipGroupProps as TooltipGroupPrimitiveProps,
  type TooltipProps as TooltipPrimitiveProps,
  type TooltipTriggerProps as TooltipTriggerPrimitiveProps,
  type TooltipContentProps as TooltipContentPrimitiveProps,
} from "@/components/mine/tooltip/static/index";

import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { initialFromSide } from "@/components/mine/tooltip/utils/initial-from-side";

type TooltipGroupProps = TooltipGroupPrimitiveProps;
function TooltipOverlay() {
  return (
    <LayoutGroup>
      <AnimatePresence>
        <TooltipOverlayPrimitive
          render={({ overlayProps, open, side, setOpen, globalId }) => (
            <motion.div
              {...overlayProps}
              layoutId={`tooltip-content-${globalId}`}
              initial={{
                opacity: 0,
                scale: 0,
                ...initialFromSide(side),
              }}
              animate={
                open
                  ? { opacity: 1, scale: 1, x: 0, y: 0 }
                  : {
                      opacity: 0,
                      scale: 0,
                      ...initialFromSide(side),
                    }
              }
              exit={{
                opacity: 0,
                scale: 0,
                ...initialFromSide(side),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              onAnimationComplete={() => {
                if (!open) setOpen(false);
              }}
            />
          )}
        />
      </AnimatePresence>
    </LayoutGroup>
  );
}

function TooltipGroup({ openDelay = 0, ...props }: TooltipGroupProps) {
  return (
    <TooltipGroupPrimitive
      openDelay={openDelay}
      {...props}
      renderTooltipOverlay={<TooltipOverlay />}
      render={(children) => <LayoutGroup>{children}</LayoutGroup>}
    />
  );
}

type TooltipProps = TooltipPrimitiveProps;

function Tooltip({ sideOffset = 6, ...props }: TooltipProps) {
  return <TooltipPrimitive sideOffset={sideOffset} {...props} />;
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps;

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return (
    <TooltipTriggerPrimitive {...props} asChild>
      <motion.div>{props.children}</motion.div>
    </TooltipTriggerPrimitive>
  );
}

type TooltipContentProps = Omit<TooltipContentPrimitiveProps, "asChild"> & {
  children: React.ReactNode;
};

function TooltipContent({
  className,
  children,
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
        <motion.div layout={"preserve-aspect"}>{children}</motion.div>
      </motion.div>
      <TooltipArrowPrimitive
        className="fill-primary size-2.5"
        tipRadius={2}
        render={({ globalId, side, commonProps, DefaultArrow }) => {
          const deg = { top: 0, right: 90, bottom: 180, left: -90 }[side];
          const MotionTooltipArrow = motion.create(DefaultArrow);
          return (
            <MotionTooltipArrow
              layoutId={`tooltip-arrow-${globalId}`}
              style={{ rotate: deg }}
              {...commonProps}
            />
          );
        }}
      />
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
