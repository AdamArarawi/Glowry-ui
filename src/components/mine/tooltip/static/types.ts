import { UseFloatingReturn } from "@floating-ui/react";
// import { HTMLAttributes } from "react";

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";
export type Tooltipprops = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export type TooltipContextType = {
  props: Tooltipprops;
  setProps: React.Dispatch<React.SetStateAction<Tooltipprops>>;
  asChild: boolean;
  setAsChild: React.Dispatch<React.SetStateAction<boolean>>;
  side?: Side;
  sideOffset: number;
  alignOffset: number;
  align?: Align;
  id: string;
};

export type TooltipData = {
  contentProps: Tooltipprops;
  contentAsChild: boolean;
  id: string;
  rect: DOMRect;
  side: Side;
  align: Align;
  sideOffset: number;
  alignOffset: number;
};

export type TooltipGroupProvider = {
  showTooltip: (data: TooltipData) => void;
  hideTooltip: () => void;
  hideImmediate: () => void;
  currentTooltip: TooltipData | null;
  setReferenceEl: (el: HTMLElement | null) => void;
  referenceElRef: React.RefObject<HTMLElement | null>;
  globalId: string;
};

export type RenderedTooltipContextType = {
  side: Side;
  align: Align;
  open: boolean;
};

export type FloatingContextType = {
  context: UseFloatingReturn["context"];
  arrowRef: React.RefObject<SVGSVGElement | null>;
};
