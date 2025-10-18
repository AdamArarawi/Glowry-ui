import { motion, AnimatePresence, Transition } from "motion/react";
import { TooltipOverlay as TooltipOverlayCore } from "@/components/mine/tooltip/static/tooltip-overlay";
import { useGlobalTooltip } from "./hooks/use-tooltip-contexts";
import { initialFromSide } from "../mine/tooltip/static/utils/initial-from-side";
import { TooltipData } from "./types";
import React from "react";

export function TooltipOverlayMotion({
  transition,
}: {
  transition?: Transition;
}) {
  const { currentTooltip } = useGlobalTooltip();
  const [rendered, setRendered] = React.useState<{
    data: TooltipData | null;
    open: boolean;
  }>({ data: null, open: false });

  React.useEffect(() => {
    if (currentTooltip) {
      setRendered({ data: currentTooltip, open: true });
    } else {
      setRendered((p) => (p.data ? { ...p, open: false } : p));
    }
  }, [currentTooltip]);
  const globalId = useGlobalTooltip().globalId;

  return (
    <AnimatePresence>
      {rendered.data && (
        <TooltipOverlayCore asChild>
          <motion.div
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
              if (!rendered.open) setRendered({ data: null, open: false });
            }}
            layoutId={`tooltip-overlay-${globalId}`}
            transition={
              transition ?? { type: "spring", stiffness: 300, damping: 25 }
            }
          />
        </TooltipOverlayCore>
      )}
    </AnimatePresence>
  );
}
