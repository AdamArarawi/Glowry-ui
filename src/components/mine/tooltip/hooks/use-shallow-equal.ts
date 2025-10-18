// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shallowEqualWithoutChildren<T extends Record<string, any>>(
  a?: T,
  b?: T
) {
  if (a === b) return true;
  if (!a || !b) return false;

  const keysA = Object.keys(a).filter((k) => k !== "children");
  const keysB = Object.keys(b).filter((k) => k !== "children");

  if (keysA.length !== keysB.length) return false;

  for (const k of keysA) {
    if (a[k] !== b[k]) return false;
  }

  return true;
}
