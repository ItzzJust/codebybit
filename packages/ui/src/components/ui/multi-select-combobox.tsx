import { cn } from "@codebybit/ui/lib/utils";
import * as React from "react";

import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "./combobox";

export interface MultiSelectComboboxProps {
  /** Available options to select from */
  options: Array<{ value: string; label: string }>;
  /** Currently selected values */
  value: string[];
  /** Called when selection changes */
  onValueChange: (values: string[]) => void;
  /** Placeholder text when no values selected */
  placeholder?: string;
  /** Label for accessibility */
  label?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function MultiSelectCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  label,
  disabled = false,
  className,
}: MultiSelectComboboxProps) {
  const optionMap = React.useMemo(
    () => new Map(options.map((opt) => [opt.value, opt.label])),
    [options]
  );

  return (
    <Combobox
      value={value}
      onValueChange={onValueChange}
      multiple
      disabled={disabled}
    >
      <ComboboxChips className="w-full">
        {value.map((v) => (
          <ComboboxChip key={v}>{optionMap.get(v) ?? v}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder={placeholder} aria-label={label} />
      </ComboboxChips>
      <ComboboxInput
        showTrigger={false}
        showClear={false}
        placeholder={placeholder}
        className={cn("hidden", className)}
      />
      <ComboboxContent>
        <ComboboxList>
          {options.map((opt) => (
            <ComboboxItem key={opt.value} value={opt.value}>
              {opt.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
        <ComboboxEmpty>No results found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}

export { MultiSelectCombobox };
