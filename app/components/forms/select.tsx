import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
interface Props {
  label?: string;
  options?: {
    name: string;
    value: string | number | readonly string[];
  }[];
  setValueChange: (value: string) => void;
}

export const SelectInput = ({ label, options, setValueChange }: Props) => {
  return (
    <Select onValueChange={setValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options?.map((option) => (
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
