import { Link } from 'react-router-dom';

const Navbar = () => {
  const role = localStorage.getItem("userRole");
  const dashboardPath = role === "official" ? "/dashboard/official" : "/dashboard/citizen";

  return (
    <nav className="flex justify-between items-center px-10 py-6 text-blue-900">
      <div className="text-3xl font-extrabold tracking-wide">CIVIX</div>
      <div className="flex items-center space-x-8 text-lg font-bold">
        <Link to="/" className="hover:text-blue-700 hover:underline transition duration-300">Home</Link>
        <Link to={dashboardPath} className="hover:text-blue-700 hover:underline transition duration-300">Dashboard</Link>
        <Link to="/petitions" className="hover:text-blue-700 hover:underline transition duration-300">Petitions</Link>
        <Link to="/polls" className="hover:text-blue-700 hover:underline transition duration-300">Polls</Link>
        <Link to="/officials" className="hover:text-blue-700 hover:underline transition duration-300">Settings</Link>
    
      </div>
    </nav>
  );
};

export default Navbar;
