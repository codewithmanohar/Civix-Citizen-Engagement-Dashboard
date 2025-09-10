/*import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { email, otp } = location.state || {};

  if (!email || !otp) {
    return <p>Error: Missing required data. Please restart the reset process.</p>;
  }

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      
      // ✅ Show success toast
      toast.success("Password reset successfully!");

      // ⏱ Wait 1.5 seconds before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Password reset failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="bg-white p-6 rounded-xl shadow-md w-[350px] text-center mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-900 mb-4">Set New Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-950 transition"
      >
        Reset Password
      </button>
    </form>
  );
}*/
/*import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  if (!email || !otp)
    return <p>Error: Missing required data. Please restart the reset process.</p>;
  console.log({ email, otp, password: newPassword }); // debug


  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Enter a new password");

    try {
      await api.post("/auth/reset-password", { email, otp, password: newPassword });

      // ✅ Show success toast first
      toast.success("Password reset successfully!");

      // ⏱ Wait a short time before redirecting
      setTimeout(() => {
        navigate("/login"); // redirect to login
      }, 1500); // 1.5 seconds to let toast show

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="bg-white p-6 rounded-xl shadow-md w-[350px] text-center mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-900 mb-4">Set New Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-950 transition"
      >
        Reset Password
      </button>
    </form>
  );
}*/
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  if (!email || !otp)
    return <p>Error: Missing required data. Please restart the reset process.</p>;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Enter a new password");

    try {
      // ✅ Single API call: verifies OTP and updates password
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });

      // ✅ Show success toast
      toast.success("Password reset successfully!");

      // ⏱ Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="bg-white p-6 rounded-xl shadow-md w-[350px] text-center mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-900 mb-4">Set New Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-950 transition"
      >
        Reset Password
      </button>
    </form>
  );
}

