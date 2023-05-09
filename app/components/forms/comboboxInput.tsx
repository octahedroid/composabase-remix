import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
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
import { useState } from "react";
import { Input } from "../ui/input";

interface Props {
  options?: {
    name: string;
    value: string | number | readonly string[];
  }[];
  value: string;
  setValue: (value: string) => void;
  label?: string;
}

export function ComboboxInput({ options, value, setValue, label }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[500px] h-[400px] overflow-y-scroll p-0"
      >
        <Command>
          <CommandInput placeholder={label} />
          <CommandEmpty>Not found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value={""}
              onSelect={() => {
                setValue("");
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === "" ? "opacity-100" : "opacity-0"
                )}
              />
              {label}
            </CommandItem>
            {options?.map((option) => (
              <CommandItem
                key={option.name as string}
                value={option.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLocaleLowerCase() ===
                      option.name.toLocaleLowerCase()
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
