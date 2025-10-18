import { WithAsChild } from "@/components/animate-ui/primitives/animate/slot";
import { useLocalTooltip } from "./hooks/use-tooltip-contexts";
import React from "react";
import { shallowEqualWithoutChildren } from "./hooks/use-shallow-equal";
import { Tooltipprops } from "./types";

type TooltipContentProps = WithAsChild<Tooltipprops>;

function TooltipContent({ asChild = false, ...props }: TooltipContentProps) {
  const { setProps, setAsChild } = useLocalTooltip();
  const lastPropsRef = React.useRef<Tooltipprops | undefined>(undefined);

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

export { TooltipContent, type TooltipContentProps };
