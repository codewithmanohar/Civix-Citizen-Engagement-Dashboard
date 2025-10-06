import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../lib/api';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  MapPin,
  Phone,
  Globe,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  const [userRole, setUserRole] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    petitionUpdates: true,
    communityAnnouncements: true,
    pollReminders: true,
    weeklyDigest: false,
    officialResponses: true,
    systemMaintenance: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showLocation: true,
    showEmail: false,
    allowDataCollection: true,
    marketingEmails: false
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'citizen';
    setUserRole(role);
    
    // Apply dark mode on load
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy({
      ...privacy,
      [key]: value
    });
  };

  const validateCurrentPassword = async (password) => {
    try {
      await api.post('/auth/validate-password', {
        currentPassword: password
      });
      setIsCurrentPasswordValid(true);
      return true;
    } catch (error) {
      setIsCurrentPasswordValid(false);
      return false;
    }
  };

  const handleChangePassword = async () => {
    if (!isCurrentPasswordValid) {
      toast.error('Please enter correct current password');
      return;
    }

    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsCurrentPasswordValid(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await api.put('/auth/user/notifications', notifications);
      toast.success('Notification preferences saved!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save preferences');
    }
  };

  const handleExportData = () => {
    const data = {
      profile: formData,
      notifications,
      privacy,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'civix-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account?\n\nThis action will:\n• Permanently delete all your data\n• Remove all your petitions and signatures\n• Cannot be undone\n\nType "DELETE" to confirm'
    );
    
    if (confirmed) {
      const userConfirmation = prompt('Please type "DELETE" to confirm account deletion:');
      
      if (userConfirmation === 'DELETE') {
        try {
          await api.delete('/auth/delete-account');
          localStorage.clear();
          toast.success('Account deleted successfully');
          window.location.href = '/';
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete account');
        }
      } else {
        toast.info('Account deletion cancelled');
      }
    }
  };

  return (
    <div className="w-full p-6 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account settings and preferences.</p>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
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
      </div>


      {/* Privacy & Data */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Lock className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Data</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="limited">Limited</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Show Location</h3>
              <p className="text-sm text-gray-600">Display your location on your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showLocation}
                onChange={() => handlePrivacyChange('showLocation', !privacy.showLocation)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Allow Data Collection</h3>
              <p className="text-sm text-gray-600">Help improve Civix by sharing anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.allowDataCollection}
                onChange={() => handlePrivacyChange('allowDataCollection', !privacy.allowDataCollection)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </button>
          
          <button
            onClick={handleDeleteAccount}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </button>
        </div>
      </div>



      {/* Role-specific Settings */}
      {userRole === 'official' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Official Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your department"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position/Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your position"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jurisdiction
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your jurisdiction"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;