import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../lib/api";
import { User, Shield, Eye, EyeOff, Trash2, Globe } from "lucide-react";

/* --- Reusable Components --- */
const StatCard = ({ label, value, color }) => (
  <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border-l-4 border-${color}-500 text-center`}>
    <h2 className={`font-semibold text-${color}-700 mb-2`}>{label}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggleShow, valid, disabled, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
          valid === true ? "border-green-300 bg-green-50" : valid === false ? "border-red-300 bg-red-50" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
      />
      {toggleShow && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  </div>
);

/* --- Main Settings Component --- */
const Settings = () => {
  const [userRole, setUserRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [activity, setActivity] = useState({
    petitionsSigned: 0,
    pollsParticipated: 0,
    petitionsCreated: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // Load role and dark mode
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "citizen";
    setUserRole(role);
    if (darkMode) document.documentElement.classList.add("dark");
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Fetch activity summary
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const signedRes = await api.get("/petition/my-signed");
        const petitionsSigned = signedRes.data.petitions.filter(p => p !== null).length;

        const allRes = await api.get("/petition/");
        const currentUserId = localStorage.getItem("userId");
        const petitionsCreated = allRes.data.filter(p => p.createdBy?._id === currentUserId).length;

        const pollsRes = await api.get("/polls/my-polls");
        const pollsParticipated = pollsRes.data.length;

        setActivity({ petitionsSigned, petitionsCreated, pollsParticipated });
      } catch (err) {
        toast.error("Failed to fetch activity data");
      }
    };
    fetchActivity();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateCurrentPassword = async (password) => {
    try {
      await api.post("/auth/validate-password", { currentPassword: password });
      setIsCurrentPasswordValid(true);
    } catch {
      setIsCurrentPasswordValid(false);
    }
  };

  const handleChangePassword = async () => {
    if (!isCurrentPasswordValid) return toast.error("Please enter correct current password");
    if (!formData.newPassword) return toast.error("Please enter a new password");
    if (formData.newPassword !== formData.confirmPassword) return toast.error("New passwords do not match");
    if (formData.newPassword.length < 8) return toast.error("Password must be at least 8 characters long");

    try {
      await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsCurrentPasswordValid(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error("Please enter your password");

    try {
      await api.post("/auth/validate-password", { currentPassword: deletePassword });
      await api.delete("/auth/delete-account");
      localStorage.clear();
      toast.success("Account deleted successfully");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect password or failed to delete account");
    }
  };

  return (
    <div className="w-full py-6 space-y-8 px-6 bg-blue-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and profile information.</p>
      </div>

    
      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={async (e) => {
                  handleInputChange(e);
                  if (e.target.value) {
                    await validateCurrentPassword(e.target.value);
                  } else {
                    setIsCurrentPasswordValid(false);
                  }
                }}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.currentPassword && !isCurrentPasswordValid 
                    ? 'border-red-300 bg-red-50' 
                    : formData.currentPassword && isCurrentPasswordValid 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={!isCurrentPasswordValid}
                className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !isCurrentPasswordValid ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={!isCurrentPasswordValid}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !isCurrentPasswordValid ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        
        {formData.currentPassword && !isCurrentPasswordValid && (
          <div className="mt-2 text-sm text-red-600">
            Current password is incorrect
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={handleChangePassword}
            disabled={!isCurrentPasswordValid}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isCurrentPasswordValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Change Password
          </button>
        </div>

        <div className="mt-8">
        <div className="flex items-center mb-6">
    <Globe className="w-6 h-6 text-blue-600 mr-3" />
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
      Civic Engagement Insights
    </h2>
  </div>
  <div className="space-y-4 text-gray-700 dark:text-gray-300">
    <p>
      🌍 Participate in your community — signing and creating petitions helps amplify important local issues.
    </p>
    <p>
      📢 Share petitions you support with others to increase visibility and impact.
    </p>
    <p>
      🗳️ Stay informed about ongoing public polls and make your voice heard!
    </p>
  </div>
      </div>
      </div>
  



      {/* Delete Account */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center space-y-4">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete Account
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Enter your current password to permanently delete your account.
            </p>
            <input
              type="password"
              placeholder="Current Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleDeleteAccount}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Settings */}
      {userRole === "official" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Official Settings</h2>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Department" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Position / Title" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Jurisdiction" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
