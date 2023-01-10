import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import { getServerSession } from "@beacon/auth";
import { getFavicon } from "~/utils";
import { prisma } from "@beacon/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const session = await getServerSession({ req, res });

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, url } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (url.includes("/") || (!url.includes(".") && !url.includes(":"))) {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }

  try {
    const favicon = await getFavicon("https://" + url);

    await prisma.website.create({
      data: {
        id: url,
        name,
        url,
        userId: user.id,
        favicon,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({ error: "Website already exists" });
        return;
      }
    }

    res.status(500).json({
      error:
        "Sorry, something went wrong at our end. Please create a issue on github if it persists.",
    });
    return;
  }

  return res.status(200).json({ success: true });
}

