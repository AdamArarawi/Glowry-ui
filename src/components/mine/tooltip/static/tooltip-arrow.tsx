import * as React from "react";
import { FloatingArrow, type FloatingArrowProps } from "@floating-ui/react";
import {
  useFloatingContext,
  useGlobalTooltip,
  useRenderedTooltip,
} from "./use-tooltip-contexts";

type TooltipArrowRenderProps = {
  context: ReturnType<typeof useFloatingContext>["context"];
  side: string;
  align: string;
  open: boolean;
  ref: React.Ref<SVGSVGElement>;
  arrowRef: React.RefObject<SVGSVGElement | null>;
  DefaultArrow: React.ForwardRefExoticComponent<
    Omit<FloatingArrowProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >; // fallback
  globalId: string;
  commonProps: {
    "data-slot"?: string;
    "data-side"?: string;
    "data-align"?: string;
    "data-state"?: string;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  };
};

type TooltipArrowProps = {
  render?: (props: TooltipArrowRenderProps) => React.ReactNode;
} & Omit<React.ComponentProps<typeof FloatingArrow>, "context"> & {
    ref?: React.Ref<SVGSVGElement> | undefined;
  };

function TooltipArrow({ render, ref, ...props }: TooltipArrowProps) {
  const { globalId } = useGlobalTooltip();

  const { side, align, open } = useRenderedTooltip();
  const { context, arrowRef } = useFloatingContext();

  // handle refs to expose
  React.useImperativeHandle(ref, () => arrowRef.current as SVGSVGElement);
  const commonProps = {
    ref: arrowRef,
    context,
    "data-state": open ? "open" : "closed",
    "data-side": side,
    "data-align": align,
    "data-slot": "tooltip-arrow",
    ...props,
  };
  if (render) {
    // 🧠 render pattern mode
    return (
      <>
        {render({
          context,
          side,
          align,
          open,
          ref: arrowRef,
          arrowRef,
          DefaultArrow: FloatingArrow,
          globalId,
          commonProps,
        })}
      </>
    );
  }

  // 🧱 fallback mode
  return <FloatingArrow {...commonProps} />;
}

export { TooltipArrow, type TooltipArrowProps };
