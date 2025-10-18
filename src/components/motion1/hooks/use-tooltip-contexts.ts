import { getStrictContext } from "@/lib/get-strict-context";
import {
  TooltipContextType,
  TooltipGroupProvider,
  RenderedTooltipContextType,
  FloatingContextType,
} from "../types";

export const [LocalTooltipProvider, useLocalTooltip] =
  getStrictContext<TooltipContextType>("TooltipProvider");

export const [GlobalTooltipProvider, useGlobalTooltip] =
  getStrictContext<TooltipGroupProvider>("TooltipGroupProvider");

export const [RenderedTooltipProvider, useRenderedTooltip] =
  getStrictContext<RenderedTooltipContextType>("RenderedTooltipContext");

export const [FloatingProvider, useFloatingContext] =
  getStrictContext<FloatingContextType>("FloatingContext");
