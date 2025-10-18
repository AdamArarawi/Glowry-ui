"use client";

import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  Placement,
  FloatingPortal,
  FloatingFocusManager,
  FloatingArrow,
  arrow,
} from "@floating-ui/react";
import { motion, AnimatePresence, type HTMLMotionProps } from "motion/react";
import { Slot } from "@/components/animate-ui/primitives/animate/slot";
import { getStrictContext } from "@/lib/get-strict-context";
import { useControlledState } from "@/hooks/use-controlled-state";

// ---------------------------
// Helpers
// ---------------------------

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

function getPlacement(side: Side, align: Align = "center"): Placement {
  return align === "center" ? side : `${side}-${align}`;
}

// ---------------------------
// Hook
// ---------------------------

interface PopoverOptions {
  defaultOpen?: boolean;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  sideOffset?: number;
  alignOffset?: number;
  align?: Align;
}

export function usePopover({
  defaultOpen = false,
  modal = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  side = "bottom",
  sideOffset = 6,
  alignOffset = 0,
  align = "center",
}: PopoverOptions = {}) {
  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const [open, setOpen] = useControlledState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: setControlledOpen,
  });

  const data = useFloating({
    whileElementsMounted: autoUpdate,
    placement: getPlacement(side, align),
    open,
    onOpenChange: setOpen,
    middleware: [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      flip({ padding: 5, fallbackAxisSideDirection: "end" }),
      shift({ padding: 5, limiter: limitShift() }),
      arrow({ element: arrowRef }),
    ],
  });

  const context = data.context;
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    // ancestorScroll: true,
    escapeKey: true,
  });
  const role = useRole(context);
  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      modal,
      side: data.placement.split("-")[0] as Side,
      align: data.placement.split("-")[1] as Align,
      sideOffset,
      alignOffset,
      ...data,
      ...interactions,
      context,
      arrowRef,
    }),
    [
      open,
      setOpen,
      modal,
      data,
      sideOffset,
      alignOffset,
      interactions,
      context,
      arrowRef,
    ]
  );
}

// ---------------------------
// Context
// ---------------------------

type PopoverContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refs: ReturnType<typeof useFloating>["refs"];
  floatingStyles: React.CSSProperties;
  x: number | null;
  y: number | null;
  strategy: React.CSSProperties["position"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
  context: ReturnType<typeof useFloating>["context"];
  modal: boolean;
  side: Side;
  align: Align;
  sideOffset: number;
  alignOffset: number;
  id: string;
  arrowRef: React.RefObject<SVGSVGElement | null>;
};

const [PopoverProvider, usePopoverContext] =
  getStrictContext<PopoverContextType>("Popover");

// ---------------------------
// Root
// ---------------------------

interface PopoverRootProps extends PopoverOptions {
  children?: React.ReactNode;
}

function Popover(props: PopoverRootProps) {
  const id = React.useId();
  const popover = usePopover(props);

  const contextValue: PopoverContextType = {
    open: popover.open,
    setOpen: popover.setOpen,
    refs: popover.refs,
    floatingStyles: popover.floatingStyles,
    x: popover.x,
    y: popover.y,
    strategy: popover.strategy,
    getReferenceProps: popover.getReferenceProps,
    getFloatingProps: popover.getFloatingProps,
    context: popover.context,
    modal: popover.modal,
    side: popover.side,
    align: popover.align,
    sideOffset: popover.sideOffset,
    alignOffset: popover.alignOffset,
    id,
    arrowRef: popover.arrowRef,
  };

  return (
    <PopoverProvider value={contextValue}>{props.children}</PopoverProvider>
  );
}

// ---------------------------
// Trigger
// ---------------------------

type PopoverTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
};

function PopoverTrigger({ asChild, children }: PopoverTriggerProps) {
  const { open, setOpen, getReferenceProps, refs, id } = usePopoverContext();
  const ref = useMergeRefs([refs.setReference]);
  const Comp = asChild ? Slot : motion.div;

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    },
    [open, setOpen]
  );

  const triggerId = React.useId();

  return (
    <Comp
      ref={ref}
      {...getReferenceProps()}
      id={triggerId}
      aria-expanded={open || undefined}
      aria-controls={open ? id : undefined}
      data-state={open ? "open" : "closed"}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Comp>
  );
}
// ---------------------------
// Content
// ---------------------------

interface PopoverContentProps extends HTMLMotionProps<"div"> {
  asChild?: boolean;
  children: React.ReactNode;
  transition?: HTMLMotionProps<"div">["transition"];
  motionProps?: {
    initial?: HTMLMotionProps<"div">["initial"];
    animate?: HTMLMotionProps<"div">["animate"];
    exit?: HTMLMotionProps<"div">["exit"];
  };
  ariaLabel?: string;
  ariaLabelledby?: string;
}

function getMotionFromPlacement(side: Side, align: Align) {
  const offset = 35; // قوة الحركة
  const skew = 40; // انحراف خفيف لمحاذاة align start/end

  let x = 0;
  let y = 0;

  switch (side) {
    case "top":
      y = offset;
      if (align === "start") x = -skew;
      else if (align === "end") x = skew;
      break;
    case "bottom":
      y = -offset;
      if (align === "start") x = -skew;
      else if (align === "end") x = skew;
      break;
    case "left":
      x = offset;
      if (align === "start") y = -offset;
      else if (align === "end") y = offset;
      break;
    case "right":
      x = -offset;
      if (align === "start") y = -offset;
      else if (align === "end") y = offset;
      break;
  }

  return {
    initial: {
      opacity: 0,
      scale: 0.8,
      x,
      y,
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x,
      y,
    },
  };
}

function PopoverContent({
  asChild = false,
  children,
  transition = { type: "spring", stiffness: 300, damping: 25 },
  motionProps,
  ariaLabel,
  ariaLabelledby,
  ...props
}: PopoverContentProps) {
  const {
    open,
    getFloatingProps,
    refs,
    floatingStyles,
    context,
    modal,
    strategy,
    side,
    align,
  } = usePopoverContext();

  const ref = useMergeRefs([refs.setFloating]);
  const Comp = asChild ? Slot : motion.div;

  const defaultMotion = motionProps ?? getMotionFromPlacement(side, align);

  return (
    <AnimatePresence>
      {open && (
        <FloatingPortal>
          <div
            ref={ref}
            data-slot="tooltip-overlay"
            data-side={side}
            data-align={align}
            data-state={open ? "open" : "closed"}
            style={{
              position: strategy,
              ...floatingStyles,
              zIndex: 50,
            }}
          >
            <FloatingFocusManager context={context} modal={modal}>
              <Comp
                data-slot="popover-content"
                data-side={side}
                data-align={align}
                key={`${side}-${align}`}
                data-state={open ? "open" : "closed"}
                {...getFloatingProps()}
                {...props}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                initial={defaultMotion.initial}
                animate={defaultMotion.animate}
                exit={defaultMotion.exit}
                transition={transition}
                style={{
                  position: "relative",
                  ...(props.style || {}),
                }}
              >
                {children}
              </Comp>
            </FloatingFocusManager>
          </div>
        </FloatingPortal>
      )}
    </AnimatePresence>
  );
}

// ---------------------------
// Arrow
// ---------------------------

const MotionFloatingArrow = motion.create(FloatingArrow);

type PopoverArrowProps = Omit<
  React.ComponentProps<typeof MotionFloatingArrow>,
  "context"
>;

function PopoverArrow({ ref, ...props }: PopoverArrowProps) {
  const { context, side, align, open, arrowRef } = usePopoverContext();
  React.useImperativeHandle(ref, () => arrowRef.current as SVGSVGElement);

  const deg = { top: 0, right: 90, bottom: 180, left: -90 }[side];

  return (
    <MotionFloatingArrow
      ref={arrowRef}
      context={context}
      data-slot="popover-arrow"
      data-side={side}
      data-align={align}
      data-state={open ? "open" : "closed"}
      style={{ rotate: deg }}
      {...props}
    />
  );
}

// ---------------------------
// Exports
// ---------------------------

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  type PopoverArrowProps,
};
