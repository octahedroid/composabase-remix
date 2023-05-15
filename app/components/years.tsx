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
  value: string;
}

export function Combobox({ value }: Props) {
  // const items = Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1990), name: String(i + 1990) }));
  const items = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"]
  const [open, setOpen] = React.useState(false);

  const [, setSearchParams] = useSearchParams("1990");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? items.find(
                (item) => item === value
              )
            : `Select year...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search year...`} />
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={(currentValue) => {
                  setSearchParams(`year=${currentValue}`);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLocaleLowerCase() === item
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
