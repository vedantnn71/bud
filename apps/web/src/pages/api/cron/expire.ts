import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@beacon/db";
import { env } from "~/env/server.mjs";
import cuid from "cuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Invalid method" });
    return;
  }

  const { APP_KEY } = env;
  const ACTION_KEY = req.headers.authorization?.split(" ")[1];

  if (ACTION_KEY !== APP_KEY) {
    res.status(401).json({ error: "Invalid authorization" });
    return;
  }

  const sessions = await prisma.userSession.findMany({
    where: {
      expires: {
        lte: new Date(+(new Date()) - 48 * 3600 * 1000),
      },
    },
  });

  const ids = sessions.map(({ id }) => id);

  for (const id of ids) {
    await prisma.userSession.update({
      where: {
        id
      },
      data: {
        id: cuid(),
      }
    })
  }

  return res.send("OK");
}
