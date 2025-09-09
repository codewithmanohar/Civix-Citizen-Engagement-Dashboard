
import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");


  const handleSignout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Topbar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSignout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Signout
          </button>
        </div>

        {/* Welcome Section */}
        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back, Sri!</h2>
          <p className="text-gray-600 mt-2">
            See what’s happening in your community and make your voice heard.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 bg-white border rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold text-gray-800">My Petitions</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
            <p className="text-sm text-gray-500">petitions</p>
          </div>
          <div className="p-5 bg-white border rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold text-gray-800">Successful Petitions</h4>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            <p className="text-sm text-gray-500">or under review</p>
          </div>
        </section>

        {/* Active Petitions Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800">Active Petitions Near You</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Showing for: <span className="font-medium text-gray-700">San Diego, CA</span>
          </p>

          {/* Category Filters */}
<div className="flex flex-wrap gap-2 mb-6">
  {[
    "All Categories",
    "Environment",
    "Infrastructure",
    "Education",
    "Public Safety",
    "Transportation",
  ].map((category, index) => (
    <button
      key={index}
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        selectedCategory === category
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {category}
    </button>
  ))}
</div>


          {/* No Petitions Message */}
          <div className="text-center text-gray-500 py-10">
            <p>No petitions found with the current filters.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Clear Filters
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
