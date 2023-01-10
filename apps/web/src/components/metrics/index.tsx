import type { Metrics as MetricsType } from "~/types";
import { PagesMetrics } from "./pages";
import { UtmMetrics } from "./utm";
import { EventsMetrics } from "./events";
import { CountriesMetrics } from "./countries";
import { BrowsersMetrics } from "./browsers";
import { DevicesMetrics } from "./devices";

function hasData<T>(data: T): boolean {
  return JSON.stringify(data) !== "{}";
}

interface Props {
  data: MetricsType;
}

export default function Metrics({ data }: Props) {
  const { pages, events, countries, browsers, devices, queryParams } = data;

  return (
    <div className="wrap grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2">
      {hasData(pages) && <PagesMetrics data={pages} />}
      {hasData(queryParams) && <UtmMetrics data={queryParams} />}
      {hasData(countries) && <CountriesMetrics data={countries} />}
      {hasData(browsers) && <BrowsersMetrics data={browsers} />}
      {hasData(devices) && <DevicesMetrics data={devices} />}
      {hasData(events) && <EventsMetrics data={events} />}
    </div>
  );
}
