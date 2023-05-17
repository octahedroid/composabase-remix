import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useSearchParams } from "@remix-run/react";

interface Props {
  value?: number;
  allowEmpty?: boolean;
}

export function TakeCombobox({ value, allowEmpty = false }: Props) {
  const [open, setOpen] = React.useState(false);
  const [, setSearchParams] = useSearchParams();
  const records = ["3" ,"6", "9", "12", "15", "18", "21", "24", "27", "30", "33"];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? records.find((item) => item === value.toString()) : `Select records...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search year...`} />
          <CommandGroup>
          {allowEmpty &&
            <CommandItem
                value={""}
                onSelect={() => {
                  setSearchParams((params: URLSearchParams) => {
                    params.delete('take');
                    return params;
                  });
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === null ? "opacity-100" : "opacity-0"
                  )}
                />
                All
              </CommandItem>
            }

            {records.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={(currentValue) => {
                  const parameter = encodeURIComponent(currentValue);
                  setSearchParams((params: URLSearchParams) => {
                    params.set("take", parameter);
                    return params;
                  });
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
