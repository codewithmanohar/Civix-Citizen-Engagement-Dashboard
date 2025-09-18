import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";

export default function PetitionDetails() {
  const { id } = useParams(); // <-- get petitionId from route
  const [petition, setPetition] = useState(null);

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const res = await api.get(`/petition/${id}`);
        setPetition(res.data);
      } catch (err) {
        toast.error("Failed to fetch petition details.");
        console.error(err);
      }
    };

    fetchPetition();
  }, [id]);

  if (!petition) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{petition.title}</h2>
      <p className="mt-2 text-gray-700">{petition.description}</p>
      <p className="mt-2 text-sm text-gray-500">Category: {petition.category}</p>
      <p className="mt-2 text-sm text-gray-500">Created by: {petition.user?.name}</p>
      <p className="mt-2 text-sm text-gray-500">Created at: {new Date(petition.createdAt).toLocaleString()}</p>
    </div>
  );
}
