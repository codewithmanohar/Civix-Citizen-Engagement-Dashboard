import React, { useState } from "react";
import girl4 from "../assets/girl4.png";
import gover from "../assets/gover.png";
import petition from "../assets/petition.png";
import poll from "../assets/poll.png";
import graph from "../assets/graph.png";
import AuthModal from "./Auth/AuthModal.jsx";

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="bg-blue-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-900">Civix</span>
            <img src={gover} alt="Gov Logo" className="w-8 h-8 object-contain" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-blue-900 font-medium">
            <a href="#about">About</a>
            <a href="#how-it-works">How it Works</a>
            <button
              onClick={() => {
                setShowModal(true);
                setShowForgotPassword(false);
              }}
              className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-md text-sm font-semibold transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 gap-10 max-w-7xl mx-auto">
        {/* Left */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl font-extrabold text-blue-900 leading-tight mb-6">
            Empower Your Community <br /> to Advocate for Change
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mb-8">
            Civix enables citizens to engage in local governance through
            petitions, polls, and transparent reports. Join the movement and
            make your voice count.
          </p>
          <button
            onClick={() => {
              setShowModal(true);
              setShowForgotPassword(false);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-md text-lg transition duration-300 shadow-md"
          >
            🚀 Get Started
          </button>
        </div>

        {/* Right */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={girl4}
            alt="Advocacy illustration"
            className="max-w-md w-full h-auto rounded-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-6 bg-blue-100 text-center scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-blue-900 mb-6">About Civix</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-12">
          Civix helps communities participate in governance with ease and
          transparency. Here’s how we empower you.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
            <img
              src={petition}
              alt="Petitions"
              className="w-24 h-24 mx-auto mb-6"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Petitions</h3>
            <p className="text-gray-600">
              Create and sign petitions that matter to your community and see
              real change happen.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
            <img src={poll} alt="Polls" className="w-24 h-24 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Polls</h3>
            <p className="text-gray-600">
              Participate in polls to voice your opinions and influence
              governance decisions directly.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
            <img src={graph} alt="Reports" className="w-24 h-24 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Reports</h3>
            <p className="text-gray-600">
              Access transparent reports and track the impact of civic actions
              in your community.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-blue-100 text-center scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-blue-900 mb-6">How It Works</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-12">
          We make civic participation simple, effective, and transparent. Here’s
          how you can get started.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
            <img
              src={petition}
              alt="Start Petitions"
              className="w-24 h-24 mx-auto mb-6"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Start Petitions
            </h3>
            <p className="text-gray-600">
              Raise issues that matter, gather support, and push for action in
              your community.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
            <img src={poll} alt="Vote" className="w-24 h-24 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Vote</h3>
            <p className="text-gray-600">
              Engage in decision-making by voting on policies and initiatives
              with transparency.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
            <img
              src={graph}
              alt="Track Progress"
              className="w-24 h-24 mx-auto mb-6"
            />
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Follow updates and measure the impact of petitions and polls in
              your area.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center">
        <p>© 2025 Civix. All Rights Reserved.</p>
      </footer>

      {/* Modal */}
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          showForgotPassword={showForgotPassword}
          onShowForgotPassword={() => setShowForgotPassword(true)}
          onShowLoginTabs={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
}
