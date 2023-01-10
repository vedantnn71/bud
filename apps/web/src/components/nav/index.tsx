import { SearchIcon, HelpIcon, MenuIcon } from "@beacon/ui";
import { Logo } from "@beacon/ui";
import WebsiteCombobox from "~/components/websiteCombobox";
import Feedback from "~/components/widgets/feedback";
import SettingsDropdown from "~/components/settingsDropdown";
import SignInButton from "~/components/signInButton";
import DateSelect from "~/components/dateSelect";
import MobileMenu from "~/components/mobileMenu";
import Link from "next/link";

interface Props {
  loggedIn?: boolean;
  hideDateSelect?: boolean;
  hideWebsiteSelect?: boolean;
}

export default function Nav({
  loggedIn = false,
  hideDateSelect = false,
  hideWebsiteSelect = false,
}: Props) {
  const baseIconStyles =
    "w-6 h-6 hover:opacity-90 cursor-pointer text-gray-800 dark:text-gray-200";

  return (
    <nav className="mx-6 flex items-center justify-between border-b border-gray-200 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 text-xl font-medium text-gray-800 dark:text-gray-200">
        <Link href="/" className="flex cursor-pointer items-center gap-2">
          <Logo className="h-6 w-6" />
          <span>Beacon</span>
        </Link>
        {!hideWebsiteSelect && (
          <div className="gap-3 flex items-center">
            <span className="ml-2 text-gray-500 dark:text-gray-700">{"/"}</span>
            <WebsiteCombobox />
          </div>
        )}
      </div>

      <div className="hidden items-center gap-4 md:flex">
        {!hideDateSelect && <DateSelect />}
        {loggedIn ? (
          <>
            <Feedback>
              <HelpIcon className={baseIconStyles} />
            </Feedback>
          </>
        ) : null}
        {loggedIn ? <SettingsDropdown /> : <SignInButton />}
      </div>

      <MobileMenu>
        <MenuIcon className={baseIconStyles + " inline-flex md:hidden"} />
      </MobileMenu>
    </nav>
  );
}
