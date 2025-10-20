"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectGroupLabel,
  SelectItemIndicator,
} from "@/components/mine/Select/Select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MenuMenuHighlight,
  MenuMenuHighlightItem,
  MenuMenuHighlightItemProps,
  MenuMenuHighlightProps,
} from "@/components/mine/Dropdown/Dropdown";

// ===============================
// Wrapper: Select
// ===============================
function MySelect({ children, ...props }: React.ComponentProps<typeof Select>) {
  return <Select {...props}>{children}</Select>;
}

// ===============================
// Wrapper: SelectTrigger
// ===============================
function MySelectTrigger({
  className,
  ...props
}: React.ComponentProps<typeof SelectTrigger>) {
  return (
    <SelectTrigger
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectTrigger>
  );
}

// ===============================
// Wrapper: SelectContent
// ===============================
function MySelectContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectContent>) {
  return (
    <SelectContent
      className={cn(
        "bg-popover text-popover-foreground rounded-md border border-border shadow-md overflow-y-auto min-w-[8rem] max-h-[15rem] p-1",
        className
      )}
      {...props}
    >
      {/* <ScrollButton direction="up">
        <ChevronUpIcon className="size-4" />
      </ScrollButton> */}

      {/* <div className="p-1">{children}</div> */}

      {children}

      {/* <ScrollButton direction="down">
        <ChevronDownIcon className="size-4" />
      </ScrollButton> */}
    </SelectContent>
  );
}

// ===============================
// Wrapper: SelectItem
// ===============================
function MySelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectItem>) {
  return (
    <SelectItem
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 text-sm select-none z-1",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectItemIndicator>
          <CheckIcon className="size-4" />
        </SelectItemIndicator>
      </span>
      {children}
    </SelectItem>
  );
}

// ===============================
// Wrapper: SelectGroup
// ===============================
function MySelectGroup({
  children,
  ...props
}: React.ComponentProps<typeof SelectGroup>) {
  return <SelectGroup {...props}>{children}</SelectGroup>;
}

// ===============================
// Wrapper: SelectGroupLabel
// ===============================
function MySelectGroupLabel({
  children,
  ...props
}: React.ComponentProps<typeof SelectGroupLabel>) {
  return (
    <SelectGroupLabel
      {...props}
      className={cn("text-muted-foreground px-2 py-1.5 text-xs")}
    >
      {children}
    </SelectGroupLabel>
  );
}

// ===============================
// Wrapper: SelectSeparator
// ===============================
function MySelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectSeparator>) {
  return (
    <SelectSeparator
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownHighlight({ children, ...props }: MenuMenuHighlightProps) {
  return (
    <MenuMenuHighlight
      {...props}
      className="absolute inset-0 bg-accent z-[0] rounded-md"
    >
      {children}
    </MenuMenuHighlight>
  );
}

function DropdownHighlightItem({ ...props }: MenuMenuHighlightItemProps) {
  return <MenuMenuHighlightItem {...props} />;
}

// ===============================
// Export Everything
// ===============================
export {
  MySelect as Select,
  MySelectTrigger as SelectTrigger,
  MySelectContent as SelectContent,
  MySelectItem as SelectItem,
  MySelectSeparator as SelectSeparator,
  MySelectGroup as SelectGroup,
  MySelectGroupLabel as SelectGroupLabel,
};
