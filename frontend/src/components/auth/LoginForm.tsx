import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/services/authService";

/**
 * LoginForm Component
 * Handles user authentication and redirects after login.
 */
export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * Handles user login request.
   * @param e
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({ title: "Error", description: "Fields cannot be empty", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_id", data.user_id.toString());

      const savedTheme = localStorage.getItem("darkMode") || "light";
      document.documentElement.classList.toggle("dark", savedTheme === "dark");

      toast({ title: "Success", description: "Logged in successfully" });
      navigate("/chat");
      window.location.reload();
    } catch (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="space-y-2">
          <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};
