// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Search, Trophy, Award, Edit2, Save, X } from 'lucide-react';
// import { useTeamLeaderboard } from '../../../../lib/hooks/useTeamLeaderboard';
// import LoadingSpinner from '../../../shared/LoadingSpinner';
// import EmptyState from '../../../shared/EmptyState';
// import { cn } from '../../../../lib/utils';
// import toast from 'react-hot-toast';

// export default function TeamLeaderboardManager() {
//   const { eventId, subEventId } = useParams();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editMode, setEditMode] = useState(false);
//   const [selectedWinners, setSelectedWinners] = useState([
//     { position: 1, team_id: '', score: '', name: '' },
//     { position: 2, team_id: '', score: '', name: '' },
//     { position: 3, team_id: '', score: '', name: '' }
//   ]);
//   const {
//     leaderboard,
//     eligibleTeams,
//     loading,
//     editWinners,
//     refreshLeaderboard
//   } = useTeamLeaderboard(parseInt(eventId), parseInt(subEventId));

//   const handleSaveWinners = async () => {
//     // Validate all winners have team_id and score
//     const invalidSelections = selectedWinners.filter(w => !w.team_id || !w.score);
//     if (invalidSelections.length > 0) {
//       toast.error('Please select teams and assign scores for all positions');
//       return;
//     }

//     try {
//       await editWinners(selectedWinners);
//       toast.success('Winners updated successfully');
//       setEditMode(false);
//       refreshLeaderboard();
//     } catch (error) {
//       toast.error('Failed to update winners');
//     }
//   };

//   const filteredTeams = eligibleTeams.filter(team =>
//     team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     team.TeamMembers?.some(member =>
//       member.student?.username?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   if (loading) return <LoadingSpinner />;

//   if (!eligibleTeams?.length) {
//     return (
//       <EmptyState
//         icon={Trophy}
//         title="No Teams Found"
//         message="There are no teams with attendance marked as present"
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Team Leaderboard</h1>
//         <div className="flex items-center space-x-4">
//           <div className="relative w-64">
//             <input
//               type="text"
//               placeholder="Search teams..."
//               className="input pl-10 w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="btn btn-primary"
//             >
//               <Edit2 className="h-4 w-4 mr-2" />
//               {leaderboard.length > 0 ? 'Edit Winners' : 'Declare Winners'}
//             </button>
//           ) : (
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleSaveWinners}
//                 className="btn btn-primary"
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="btn btn-ghost"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {editMode ? (
//         <div className="glass-card space-y-6">
//           <h2 className="text-xl font-bold mb-4">Select Winners</h2>
//           <div className="space-y-6">
//             {selectedWinners.map((winner) => (
//               <div key={winner.position} className="flex items-center space-x-4">
//                 <div className="w-24">
//                   <Trophy className={cn(
//                     "h-6 w-6",
//                     winner.position === 1 ? "text-yellow-500" :
//                     winner.position === 2 ? "text-gray-400" :
//                     "text-amber-600"
//                   )} />
//                 </div>
//                 <div className="flex-1">
//                   <select
//                     className="input w-full"
//                     value={winner.team_id}
//                     onChange={(e) => {
//                       const team = filteredTeams.find(t => t.id === parseInt(e.target.value));
//                       if (team) {
//                         setSelectedWinners(prev => prev.map(w =>
//                           w.position === winner.position ? {
//                             ...w,
//                             team_id: team.id,
//                             name: team.name
//                           } : w
//                         ));
//                       }
//                     }}
//                   >
//                     <option value="">Select team</option>
//                     {filteredTeams.map((team) => (
//                       <option key={team.id} value={team.id}>
//                         {team.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="w-32">
//                   <input
//                     type="number"
//                     placeholder="Score"
//                     className="input w-full"
//                     value={winner.score}
//                     onChange={(e) => {
//                       const score = parseInt(e.target.value);
//                       if (!isNaN(score) && score >= 0) {
//                         setSelectedWinners(prev => prev.map(w =>
//                           w.position === winner.position ? {
//                             ...w,
//                             score
//                           } : w
//                         ));
//                       }
//                     }}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {leaderboard.map((entry, index) => (
//             <div key={entry.team_id} className="glass-card">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center space-x-3">
//                     <Award className={cn(
//                       "h-6 w-6",
//                       entry.rank === 1 ? "text-yellow-500" :
//                       entry.rank === 2 ? "text-gray-400" :
//                       entry.rank === 3 ? "text-amber-600" :
//                       "text-gray-300"
//                     )} />
//                     <h3 className="text-xl font-bold">{entry.Team?.name}</h3>
//                     {entry.rank && (
//                       <span className={cn(
//                         "px-2 py-1 text-xs rounded-full",
//                         entry.rank === 1 ? "bg-yellow-100 text-yellow-800" :
//                         entry.rank === 2 ? "bg-gray-100 text-gray-800" :
//                         "bg-amber-100 text-amber-800"
//                       )}>
//                         {entry.rank}{entry.rank === 1 ? 'st' : entry.rank === 2 ? 'nd' : 'rd'} Place
//                       </span>
//                     )}
//                   </div>
//                   <div className="mt-2 space-y-1">
//                     {entry.Team?.TeamMembers?.map((member) => (
//                       <div key={member.id} className="text-sm text-gray-600 dark:text-gray-400">
//                         {member.student?.username}
//                         {member.student_id === entry.Team?.leader_id && (
//                           <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
//                             Leader
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="text-2xl font-bold text-primary">
//                   {entry.score} points
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Trophy,
  Award,
  Edit2,
  Save,
  X,
  Users,
  Crown,
  Medal,
  Star,
  Sparkles,
  Zap,
} from "lucide-react";
import { useTeamLeaderboard } from "../../../../lib/hooks/useTeamLeaderboard";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import EmptyState from "../../../shared/EmptyState";
import { cn } from "../../../../lib/utils";
import toast from "react-hot-toast";

export default function TeamLeaderboardManager() {
  const { eventId, subEventId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState([
    { position: 1, team_id: "", score: "", name: "" },
    { position: 2, team_id: "", score: "", name: "" },
    { position: 3, team_id: "", score: "", name: "" },
  ]);
  const {
    leaderboard,
    eligibleTeams,
    loading,
    editWinners,
    refreshLeaderboard,
  } = useTeamLeaderboard(parseInt(eventId), parseInt(subEventId));

  const handleSaveWinners = async () => {
    const invalidSelections = selectedWinners.filter(
      (w) => !w.team_id || !w.score
    );
    if (invalidSelections.length > 0) {
      alert("Please select teams and assign scores for all positions");
      return;
    }

    try {
      await editWinners(selectedWinners);
      alert("Winners updated successfully");
      setEditMode(false);
      refreshLeaderboard();
    } catch (error) {
      alert("Failed to update winners");
    }
  };

  const filteredTeams = eligibleTeams.filter(
    (team) =>
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.TeamMembers?.some((member) =>
        member.student?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );

  const getPositionIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-white dark:text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-500 dark:text-gray-300" />;
      case 3:
        return (
          <Award className="h-6 w-6 text-amber-600 dark:text-amber-4000" />
        );
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getGradientClasses = (rank) => {
    switch (rank) {
      case 1:
        return {
          card: "from-yellow-500/20 via-amber-400/15 to-orange-500/20",
          border: "border-yellow-400/40 hover:border-yellow-400/60",
          glow: "hover:shadow-yellow-500/25",
          badge: "bg-gradient-to-r from-yellow-400 to-amber-500",
        };
      case 2:
        return {
          card: "from-slate-400/20 via-gray-300/15 to-slate-500/20",
          border: "border-slate-400/40 hover:border-slate-400/60",
          glow: "hover:shadow-slate-400/25",
          badge: "bg-gradient-to-r from-slate-400 to-slate-500",
        };
      case 3:
        return {
          card: "from-amber-500/20 via-orange-400/15 to-red-500/20",
          border: "border-amber-400/40 hover:border-amber-400/60",
          glow: "hover:shadow-amber-500/25",
          badge: "bg-gradient-to-r from-amber-400 to-orange-500",
        };
      default:
        return {
          card: "from-blue-500/20 via-indigo-400/15 to-purple-500/20",
          border: "border-blue-400/40 hover:border-blue-400/60",
          glow: "hover:shadow-blue-500/25",
          badge: "bg-gradient-to-r from-blue-400 to-indigo-500",
        };
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!eligibleTeams?.length) {
    return (
      <EmptyState
        icon={Trophy}
        title="No Teams Found"
        message="There are no teams with attendance marked as present"
      />
    );
  }

  return (
    <div className="min-h-screen from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-pink-500/10 dark:bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="text-center space-y-6 py-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl animate-bounce shadow-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              Team Leaderboard
            </h1>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl animate-bounce delay-200 shadow-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
            Track team performance and celebrate champions
          </p>
        </div>

        {/* Controls Section */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/30 border border-white/20 dark:border-gray-700/50 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search teams or members..."
                className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl 
                         text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                         transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-800/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>

            {/* Action Buttons */}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 
                         text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 
                         transform hover:scale-105 transition-all duration-300 w-full lg:w-auto overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Edit2 className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>
                    {leaderboard.length > 0
                      ? "Edit Winners"
                      : "Declare Winners"}
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                <button
                  onClick={handleSaveWinners}
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 
                           text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/25 
                           transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <Save className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Save Changes</span>
                  </div>
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-gray-500 via-gray-600 to-slate-600 
                           text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-gray-500/25 
                           transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-500 to-slate-500 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Cancel</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {editMode ? (
          <div className="backdrop-blur-xl bg-white/70 dark:bg-black/30 border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Select Winners
              </h2>
            </div>

            <div className="space-y-6">
              {selectedWinners.map((winner, index) => (
                <div
                  key={winner.position}
                  className="group relative p-6 bg-gradient-to-r from-white/50 to-white/70 dark:from-gray-800/50 dark:to-gray-700/50 
                           border border-gray-300/50 dark:border-gray-600/50 rounded-2xl 
                           hover:from-white/70 hover:to-white/80 dark:hover:from-gray-800/70 dark:hover:to-gray-700/70 
                           transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Position Badge */}
                    <div
                      className={`flex items-center justify-center w-20 h-20 bg-gradient-to-r ${
                        winner.position === 1
                          ? "from-yellow-400 to-amber-500"
                          : winner.position === 2
                          ? "from-slate-400 to-slate-500"
                          : "from-amber-400 to-orange-500"
                      } rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}
                    >
                      <div className="text-center">
                        {winner.position === 1 ? (
                          <Crown className="h-8 w-8 text-white" />
                        ) : winner.position === 2 ? (
                          <Medal className="h-8 w-8 text-white" />
                        ) : (
                          <Award className="h-8 w-8 text-white" />
                        )}
                        <div className="text-xs font-bold text-white mt-1">
                          #{winner.position}
                        </div>
                      </div>
                    </div>

                    {/* Position Label */}
                    <div className="w-full lg:w-32 text-center lg:text-left">
                      <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {winner.position === 1
                          ? "1st Place"
                          : winner.position === 2
                          ? "2nd Place"
                          : "3rd Place"}
                      </span>
                    </div>

                    {/* Team Selection */}
                    <div className="flex-1 w-full">
                      <select
                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-300/50 dark:border-gray-600/50 rounded-xl 
                                 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                                 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80"
                        value={winner.team_id}
                        onChange={(e) => {
                          const team = filteredTeams.find(
                            (t) => t.id === parseInt(e.target.value)
                          );
                          if (team) {
                            setSelectedWinners((prev) =>
                              prev.map((w) =>
                                w.position === winner.position
                                  ? {
                                      ...w,
                                      team_id: team.id,
                                      name: team.name,
                                    }
                                  : w
                              )
                            );
                          }
                        }}
                      >
                        <option value="" className="bg-white dark:bg-gray-800">
                          Select team
                        </option>
                        {filteredTeams.map((team) => (
                          <option
                            key={team.id}
                            value={team.id}
                            className="bg-white dark:bg-gray-800"
                          >
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Score Input */}
                    <div className="w-full lg:w-40">
                      <input
                        type="number"
                        placeholder="Score"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-300/50 dark:border-gray-600/50 rounded-xl 
                                 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80"
                        value={winner.score}
                        onChange={(e) => {
                          const score = parseInt(e.target.value);
                          if (!isNaN(score) && score >= 0) {
                            setSelectedWinners((prev) =>
                              prev.map((w) =>
                                w.position === winner.position
                                  ? {
                                      ...w,
                                      score,
                                    }
                                  : w
                              )
                            );
                          }
                        }}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {leaderboard
              .filter((entry) => {
                return (
                  entry.Team?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  entry.Team?.TeamMembers?.some((member) =>
                    member.student?.username
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                );
              })
              .map((entry, index) => {
                const gradients = getGradientClasses(entry.rank);

                return (
                  <div
                    key={entry.team_id}
                    className={`group relative backdrop-blur-xl bg-gradient-to-br ${gradients.card} 
                            border ${gradients.border} rounded-3xl p-6 shadow-2xl hover:shadow-3xl ${gradients.glow}
                            transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: "fadeInUp 0.8s ease-out forwards",
                    }}
                  >
                    {/* Rank Badge */}
                    {entry.rank <= 3 && (
                      <div
                        className={`absolute -top-4 -right-4 w-16 h-16 ${gradients.badge} 
                                   rounded-full flex items-center justify-center shadow-2xl
                                   animate-pulse border-4 border-white/20`}
                      >
                        <span className="text-white font-bold text-lg">
                          #{entry.rank}
                        </span>
                      </div>
                    )}

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                      <div
                        className={`absolute top-6 right-8 w-2 h-2 ${
                          entry.rank === 1
                            ? "bg-yellow-400"
                            : entry.rank === 2
                            ? "bg-slate-400"
                            : "bg-amber-400"
                        } rounded-full animate-pulse`}
                      ></div>
                      <div
                        className={`absolute bottom-8 left-8 w-1 h-1 ${
                          entry.rank === 1
                            ? "bg-yellow-300"
                            : entry.rank === 2
                            ? "bg-slate-300"
                            : "bg-amber-300"
                        } rounded-full animate-pulse delay-700`}
                      ></div>
                      <div
                        className={`absolute top-1/2 left-6 w-1.5 h-1.5 ${
                          entry.rank === 1
                            ? "bg-yellow-500"
                            : entry.rank === 2
                            ? "bg-slate-500"
                            : "bg-amber-500"
                        } rounded-full animate-pulse delay-1000`}
                      ></div>
                    </div>

                    <div className="relative space-y-4">
                      {/* Team Header */}
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 ${gradients.badge} rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}
                        >
                          {getPositionIcon(entry.rank)}
                        </div>
                        <div className="flex-1">
                          <h3
                            className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-transparent 
                                     group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 
                                     dark:group-hover:from-gray-100 dark:group-hover:to-gray-300 group-hover:bg-clip-text 
                                     transition-all duration-300"
                          >
                            {entry.Team?.name}
                          </h3>
                          {entry.rank && (
                            <div
                              className={`inline-block px-3 py-1 text-sm font-bold text-white ${gradients.badge} 
                                         rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300`}
                            >
                              {entry.rank}
                              {entry.rank === 1
                                ? "st"
                                : entry.rank === 2
                                ? "nd"
                                : "rd"}{" "}
                              Place
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Team Members
                        </h4>
                        <div className="space-y-1">
                          {entry.Team?.TeamMembers?.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 bg-white/30 dark:bg-black/20 
                                                        rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
                            >
                              <span className="text-gray-700 dark:text-gray-200 font-medium">
                                {member.student?.username}
                              </span>
                              {member.student_id === entry.Team?.leader_id && (
                                <span
                                  className="ml-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                                             px-3 py-1 rounded-full font-bold shadow-lg animate-pulse"
                                >
                                  <Crown className="h-3 w-3 inline mr-1" />
                                  Leader
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Score Display */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-gray-700/30">
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          Total Score
                        </span>
                        <div className="text-right">
                          <div
                            className="text-4xl font-black text-gray-800 dark:text-gray-100 group-hover:text-transparent 
                                       group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 
                                       dark:group-hover:from-gray-100 dark:group-hover:to-gray-300 group-hover:bg-clip-text 
                                       transition-all duration-300"
                          >
                            {entry.score}
                          </div>
                          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            points
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div
                      className={`absolute inset-0 rounded-3xl ${gradients.badge} opacity-0 group-hover:opacity-20 
                                 transition-opacity duration-300 -z-10 blur-xl`}
                    ></div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
