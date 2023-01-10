import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@beacon/auth";
import { prisma } from "@beacon/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession({ req, res });

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const websites = await prisma.website.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
  });

  return res.json(websites);
}
