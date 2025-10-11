import React, { useState } from "react";
import hero from "../assets/hero.png";
import AuthModal from "./Auth/AuthModal";
import HowItWorks from "./HowItWorks";
import { motion } from "framer-motion";
import { FileText, BarChart3, PieChart } from "lucide-react";

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="bg-blue-150">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E3F2FD] via-[#BBDEFB] to-[#90CAF9]"
      >
        {/* Left */}
        <div className="md:w-1/2 text-left ml-16 -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full"
          >
            <span className="text-[#1565C0]">Digital Civic Engagement Platform</span>
          </motion.div>

          <h1 className="text-5xl font-extrabold text-blue-900 leading-tight mb-6">
            Empower Your Community <br /> to Advocate for Change
          </h1>

          <p className="text-lg text-gray-700 max-w-xl mb-8">
            Civix enables citizens to engage in local governance through petitions,
            polls, and transparent reports. Join the movement and make your voice
            count.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowModal(true);
                setShowForgotPassword(false);
              }}
              className="bg-blue-900 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-md text-lg transition duration-300 shadow-md"
            >
              Get Started
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white rounded-full px-8 py-3 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
          >
            <div className="text-center lg:text-left">
              <div className="text-3xl text-[#1565C0]">50</div>
              <div className="text-sm text-[#546E7A]">Active Users</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl text-[#1565C0]">100</div>
              <div className="text-sm text-[#546E7A]">Petitions</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl text-[#1565C0]">150+</div>
              <div className="text-sm text-[#546E7A]">Cities</div>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={hero}
            alt="Advocacy illustration"
            className="w-[100px] md:w-[600px] h-auto rounded-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white text-center w-full min-h-screen">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">About Civix</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-12">
          Civix enables citizens to participate in local governance by creating petitions,
          voting in polls, and tracking government responses. It promotes transparency,
          accountability, and community involvement.
        </p>

        <div className="grid md:grid-cols-3 gap-10 w-full px-10">
          {/* Petitions */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-transform">
            <FileText className="w-16 h-16 mx-auto mb-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Petitions</h3>
            <p className="text-gray-600">
              Raise and sign petitions to voice community concerns. Drive meaningful
              change in your local area.
            </p>
          </div>

          {/* Polls */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-transform">
            <BarChart3 className="w-16 h-16 mx-auto mb-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Polls</h3>
            <p className="text-gray-600">
              Participate in public sentiment voting. Share your opinion on issues that
              matter to your community.
            </p>
          </div>

          {/* Reports */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-transform">
            <PieChart className="w-16 h-16 mx-auto mb-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Reports</h3>
            <p className="text-gray-600">
              Access transparent reports and track the impact of civic actions in your
              community.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center w-full">
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
