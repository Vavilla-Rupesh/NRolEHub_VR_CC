// import React, { useState, useEffect } from "react";
// import {
//   MessageSquare,
//   CheckCircle,
//   Search,
//   Filter,
//   User,
//   Mail,
//   Calendar,
//   Clock,
// } from "lucide-react";
// import api from "../../../lib/api";
// import toast from "react-hot-toast";
// import LoadingSpinner from "../../shared/LoadingSpinner";

// export default function ComplaintManagement() {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [response, setResponse] = useState("");
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [filters, setFilters] = useState({
//     status: "all", // all, pending, resolved
//     dateRange: "all", // all, today, week, month
//     sortBy: "newest", // newest, oldest, status
//   });

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       const response = await api.get("/complaints/all");
//       setComplaints(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch complaints");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResolve = async (complaintId) => {
//     if (!response.trim()) {
//       toast.error("Please provide a response");
//       return;
//     }

//     try {
//       await api.put(`/complaints/${complaintId}/resolve`, { response });
//       toast.success("Complaint resolved successfully");
//       setSelectedComplaint(null);
//       setResponse("");
//       fetchComplaints();
//     } catch (error) {
//       toast.error("Failed to resolve complaint");
//     }
//   };
//   const applyFilters = (complaintsToFilter) => {
//     let filtered = [...complaintsToFilter];

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (complaint) =>
//           complaint.complaint_text
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           complaint.student?.username
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           complaint.student?.email
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply status filter
//     if (filters.status !== "all") {
//       filtered = filtered.filter(
//         (complaint) => complaint.status === filters.status
//       );
//     }

//     // Apply date range filter
//     if (filters.dateRange !== "all") {
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//       filtered = filtered.filter((complaint) => {
//         if (!complaint.created_at) return false;
//         const complaintDate = new Date(complaint.created_at);

//         switch (filters.dateRange) {
//           case "today":
//             return complaintDate >= today;
//           case "week":
//             const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
//             return complaintDate >= weekAgo;
//           case "month":
//             const monthAgo = new Date(
//               today.getTime() - 30 * 24 * 60 * 60 * 1000
//             );
//             return complaintDate >= monthAgo;
//           default:
//             return true;
//         }
//       });
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       switch (filters.sortBy) {
//         case "oldest":
//           return new Date(a.created_at || 0) - new Date(b.created_at || 0);
//         case "status":
//           if (a.status === b.status)
//             return new Date(b.created_at || 0) - new Date(a.created_at || 0);
//           return a.status === "pending" ? -1 : 1;
//         case "newest":
//         default:
//           return new Date(b.created_at || 0) - new Date(a.created_at || 0);
//       }
//     });

//     return filtered;
//   };

//   const filteredComplaints = applyFilters(complaints);

//   const handleFilterChange = (filterType, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [filterType]: value,
//     }));
//     setShowFilterDropdown(false);
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (filters.status !== "all") count++;
//     if (filters.dateRange !== "all") count++;
//     if (filters.sortBy !== "newest") count++;
//     return count;
//   };
//   if (loading) return <LoadingSpinner />;
//   return (
//     <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header Section */}
//         <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl"></div>{" "}
//           {/* ✅ FIXED */}
//           <div className="relative p-6 sm:p-8">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div className="space-y-2">
//                 <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                   Complaint Management
//                 </h1>
//                 <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
//                   Manage and resolve student complaints efficiently
//                 </p>
//               </div>

//               {/* Search and Filters */}
//               <div className="flex flex-col sm:flex-row gap-4 lg:max-w-md w-full">
//                 <div className="relative flex-1 group">
//                   <input
//                     type="text"
//                     placeholder="Search complaints, students, emails..."
//                     className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
//                 </div>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                     className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform relative"
//                   >
//                     <Filter className="h-4 w-4" />
//                     <span className="hidden sm:inline">Filter</span>
//                     {getActiveFiltersCount() > 0 && (
//                       <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                         {getActiveFiltersCount()}
//                       </span>
//                     )}
//                   </button>

//                   {/* Filter Dropdown */}
//                   {showFilterDropdown && (
//                     <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 z-50 p-6 space-y-6">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
//                           Filters
//                         </h3>
//                         <button
//                           onClick={() =>
//                             setFilters({
//                               status: "all",
//                               dateRange: "all",
//                               sortBy: "newest",
//                             })
//                           }
//                           className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
//                         >
//                           Clear All
//                         </button>
//                       </div>

//                       {/* Status Filter */}
//                       <div className="space-y-3">
//                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
//                           Status
//                         </label>
//                         <div className="grid grid-cols-3 gap-2">
//                           {["all", "pending", "resolved"].map((status) => (
//                             <button
//                               key={status}
//                               onClick={() =>
//                                 handleFilterChange("status", status)
//                               }
//                               className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
//                                 filters.status === status
//                                   ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
//                                   : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
//                               }`}
//                             >
//                               {status.charAt(0).toUpperCase() + status.slice(1)}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Date Range Filter */}
//                       <div className="space-y-3">
//                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
//                           Date Range
//                         </label>
//                         <div className="grid grid-cols-2 gap-2">
//                           {[
//                             { value: "all", label: "All Time" },
//                             { value: "today", label: "Today" },
//                             { value: "week", label: "This Week" },
//                             { value: "month", label: "This Month" },
//                           ].map(({ value, label }) => (
//                             <button
//                               key={value}
//                               onClick={() =>
//                                 handleFilterChange("dateRange", value)
//                               }
//                               className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
//                                 filters.dateRange === value
//                                   ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
//                                   : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
//                               }`}
//                             >
//                               {label}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Sort By Filter */}
//                       <div className="space-y-3">
//                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
//                           Sort By
//                         </label>
//                         <div className="grid grid-cols-3 gap-2">
//                           {[
//                             { value: "newest", label: "Newest" },
//                             { value: "oldest", label: "Oldest" },
//                             { value: "status", label: "Status" },
//                           ].map(({ value, label }) => (
//                             <button
//                               key={value}
//                               onClick={() =>
//                                 handleFilterChange("sortBy", value)
//                               }
//                               className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
//                                 filters.sortBy === value
//                                   ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
//                                   : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
//                               }`}
//                             >
//                               {label}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Stats Bar */}
//             <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
//               <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {complaints.filter((c) => c.status === "resolved").length}
//                 </div>
//                 <div className="text-xs text-slate-600 dark:text-slate-400">
//                   Resolved
//                 </div>
//               </div>
//               <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 text-center">
//                 <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
//                   {complaints.filter((c) => c.status !== "resolved").length}
//                 </div>
//                 <div className="text-xs text-slate-600 dark:text-slate-400">
//                   Pending
//                 </div>
//               </div>
//               <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 text-center">
//                 <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                   {complaints.length}
//                 </div>
//                 <div className="text-xs text-slate-600 dark:text-slate-400">
//                   Total
//                 </div>
//               </div>
//               <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center">
//                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//                   {filteredComplaints.length}
//                 </div>
//                 <div className="text-xs text-slate-600 dark:text-slate-400">
//                   Filtered
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Complaints Grid */}
//         <div className="space-y-6">
//           {filteredComplaints.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6">
//                 <MessageSquare className="h-12 w-12 text-slate-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
//                 No Complaints Found
//               </h3>
//               <p className="text-slate-500 dark:text-slate-400">
//                 No complaints match your search criteria.
//               </p>
//             </div>
//           ) : (
//             filteredComplaints.map((complaint, index) => (
//               <div
//                 key={complaint.id}
//                 className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-slate-700/30 transition-all duration-500 hover:scale-[1.02] transform"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 {/* Status Indicator */}
//                 <div
//                   className={`absolute top-0 left-0 w-full h-1 ${
//                     complaint.status === "resolved"
//                       ? "bg-gradient-to-r from-green-500 to-emerald-500"
//                       : "bg-gradient-to-r from-yellow-500 to-orange-500"
//                   }`}
//                 ></div>

//                 <div className="p-6 sm:p-8">
//                   {/* Header */}
//                   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
//                     <div className="flex-1 space-y-3">
//                       <div className="flex flex-wrap items-center gap-3">
//                         <div className="flex items-center gap-2">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                             <User className="h-5 w-5 text-white" />
//                           </div>
//                           <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
//                             {complaint.student?.username || "Unknown Student"}
//                           </h3>
//                         </div>
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
//                             complaint.status === "resolved"
//                               ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
//                               : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400"
//                           }`}
//                         >
//                           <div
//                             className={`w-2 h-2 rounded-full mr-2 ${
//                               complaint.status === "resolved"
//                                 ? "bg-green-500"
//                                 : "bg-yellow-500"
//                             }`}
//                           ></div>
//                           {complaint.status || "pending"}
//                         </span>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-4 w-4" />
//                           <span>{complaint.student?.email || "No email"}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           <span>
//                             {complaint.created_at
//                               ? new Date(
//                                   complaint.created_at
//                                 ).toLocaleDateString()
//                               : "No date"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
//                       <Clock className="h-4 w-4" />
//                       <span>#{complaint.id || "000"}</span>
//                     </div>
//                   </div>

//                   {/* Complaint Content */}
//                   <div className="space-y-6">
//                     <div className="relative p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-700/30">
//                       <div className="flex items-start gap-4">
//                         <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
//                           <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
//                             Complaint Details
//                           </h4>
//                           <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
//                             {complaint.complaint_text ||
//                               "No complaint text available"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Resolution Section */}
//                     {complaint.status === "resolved" ? (
//                       <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl border border-green-200/50 dark:border-green-700/30 animate-fade-in">
//                         <div className="flex items-start gap-4">
//                           <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
//                             <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
//                               Admin Response
//                             </h4>
//                             <p className="text-green-700 dark:text-green-300 leading-relaxed">
//                               {complaint.admin_response ||
//                                 "No response provided"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="space-y-4 animate-fade-in">
//                         <div className="relative">
//                           <textarea
//                             placeholder="Provide a detailed response to resolve this complaint..."
//                             className="w-full h-32 p-4 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 resize-none"
//                             value={
//                               selectedComplaint === complaint.id ? response : ""
//                             }
//                             onChange={(e) => {
//                               setSelectedComplaint(complaint.id);
//                               setResponse(e.target.value);
//                             }}
//                           />
//                         </div>
//                         <button
//                           onClick={() => handleResolve(complaint.id)}
//                           className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
//                           disabled={!response.trim()}
//                         >
//                           <span className="flex items-center justify-center gap-2">
//                             <CheckCircle className="h-5 w-5" />
//                             Resolve Complaint
//                           </span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle,
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Clock,
  BarChart3,
  CalendarFold,
  X,
} from "lucide-react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../shared/LoadingSpinner";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({
    status: "all", // all, pending, resolved
    dateRange: "all", // all, today, week, month
    sortBy: "newest", // newest, oldest, status
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints/all");
      setComplaints(response.data);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (complaintId) => {
    if (!response.trim()) {
      toast.error("Please provide a response");
      return;
    }

    try {
      await api.put(`/complaints/${complaintId}/resolve`, { response });
      toast.success("Complaint resolved successfully");
      setSelectedComplaint(null);
      setResponse("");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to resolve complaint");
    }
  };
  const applyFilters = (complaintsToFilter) => {
    let filtered = [...complaintsToFilter];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaint_text
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.student?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.student?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === filters.status
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((complaint) => {
        if (!complaint.created_at) return false;
        const complaintDate = new Date(complaint.created_at);

        switch (filters.dateRange) {
          case "today":
            return complaintDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return complaintDate >= weekAgo;
          case "month":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            return complaintDate >= monthAgo;
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
        case "status":
          if (a.status === b.status)
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
          return a.status === "pending" ? -1 : 1;
        case "newest":
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return filtered;
  };

  const filteredComplaints = applyFilters(complaints);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setShowFilterDropdown(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.dateRange !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    return count;
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Complaint Management
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                  Manage and resolve student complaints efficiently
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 lg:max-w-md w-full">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    placeholder="Search complaints, students, emails..."
                    className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                </div>
                <div className="relative z-[9999]">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform relative"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>

                  {/* Filter Dropdown */}
                  {showFilterDropdown && (
                    <>
                      {/* Backdrop overlay */}
                      <div
                        className="fixed inset-0 z-[9990]"
                        onClick={() => setShowFilterDropdown(false)}
                      ></div>

                      {/* Filter dropdown */}
                      <div className="fixed right-4 top-[120px] sm:absolute sm:right-0 sm:top-full mt-2 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 z-[9999] p-6 space-y-6 ring-2 ring-blue-400/40">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            Filters
                          </h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setFilters({
                                  status: "all",
                                  dateRange: "all",
                                  sortBy: "newest",
                                })
                              }
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                              Clear All
                            </button>
                            <button
                              onClick={() => setShowFilterDropdown(false)}
                              className="rounded-full transition-colors p-3 bg-gray-200 hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30"
                              title="Close"
                            >
                              <X className="h-4 w-4 text-slate-500 hover:text-red-600" />
                            </button>
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Status
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["all", "pending", "resolved"].map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleFilterChange("status", status)
                                }
                                className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
                                  filters.status === status
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </button>
                            ))}
                          </div>
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
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
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
                              { value: "status", label: "Status" },
                            ].map(({ value, label }) => (
                              <button
                                key={value}
                                onClick={() =>
                                  handleFilterChange("sortBy", value)
                                }
                                className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 ${
                                  filters.sortBy === value
                                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {complaints.filter((c) => c.status === "resolved").length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Resolved
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {complaints.filter((c) => c.status !== "resolved").length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Pending
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {complaints.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Total
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {filteredComplaints.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Filtered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                No Complaints Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                No complaints match your search criteria.
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint, index) => (
              <div
                key={complaint.id}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-slate-700/30 transition-all duration-500 hover:scale-[1.02] transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    complaint.status === "resolved"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500"
                  }`}
                ></div>

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                            {complaint.student?.username || "Unknown Student"}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            complaint.status === "resolved"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                              : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              complaint.status === "resolved"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          {complaint.status || "pending"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{complaint.student?.email || "No email"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {complaint.created_at
                              ? new Date(
                                  complaint.created_at
                                ).toLocaleDateString()
                              : "No date"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span>#{complaint.id || "000"}</span>
                    </div>
                  </div>

                  {/* Complaint Content */}
                  <div className="space-y-6">
                    <div className="relative p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-700/30">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                            Complaint Details
                          </h4>
                          <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {complaint.complaint_text
                              ? complaint.complaint_text
                                  .split("\n")
                                  .map((line, idx) => {
                                    // Highlight and emoji logic
                                    if (
                                      /^User's Issue Description:?/i.test(
                                        line.trim()
                                      )
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="mt-2 mb-1 font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2"
                                        >
                                          <span role="img" aria-label="user">
                                            📝
                                          </span>
                                          {line.replace(
                                            /^User's Issue Description:?/i,
                                            "User's Issue Description:"
                                          )}
                                        </div>
                                      );
                                    } else if (
                                      /^Event Details:?/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2"
                                        >
                                          <span role="img" aria-label="event">
                                            <Calendar />
                                          </span>
                                          {line.replace(
                                            /^Event Details:?/i,
                                            "Event Details:"
                                          )}
                                        </div>
                                      );
                                    } else if (
                                      /^Current Status:?/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2 mt-2"
                                        >
                                          <span role="img" aria-label="status">
                                            <BarChart3 />
                                          </span>
                                          {line.replace(
                                            /^Current Status:?/i,
                                            "Current Status:"
                                          )}
                                        </div>
                                      );
                                    } else if (
                                      /^- Attendance:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span
                                            role="img"
                                            aria-label="attendance"
                                          >
                                            🗒️
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    } else if (
                                      /^- Payment:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span role="img" aria-label="payment">
                                            💳
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    } else if (
                                      /^- Certificate:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span
                                            role="img"
                                            aria-label="certificate"
                                          >
                                            📄
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    } else if (
                                      /^- Achievement:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span
                                            role="img"
                                            aria-label="achievement"
                                          >
                                            🏆
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    } else if (
                                      /^- Event Name:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span
                                            role="img"
                                            aria-label="event-name"
                                          >
                                            <CalendarFold />
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    } else if (
                                      /^- Sub-Event:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span
                                            role="img"
                                            aria-label="sub-event"
                                          >
                                            🎯
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    } else if (
                                      /^- Registration ID:/i.test(line.trim())
                                    ) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 ml-4"
                                        >
                                          <span
                                            role="img"
                                            aria-label="registration"
                                          >
                                            #️⃣
                                          </span>
                                          {line.trim()}
                                        </div>
                                      );
                                    }
                                    return <div key={idx}>{line}</div>;
                                  })
                              : "No complaint text available"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resolution Section */}
                    {complaint.status === "resolved" ? (
                      <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl border border-green-200/50 dark:border-green-700/30 animate-fade-in">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                              Admin Response
                            </h4>
                            <p className="text-green-700 dark:text-green-300 leading-relaxed">
                              {complaint.admin_response ||
                                "No response provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in">
                        <div className="relative">
                          <textarea
                            placeholder="Provide a detailed response to resolve this complaint..."
                            className="w-full h-32 p-4 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 resize-none"
                            value={
                              selectedComplaint === complaint.id ? response : ""
                            }
                            onChange={(e) => {
                              setSelectedComplaint(complaint.id);
                              setResponse(e.target.value);
                            }}
                          />
                        </div>
                        <button
                          onClick={() => handleResolve(complaint.id)}
                          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!response.trim()}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Resolve Complaint
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
