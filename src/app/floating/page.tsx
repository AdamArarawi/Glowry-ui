"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  TooltipGroup,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip-motion"; // ✅ عدّل المسار حسب مكان الملف
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/mine/Popover/Popover";
import {
  Dropdown,
  DropdownContent,
  DropdownHighlight,
  DropdownHighlightItem,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
  SubDropdownTrigger,
} from "./dropdown";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectTrigger,
  SelectItem,
} from "./select";

export default function TooltipExample() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | string[]>([]);

  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    // Use min-h-screen instead of h-screen and remove all padding from this top-level div
    <div className="min-h-screen bg-background">
      {/* Container for responsiveness:
        - p-4: Added responsive padding (less on small, more on large)
        - flex, justify-center, items-center: Keeps everything centered
        - flex-col: Stacks items vertically on small screens
        - lg:flex-row: Changes to horizontal layout on large screens
        - gap-6: Adds space between stacked items
      */}
      <div className="p-4 lg:p-10 flex flex-col lg:flex-row justify-center items-center min-h-screen gap-6 lg:gap-10">
        {/* Tooltip Group Container: Ensures tooltips are grouped and centered */}
        <div className="flex flex-col sm:flex-row gap-4">
          <TooltipGroup>
            <Tooltip side="bottom" align="start" sideOffset={10}>
              <TooltipTrigger>
                <Button variant="outline">Hover me! 🖱️</Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="">This is a Tooltip with FloatingArrow1!</div>
              </TooltipContent>
            </Tooltip>

            <Tooltip side="bottom" align="start" sideOffset={10}>
              <TooltipTrigger>
                <Button variant="outline">Hover me2! ✨</Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="">This is a Tooltip with FloatingArrow2!</div>
              </TooltipContent>
            </Tooltip>
          </TooltipGroup>
        </div>
        {/* Popover Component */}
        <Popover
          side="right"
          align="center"
          sideOffset={15}
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover ⚙️</Button>
          </PopoverTrigger>
          <PopoverContent
            // max-w-xs (e.g., max-width: 20rem) for small screens, min-w-80 for larger screens
            className="max-w-xs sm:min-w-80 bg-popover text-popover-foreground rounded-md border p-4 z-50 w-full"
          >
            <PopoverArrow className="fill-popover" />
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              {/* Input section: Ensure proper grid layout and scaling for inputs */}
              <div className="grid gap-2">
                {/* Responsive Input Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="width" className="text-sm col-span-1">
                    Width
                  </label>
                  <input
                    id="width"
                    defaultValue="100%"
                    className="col-span-3 h-8 p-2 border rounded-md w-full" // Use w-full for full width
                  />
                </div>

                {/* Responsive Input Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="maxWidth" className="text-sm col-span-1">
                    Max. width
                  </label>
                  <input
                    id="maxWidth"
                    defaultValue="300px"
                    className="col-span-3 h-8 p-2 border rounded-md w-full"
                  />
                </div>

                {/* Responsive Input Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="height" className="text-sm col-span-1">
                    Height
                  </label>
                  <input
                    id="height"
                    defaultValue="25px"
                    className="col-span-3 h-8 p-2 border rounded-md w-full"
                  />
                </div>

                {/* Responsive Input Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="maxHeight" className="text-sm col-span-1">
                    Max. height
                  </label>
                  <input
                    id="maxHeight"
                    defaultValue="none"
                    className="col-span-3 h-8 p-2 border rounded-md w-full"
                  />
                </div>
              </div>
              {/* <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button> */}
            </div>
          </PopoverContent>
        </Popover>
        <Dropdown>
          <DropdownTrigger label="Main Menu ⚙️" />
          <DropdownContent>
            <DropdownHighlight>
              <DropdownHighlightItem>
                <DropdownItem label="Undo" />
              </DropdownHighlightItem>
              <DropdownItem label="Redo" disabled />
              <DropdownHighlightItem>
                <DropdownItem
                  label="Cut"
                  onClick={() => {
                    console.log("Cut");
                  }}
                />
              </DropdownHighlightItem>
              <DropdownSeparator />

              <Dropdown>
                <DropdownHighlightItem>
                  <SubDropdownTrigger label="More options" />
                </DropdownHighlightItem>
                <DropdownContent>
                  <DropdownHighlightItem>
                    <DropdownItem label="Share" />
                  </DropdownHighlightItem>
                  <DropdownHighlightItem>
                    <DropdownItem label="Duplicate" />
                  </DropdownHighlightItem>

                  <Dropdown>
                    <DropdownHighlightItem>
                      <SubDropdownTrigger label="More options" />
                    </DropdownHighlightItem>
                    <DropdownContent>
                      <DropdownHighlightItem>
                        <DropdownItem label="Share" />
                      </DropdownHighlightItem>
                      <DropdownHighlightItem>
                        <DropdownItem label="Duplicate" />
                      </DropdownHighlightItem>
                      <DropdownHighlightItem>
                        <DropdownItem label="Delete" />
                      </DropdownHighlightItem>
                    </DropdownContent>
                  </Dropdown>
                </DropdownContent>
              </Dropdown>
            </DropdownHighlight>
          </DropdownContent>
        </Dropdown>
        <Select value={value} onValueChange={setValue} multiple>
          <SelectTrigger className="w-[180px]" placeholder="Select a fruit" />
          <SelectContent>
            <DropdownHighlight>
              <SelectGroup>
                <SelectGroupLabel label="Fruits" />
                <DropdownHighlightItem>
                  <SelectItem label="Apple" value="apple" />
                </DropdownHighlightItem>
                <DropdownHighlightItem>
                  <SelectItem label="Banana" value="banana" />
                </DropdownHighlightItem>
                <DropdownHighlightItem>
                  <SelectItem label="Blueberry" value="blueberry" />
                </DropdownHighlightItem>
                <DropdownHighlightItem>
                  <SelectItem label="Orange" value="orange" />
                </DropdownHighlightItem>
                <DropdownHighlightItem>
                  <SelectItem label="Strawberry" value="strawberry" />
                </DropdownHighlightItem>
                <DropdownHighlightItem>
                  <SelectItem label="Watermelon" value="watermelon" />
                </DropdownHighlightItem>
              </SelectGroup>
            </DropdownHighlight>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
