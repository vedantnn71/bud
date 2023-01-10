import type { PropsWithChildren } from "react";

interface Props {
  title: string;
  dataValueType: string;
  data: Record<string, number>;
}

export function MetricsTable({
  data,
  dataValueType,
  title,
  children,
}: PropsWithChildren<Props>) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const percent = (v: number) => (v * 100) / total;

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-xl border border-gray-100 px-6 pb-8 pt-5 dark:border-gray-800">
      {children}
      <table className="flex h-full w-full flex-col gap-4">
        <thead>
          <tr className="flex justify-between text-gray-400 dark:text-gray-600">
            <th className="font-medium">{title.toUpperCase()}</th>
            <th className="font-medium">{dataValueType.toUpperCase()}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data)
            .sort(([, a], [, b]) => b - a)
            .map(([dataKey, value]) => (
              <tr
                className="relative flex justify-between overflow-hidden py-4 text-lg"
                key={dataKey}
              >
                <td className="z-[1]">{dataKey}</td>
                <td className="z-[1]">{value}</td>
                <td
                  className="absolute left-0 bottom-0 z-0 h-0.5 bg-primary-400 dark:bg-primary-500"
                  style={{ width: `${percent(value)}%` }}
                ></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
