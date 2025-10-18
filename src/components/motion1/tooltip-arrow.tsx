import { FloatingArrow } from "@floating-ui/react";
import {
  useFloatingContext,
  useGlobalTooltip,
  useRenderedTooltip,
} from "../mine/tooltip/static/use-tooltip-contexts";
import React from "react";
import { motion } from "motion/react";

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

export { TooltipArrow, type TooltipArrowProps };
