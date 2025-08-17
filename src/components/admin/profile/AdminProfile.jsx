import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit3,
  Save,
  X,
  Key,
  Camera,
  Settings,
  Crown,
  Star,
  Building
} from "lucide-react";
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', {
        username: formData.username
      });

      setUser(response.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.put('/auth/profile/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      toast.success('Password changed successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const imageData = new FormData();
      imageData.append('profile_image', file);

      const response = await api.post('/auth/profile/image', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.user);
      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200/30 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20 px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Manage your administrator profile and security settings
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-3xl"></div>

                {/* Profile Info */}
                <div className="relative flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
                  <div className="relative group/avatar">
                    <label className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/avatar:scale-110 cursor-pointer block">
                      <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        {user?.profile_image ? (
                          <img 
                            src={user.profile_image} 
                            alt="Profile" 
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-16 w-16 text-purple-950 dark:text-pink-200" />
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Camera className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="flex-grow text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      {user?.username || "Administrator"}
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 dark:text-gray-300">
                        <Mail className="h-5 w-5 text-purple-500" />
                        <span className="text-base break-all">
                          {user?.email || "admin@example.com"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 dark:text-gray-300">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span className="text-base capitalize font-semibold">
                          {user?.role || "Administrator"}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-200/50 dark:border-purple-700/50">
                      <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        System Administrator
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <div className="relative text-center">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`group relative overflow-hidden px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isEditing 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </div>

              {/* Profile Edit Form */}
              {isEditing && (
                <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 animate-fade-in-up">
                  <div className="space-y-8">
                    {/* Basic Information Form */}
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <User className="h-6 w-6 text-purple-500" />
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                          Update Profile Information
                        </h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                            <User className="h-4 w-4 text-purple-500" />
                            <span>Username</span>
                          </label>
                          <input
                            type="text"
                            name="username"
                            className="w-full px-4 py-4 rounded-xl border-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                          />
                        </div>

                        {/* Read-only email field */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>Email (Read-only)</span>
                          </label>
                          <div className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                            {user?.email || 'admin@example.com'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <Save className="h-5 w-5" />
                          <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                        </span>
                      </button>
                    </form>

                    {/* Password Change Form */}
                    <form onSubmit={handlePasswordChange} className="space-y-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center space-x-2 mb-6">
                        <Key className="h-6 w-6 text-blue-500" />
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                          Change Password
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            className="w-full px-4 py-4 rounded-xl border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter current password"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              className="w-full px-4 py-4 rounded-xl border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              className="w-full px-4 py-4 rounded-xl border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <Key className="h-5 w-5" />
                          <span>{loading ? 'Changing...' : 'Change Password'}</span>
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Stats Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-3xl"></div>

                  {/* Decorative elements */}
                  <div className="absolute top-6 right-6">
                    <Star className="h-6 w-6 text-purple-500 animate-spin-slow" />
                  </div>
                  <div className="absolute top-12 left-6">
                    <Star
                      className="h-4 w-4 text-pink-500 animate-bounce"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                  <div className="absolute bottom-12 right-8">
                    <Star
                      className="h-3 w-3 text-orange-500 animate-pulse"
                      style={{ animationDelay: "2s" }}
                    />
                  </div>

                  <div className="relative p-8 text-center">
                    {/* Admin Icon */}
                    <div className="mb-8">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-5 shadow-xl hover:scale-110 transition-transform duration-300">
                          <Shield className="h-14 w-14 text-white animate-bounce" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        Admin Privileges
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        System administrator access
                      </p>
                    </div>

                    {/* Access Level */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl opacity-50 animate-pulse"></div>
                      <div className="relative">
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-4">
                          FULL
                        </p>
                        <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/30">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Settings className="h-5 w-5 text-purple-500" />
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            System Access
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Full administrative control
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="group/item flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-3 border border-purple-200/50 dark:border-purple-700/30 hover:scale-105 transition-all duration-300">
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover/item:rotate-12 transition-transform duration-300" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              User Management
                            </span>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>

                        <div className="group/item flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/30 hover:scale-105 transition-all duration-300">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              System Config
                            </span>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Security Status */}
                      <div className="mt-6">
                        <div className="relative w-20 h-20 mx-auto">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-gray-200 dark:text-gray-700"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="url(#security-gradient)"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray="226 226"
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient
                                id="security-gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="50%" stopColor="#EC4899" />
                                <stop offset="100%" stopColor="#F97316" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Security: Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }

          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.8;
            }
          }

          .animate-pulse {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default AdminProfile;
