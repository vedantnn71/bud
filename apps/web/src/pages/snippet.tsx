import { Logo, Button, Loading } from "@spark/ui";
import { ClipboardIcon, ClipboardCheckIcon } from "@spark/ui";
import Link from "next/link";

import { config, animated, useSpring } from "@react-spring/web";
import { cx } from "class-variance-authority";
import { trpc } from "~/utils";
import { useState } from "react";

export default function Onboard() {
  const [copied, setCopied] = useState(false);
  const idQuery = trpc.user.getId.useQuery();

  const containerSprings = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },

    to: {
      opacity: 1,
      transform: "translateY(0px)",
    },

    config: config.slow,
    delay: 100,
  });

  function handleCopy() {
    navigator.clipboard.writeText(snippet);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (idQuery.isLoading) {
    return <Loading />;
  }

  let snippet = "";

  if (typeof window !== "undefined") {
    snippet = `<script
  defer 
  data-spark
  data-id="${idQuery.data}"
  src="${window.location.origin}/track.js"
></script>`;
  }

  return (
    <div className="h-screen w-screen grid place-items-center">
      <animated.div
        className="flex flex-col max-w-lg px-6 md:p-0 items-start gap-6"
        style={{ ...containerSprings }}
      >
        <div className="flex items-center text-gray-800">
          <Logo className="-mx-2 -my-4 w-16 h-16" />
          <h2 className="text-2xl md:text-3xl font-bold">Spark</h2>
        </div>

        <h1 className="text-xl text-gray-600 font-semibold md:text-2xl">
          Just copy and paste this snippet to any of your website{" "}
          <span className="text-gray-800">and that&apos;s it!</span>
        </h1>

        <pre className="bg-gray-900 text-gray-100 w-full p-4 rounded-2xl font-mono relative selection:bg-primary-900 text-sm md:text-base">
          <Button className="absolute right-4 top-4" onClick={handleCopy}>
            {copied ? (
              <ClipboardCheckIcon
                className={cx(
                  "w-5 h-5 md:w-6 w-6",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            ) : (
              <ClipboardIcon
                className={cx(
                  "w-5 h-5 md:w-6 w-6",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            )}
          </Button>
          {snippet}
        </pre>

        <Link className="w-full" href="/">
          <Button intent="primary" size="lg" filled fullWidth>
            Done!
          </Button>
        </Link>
      </animated.div>
    </div>
  );
}
