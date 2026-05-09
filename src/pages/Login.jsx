import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded bg-white p-6 shadow"
      >
        <h1 className="text-xl font-bold">Login</h1>

        <input
          name="name"
          placeholder="Name"
          className="w-full rounded border p-2"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
          value={form.password}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Need an account?{" "}
          <Link to="/signup" className="font-medium text-black underline">
            Sign up
          </Link>
        </p>
        <p>Try john@gmail.com:12345678 for prepopulated data</p>
      </form>
    </div>
  );
}
