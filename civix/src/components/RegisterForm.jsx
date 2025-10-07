import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api"; // axios instance
import OtpForm from "./Otpform"; // OTP component
import { Eye, EyeOff } from "lucide-react"; // eye icons

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 👈 new state
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("citizen");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !location) {
      toast.error("⚠️ Please fill all fields correctly.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("⚠️ Passwords do not match.");
      return;
    }
    // if (role === "official" && !email.endsWith(".gov.in")) {
    //   toast.error("⚠️ Public officials must use a government email.");
    //   return;
    // }

    try {
      setLoading(true);

      await api.post("/auth/register", { name, email, password, role, location });

      setOtpSent(true);

      api.post("/auth/send-otp", { email })
        .then(() => toast.success("OTP sent to your email for verification"))
        .catch((err) =>
          toast.error(err.response?.data?.message || "Failed to send OTP")
        );

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Registration failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return <OtpForm email={email} fromRegistration={true} />;
  }

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <h2 className="text-xl font-bold text-center text-blue-900">Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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

      {/* 👇 Confirm Password */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm Password"
        className="input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location (e.g New Delhi)"
        className="input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <div className="flex space-x-4">
        <label>
          <input
            type="radio"
            name="role"
            value="citizen"
            checked={role === "citizen"}
            onChange={() => setRole("citizen")}
          />{" "}
          Citizen
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="official"
            checked={role === "official"}
            onChange={() => setRole("official")}
          />{" "}
          Official
        </label>
      </div>


      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Registering..." : "Create Account"}
      </button>
    </form>
  );
}
