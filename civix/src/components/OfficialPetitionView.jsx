import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetitionById } from "../lib/petitionService";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficialPetitionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = {
    _id: localStorage.getItem("userId"),
    name: localStorage.getItem("name") || "Official",
    role: localStorage.getItem("userRole") || "official",
    location: localStorage.getItem("location") || "Unknown",
  };

  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [signatureCount, setSignatureCount] = useState(0);
  const [signatures, setSignatures] = useState([]);

  // ---------------- FETCH PETITION + COMMENTS ----------------
  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const data = await getPetitionById(id);
        setPetition(data);

        const res = await api.get(`/comments/${id}`);
        setComments(res.data || []);

        const sigRes = await api.get(`/petition/signature/${id}`);
        setSignatureCount(sigRes.data.total || 0);
        setSignatures(sigRes.data.signatures || []);
      } catch (err) {
        console.error("Failed to fetch petition", err);
        toast.error("Failed to load petition details");
      } finally {
        setLoading(false);
      }
    };
    fetchPetition();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading petition details...</div>;
  if (!petition) return <p className="text-center mt-10">Petition not found!</p>;

  const target = petition.signatureGoal || 100;
  const progress = (signatureCount / target) * 100;

  // ---------------- ADD COMMENT ----------------
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.warn("Please write a comment before posting.");
      return;
    }
    try {
      const res = await api.post(`/comments/${id}`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      console.error("Error posting comment", err);
      toast.error("Failed to post comment.");
    }
  };

  // ---------------- EDIT COMMENT ----------------
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.warn("Comment cannot be empty.");
      return;
    }
    try {
      const res = await api.put(`/comments/${commentId}`, { text: editText });
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
      setEditingComment(null);
      setEditText("");
      toast.info("Comment updated successfully!");
    } catch (err) {
      console.error("Error editing comment:", err);
      toast.error("Failed to edit comment.");
    }
  };

  // ---------------- DELETE COMMENT ----------------
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 relative">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      {/* Petition Info */}
      <h1 className="text-3xl font-bold mb-3 text-gray-800">{petition.title}</h1>
      <p className="text-gray-600 mb-1"><strong>Category:</strong> {petition.category}</p>
      <p className="text-gray-600 mb-1"><strong>Location:</strong> {petition.location || "Not specified"}</p>
      <p className="text-gray-600 mb-3"><strong>Created by:</strong> {petition.createdBy?.name || "Unknown"}</p>
      <p className="mb-4 text-gray-700 leading-relaxed">{petition.description}</p>
      <p className="text-sm text-gray-500 mb-1">Status: <span className="font-medium text-gray-700">{petition.status}</span></p>
      <p className="text-sm text-gray-500 mb-4">
        Signatures: <span className="font-medium text-gray-700">{signatureCount}</span> / {target}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Back Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* Signed By */}
      {signatures.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3 text-lg text-gray-800">Signed By:</h2>
          <ul className="list-disc list-inside text-gray-700">
            {signatures.map((sig, i) => (
              <li key={i}>
                {sig.user?.name || sig.user} (on {new Date(sig.signedAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- COMMENTS SECTION ---------------- */}
      <div className="mb-6">
        <h2 className="font-semibold mb-4 text-xl text-gray-800">Comments</h2>

        {/* Add Comment Input */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleAddComment}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
              >
                {editingComment === comment._id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border rounded-lg p-2 mb-2 resize-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-800">
                        {comment.user?.name || "Anonymous"}
                      </p>
                      {comment.user?._id === currentUser._id && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditText(comment.text);
                            }}
                            className="text-blue-600 text-xs font-medium hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-600 text-xs font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficialPetitionView;
