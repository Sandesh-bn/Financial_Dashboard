import React, { useState } from "react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [range, setRange] = useState("30days");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Overview of your financial activity
          </p>
        </div>

        {/* DROPDOWN */}
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="
            w-full sm:w-52
            rounded-lg
            border
            border-zinc-200
            dark:border-zinc-800
            bg-white
            dark:bg-zinc-900
            px-4
            py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-emerald-500
          "
        >
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1 */}
        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Income
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              $12,450
            </h2>

            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              +12.5%
            </p>
          </div>
        </Card>

        {/* CARD 2 */}
        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Expense
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              $7,820
            </h2>

            <p className="text-sm text-red-500">
              +4.2%
            </p>
          </div>
        </Card>

        {/* CARD 3 */}
        <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Net Balance
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              $4,630
            </h2>

            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Healthy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}