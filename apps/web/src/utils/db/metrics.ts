import type { Metrics } from "~/types";

import { prisma } from "@beacon/db";
import {
  getDaysBetween,
  getWeeksBetween,
  getMonthsBetween,
  getDateFormat,
  addDays,
  addWeeks,
  addMonths,
  toDay,
  toWeek,
  toMonth,
} from "@beacon/basics";

interface Params {
  id: string;
  from: Date;
  to: Date;
}

export async function getMetrics({ id, from, to }: Params): Promise<Metrics> {
  const sessions = await prisma.userSession.findMany({
    where: {
      website: {
        id: id as string,
      },

      createdAt: {
        gte: from,
        lte: to,
      },
    },

    select: {
      id: true,
      createdAt: true,
      device: true,
      browser: true,
      country: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const pageViews = await prisma.pageView.findMany({
    where: {
      website: {
        id: id as string,
      },

      createdAt: {
        gte: from,
        lte: to,
      },
    },

    select: {
      id: true,
      createdAt: true,
      events: true,
      url: true,
      queryParams: true,
    },
  });

  const devices: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const pages: Record<string, number> = {};
  const events: Record<string, number> = {};
  const queryParams: Record<string, Record<string, number>> = {};

  sessions.forEach((session) => {
    const { device, browser, country } = session;

    if (device) {
      devices[device] ? (devices[device] += 1) : (devices[device] = 1);
    }

    if (browser) {
      browsers[browser] ? (browsers[browser] += 1) : (browsers[browser] = 1);
    }

    if (country) {
      countries[country] ? (countries[country] += 1) : (countries[country] = 1);
    }
  });

  pageViews.forEach((pageView) => {
    const { queryParams: params, events: pageEvents } = pageView;
    const url = new URL(pageView.url).pathname;

    if (url) {
      pages[url] ? (pages[url] += 1) : (pages[url] = 1);
    }

    if (typeof pageEvents === "object" && pageEvents !== null) {
      Object.keys(pageEvents).forEach((event) => {
        events[event] ? (events[event] += 1) : (events[event] = 1);
      });
    }

    if (typeof params === "object" && params !== null) {
      Object.entries(params).forEach(([param, val]) => {
        if (val && typeof val === "string") {
          queryParams[param] = queryParams[param] || {};

          // avoid typechecking the following line as it just works, maybe
          // will look for better solution later..
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          queryParams[param][val] = queryParams[param][val] + 1 || 1;
        }
      });
    }
  });

  const format = getDateFormat(from);
  const sessionMetrics: Record<number | string, number> = {};
  const pageViewMetrics: Record<number | string, number> = {};

  switch (format) {
    case "daily": {
      const days = getDaysBetween(from, to);

      for (let i = 0; i < days; i++) {
        const date = addDays(from, i);

        sessionMetrics[date.getTime()] = 0;
        pageViewMetrics[date.getTime()] = 0;
      }

      sessions.forEach((session) => {
        const date = toDay(session.createdAt);

        if (!sessionMetrics[date.getTime()]) {
          sessionMetrics[date.getTime()] = 0;
        }

        sessionMetrics[date.getTime()] += 1;
      });

      pageViews.forEach((pageView) => {
        const date = toDay(pageView.createdAt);

        if (!pageViewMetrics[date.getTime()]) {
          pageViewMetrics[date.getTime()] = 0;
        }

        pageViewMetrics[date.getTime()] += 1;
      });

      break;
    }

    case "weekly": {
      const weeks = getWeeksBetween(from, to);

      for (let i = 0; i < weeks; i++) {
        const date = addWeeks(from, i);

        sessionMetrics[date.getTime()] = 0;
        pageViewMetrics[date.getTime()] = 0;
      }

      sessions.forEach((session) => {
        const date = toWeek(session.createdAt);

        if (sessionMetrics[date.getTime()]) {
          sessionMetrics[date.getTime()] += 1;
        }

        sessionMetrics[date.getTime()] = 0;
      });

      pageViews.forEach((pageView) => {
        const date = toWeek(pageView.createdAt);

        if (!pageViewMetrics[date.getTime()]) {
          pageViewMetrics[date.getTime()] = 0;
        }

        pageViewMetrics[date.getTime()] += 1;
      });

      break;
    }

    case "monthly": {
      const months = getMonthsBetween(from, to);

      for (let i = 0; i < months; i++) {
        const date = addMonths(from, i);

        sessionMetrics[date.getTime()] = 0;
        pageViewMetrics[date.getTime()] = 0;
      }

      sessions.forEach((session) => {
        const date = toMonth(session.createdAt);

        if (sessionMetrics[date.getTime()]) {
          sessionMetrics[date.getTime()] += 1;
        }

        sessionMetrics[date.getTime()] = 0;
      });

      pageViews.forEach((pageView) => {
        const date = toMonth(pageView.createdAt);

        if (!pageViewMetrics[date.getTime()]) {
          pageViewMetrics[date.getTime()] = 0;
        }

        pageViewMetrics[date.getTime()] += 1;
      });

      break;
    }
  }

  return {
    devices,
    browsers,
    countries,
    pages,
    events,
    queryParams,
    sessions: sessionMetrics,
    pageViews: pageViewMetrics,
    timeFormat: format,
  };
}
