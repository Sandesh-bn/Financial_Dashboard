import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

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
  Cell,
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
  "#f43f5e",
];

const INCOME_COLORS = [
  "#10b981",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
];
export default function Home() {
  const [range, setRange] = useState("30days");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);

      // 🔥 REAL API REQUEST
      // const token = localStorage.getItem("token");

      // const res = await fetch(
      //   "http://localhost:4000/api/expense/get",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // const data = await res.json();

      // 🔥 MOCK 2 YEARS OF DATA
      const mockData = generateMockTransactions();

      // simulate api delay
      await new Promise((resolve) => setTimeout(resolve, 700));

      setTransactions(mockData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // FILTER DATA BASED ON DROPDOWN
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    let cutoffDate = new Date();

    if (range === "30days") {
      cutoffDate.setDate(now.getDate() - 30);
    }

    if (range === "6months") {
      cutoffDate.setMonth(now.getMonth() - 6);
    }

    if (range === "1year") {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    return transactions.filter(
      (item) => new Date(item.date) >= cutoffDate
    );
  }, [transactions, range]);

  // GRAPH DATA
  const chartData = useMemo(() => {
    const grouped = {};

    filteredTransactions.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "2-digit",
        }
      );

      if (!grouped[date]) {
        grouped[date] = {
          date,
          income: 0,
          expense: 0,
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

  // TOTALS
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
        if (!grouped[item.category]) {
          grouped[item.category] = 0;
        }

        grouped[item.category] += item.amount;
      });

    return Object.entries(grouped).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [filteredTransactions]);

  const incomePieData = useMemo(() => {
    const grouped = {};

    filteredTransactions
      .filter((item) => item.type === "income")
      .forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = 0;
        }

        grouped[item.category] += item.amount;
      });

    return Object.entries(grouped).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [filteredTransactions]);

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
            rounded-xl
            border
            border-zinc-200
            dark:border-zinc-800
            bg-white
            dark:bg-zinc-900
            px-4
            py-2.5
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

      {/* LOADING */}
      {loading ? (
        <div className="space-y-6">

          {/* SKELETON STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* SKELETON AREA CHART */}
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-64 mb-8" />
            <Skeleton className="h-[380px] w-full" />
          </Card>

          {/* SKELETON PIE CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[350px] w-full" />
            </Card>

            <Card className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[350px] w-full" />
            </Card>
          </div>

        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* INCOME */}
            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total Income
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  $
                  {totalIncome.toLocaleString()}
                </h2>

                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Positive cash flow
                </p>
              </div>
            </Card>

            {/* EXPENSE */}
            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total Expense
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  $
                  {totalExpense.toLocaleString()}
                </h2>

                <p className="text-sm text-red-500">
                  Spending tracked
                </p>
              </div>
            </Card>

            {/* BALANCE */}
            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Net Balance
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  $
                  {netBalance.toLocaleString()}
                </h2>

                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Financial health
                </p>
              </div>
            </Card>
          </div>

          {/* AREA CHART */}
          <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Income vs Expense
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Financial overview over time
              </p>
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    {/* INCOME */}
                    <linearGradient
                      id="income"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    {/* EXPENSE */}
                    <linearGradient
                      id="expense"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#ef4444"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#ef4444"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="opacity-20"
                  />

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Legend />

                  {/* INCOME */}
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#income)"
                    strokeWidth={3}
                  />

                  {/* EXPENSE */}
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

          {/* PIE CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* EXPENSE PIE */}
            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Expense Breakdown
                </h2>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Distribution of expenses by category
                </p>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={120}
                      innerRadius={65}
                      paddingAngle={2}
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* INCOME PIE */}
            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Income Breakdown
                </h2>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Distribution of income by category
                </p>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={120}
                      innerRadius={65}
                      paddingAngle={2}
                    >
                      {incomePieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// 🔥 GENERATE 2 YEARS OF MOCK DATA
function generateMockTransactions() {
  const expenseCategories = [
    "food",
    "housing",
    "transport",
    "shopping",
    "entertainment",
    "utilities",
    "healthcare",
    "salary",
    "freelance",
    "savings",
  ];

  const incomeCategories = [
    "savings",
    "job",
    "freelancing",
    "trading",
    "misc",
  ];

  const transactions = [];

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);

  for (let i = 0; i < 350; i++) {
    const randomDate = new Date(
      startDate.getTime() +
      Math.random() *
      (Date.now() - startDate.getTime())
    );

    const type =
      Math.random() > 0.45
        ? "expense"
        : "income";

    // CATEGORY BASED ON TYPE
    const category =
      type === "expense"
        ? expenseCategories[
        Math.floor(
          Math.random() *
          expenseCategories.length
        )
        ]
        : incomeCategories[
        Math.floor(
          Math.random() *
          incomeCategories.length
        )
        ];

    // MORE REALISTIC AMOUNTS
    let amount = 0;

    if (type === "income") {
      switch (category) {
        case "job":
          amount =
            Math.floor(Math.random() * 5000) + 4000;
          break;

        case "freelancing":
          amount =
            Math.floor(Math.random() * 2500) + 500;
          break;

        case "trading":
          amount =
            Math.floor(Math.random() * 4000) + 200;
          break;

        case "savings":
          amount =
            Math.floor(Math.random() * 2000) + 300;
          break;

        default:
          amount =
            Math.floor(Math.random() * 1500) + 100;
      }
    } else {
      switch (category) {
        case "housing":
          amount =
            Math.floor(Math.random() * 2500) + 1000;
          break;

        case "shopping":
          amount =
            Math.floor(Math.random() * 1200) + 100;
          break;

        case "healthcare":
          amount =
            Math.floor(Math.random() * 1500) + 150;
          break;

        case "transport":
          amount =
            Math.floor(Math.random() * 700) + 50;
          break;

        case "entertainment":
          amount =
            Math.floor(Math.random() * 500) + 20;
          break;

        default:
          amount =
            Math.floor(Math.random() * 400) + 20;
      }
    }

    transactions.push({
      _id: i.toString(),

      description:
        type === "income"
          ? `${category} income`
          : `${category} expense`,

      amount,

      category,

      date: randomDate.toISOString(),

      type,

      createdAt: randomDate.toISOString(),

      updatedAt: randomDate.toISOString(),
    });
  }

  // SORT BY DATE ASCENDING
  return transactions.sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date)
  );
}