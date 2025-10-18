import React from "react";
import {
  FloatingProvider,
  RenderedTooltipProvider,
  useGlobalTooltip,
} from "./use-tooltip-contexts";
import { Align, Side, TooltipData } from "./types";
import { getResolvedSide } from "@/components/mine/tooltip/utils/get-placement";
import { useTooltipOverlayLogic } from "@/components/mine/tooltip/hooks/useTooltipOverlayCore";
import { FloatingPortal } from "@floating-ui/react";

type renderProps = {
  /** الحالة الحالية للتولتيب */
  open: boolean;
  /** الجهة المحسوبة */
  side: Side;
  /** المحاذاة */
  align: Align;
  /** props الجاهزة لتطبيقها على العنصر الخارجي */
  overlayProps: {
    "data-slot"?: string;
    "data-side"?: string;
    "data-align"?: string;
    "data-state"?: string;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  };
  /** محتوى التولتيب */
  content: React.ReactNode;
  /** تعيين الحالة */
  setOpen: (val: boolean) => void;
  globalId: string;
};

export type TooltipOverlayProps = {
  render?: (props: renderProps) => React.ReactNode;
};

function TooltipOverlay({ render }: TooltipOverlayProps) {
  const { currentTooltip, referenceElRef, globalId } = useGlobalTooltip();

  const { rendered, ready, align, floating, arrowRef, setRendered } =
    useTooltipOverlayLogic<TooltipData>(currentTooltip, referenceElRef);

  const resolvedSide = getResolvedSide(floating.context.placement);

  const setOpen = (val: boolean) =>
    setRendered({ data: rendered.data, open: val });

  const commonProps = {
    "data-slot": "tooltip-content",
    "data-side": resolvedSide,
    "data-align": align,
    "data-state": rendered.open ? "open" : "closed",
    style: {
      ...(rendered?.data?.contentProps?.style || {}),
    },
    ...rendered?.data?.contentProps,
  };

  const content = <div {...commonProps} />;

  const finalRender = render
    ? render({
        open: rendered.open,
        side: resolvedSide,
        align,
        overlayProps: commonProps,
        content,
        setOpen,
        globalId,
      })
    : content;

  if (!rendered.data || !ready) return null;

  return (
    <FloatingPortal>
      <div
        ref={floating.refs.setFloating}
        data-slot="tooltip-overlay"
        data-side={resolvedSide}
        data-align={align}
        data-state={rendered.open ? "open" : "closed"}
        style={{
          position: floating.strategy,
          top: floating.y,
          left: floating.x,
          zIndex: 50,
        }}
      >
        <FloatingProvider value={{ context: floating.context, arrowRef }}>
          <RenderedTooltipProvider
            value={{
              side: resolvedSide,
              align,
              open: rendered.open,
            }}
          >
            {finalRender}
          </RenderedTooltipProvider>
        </FloatingProvider>
      </div>
    </FloatingPortal>
  );
}

export { TooltipOverlay };
