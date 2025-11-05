import React, { useEffect, useState } from "react";
import profile from "../assets/profile.png"
import api from "../lib/api";
import { FiUser, FiMail, FiMapPin, FiCalendar, FiShield, FiEdit2, FiX, FiSave } from "react-icons/fi";
import Loading from "../components/Loaders/Loading";

export default function Profile() {
  // Sample user data (replace with API fetch later)
  const [user, setUser] = useState({});

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location,
    email: user.email,
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


const handleSave = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      name: formData.name || user.name,
      email: formData.email || user.email,
      location: formData.location || user.location,
    };

    const res = await api.put("/auth/user", payload);

    if (res.data) {
      setUser(res.data);
      alert("Profile updated successfully!");
    }
    setEditing(false);
  } catch (err) {
    alert(err.response?.data?.message || "Error updating profile");
  }
};



  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/user");
        setUser(res.data);
      } catch (error) {
        console.log("Error in fectching Profile ", err.message);
      }finally{
        setLoading(false);
      }
      
    };
    getUserProfile();
  }, [editing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center py-6 ">
      <div className="bg-white shadow-2xl rounded-3xl px-6 py-10 w-full max-w-3xl">
          {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              formData.profileImage
                ? URL.createObjectURL(formData.profileImage)
                : profile
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover shadow-md"
          />
        </div>
      {
        loading 
          ? <Loading /> 
          : <>
         {/* User Details */}
        {!editing ? (
          <div className="space-y-5 text-gray-700 text-lg">
            <p className="flex items-center gap-3">
              <FiUser className="text-blue-600" /> <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="flex items-center gap-3">
              <FiMail className="text-blue-600" /> <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="flex items-center gap-3">
              <FiShield className="text-blue-600" /> <span className="font-semibold">Role:</span> {user.role}
            </p>
            <p className="flex items-center gap-3">
              <FiMapPin className="text-blue-600" /> <span className="font-semibold">Location:</span> {user.location}
            </p>
            <p className="flex items-center gap-3">
              <FiCalendar className="text-blue-600" /> <span className="font-semibold">Joined On:</span>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                <FiMail className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                <FiMapPin className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium text-lg shadow-md hover:bg-blue-700"
            >
              <FiSave /> Save Changes
            </button>
          </form>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {!editing ? (
            <button
              onClick={() => {
                setFormData({
                  name: user.name || "",
                  location: user.location || "",
                  email: user.email || "",
                  profileImage: null,
                });
                setEditing(true);
              }}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600 text-lg"
            >
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-xl shadow hover:bg-gray-500 text-lg"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
          </>
      }
      </div>
      
    </div>
  );
}
