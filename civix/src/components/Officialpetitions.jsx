import React, { useState, useEffect } from "react";
import OfficialPendingPetitions from "./OfficialActivePetitions";
import OfficialApprovedPetitions from "./OfficialUnderReviewPetitions";
import api from "../lib/api";

export default function OfficialPetitionsDashboard() {
  const [approvedPetitions, setApprovedPetitions] = useState([]);

  // Load approved petitions on page load
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await api.get("/petition");
        if (res.data) {
          const approved = res.data.filter((p) => p.status === "Active");
          setApprovedPetitions(approved);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchApproved();
  }, []);

  const handleApprove = (petition) => {
    setApprovedPetitions((prev) => [...prev, petition]);
  };

  return (
    <div className="space-y-10">
      <OfficialPendingPetitions onApprove={handleApprove} />
      <OfficialApprovedPetitions approvedPetitions={approvedPetitions} />
    </div>
  );
}
