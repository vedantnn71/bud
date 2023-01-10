import { Suspense } from "react";
import Insights from "~/components/insights";
import Metrics from "~/components/metrics";
import Nav from "~/components/nav";

import { getServerSession } from "@beacon/auth";
import { getMetrics, getInsights } from "~/utils/db";
import { notFound } from "next/navigation";
import { prisma } from "@beacon/db";
import { fromNow } from "@beacon/basics";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("~/components/chart"), { suspense: true });

interface Props {
  params: { id: string };
  searchParams: {
    from: string | number | undefined;
    to: string | number | undefined;
  };
}

export default async function Page({
  params: { id },
  searchParams: { from, to },
}: Props) {
  id = id.replace("%3A", ":");

  const website = await prisma.website.findUnique({
    where: {
      id,
    },
  });

  if (!website) {
    notFound();
  }

  const session = await getServerSession();

  if (!session && !website.public) {
    notFound();
  }

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
      select: {
        id: true,
      },
    });

    if (website?.userId !== user?.id) {
      notFound();
    }
  }

  if (!from) {
    from = +fromNow(7);
  } else {
    from = +from;
  }

  if (!to) {
    to = +new Date();
  } else {
    to = +to;
  }

  const metrics = await getMetrics({
    id,
    from: new Date(from),
    to: new Date(to),
  });

  const insights = await getInsights({
    id,
    from: new Date(from),
    to: new Date(to),
  })

  return (
    <div>
      <Nav loggedIn={!!session} />
      <Insights data={insights} />
      <Suspense fallback={null}>
        <Chart data={metrics} />
      </Suspense>
      <Metrics data={metrics} />
    </div>
  );
}

