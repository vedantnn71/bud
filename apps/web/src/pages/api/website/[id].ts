import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@beacon/auth";
import { prisma } from "@beacon/db";
import { fromNow } from "@beacon/basics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return;
  }

  const session = await getServerSession({ req, res });
  const id = req.query.id as string;

  const { id: websiteId, from: inputFrom, to: inputTo } = req.query;

  if (inputFrom && inputTo) {
    try {
      new Date(inputFrom as string);
      new Date(inputTo as string);
    } catch (err) {
      res.status(400).json({ error: "Invalid date range provided" });
      return;
    }
  }

  const from = inputFrom
    ? new Date(+(inputFrom as string))
    : new Date(fromNow(7));
  const to = inputTo ? new Date(+(inputTo as string)) : new Date();

  const website = await prisma.website.findFirst({
    where: {
      id,
    },
  });

  if (!website) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (!session && !website.public) {
    res.status(401).json({ error: "Unauthorized" });
    return;
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

  return res.json(website);
}
