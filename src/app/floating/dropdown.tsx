import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuMenuHighlight,
  MenuMenuHighlightItem,
  type MenuMenuHighlightItemProps,
  type MenuMenuHighlightProps,
} from "@/components/mine/Dropdown/Dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Dropdown({ children }: { children: React.ReactNode }) {
  return <Menu>{children}</Menu>;
}

function DropdownTrigger({ label }: { label: string }) {
  return (
    <MenuTrigger label={label} asChild>
      <Button variant="outline">{label}</Button>
    </MenuTrigger>
  );
}

function SubDropdownTrigger({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <MenuTrigger
      label={label}
      disabled={disabled}
      className="flex items-center justify-between cursor-default relative px-3 py-2 rounded-md transition-colors focus:outline-none! w-full z-10"
      onClick={onClick}
    />
  );
}

function DropdownContent({ children }: { children: React.ReactNode }) {
  return (
    <MenuContent className="w-[10rem] bg-popover border rounded-md p-1 flex flex-col">
      {children}
    </MenuContent>
  );
}

function DropdownItem({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <MenuItem
      label={label}
      disabled={disabled}
      className={cn(
        "cursor-default relative px-3 py-2 rounded-md transition-colors text-start disabled:text-muted-foreground  w-full focus:outline-none! z-1",
        disabled && "opacity-50"
      )}
      onClick={onClick}
    />
  );
}

function DropdownSeparator() {
  return <div className="h-px my-1 bg-border" />;
}

function DropdownHighlight({ children, ...props }: MenuMenuHighlightProps) {
  return (
    <MenuMenuHighlight
      {...props}
      className="absolute inset-0 bg-accent z-[-1] rounded-md"
    >
      {children}
    </MenuMenuHighlight>
  );
}

function DropdownHighlightItem({ ...props }: MenuMenuHighlightItemProps) {
  return <MenuMenuHighlightItem {...props} />;
}

export {
  Dropdown,
  DropdownTrigger,
  SubDropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownHighlight,
  DropdownHighlightItem,
};
