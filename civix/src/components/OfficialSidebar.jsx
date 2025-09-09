import { Link, useLocation } from "react-router-dom";

export default function OfficialSidebar() {
  const location = useLocation();

  const links = [
    { to: "/dashboard/official", label: "Dashboard" },
    {
      label: "Petitions",
      children: [
        { to: "/dashboard/official/petitions/pending", label: "Pending" },
        { to: "/dashboard/official/petitions/approved", label: "Approved" },
        { to: "/dashboard/official/petitions/resolved", label: "Resolved" },
      ],
    },
    { to: "/polls", label: "Polls" },
    { to: "/officials", label: "Officials" },
    { to: "/reports", label: "Reports" },
    { to: "/settings", label: "Settings" },
    { to: "/help", label: "Help & Support" },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Profile */}
      <div className="p-6 border-b text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl font-bold mx-auto">
          S
        </div>
        <h2 className="mt-3 font-semibold text-gray-800">Sri</h2>
        <p className="text-xs text-gray-500">Unverified Official</p>
        <p className="text-xs text-gray-400">📍 San Diego, CA</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon, children }) => {
  if (children) {
    return (
      <div key={label}>
        <div className="flex items-center gap-3 px-4 py-2 text-gray-500 font-semibold">
          {label}
        </div>
        <div className="ml-6 space-y-1">
          {children.map(({ to: childTo, label: childLabel }) => {
            const isActive = location.pathname === childTo; // exact match for child links
            return (
              <Link
                key={childTo}
                to={childTo}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {childLabel}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const isActive = location.pathname === to; // exact match for top-level links
  return (
    <Link
      key={to}
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
})}

      </nav>
    </div>
  );
}
