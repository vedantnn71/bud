import { Logo } from "../logo";

export function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 text-xl font-semibold dark:bg-gray-900">
      <div className="flex items-center justify-center text-gray-900 dark:text-gray-100">
        <Logo className="h-10 w-10 mr-2" />
        <span className="text-3xl font-bold">Beacon</span>
      </div>
    </div>
  );
}
