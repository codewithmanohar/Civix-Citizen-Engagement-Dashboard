// OfficialLayout.jsx
import { Outlet } from "react-router-dom";
import OfficialSidebar from "./OfficialSidebar";

export default function OfficialLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <OfficialSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This will render the nested page */}
      </main>
    </div>
  );
}
