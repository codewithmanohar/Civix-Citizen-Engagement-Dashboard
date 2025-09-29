// CitizenReports.jsx
import React from "react";
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

const COLORS = ["#1D4ED8", "#10b981", "#3b82f6", "#93C5FD"];

const CitizenReports = ({ petitions, polls }) => {
  // Default sample data if no props passed
  const samplePetitions = [
    { id: 1, status: "Active" },
    { id: 2, status: "Closed" },
    { id: 3, status: "Under Review" },
    { id: 4, status: "Active" },
  ];

  const samplePolls = [
    { id: 1, status: "Active" },
    { id: 2, status: "Closed" },
    { id: 3, status: "Active" },
  ];

  // Use passed props or sample data
  const petitionsData = petitions && petitions.length > 0 ? petitions : samplePetitions;
  const pollsData = polls && polls.length > 0 ? polls : samplePolls;

  // Stats
  const totalPetitions = petitionsData.length;
  const totalPolls = pollsData.length;
  const activeEngagement = petitionsData.filter(p => p.status === "Active").length;

  // Pie Chart Data
  const petitionStatus = [
    { name: "Active", value: petitionsData.filter(p => p.status === "Active").length || 1 },
    { name: "Under Review", value: petitionsData.filter(p => p.status === "Under Review").length || 1 },
    { name: "Closed", value: petitionsData.filter(p => p.status === "Closed").length || 1 },
  ];

  const pollStatusData = [
    { name: "Active", value: pollsData.filter(p => p.status === "Active").length || 1 },
    { name: "Closed", value: pollsData.filter(p => p.status === "Closed").length || 1 },
  ];

  // --- Export functions ---
  const handleDownloadPDF = () => {
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
        <StatCard label="Active Engagement" value={activeEngagement} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Petition Status Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Petition Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={petitionStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {petitionStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Poll Status Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Poll Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pollStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pollStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4 mt-8">
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
    </div>
  );
};

/* --- Small Components --- */
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-blue-500 text-center">
      <h2 className="text-blue-700 font-semibold">{label}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default CitizenReports;
