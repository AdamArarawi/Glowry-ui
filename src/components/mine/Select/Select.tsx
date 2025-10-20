import { Slot } from "@/components/animate-ui/primitives/animate/slot";
import { useControlledState } from "@/hooks/use-controlled-state";
import { getStrictContext } from "@/lib/get-strict-context";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useListNavigation,
  useTypeahead,
  useListItem,
  FloatingList,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import React from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

type SelectOptions = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | string[]) => void;
  value?: string | string[];
  multiple?: boolean;
};

function useSelect({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onValueChange: setControlledValue,
  value: controlledValue,
  multiple = false,
}: SelectOptions = {}) {
  const [isOpen, setIsOpen] = useControlledState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: setControlledOpen,
  });

  // value can be string (single) or string[] (multiple)
  const [value, setValue] = useControlledState<string | string[]>({
    value: controlledValue,
    onChange: setControlledValue,
  });

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const valuesRef = React.useRef<Array<string | null>>([]);

  const data = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleSelect = React.useCallback(
    (index: number | null) => {
      if (index === null) return;
      const selectedValue = valuesRef.current[index];
      if (selectedValue === null) return;

      setSelectedIndex(index);

      if (multiple) {
        // toggle in array
        setValue((prev) => {
          const current = Array.isArray(prev) ? prev.slice() : [];
          const found = current.indexOf(selectedValue);
          if (found === -1) {
            return [...current, selectedValue];
          } else {
            // remove
            current.splice(found, 1);
            return current;
          }
        });
        // DO NOT close when multiple
      } else {
        // single select -> set value and close
        setValue(selectedValue);
        setIsOpen(false);
      }
    },
    [setIsOpen, setValue, multiple]
  );

  const context = data.context;
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: isOpen ? setActiveIndex : handleSelect,
  });

  const interactions = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);

  return React.useMemo(
    () => ({
      ...data,
      isOpen,
      setIsOpen,
      multiple,
      activeIndex,
      setActiveIndex,
      interactions,
      context,
      elementsRef,
      labelsRef,
      valuesRef,
      setSelectedIndex,
      selectedIndex,
      handleSelect,
      value,
      setValue,
    }),
    [
      activeIndex,
      context,
      data,
      interactions,
      isOpen,
      multiple,
      selectedIndex,
      handleSelect,
      value,
      setIsOpen,
      setValue,
    ]
  );
}

type SelectContextType = ReturnType<typeof useSelect>;

const [SelectContext, useSelectContext] =
  getStrictContext<SelectContextType>("Select");

function Select({
  children,
  value,
  onValueChange,
  multiple,
}: {
  children: React.ReactNode;
  value?: string | string[];
  onValueChange?: (v: string | string[]) => void;
  multiple?: boolean;
}) {
  const select = useSelect({ value, onValueChange, multiple });
  return <SelectContext value={select}>{children}</SelectContext>;
}

function SelectTrigger({
  asChild,
  placeholder,
  ...props
}: {
  asChild?: boolean;
  placeholder?: string;
} & HTMLMotionProps<"button">) {
  const select = useSelectContext();
  const { refs, interactions, value, valuesRef, labelsRef, multiple } = select;

  const label = React.useMemo(() => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder ?? "";
      // try to show up to 2 labels, otherwise "N selected"
      const labels = value
        .map((v) => {
          const idx = valuesRef.current.findIndex((x) => x === v);
          return labelsRef.current[idx];
        })
        .filter(Boolean) as string[];
      if (labels.length <= 2) return labels.join(", ");
      return `${labels.length} selected`;
    } else {
      const idx = valuesRef.current.findIndex((v) => v === value);
      return labelsRef.current[idx] ?? placeholder ?? "";
    }
  }, [multiple, value, valuesRef, labelsRef, placeholder]);

  const Comp = asChild ? Slot : motion.button;
  return (
    <Comp
      ref={refs.setReference}
      {...interactions.getReferenceProps()}
      {...props}
    >
      <span className="truncate">{label}</span>
      <ChevronDownIcon className="size-4 opacity-50" />
    </Comp>
  );
}

type SelectContentProps = React.HTMLAttributes<HTMLDivElement> & {
  motionProps?: {
    initial?: HTMLMotionProps<"div">["initial"];
    animate?: HTMLMotionProps<"div">["animate"];
    exit?: HTMLMotionProps<"div">["exit"];
    transition?: HTMLMotionProps<"div">["transition"];
  };
  asChild?: boolean;
};

function SelectContent({
  children,
  motionProps,
  className,
  asChild,
}: SelectContentProps) {
  const selectContext = useSelectContext();
  const {
    refs,
    interactions,
    isOpen,
    floatingStyles,
    elementsRef,
    labelsRef,
    context,
  } = selectContext;

  const transition = motionProps?.transition ?? {
    type: "tween",
    duration: 0.2,
    ease: "easeOut",
  };

  const defaultMotion = motionProps ?? {
    initial: { opacity: 0, scale: 0.7, y: -15 },
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    exit: { opacity: 0, scale: 0.7, y: -15 },
  };

  const Comp = asChild ? Slot : motion.div;

  return (
    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={0}
              returnFocus={true}
            >
              <div
                ref={refs.setFloating}
                className="relative"
                data-state={isOpen ? "open" : "closed"}
                style={{
                  ...floatingStyles,
                  outline: "none",
                  width:
                    refs.reference.current?.getBoundingClientRect().width ?? 0,
                }}
              >
                <Comp
                  className={cn("px-2", className)}
                  initial={defaultMotion.initial}
                  animate={defaultMotion.animate}
                  exit={defaultMotion.exit}
                  transition={transition}
                >
                  <div
                    className="max-h-[200px] overflow-y-auto relative scroll-smooth focus:outline-none! Menu"
                    {...interactions.getFloatingProps()}
                  >
                    {children}
                  </div>
                </Comp>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </FloatingList>
  );
}

type SelectGroupContextType = { id: string };
const [SelectGroupContext, useSelectGroupContext] =
  getStrictContext<SelectGroupContextType>("SelectGroup");

type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>;

function SelectGroup({ children, ...props }: SelectGroupProps) {
  const groupId = React.useId();

  return (
    <SelectGroupContext value={{ id: groupId }}>
      <div role="group" aria-labelledby={groupId} {...props}>
        {children}
      </div>
    </SelectGroupContext>
  );
}

type SelectGroupLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
};

function SelectGroupLabel({ label, ...props }: SelectGroupLabelProps) {
  const groupContext = useSelectGroupContext();

  return (
    <div id={groupContext.id} {...props}>
      {label}
    </div>
  );
}

type SelectItemProps = {
  label: string;
  value: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function SelectItem({
  label,
  value,
  disabled,
  className,
  ...props
}: SelectItemProps) {
  const select = useSelectContext();
  const item = useListItem({ label: disabled ? null : label });

  const isActive = item.index === select.activeIndex;
  const isSelected = Array.isArray(select.value)
    ? select.value.includes(value)
    : select.value === value;

  // register label + value refs
  React.useEffect(() => {
    select.labelsRef.current[item.index] = label;
    select.valuesRef.current[item.index] = value;
  }, [label, value, item.index, select.labelsRef, select.valuesRef]);

  return (
    <button
      ref={item.ref}
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={(e) => {
        props.onClick?.(e);
        select.handleSelect(item.index);
      }}
      className={cn(
        "flex items-center justify-between w-full rounded-sm px-2 py-1.5 text-sm cursor-default select-none focus:outline-none!",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <span>{label}</span>
      {isSelected && <CheckIcon className="size-4 opacity-70" />}
    </button>
  );
}

type SelectItemIndicatorProps = React.HTMLAttributes<HTMLSpanElement>;

function SelectItemIndicator({ children, ...props }: SelectItemIndicatorProps) {
  const select = useSelectContext();
  const item = useListItem({ label: null });
  const value = select.valuesRef.current[item.index];
  const isSelected = Array.isArray(select.value)
    ? select.value.includes(value!)
    : select.value === value;
  if (!isSelected) return null;
  return (
    <span {...props} className={cn("absolute left-2", props.className)}>
      {children}
    </span>
  );
}

type SelectSeparatorProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectGroupLabel,
  SelectItemIndicator,
  type SelectItemProps,
  type SelectSeparatorProps,
};
