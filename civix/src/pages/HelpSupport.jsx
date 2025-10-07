
// src/pages/HelpSupport.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, FileText, Settings } from "lucide-react";

const HelpSupport = () => {
  const [role, setRole] = useState("citizen");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "citizen";
    setRole(storedRole);
  }, []);

  const toggleQuestion = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  // FAQs
  const citizenFAQs = {
    "Most Frequently Asked": [
      { q: "How can I create or sign a petition?", a: "Go to the 'Petitions' tab in your dashboard. You can browse active petitions, sign them, or click 'Create Petition' to submit a new one." },
      { q: "How do I vote in polls?", a: "Select 'Polls' from the sidebar to view active polls. Click on any poll and choose your response to cast your vote." },
      { q: "Can I edit my profile information?", a: "Yes, click on your profile icon in the top right, go to 'Account Settings', and update your information." },
      { q: "How can I reset my password?", a: "Click on 'Forgot Password?' on the login page and follow the instructions to reset your password." },
      { q: "How do I view past petitions I signed?", a: "Go to the 'My Activity' section in your dashboard to see all petitions you have created or signed." },
    ],
    "Other Support": [
      { q: "Can I track the progress of my petitions?", a: "Yes, each petition has a live status — Active, Under Review, or Closed. You can also see the number of supporters and official updates." },
      { q: "How do I contact support?", a: "You can reach out to our support team for help with account or verification issues." },
      { q: "Is my personal information safe?", a: "Yes, we follow strict data privacy and security guidelines to protect all user information." },
      { q: "How do I delete my account?", a: "You can request account deletion by contacting our support team at Support-civix@civix.com." },
    ],
  };

  const officialFAQs = {
    "Most Frequently Asked": [
      { q: "How can I view petitions from my jurisdiction?", a: "Visit the 'Petitions' tab. You’ll see petitions tagged with your assigned location or department for review and action." },
      { q: "How do I respond to a petition?", a: "Open any petition and click 'Add Response' to share updates, approvals, or comments with the public." },
      { q: "How can I manage user reports?", a: "Go to the 'Reports' section in your dashboard to review and manage citizen reports." },
    ],
    "Other Support": [
      { q: "Can I create new polls or reports?", a: "Yes, officials can create issue-specific polls and generate monthly civic engagement reports from the Dashboard." },
      { q: "Where can I request technical support?", a: "For any technical or access-related issues, please contact Support-civix@civix.com with your Official ID and issue details." },
      { q: "How do I assign petitions to team members?", a: "Click on a petition and use the 'Assign' option to allocate it to an official within your department." },
      { q: "How do I track departmental performance?", a: "Use the 'Analytics' section in the dashboard to monitor performance metrics and citizen engagement." },
    ],
  };

  const faqs = role === "official" ? officialFAQs : citizenFAQs;

  // Filter FAQs
  const filteredFaqs = {};
  Object.keys(faqs).forEach((category) => {
    filteredFaqs[category] = faqs[category].filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Highlight search matches
  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-200">{part}</span> : part
    );
  };

  const categoryIcons = {
    "Most Frequently Asked": <FileText size={20} className="text-blue-600 mr-2" />,
    "Other Support": <Settings size={20} className="text-blue-600 mr-2" />,
  };

  return (
    <div className="min-h-screen bg-blue-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <HelpCircle size={36} className="text-blue-700 mr-3" />
          <h1 className="text-3xl font-bold text-blue-900">
            {role === "official" ? "Official Help & Support" : "Citizen Help & Support"}
          </h1>
        </div>

        <p className="text-gray-700 mb-6">
          Welcome to the Civix Support Center. Browse the most frequently asked questions, find guidance on common issues, or reach out directly at{" "}
          <a
            href="mailto:Support-civix@civix.com"
            className="font-semibold text-blue-700 underline hover:text-blue-900"
          >
            Support-civix@civix.com
          </a>.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full p-3 mb-6 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* FAQs */}
        {Object.keys(filteredFaqs).map((category) => (
          <div key={category} id={category} className="mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              {categoryIcons[category]}
              {category}
            </h2>

            <div className="space-y-3">
              {filteredFaqs[category].length > 0 ? (
                filteredFaqs[category].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border-l-4 border-blue-100 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <button
                      className={`w-full flex justify-between items-center p-4 font-medium text-gray-800 transition-all duration-300 ${
                        expandedIndex === index + category ? "bg-blue-50" : ""
                      }`}
                      onClick={() => toggleQuestion(index + category)}
                    >
                      {highlightText(item.q)}
                      <motion.div
                        animate={{ rotate: expandedIndex === index + category ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedIndex === index + category && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, scale: 0.98, padding: 0 }}
                          animate={{ height: "auto", opacity: 1, scale: 1, padding: "0 1rem 1rem 1rem" }}
                          exit={{ height: 0, opacity: 0, scale: 0.98, padding: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-700"
                        >
                          {highlightText(item.a)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No FAQs found for this search.</p>
              )}
            </div>
          </div>
        ))}

        {/* Contact Button */}
        <div className="text-center mt-6">
          <a
            href="mailto:Support-civix@civix.com"
            className="inline-block px-6 py-3 bg-blue-900 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
