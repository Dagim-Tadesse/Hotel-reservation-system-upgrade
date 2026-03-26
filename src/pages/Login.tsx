import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      localStorage.setItem("hotel_admin", "true");
      toast.success("Welcome back, Administrator");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
      <div className="w-full max-w-md p-8">
        <Link to="/" className="block text-center mb-10">
          <h1 className="font-serif text-3xl font-bold">
            Grand<span className="text-gradient-gold">Horizon</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Hotel Management System</p>
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="font-serif text-2xl font-bold text-center mb-2 text-foreground">
            Admin Login
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Access the hotel management dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-3 bg-secondary/50 rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: <span className="font-medium text-foreground">admin</span> / <span className="font-medium text-foreground">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
