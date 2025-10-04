import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { fetchPetitions, fetchPolls, fetchUsers } from "../lib/reportService"; // ✅ import new service

const COLORS = ["#1D4ED8", "#10b981", "#3b82f6", "#93C5FD"];

const CitizenReports = () => {
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();


  // ✅ Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [petitionData, pollData, userData] = await Promise.all([
          fetchPetitions(),
          fetchPolls(),
          fetchUsers(),
        ]);
        setPetitions(petitionData);
        setPolls(pollData);
        setUsers(userData);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-blue-800 text-lg">Loading reports...</div>;
  }

  // ✅ Stats
  const totalPetitions = petitions.length;
  const totalPolls = polls.length;
  // ✅ Count active petitions
const activePetitions = petitions.filter(p => p.status === "Active").length;

// ✅ Count active polls
const activePolls = polls.filter(p => p.status === "Active").length;

// ✅ Total active engagement (users + active items, or only active petitions + polls?)
const activeEngagement = activePetitions + activePolls;

 

  // ✅ Chart Data
  const petitionStatus = [
    { name: "Active", value: petitions.filter(p => p.status === "Active").length || 0 },
    { name: "Under Review", value: petitions.filter(p => p.status === "Under Review").length || 0 },
    { name: "Resolved", value: petitions.filter(p => p.status === "Resolved").length || 0 },
    { name: "Rejected", value: petitions.filter(p => p.status === "Rejected").length || 0 },
  ];

  const pollStatusData = [
    { name: "Active", value: polls.filter(p => p.status === "Active").length || 0 },
    { name: "Closed", value: polls.filter(p => p.status === "Closed").length || 0 },
  ];

  // --- Generate PDF ---
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Civix - Citizen Reports", 14, 20);

    doc.setFontSize(12);
    doc.text("Petition Status", 14, 35);
    autoTable(doc, {
      startY: 40,
      head: [["Status", "Count"]],
      body: petitionStatus.map(p => [p.name, p.value]),
    });

    doc.text("Poll Status", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Status", "Count"]],
      body: pollStatusData.map(p => [p.name, p.value]),
    });

    return doc;
  };

  const handlePreviewPDF = () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save("citizen_reports.pdf");
  };

  const handleDownloadCSV = () => {
    const csvData = [
      ...petitionStatus.map(p => ({ Type: "Petition", Status: p.name, Count: p.value })),
      ...pollStatusData.map(p => ({ Type: "Poll", Status: p.name, Count: p.value })),
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "citizen_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">📊 Citizen Reports & Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Petitions" value={totalPetitions} />
        <StatCard label="Total Polls" value={totalPolls} />
        <StatCard label="Active Engagement (Active Petitions + Polls)" value={activeEngagement} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Petition Status Breakdown" data={petitionStatus}>
  <Legend
    payload={[
      { id: 'Active', value: 'Active', type: 'square', color: COLORS[0] },
      { id: 'Under Review', value: 'Under Review', type: 'square', color: COLORS[1] },
      { id: 'Resolved', value: 'Resolved', type: 'square', color: COLORS[2] },
      { id: 'Rejected', value: 'Rejected', type: 'square', color: COLORS[3] },
    ]}
  />
</ChartCard>

        <ChartCard title="Poll Status Breakdown" data={pollStatusData} />
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4 mt-8">
        <button onClick={handlePreviewPDF} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Preview PDF
        </button>
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Download PDF
        </button>
        <button onClick={handleDownloadCSV} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100">
          Download CSV
        </button>
      </div>

      {/* PDF Modal */}
      {showPdfModal && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[80vh] rounded-lg shadow-lg relative">
            <div className="flex justify-end p-2 border-b">
              <button
                className="text-black text-2xl font-bold hover:text-red-600"
                onClick={() => setShowPdfModal(false)}
              >
                ×
              </button>
            </div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Reusable Components --- */
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-blue-500 text-center">
      <h2 className="text-blue-700 font-semibold">{label}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, data }) {
   const legendPayload = data.map((entry, index) => ({
    id: entry.name,
    value: entry.name,
    type: "square",
    color: COLORS[index % COLORS.length],
  }));
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label sort={false}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {legendPayload ? <Legend payload={legendPayload} /> : <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CitizenReports;
