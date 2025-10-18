import { createTooltipContexts } from "@/components/mine/tooltip/hooks/use-tooltip-contexts";
import {
  TooltipContextType,
  TooltipGroupProvider,
  RenderedTooltipContextType,
  FloatingContextType,
} from "./types";

// الآن ممكن تمرر أي نوع تريد
const {
  LocalTooltipProvider,
  useLocalTooltip,
  GlobalTooltipProvider,
  useGlobalTooltip,
  RenderedTooltipProvider,
  useRenderedTooltip,
  FloatingProvider,
  useFloatingContext,
} = createTooltipContexts<
  TooltipContextType,
  TooltipGroupProvider,
  RenderedTooltipContextType,
  FloatingContextType
>();

export {
  LocalTooltipProvider,
  useLocalTooltip,
  GlobalTooltipProvider,
  useGlobalTooltip,
  RenderedTooltipProvider,
  useRenderedTooltip,
  FloatingProvider,
  useFloatingContext,
};
