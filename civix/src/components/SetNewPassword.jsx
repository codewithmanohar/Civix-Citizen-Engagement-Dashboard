import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"; // 👈 icons

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  if (!email || !otp)
    return (
      <p className="text-center text-red-600 mt-10">
        Error: Missing required data. Please restart the reset process.
      </p>
    );

  // ✅ Password rules
  const passwordRules = [
    { test: /.{8,}/, label: "At least 8 characters" },
    { test: /[A-Z]/, label: "One uppercase letter" },
    { test: /[a-z]/, label: "One lowercase letter" },
    { test: /\d/, label: "One number" },
    { test: /[@$!%*?&]/, label: "One special character" },
  ];

  const isPasswordValid = (password) =>
    passwordRules.every((rule) => rule.test.test(password));

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Enter a new password");

    if (!isPasswordValid(newPassword)) {
      return toast.error("Password should match the required criteria.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (res) {
        toast.success("Password reset successfully!");
      }

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 px-4">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px] md:w-[450px] text-center"
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Set New Password
        </h2>

        {/* New Password Field */}
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full p-3 border border-gray-300 rounded-md text-lg pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-5">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full p-3 border border-gray-300 rounded-md text-lg pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Rules Checklist */}
        <div className="text-left mb-5">
          {passwordRules.map((rule, i) => {
            const passed = rule.test.test(newPassword);
            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm ${
                  passed ? "text-green-600" : "text-red-500"
                }`}
              >
                {passed ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                <span>{rule.label}</span>
              </div>
            );
          })}
        </div>

        {/* Password Match Warning */}
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-red-500 text-sm mb-4 text-left">
            Passwords do not match.
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-950 transition text-lg font-semibold"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
