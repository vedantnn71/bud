import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function DevicesMetrics({ data }: Props) {
  return (
    <MetricsTable title="Device" dataValueType="Views" data={data}>
      <MetricsHeader title="Devices" />
    </MetricsTable>
  );
}
