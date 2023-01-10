"use client";

import type { Mode } from "~/store";
import { EyeIcon, UserIcon } from "@beacon/ui";

interface BarTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  mode: Mode;
}

export function BarTooltip({
  active = false,
  mode = "pageViews",
  payload,
}: BarTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0];

    return (
      <div className="flex flex-col gap-2 rounded border-none bg-white p-2 shadow outline-none dark:bg-gray-900">
        <div className="flex gap-2">
          {mode === "pageViews" ? <EyeIcon /> : <UserIcon />}
          <span>{data?.value}</span>
        </div>
      </div>
    );
  }

  return null;
}

