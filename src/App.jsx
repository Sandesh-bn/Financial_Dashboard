import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const { user } = useAuth();

  return <AppRoutes user={user} />;
}