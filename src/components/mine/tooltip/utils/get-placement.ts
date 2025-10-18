import { Placement } from "@floating-ui/react";
type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";
export function getResolvedSide(placement: Side | `${Side}-${Align}`) {
  return placement.includes("-")
    ? (placement.split("-")[0] as Side)
    : (placement as Side);
}

export function getPlacement(side: Side, align: Align = "center"): Placement {
  return align === "center" ? side : (`${side}-${align}` as Placement);
}
