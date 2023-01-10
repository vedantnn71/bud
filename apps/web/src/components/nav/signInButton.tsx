"use client";

import { Button } from "@beacon/ui";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const { push } = useRouter();

  return (
    <Button
      onClick={() => push("/sign-in")}
      intent="primary"
      size="sm"
      className="!px-6"
      filled
    >
      Sign In
    </Button>
  );
}
