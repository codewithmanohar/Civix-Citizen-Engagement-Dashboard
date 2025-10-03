import React, { useEffect, useState } from "react";
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
import api from "../lib/api";

// PDF Viewer
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ReportsPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [stats, setStats] = useState({
    total: 0,
    under_review: 0,
    active: 0,
    rejected: 0,
    resolved: 0,
  });

  const [petitionCategories, setPetitionCategories] = useState([]);
  const [pollStatus, setPollStatus] = useState([]);
  const [pollTotal, setPollTotal] = useState(0);
 
  const [trendsData, setTrendsData] = useState([
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
  ]);

  const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#f97316", "#ef4444"];

  // --- Fetch Stats, Categories & Polls ---
  const getStats = async () => {
    try {
      const statsRes = await api.get("/dashboard/petition-stats");
      setStats(statsRes.data.stats);

      const categoriesRes = await api.get("/reports/petitions/categories");
      if (categoriesRes.data.success) {
        setPetitionCategories(categoriesRes.data.categories);
      }
       // 3. Poll insights using /polls + /polls/closed
    const activeRes = await api.get("/polls");
    const closedRes = await api.get("/polls/closed");

    // Check if your API returns { polls: [...] } or just [...]
    const activePolls = activeRes.data.polls || activeRes.data || [];
    const closedPolls = closedRes.data.polls || closedRes.data || [];

    const activeCount = activePolls.length;
    const closedCount = closedPolls.length;
    const total = activeCount + closedCount;



setPollStatus([
      { name: "Active", value: activeCount },
      { name: "Closed", value: closedCount },
    ]);
    setPollTotal(total);
   

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const [voterTurnout, setVoterTurnout] = useState(0);

const getVoterTurnout = async () => {
  try {
    const res = await api.get("/reports/polls/insights");
    if (res.data?.success && res.data.polls?.voter_turnout) {
      const turnout = Number(res.data.polls.voter_turnout) || 0;
      setVoterTurnout(turnout.toFixed(2)); // optional: format to 2 decimals
    }
  } catch (err) {
    console.error("Error fetching voter turnout:", err);
  }
};





  useEffect(() => {
    getStats();
    getVoterTurnout(); 
  }, []);

  // --- Export Functions ---
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Civix - Official Reports", 14, 20);

    doc.setFontSize(12);
    doc.text("Petition Stats", 14, 35);
    autoTable(doc, {
      startY: 40,
      head: [["Type", "Count"]],
      body: [
        ["Total", stats.total],
        ["Under Review", stats.under_review],
        ["Active", stats.active],
        ["Rejected", stats.rejected],
        ["Resolved", stats.resolved],
      ],
    });

    doc.text("Petition Categories", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
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
    setShowPdfModal(true);
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save("official_reports.pdf");
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse({
      petitions: petitionCategories,
      polls: pollStatus,
      trends: trendsData,
    });

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
        Reports & Analytics
      </h1>

      {/* Petition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Petitions" value={stats.total} />
        <StatCard label="Under Review" value={stats.under_review} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Rejected" value={stats.rejected} />
        <StatCard label="Resolved" value={stats.resolved} />
      </div>

      {/* Category Breakdown & Polls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Category-wise Breakdown
          </h2>
<ResponsiveContainer width="100%" height={400}>
  <BarChart
    data={petitionCategories}
    margin={{ top: 0, right: 10, left: 0, bottom: 7 }}
    //barCategoryGap={20} // space between bars
  >
    <XAxis
      dataKey="name"
      interval={0}
      tick={{ fontSize: 14 }}
      angle={-35} // rotate labels
      textAnchor="end"
      height={60} // make room for rotated labels
      padding={{ left: 10, right: 0 }}
    />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>



        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Polls Insights
          </h2>
          <ul className="space-y-2 mb-6">
            <li>📌 Total Polls: <b>{pollTotal}</b></li>
            <li>🗳 Voter Turnout: <b>{voterTurnout}%</b></li>
          </ul>
          <ResponsiveContainer width="100%" height={250}>
  <PieChart>
    <Pie
      data={pollStatus}
      cx="50%"
      cy="50%"
      outerRadius={80}
      dataKey="value"
      label={({ name, value }) => `${name}: ${value}`}
    >
      {pollStatus.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.name === "Active" ? "#2563eb" : "#22c55e"} // Blue for active, Red for closed
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

      {/* Export Buttons */}
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
