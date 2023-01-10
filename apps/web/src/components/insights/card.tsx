"use client";

import type { Mode } from "~/store";
import { ArrowUpIcon } from "@beacon/ui";

import { cx } from "class-variance-authority";
import { useMode } from "~/store";

interface Props {
  mode: Mode;
  label: string;
  value: number | string;
  growth: number;
  description: string;
}

export default function InsightCard({
  mode,
  label,
  value,
  growth,
  description,
}: Props) {
  const [currMode, setMode] = useMode();

  function handleClick() {
    if ((mode as string) === "viewDuration") {
      return;
    }

    setMode(mode);
  }

  return (
    <button
      className={cx(
        "flex min-w-[75%] flex-col rounded-2xl p-4 py-3 outline-none md:w-full md:min-w-0 md:py-4",
        currMode === mode ? "bg-insight-card dark:bg-dark-insight-card drop-shadow-insight-card" : null
      )}
      onClick={handleClick}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 md:text-base text-left mb-1">
        {label}
      </span>

      <div className="flex w-full justify-between" title={description}>
        <h2 className="mb-2 text-3xl font-bold md:text-4xl">{value}</h2>
        <div
          className={cx(
            "flex h-8 max-w-fit items-center gap-2 rounded-full",
            growth < 0
              ? "text-red-600 dark:text-red-200"
              : "text-green-600 dark:text-green-200"
          )}
        >
          <span className="text-sm md:text-base">{growth}%</span>
          <ArrowUpIcon
            className={cx("h-4 w-4", growth < 0 ? "rotate-180" : "rotate-0")}
          />
        </div>
      </div>
    </button>
  );
}
