import { getServerSession } from "@beacon/auth";
import { redirect } from "next/navigation";

export async function protect() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }
}

