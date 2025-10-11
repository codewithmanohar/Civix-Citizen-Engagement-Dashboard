import React from "react";
import gover from "../assets/gover.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E3F2FD] shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <img src={gover} alt="Gov Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold text-blue-900">Civix</span>
          </div>

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
      </div>
    </nav>
  );
}
