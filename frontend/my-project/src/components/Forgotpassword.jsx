
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ForgotPassword({ onCancel }) {
  const [email, setEmail] = useState('');

  const handleReset = (e) => {
    e.preventDefault();

    if (email) {
      toast.success("📧 Password reset link sent to your email!");
      setEmail('');
      onCancel();
    } else {
      toast.error("⚠ Please enter your email.");
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">Forgot Password</h2>
      <p className="text-sm text-blue-700 text-center mb-4">
        🔒 Please enter your email to reset your password.
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-900 text-white py-2 rounded-md">
          Send Reset Link
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}