import * as React from "react";

interface CommonControlledStateProps<T> {
  value?: T;
  defaultValue?: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useControlledState<T, Rest extends any[] = []>(
  props: CommonControlledStateProps<T> & {
    onChange?: (value: T, ...args: Rest) => void;
  }
): readonly [T, (next: T | ((prev: T) => T), ...args: Rest) => void] {
  const { value, defaultValue, onChange } = props;

  const [state, setInternalState] = React.useState<T>(
    value !== undefined ? value : (defaultValue as T)
  );

  // sync internal state if controlled
  React.useEffect(() => {
    if (value !== undefined) setInternalState(value);
  }, [value]);

  const setState = React.useCallback(
    (next: T | ((prev: T) => T), ...args: Rest) => {
      setInternalState((prev) => {
        const newValue =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        if (onChange) {
          Promise.resolve().then(() => onChange(newValue, ...args));
        }
        return newValue;
      });
    },
    [onChange]
  );

  return [state, setState] as const;
}
