import { MetricsHeader } from "./header";
import { MetricsTable } from "./table";

interface Props {
  data: Record<string, number>;
}

export function BrowsersMetrics({ data }: Props) {
  return (
    <MetricsTable dataValueType="Views" title="Browser" data={data}>
      <MetricsHeader title="Browsers" />
    </MetricsTable>
  );
}
