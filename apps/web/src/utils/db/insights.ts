import { prisma } from "@beacon/db";

interface Params {
  id: string;
  from: Date;
  to: Date;
}

export interface Insights {
  pageViews: number;
  sessions: number;
  avgDuration: number;
}

export async function getInsights({ id, from, to }: Params): Promise<Insights> {
  const sessions = await prisma.userSession.count({
    where: {
      website: {
        id,
      },

      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  const pageViews = await prisma.pageView.count({
    where: {
      website: {
        id,
      },

      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  const {
    _avg: { visitDuration: avgDuration },
  } = await prisma.pageView.aggregate({
    where: {
      website: {
        id,
      },

      createdAt: {
        gte: from,
        lte: to,
      },
    },

    _avg: {
      visitDuration: true,
    },
  });

  return {
    pageViews,
    sessions,
    avgDuration: avgDuration ?? 0,
  };
}
