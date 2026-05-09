import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useTransactions } from "../context/TransactionContext";

const initialForm = {
  description: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10)
};

export default function Income() {
  const { incomes, addIncome, loading, error } = useTransactions();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addIncome({
        ...form,
        amount: Number(form.amount)
      });
      setForm(initialForm);
    } catch (err) {
      alert(err.message || "Unable to add income");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Income</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {error || "Create and review your income entries"}
        </p>
      </div>

      <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-5">
          <input
            name="description"
            placeholder="Description"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
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
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="date"
            type="date"
            className="rounded border border-zinc-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button
            disabled={submitting}
            className="rounded bg-emerald-600 p-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add income"}
          </button>
        </form>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Income entries</h2>
        </div>

        {loading ? (
          <p className="p-4 text-sm text-zinc-500">Loading income...</p>
        ) : incomes.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">No income entries yet.</p>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {incomes.map((income) => (
              <TransactionRow key={income._id} item={income} />
            ))}
          </div>
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
      <p className="font-semibold text-emerald-600">
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
