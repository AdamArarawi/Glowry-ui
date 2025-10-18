"use client";
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Import JSON data directly
import countries from "@/data/countries.json";
import states from "@/data/states.json";

interface CountryProps {
  id: number;
  name: string;
  iso2: string;
  emoji: string;
}

interface StateProps {
  id: number;
  name: string;
  country_id: number;
}

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CountryProps | null) => void;
  onStateChange?: (state: StateProps | null) => void;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    null
  );
  const [selectedState, setSelectedState] = useState<StateProps | null>(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  // Cast imported JSON data
  const countriesData = countries as CountryProps[];
  const statesData = states as StateProps[];

  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id
  );

  const handleCountrySelect = (country: CountryProps | null) => {
    setSelectedCountry(country);
    setSelectedState(null);
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state: StateProps | null) => {
    setSelectedState(state);
    onStateChange?.(state);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full min-w-0">
      {/* Country Selector */}
      <div
        className={cn(
          "w-full min-w-0",
          availableStates.length > 0 && "md:w-1/2"
        )}
      >
        <Popover
          open={openCountryDropdown}
          onOpenChange={setOpenCountryDropdown}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCountryDropdown}
              disabled={disabled}
              className="w-full justify-between min-w-0 truncate"
            >
              {selectedCountry ? (
                <div className="flex items-center gap-1 min-w-0">
                  <span>{selectedCountry.emoji}</span>
                  <span className="truncate">{selectedCountry.name}</span>
                </div>
              ) : (
                <span>Select Country...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full sm:w-[--radix-popover-trigger-width] max-w-[calc(100vw-16px)]">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {countriesData.map((country) => (
                      <CommandItem
                        key={country.id}
                        value={country.name}
                        onSelect={() => {
                          handleCountrySelect(country);
                          setOpenCountryDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <span>{country.emoji}</span>
                          <span className="truncate">{country.name}</span>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedCountry?.id === country.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* State Selector */}
      {availableStates.length > 0 && (
        <div className="w-full md:w-1/2">
          <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStateDropdown}
                disabled={!selectedCountry}
                className="w-full justify-between"
              >
                {selectedState ? (
                  <span className="truncate">{selectedState.name}</span>
                ) : (
                  <span>Select State...</span>
                )}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full sm:w-[--radix-popover-trigger-width] max-w-[calc(100vw-16px)]">
              <Command>
                <CommandInput placeholder="Search state..." />
                <CommandList>
                  <CommandEmpty>No state found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[300px]">
                      {availableStates.map((state) => (
                        <CommandItem
                          key={state.id}
                          value={state.name}
                          onSelect={() => {
                            handleStateSelect(state);
                            setOpenStateDropdown(false);
                          }}
                          className="flex cursor-pointer items-center justify-between text-sm"
                        >
                          <span className="truncate">{state.name}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedState?.id === state.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
