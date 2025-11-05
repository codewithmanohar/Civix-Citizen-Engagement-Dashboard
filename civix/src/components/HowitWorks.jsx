// src/components/HowItWorks.jsx
import { useState } from "react";
import { motion } from "framer-motion";

import {
  UserPlus,
  FileEdit,
  CheckSquare,
  FileSearch,
  ThumbsUp,
  Download,
  Vote,
  ClipboardList, // ✅ New icon for Manage Poll Results
} from "lucide-react";
import RegisterForm from "./RegisterForm";
const citizenSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register & Login",
    description:
      "Create your citizen account in minutes. Join thousands of engaged citizens making a difference in your community.",
    features: ["Quick registration", "Secure authentication", "Email verification"],
  },
  {
    number: "02",
    icon: FileEdit,
    title: "Create or Sign Petitions",
    description:
      "Start your own petition or support causes that matter to you. Every signature counts towards real change.",
    features: ["Easy petition creation", "Digital signatures", "Share with community"],
  },
  {
    number: "03",
    icon: Vote,
    title: "Vote in Polls",
    description:
      "Make your voice heard on local issues. Participate in democratic decision-making for your area.",
    features: ["Simple voting interface", "Real-time results", "Multiple poll types"],
  },
  {
    number: "04",
    icon: FileSearch,
    title: "View & Extract Reports",
    description:
      "Stay informed about petition progress and government responses. Download detailed analytics and insights.",
    features: ["Detailed analytics", "PDF export", "Progress tracking"],
  },
];

const officialSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register & Login",
    description:
      "Create your official account to manage petitions, polls, and reports efficiently.",
    features: ["Secure login", "Account verification", "Access official dashboard"],
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Review All Petitions",
    description:
      "Access a comprehensive dashboard of all citizen petitions. Filter, search, and prioritize based on signatures and urgency.",
    features: ["Centralized dashboard", "Advanced filtering", "Priority sorting"],
  },
  {
    number: "03",
    icon: ThumbsUp,
    title: "Approve or Reject Petitions",
    description:
      "Review petitions thoroughly and make informed decisions. Provide official responses and action plans to citizens.",
    features: ["Approval workflow", "Response templates", "Action planning"],
  },
  {
    number: "04",
    icon: ClipboardList, // ✅ Replaced icon
    title: "Manage Poll Results",
    description:
      "View comprehensive poll results and analytics. Close polls when voting period ends and publish final results.",
    features: ["Result analytics", "Poll management", "Result publication"],
  },
  {
    number: "05",
    icon: Download,
    title: "Reports & Analytics",
    description:
      "Detailed reports on civic engagement. Export data for government records and public transparency.",
    features: ["Custom reports", "Data export", "Compliance tracking"],
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("citizens");
  const steps = activeTab === "citizens" ? citizenSteps : officialSteps;
const [showRegister, setShowRegister] = useState(false);
  const [role, setRole] = useState("citizen"); // role to pre-select
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-[#E3F2FD] to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl mb-6 text-[#1A237E]">
            How Civix Works
          </h2>
          <p className="text-lg text-[#546E7A] max-w-2xl mx-auto mb-8">
            Different workflows designed for citizens and government officials to
            maximize civic engagement.
          </p>

          {/* Simple Tabs */}
          <div className="flex justify-center max-w-md mx-auto bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab("citizens")}
              className={`flex-1 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "citizens"
                  ? "bg-[#1565C0] text-white"
                  : "text-[#1565C0] hover:bg-[#E3F2FD]"
              }`}
            >
              👥 For Citizens
            </button>
            <button
              onClick={() => setActiveTab("officials")}
              className={`flex-1 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "officials"
                  ? "bg-[#1565C0] text-white"
                  : "text-[#1565C0] hover:bg-[#E3F2FD]"
              }`}
            >
              🏛️ For Officials
            </button>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={`${activeTab}-${step.number}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12`}
              >
                {/* Text Section */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="text-6xl text-[#4A90E2]/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      {step.number}
                    </motion.div>
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#4A90E2] to-[#1565C0] rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  <h3 className="text-3xl text-[#1A237E]">{step.title}</h3>
                  <p className="text-lg text-[#546E7A] max-w-md">
                    {step.description}
                  </p>

                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[#546E7A]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Card */}
                <div className="flex-1 w-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#E3F2FD] to-white p-8"
                  >
                    <div className="flex items-center justify-center mb-6">
                      <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-[#4A90E2] to-[#1565C0] rounded-3xl flex items-center justify-center shadow-lg"
                      >
                        <Icon className="w-12 h-12 text-white" />
                      </motion.div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="inline-block bg-white rounded-xl px-4 py-2 shadow-md">
                        <span className="text-sm text-[#1565C0]">
                          Step {step.number}
                        </span>
                      </div>
                      <h4 className="text-xl text-[#1A237E]">{step.title}</h4>
                    </div>

                    {/* Decorations */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-[#4A90E2]/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#1565C0]/10 rounded-full blur-2xl" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#4A90E2] to-[#1565C0] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            setRole(activeTab === "citizens" ? "citizen" : "official"); // set role
            setShowRegister(true); // show modal
          }}
        >
          {activeTab === "citizens" ? "Start as a Citizen" : "Access Official Portal"}
        </motion.button>
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✕
            </button>

            <RegisterForm initialRole={role} />
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
