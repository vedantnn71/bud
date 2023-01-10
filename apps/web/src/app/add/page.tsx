import { ZapIcon } from "@beacon/ui";
import Nav from "~/components/nav";
import Form from "./form";

import { protect } from "~/utils/auth";

export default async function Page() {
  await protect();

  return (
    <div className="h-full w-full items-center">
      <Nav loggedIn hideDateSelect hideWebsiteSelect />

      <div className="flex flex-col items-center gap-6 my-8">
        <ZapIcon className="h-10 w-10 fill-gray-800 dark:fill-gray-200" />
        <h1 className="text-3xl font-bold">Add your website</h1>
      </div>

      <Form />
    </div>
  );
}
