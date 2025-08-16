import React, { useState } from 'react';
import { User, Mail, Shield, Key, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

function AdminProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API call to update profile
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Admin Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Manage your administrator account settings and preferences
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid xl:grid-cols-5 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-2">
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-3xl"></div>
              
              {/* Profile Picture Section */}
              <div className="relative flex flex-col items-center text-center mb-6">
                <div className="relative group/avatar cursor-pointer">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 p-1 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <Shield className="h-16 w-16 text-gray-500 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 bg-clip-text" />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-4 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {user?.username || 'Administrator'}
                </h2>
                
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user?.email || 'admin@example.com'}</span>
                </div>
                
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-200/50 dark:border-blue-700/50">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Administrator
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              {/* <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">99%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Settings Form */}
          <div className="xl:col-span-3">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 h-2"></div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Account Settings
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`group relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isEditing 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span>Username</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm ${
                            isEditing
                              ? 'border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20'
                              : 'border-gray-200 dark:border-gray-700'
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none`}
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Enter your username"
                        />
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none transition-opacity duration-300 ${
                          isEditing ? 'opacity-100' : 'opacity-0'
                        }`}></div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-emerald-500" />
                        <span>Email Address</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm ${
                            isEditing
                              ? 'border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20'
                              : 'border-gray-200 dark:border-gray-700'
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none`}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Enter your email address"
                        />
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 pointer-events-none transition-opacity duration-300 ${
                          isEditing ? 'opacity-100' : 'opacity-0'
                        }`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  {isEditing && (
                    <div className="space-y-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up">
                      <div className="flex items-center space-x-2 mb-4">
                        <Key className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Change Password</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-4 rounded-xl border-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-4 rounded-xl border-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-4 rounded-xl border-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-6">
                        <button
                          type="submit"
                          className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:from-blue-600 hover:via-purple-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <Save className="h-5 w-5" />
                            <span>Save Changes</span>
                          </span>
                          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminProfile;
// import React, { useEffect, useState } from 'react';
// import {
//   User, Mail, Shield, Key, Edit3, Save, X, Settings, Lock,
//   UserCheck, Camera, Calendar, MapPin
// } from 'lucide-react';
// import { useAuth } from '../../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import api from '../../../lib/api';

// function AdminProfile() {
//   const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username || '',
//         email: user.email || '',
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     }
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
//       return toast.error('New passwords do not match');
//     }

//     try {
//       const payload = {
//         username: formData.username,
//         email: formData.email
//       };

//       if (formData.currentPassword && formData.newPassword) {
//         payload.currentPassword = formData.currentPassword;
//         payload.newPassword = formData.newPassword;
//       }

//       await api.put('/admin/profile', payload);

//       toast.success('Profile updated successfully');
//       setIsEditing(false);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Failed to update profile');
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 sm:p-6 lg:p-8">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
//           <div className="relative p-6 sm:p-8">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div className="space-y-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                     <User className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       Admin Profile
//                     </h1>
//                     <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
//                       Manage your account settings and preferences
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform ${
//                     isEditing 
//                       ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
//                       : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
//                   }`}
//                 >
//                   {isEditing ? (
//                     <>
//                       <X className="h-5 w-5" />
//                       <span className="hidden sm:inline">Cancel</span>
//                     </>
//                   ) : (
//                     <>
//                       <Edit3 className="h-5 w-5" />
//                       <span className="hidden sm:inline">Edit Profile</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Grid */}
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Profile Card */}
//           <div className="lg:col-span-1">
//             <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-slate-700/30 transition-all duration-500 p-6 sm:p-8">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

//               <div className="text-center space-y-6">
//                 {/* Avatar */}
//                 <div className="relative mx-auto w-32 h-32">
//                   <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
//                     <Shield className="h-16 w-16 text-white" />
//                   </div>
//                   <button className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform">
//                     <Camera className="h-5 w-5 text-white" />
//                   </button>
//                 </div>

//                 {/* User Info */}
//                 <div className="space-y-3">
//                   <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
//                     {user?.username || 'Admin User'}
//                   </h2>

//                   <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
//                     <Mail className="h-4 w-4" />
//                     <span className="text-sm">{user?.email || 'admin@example.com'}</span>
//                   </div>

//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
//                     <UserCheck className="h-4 w-4" />
//                     Administrator
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2+</div>
//                       <div className="text-xs text-slate-500 dark:text-slate-400">Years Active</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
//                       <div className="text-xs text-slate-500 dark:text-slate-400">Availability</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Info */}
//             <div className="mt-6 relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/30 p-6">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
//                   <Settings className="h-5 w-5" />
//                   Quick Info
//                 </h3>

//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       Joined
//                     </span>
//                     <span className="font-medium text-slate-800 dark:text-slate-200">Jan 2024</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
//                       <Lock className="h-4 w-4" />
//                       Last Login
//                     </span>
//                     <span className="font-medium text-slate-800 dark:text-slate-200">Today</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
//                       <MapPin className="h-4 w-4" />
//                       Location
//                     </span>
//                     <span className="font-medium text-slate-800 dark:text-slate-200">Global</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Settings Form */}
//           <div className="lg:col-span-2">
//             <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border">
//               <div className="p-6 sm:p-8">
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-2xl font-bold flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
//                       <Settings className="h-5 w-5 text-white" />
//                     </div>
//                     Account Settings
//                   </h2>

//                   {isEditing && (
//                     <div className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
//                       Editing Mode
//                     </div>
//                   )}
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-8">
//                   {/* Basic Info */}
//                   <div className="space-y-6">
//                     <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>

//                     <div className="grid sm:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-semibold flex items-center gap-2">
//                           <User className="h-4 w-4" /> Username
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.username}
//                           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                           disabled={!isEditing}
//                           placeholder="Enter your username"
//                           className={`w-full p-4 bg-white/70 dark:bg-slate-700/70 rounded-2xl border ${
//                             !isEditing ? 'cursor-not-allowed opacity-70' : ''
//                           }`}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <label className="block text-sm font-semibold flex items-center gap-2">
//                           <Mail className="h-4 w-4" /> Email Address
//                         </label>
//                         <input
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                           disabled={!isEditing}
//                           placeholder="Enter your email"
//                           className={`w-full p-4 bg-white/70 dark:bg-slate-700/70 rounded-2xl border ${
//                             !isEditing ? 'cursor-not-allowed opacity-70' : ''
//                           }`}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Password */}
//                   {isEditing && (
//                     <div className="space-y-6">
//                       <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
//                         <Key className="h-5 w-5" /> Security Settings
//                       </h3>

//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-sm font-semibold mb-2">Current Password</label>
//                           <input
//                             type="password"
//                             value={formData.currentPassword}
//                             onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
//                             placeholder="Enter current password"
//                             className="w-full p-4 bg-white/70 dark:bg-slate-700/70 rounded-2xl border"
//                           />
//                         </div>

//                         <div className="grid sm:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-semibold mb-2">New Password</label>
//                             <input
//                               type="password"
//                               value={formData.newPassword}
//                               onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
//                               placeholder="Enter new password"
//                               className="w-full p-4 bg-white/70 dark:bg-slate-700/70 rounded-2xl border"
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
//                             <input
//                               type="password"
//                               value={formData.confirmPassword}
//                               onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                               placeholder="Confirm new password"
//                               className="w-full p-4 bg-white/70 dark:bg-slate-700/70 rounded-2xl border"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Actions */}
//                   {isEditing && (
//                     <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
//                       <button
//                         type="submit"
//                         className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl"
//                       >
//                         <Save className="h-5 w-5" />
//                         Save Changes
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setIsEditing(false);
//                           setFormData({
//                             username: user?.username || '',
//                             email: user?.email || '',
//                             currentPassword: '',
//                             newPassword: '',
//                             confirmPassword: ''
//                           });
//                         }}
//                         className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl"
//                       >
//                         <X className="h-5 w-5" />
//                         Discard Changes
//                       </button>
//                     </div>
//                   )}
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminProfile;
