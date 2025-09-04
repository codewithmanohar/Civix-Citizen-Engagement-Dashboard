import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 text-blue-900">
      <div className="text-3xl font-extrabold tracking-wide">CIVIX</div>
      <div className="flex items-center space-x-8 text-lg font-bold">
        <Link to="/" className="hover:text-blue-700 hover:underline transition duration-300">
          Home
        </Link>
        <Link
          to="/dashboard"
          className="hover:text-blue-700 hover:underline transition duration-300"
        >
          Dashboard
        </Link>
        <Link
          to="/petitions"
          className="hover:text-blue-700 hover:underline transition duration-300"
        >
          Petitions
        </Link>
        <Link
          to="/polls"
          className="hover:text-blue-700 hover:underline transition duration-300"
        >
          Polls
        </Link>
        <Link
          to="/officials"
          className="hover:text-blue-700 hover:underline transition duration-300"
        >
          Officials
        </Link>

        <button className="bg-blue-900 text-white px-5 py-2 rounded-md text-base font-semibold hover:bg-blue-800 transition">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
