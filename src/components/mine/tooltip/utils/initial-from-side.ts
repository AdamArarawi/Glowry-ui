type Side = "top" | "bottom" | "left" | "right";
export function initialFromSide(
  side: Side
): Partial<Record<"x" | "y", number>> {
  if (side === "top") return { y: 15 };
  if (side === "bottom") return { y: -15 };
  if (side === "left") return { x: 15 };
  return { x: -15 };
}
