"use client";

import { UserIcon } from "@beacon/ui";
import SettingsDropdown from "~/components/settingsDropdown";

import { useSession } from "next-auth/react";

export default function Settings() {
  const { data } = useSession();

  return (
    <SettingsDropdown>
      <picture>
        <source srcSet={data?.user?.image || ""} />
        <UserIcon
          aria-label="Settings"
          className="-ml-1 h-6 w-6 cursor-pointer text-gray-800 hover:opacity-90 dark:text-gray-200"
        />
      </picture>
    </SettingsDropdown>
  );
}
