import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
}

const EXPENSE_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e"
];

const INCOME_COLORS = [
  "#10b981",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6"
];

export default function Home() {
  const { user } = useAuth();
  const { transactions, loading, error } = useTransactions();
  const [range, setRange] = useState("30days");
  const username = user?.name || "User";

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    if (range === "30days") {
      cutoffDate.setDate(now.getDate() - 30);
    }

    if (range === "6months") {
      cutoffDate.setMonth(now.getMonth() - 6);
    }

    if (range === "1year") {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    return transactions.filter((item) => new Date(item.date) >= cutoffDate);
  }, [transactions, range]);

  const chartData = useMemo(() => {
    const grouped = {};

    filteredTransactions.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      });

      if (!grouped[date]) {
        grouped[date] = {
          date,
          income: 0,
          expense: 0
        };
      }

      if (item.type === "income") {
        grouped[date].income += item.amount;
      }

      if (item.type === "expense") {
        grouped[date].expense += item.amount;
      }
    });

    return Object.values(grouped);
  }, [filteredTransactions]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const expensePieData = useMemo(() => {
    const grouped = {};

    filteredTransactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        grouped[item.category] = (grouped[item.category] || 0) + item.amount;
      });

    return Object.entries(grouped).map(([key, value]) => ({
      name: key,
      value
    }));
  }, [filteredTransactions]);

  const incomePieData = useMemo(() => {
    const grouped = {};

    filteredTransactions
      .filter((item) => item.type === "income")
      .forEach((item) => {
        grouped[item.category] = (grouped[item.category] || 0) + item.amount;
      });

    return Object.entries(grouped).map(([key, value]) => ({
      name: key,
      value
    }));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {username}
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {error || "Overview of your financial activity"}
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 sm:w-52"
        >
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          <Card className="p-6">
            <Skeleton className="mb-4 h-6 w-48" />
            <Skeleton className="mb-8 h-4 w-64" />
            <Skeleton className="h-[380px] w-full" />
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="p-6">
              <Skeleton className="mb-4 h-6 w-48" />
              <Skeleton className="h-[350px] w-full" />
            </Card>

            <Card className="p-6">
              <Skeleton className="mb-4 h-6 w-48" />
              <Skeleton className="h-[350px] w-full" />
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              label="Total Income"
              value={totalIncome}
              caption="Positive cash flow"
              captionClassName="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="Total Expense"
              value={totalExpense}
              caption="Spending tracked"
              captionClassName="text-red-500"
            />
            <StatCard
              label="Net Balance"
              value={netBalance}
              caption="Financial health"
              captionClassName="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Income vs Expense</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Financial overview over time
              </p>
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#income)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#expense)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <BreakdownCard
              title="Expense Breakdown"
              subtitle="Distribution of expenses by category"
              data={expensePieData}
              colors={EXPENSE_COLORS}
            />
            <BreakdownCard
              title="Income Breakdown"
              subtitle="Distribution of income by category"
              data={incomePieData}
              colors={INCOME_COLORS}
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, caption, captionClassName }) {
  return (
    <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <h2 className="text-3xl font-bold tracking-tight">
          ${value.toLocaleString()}
        </h2>
        <p className={`text-sm ${captionClassName}`}>{caption}</p>
      </div>
    </Card>
  );
}

function BreakdownCard({ title, subtitle, data, colors }) {
  return (
    <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              innerRadius={65}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
