"use client";

import type { ReactNode } from "react";
import { SignOutIcon, UserIcon, SunIcon, MoonIcon } from "@beacon/ui";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { signOut } from "next-auth/react";
import { useTheme } from "@wits/next-themes";

interface Props {
  children?: ReactNode;
}

export default function SettingsDropdown({
  children = (
    <UserIcon className="h-6 w-6 cursor-pointer text-gray-800 hover:opacity-90 dark:text-gray-200" />
  ),
}: Props) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mr-4 rounded-lg bg-gray-100 px-4 py-2 shadow-sm dark:bg-gray-800">
          <DropdownMenu.Label />
          <DropdownMenu.Item />

          <DropdownMenu.Group>
            <DropdownMenu.Item />
          </DropdownMenu.Group>

          <DropdownMenu.RadioGroup className="z-[99] flex flex-col gap-4 p-1">
            <DropdownMenu.RadioItem value="sign-out">
              <button
                className="flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200"
                onClick={() => signOut()}
              >
                <SignOutIcon /> Sign out
              </button>
              <DropdownMenu.ItemIndicator />
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem value="theme">
              <button
                className="flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                {resolvedTheme === "light" ? <MoonIcon /> : <SunIcon />}{" "}
                {(resolvedTheme?.charAt(0) || "").toUpperCase() +
                  resolvedTheme?.slice(1)}
              </button>
              <DropdownMenu.ItemIndicator />
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator />
          <DropdownMenu.Arrow className="fill-gray-100 dark:fill-gray-800" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
