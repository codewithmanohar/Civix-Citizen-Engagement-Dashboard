import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const resolvedPetitions = [
  {
    id: 1,
    title: "Improve Public Transportation in Downtown",
    category: "Infrastructure",
    createdBy: "Sarah Chen",
    signatures: "15,230",
    resolutionDate: "2023-11-15",
    outcome:
      "New bus routes and increased frequency implemented, leading to higher ridership.",
    status: "Resolved",
  },
  {
    id: 2,
    title: "Fund Local Arts Programs",
    category: "Culture",
    createdBy: "David Kim",
    signatures: "8,765",
    resolutionDate: "2023-07-20",
    outcome:
      "City council approved a new grant program for community art initiatives.",
    status: "Resolved",
  },
];

const milestones = [
  { title: "New Public Parks Initiative Approved", date: "2024-04-01" },
  { title: "Transparency in Government Spending Portal Launched", date: "2024-03-28" },
  { title: "Local Business Support Fund Distributed", date: "2024-03-15" },
  { title: "Youth STEM Education Grants Announced", date: "2024-02-28" },
];

// Bar for monthly trends
const monthlyResolvedData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Resolved",
      data: [12, 18, 9, 24, 30, 22],
      backgroundColor: "#3B82F6",
    },
  ],
};

// Doughnut for outcomes
const outcomeData = {
  labels: ["Approved", "Under Review", "Requires Further Action", "Denied"],
  datasets: [
    {
      data: [70, 15, 10, 5],
      backgroundColor: ["#3B82F6", "#10B981", "#FBBF24", "#9CA3AF"],
    },
  ],
};

export default function OfficialResolvedPetitions() {
  return (
    <div className="w-full min-h-screen bg-blue-50 p-6 space-y-10 overflow-auto">
      {/* Petition Resolution Log */}
      <section>
        <h1 className="text-3xl font-bold text-blue-700">Petition Resolution Log</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Signatures</th>
                <th className="p-3">Resolution Date</th>
                <th className="p-3">Outcome</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {resolvedPetitions.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 whitespace-nowrap">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 whitespace-nowrap">{p.createdBy}</td>
                  <td className="p-3">{p.signatures}</td>
                  <td className="p-3">{p.resolutionDate}</td>
                  <td className="p-3">{p.outcome}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Milestones + Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 tracking-tight">
            Recent Milestones
          </h2>
          <ul className="space-y-4">
            {milestones.map((m, i) => (
              <li key={i} className="flex items-start space-x-3">
                <span className="h-2 w-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.title}</p>
                  <p className="text-xs text-gray-500">{m.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 tracking-tight">
            Resolution Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bar – monthly trend */}
            <div className="bg-gray-50 rounded-xl p-3 h-56">
              <h3 className="text-xs font-semibold text-gray-700 mb-1">
                Resolved per Month
              </h3>
              <Bar
                data={monthlyResolvedData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>

            {/* Doughnut – outcomes */}
            <div className="bg-gray-50 rounded-xl p-3 h-56">
              <h3 className="text-xs font-semibold text-gray-700 mb-1">
                Resolution Outcomes
              </h3>
              <Doughnut
                data={outcomeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom", // moves legend below chart
                      labels: { font: { size: 12 }, padding: 12 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
