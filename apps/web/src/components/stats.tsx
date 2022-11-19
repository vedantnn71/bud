import { ArrowUpIcon } from "@spark/ui";

import { cx } from "class-variance-authority";
import { trpc } from "~/utils";
import { useWebsite } from "~/store";

interface StatProps {
  label: string;
  value: number | string;
  growth: number;
  description: string;
}

function StatCard({ label, value, growth, description }: StatProps) {
  return (
    <div className="flex flex-col p-4">
      <span className="text-sm md:text-base text-gray-500">{label}</span>

      <div className="flex justify-between w-full" title={description}>
        <h2 className="text-3xl font-bold mb-2 md:text-4xl">{value}</h2>
        <div className="flex items-center gap-2 px-3  border border-gray-900 rounded-full h-8 max-w-fit">
          <span className="text-sm md:text-base">{growth}%</span>
          <ArrowUpIcon
            className={cx("w-4 h-4", growth < 0 ? "rotate-180" : "rotate-0")}
          />
        </div>
      </div>
    </div>
  );
}

export function Stats() {
  const [id] = useWebsite();
  const query = trpc.website.get.useQuery(id || "");

  if (!id) {
    return <></>;
  }

  if (query.isLoading || !query.data) {
    return <></>;
  }

  // convert milliseconds to standard time
  function millisecondsToStandardTime(ms: number) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    if (hours) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (minutes) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  }

  const stats = [
    {
      label: "Page Views",
      value: query.data.pageViews,
      growth: 8,
      description:
        "Page views are the number of times a user visits a page on your website.",
    },
    {
      label: "Sessions",
      value: query.data.sessions,
      growth: 2,
      description:
        "Sessions are the number of users who have visited your website.",
    },
    {
      label: "Avg Session Time",
      value: millisecondsToStandardTime(query.data.avgDuration || 0),
      growth: 5,
      description:
        "Average session time is the average amount of time a user spends on your website.",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 py-2 px-4 text-gray-900 gap-4">
      {stats.map((stat) => (
        <StatCard {...stat} key={stat.label} />
      ))}
    </div>
  );
}
