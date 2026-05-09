import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function withType(items, type) {
  return items.map((item) => ({
    ...item,
    amount: Number(item.amount || 0),
    type: item.type || type
  }));
}

export function TransactionProvider({ children }) {
  const { token, user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = useMemo(() => {
    if (!token) return null;

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  }, [token]);

  async function request(path, options = {}) {
    if (!authHeaders) {
      throw new Error("Missing auth token");
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async function fetchIncomes() {
    const data = await request("/income/get");
    setIncomes(withType(data, "income"));
  }

  async function fetchExpenses() {
    const data = await request("/expense/get");
    setExpenses(withType(data, "expense"));
  }

  async function refreshTransactions() {
    if (!authHeaders) return;

    try {
      setLoading(true);
      setError("");
      const [incomeData, expenseData] = await Promise.all([
        request("/income/get"),
        request("/expense/get")
      ]);

      setIncomes(withType(incomeData, "income"));
      setExpenses(withType(expenseData, "expense"));
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addIncome(payload) {
    await request("/income/add", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    await fetchIncomes();
  }

  async function addExpense(payload) {
    await request("/expense/add", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    await fetchExpenses();
  }

  useEffect(() => {
    if (!user || !token) {
      setIncomes([]);
      setExpenses([]);
      return;
    }

    refreshTransactions();
  }, [user, token]);

  const transactions = useMemo(() => {
    return [...incomes, ...expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [incomes, expenses]);

  return (
    <TransactionContext.Provider
      value={{
        incomes,
        expenses,
        transactions,
        loading,
        error,
        addIncome,
        addExpense,
        refreshTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransactions must be used inside TransactionProvider");
  }

  return context;
}
