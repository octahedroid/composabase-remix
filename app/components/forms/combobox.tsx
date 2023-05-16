import React from "react";
import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { Button } from "../ui/button";

interface Props {
  options?: {
    name: string;
    value: string | number | readonly string[];
  }[];
  value?: string;
  setValueChange: (value: string) => void;
  label?: string;
}

export function ComboboxInput({ options, value, setValueChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = React.useState(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? options?.find((item) => item.value === selected)?.name : `Select ${label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[500px] h-[400px] overflow-y-scroll p-0"
      >
        <Command>
          <CommandInput placeholder={label} />
          <CommandEmpty>Not found.</CommandEmpty>
          <CommandGroup>
            {options?.filter((option) => {return option.name !== ""}).map((option) => (
              <CommandItem
                key={option.value as string}
                value={option.name as string}
                onSelect={(currentValue) => {
                  const selectedValue = options?.find((item) => item.name.toLocaleLowerCase() === currentValue)?.value as string
                  setSelected(selectedValue);
                  setValueChange(selectedValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected === option.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
