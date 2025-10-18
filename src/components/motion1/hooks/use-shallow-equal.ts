import { Tooltipprops } from "../types";

export function shallowEqualWithoutChildren(
  a?: Tooltipprops,
  b?: Tooltipprops
) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a).filter((k) => k !== "children");
  const keysB = Object.keys(b).filter((k) => k !== "children");
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    // @ts-expect-error dynamic key access
    if (a[k] !== b[k]) return false;
  }
  return true;
}
