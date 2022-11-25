import { MetricsContainer } from "./container";
import { MetricsHeader } from "./header";

import { useWebsite } from "~/store";
import { trpc } from "~/utils";

export function EventsMetrics() {
  const [id] = useWebsite();

  const query = trpc.website.events.useQuery({
    websiteId: id as string,
  });

  if (!query.data) return <></>;

  const total = Object.values(query.data).reduce((a, b) => a + b.times, 0);
  const percent = (v: number) => (v * 100) / total;

  return (
    <MetricsContainer>
      <MetricsHeader title="Events" />
      <table>
        <tbody className="relative flex flex-col gap-4 w-full h-full">
          {Object.entries(query.data)
            .sort(([, a], [, b]) => b.times - a.times)
            .map(([key, value]) => (
              <tr
                className="relative flex justify-between text-lg px-4 py-2 rounded-xl overflow-hidden"
                key={key}
              >
                <td className="z-[1]">{key}</td>
                <td className="z-[1]">{value.times}</td>
                <td
                  className="absolute top-0 left-0 bg-primary-200 z-0 h-full"
                  style={{ width: `${percent(value.times)}%` }}
                ></td>
              </tr>
            ))}
        </tbody>
      </table>
    </MetricsContainer>
  );
}
