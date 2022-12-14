"use client";

import { GoogleIcon } from "@bud/ui";
import { Button } from "@bud/ui";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  const [loading, setLoading] = useState(false);

  function handleSignIn() {
    setLoading(true);
    signIn("google", { callbackUrl: "/beta" });
  }

  return (
    <Button
      intent="primary"
      size="lg"
      onClick={handleSignIn}
      loading={loading}
      fullWidth
      filled
    >
      <GoogleIcon /> Sign In
    </Button>
  );
}
