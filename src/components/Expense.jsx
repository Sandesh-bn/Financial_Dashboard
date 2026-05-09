import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTransactions } from "../context/TransactionContext";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const initialForm = {
  description: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10)
};

const EXPENSE_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899"
];

const PAGE_SIZE = 10;

export default function Expense() {
  const { expenses, addExpense, loading, error } = useTransactions();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [range, setRange] = useState("30days");
  const [page, setPage] = useState(1);

  const filteredExpenses = useMemo(() => {
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

    return expenses.filter((expense) => new Date(expense.date) >= cutoffDate);
  }, [expenses, range]);

  const lineChartData = useMemo(() => {
    const grouped = {};
    const sortedExpenses = [...filteredExpenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedExpenses.forEach((expense) => {
      const key = new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: range === "30days" ? "numeric" : undefined,
        year: range === "30days" ? undefined : "2-digit"
      });

      grouped[key] = (grouped[key] || 0) + expense.amount;
    });

    return Object.entries(grouped).map(([date, amount]) => ({
      date,
      amount
    }));
  }, [filteredExpenses, range]);

  const pieChartData = useMemo(() => {
    const grouped = {};

    filteredExpenses.forEach((expense) => {
      grouped[expense.category] =
        (grouped[expense.category] || 0) + expense.amount;
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredExpenses]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const paginatedExpenses = filteredExpenses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [range, expenses]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addExpense({
        ...form,
        amount: Number(form.amount)
      });
      setForm(initialForm);
    } catch (err) {
      alert(err.message || "Unable to add expense");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {error || "Create and review your expense entries"}
        </p>
      </div>

      <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-5">
          <input
            name="description"
            placeholder="Description"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="date"
            type="date"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button
            disabled={submitting}
            className="rounded bg-red-500 p-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add expense"}
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Expense overview</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-900 sm:w-52"
        >
          <option value="30days">Last 30 days</option>
          <option value="6months">Last 6 months</option>
          <option value="1year">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-base font-semibold">Expense trend</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Expenses over the selected period
            </p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h3 className="text-base font-semibold">Expenses by category</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Category distribution for the selected period
            </p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  innerRadius={58}
                  paddingAngle={2}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
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
      </div>

      <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Expense entries</h2>
          <p className="text-sm text-zinc-500">
            Showing {paginatedExpenses.length} of {filteredExpenses.length}
          </p>
        </div>

        {loading ? (
          <p className="p-4 text-sm text-zinc-500">Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">No expense entries yet.</p>
        ) : (
          <>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedExpenses.map((expense) => (
                <TransactionRow key={expense._id} item={expense} />
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 p-4 dark:border-zinc-800">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="rounded border border-zinc-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-800"
              >
                Previous
              </button>
              <p className="text-sm text-zinc-500">
                Page {page} of {totalPages}
              </p>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="rounded border border-zinc-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-800"
              >
                Next
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function TransactionRow({ item }) {
  return (
    <div className="grid gap-2 p-4 text-sm md:grid-cols-[1fr_140px_140px_130px] md:items-center">
      <div>
        <p className="font-medium">{item.description}</p>
        <p className="text-xs text-zinc-500">{item.category}</p>
      </div>
      <p className="font-semibold text-red-500">
        ${item.amount.toLocaleString()}
      </p>
      <p className="text-zinc-500">
        {new Date(item.date).toLocaleDateString()}
      </p>
      <p className="text-xs uppercase tracking-wide text-zinc-400">
        {item.type}
      </p>
    </div>
  );
}
