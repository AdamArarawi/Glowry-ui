// tooltip-contexts.ts
import { getStrictContext } from "@/lib/get-strict-context";

// Generic helper to create strict contexts
export function createTooltipContexts<
  LocalType,
  GlobalType,
  RenderedType,
  FloatingType,
>() {
  const [LocalTooltipProvider, useLocalTooltip] =
    getStrictContext<LocalType>("TooltipProvider");

  const [GlobalTooltipProvider, useGlobalTooltip] =
    getStrictContext<GlobalType>("TooltipGroupProvider");

  const [RenderedTooltipProvider, useRenderedTooltip] =
    getStrictContext<RenderedType>("RenderedTooltipContext");

  const [FloatingProvider, useFloatingContext] =
    getStrictContext<FloatingType>("FloatingContext");

  return {
    LocalTooltipProvider,
    useLocalTooltip,
    GlobalTooltipProvider,
    useGlobalTooltip,
    RenderedTooltipProvider,
    useRenderedTooltip,
    FloatingProvider,
    useFloatingContext,
  };
}
