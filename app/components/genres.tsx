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
  items: {
    id: string;
    name: string;
  }[];
  value?: string | null;
}

export function GenreCombobox({ items, value }: Props) {
  const [open, setOpen] = React.useState(false);
  const [, setSearchParams] = useSearchParams();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? items.find((item) => item.id === value)?.name : `Select genre...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search genre...`} />
          <CommandGroup>
            <CommandItem
              value={""}
              onSelect={() => {
                setSearchParams((params: URLSearchParams) => {
                  params.delete('genre');
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
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={(currentValue) => {
                  const parameter = encodeURIComponent(currentValue);
                  setSearchParams((params: URLSearchParams) => {
                    params.set('genre', parameter);
                    return params;
                  });
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
