import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "../trpc";
import { load } from "cheerio";
import { z } from "zod";

export const websiteRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { url } = input;

      async function getPageDetails(): Promise<{
        name: string;
        favicon: string | null;
      }> {
        const resp = await fetch(url);
        const html = await resp.text();
        const $ = load(html);

        let favicon = $("link[rel='icon']").attr("href") || null;
        let title = $("title").text();

        // remove all the seperators
        let [name, _] = title.split(/[-|:|−|–]/);

        if (!name) {
          name = `${ctx.session.user?.name}'s website`;
        }

        name = name.trim();
        favicon = favicon ? new URL(favicon, url).href : null;
        favicon = favicon ? await imageUrl(favicon) : null;

        return { name, favicon };
      }

      async function imageUrl(url: string) {
        const resp = await fetch(url);
        const blob = await resp.blob();
        return URL.createObjectURL(blob);
      }

      const { name, favicon } = await getPageDetails();

      try {
        return await ctx.prisma.website.create({
          data: {
            url,
            name,
            favicon,
            user: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Website already exists",
            });
          }
        }
      }
    }),

  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.website.findMany({
      where: {
        user: { id: ctx.userId },
      },
    });
  }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const website = await ctx.prisma.website.findUnique({
      where: {
        id: input,
      },
    });

    const sessions = await ctx.prisma.userSession.count({
      where: {
        website: {
          id: input,
        },
      },
    });

    const pageViews = await ctx.prisma.pageView.count({
      where: {
        website: {
          id: input,
        },
      },
    });

    if (!website) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Website not found",
      });
    }

    // get average duration of all visits of all pages
    const avgDuration = await ctx.prisma.pageView.aggregate({
      where: {
        website: {
          id: input,
        },
      },

      _avg: {
        visitDuration: true,
      },
    });

    return {
      sessions: sessions,
      pageViews: pageViews,
      avgDuration: avgDuration._avg.visitDuration,
      ...website,
    };
  }),

  metrics: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const sessions = await ctx.prisma.userSession.findMany({
        where: {
          website: {
            id: websiteId,
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

      const pageViews = await ctx.prisma.pageView.findMany({
        where: {
          website: {
            id: websiteId,
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

      let devices: Record<string, number> = {};
      let browsers: Record<string, number> = {};
      let countries: Record<string, number> = {};
      let pages: Record<string, number> = {};
      let events: Record<string, number> = {};
      let queryParams: Record<string, number> = {};

      sessions.forEach((session) => {
        const { device, browser, country } = session;

        if (device) {
          devices[device] ? (devices[device] += 1) : (devices[device] = 1);
        }

        if (browser) {
          browsers[browser]
            ? (browsers[browser] += 1)
            : (browsers[browser] = 1);
        }

        if (country) {
          countries[country]
            ? (countries[country] += 1)
            : (countries[country] = 1);
        }
      });

      pageViews.forEach((pageView) => {
        const { url, queryParams: params, events: pageEvents } = pageView;

        if (url) {
          pages[url] ? (pages[url] += 1) : (pages[url] = 1);
        }

        if (typeof pageEvents === "object" && pageEvents !== null) {
          Object.keys(pageEvents).forEach((event) => {
            events[event] ? (events[event] += 1) : (events[event] = 1);
          });
        }

        if (typeof params === "object" && params !== null) {
          Object.keys(params).forEach((param) => {
            queryParams[param]
              ? (queryParams[param] += 1)
              : (queryParams[param] = 1);
          });
        }
      });

      return {
        devices,
        browsers,
        countries,
        pages,
        events,
        queryParams,
        sessions: sessions.map(({ createdAt, id }) => ({ createdAt, id })),
        pageViews: pageViews.map(({ createdAt, id }) => ({ createdAt, id })),
      };
    }),
});
