import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import * as React from "react";
import { getStrictContext } from "@/lib/get-strict-context";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Slot } from "@/components/animate-ui/primitives/animate/slot";
import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from "@/components/animate-ui/primitives/effects/highlight";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

type MenuContextType = {
  getItemProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  hasFocusInside: boolean;
  isOpen: boolean;
  refs: ReturnType<typeof useFloating>["refs"];
  parent: MenuContextType | undefined;
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  item: {
    ref: (node: HTMLElement | null) => void;
    index: number;
  };
  props: {
    nested?: boolean;
    children?: React.ReactNode;
  };
  elementsRef: React.RefObject<(HTMLButtonElement | null)[]>;
  labelsRef: React.RefObject<(string | null)[]>;
  context: ReturnType<typeof useFloating>["context"];
  isNested: boolean;
  floatingStyles: React.CSSProperties;
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
  side: Side;
  align: Align;
};

const [MenuContext, useMenuContext, useOptionalMenuContext] =
  getStrictContext<MenuContextType>("Menu");

interface MenuProps {
  nested?: boolean;
  children?: React.ReactNode;
}

type MenuComponentProps = MenuProps & React.HTMLProps<HTMLButtonElement>;

function MenuComponent({ children, ...props }: MenuComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasFocusInside, setHasFocusInside] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const parent = useOptionalMenuContext();

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();

  const isNested = parentId !== null;

  const { floatingStyles, refs, context, placement } =
    useFloating<HTMLButtonElement>({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? "right-start" : "bottom-start",
      middleware: [
        offset({
          mainAxis: isNested ? 0 : 4,
          alignmentAxis: isNested ? -4 : 0,
        }),
        flip({ fallbackAxisSideDirection: "end" }),
        shift(),
      ],
      whileElementsMounted: autoUpdate,
    });

  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: "menu" });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [hover, click, role, dismiss, listNavigation, typeahead]
  );

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on("click", handleTreeClick);
    tree.events.on("menuopen", onSubMenuOpen);

    return () => {
      tree.events.off("click", handleTreeClick);
      tree.events.off("menuopen", onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  return (
    <FloatingNode id={nodeId}>
      <MenuContext
        value={{
          activeIndex,
          setActiveIndex,
          getItemProps,
          setHasFocusInside,
          isOpen,
          refs,
          parent,
          hasFocusInside,
          getReferenceProps,
          item,
          props,
          elementsRef,
          labelsRef,
          context,
          isNested,
          floatingStyles,
          getFloatingProps,
          side: placement.split("-")[0] as Side,
          align: placement.split("-")[1] as Align,
        }}
      >
        {children}
      </MenuContext>
    </FloatingNode>
  );
}

const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    asChild?: boolean;
  }
>(function MenuTrigger({ children, asChild, ...props }, forwardedRef) {
  const {
    refs,
    parent,
    isOpen,
    hasFocusInside,
    getReferenceProps,
    setHasFocusInside,
    item,
    props: menuProps,
    isNested,
  } = useMenuContext();

  const Comp = !isNested && asChild ? Slot : "button";

  return (
    <Comp
      ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
      tabIndex={
        !isNested ? undefined : parent?.activeIndex === item.index ? 0 : -1
      }
      role={isNested ? "menuitem" : undefined}
      data-open={isOpen ? "" : undefined}
      data-label={props.label}
      data-nested={isNested ? "" : undefined}
      data-focus-inside={hasFocusInside ? "" : undefined}
      {...getReferenceProps(
        parent?.getItemProps({
          ...menuProps,
          ...props,
          onFocus(event: React.FocusEvent<HTMLButtonElement>) {
            props.onFocus?.(event);
            setHasFocusInside(false);
            parent?.setHasFocusInside(true);
          },
        })
      )}
      className={cn(props.className)}
    >
      {asChild ? (
        children
      ) : (
        <>
          {props.label}
          {!asChild && (
            <span aria-hidden>
              <ChevronRight className="mt-1 size-4" />
            </span>
          )}
        </>
      )}
    </Comp>
  );
});

function getMotionFromPlacement(side: Side, align: Align) {
  const offset = 15;
  const skew = 15;

  let x = 0;
  let y = 0;

  switch (side) {
    case "top":
      y = offset;
      if (align === "start") x = -skew;
      else if (align === "end") x = skew;
      break;
    case "bottom":
      y = -offset;
      if (align === "start") x = -skew;
      else if (align === "end") x = skew;
      break;
    case "left":
      x = offset;
      if (align === "start") y = -offset;
      else if (align === "end") y = offset;
      break;
    case "right":
      x = -offset;
      if (align === "start") y = -offset;
      else if (align === "end") y = offset;
      break;
  }

  return {
    initial: {
      opacity: 0,
      scale: 0.8,
      x,
      y,
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x,
      y,
    },
  };
}

type MenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  motionProps?: {
    initial?: HTMLMotionProps<"div">["initial"];
    animate?: HTMLMotionProps<"div">["animate"];
    exit?: HTMLMotionProps<"div">["exit"];
    transition?: HTMLMotionProps<"div">["transition"];
  };
};

function MenuContent({ children, motionProps, className }: MenuContentProps) {
  const {
    refs,
    isOpen,
    elementsRef,
    labelsRef,
    context,
    isNested,
    floatingStyles,
    side,
    align,
    getFloatingProps,
  } = useMenuContext();

  const transition = motionProps?.transition ?? {
    type: "spring",
    stiffness: 300,
    damping: 25,
  };
  const defaultMotion = motionProps ?? getMotionFromPlacement(side, align);

  return (
    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={isNested ? -1 : 0}
              returnFocus={!isNested}
            >
              <div
                ref={refs.setFloating}
                className="Menu"
                data-state={isOpen ? "open" : "closed"}
                style={{
                  ...floatingStyles,
                }}
              >
                <motion.div
                  initial={defaultMotion.initial}
                  animate={defaultMotion.animate}
                  exit={defaultMotion.exit}
                  transition={transition}
                  className={className}
                  style={{
                    outline: "none",
                    // border: "none",
                  }}
                  {...getFloatingProps()}
                >
                  {children}
                </motion.div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </FloatingList>
  );
}

interface MenuItemProps {
  label: string;
  disabled?: boolean;
}

const MenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function MenuItem({ label, disabled, ...props }, forwardedRef) {
  const menu = useMenuContext();
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;

  return (
    <button
      {...props}
      ref={useMergeRefs([item.ref, forwardedRef])}
      type="button"
      role="menuitem"
      className={cn(props.className)}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      {...menu.getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit("click");
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
      })}
    >
      {label}
    </button>
  );
});

function Menu(props: MenuProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} />;
}

type MenuMenuHighlightProps = Omit<
  HighlightProps,
  "controlledItems" | "enabled" | "hover"
> & {
  animateOnHover?: boolean;
};

function MenuMenuHighlight({
  transition = { type: "spring", stiffness: 350, damping: 35 },
  animateOnHover = true,
  ...props
}: MenuMenuHighlightProps) {
  return (
    <Highlight
      hover
      controlledItems
      enabled={animateOnHover}
      transition={transition}
      {...props}
    />
  );
}

type MenuMenuHighlightItemProps = HighlightItemProps;

function MenuMenuHighlightItem(props: MenuMenuHighlightItemProps) {
  return <HighlightItem data-slot="Menu-menu-highlight-item" {...props} />;
}

export {
  Menu,
  MenuMenuHighlight,
  MenuMenuHighlightItem,
  MenuComponent,
  MenuItem,
  MenuContent,
  MenuTrigger,
  type MenuMenuHighlightItemProps,
  type MenuProps,
  type MenuMenuHighlightProps,
};
