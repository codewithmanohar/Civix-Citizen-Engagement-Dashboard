import React, { useState } from "react";
import heroImage from "../assets/info1.jpg"; // your image file
import AuthModal from "./AuthModal.jsx";

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 gap-10 bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300">
      {/* Left */}
      <div className="md:w-1/2 text-left">
        <h1 className="text-5xl font-extrabold text-blue-900 leading-tight">
          Empower Your Community to <br /> Advocate for Change
        </h1>
        <p className="mt-6 text-lg text-gray-700 max-w-xl">
          Civix enables citizens to engage in local governance through petitions, voting, and tracking officials’ responses.
        </p>
        <div className="mt-8">
          <button
            onClick={() => {
              setShowModal(true);
              setShowForgotPassword(false);
            }}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow transition text-lg"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="md:w-1/2 flex justify-center">
        <img src={heroImage} alt="Advocacy illustration" className="max-w-full h-auto" />
      </div>

      {/* Modal */}
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          showForgotPassword={showForgotPassword}
          onShowForgotPassword={() => setShowForgotPassword(true)}
          onShowLoginTabs={() => setShowForgotPassword(false)}
        />
      )}
    </section>
  );
}
