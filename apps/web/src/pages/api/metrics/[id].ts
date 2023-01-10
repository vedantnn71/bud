import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@beacon/db";
import { getServerSession } from "@beacon/auth";
import { getMetrics } from "~/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(409).json({ error: "Invalid method" });
    return;
  }

  const session = await getServerSession({ req, res });
  const { id: websiteId, from: inputFrom, to: inputTo } = req.query;

  if (!websiteId) {
    res.status(404).json({ error: "Not found" });
  }

  try {
    new Date(inputFrom as string);
    new Date(inputTo as string);
  } catch (err) {
    res.status(400).json({ error: "Invalid date range provided" });
    return;
  }

  const from = new Date(+(inputFrom as string));
  const to = new Date(+(inputTo as string));

  const website = await prisma.website.findUnique({
    where: {
      id: websiteId as string,
    },
  });

  if (!website) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (!website.public && !session) {
    res.status(401).json({ error: "Unauthorized" });
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
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  return getMetrics({ id: websiteId as string, from, to });
}
