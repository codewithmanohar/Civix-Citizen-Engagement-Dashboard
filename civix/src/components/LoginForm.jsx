import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from "../lib/api";
import { Eye, EyeOff } from "lucide-react"; // 👈 icons

export default function LoginForm({ onForgotPassword, onSwitchToRegister, mode = "full" }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      
      const { token, user } = res.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userEmail", user.email || email);
      localStorage.setItem("location", user.location);
      localStorage.setItem("userId", user._id || user.id);

      toast.success("Login successful! 🎉");

      if (user.role === "official") {
        navigate("/dashboard/official");
      } else {
        navigate("/dashboard/citizen");
      }

      console.log("Login success:", res.data);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  const formContent = (
    <form className="space-y-4" onSubmit={handleLogin}>
      <h2 className="text-xl font-bold text-center text-blue-900">Welcome Back</h2>
      
      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* 👇 Password field with eye toggle */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="input w-full pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md">
        Sign In
      </button>

      <p
        className="text-sm text-center text-blue-700 cursor-pointer hover:underline"
        onClick={onForgotPassword}
      >
        Forgot Password?
      </p>
      <p className="text-sm text-center text-gray-600 mt-2">
        New to Civix?{' '}
        <span
          className="text-blue-900 font-semibold cursor-pointer hover:underline"
          onClick={onSwitchToRegister}
        >
          Create Account
        </span>
      </p>
    </form>
  );

  return mode === "full" ? (
    <div className="flex items-center justify-center min-h-screen bg-brand-light px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {formContent}
      </div>
    </div>
  ) : (
    <div className="bg-white p-4 rounded-md shadow-md max-w-md mx-auto">
      {formContent}
    </div>
  );
}
