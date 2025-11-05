import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { User, Shield, Eye, EyeOff, Trash2, Globe } from "lucide-react";
import api from "../lib/api";
const OfficialSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [officialInfo, setOfficialInfo] = useState({
    department: "",
    position: "",
    jurisdiction: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate current password on change
  const validateCurrentPassword = async (password) => {
    try {
      // Replace with actual API call if needed
      await api.post("/auth/validate-password", { currentPassword: password });
      setIsCurrentPasswordValid(true);
    } catch {
      setIsCurrentPasswordValid(false);
    }
  };

  const handleOfficialInputChange = (field, value) => {
    setOfficialInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
  if (!isCurrentPasswordValid) return toast.error("Enter correct current password");
  if (!formData.newPassword) return toast.error("Enter new password");
  if (formData.newPassword !== formData.confirmPassword) return toast.error("Passwords do not match");
  if (formData.newPassword.length < 8) return toast.error("Password must be at least 8 characters long");

  try {
    // Call your backend API to update password
    await api.put("/auth/change-password", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    toast.success("Password updated successfully!");
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsCurrentPasswordValid(false);

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to change password");
  }
};


  const handleDeleteAccount = async () => {
  if (!deletePassword) return toast.error("Please enter your password");

  try {
    // Step 1: Validate current password
    await api.post("/auth/validate-password", { currentPassword: deletePassword });

    // Step 2: Delete account
    await api.delete("/auth/delete-account");
// 3. Show success toast
    toast.success("Account deleted successfully!");

    // 4. Delay redirect so user can see toast
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/"; // or your home/login page
    }, 1700); 
    
  } catch (err) {
    toast.error(err.response?.data?.message || "Incorrect password or failed to delete account");
  }
};


  return (
    <div className="w-full py-6 space-y-8 px-6 bg-blue-50 dark:bg-gray-900 min-h-screen">

      {/* Official Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
  <div className="flex flex-col mb-4">
    <div className="flex items-center mb-2">
      <Shield className="w-6 h-6 text-blue-600 mr-3" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Official Settings</h1>
    </div>
    <p className="text-gray-600 dark:text-gray-300">
      Manage your account, security preferences, and official tools.
    </p>
  </div>
</div>

{/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={async (e) => {
                handleInputChange(e);
                if (e.target.value) await validateCurrentPassword(e.target.value);
                else setIsCurrentPasswordValid(false);
              }}
              placeholder="Current Password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                formData.currentPassword && !isCurrentPasswordValid
                  ? "border-red-300 bg-red-50"
                  : formData.currentPassword && isCurrentPasswordValid
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleInputChange}
    disabled={!isCurrentPasswordValid}
    className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      !isCurrentPasswordValid ? 'bg-gray-100 cursor-not-allowed' : ''
    }`}
    placeholder="Confirm new password"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
  >
    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
</div>

        </div>
        <button onClick={handleChangePassword} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Update Password
        </button>
      </div>

      {/* Official Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex items-center mb-4">
          <Globe className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Official Insights</h2>
        </div>
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          <p>🌍 Track petitions and community engagement.</p>
          <p>📊 Monitor activity and decision-making impact.</p>
          <p>🗳️ Stay informed on public participation and polls.</p>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center space-y-4">
        <button onClick={() => setShowDeleteModal(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Trash2 className="w-4 h-4 mr-2" /> Delete Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete Account</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Enter your password to permanently delete your account.</p>
            <input
              type="password"
              placeholder="Password"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-between">
              <button onClick={handleDeleteAccount} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Trash2 className="w-4 h-4 mr-2" /> Confirm Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OfficialSettings;
