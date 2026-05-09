import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { user, token, setUser} = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            ...(password ? { password } : {}), // optional
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");
      // ✅ update storage
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ update UI state (important)
      setUser(data.user);

      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your account details
        </p>
      </div>

      {/* FORM CARD */}
      <Card className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* PASSWORD (optional) */}
          <div className="space-y-2">
            <Label>Password (optional)</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          {/* STATUS MESSAGE */}
          {message && (
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          )}

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}