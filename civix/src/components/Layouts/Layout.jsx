import Sidebar from "../Sidebars/Sidebar";
import { Outlet } from "react-router-dom"; 

const Layout = ({ children }) => {
  return (
    <div className="flex w-full">
      {/* Sticky Sidebar */}
      <div className="w-64 bg-blue-50 border-r shadow-sm sticky top-0 self-start h-fit">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1  overflow-y-auto">{children}
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;
