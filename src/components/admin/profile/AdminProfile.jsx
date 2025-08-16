import React, { useState } from 'react';
import { User, Mail, Shield, Key } from 'lucide-react';
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Profile</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <div className="flex items-center space-x-2 mt-1 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* <button
              type="submit"
              className="btn btn-primary w-full"
              onClick={() => !isEditing && setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button> */}
          </form>
        </div>
      </div>
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
