"use client";

import { MetricsContainer } from "./container";
import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

import { useState } from "react";

interface Props {
  data: Record<string, Record<string, number>>;
}

export function UtmMetrics({ data }: Props) {
  const [utmParam, setUtmParam] = useState("utm_source");
  const isActive = (val: string): boolean => utmParam === val;

  const options = [
    {
      title: "Referrer",
      active: isActive("utm_source"),
      onClick: () => setUtmParam("utm_source"),
    },
    {
      title: "Campaign",
      active: isActive("utm_campaign"),
      onClick: () => setUtmParam("utm_campaign"),
    },
    {
      title: "Medium",
      active: isActive("utm_medium"),
      onClick: () => setUtmParam("utm_medium"),
    },
  ];

  return (
    <MetricsTable title="Source" dataValueType="Views" data={data[utmParam] || {}}>
      <MetricsHeader title="kources" options={options} />
    </MetricsTable>
  );
}
