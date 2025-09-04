import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onForgotPassword, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      toast.success("✅ Successfully logged in!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      toast.error("⚠️ Please enter both email and password.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <h2 className="text-xl font-bold text-center text-blue-900">Welcome Back</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold"
      >
        Sign In
      </button>

      <p
        className="text-sm text-center text-blue-700 cursor-pointer hover:underline"
        onClick={onForgotPassword}
      >
        Forgot Password?
      </p>

      <p className="text-sm text-center text-gray-600 mt-2">
        New to Civix?{" "}
        <span
          className="text-blue-900 font-semibold cursor-pointer hover:underline"
          onClick={onSwitchToRegister}
        >
          Create Account
        </span>
      </p>
    </form>
  );
}
