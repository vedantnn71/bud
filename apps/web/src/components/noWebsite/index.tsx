import { BarIcon } from "@beacon/ui";
import { Suspense } from "react";
import Snippet from "./snippet";

export default function NoWebsite() {
  return (
    <div className="grid h-full w-full place-items-center overflow-hidden bg-gray-100 py-6 dark:bg-gray-900 md:py-0 my-8">
      <div className="flex max-w-lg flex-col items-center gap-6 px-6 text-center text-gray-800 dark:text-gray-200 md:p-0">
        <BarIcon className="h-16 w-16" />
        <h1 className="text-xl font-semibold md:text-2xl">
          Looks like you have not linked any of your website yet..
        </h1>
        <p className="space-lg text-sm text-gray-700 dark:text-gray-300 md:text-base">
          No worries, you can connect your website with beacon by just embedding
          the script below in your website.
        </p>

        <Suspense fallback={<p>Loading ...</p>}>
          <Snippet />
        </Suspense>
      </div>
    </div>
  );
}
