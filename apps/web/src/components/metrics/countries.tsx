import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function CountriesMetrics({ data }: Props) {
  return (
    <MetricsTable title="Country" dataValueType="Views" data={data}>
      <MetricsHeader title="Location" />
    </MetricsTable>
  );
}
