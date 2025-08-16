// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Filter,
//   ArrowUpDown,
//   Download,
//   Users,
//   IndianRupee,
//   RefreshCw,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import api from "../../../lib/api";
// import LoadingSpinner from "../../shared/LoadingSpinner";
// import { cn } from "../../../lib/utils";
// import toast from "react-hot-toast";
// import { formatCurrency } from "../../../lib/utils";
// import * as XLSX from "xlsx";

// const NATURE_OF_ACTIVITIES = [
//   "CEA/NSS/National Initiatives (OLD)",
//   "Sports & Games",
//   "Cultural Activities",
//   "Women's forum activities",
//   "Hobby clubs Activities",
//   "Professional society Activities",
//   "Dept. Students Association Activities",
//   "Technical Club Activities",
//   "Innovation and Incubation Cell Activities",
//   "Professional Self Initiatives",
//   "Others",
// ];

// export default function StudentManagement() {
//   const [students, setStudents] = useState([]);
//   const [allFilteredStudents, setAllFilteredStudents] = useState([]); // Store all filtered data
//   const [loading, setLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [events, setEvents] = useState([]);
//   const [subevents, setSubevents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [totalEntries, setTotalEntries] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0); // Store total amount of all entries
//   const [filters, setFilters] = useState({
//     name: "",
//     rollNumber: "",
//     year: "",
//     semester: "",
//     college: "",
//     branch: "",
//     event: "",
//     subevent: "",
//     natureOfActivity: "",
//     attendance: "",
//     certificateStatus: "",
//     participationType: "",
//   });

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "asc",
//   });

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     if (filters.event) {
//       fetchSubevents(filters.event);
//     }
//   }, [filters.event]);

//   // Update pagination when page or entries per page changes
//   useEffect(() => {
//     if (hasSearched && allFilteredStudents.length > 0) {
//       updatePaginatedData();
//     }
//   }, [currentPage, entriesPerPage, allFilteredStudents]);

//   const fetchEvents = async () => {
//     try {
//       const response = await api.get("/events");
//       setEvents(response.data.rows || []);
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//     }
//   };

//   const fetchSubevents = async (eventName) => {
//     try {
//       const event = events.find((e) => e.event_name === eventName);
//       if (!event) return;

//       const response = await api.get(`/subevents/${event.id}`);
//       setSubevents(response.data.subevents || []);
//     } catch (error) {
//       console.error("Failed to fetch subevents:", error);
//       toast.error("Failed to fetch subevents");
//     }
//   };

//   const fetchStudents = async () => {
//     // Check if at least one filter is applied
//     if (!hasFiltersApplied()) {
//       toast.error("Please apply at least one filter before searching");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await api.get("/admin/students");
//       const allStudents = response.data;

//       // Apply filters
//       const filteredData = filterData(allStudents);

//       // Apply sorting
//       const sortedData = sortData(filteredData);

//       // Filter out entries without payment ID
//       const validData = sortedData.filter(
//         (student) => student.razorpay_payment_id
//       );

//       // Store all filtered data
//       setAllFilteredStudents(validData);
//       setTotalEntries(validData.length);

//       // Calculate total amount for ALL filtered entries
//       const calculatedTotalAmount = validData.reduce((sum, student) => {
//         const amount = parseFloat(student.amount);
//         return sum + (isNaN(amount) ? 0 : amount);
//       }, 0);
//       setTotalAmount(calculatedTotalAmount);

//       // Reset to first page
//       setCurrentPage(1);
//       setHasSearched(true);

//       if (validData.length === 0) {
//         toast.info("No records found matching the applied filters");
//       } else {
//         toast.success(
//           `Found ${
//             validData.length
//           } record(s) with total amount: ${formatCurrency(
//             calculatedTotalAmount
//           )}`
//         );
//       }
//     } catch (error) {
//       console.error("Failed to fetch student data:", error);
//       toast.error("Failed to fetch student data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updatePaginatedData = () => {
//     const startIndex = (currentPage - 1) * entriesPerPage;
//     const endIndex = startIndex + entriesPerPage;
//     const paginatedData = allFilteredStudents.slice(startIndex, endIndex);
//     setStudents(paginatedData);
//   };

//   const hasFiltersApplied = () => {
//     return (
//       Object.values(filters).some((value) => value !== "") || searchTerm !== ""
//     );
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     // Re-sort the filtered data
//     if (hasSearched && allFilteredStudents.length > 0) {
//       const sortedData = sortData([...allFilteredStudents]);
//       setAllFilteredStudents(sortedData);
//     }
//   };

//   const sortData = (data) => {
//     if (!sortConfig.key) return data;

//     return [...data].sort((a, b) => {
//       let aVal = a[sortConfig.key];
//       let bVal = b[sortConfig.key];

//       // Handle different data types
//       if (typeof aVal === "string") aVal = aVal.toLowerCase();
//       if (typeof bVal === "string") bVal = bVal.toLowerCase();

//       if (aVal < bVal) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }
//       if (aVal > bVal) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });
//   };

//   const filterData = (data) => {
//     return data.filter((student) => {
//       const searchFields = [
//         student.name,
//         student.email,
//         student.roll_number,
//         student.mobile_number,
//         student.college_name,
//         student.stream,
//         student.event_name,
//         student.subevent_name,
//         student.razorpay_payment_id,
//         student.certificate_id,
//       ].map((field) => field?.toLowerCase() || "");

//       const matchesSearch =
//         searchTerm === "" ||
//         searchFields.some((field) => field.includes(searchTerm.toLowerCase()));

//       const matchesFilters =
//         (!filters.name ||
//           student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
//         (!filters.rollNumber ||
//           student.roll_number
//             ?.toLowerCase()
//             .includes(filters.rollNumber.toLowerCase())) &&
//         (!filters.year || student.year?.toString() === filters.year) &&
//         (!filters.semester ||
//           student.semester?.toString() === filters.semester) &&
//         (!filters.college ||
//           student.college_name
//             ?.toLowerCase()
//             .includes(filters.college.toLowerCase())) &&
//         (!filters.branch ||
//           student.stream
//             ?.toLowerCase()
//             .includes(filters.branch.toLowerCase())) &&
//         (!filters.event || student.event_name === filters.event) &&
//         (!filters.subevent || student.subevent_name === filters.subevent) &&
//         (!filters.natureOfActivity ||
//           student.nature_of_activity === filters.natureOfActivity) &&
//         (!filters.attendance ||
//           student.attendance.toString() === filters.attendance) &&
//         (!filters.certificateStatus ||
//           (filters.certificateStatus === "yes"
//             ? student.certificate_id !== null &&
//               student.certificate_id !== "N/A"
//             : student.certificate_id === "N/A")) &&
//         (!filters.participationType ||
//           student.participation_type === filters.participationType);

//       return matchesSearch && matchesFilters;
//     });
//   };

//   // Calculate amount for current page display
//   const currentPageAmount = students.reduce((sum, student) => {
//     const amount = parseFloat(student.amount);
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);

//   const exportToXLSX = () => {
//     if (allFilteredStudents.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const headers = [
//       "Name",
//       "Roll Number",
//       "Email",
//       "Mobile",
//       "Year",
//       "Semester",
//       "College",
//       "Branch",
//       "Event",
//       "Sub Event",
//       "Nature of Activity",
//       "Paid/Free",
//       "Payment ID",
//       "Certificate ID",
//       "Attendance",
//       "Participation Type",
//       "Amount",
//     ];

//     // Export ALL filtered data, not just current page
//     const csvData = allFilteredStudents.map((student) => [
//       student.name,
//       student.roll_number,
//       student.email,
//       student.mobile_number,
//       student.year,
//       student.semester,
//       student.college_name,
//       student.stream,
//       student.event_name,
//       student.subevent_name,
//       student.nature_of_activity,
//       student.razorpay_payment_id,
//       student.certificate_id || "N/A",
//       student.attendance ? "Present" : "Absent",
//       student.participation_type,
//       formatCurrency(student.amount),
//     ]);

//     const totalAmountRow = [
//       "Total Amount",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       formatCurrency(totalAmount),
//     ];

//     const sheetData = [headers, ...csvData, totalAmountRow];
//     const sheetName = searchTerm
//       ? `student_data_${searchTerm}`
//       : "student_data";
//     const ws = XLSX.utils.aoa_to_sheet(sheetData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Student Data");

//     XLSX.writeFile(wb, `${sheetName}.xlsx`);
//     toast.success(
//       `Data exported successfully - ${allFilteredStudents.length} records`
//     );
//   };

//   const resetFilters = () => {
//     setFilters({
//       name: "",
//       rollNumber: "",
//       year: "",
//       semester: "",
//       college: "",
//       branch: "",
//       event: "",
//       subevent: "",
//       natureOfActivity: "",
//       attendance: "",
//       certificateStatus: "",
//       participationType: "",
//     });
//     setSearchTerm("");
//     setStudents([]);
//     setAllFilteredStudents([]);
//     setHasSearched(false);
//     setCurrentPage(1);
//     setTotalEntries(0);
//     setTotalAmount(0);
//     setSubevents([]);
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     // Data will be updated by useEffect
//   };

//   const handleEntriesPerPageChange = (newEntriesPerPage) => {
//     setEntriesPerPage(parseInt(newEntriesPerPage));
//     setCurrentPage(1);
//     // Data will be updated by useEffect
//   };

//   const totalPages = Math.ceil(totalEntries / entriesPerPage);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold flex items-center">
//           <Users className="h-6 w-6 mr-2" />
//           Student Management
//         </h1>
//         {hasSearched && (
//           <button onClick={exportToXLSX} className="btn btn-secondary">
//             <Download className="h-4 w-4 mr-2" />
//             Export to XLSX ({allFilteredStudents.length} records)
//           </button>
//         )}
//       </div>

//       {/* Disclaimer Message */}
//       {!hasSearched && !hasFiltersApplied() && (
//         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
//             <div>
//               <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
//                 Search Required
//               </h3>
//               <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
//                 Please apply at least one filter or enter a search term before
//                 searching for student records.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search and Filter Section */}
//       <div className="glass-card space-y-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search students..."
//               className="input pl-10 w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => document.getElementById("filterDrawer").showModal()}
//             className="btn btn-secondary"
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             Filters{" "}
//             {hasFiltersApplied() &&
//               Object.values(filters).filter((v) => v !== "").length > 0 && (
//                 <span className="ml-1 bg-primary  text-black text-xs rounded-full px-2 py-0.5">
//                   {Object.values(filters).filter((v) => v !== "").length}
//                 </span>
//               )}
//           </button>
//           <button
//             onClick={fetchStudents}
//             disabled={loading}
//             className="btn btn-primary"
//           >
//             {loading ? (
//               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//             ) : (
//               <Search className="h-4 w-4 mr-2" />
//             )}
//             Search
//           </button>
//           <button
//             onClick={resetFilters}
//             className="btn btn-ghost"
//             disabled={!hasFiltersApplied() && !hasSearched}
//           >
//             Reset
//           </button>
//         </div>

//         {/* Show applied filters summary */}
//         {hasFiltersApplied() && (
//           <div className="flex flex-wrap gap-2">
//             {searchTerm && (
//               <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                 Search: "{searchTerm}"
//               </span>
//             )}
//             {Object.entries(filters).map(([key, value]) => {
//               if (value) {
//                 const displayNames = {
//                   name: "Name",
//                   rollNumber: "Roll Number",
//                   year: "Year",
//                   semester: "Semester",
//                   college: "College",
//                   branch: "Branch",
//                   event: "Event",
//                   subevent: "Sub Event",
//                   natureOfActivity: "Nature of Activity",
//                   attendance: "Attendance",
//                   certificateStatus: "Certificate Status",
//                   participationType: "Participation Type",
//                 };
//                 return (
//                   <span
//                     key={key}
//                     className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
//                   >
//                     {displayNames[key]}:{" "}
//                     {value === "true"
//                       ? "Present"
//                       : value === "false"
//                       ? "Absent"
//                       : value}
//                   </span>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         )}

//         {/* Show total amount summary when data is loaded */}
//         {hasSearched && totalEntries > 0 && (
//           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <IndianRupee className="h-5 w-5 text-blue-500" />
//                 <span className="font-medium text-blue-700 dark:text-blue-300">
//                   Total Records: {totalEntries} | Total Amount:{" "}
//                   {formatCurrency(totalAmount)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Results Section */}
//       {hasSearched && (
//         <>
//           {/* Pagination Controls */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
//                 {Math.min(currentPage * entriesPerPage, totalEntries)} of{" "}
//                 {totalEntries} entries
//               </span>
//               <select
//                 value={entriesPerPage}
//                 onChange={(e) => handleEntriesPerPageChange(e.target.value)}
//                 className="input w-auto"
//               >
//                 <option value={10}>10 entries</option>
//                 <option value={25}>25 entries</option>
//                 <option value={50}>50 entries</option>
//                 <option value={100}>100 entries</option>
//               </select>
//             </div>

//             {totalPages > 1 && (
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="btn btn-ghost btn-sm"
//                 >
//                   Previous
//                 </button>

//                 {/* Page numbers */}
//                 <div className="flex space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={cn(
//                           "btn btn-sm",
//                           currentPage === pageNum ? "btn-primary" : "btn-ghost"
//                         )}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="btn btn-ghost btn-sm"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>

//           {loading ? (
//             <LoadingSpinner />
//           ) : students.length > 0 ? (
//             <div className="glass-card overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                   <thead className="bg-gray-50 dark:bg-gray-800">
//                     <tr>
//                       {[
//                         { key: "name", label: "Name" },
//                         { key: "roll_number", label: "Roll Number" },
//                         { key: "email", label: "Email" },
//                         { key: "mobile_number", label: "Mobile" },
//                         { key: "year", label: "Year" },
//                         { key: "semester", label: "Semester" },
//                         { key: "college_name", label: "College" },
//                         { key: "stream", label: "Branch" },
//                         { key: "event_name", label: "Event" },
//                         { key: "subevent_name", label: "Sub Event" },
//                         {
//                           key: "nature_of_activity",
//                           label: "Nature of Activity",
//                         },
//                         { key: "certificate_id", label: "Certificate ID" },
//                         { key: "attendance", label: "Attendance" },
//                         {
//                           key: "participation_type",
//                           label: "Participation/Merit",
//                         },
//                         { key: "razorpay_payment_id", label: "Paid/Free" },
//                         { key: "razorpay_payment_id", label: "Payment ID" },
//                         { key: "amount", label: "Amount" },
//                       ].map(({ key, label }) => (
//                         <th
//                           key={key}
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                           onClick={() => handleSort(key)}
//                         >
//                           <div className="flex items-center space-x-1">
//                             <span>{label}</span>
//                             <ArrowUpDown
//                               className={cn(
//                                 "h-4 w-4",
//                                 sortConfig.key === key
//                                   ? "text-primary"
//                                   : "text-gray-400"
//                               )}
//                             />
//                           </div>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//                     {students.map((student, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-800"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.roll_number || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.email}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.mobile_number}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.year}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.semester}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.college_name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.stream}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.event_name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.subevent_name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.nature_of_activity}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {student.certificate_id || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={cn(
//                               "px-2 py-1 text-xs rounded-full",
//                               student.attendance
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                             )}
//                           >
//                             {student.attendance ? "Present" : "Absent"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={cn(
//                               "px-2 py-1 text-xs rounded-full",
//                               student.participation_type === "Merit"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-blue-100 text-blue-800"
//                             )}
//                           >
//                             {student.participation_type}{" "}
//                             {student.participation_type === "Merit" &&
//                               student.rank &&
//                               ` - Rank ${student.rank}`}
//                           </span>
//                         </td>
//                         <td className="px-4 py-2 text-sm">
//                           {student.razorpay_payment_id &&
//                           student.razorpay_payment_id !== "N/A" ? (
//                             <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
//                               Paid
//                             </span>
//                           ) : (
//                             <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
//                               Free
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-2 text-sm">
//                           {student.razorpay_payment_id &&
//                           student.razorpay_payment_id !== "N/A" ? (
//                             <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
//                               {student.razorpay_payment_id}
//                             </span>
//                           ) : (
//                             <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
//                               Free
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap font-medium">
//                           {formatCurrency(student.amount)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-gray-50 dark:bg-gray-800">
//                     <tr>
//                       <td
//                         colSpan="15"
//                         className="px-6 py-4 text-right font-bold"
//                       >
//                         Current Page Total: {formatCurrency(currentPageAmount)}{" "}
//                         | All Entries Total: {formatCurrency(totalAmount)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap font-bold text-primary">
//                         <div className="flex items-center space-x-1">
//                           <span>{formatCurrency(totalAmount)}</span>
//                         </div>
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             <div className="glass-card text-center py-12">
//               <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                 No Records Found
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 No student records found matching your search criteria. Try
//                 adjusting your filters.
//               </p>
//             </div>
//           )}
//         </>
//       )}

//       {/* Filter Modal */}
//       <dialog id="filterDrawer" className="modal">
//         <div className="modal-box max-w-4xl p-6 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-lg bg-white/20">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6 border-b border-white/40 pb-3">
//             <h3 className="font-bold text-xl text-black">Filter Options</h3>
//             <button
//               className="p-2 rounded-full hover:bg-red-500/30 transition-colors"
//               onClick={() => document.getElementById("filterDrawer").close()}
//             >
//               <X className="h-5 w-5 text-red-500" />
//             </button>
//           </div>

//           {/* Form Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Student Name */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Student Name
//               </label>
//               <input
//                 type="text"
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.name}
//                 onChange={(e) =>
//                   setFilters({ ...filters, name: e.target.value })
//                 }
//                 placeholder="Filter by student name"
//               />
//             </div>

//             {/* Roll Number */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Roll Number
//               </label>
//               <input
//                 type="text"
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.rollNumber}
//                 onChange={(e) =>
//                   setFilters({ ...filters, rollNumber: e.target.value })
//                 }
//                 placeholder="Filter by roll number"
//               />
//             </div>

//             {/* Event */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Event
//               </label>
//               <select
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.event}
//                 onChange={(e) =>
//                   setFilters({
//                     ...filters,
//                     event: e.target.value,
//                     subevent: "",
//                   })
//                 }
//               >
//                 <option value="">All</option>
//                 {events.map((event) => (
//                   <option key={event.id} value={event.event_name}>
//                     {event.event_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Semester */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Semester
//               </label>
//               <select
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.semester}
//                 onChange={(e) =>
//                   setFilters({ ...filters, semester: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 {[1, 2].map((sem) => (
//                   <option key={sem} value={sem}>
//                     {sem}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* College */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 College
//               </label>
//               <input
//                 type="text"
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.college}
//                 onChange={(e) =>
//                   setFilters({ ...filters, college: e.target.value })
//                 }
//                 placeholder="Filter by college name"
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Branch
//               </label>
//               <input
//                 type="text"
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.branch}
//                 onChange={(e) =>
//                   setFilters({ ...filters, branch: e.target.value })
//                 }
//                 placeholder="Filter by branch"
//               />
//             </div>

//             {/* Nature of Activity */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Nature of Activity
//               </label>
//               <select
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.natureOfActivity}
//                 onChange={(e) =>
//                   setFilters({ ...filters, natureOfActivity: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 {NATURE_OF_ACTIVITIES.map((activity) => (
//                   <option key={activity} value={activity}>
//                     {activity}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Attendance */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Attendance
//               </label>
//               <select
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.attendance}
//                 onChange={(e) =>
//                   setFilters({ ...filters, attendance: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="true">Present</option>
//                 <option value="false">Absent</option>
//               </select>
//             </div>

//             {/* Certificate Status */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Certificate Status
//               </label>
//               <select
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.certificateStatus}
//                 onChange={(e) =>
//                   setFilters({ ...filters, certificateStatus: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="yes">Has Certificate</option>
//                 <option value="no">No Certificate</option>
//               </select>
//             </div>

//             {/* Participation Type */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-black/80">
//                 Participation Type
//               </label>
//               <select
//                 className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
//                 value={filters.participationType}
//                 onChange={(e) =>
//                   setFilters({ ...filters, participationType: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="Merit">Merit</option>
//                 <option value="Participation">Participation</option>
//               </select>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="modal-action mt-8 flex justify-end gap-4">
//             <button
//               onClick={() => {
//                 resetFilters();
//                 document.getElementById("filterDrawer").close();
//               }}
//               className="px-5 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-black transition-all"
//             >
//               Reset All Filters
//             </button>
//             <button
//               className="px-5 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-black transition-all"
//               onClick={() => {
//                 fetchStudents();
//                 document.getElementById("filterDrawer").close();
//               }}
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Users,
  IndianRupee,
  RefreshCw,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import api from "../../../lib/api";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { cn } from "../../../lib/utils";
import toast from "react-hot-toast";
import { formatCurrency } from "../../../lib/utils";
import * as XLSX from "xlsx";

const NATURE_OF_ACTIVITIES = [
  "CEA/NSS/National Initiatives (OLD)",
  "Sports & Games",
  "Cultural Activities",
  "Women's forum activities",
  "Hobby clubs Activities",
  "Professional society Activities",
  "Dept. Students Association Activities",
  "Technical Club Activities",
  "Innovation and Incubation Cell Activities",
  "Professional Self Initiatives",
  "Others",
];

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [allFilteredStudents, setAllFilteredStudents] = useState([]); // Store all filtered data
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [subevents, setSubevents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0); // Store total amount of all entries
  const [filters, setFilters] = useState({
    name: "",
    rollNumber: "",
    year: "",
    semester: "",
    college: "",
    branch: "",
    event: "",
    subevent: "",
    natureOfActivity: "",
    attendance: "",
    certificateStatus: "",
    participationType: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (filters.event) {
      fetchSubevents(filters.event);
    }
  }, [filters.event]);

  // Update pagination when page or entries per page changes
  useEffect(() => {
    if (hasSearched && allFilteredStudents.length > 0) {
      updatePaginatedData();
    }
  }, [currentPage, entriesPerPage, allFilteredStudents]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.rows || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchSubevents = async (eventName) => {
    try {
      const event = events.find((e) => e.event_name === eventName);
      if (!event) return;

      const response = await api.get(`/subevents/${event.id}`);
      setSubevents(response.data.subevents || []);
    } catch (error) {
      console.error("Failed to fetch subevents:", error);
      toast.error("Failed to fetch subevents");
    }
  };

  const fetchStudents = async () => {
    // Check if at least one filter is applied
    if (!hasFiltersApplied()) {
      toast.error("Please apply at least one filter before searching");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/admin/students");
      const allStudents = response.data;

      // Apply filters
      const filteredData = filterData(allStudents);

      // Apply sorting
      const sortedData = sortData(filteredData);

      // Filter out entries without payment ID
      const validData = sortedData.filter(
        (student) => student.razorpay_payment_id
      );

      // Store all filtered data
      setAllFilteredStudents(validData);
      setTotalEntries(validData.length);

      // Calculate total amount for ALL filtered entries
      const calculatedTotalAmount = validData.reduce((sum, student) => {
        const amount = parseFloat(student.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      setTotalAmount(calculatedTotalAmount);

      // Reset to first page
      setCurrentPage(1);
      setHasSearched(true);

      if (validData.length === 0) {
        toast.info("No records found matching the applied filters");
      } else {
        toast.success(
          `Found ${
            validData.length
          } record(s) with total amount: ${formatCurrency(
            calculatedTotalAmount
          )}`
        );
      }
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const updatePaginatedData = () => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedData = allFilteredStudents.slice(startIndex, endIndex);
    setStudents(paginatedData);
  };

  const hasFiltersApplied = () => {
    return (
      Object.values(filters).some((value) => value !== "") || searchTerm !== ""
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Re-sort the filtered data
    if (hasSearched && allFilteredStudents.length > 0) {
      const sortedData = sortData([...allFilteredStudents]);
      setAllFilteredStudents(sortedData);
    }
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle different data types
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filterData = (data) => {
    return data.filter((student) => {
      const searchFields = [
        student.name,
        student.email,
        student.roll_number,
        student.mobile_number,
        student.college_name,
        student.stream,
        student.event_name,
        student.subevent_name,
        student.razorpay_payment_id,
        student.certificate_id,
      ].map((field) => field?.toLowerCase() || "");

      const matchesSearch =
        searchTerm === "" ||
        searchFields.some((field) => field.includes(searchTerm.toLowerCase()));

      const matchesFilters =
        (!filters.name ||
          student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.rollNumber ||
          student.roll_number
            ?.toLowerCase()
            .includes(filters.rollNumber.toLowerCase())) &&
        (!filters.year || student.year?.toString() === filters.year) &&
        (!filters.semester ||
          student.semester?.toString() === filters.semester) &&
        (!filters.college ||
          student.college_name
            ?.toLowerCase()
            .includes(filters.college.toLowerCase())) &&
        (!filters.branch ||
          student.stream
            ?.toLowerCase()
            .includes(filters.branch.toLowerCase())) &&
        (!filters.event || student.event_name === filters.event) &&
        (!filters.subevent || student.subevent_name === filters.subevent) &&
        (!filters.natureOfActivity ||
          student.nature_of_activity === filters.natureOfActivity) &&
        (!filters.attendance ||
          student.attendance.toString() === filters.attendance) &&
        (!filters.certificateStatus ||
          (filters.certificateStatus === "yes"
            ? student.certificate_id !== null &&
              student.certificate_id !== "N/A"
            : student.certificate_id === "N/A")) &&
        (!filters.participationType ||
          student.participation_type === filters.participationType);

      return matchesSearch && matchesFilters;
    });
  };

  // Calculate amount for current page display
  const currentPageAmount = students.reduce((sum, student) => {
    const amount = parseFloat(student.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const exportToXLSX = () => {
    if (allFilteredStudents.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Name",
      "Roll Number",
      "Email",
      "Mobile",
      "Year",
      "Semester",
      "College",
      "Branch",
      "Event",
      "Sub Event",
      "Nature of Activity",
      "Paid/Free",
      "Payment ID",
      "Certificate ID",
      "Attendance",
      "Participation Type",
      "Amount",
    ];

    // Export ALL filtered data, not just current page
    const csvData = allFilteredStudents.map((student) => [
      student.name,
      student.roll_number,
      student.email,
      student.mobile_number,
      student.year,
      student.semester,
      student.college_name,
      student.stream,
      student.event_name,
      student.subevent_name,
      student.nature_of_activity,
      student.razorpay_payment_id,
      student.certificate_id || "N/A",
      student.attendance ? "Present" : "Absent",
      student.participation_type,
      formatCurrency(student.amount),
    ]);

    const totalAmountRow = [
      "Total Amount",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      formatCurrency(totalAmount),
    ];

    const sheetData = [headers, ...csvData, totalAmountRow];
    const sheetName = searchTerm
      ? `student_data_${searchTerm}`
      : "student_data";
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Data");

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
    toast.success(
      `Data exported successfully - ${allFilteredStudents.length} records`
    );
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      rollNumber: "",
      year: "",
      semester: "",
      college: "",
      branch: "",
      event: "",
      subevent: "",
      natureOfActivity: "",
      attendance: "",
      certificateStatus: "",
      participationType: "",
    });
    setSearchTerm("");
    setStudents([]);
    setAllFilteredStudents([]);
    setHasSearched(false);
    setCurrentPage(1);
    setTotalEntries(0);
    setTotalAmount(0);
    setSubevents([]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Data will be updated by useEffect
  };

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(parseInt(newEntriesPerPage));
    setCurrentPage(1);
    // Data will be updated by useEffect
  };

  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-fade-in">
          <div className="group">
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center transform transition-all duration-500 hover:scale-105">
              <Users className="h-8 w-8 lg:h-10 lg:w-10 mr-3 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              Student Management
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
          
          {hasSearched && (
            <button 
              onClick={exportToXLSX} 
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Download className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">Export to XLSX</span>
                <span className="sm:hidden">Export</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {allFilteredStudents.length}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Disclaimer Message */}
        {!hasSearched && !hasFiltersApplied() && (
          <div className="group relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-8 border-gradient-to-b from-amber-400 to-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-start space-x-4">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200 mb-2">
                  🔍 Search Required
                </h3>
                <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                  To get started, please apply at least one filter or enter a search term. This helps us provide you with the most relevant student records efficiently.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1 group/search">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/search:text-blue-500 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search students by name, email, roll number..."
                  className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm lg:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById("filterDrawer").showModal()}
                  className="relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 group/filter"
                >
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 group-hover/filter:rotate-12 transition-transform duration-300" />
                    <span className="hidden sm:inline">Filters</span>
                    {hasFiltersApplied() && Object.values(filters).filter((v) => v !== "").length > 0 && (
                      <span className="animate-pulse bg-yellow-400 text-yellow-900 text-xs rounded-full px-2 py-1 font-bold">
                        {Object.values(filters).filter((v) => v !== "").length}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={fetchStudents}
                  disabled={loading}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:transform-none group/search-btn"
                >
                  <div className="flex items-center space-x-2">
                    {loading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 group-hover/search-btn:scale-110 transition-transform duration-300" />
                    )}
                    <span>Search</span>
                  </div>
                </button>

                <button
                  onClick={resetFilters}
                  disabled={!hasFiltersApplied() && !hasSearched}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Applied Filters Display */}
            {hasFiltersApplied() && (
              <div className="flex flex-wrap gap-3 animate-fade-in">
                {searchTerm && (
                  <span className="inline-flex items-center bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-800 dark:text-blue-200 text-sm px-4 py-2 rounded-full font-medium border border-blue-200 dark:border-blue-700 animate-scale-in">
                    🔍 Search: "{searchTerm}"
                  </span>
                )}
                {Object.entries(filters).map(([key, value]) => {
                  if (value) {
                    const displayNames = {
                      name: "👤 Name",
                      rollNumber: "🎫 Roll Number",
                      year: "📅 Year",
                      semester: "📚 Semester",
                      college: "🏫 College",
                      branch: "🔬 Branch",
                      event: "🎯 Event",
                      subevent: "🎪 Sub Event",
                      natureOfActivity: "🌟 Activity",
                      attendance: "✅ Attendance",
                      certificateStatus: "🏆 Certificate",
                      participationType: "🏅 Participation",
                    };
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 text-sm px-4 py-2 rounded-full font-medium border border-gray-200 dark:border-gray-600 animate-scale-in hover:scale-105 transition-transform duration-200"
                      >
                        {displayNames[key]}: {value === "true" ? "Present" : value === "false" ? "Absent" : value}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Total Amount Summary */}
            {hasSearched && totalEntries > 0 && (
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 shadow-lg animate-slide-up group/summary">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover/summary:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg">
                      <IndianRupee className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                        {totalEntries} Records Found
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        Total Revenue Generated
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {formatCurrency(totalAmount)}
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      Across all records
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6 animate-slide-up">
            {/* Pagination Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600">
                  📊 Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                  {Math.min(currentPage * entriesPerPage, totalEntries)} of{" "}
                  {totalEntries} entries
                </span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => handleEntriesPerPageChange(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value={10}>10 entries</option>
                  <option value={25}>25 entries</option>
                  <option value={50}>50 entries</option>
                  <option value={100}>100 entries</option>
                </select>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-semibold transition-all duration-200 transform hover:scale-110",
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : students.length > 0 ? (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                        {[
                          { key: "name", label: "👤 Name" },
                          { key: "roll_number", label: "🎫 Roll Number" },
                          { key: "email", label: "📧 Email" },
                          { key: "mobile_number", label: "📱 Mobile" },
                          { key: "year", label: "📅 Year" },
                          { key: "semester", label: "📚 Semester" },
                          { key: "college_name", label: "🏫 College" },
                          { key: "stream", label: "🔬 Branch" },
                          { key: "event_name", label: "🎯 Event" },
                          { key: "subevent_name", label: "🎪 Sub Event" },
                          { key: "nature_of_activity", label: "🌟 Activity" },
                          { key: "certificate_id", label: "🏆 Certificate" },
                          { key: "attendance", label: "✅ Attendance" },
                          { key: "participation_type", label: "🏅 Participation" },
                          { key: "razorpay_payment_id", label: "💳 Payment Status" },
                          { key: "razorpay_payment_id", label: "🆔 Payment ID" },
                          { key: "amount", label: "💰 Amount" },
                        ].map(({ key, label }) => (
                          <th
                            key={key}
                            className="group px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                            onClick={() => handleSort(key)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {label}
                              </span>
                              <ArrowUpDown
                                className={cn(
                                  "h-4 w-4 transition-all duration-300",
                                  sortConfig.key === key
                                    ? "text-blue-600 dark:text-blue-400 scale-110"
                                    : "text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                                )}
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {students.map((student, index) => (
                        <tr
                          key={index}
                          className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg"
                        >
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {student.name}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                              {student.roll_number || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-gray-700 dark:text-gray-300 text-sm">
                              {student.email}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                              {student.mobile_number}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-bold">
                              {student.year}
                            </span>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span className="inline-flex items-center bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-bold">
                              {student.semester}
                            </span>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-gray-700 dark:text-gray-300 text-sm max-w-32 truncate" title={student.college_name}>
                              {student.college_name}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span className="inline-flex items-center bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm font-medium">
                              {student.stream}
                            </span>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-gray-700 dark:text-gray-300 text-sm font-medium max-w-32 truncate" title={student.event_name}>
                              {student.event_name}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-gray-700 dark:text-gray-300 text-sm max-w-32 truncate" title={student.subevent_name}>
                              {student.subevent_name}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-gray-700 dark:text-gray-300 text-sm max-w-36 truncate" title={student.nature_of_activity}>
                              {student.nature_of_activity}
                            </div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span className="inline-flex items-center bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/50 dark:to-yellow-900/50 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                              {student.certificate_id || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span
                              className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold animate-pulse",
                                student.attendance
                                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-200"
                                  : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/50 dark:to-pink-900/50 dark:text-red-200"
                              )}
                            >
                              {student.attendance ? "✅ Present" : "❌ Absent"}
                            </span>
                          </td>
                          <td className="px-1 py-4 border-r border-gray-200 dark:border-gray-700">
                            <span
                              className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold",
                                student.participation_type === "Merit"
                                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 dark:from-yellow-900/50 dark:to-amber-900/50 dark:text-yellow-200"
                                  : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-200"
                              )}
                            >
                              {student.participation_type === "Merit" ? "🏆" : "🎖️"} {student.participation_type}
                              {student.participation_type === "Merit" && student.rank && (
                                <span className="ml-2 bg-white/80 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-black">
                                  #{student.rank}
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-2 py-4 border-r border-gray-200 dark:border-gray-700">
                            {student.razorpay_payment_id && student.razorpay_payment_id !== "N/A" ? (
                              <span className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full font-bold shadow-lg">
                                💳 Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 px-4 py-2 rounded-full font-bold shadow-lg">
                                🆓 Free
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                            {student.razorpay_payment_id && student.razorpay_payment_id !== "N/A" ? (
                              <span className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-mono break-all max-w-32 truncate" title={student.razorpay_payment_id}>
                                {student.razorpay_payment_id}
                              </span>
                            ) : (
                              <span className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
                                N/A
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-right">
                              <span className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full font-black text-lg shadow-lg">
                                {formatCurrency(student.amount)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-t-2 border-emerald-200 dark:border-emerald-800">
                        <td
                          colSpan="16"
                          className="px-4 py-6 text-right"
                        >
                          <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
                            <div className="text-right">
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                Current Page Total
                              </p>
                              <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                                {formatCurrency(currentPageAmount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                All Entries Total
                              </p>
                              <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                {formatCurrency(totalAmount)}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-12 text-center shadow-2xl">
                <div className="animate-bounce">
                  <Users className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  🔍 No Records Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                  No student records found matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Filter Modal */}
        <dialog id="filterDrawer" className="modal backdrop-blur-sm">
          <div className="modal-box max-w-6xl p-0 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 overflow-hidden">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-6">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <h3 className="font-black text-2xl text-white flex items-center">
                    <Filter className="h-7 w-7 mr-3" />
                    Advanced Filters
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Refine your search with multiple filter options
                  </p>
                </div>
                <button
                  className="p-3 rounded-full bg-white/20 hover:bg-red-500/80 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                  onClick={() => document.getElementById("filterDrawer").close()}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Student Name */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    👤 <span className="ml-2">Student Name</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    placeholder="Enter student name..."
                  />
                </div>

                {/* Roll Number */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🎫 <span className="ml-2">Roll Number</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.rollNumber}
                    onChange={(e) => setFilters({ ...filters, rollNumber: e.target.value })}
                    placeholder="Enter roll number..."
                  />
                </div>

                {/* Event */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🎯 <span className="ml-2">Event</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.event}
                    onChange={(e) => setFilters({ ...filters, event: e.target.value, subevent: "" })}
                  >
                    <option value="">🔍 Select Event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.event_name}>
                        {event.event_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    📅 <span className="ml-2">Year</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  >
                    <option value="">🔍 Select Year</option>
                    {[1, 2, 3, 4].map((year) => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    📚 <span className="ml-2">Semester</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                  >
                    <option value="">🔍 Select Semester</option>
                    {[1, 2].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* College */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🏫 <span className="ml-2">College</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.college}
                    onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                    placeholder="Enter college name..."
                  />
                </div>

                {/* Branch */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🔬 <span className="ml-2">Branch</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.branch}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                    placeholder="Enter branch..."
                  />
                </div>

                {/* Nature of Activity */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🌟 <span className="ml-2">Nature of Activity</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.natureOfActivity}
                    onChange={(e) => setFilters({ ...filters, natureOfActivity: e.target.value })}
                  >
                    <option value="">🔍 Select Activity</option>
                    {NATURE_OF_ACTIVITIES.map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attendance */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    ✅ <span className="ml-2">Attendance</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.attendance}
                    onChange={(e) => setFilters({ ...filters, attendance: e.target.value })}
                  >
                    <option value="">🔍 Select Status</option>
                    <option value="true">✅ Present</option>
                    <option value="false">❌ Absent</option>
                  </select>
                </div>

                {/* Certificate Status */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🏆 <span className="ml-2">Certificate Status</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.certificateStatus}
                    onChange={(e) => setFilters({ ...filters, certificateStatus: e.target.value })}
                  >
                    <option value="">🔍 Select Status</option>
                    <option value="yes">🏆 Has Certificate</option>
                    <option value="no">❌ No Certificate</option>
                  </select>
                </div>

                {/* Participation Type */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
                    🏅 <span className="ml-2">Participation Type</span>
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none px-4 py-3 transition-all duration-300 group-hover:shadow-lg"
                    value={filters.participationType}
                    onChange={(e) => setFilters({ ...filters, participationType: e.target.value })}
                  >
                    <option value="">🔍 Select Type</option>
                    <option value="Merit">🏆 Merit</option>
                    <option value="Participation">🎖️ Participation</option>
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    resetFilters();
                    document.getElementById("filterDrawer").close();
                  }}
                  className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <X className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Reset All Filters</span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    fetchStudents();
                    document.getElementById("filterDrawer").close();
                  }}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <Filter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Apply Filters</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        /* Glass morphism effect */
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Dark mode glass effect */
        .dark .glass-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Custom scrollbar */
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
        }

        /* Modal backdrop */
        .modal {
          backdrop-filter: blur(8px);
        }

        /* Responsive table improvements */
        @media (max-width: 768px) {
          .table-container {
            font-size: 0.875rem;
          }
          
          .table-container th,
          .table-container td {
            padding: 0.5rem;
          }
        }

        /* Loading animation enhancement */
        .loading-spinner {
          background: conic-gradient(from 0deg, transparent, #3b82f6, transparent);
        }

        /* Hover effects for table rows */
        .table-row:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Button pulse effect */
        .btn-pulse:hover {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        /* Gradient text animation */
        .gradient-text {
          background: linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
          background-size: 800% 800%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-animation 4s ease infinite;
        }

        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Enhanced focus states */
        .focus-enhanced:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          border-color: #3b82f6;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .modal-box {
            margin: 1rem;
            max-width: calc(100vw - 2rem);
          }
        }
      `}</style>
    </div>
  );
}
