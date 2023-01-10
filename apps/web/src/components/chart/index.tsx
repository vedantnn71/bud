"use client";

import type { Metrics } from "~/types";
import { Bar, XAxis, Tooltip, ResponsiveContainer, BarChart } from "recharts";
import { BarTooltip } from "./tooltip";

import { formatDate } from "@beacon/basics";
import { primary, gray } from "@beacon/config/colors";
import { useMode } from "~/store";
import { useTheme } from "@wits/next-themes";

interface Props {
  data: Metrics;
}

export default function Chart({ data: metrics }: Props) {
  const [mode] = useMode();
  const { resolvedTheme: theme } = useTheme();

  const data = Object.entries(metrics[mode]).map(([timestamp, value]) => ({
    name: formatDate(new Date(+timestamp), metrics.timeFormat),
    timestamp,
    value,
  }));

  return (
    <div className="my-4 h-full w-full px-6">
      <ResponsiveContainer height={320} width="100%">
        <BarChart width={50} height={200} data={data}>
          <defs>
            <linearGradient id="bar-background" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primary["500"]} stopOpacity={0.2} />
              <stop
                offset="95%"
                stopColor={primary["500"]}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <Bar
            radius={[6, 6, 0, 0]}
            dataKey="value"
            fill="url(#bar-background)"
            stroke={primary["500"]}
          />
          <XAxis
            dataKey="name"
            axisLine={{
              stroke: theme === "dark" ? gray["800"] : gray["200"],
              strokeWidth: 1,
            }}
            tickLine={false}
          />
          <Tooltip
            content={<BarTooltip mode={mode} />}
            wrapperStyle={{ outline: "none", zIndex: 1 }}
            cursor={{ fill: "transparent" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
