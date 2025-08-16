import React, { useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { Search, Check, X, Users } from 'lucide-react';
import { useAttendance } from '../../../../lib/hooks/useAttendance';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import EmptyState from '../../../shared/EmptyState';
import toast from 'react-hot-toast';

export default function AttendanceManager() {
  const { eventId, subEventId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    registrations, 
    loading, 
    bulkUpdating,
    toggleAttendance, 
    markBulkAttendance,
    refreshRegistrations 
  } = useAttendance(parseInt(eventId), parseInt(subEventId));

  if (loading) return <LoadingSpinner />;

  if (!registrations?.length) {
    return (
      <EmptyState
        icon={Users}
        title="No Registrations Found"
        message="There are no registrations for this event yet."
      />
    );
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalParticipants = registrations.length;
  const presentCount = registrations.filter(reg => reg.attendance).length;

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Premium Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-10 blur-3xl transform -skew-y-1"></div>
          <div className="relative backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 shadow-2xl p-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Attendance Manager
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Track and manage participant attendance
              </p>
            </div>
          </div>
        </div>

        {/* Stats and Actions Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          
          {/* Enhanced Stats Card */}
          <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl p-6 w-full xl:w-auto transition-all duration-500">
            
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Orb */}
            <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center space-x-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex space-x-8">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Participants</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    {totalParticipants}
                  </p>
                </div>
                
                <div className="h-16 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Present</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {presentCount}
                  </p>
                </div>
                
                <div className="h-16 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {totalParticipants > 0 ? Math.round((presentCount / totalParticipants) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <button
              onClick={() => markBulkAttendance(true)}
              disabled={bulkUpdating}
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <Check className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" />
                <span>Mark All Present</span>
              </div>
            </button>
            
            <button
              onClick={() => markBulkAttendance(false)}
              disabled={bulkUpdating}
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <X className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" />
                <span>Mark All Absent</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 p-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full px-6 py-4 pl-14 bg-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Search className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Table Section */}
        <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
          
          {/* Table Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 overflow-x-auto">
            <table className="min-w-full">
              
              {/* Enhanced Table Header */}
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              {/* Enhanced Table Body */}
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {filteredRegistrations.map((registration, index) => (
                  <tr 
                    key={registration.id} 
                    className="group/row hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 transition-all duration-300"
                    style={{
                      animation: `fadeInUp 0.5s ease-out forwards ${index * 50}ms`
                    }}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {registration.student_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-lg font-semibold text-slate-800 dark:text-white">
                          {registration.student_name}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {registration.student_email}
                      </span>
                    </td>
                    
                    <td className="px-8 py-6 whitespace-nowrap">
                      {registration.attendance ? (
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-700/50">
                          <Check className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-800 dark:text-emerald-300 font-semibold">Present</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200/50 dark:border-red-700/50">
                          <X className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                          <span className="text-red-800 dark:text-red-300 font-semibold">Absent</span>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-8 py-6 whitespace-nowrap">
                      <button
                        onClick={() => toggleAttendance(registration.id, registration.attendance)}
                        className={`group/btn relative overflow-hidden px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 ${
                          registration.attendance 
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative">
                          {registration.attendance ? 'Mark Absent' : 'Mark Present'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}