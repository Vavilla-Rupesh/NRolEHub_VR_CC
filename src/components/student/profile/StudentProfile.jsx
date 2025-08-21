import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Trophy,
  Star,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Zap,
  Medal,
  ChevronRight,
  Camera,
  Edit3,
  Save,
  X,
  Key,
  Phone,
  Hash,
  Building,
  BookOpen,
  Info,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import { cn, formatDate } from "../../../lib/utils";
import PointsDisplay from "../points/PointsDisplay";
import { useStudentPoints } from "../../../lib/hooks/useStudentPoints";
import toast from "react-hot-toast";

function StudentProfile() {
  const { user, setUser } = useAuth();
  const { totalPoints, detailedBreakdown } = useStudentPoints(user?.id);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    mobile_number: user?.mobile_number || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        mobile_number: user.mobile_number || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const registrationsResponse = await api.get(
        "/registrations/my-registrations"
      );
      const registrations = registrationsResponse.data.filter(
        (reg) => reg.payment_status === "paid"
      );

      setRegisteredEvents(registrations);

      const eventsResponse = await api.get("/events");
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcoming = eventsResponse.data.rows
        .filter((event) => new Date(event.start_date) >= now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 5);
      console.log(upcoming);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    try {
      const response = await api.put('/auth/profile', {
        username: formData.username,
        mobile_number: formData.mobile_number
      });
      
      // Update user context
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await api.put('/auth/profile/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Password changed successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('profile_image', file);
      
      const response = await api.post('/auth/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update user context
      setUser(response.data.user);
      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Student Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Track your achievements, monitor your progress, and celebrate your
            success
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200/30 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content - Takes full width on xl screens */}
            <div className="xl:col-span-2 space-y-8">
              {/* Profile Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile Info */}
                <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-3xl"></div>

                  {/* User Info */}
                  <div className="relative flex flex-col items-center text-center space-y-6 mb-8">
                    <div className="relative group/avatar">
                      <label className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 p-1 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/avatar:scale-110 cursor-pointer block">
                        <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                          {user?.profile_image ? (
                            <img 
                              src={user.profile_image} 
                              alt="Profile" 
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-16 w-16 text-blue-600" />
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
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg pointer-events-none">
                        <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {user?.username || "Student"}
                      </h2>
                      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <span className="text-base break-all">
                          {user?.email || "student@example.com"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                        <Phone className="h-5 w-5 text-green-500" />
                        <span className="text-base">
                          {user?.mobile_number || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                        <Hash className="h-5 w-5 text-purple-500" />
                        <span className="text-base">
                          {user?.roll_number || "Not provided"}
                        </span>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-200/50 dark:border-blue-700/50">
                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          Active Student
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
                </div>

                {/* Right Column - Stats */}
                <div className="space-y-6">
                  {/* Enhanced Points Display */}
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 rounded-xl bg-amber-500/20">
                        <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        Achievement Points
                      </h3>
                    </div>
                    <PointsDisplay compact={false} showBreakdown={false} />
                  </div>


                  
                </div>
              </div>

              {/* Profile Edit Form */}
              {isEditing && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
                  <div className="space-y-8">
                    {/* Basic Information Form */}
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <User className="h-6 w-6 text-blue-500" />
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                          Update Profile Information
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-500" />
                            <span>Username</span>
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-4 rounded-xl border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter your username"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-green-500" />
                            <span>Mobile Number</span>
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-4 rounded-xl border-2 border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                            value={formData.mobile_number}
                            onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                            placeholder="Enter your mobile number"
                            pattern="[0-9]{10}"
                            required
                          />
                        </div>
                      </div>

                      {/* Read-only fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>Email (Read-only)</span>
                          </label>
                          <div className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                            {user?.email || 'student@example.com'}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            <span>Roll Number (Read-only)</span>
                          </label>
                          <div className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                            {user?.roll_number || 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <Save className="h-5 w-5" />
                          <span>Update Profile</span>
                        </span>
                      </button>
                    </form>

                    {/* Password Change Form */}
                    <form onSubmit={handlePasswordChange} className="space-y-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center space-x-2 mb-6">
                        <Key className="h-6 w-6 text-purple-500" />
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
                            className="w-full px-4 py-4 rounded-xl border-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
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

                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <Key className="h-5 w-5" />
                          <span>Change Password</span>
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 rounded-3xl"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-purple-500/20">
                          <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span>Upcoming Events</span>
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Next {upcomingEvents.slice(0, 3).length} events
                      </div>
                    </div>

                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 3).map((event, index) => (
                        <div
                          key={event.id}
                          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-600/30 p-6 hover:border-purple-400/60 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 text-lg">
                                  {event.event_name}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {formatDate(new Date(event.start_date))}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Quick Stats */}
            <div className="xl:col-span-1 space-y-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-xl bg-blue-500/20">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Quick Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Events Participated</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{registeredEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Merit Achievements</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {detailedBreakdown?.reduce((count, event) => 
                        count + event.subEvents.filter(se => se.rank && se.rank <= 3).length, 0
                      ) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Points</span>
                    <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {totalPoints}
                    </span>
                  </div>
                </div>
              </div>
              {/* Stats Grid */}
                  <div className="relative grid grid-cols-1 gap-6">
                    <div className="group/stat relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30 p-6 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 rounded-xl bg-blue-500/20 group-hover/stat:bg-blue-500/30 transition-colors duration-300">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover/stat:scale-110 transition-transform duration-300" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 block">
                              Events Participated
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Total registrations
                            </span>
                          </div>
                        </div>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                          {registeredEvents.length}
                        </p>
                        <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(
                                (registeredEvents.length / 10) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="group/stat relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/30 p-6 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 rounded-xl bg-emerald-500/20 group-hover/stat:bg-emerald-500/30 transition-colors duration-300">
                            <Trophy className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all duration-300" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 block">
                              Events with Merit
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Top 3 positions
                            </span>
                          </div>
                        </div>
                        <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                          {detailedBreakdown?.reduce((count, event) => 
                            count + event.subEvents.filter(se => se.rank && se.rank <= 3).length, 0
                          ) || 0}
                        </p>
                        <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(
                                ((detailedBreakdown?.reduce((count, event) => 
                                  count + event.subEvents.filter(se => se.rank && se.rank <= 3).length, 0
                                ) || 0) / Math.max(registeredEvents.length, 1)) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
