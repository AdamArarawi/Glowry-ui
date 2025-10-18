// useTooltipGroupCore.ts
import * as React from "react";
import { TooltipData } from "../types";

export function useTooltipGroupCore({
  openDelay = 700,
  closeDelay = 300,
}: {
  openDelay?: number;
  closeDelay?: number;
}) {
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

  return {
    showTooltip,
    hideTooltip,
    hideImmediate,
    setReferenceEl,
    referenceElRef,
    currentTooltip,
  };
}
