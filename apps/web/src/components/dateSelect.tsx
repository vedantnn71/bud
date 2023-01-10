"use client";

import {
  ChevronUpIcon,
  ChevronDownIcon,
  CalendarIcon,
  CheckIcon,
} from "@beacon/ui";
import { Button } from "@beacon/ui";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cx } from "class-variance-authority";
import { fromNow } from "@beacon/basics";
import { useState, useEffect } from "react";
import { useDate } from "~/store";

type Option = "Past Week" | "Past Month" | "Past 6 Months" | "Past Year";

const options = {
  "Past Week": {
    from: fromNow(7),
    to: fromNow(),
  },
  "Past Month": {
    from: fromNow(30),
    to: fromNow(),
  },
  "Past 6 Months": {
    from: fromNow(183),
    to: fromNow(),
  },
  "Past Year": {
    from: fromNow(365),
    to: fromNow(),
  },
};

export default function DateSelect() {
  const [active, setActive] = useState<Option>("Past Week");
  const [date, setDate] = useDate();

  function handleSelect(val: string) {
    setDate(options[val as Option]);
    setActive(val as Option);
  }

  const keybindings: Record<string, () => void> = {
    w: () => handleSelect("Past Week"),
    m: () => handleSelect("Past Month"),
    h: () => handleSelect("Past 6 Months"),
    y: () => handleSelect("Past Year"),
  };

  useEffect(() => {
    function keydown(evt: KeyboardEvent) {
      const key = evt.key;

      const fn = keybindings[key];

      if (typeof fn !== "undefined") {
        fn();
      }
    }

    window.addEventListener("keydown", keydown);

    return () => {
      window.removeEventListener("keydown", keydown);
    };
  }, [active]);

  return (
    <SelectPrimitive.Root value={active} onValueChange={handleSelect}>
      <SelectPrimitive.Trigger asChild aria-label="Date Picker">
        <div>
          <Button filled intent="normal" size="sm">
            <CalendarIcon />
            {active}
          </Button>
        </div>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="z-50 rounded-lg bg-white p-2 dark:bg-gray-800">
          <SelectPrimitive.Group>
            {Object.keys(options).map((option) => (
              <SelectPrimitive.Item
                disabled={option === active}
                key={option}
                value={option}
                className={cx(
                  "relative flex items-center gap-2 px-6 py-2 text-base text-gray-700 dark:text-gray-300",
                  "radix-state-checked:bg-gray-200 dark:radix-state-checked:bg-gray-800",
                  "select-none focus:outline-none"
                )}
              >
                <SelectPrimitive.ItemIndicator>
                  <CheckIcon className="h-5 w-5" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
}
