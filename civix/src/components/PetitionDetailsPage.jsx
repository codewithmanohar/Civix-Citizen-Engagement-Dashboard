import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function PetitionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [petition, setPetition] = useState(null);

  useEffect(() => {
    const savedPetitions = localStorage.getItem('petitions');
    const petitions = savedPetitions ? JSON.parse(savedPetitions) : [];
    const foundPetition = petitions.find(p => p.id === parseInt(id));
    
    if (foundPetition) {
      setPetition(foundPetition);
    }
  }, [id]);

  if (!petition) return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="w-64 bg-white border-r"><Sidebar /></div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/dashboard/citizen/petitions')}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            ← Back to Petitions
          </button>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-white mb-2">{petition.title}</h1>
              <div className="flex items-center gap-4 text-blue-100">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{petition.category}</span>
                <span className="text-sm">📍 {petition.location}</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{petition.signatures}</div>
                  <div className="text-sm text-green-600">Signatures</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{petition.target}</div>
                  <div className="text-sm text-blue-600">Goal</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-700">{petition.status}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{petition.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Petition Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Created:</span> {petition.createdAt}</div>
                    <div><span className="font-medium">Author:</span> {petition.createdBy || 'Unknown'}</div>
                  </div>
                </div>
              </div>
              
              {petition.updates && petition.updates.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Updates</h3>
                  <div className="space-y-2">
                    {petition.updates.map((update, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        {update}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => navigate(`/dashboard/citizen/sign/${petition.id}`)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Sign This Petition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default PetitionDetailsPage;
