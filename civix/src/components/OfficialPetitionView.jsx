import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetitionById } from "../lib/petitionService";
import api from "../lib/api";
import { fetchUsers } from "../lib/reportService"; // ✅ import new service
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
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [signatureCount, setSignatureCount] = useState(0);
  const [signatures, setSignatures] = useState([]);

  // Fetch petition + comments
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
      } finally {
        setLoading(false);
      }
    };
    fetchPetition();
  }, [id]);

  if (loading) return <div className="p-8">Loading petition details...</div>;
  if (!petition) return <p className="text-center mt-10">Petition not found!</p>;

  const target = petition.signatureGoal || 100;
  const progress = (signatureCount / target) * 100;

  // Add new comment (backend)
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/${id}`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  // Add local reply only
  const handleAddReply = (commentId) => {
    const replyText = replyInputs[commentId]?.trim();
    if (!replyText) return;

    const newReply = {
      id: Date.now(),
      user: currentUser.name,
      text: replyText,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = comments.map((c) =>
      (c._id || c.id) === commentId
        ? { ...c, replies: [...(c.replies || []), newReply] }
        : c
    );

    setComments(updatedComments);
    setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
    setShowReplies((prev) => ({ ...prev, [commentId]: true })); // show input after adding
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      {/* Petition Info */}
      <h1 className="text-3xl font-bold mb-2">{petition.title}</h1>
      <p className="text-gray-600 mb-2">Category: {petition.category}</p>
      <p className="text-gray-600 mb-2">Location: {petition.location || "Not specified"}</p>
      <p className="text-gray-600 mb-4">Created by: {petition.createdBy?.name || "Unknown"}</p>
      <p className="mb-4">{petition.description}</p>
      <p className="text-sm text-gray-500 mb-1">Status: {petition.status}</p>
      <p className="text-sm text-gray-500 mb-4">Signatures: {signatureCount} / {target}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Back Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Back
        </button>
      </div>

      {/* Signed By */}
      {signatures.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Signed By:</h2>
          <ul className="list-disc list-inside">
            {signatures.map((sig, index) => (
              <li key={index}>
                {sig.user?.name || sig.user} (on {new Date(sig.signedAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comments */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Comments</h2>
        <div className="space-y-4 mb-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id || comment.id} className="p-3 border rounded bg-gray-50 relative">
                <p className="text-sm font-medium">{comment.user?.name || "Anonymous"}</p>
                <p className="text-sm mb-2">{comment.text}</p>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt || Date.now()).toLocaleString()}</span>

                {/* Reply button */}
                  <button
                  onClick={() => toggleReplies(comment._id || comment.id)}
                  className="absolute top-3 right-3 text-blue-700 text-sm font-xl hover:underline"
                >
                  Reply
                </button>

                {/* Replies */}
                {showReplies[comment._id || comment.id] && (
                  <div className="ml-4 mt-2 space-y-2">
                    {comment.replies?.length > 0 &&
                      comment.replies.map((r) => (
                        <div key={r.id} className="p-2 border rounded bg-gray-100">
                          <p className="text-sm font-medium">{r.user}</p>
                          <p className="text-sm">{r.text}</p>
                          <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                      ))}

                    {/* Reply Input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={replyInputs[comment._id || comment.id] || ""}
                        onChange={(e) => handleReplyChange(comment._id || comment.id, e.target.value)}
                        placeholder="Reply to comment..."
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddReply(comment._id || comment.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
          )}
        </div>

        {/* Add Comment Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficialPetitionView;

