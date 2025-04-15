"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { UseFormSetValue } from "react-hook-form"

export interface SelectOption {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | number | boolean | undefined;
}

type Props = {
  formValueSetter?: [string, UseFormSetValue<any>]
  callback?: (value: string) => void,
  list: SelectOption[],
  placeholder?: string,
  defaultValue?: string | null,
  disabled?: boolean;
}

export function Combobox({ formValueSetter, callback, list, placeholder = '', defaultValue, disabled }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [option, setOption] = React.useState<SelectOption[]>(list)

  React.useEffect(() => {
    if (!defaultValue) return;

    setValue(defaultValue)
  }, [])

  function handleChange(currentValueIncludeLabel: string) {
    const [currentValue] = currentValueIncludeLabel.split(":")
    if (!currentValue) return

    if (formValueSetter) {
      const [key, setter] = formValueSetter
      setter(key, currentValue)
    }

    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)

    callback?.(currentValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? list.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="ค้นหา..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.value}
                  value={`${item.value}:${item.label}`}
                  onSelect={(currentValue) => handleChange(currentValue)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
