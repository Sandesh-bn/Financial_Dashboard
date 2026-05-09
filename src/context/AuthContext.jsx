import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // 🔥 hydrate auth on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  // 🔐 LOGIN
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  async function login({ name, email, password }) {
    const res = await fetch(API_BASE_URL + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();
    console.log("DATA")

    // assuming API returns: { token, user }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    navigate("/");
  }


  async function register({ name, email, password }) {
    const res = await fetch(API_BASE_URL + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    const data = await res.json();

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      navigate("/");
      return;
    }

    navigate("/login");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
