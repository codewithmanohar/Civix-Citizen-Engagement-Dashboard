// src/components/Navbar.jsx
import React from "react";
import gover from "../assets/gover.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-150 shadow-md w-full">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-1 ml-8">
          <img src={gover} alt="Gov Logo" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-bold text-blue-900">Civix</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-blue-900 font-medium">
          <a
            href="#home"
            className="px-4 py-2 rounded-full hover:bg-blue-900 hover:text-white transition duration-300"
          >
            Home
          </a>
          <a
            href="#about"
            className="px-4 py-2 rounded-full hover:bg-blue-900 hover:text-white transition duration-300"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-2 rounded-full hover:bg-blue-900 hover:text-white transition duration-300"
          >
            How it Works
          </a>
        </div>
      </div>
    </nav>
  );
}
