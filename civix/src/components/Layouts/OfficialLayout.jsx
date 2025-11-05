// OfficialLayout.jsx
import { Outlet } from "react-router-dom";
import OfficialSidebar from "../Sidebars/OfficialSidebar";

export default function OfficialLayout() {
  return (
    <div className="flex w-full">
      {/* Sticky Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm sticky top-0 self-start h-fit">
        <OfficialSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 overflow-y-auto px-6">
          <Outlet /> {/* Render nested routes here */}
        </main>
      </div>
    </div>
  );
}
