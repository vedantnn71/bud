"use client";

import type { Resolver } from "react-hook-form";
import { Button, Label } from "@beacon/ui";
import { PlusIcon } from "@beacon/ui";

import { cx } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

interface Values {
  name: string;
  url: string;
}

const resolver: Resolver<Values> = async ({ url, name }) => {
  if (url.includes("/")) {
    return {
      values: {
        url,
        name,
      },
      errors: {
        url: {
          type: "INVALID_INPUT",
          message: 'Hostname can not contain "/"',
        },
      },
    };
  }

  if (!url.includes(".") && !url.includes(":")) {
    return {
      values: {
        url,
        name,
      },
      errors: {
        url: {
          type: "INVALID_INPUT",
          message: "Invalid hostname",
        },
      },
    };
  }

  if (name.length > 20) {
    return {
      values: {
        url,
        name,
      },
      errors: {
        name: {
          type: "INVALID_INPUT",
          message: "Name can not be longer than 20 characters",
        },
      },
    };
  }

  return {
    values: {
      url,
      name,
    },
    errors: {},
  };
};

async function createWebsite(
  apiUrl: string,
  { arg }: { arg: { url: string; name: string } }
) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const { error } = await res.json();

    const err = new Error("Some problem occured while adding your website.");
    err.message = error;

    throw err;
  }

  return res.json();
}

export default function Form() {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver,
  });

  const { trigger, error } = useSWRMutation("/api/website", createWebsite);

  async function onSubmit(values: Values) {
    if (errors.name || errors.url) {
      return;
    }

    try {
      await trigger(values);
      push("/" + values.url);
    } catch (err) {
      console.error({ error, err });
    }
  }

  return (
    <form
      className="mx-auto mt-6 flex w-full flex-col gap-5 px-4 md:w-1/2 md:px-0 lg:w-1/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label error={errors.url?.message} htmlFor="url">
          URL (hostname)
        </Label>
        <input
          className={cx(
            "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-800 dark:bg-gray-900",
            errors.url && "!ring-red-500 focus:!border-red-500"
          )}
          placeholder="example.com"
          type="text"
          id="url"
          required
          {...register("url", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label error={errors.name?.message} htmlFor="name">
          Name
        </Label>
        <input
          className={cx(
            "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-800 dark:bg-gray-900",
            errors.name && "!ring-red-500 focus:!border-red-500"
          )}
          placeholder="My Example"
          type="text"
          id="name"
          required
          {...register("name", { required: true })}
        />
      </div>
      <Button
        intent="primary"
        size="lg"
        className="mt-2 !py-2"
        disabled={errors.name || errors.url ? true : false}
        loading={isSubmitting}
        submit
        filled
      >
        <PlusIcon /> Add
      </Button>
      <Label error={!!error ? error.message : undefined}></Label>
    </form>
  );
}
