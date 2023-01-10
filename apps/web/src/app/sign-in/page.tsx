import { Logo } from "@beacon/ui";
import SignInButton from "~/components/signInButton";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center text-gray-800 dark:text-gray-200 my-8">
        <Logo className="mr-2 h-8 w-8" />
        <h2 className="text-2xl font-bold md:text-3xl">Beacon</h2>
      </div>

      <div className="flex my-auto max-w-lg flex-col items-start gap-3 px-6 md:p-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl">
          Sign up for Beacon
        </h1>

        <p className="text-base text-gray-500 dark:text-gray-400 md:text-lg">
          Create your account for Beacon. The analytics tool which is just created for you in mind.
        </p>

        <SignInButton />
        <p className="text-base text-gray-500 dark:text-gray-400 md:text-lg">
          By signing in to Beacon, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    </div>
  );
}
