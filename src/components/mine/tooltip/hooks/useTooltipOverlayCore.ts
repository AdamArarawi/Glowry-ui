import React from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
} from "@floating-ui/react";
import { getPlacement } from "../utils/get-placement";

export interface BaseTooltipData {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

export function useTooltipOverlayLogic<TTooltipData extends BaseTooltipData>(
  currentTooltip: TTooltipData | null,
  referenceElRef: React.RefObject<HTMLElement | null>
) {
  const [rendered, setRendered] = React.useState<{
    data: TTooltipData | null;
    open: boolean;
  }>({ data: null, open: false });

  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const side = rendered.data?.side ?? "top";
  const align = rendered.data?.align ?? "center";

  const floating = useFloating({
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
      floating.refs.setReference(referenceElRef.current);
      floating.update();
    }
  }, [referenceElRef, floating.refs, floating.update, rendered.data]);

  const ready = floating.x !== null && floating.y !== null;

  return {
    rendered,
    ready,
    side,
    align,
    floating,
    arrowRef,
    setRendered,
  };
}
