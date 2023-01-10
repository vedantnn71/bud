import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function EventsMetrics({ data }: Props) {
  return (
    <MetricsTable title="Event" dataValueType="Actions" data={data}>
      <MetricsHeader title="Events" />
    </MetricsTable>
  );
}
