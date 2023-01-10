"use client";

import { GoogleIcon } from "@beacon/ui";
import { Button } from "@beacon/ui";

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
      className="my-2"
      onClick={handleSignIn}
      loading={loading}
      fullWidth
      filled
    >
      <GoogleIcon /> Sign In
    </Button>
  );
}
