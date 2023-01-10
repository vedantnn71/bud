import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function PagesMetrics({ data }: Props) {
  return (
    <MetricsTable title="Page" dataValueType="Views" data={data}>
      <MetricsHeader title="Pages" />
    </MetricsTable>
  );
}
