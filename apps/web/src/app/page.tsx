import NoWebsite from "~/components/noWebsite";
import Nav from "~/components/nav";

import { cookies as nextCookies } from "next/headers";
import { getServerSession } from "@beacon/auth";
import { redirect } from "next/navigation";
import { protect } from "~/utils/auth";
import { prisma } from "@beacon/db";

export default async function Page() {
  await protect();

  const session = await getServerSession();
  const cookies = nextCookies();
  const id = cookies.get("website");

  const query = await prisma.website.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
  });

  if (query.length === 0) {
    return (
      <div>
        <Nav loggedIn />
        <NoWebsite />
      </div>
    );
  }

  if (id) {
    redirect(`/${id}`);
  }

  if (query[0]?.id) {
    redirect(`/${query[0].id}`);
  }
}
