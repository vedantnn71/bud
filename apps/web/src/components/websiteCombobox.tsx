"use client";

import type { Website } from "@prisma/client";
import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectIcon } from "@beacon/ui";

import { getAllWebsites } from "~/utils/query";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function WebsiteCombobox() {
  const router = useRouter();
  const id = usePathname()?.replace("/", "");
  const [query, setQuery] = useState("");
  const { data, isLoading, error } = useSWR<Website[]>(
    "/api/website/all",
    getAllWebsites
  );

  if (isLoading) {
    return (
      <div className="ml-2 flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-500" />
        <div className="h-8 w-40 animate-pulse rounded-md bg-gray-500" />
      </div>
    );
  }

  if (!data || error) {
    return null;
  }

  const filteredWebsites = data.filter((website) =>
    website.name.toLowerCase().includes(query.toLowerCase())
  );

  const activeWebsite = data.find((website) => website.id === id);

  if (!activeWebsite) {
    return null;
  }

  return (
    <div className="relative z-50 mt-1 w-40 md:w-64 md:ml-4">
      <Combobox value={id} onChange={(val) => router.push("/" + val)}>
        <div className="relative flex w-full cursor-default items-center overflow-hidden rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300 sm:text-sm">
          <img
            src={activeWebsite.favicon as string}
            className="h-6 w-6"
            alt={activeWebsite.name}
          />
          <Combobox.Input
            className="w-full border-none bg-transparent py-2 pr-10 text-xl leading-5 text-gray-900 focus:ring-0 dark:text-gray-200 md:pl-3"
            displayValue={() => activeWebsite.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-64 overflow-auto rounded-md bg-gray-100 py-1 text-base shadow-md shadow-gray-900/5 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:shadow-gray-100/5 dark:ring-gray-800 sm:fixed sm:text-sm">
            {filteredWebsites.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredWebsites.map((website) => (
                <Combobox.Option
                  key={website.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-primary-600 text-white"
                        : "text-gray-900 dark:text-gray-100"
                    }`
                  }
                  value={website.id}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center gap-2">
                        {website.favicon && (
                          <img
                            src={website.favicon}
                            alt={website.name}
                            className="h-5 w-5"
                          />
                        )}
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {website.name}
                        </span>
                      </div>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active
                              ? "text-gray-100 dark:text-gray-900"
                              : "text-primary-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}
