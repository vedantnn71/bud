import type { Session } from "next-auth";
import { UserIcon } from "@beacon/ui";
import SettingsDropdown from "~/components/settingsDropdown";

import useSWR from "swr";

async function getSession(): Promise<Session> {
  const resp = await fetch("/api/auth/session");
  return await resp.json() as Session;
}

export default function Settings() {
  const { data, isLoading } = useSWR<Session>("/api/auth/session", getSession);

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center">
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-20 h-5 rounded-md bg-gray-200 animate-pulse" />
      </div>
    )
  }

  if (!data) {
    return null;
  }

  return (
    <SettingsDropdown>
      <div className="flex cursor-pointer gap-2 text-lg text-gray-900 dark:text-gray-100">
        <picture>
          <source srcSet={data?.user?.image || ""} />
          <UserIcon className="w-6 h-6" />
        </picture>
        Settings
      </div>
    </SettingsDropdown>
  );
}
