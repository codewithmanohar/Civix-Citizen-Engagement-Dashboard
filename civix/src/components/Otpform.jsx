import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api"; // make sure you import your axios instance

export default function OtpForm({ email, fromRegistration = false, fromForgotPassword = false }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(180);
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP input
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && element.nextSibling) element.nextSibling.focus();
  };

  // Handle OTP verification
  const handleNext = async () => {
    const enteredOtp = otp.join("").trim();
    if (enteredOtp.length !== 6) {
      toast.error("Enter all 6 digits");
      return;
    }

    try {
      // Verify OTP
      await api.post("/auth/verify-otp", { email, otp: enteredOtp });
      // Show success toast
      toast.success("✅ OTP verified successfully!");

      // Navigate after a short delay so toast can be seen
      setTimeout(() => {
        if (fromRegistration) {
          navigate("/login");
        } else if (fromForgotPassword) {
           navigate(`/set-new-password?email=${email}&otp=${enteredOtp}`);
        }
      }, 500);

    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-[350px] text-center mx-auto">
      <h2 className="text-xl font-bold text-blue-900 mb-2">Enter OTP</h2>
      <p className="text-gray-600 mb-4">OTP sent to {email}</p>

      <div className="flex justify-center gap-2 mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-3">
        OTP will expire in{" "}
        <span className="font-semibold text-red-500">
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}{timeLeft % 60}
        </span>
      </p>

      <button
        onClick={handleNext}
        className="w-full py-2 bg-blue-900 text-white rounded-md font-medium hover:bg-blue-950 transition"
        disabled={timeLeft === 0}
      >
        {timeLeft > 0 ? "Next" : "OTP Expired"}
      </button>
    </div>
  );
}
