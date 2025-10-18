"use client";

import {
  useFloating,
  flip,
  shift,
  offset,
  arrow,
  FloatingArrow,
  autoUpdate,
  FloatingPortal,
  Placement,
  UseFloatingReturn,
} from "@floating-ui/react";
import * as React from "react";
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
  LayoutGroup,
} from "motion/react";

import { getStrictContext } from "@/lib/get-strict-context";
import {
  Slot,
  type WithAsChild,
} from "@/components/animate-ui/primitives/animate/slot";

// ---------------------------
// Types
// ---------------------------
type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

type TooltipContextType = {
  props: HTMLMotionProps<"div">;
  setProps: React.Dispatch<React.SetStateAction<HTMLMotionProps<"div">>>;
  asChild: boolean;
  setAsChild: React.Dispatch<React.SetStateAction<boolean>>;
  side?: Side;
  sideOffset: number;
  alignOffset: number;
  align?: Align;
  id: string;
};

type TooltipData = {
  contentProps: HTMLMotionProps<"div">;
  contentAsChild: boolean;

  id: string;
  rect: DOMRect;
  side: Side;
  align: Align;
  sideOffset: number;
  alignOffset: number;
};

type TooltipGroupProvider = {
  showTooltip: (data: TooltipData) => void;
  hideTooltip: () => void;
  hideImmediate: () => void;
  currentTooltip: TooltipData | null;
  setReferenceEl: (el: HTMLElement | null) => void;
  referenceElRef: React.RefObject<HTMLElement | null>;
  globalId: string;
};
type RenderedTooltipContextType = {
  side: Side;
  align: Align;
  open: boolean;
};
type FloatingContextType = {
  context: UseFloatingReturn["context"];
  arrowRef: React.RefObject<SVGSVGElement | null>;
};
// ---------------------------
// Context
// ---------------------------
const [LocalTooltipProvider, useLocalTooltip] =
  getStrictContext<TooltipContextType>("TooltipProvider");

const [GlobalTooltipProvider, useGlobalTooltip] =
  getStrictContext<TooltipGroupProvider>("TooltipGroupProvider");

const [RenderedTooltipProvider, useRenderedTooltip] =
  getStrictContext<RenderedTooltipContextType>("RenderedTooltipContext");

const [FloatingProvider, useFloatingContext] =
  getStrictContext<FloatingContextType>("FloatingContext");

// ---------------------------
// Tooltip Group
// ---------------------------

type TooltipGroupProps = {
  children: React.ReactNode;
  id?: string;
  openDelay?: number;
  closeDelay?: number;
};

function TooltipGroup({
  children,
  openDelay = 700,
  closeDelay = 300,
  id,
}: TooltipGroupProps) {
  const globalId = React.useId();
  const [currentTooltip, setCurrentTooltip] =
    React.useState<TooltipData | null>(null);
  const referenceElRef = React.useRef<HTMLElement | null>(null);
  const timeoutRef = React.useRef<number | null>(null);
  const lastCloseTimeRef = React.useRef<number>(0);

  const showTooltip = React.useCallback(
    (data: TooltipData) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (currentTooltip !== null) {
        setCurrentTooltip(data);
        return;
      }
      const now = Date.now();
      const delay = now - lastCloseTimeRef.current < closeDelay ? 0 : openDelay;
      timeoutRef.current = window.setTimeout(() => {
        setCurrentTooltip(data);
      }, delay);
    },
    [openDelay, closeDelay, currentTooltip]
  );

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCurrentTooltip(null);
      lastCloseTimeRef.current = Date.now();
    }, closeDelay);
  }, [closeDelay]);

  const hideImmediate = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentTooltip(null);
    lastCloseTimeRef.current = Date.now();
  }, []);

  const setReferenceEl = React.useCallback((el: HTMLElement | null) => {
    referenceElRef.current = el;
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideImmediate();
    };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("scroll", hideImmediate, true);
    window.addEventListener("resize", hideImmediate, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("scroll", hideImmediate, true);
      window.removeEventListener("resize", hideImmediate, true);
    };
  }, [hideImmediate]);

  return (
    <GlobalTooltipProvider
      value={{
        showTooltip,
        hideTooltip,
        hideImmediate,
        currentTooltip,
        setReferenceEl,
        referenceElRef,
        globalId: id ?? globalId,
      }}
    >
      <LayoutGroup>{children}</LayoutGroup>
      <TooltipOverlay />
    </GlobalTooltipProvider>
  );
}

// ---------------------------
// Tooltip Root
// ---------------------------
type TooltipProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  sideOffset?: number;
  alignOffset?: number;
  align?: Align;
  asChild?: boolean;
};

function Tooltip({
  children,
  side,
  sideOffset = 6,
  alignOffset = 0,
  align,
  asChild = false,
}: TooltipProps) {
  const id = React.useId();
  const [props, setProps] = React.useState({});
  const [asChildState, setAsChildState] = React.useState(asChild);

  return (
    <LocalTooltipProvider
      value={{
        side,
        sideOffset,
        alignOffset,
        align,
        props,
        setProps,
        asChild: asChildState,
        setAsChild: setAsChildState,
        id,
      }}
    >
      {children}
    </LocalTooltipProvider>
  );
}

// ---------------------------
// Tooltip Trigger
// ---------------------------
type TooltipTriggerProps = WithAsChild<HTMLMotionProps<"div">>;

function TooltipTrigger({
  ref,
  asChild = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onPointerDown,
  ...props
}: TooltipTriggerProps) {
  const {
    props: contentProps,
    asChild: contentAsChild,
    side,
    sideOffset,
    alignOffset,
    align,
    id,
  } = useLocalTooltip();
  const {
    showTooltip,
    hideTooltip,
    hideImmediate,
    currentTooltip,
    setReferenceEl,
  } = useGlobalTooltip();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLDivElement);
  const suppressNextFocusRef = React.useRef(false);

  const handleOpen = React.useCallback(() => {
    if (!triggerRef.current) return;
    setReferenceEl(triggerRef.current);
    const rect = triggerRef.current.getBoundingClientRect();
    showTooltip({
      id,
      rect,
      side: side ?? "top",
      align: align ?? "center",
      contentAsChild,
      contentProps,
      sideOffset,
      alignOffset,
    });
  }, [
    showTooltip,
    side,
    align,
    contentAsChild,
    contentProps,
    sideOffset,
    alignOffset,
    setReferenceEl,
    id,
  ]);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(e);
      if (currentTooltip?.id === id) {
        suppressNextFocusRef.current = true;
        hideImmediate();
        Promise.resolve().then(() => {
          suppressNextFocusRef.current = false;
        });
      }
    },
    [onPointerDown, currentTooltip?.id, id, hideImmediate]
  );

  const handleMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);
      handleOpen();
    },
    [handleOpen, onMouseEnter]
  );

  const handleMouseLeave = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);
      hideTooltip();
    },
    [hideTooltip, onMouseLeave]
  );

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(e);
      if (suppressNextFocusRef.current) return;
      handleOpen();
    },
    [handleOpen, onFocus]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onBlur?.(e);
      hideTooltip();
    },
    [hideTooltip, onBlur]
  );

  const Comp = asChild ? Slot : motion.div;

  return (
    <Comp
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerDown={handlePointerDown}
      {...props}
    />
  );
}

// ---------------------------
// Helpers
// ---------------------------
function getResolvedSide(placement: Side | `${Side}-${Align}`) {
  if (placement.includes("-")) {
    return placement.split("-")[0] as Side;
  }
  return placement as Side;
}

function getPlacement(side: Side, align: Align = "center"): Placement {
  if (align === "center") return side;
  return `${side}-${align}` as Placement;
}

function initialFromSide(side: Side): Partial<Record<"x" | "y", number>> {
  if (side === "top") return { y: 15 };
  if (side === "bottom") return { y: -15 };
  if (side === "left") return { x: 15 };
  return { x: -15 };
}

function shallowEqualWithoutChildren(
  a?: HTMLMotionProps<"div">,
  b?: HTMLMotionProps<"div">
) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a).filter((k) => k !== "children");
  const keysB = Object.keys(b).filter((k) => k !== "children");
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    // @ts-expect-error index
    if (a[k] !== b[k]) return false;
  }
  return true;
}

// ---------------------------
// Tooltip Content
// ---------------------------
type TooltipContentProps = WithAsChild<HTMLMotionProps<"div">>;

function TooltipContent({ asChild = false, ...props }: TooltipContentProps) {
  const { setProps, setAsChild } = useLocalTooltip();
  const lastPropsRef = React.useRef<HTMLMotionProps<"div"> | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (!shallowEqualWithoutChildren(lastPropsRef.current, props)) {
      lastPropsRef.current = props;
      setProps(props);
    }
  }, [props, setProps]);

  React.useEffect(() => {
    setAsChild(asChild);
  }, [asChild, setAsChild]);

  return null;
}

// ---------------------------
// Tooltip Arrow
// ---------------------------

const MotionTooltipArrow = motion.create(FloatingArrow);

type TooltipArrowProps = Omit<
  React.ComponentProps<typeof MotionTooltipArrow>,
  "context"
> & {
  withTransition?: boolean;
};

function TooltipArrow({ ref, ...props }: TooltipArrowProps) {
  const { side, align, open } = useRenderedTooltip();
  const { context, arrowRef } = useFloatingContext();
  const { globalId } = useGlobalTooltip();
  React.useImperativeHandle(ref, () => arrowRef.current as SVGSVGElement);

  const deg = { top: 0, right: 90, bottom: 180, left: -90 }[side];

  return (
    <MotionTooltipArrow
      ref={arrowRef}
      context={context}
      data-state={open ? "open" : "closed"}
      data-side={side}
      data-align={align}
      data-slot="tooltip-arrow"
      style={{ rotate: deg }}
      layoutId={`tooltip-arrow-${globalId}`}
      {...props}
    />
  );
}

// ---------------------------
// Tooltip Overlay
// ---------------------------

type TooltipOverlayProps = {
  transition?: HTMLMotionProps<"div">["transition"];
};

function TooltipOverlay({
  transition = { type: "spring", stiffness: 300, damping: 35 },
}: TooltipOverlayProps) {
  const { currentTooltip, globalId, referenceElRef } = useGlobalTooltip();

  const [rendered, setRendered] = React.useState<{
    data: TooltipData | null;
    open: boolean;
  }>({ data: null, open: false });

  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const side = rendered.data?.side ?? "top";
  const align = rendered.data?.align ?? "center";

  const { refs, x, y, strategy, context, update } = useFloating({
    placement: getPlacement(side, align),
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({
        mainAxis: rendered.data?.sideOffset ?? 6,
        crossAxis: rendered.data?.alignOffset ?? 0,
      }),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  React.useEffect(() => {
    if (currentTooltip) {
      setRendered({ data: currentTooltip, open: true });
    } else {
      setRendered((p) => (p.data ? { ...p, open: false } : p));
    }
  }, [currentTooltip]);

  React.useLayoutEffect(() => {
    if (referenceElRef.current) {
      refs.setReference(referenceElRef.current);
      update();
    }
  }, [referenceElRef, refs, update, rendered.data]);

  const ready = x !== null && y !== null;
  const Component = rendered.data?.contentAsChild ? Slot : motion.div;
  const resolvedSide = getResolvedSide(context.placement);

  return (
    <AnimatePresence>
      {rendered.data && ready && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            data-slot="tooltip-overlay"
            data-side={resolvedSide}
            data-align={rendered.data.align}
            data-state={rendered.open ? "open" : "closed"}
            style={{
              position: strategy,
              top: y,
              left: x,
              zIndex: 50,
            }}
          >
            <FloatingProvider value={{ context, arrowRef }}>
              <RenderedTooltipProvider
                value={{
                  side: resolvedSide,
                  align: rendered.data.align,
                  open: rendered.open,
                }}
              >
                <Component
                  data-slot="tooltip-content"
                  data-side={resolvedSide}
                  data-align={rendered.data.align}
                  data-state={rendered.open ? "open" : "closed"}
                  layoutId={`tooltip-content-${globalId}`}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    ...initialFromSide(rendered.data.side),
                  }}
                  animate={
                    rendered.open
                      ? { opacity: 1, scale: 1, x: 0, y: 0 }
                      : {
                          opacity: 0,
                          scale: 0,
                          ...initialFromSide(rendered.data.side),
                        }
                  }
                  exit={{
                    opacity: 0,
                    scale: 0,
                    ...initialFromSide(rendered.data.side),
                  }}
                  onAnimationComplete={() => {
                    if (!rendered.open)
                      setRendered({ data: null, open: false });
                  }}
                  transition={transition}
                  {...rendered.data.contentProps}
                  style={{
                    position: "relative",
                    ...(rendered.data.contentProps?.style || {}),
                  }}
                ></Component>
              </RenderedTooltipProvider>
            </FloatingProvider>
          </div>
        </FloatingPortal>
      )}
    </AnimatePresence>
  );
}

export {
  TooltipGroup,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  type TooltipGroupProps,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
  type TooltipArrowProps,
};
