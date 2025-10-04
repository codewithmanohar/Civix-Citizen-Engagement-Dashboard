import { useState } from "react";
import { toast } from "react-toastify";
import OtpForm from "./OtpForm";
import api from "../lib/api";
import DotsLoader from "./Loaders/DotsLoader";

export default function ForgotPassword({ onCancel }) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Enter a valid email");

    // Send OTP in the background
    try {
      setLoading(true);
      const response = await api.post("/auth/send-otp", { email });
      if(response){
        setOtpSent(true);
        toast.success("✅ OTP sent to your email!");
      } 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
            Forgot Password
          </h2>
          <p className="text-sm text-blue-700 text-center mb-4">
            🔒 Please enter your email to receive OTP.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="input w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* {loading && <p className="text-sm text-blue-900">Sending OTP...</p>} */}
          {loading 
                ? <p className="text-center bg-blue-900 py-5 rounded-md"><DotsLoader color="bg-white" /></p>
                : <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-900 text-white py-2 rounded-md"
            >
              Send OTP
            </button>
            <button 
              type="button" 
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md" 
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
          
          }
          
        </form>
      ) : (
        <OtpForm email={email} fromForgotPassword={true} />
      )}
    </div>
  );
}
