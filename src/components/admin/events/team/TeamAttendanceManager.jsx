import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Users, Check, X } from "lucide-react";
import { useTeamAttendance } from "../../../../lib/hooks/useTeamAttendance";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import EmptyState from "../../../shared/EmptyState";
import { cn } from "../../../../lib/utils";

export default function TeamAttendanceManager() {
  const { eventId, subEventId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { teams, loading, markTeamAttendance } = useTeamAttendance(
    parseInt(eventId),
    parseInt(subEventId)
  );

  if (loading) return <LoadingSpinner />;

  if (!teams?.length) {
    return (
      <EmptyState
        icon={Users}
        title="No Teams Found"
        message="There are no teams registered for this event yet."
      />
    );
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.TeamMembers?.some(
        (member) =>
          member.student?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          member.student?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 p-6">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative max-w-7xl mx-auto space-y-8">
        <div className="relative backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 shadow-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-10 blur-3xl rounded-3xl pointer-events-none"></div>

          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Team Attendance
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Manage team participation and track attendance
              </p>

              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {teams?.filter((t) => t.attendance).length} Present
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {teams?.filter((t) => !t.attendance).length} Absent
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {teams?.length} Total Teams
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group w-full xl:w-96">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 p-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teams, members..."
                    className="w-full px-6 py-4 pl-14 bg-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-8 auto-rows-max mt-8">
        {filteredTeams.map((team, index) => (
          <div key={team.id} className="mb-6">
            <div
              className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `slideInUp 0.6s ease-out forwards`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150"></div>

              <div className="relative z-10 p-10">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                  {/* Team Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                        {team.name}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Team Members
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {team.TeamMembers?.map((member) => (
                          <div
                            key={member.id}
                            className="group/member flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-white/20"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                              {member.student?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate block group-hover/member:text-purple-600 dark:group-hover/member:text-purple-400 transition-colors">
                                {member.student?.username}
                              </span>
                              {member.student_id === team.leader_id && (
                                <div className="inline-flex items-center mt-1">
                                  <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-200/50 dark:border-amber-700/50">
                                    👑 Leader
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {team.TeamMembers?.length < team.min_team_size && (
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-700/50">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          Team needs at least {team.min_team_size} members to
                          mark attendance
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Attendance Status & Toggle */}
                  <div className="flex flex-col items-center space-y-3">
                    <span
                      className={cn(
                        "text-lg font-semibold",
                        team.attendance
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {team.attendance ? "Present" : "Absent"}
                    </span>
                    <div
                      onClick={() =>
                        markTeamAttendance(team.id, !team.attendance)
                      }
                      className={cn(
                        "relative w-20 h-10 rounded-full cursor-pointer transition-all duration-300 shadow-md",
                        team.attendance ? "bg-emerald-500" : "bg-red-500"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow transform transition-transform duration-300",
                          team.attendance ? "translate-x-10" : "translate-x-0"
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(10px) rotate(-2deg);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
