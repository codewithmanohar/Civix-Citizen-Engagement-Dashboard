import React, { useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

// PDF Viewer
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ReportsPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Sample Data
  const petitionCategories = [
    { name: "Environment", value: 40 },
    { name: "Education", value: 25 },
    { name: "Transport", value: 20 },
    { name: "Healthcare", value: 15 },
  ];

  const pollStatus = [
    { name: "Active", value: 10 },
    { name: "Closed", value: 15 },
  ];

  const trendsData = [
    { month: "Jan", petitions: 20, polls: 50 },
    { month: "Feb", petitions: 35, polls: 70 },
    { month: "Mar", petitions: 28, polls: 60 },
    { month: "Apr", petitions: 45, polls: 90 },
    { month: "May", petitions: 38, polls: 75 },
    { month: "Jun", petitions: 42, polls: 85 },
    { month: "Jul", petitions: 30, polls: 60 },
    { month: "Aug", petitions: 50, polls: 95 },
    { month: "Sep", petitions: 40, polls: 70 },
    { month: "Oct", petitions: 55, polls: 100 },
    { month: "Nov", petitions: 48, polls: 80 },
    { month: "Dec", petitions: 60, polls: 110 },
  ];

  const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

  // --- Export Functions ---
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Civix - Official Reports", 14, 20);

    doc.setFontSize(12);
    doc.text("Petition Categories", 14, 35);
    autoTable(doc, {
      startY: 40,
      head: [["Category", "Count"]],
      body: petitionCategories.map((p) => [p.name, p.value]),
    });

    doc.text("Poll Status", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Status", "Count"]],
      body: pollStatus.map((p) => [p.name, p.value]),
    });

    doc.text("Trends", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Month", "Petitions", "Polls"]],
      body: trendsData.map((t) => [t.month, t.petitions, t.polls]),
    });

    return doc;
  };

  const handlePreviewPDF = () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
    setShowPdfModal(true); // open modal
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save("official_reports.pdf");
  };

  const handleDownloadCSV = () => {
    const allData = {
      petitions: petitionCategories,
      polls: pollStatus,
      trends: trendsData,
    };

    const csv = Papa.unparse(allData.trends);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "official_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        📊 Reports & Analytics
      </h1>

      {/* Petition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Petitions" value="50" />
        <StatCard label="Pending" value="45" />
        <StatCard label="Approved/Review" value="12" />
        <StatCard label="Resolved" value="15" />
      </div>

      {/* Category Breakdown & Polls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Category-wise Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={petitionCategories}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Polls Insights */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Polls Insights
          </h2>
          <ul className="space-y-2 mb-6">
            <li>
              📌 Total Polls: <b>25</b>
            </li>
            <li>
              🗳 Voter Turnout: <b>65%</b>
            </li>
          </ul>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pollStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pollStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Citizen Engagement */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">
          Citizen Engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EngagementCard label="Active Users" value="1,230" />
          <EngagementCard label="Avg. Signatures" value="87" />
          <EngagementCard label="Top Dept." value="Transport" />
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">
          Trends & Timeline
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="petitions"
              stroke="#2563eb"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="polls"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Export Options */}
      <div className="flex space-x-4 mt-8">
        <button
          onClick={handlePreviewPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Preview PDF
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          Download CSV
        </button>
      </div>
     {/* PDF Modal */}
{showPdfModal && pdfUrl && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[80vh] rounded-lg shadow-lg relative">
      
      {/* X Close Button */}
      <div className="flex justify-end p-2 border-b">
    <button
      className="text-black text-2xl font-bold hover:text-red-600"
      onClick={() => setShowPdfModal(false)}
    >
      ×
    </button>
  </div>


      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  </div>
)}

      
    </div>
  );
}

/* --- Small Components --- */
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-blue-500">
      <h2 className="text-blue-700 font-semibold">{label}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function EngagementCard({ label, value }) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg text-center">
      <p className="text-sm text-blue-700">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
