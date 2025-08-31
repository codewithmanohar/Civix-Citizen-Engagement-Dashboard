import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("citizen");

  const handleRegister = (e) => {
    e.preventDefault();

    if (name && email && password && password === confirm) {
      toast.success("🎉 Successfully registered!");
    } else {
      toast.error("⚠️ Please fill all fields correctly.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <h2 className="text-xl font-bold text-center text-blue-900">Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
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
          Public Official
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold"
      >
        Create Account
      </button>
    </form>
  );
}
