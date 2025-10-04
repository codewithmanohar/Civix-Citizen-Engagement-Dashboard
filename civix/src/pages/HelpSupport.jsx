// import React from 'react'
// import UnderProcess from '../components/UnderProcess'

// const HelpSupport = () => {
//   return (
//     <>
//         <UnderProcess />
//     </>
//   )
// }

// export default HelpSupport



// src/pages/HelpSupport.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, FileText, Users, Settings } from "lucide-react";

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

  // Categorized FAQs: Most Frequently Asked + Other Support
  const citizenFAQs = {
    "Most Frequently Asked": [
      {
        q: "How can I create or sign a petition?",
        a: "Go to the 'Petitions' tab in your dashboard. You can browse active petitions, sign them, or click 'Create Petition' to submit a new one.",
      },
      {
        q: "How do I vote in polls?",
        a: "Select 'Polls' from the sidebar to view active polls. Click on any poll and choose your response to cast your vote.",
      },
    ],
    "Other Support": [
      {
        q: "Can I track the progress of my petitions?",
        a: "Yes, each petition has a live status — Active, Under Review, or Closed. You can also see the number of supporters and official updates.",
      },
      {
        q: "How do I contact support?",
        a: "You can reach out to our support team for help with account or verification issues.",
      },
    ],
  };

  const officialFAQs = {
    "Most Frequently Asked": [
      {
        q: "How can I view petitions from my jurisdiction?",
        a: "Visit the 'Petitions' tab. You’ll see petitions tagged with your assigned location or department for review and action.",
      },
      {
        q: "How do I respond to a petition?",
        a: "Open any petition and click 'Add Response' to share updates, approvals, or comments with the public.",
      },
    ],
    "Other Support": [
      {
        q: "Can I create new polls or reports?",
        a: "Yes, officials can create issue-specific polls and generate monthly civic engagement reports from the Dashboard.",
      },
      {
        q: "Where can I request technical support?",
        a: "For any technical or access-related issues, please contact Support-civix@civix.com with your Official ID and issue details.",
      },
    ],
  };

  const faqs = role === "official" ? officialFAQs : citizenFAQs;

  // Filter FAQs based on search query
  const filteredFaqs = {};
  Object.keys(faqs).forEach((category) => {
    filteredFaqs[category] = faqs[category].filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Category icons
  const categoryIcons = {
    "Most Frequently Asked": <FileText size={20} className="text-blue-600 mr-2" />,
    "Other Support": <Settings size={20} className="text-blue-600 mr-2" />,
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <HelpCircle size={36} className="text-blue-700 mr-3" />
          <h1 className="text-3xl font-bold text-blue-900">
            {role === "official" ? "Official Help & Support" : "Citizen Help & Support"}
          </h1>
        </div>
        <p className="text-gray-700 mb-6">
          Welcome to the Civix Support Center. Browse through the most frequently asked questions, find detailed guidance on common issues, or reach out to our support team directly at{" "}
          <a
            href="mailto:Support-civix@civix.com"
            className="font-semibold text-blue-700 underline hover:text-blue-900"
          >
            Support-civix@civix.com
          </a>.
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full p-3 mb-6 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* FAQs by Category */}
        {Object.keys(filteredFaqs).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              {categoryIcons[category]}
              {category}
            </h2>
            <div className="space-y-3">
              {filteredFaqs[category].length > 0 ? (
                filteredFaqs[category].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border-l-4 shadow-sm border-blue-100 hover:shadow-md transition-all duration-200"
                  >
                    <button
                      className={`w-full flex justify-between items-center p-4 font-medium text-gray-800 transition-all duration-300 ${
                        expandedIndex === index + category ? "bg-blue-50" : "hover:bg-blue-50"
                      }`}
                      onClick={() => toggleQuestion(index + category)}
                    >
                      {item.q}
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
                          initial={{ height: 0, opacity: 0, padding: 0 }}
                          animate={{ height: "auto", opacity: 1, padding: "0 1rem 1rem 1rem" }}
                          exit={{ height: 0, opacity: 0, padding: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-700"
                        >
                          {item.a}
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
