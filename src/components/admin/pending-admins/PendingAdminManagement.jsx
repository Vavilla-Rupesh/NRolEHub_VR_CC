import React, { useState, useEffect } from "react";
import {
  Shield,
  Check,
  X,
  Clock,
  Mail,
  User,
  AlertTriangle,
  UserCheck,
  UserX,
  Calendar,
  Star,
  Search,
  Filter,
  SortAsc,
} from "lucide-react";
import api from "../../../lib/api";
import LoadingSpinner from "../../shared/LoadingSpinner";
import Modal from "../../shared/Modal";
import { formatDate } from "../../../lib/utils";
import toast from "react-hot-toast";

export default function PendingAdminManagement() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "all", // all, today, week, month
    sortBy: "newest", // newest, oldest, username
    status: "all", // all, pending (for future expansion)
  });
  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const response = await api.get("/auth/pending-admins");
      setPendingAdmins(response.data);
    } catch (error) {
      toast.error("Failed to fetch pending admin requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pendingAdminId) => {
    try {
      setProcessing(true);
      await api.put(`/auth/approve-admin/${pendingAdminId}`);
      toast.success("Admin approved successfully");
      fetchPendingAdmins();
    } catch (error) {
      toast.error("Failed to approve admin");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAdmin || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setProcessing(true);
      await api.put(`/auth/reject-admin/${selectedAdmin.id}`, {
        reason: rejectionReason,
      });
      toast.success("Admin rejected successfully");
      setShowRejectModal(false);
      setSelectedAdmin(null);
      setRejectionReason("");
      fetchPendingAdmins();
    } catch (error) {
      toast.error("Failed to reject admin");
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (admin) => {
    setSelectedAdmin(admin);
    setShowRejectModal(true);
  };
  const applyFilters = (adminsToFilter) => {
    let filtered = [...adminsToFilter];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (admin) =>
          admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((admin) => {
        if (!admin.created_at) return false;
        const adminDate = new Date(admin.created_at);

        switch (filters.dateRange) {
          case "today":
            return adminDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return adminDate >= weekAgo;
          case "month":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            return adminDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "username":
          return (a.username || "").localeCompare(b.username || "");
        case "newest":
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return filtered;
  };

  const filteredAdmins = applyFilters(pendingAdmins);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setShowFilterDropdown(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    if (searchTerm) count++;
    return count;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screenfrom-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-pink-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl"></div>{" "}
          {/* ✅ FIXED */}
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                      Admin Approvals
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                      Review and manage pending admin registration requests
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-6 py-4 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/30">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                      {filteredAdmins.length}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-300 font-medium">
                      {searchTerm || getActiveFiltersCount() > 0
                        ? "Filtered"
                        : "Pending"}{" "}
                      Request{filteredAdmins.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:max-w-md">
                  {/* Search Bar */}
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                  </div>

                  {/* Filter Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform relative"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filter</span>
                      {getActiveFiltersCount() > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {getActiveFiltersCount()}
                        </span>
                      )}
                    </button>

                    {/* Filter Dropdown */}
                    {showFilterDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 z-50 p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <SortAsc className="h-5 w-5" />
                            Filters & Sort
                          </h3>
                          <button
                            onClick={() => {
                              setFilters({
                                dateRange: "all",
                                sortBy: "newest",
                                status: "all",
                              });
                              setSearchTerm("");
                            }}
                            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>

                        {/* Date Range Filter */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Date Range
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: "all", label: "All Time" },
                              { value: "today", label: "Today" },
                              { value: "week", label: "This Week" },
                              { value: "month", label: "This Month" },
                            ].map(({ value, label }) => (
                              <button
                                key={value}
                                onClick={() =>
                                  handleFilterChange("dateRange", value)
                                }
                                className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
                                  filters.dateRange === value
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sort By Filter */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Sort By
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "newest", label: "Newest" },
                              { value: "oldest", label: "Oldest" },
                              { value: "username", label: "Name" },
                            ].map(({ value, label }) => (
                              <button
                                key={value}
                                onClick={() =>
                                  handleFilterChange("sortBy", value)
                                }
                                className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
                                  filters.sortBy === value
                                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Quick Actions
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  dateRange: "today",
                                }));
                                setShowFilterDropdown(false);
                              }}
                              className="flex-1 px-3 py-2 text-xs bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-800/40 dark:hover:to-cyan-800/40 transition-all"
                            >
                              Today's Requests
                            </button>
                            <button
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  sortBy: "username",
                                }));
                                setShowFilterDropdown(false);
                              }}
                              className="flex-1 px-3 py-2 text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-lg hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40 transition-all"
                            >
                              Sort A-Z
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {pendingAdmins.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Total Requests
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {filteredAdmins.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Filtered Results
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  0
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Approved Today
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  0
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Rejected Today
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Requests */}
        <div className="space-y-6">
          {filteredAdmins.length === 0 ? (
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/30 text-center py-16">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-purple-50/30 dark:from-slate-800/50 dark:to-purple-900/20"></div>
              <div className="relative">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-3">
                  {searchTerm || getActiveFiltersCount() > 0
                    ? "No Matching Results"
                    : "All Caught Up! 🎉"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm || getActiveFiltersCount() > 0
                    ? "No admin requests match your current search or filter criteria. Try adjusting your filters."
                    : "No pending admin registration requests at the moment. All requests have been processed."}
                </p>
                {(searchTerm || getActiveFiltersCount() > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        dateRange: "all",
                        sortBy: "newest",
                        status: "all",
                      });
                    }}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredAdmins.map((admin, index) => (
              <div
                key={admin.id}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-slate-700/30 transition-all duration-500 hover:scale-[1.02] transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Priority Indicator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Admin Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                            {admin.username || "Unknown User"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Mail className="h-4 w-4" />
                              <span>{admin.email || "No email"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Requested on {formatDate(admin.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          Pending Review
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                      <button
                        onClick={() => handleApprove(admin.id)}
                        disabled={processing}
                        className="group/btn flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserCheck className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => openRejectModal(admin)}
                        disabled={processing}
                        className="group/btn flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserX className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rejection Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedAdmin(null);
            setRejectionReason("");
          }}
          title="Reject Admin Request"
        >
          <div className="space-y-6">
            {/* Warning Section */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-700/30">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-400 mb-1">
                  Confirm Rejection
                </h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Are you sure you want to reject the admin request from{" "}
                  <strong className="font-semibold">
                    {selectedAdmin?.username}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Reason for rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-32 p-4 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 resize-none"
                placeholder="Please provide a detailed reason for rejecting this admin request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This reason will be sent to the applicant via email.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAdmin(null);
                  setRejectionReason("");
                }}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Rejecting...
                  </span>
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
