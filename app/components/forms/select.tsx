import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
interface Props {
  label: string | undefined;
  value?: string | number;
  options?: {
    name: string;
    value: string | number | readonly string[];
  }[];
  setValueChange: (value: string) => void;
}

export const SelectInput = ({
  label,
  value,
  options,
  setValueChange,
}: Props) => {
  return (
    <Select onValueChange={setValueChange} defaultValue={value as string}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label} ...`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options
            ?.filter((option) => {
              return option.name !== "";
            })
            .map((option) => (
              <SelectItem
                key={option.value as string}
                value={option.value as string}
              >
                {option.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
