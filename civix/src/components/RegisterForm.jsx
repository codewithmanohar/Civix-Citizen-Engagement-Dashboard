import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api"; // axios instance
import OtpForm from "./OtpForm"; // OTP component

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("citizen");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !location) {
      toast.error("⚠️ Please fill all fields correctly.");
      return;
    }
    if (role === "official" && !email.endsWith(".gov.in")) {
      toast.error("⚠️ Public officials must use a government email.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Register user
      await api.post("/auth/register", { name, email, password, role, location });

      // 2️⃣ Show OTP form immediately
      setOtpSent(true);
      //toast.success("🎉 Registered successfully! Sending OTP...");

      // 3️⃣ Send OTP in background
      api.post("/auth/send-otp", { email })
        .then(() => toast.success("OTP sent to your email for verification"))
        .catch((err) => toast.error(err.response?.data?.message || "Failed to send OTP"));

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Registration failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render OTP form if OTP sent
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
      <input
        type="password"
        placeholder="Password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
