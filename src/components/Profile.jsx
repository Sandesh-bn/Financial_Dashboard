import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";

export default function Profile() {
  const { user, token, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const previousUser = user;

    const optimisticUser = {
      ...user,
      name,
      email,
    };

    setUser(optimisticUser);
    localStorage.setItem("user", JSON.stringify(optimisticUser));

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
            password: password || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Profile updated successfully");
    } catch (err) {
      setUser(previousUser);
      localStorage.setItem("user", JSON.stringify(previousUser));

      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your account details
        </p>
      </div>

      <Card className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Password (optional)</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}