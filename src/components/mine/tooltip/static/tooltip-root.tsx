import React from "react";
import { LocalTooltipProvider } from "./use-tooltip-contexts";
import { Align, Side } from "./types";

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

export { Tooltip, type TooltipProps };
