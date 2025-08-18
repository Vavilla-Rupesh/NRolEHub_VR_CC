import React, { useState } from 'react';
import {
  Search,
  Download,
  FileText,
  User,
  Mail,
  Calendar,
  Award,
  Building,
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../shared/LoadingSpinner';
import { cn } from '../../lib/utils';

export default function CertificateVerification() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination states
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a roll number or certificate ID');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      setCurrentPage(1); // reset to first page on new search

      const response = await api.get('/public/students');
      const allStudents = response.data;

      const filteredResults = allStudents.filter((student) =>
        student.certificate_id !== null && student.certificate_id !== 'N/A' &&
        (student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setSearchResults(filteredResults);

      if (filteredResults.length === 0) {
        toast.info('No records found for the given search term');
      } else {
        toast.success(`Found ${filteredResults.length} record(s)`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search records');
    } finally {
      setLoading(false);
    }
  };

  const exportToXLSX = () => {
    if (searchResults.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Name',
      'Roll Number',
      'Email',
      'Mobile',
      'Year',
      'Semester',
      'College',
      'Branch',
      'Event',
      'Sub Event',
      'Nature of Activity',
      'Certificate ID',
      'Attendance',
      'Participation Type',
      'Registration Date',
    ];

    const csvData = searchResults.map((student) => [
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
      student.certificate_id || 'N/A',
      student.attendance ? 'Present' : 'Absent',
      student.participation_type,
      formatDate(student.registration_date),
    ]);

    const sheetData = [headers, ...csvData];
    const sheetName = searchTerm ? `verification_${searchTerm}` : 'verification_data';
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Verification Data');

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
    toast.success('Data exported successfully');
  };

  // Pagination calculations
  const totalPages = Math.ceil(searchResults.length / entriesPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Group students by roll_number or email from paginatedResults
  const getStudentGroups = () => {
    return paginatedResults.reduce((acc, record) => {
      const key = record.roll_number || record.email;
      if (!acc[key]) {
        acc[key] = {
          student: {
            name: record.name,
            roll_number: record.roll_number,
            email: record.email,
            mobile_number: record.mobile_number,
            year: record.year,
            semester: record.semester,
            college_name: record.college_name,
            stream: record.stream,
          },
          events: [],
        };
      }
      acc[key].events.push(record);
      return acc;
    }, {});
  };

  const studentGroups = getStudentGroups();

  // Pagination Controls Component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <label htmlFor="entries" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Show:
        </label>
        <select
          id="entries"
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 transition-all duration-300 hover:border-violet-300"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} entries
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 hover:scale-105"
        >
          Previous
        </button>

        {[...Array(totalPages).keys()]
          .slice(
            Math.max(0, currentPage - 2),
            Math.min(totalPages, currentPage + 3)
          )
          .map((pageIndex) => {
            const pageNum = pageIndex + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  pageNum === currentPage
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 border-2 border-violet-500'
                    : 'border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 hover:scale-105"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-violet-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Enhanced Header */}
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative p-6 bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-violet-100 dark:border-violet-800 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <FileText className="h-16 w-16 dark:text-purple-700 text-blue-500 bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text" style={{WebkitBackgroundClip: 'text'}} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Certificate Verification
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-purple-600 mx-auto rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Instantly verify student certificates and explore comprehensive participation records with our advanced search system
              </p>
            </div>
          </div>

          {/* Enhanced Search Form */}
          <div className="max-w-3xl mx-auto animate-fade-in-up delay-200">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-violet-100 dark:border-violet-800/50 p-8">
                <form onSubmit={handleSearch} className="space-y-8">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                      <Search className="h-6 w-6 text-violet-500 group-focus-within:text-violet-600 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter roll number or certificate ID..."
                      className="w-full pl-16 pr-6 py-6 text-lg md:text-xl rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-800/50 transition-all duration-300 hover:border-violet-300 hover:shadow-lg placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      required
                      aria-label="Search by roll number or certificate ID"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative py-6 px-8 rounded-2xl font-bold text-lg md:text-xl text-white bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                          <span>Searching Records...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <Search className="h-6 w-6 group-hover:animate-pulse" />
                          <span>Search Records</span>
                        </div>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Enhanced Search Results */}
          {hasSearched && (
            <div className="space-y-8 animate-fade-in-up delay-400">
              {searchResults.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center p-6 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Search Results
                    </h2>
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                      Found {searchResults.length} matching record{searchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={exportToXLSX}
                    className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-emerald-500/25"
                  >
                    <Download className="h-5 w-5 group-hover:animate-bounce" />
                    Export to Excel
                  </button>
                </div>
              )}

              {searchResults.length > 0 ? (
                <>
                  <PaginationControls />

                  <div className="space-y-12">
                    {Object.values(studentGroups).map((group, groupIndex) => (
                      <div 
                        key={groupIndex} 
                        className="relative group animate-fade-in-up"
                        style={{animationDelay: `${groupIndex * 100}ms`}}
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-violet-100 dark:border-violet-800/50 overflow-hidden">
                          
                          {/* Enhanced Student Details Card */}
                          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-8">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <User className="h-7 w-7 text-white" />
                              </div>
                              <h3 className="text-2xl md:text-3xl font-bold text-white">
                                Student Information
                              </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                              <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                  <div className="text-white/80 text-sm font-medium mb-1">Full Name</div>
                                  <div className="text-white text-lg font-bold">{group.student.name}</div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                  <div className="text-white/80 text-sm font-medium mb-1">Roll Number</div>
                                  <div className="text-white text-lg font-bold font-mono">{group.student.roll_number}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Mail className="h-4 w-4 text-white/80" />
                                    <div className="text-white/80 text-sm font-medium">Email</div>
                                  </div>
                                  <div className="text-white text-lg font-bold break-all">{group.student.email}</div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                  <div className="text-white/80 text-sm font-medium mb-1">Mobile</div>
                                  <div className="text-white text-lg font-bold font-mono">{group.student.mobile_number}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                  <div className="text-white/80 text-sm font-medium mb-2">Academic Details</div>
                                  <div className="space-y-1">
                                    <div className="text-white font-bold">Year {group.student.year} • Semester {group.student.semester}</div>
                                    <div className="text-white/90 text-sm">{group.student.stream}</div>
                                  </div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Building className="h-4 w-4 text-white/80" />
                                    <div className="text-white/80 text-sm font-medium">Institution</div>
                                  </div>
                                  <div className="text-white font-bold text-sm leading-tight">{group.student.college_name}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Events Table */}
                          <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl">
                                <Award className="h-6 w-6 text-violet-600" />
                              </div>
                              <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                Event Participation History
                              </h4>
                            </div>
                            
                            <div className="overflow-x-auto rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Event</th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Sub Event</th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider hidden md:table-cell">Activity</th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider hidden lg:table-cell">Date</th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Certificate</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {group.events.map((event, eventIndex) => (
                                    <tr
                                      key={eventIndex}
                                      className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/10 dark:hover:to-purple-900/10 transition-all duration-300 group"
                                    >
                                      <td className="px-4 md:px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300">
                                          {event.event_name}
                                        </div>
                                      </td>
                                      <td className="px-4 md:px-6 py-4">
                                        <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">{event.subevent_name}</div>
                                      </td>
                                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">{event.nature_of_activity}</div>
                                      </td>
                                      <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-violet-500" />
                                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {formatDate(event.registration_date)}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 md:px-6 py-4">
                                        <div className="space-y-2">
                                          <span
                                            className={cn(
                                              'inline-flex px-3 py-1 text-xs font-bold rounded-full',
                                              event.attendance
                                                ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                                                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300 border border-red-200 dark:border-red-700'
                                            )}
                                          >
                                            {event.attendance ? '✓ Present' : '✗ Absent'}
                                          </span>
                                          <span
                                            className={cn(
                                              'inline-flex px-3 py-1 text-xs font-bold rounded-full ml-0 lg:ml-2',
                                              event.participation_type === 'Merit'
                                                ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                                                : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                            )}
                                          >
                                            {event.participation_type === 'Merit' ? '🏆 Merit' : '📋 Participation'}
                                            {event.participation_type === 'Merit' && event.rank && ` • Rank ${event.rank}`}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 md:px-6 py-4">
                                        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Certificate ID</div>
                                          <div className="font-mono text-xs md:text-sm font-bold text-gray-900 dark:text-white break-all">
                                            {event.certificate_id || '⏳ Pending'}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <PaginationControls />
                </>
              ) : (
                <div className="text-center py-16 animate-fade-in-up">
                  <div className="relative group max-w-md mx-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative p-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border-2 border-orange-200 dark:border-orange-800/50 shadow-2xl">
                      <div className="mb-6">
                        <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl inline-block">
                          <FileText className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        No Records Found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        No student records found for "<span className="font-bold text-orange-600 dark:text-orange-400">{searchTerm}</span>". 
                        <br />Please verify the roll number or certificate ID and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Information Section */}
          <div className="max-w-4xl mx-auto animate-fade-in-up delay-600">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-teal-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-blue-800/50 p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      How to Verify Certificates
                    </h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-600 text-white rounded-xl text-lg font-bold min-w-[2.5rem] text-center">1</div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Enter Search Details</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Input the student's roll number or certificate ID in the search field above.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-2xl border border-cyan-200/50 dark:border-cyan-700/50">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-cyan-600 text-white rounded-xl text-lg font-bold min-w-[2.5rem] text-center">2</div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">View Results</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Browse through comprehensive student records and event participation history.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl border border-teal-200/50 dark:border-teal-700/50">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-teal-600 text-white rounded-xl text-lg font-bold min-w-[2.5rem] text-center">3</div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Export Data</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Download all matching records as an Excel file for offline analysis.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-600 text-white rounded-xl text-lg font-bold min-w-[2.5rem] text-center">4</div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Verify Authenticity</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Cross-reference certificate IDs and participation details for verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-violet-200/50 dark:border-violet-700/50">
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      If you encounter any issues or need assistance with certificate verification, please contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
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
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-600 {
          animation-delay: 600ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
