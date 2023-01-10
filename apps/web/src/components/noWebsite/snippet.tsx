"use client";

import { Button } from "@beacon/ui";
import { ClipboardCheckIcon, ClipboardIcon } from "@beacon/ui";

import { cx } from "class-variance-authority";
import { useState } from "react";
import useSWR from "swr";

async function getSnippet(): Promise<string> {
  const resp = await fetch("/api/snippet");
  const data = await resp.json();

  return data.snippet as string;
}

export default function Snippet() {
  const { data, isLoading } = useSWR<string>("/api/snippet", getSnippet);
  const [copied, setCopied] = useState(false);

  if (isLoading || !data) {
    return null;
  }

  function handleCopy() {
    if (!data) {
      return;
    }

    navigator.clipboard.writeText(data);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative rounded-2xl bg-gray-900 p-4 text-left font-mono text-sm text-gray-100 selection:bg-primary-900 dark:border dark:border-gray-800 md:w-full md:text-base">
      <Button className="absolute right-4 top-4" onClick={handleCopy}>
        {copied ? (
          <ClipboardCheckIcon
            className={cx(
              "h-5 w-5 md:h-6 md:w-6 ",
              copied ? "text-green-300" : "text-gray-100"
            )}
          />
        ) : (
          <ClipboardIcon
            className={cx(
              "h-5 w-5 md:h-6 md:w-6 ",
              copied ? "text-green-300" : "text-gray-100"
            )}
          />
        )}
      </Button>

      <pre className="w-3/4 break-all text-xs sm:whitespace-pre sm:text-sm">
        {data}
      </pre>
    </div>
  );
}
