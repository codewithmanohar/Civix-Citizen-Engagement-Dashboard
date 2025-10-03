import React, { useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart2,
  Users,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const userName = localStorage.getItem("name") || "User";
  const userLocation = localStorage.getItem("location") || "Unknown";
  const role = localStorage.getItem("userRole"); // ✅ get role
  const currentRoute = useLocation(); // ✅ get current route
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignout = () => {
    localStorage.clear();
    navigate("/");
  };



  const links = [
    {
      to: role === "citizen" ? "/dashboard/citizen" : "/dashboard/official",
      label: "Dashboard",
      icon: Home,
    },
    {
      to: role === "citizen"
        ? "/dashboard/citizen/petitions"
        : "/dashboard/official/petitions",
      label: "Petitions",
      icon: FileText,
    },
    { to: "/dashboard/citizen/polls", label: "Polls", icon: BarChart2 },
    { to: "/dashboard/citizen/profile", label: "Profile", icon: Users },
    { to: "/dashboard/citizen/Reports", label: "Reports", icon: ClipboardList },
    { to: "/dashboard/citizen/Settings", label: "Settings", icon: Settings },
    { to: "/dashboard/citizen/Help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-blue-50 border-r shadow-sm flex flex-col min-h-screen">
      {/* Profile */}
      <div className="p-6 border-b text-center bg-blue-100">
        <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-2xl font-bold mx-auto">
          {userName.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-3 font-semibold text-gray-800">{userName}</h2>
        <p className="text-xs text-gray-500">
          {role === "official" ? "Official" : "Citizen"}
        </p>
        <p className="text-xs text-gray-400">📍 {userLocation}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = currentRoute.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
              {label}
            </Link>
          );
        })}
      </nav>
      {/* Signout Button */}
      <div className="p-4 border-t">
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
        >
          <LogOut size={18} />
          Signout
        </button>
      </div>

      {/* Custom Popup */}
       {showConfirm && (
        // The z-50 fixed overlay ensures it is on top of and blocks background content.
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          // This click listener on the overlay captures clicks outside the modal content
          // and prevents them from reaching elements underneath.
          onClick={() => setShowConfirm(false)}
        >
          {/* Modal Content */}
          <div
            className="w-[400px] bg-white shadow-2xl border border-gray-200 rounded-xl p-6 relative"
            // This stops click events inside the modal from bubbling up and closing the modal via the overlay's onClick.
            onClick={(e) => e.stopPropagation()} 
          >
            <p className="text-gray-900 text-lg font-semibold mb-4 text-center">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignout}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;