// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   Award,
//   Download,
//   CheckCircle,
//   Users,
//   Trophy,
//   X,
//   Star,
//   Medal,
//   Crown,
//   Sparkles,
// } from "lucide-react";
// import { formatDate } from "../../../../lib/utils";
// import { useWinners } from "../../../../lib/hooks/useWinners";
// import WinnersModal from "../../../shared/Modal/WinnersModal";
// import toast from "react-hot-toast";
// import { useCertificateDownload } from "../../../../lib/hooks/useCertificateDownload";
// import api from "../../../../lib/api";

// function PaidEventCard({ registration }) {
//   const [showWinners, setShowWinners] = useState(false);
//   const [teamLeaderboard, setTeamLeaderboard] = useState([]);
//   const [individualLeaderboard, setIndividualLeaderboard] = useState([]);
//   const [myTeam, setMyTeam] = useState(null);
//   const [isTeamEvent, setIsTeamEvent] = useState(false);
//   const { downloadCertificate, downloading } = useCertificateDownload();
//   const [teamRank, setTeamRank] = useState(null);
//   const [individualRank, setIndividualRank] = useState(null);
//   const [subEventName, setSubEventName] = useState("");

//   useEffect(() => {
//     if (registration.subevent_id) {
//       checkEventType();
//     }
//   }, [registration]);

//   const checkEventType = async () => {
//     try {
//       const subeventsResponse = await api.get(
//         `/subevents/${registration.event_id}`
//       );
//       const subevent = subeventsResponse.data.subevents.find(
//         (se) => se.id === registration.subevent_id
//       );

//       setSubEventName(subevent?.title || "Sub Event");
//       setIsTeamEvent(subevent?.is_team_event || false);

//       if (subevent?.is_team_event) {
//         await checkTeamStatus();
//         await fetchTeamLeaderboard();
//       } else {
//         await fetchIndividualLeaderboard();
//       }
//     } catch (error) {
//       console.error("Failed to check event type:", error);
//     }
//   };

//   const checkTeamStatus = async () => {
//     try {
//       const response = await api.get(
//         `/teams/my-team/${registration.event_id}/${registration.subevent_id}`
//       );
//       if (response.data) {
//         setMyTeam(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch team status:", error);
//     }
//   };

//   const fetchTeamLeaderboard = async () => {
//     try {
//       const [teamResponse, leaderboardResponse] = await Promise.all([
//         api.get(
//           `/teams/my-team/${registration.event_id}/${registration.subevent_id}`
//         ),
//         api.get(
//           `/teams/leaderboard/${registration.event_id}/${registration.subevent_id}`
//         ),
//       ]);

//       const myTeamData = teamResponse.data;
//       const sortedLeaderboard = leaderboardResponse.data
//         .sort((a, b) => b.score - a.score)
//         .map((entry, index) => ({ ...entry, rank: index + 1 }))
//         .slice(0, 3);

//       setMyTeam(myTeamData);
//       setTeamLeaderboard(sortedLeaderboard);

//       if (myTeamData) {
//         const myTeamEntry = leaderboardResponse.data.find(
//           (entry) => entry.team_id === myTeamData.id
//         );
//         if (myTeamEntry) {
//           const rank =
//             leaderboardResponse.data.findIndex(
//               (entry) => entry.team_id === myTeamData.id
//             ) + 1;
//           setTeamRank(rank);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch team leaderboard:", error);
//     }
//   };

//   const fetchIndividualLeaderboard = async () => {
//     try {
//       const response = await api.get(`/leaderboard/${registration.event_id}`, {
//         params: { subevent_id: registration.subevent_id },
//       });

//       const sortedLeaderboard = response.data
//         .sort((a, b) => b.score - a.score)
//         .map((entry, index) => ({
//           ...entry,
//           rank: index + 1,
//         }))
//         .slice(0, 3);

//       setIndividualLeaderboard(sortedLeaderboard);

//       const userEntry = response.data.find(
//         (entry) => entry.student_id === registration.student_id
//       );
//       if (userEntry) {
//         const rank =
//           response.data.findIndex(
//             (entry) => entry.student_id === registration.student_id
//           ) + 1;
//         setIndividualRank(rank);
//       }
//     } catch (error) {
//       console.error("Failed to fetch individual leaderboard:", error);
//     }
//   };

//   const handleDownloadCertificate = async () => {
//     if (downloading) return;

//     try {
//       await downloadCertificate(
//         registration.event_id,
//         registration.subevent_id
//       );
//     } catch (error) {
//       toast.error("Failed to download certificate");
//     }
//   };

//   const getRankSuffix = (rank) => {
//     if (rank >= 11 && rank <= 13) return "th";
//     const lastDigit = rank % 10;
//     switch (lastDigit) {
//       case 1:
//         return "st";
//       case 2:
//         return "nd";
//       case 3:
//         return "rd";
//       default:
//         return "th";
//     }
//   };

//   const getRankIcon = (rank) => {
//     if (rank === 1) return Crown;
//     if (rank === 2) return Medal;
//     if (rank === 3) return Star;
//     return Trophy;
//   };

//   const getRankColors = (rank) => {
//     switch (rank) {
//       case 1:
//         return {
//           bg: "bg-gradient-to-r from-yellow-100 via-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:via-yellow-800/20 dark:to-amber-900/20",
//           text: "text-yellow-700 dark:text-yellow-300",
//           border: "border-yellow-300 dark:border-yellow-600",
//           icon: "text-yellow-500",
//         };
//       case 2:
//         return {
//           bg: "bg-gradient-to-r from-gray-100 via-slate-50 to-zinc-100 dark:from-gray-800/20 dark:via-slate-800/20 dark:to-zinc-800/20",
//           text: "text-gray-700 dark:text-gray-300",
//           border: "border-gray-300 dark:border-gray-600",
//           icon: "text-gray-500",
//         };
//       case 3:
//         return {
//           bg: "bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 dark:from-orange-900/20 dark:via-amber-800/20 dark:to-yellow-900/20",
//           text: "text-orange-700 dark:text-orange-300",
//           border: "border-orange-300 dark:border-orange-600",
//           icon: "text-orange-500",
//         };
//       default:
//         return {
//           bg: "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10",
//           text: "text-blue-700 dark:text-blue-300",
//           border: "border-blue-200 dark:border-blue-700",
//           icon: "text-blue-500",
//         };
//     }
//   };

//   const currentRank = isTeamEvent ? teamRank : individualRank;
//   const rankColors = currentRank && currentRank <= 3 ? getRankColors(currentRank) : null;

//   return (
//     <>
//       <div className="group relative">
//         {/* Premium gradient border effect */}
//         <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-sm"></div>
        
//         <div className={`relative backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl ${
//           rankColors 
//             ? `${rankColors.bg} ${rankColors.border} shadow-lg` 
//             : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-md hover:shadow-xl'
//         }`}>
          
//           {/* Premium shimmer effect for top performers */}
//           {currentRank && currentRank <= 3 && (
//             <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
//           )}

//           <div className="p-6 space-y-5">
//             {/* Header Section */}
//             <div className="flex justify-between items-start">
//               <div className="flex-1 min-w-0 space-y-2">
//                 {subEventName && (
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
//                       {subEventName}
//                     </h3>
//                     {currentRank && currentRank <= 3 && (
//                       <div className="flex-shrink-0">
//                         <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
//                   {registration.event_name}
//                 </p>

//                 {/* Status Badges */}
//                 <div className="flex flex-wrap items-center gap-2">
//                   {registration.attendance && (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
//                       <CheckCircle className="h-3 w-3" />
//                       Verified Attendance
//                     </span>
//                   )}

//                   {currentRank && currentRank <= 3 && (
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${rankColors.bg} ${rankColors.text} ${rankColors.border}`}>
//                       {React.createElement(getRankIcon(currentRank), { className: `h-3 w-3 ${rankColors.icon}` })}
//                       {currentRank}{getRankSuffix(currentRank)} Place {isTeamEvent ? 'Team' : ''}
//                     </span>
//                   )}
//                 </div>

//                 {/* Team Information */}
//                 {isTeamEvent && myTeam && (
//                   <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
//                     <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Team: {myTeam.name}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Event Details */}
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
//                 <Calendar className="h-5 w-5 text-indigo-500" />
//                 <span className="text-sm font-medium">
//                   Registered {formatDate(registration.registration_date)}
//                 </span>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 {registration.razorpay_payment_id ? (
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
//                     <Crown className="h-3 w-3" />
//                     Premium Event
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
//                     <Sparkles className="h-3 w-3" />
//                     Free Access
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 pt-2">
//               <button
//                 onClick={() => setShowWinners(true)}
//                 className="flex-1 group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative flex items-center justify-center gap-2">
//                   <Award className="h-4 w-4" />
//                   <span className="text-sm">View Rankings</span>
//                 </div>
//               </button>

//               <button
//                 onClick={handleDownloadCertificate}
//                 disabled={downloading}
//                 className="flex-1 group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white font-semibold shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative flex items-center justify-center gap-2">
//                   <Download className={`h-4 w-4 ${downloading ? 'animate-bounce' : ''}`} />
//                   <span className="text-sm">
//                     {downloading ? 'Downloading...' : 
//                       `${currentRank && currentRank <= 3 ? 'Merit' : 'Participation'} Certificate`
//                     }
//                   </span>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Leaderboard Modal */}
//       {showWinners && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Enhanced backdrop */}
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
//             onClick={() => setShowWinners(false)}
//           />

//           {/* Modal */}
//           <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
//             {/* Premium gradient border */}
//             <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-20 blur-sm"></div>
            
//             <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//               {/* Header with gradient */}
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-2xl font-bold">
//                       🏆 {isTeamEvent ? "Team Rankings" : "Individual Rankings"}
//                     </h2>
//                     <p className="text-indigo-100 text-sm mt-1">
//                       Top performers in {subEventName}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowWinners(false)}
//                     className="p-2 rounded-full hover:bg-white/20 transition-colors"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Leaderboard Content */}
//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 <div className="space-y-4">
//                   {(isTeamEvent ? teamLeaderboard : individualLeaderboard).map((entry, index) => {
//                     const isCurrentUser = isTeamEvent 
//                       ? myTeam && entry.team_id === myTeam.id
//                       : entry.student_id === registration.student_id;
                    
//                     const rankColors = getRankColors(entry.rank);
//                     const RankIcon = getRankIcon(entry.rank);

//                     return (
//                       <div
//                         key={isTeamEvent ? entry.team_id : entry.student_id}
//                         className={`relative group p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
//                           isCurrentUser
//                             ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-600 shadow-lg'
//                             : entry.rank <= 3
//                             ? `${rankColors.bg} ${rankColors.border} shadow-md hover:shadow-lg`
//                             : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
//                         }`}
//                       >
//                         {/* Rank indicator */}
//                         <div className="absolute -left-3 top-6">
//                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
//                             entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
//                             entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
//                             entry.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-amber-600' :
//                             'bg-gradient-to-r from-blue-500 to-indigo-600'
//                           }`}>
//                             {entry.rank}
//                           </div>
//                         </div>

//                         <div className="ml-6 flex items-center justify-between">
//                           <div className="flex items-center gap-4 flex-1 min-w-0">
//                             <RankIcon className={`h-6 w-6 flex-shrink-0 ${
//                               entry.rank <= 3 ? rankColors.icon : 'text-gray-500'
//                             }`} />
                            
//                             <div className="min-w-0">
//                               <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
//                                 {isTeamEvent ? entry.Team.name : entry.student_name}
//                               </h3>
//                               {isTeamEvent && (
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                   {entry.Team.TeamMembers?.length || 0} members
//                                 </p>
//                               )}
//                               {isCurrentUser && (
//                                 <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
//                                   <Star className="h-3 w-3" />
//                                   You
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           <div className="text-right flex-shrink-0">
//                             <div className="text-2xl font-bold text-gray-900 dark:text-white">
//                               {entry.score}
//                             </div>
//                             <div className="text-sm text-gray-600 dark:text-gray-400">
//                               points
//                             </div>
//                             <div className={`text-sm font-medium mt-1 ${
//                               entry.rank <= 3 ? rankColors.text : 'text-gray-600 dark:text-gray-400'
//                             }`}>
//                               {entry.rank}{getRankSuffix(entry.rank)} Place
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                   {((isTeamEvent && teamLeaderboard.length === 0) ||
//                     (!isTeamEvent && individualLeaderboard.length === 0)) && (
//                     <div className="text-center py-12">
//                       <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-500 dark:text-gray-400 text-lg">
//                         Rankings will be available soon
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default PaidEventCard;

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Award,
  Download,
  CheckCircle,
  Users,
  Trophy,
  X,
  Star,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react";
import { formatDate } from "../../../../lib/utils";
import { useWinners } from "../../../../lib/hooks/useWinners";
import WinnersModal from "../../../shared/Modal/WinnersModal";
import toast from "react-hot-toast";
import { useCertificateDownload } from "../../../../lib/hooks/useCertificateDownload";
import api from "../../../../lib/api";

function PaidEventCard({ registration }) {
  const [showWinners, setShowWinners] = useState(false);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [individualLeaderboard, setIndividualLeaderboard] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [isTeamEvent, setIsTeamEvent] = useState(false);
  const { downloadCertificate, downloading } = useCertificateDownload();
  const [teamRank, setTeamRank] = useState(null);
  const [individualRank, setIndividualRank] = useState(null);
  const [subEventName, setSubEventName] = useState("");

  useEffect(() => {
    if (registration.subevent_id) {
      checkEventType();
    }
  }, [registration]);

  const checkEventType = async () => {
    try {
      const subeventsResponse = await api.get(
        `/subevents/${registration.event_id}`
      );
      const subevent = subeventsResponse.data.subevents.find(
        (se) => se.id === registration.subevent_id
      );

      setSubEventName(subevent?.title || "Sub Event");
      setIsTeamEvent(subevent?.is_team_event || false);

      if (subevent?.is_team_event) {
        await checkTeamStatus();
        await fetchTeamLeaderboard();
      } else {
        await fetchIndividualLeaderboard();
      }
    } catch (error) {
      console.error("Failed to check event type:", error);
    }
  };

  const checkTeamStatus = async () => {
    try {
      const response = await api.get(
        `/teams/my-team/${registration.event_id}/${registration.subevent_id}`
      );
      if (response.data) {
        setMyTeam(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch team status:", error);
    }
  };

  const fetchTeamLeaderboard = async () => {
    try {
      const [teamResponse, oldLeaderboardResponse] = await Promise.all([
        api.get(
          `/teams/my-team/${registration.event_id}/${registration.subevent_id}`
        ),
        api.get(
          `/teams/leaderboard/${registration.event_id}/${registration.subevent_id}`
        ),
      ]);
      const leaderboardResponse = oldLeaderboardResponse.data.filter((entry) => entry.score > 0);
      console.log(leaderboardResponse);
      
      const myTeamData = teamResponse.data;
      const sortedLeaderboard = leaderboardResponse.filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 3);

      setMyTeam(myTeamData);
      setTeamLeaderboard(sortedLeaderboard);

      if (myTeamData) {
        const myTeamEntry = leaderboardResponse.find(
          (entry) => entry.team_id === myTeamData.id
        );
        if (myTeamEntry) {
          const rank =
            leaderboardResponse.findIndex(
              (entry) => entry.team_id === myTeamData.id
            ) + 1;
          setTeamRank(rank);
        }
      }
    } catch (error) {
      console.error("Failed to fetch team leaderboard:", error);
    }
  };

  const fetchIndividualLeaderboard = async () => {
    try {
      const response = await api.get(`/leaderboard/${registration.event_id}`, {
        params: { subevent_id: registration.subevent_id },
      });

      const sortedLeaderboard = response.data
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }))
        .slice(0, 3);

      setIndividualLeaderboard(sortedLeaderboard);

      const userEntry = response.data.find(
        (entry) => entry.student_id === registration.student_id
      );
      if (userEntry) {
        const rank =
          response.data.findIndex(
            (entry) => entry.student_id === registration.student_id
          ) + 1;
        setIndividualRank(rank);
      }
    } catch (error) {
      console.error("Failed to fetch individual leaderboard:", error);
    }
  };

  const handleDownloadCertificate = async () => {
    if (downloading) return;

    try {
      await downloadCertificate(
        registration.event_id,
        registration.subevent_id
      );
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  const getRankSuffix = (rank) => {
    if (rank >= 11 && rank <= 13) return "th";
    const lastDigit = rank % 10;
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return Crown;
    if (rank === 2) return Medal;
    if (rank === 3) return Star;
    return Trophy;
  };

  const getRankColors = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-r from-yellow-100 via-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:via-yellow-800/20 dark:to-amber-900/20",
          text: "text-yellow-700 dark:text-yellow-300",
          border: "border-yellow-300 dark:border-yellow-600",
          icon: "text-yellow-500",
        };
      case 2:
        return {
          bg: "bg-gradient-to-r from-gray-100 via-slate-50 to-zinc-100 dark:from-gray-800/20 dark:via-slate-800/20 dark:to-zinc-800/20",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-300 dark:border-gray-600",
          icon: "text-gray-500",
        };
      case 3:
        return {
          bg: "bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 dark:from-orange-900/20 dark:via-amber-800/20 dark:to-yellow-900/20",
          text: "text-orange-700 dark:text-orange-300",
          border: "border-orange-300 dark:border-orange-600",
          icon: "text-orange-500",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-700",
          icon: "text-blue-500",
        };
    }
  };

  const currentRank = isTeamEvent ? teamRank : individualRank;
  const rankColors = currentRank && currentRank <= 3 ? getRankColors(currentRank) : null;

  return (
    <>
      <div className="group relative">
        {/* Premium gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-sm"></div>
        
        <div className={`relative backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl ${
          rankColors 
            ? `${rankColors.bg} ${rankColors.border} shadow-lg` 
            : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-md hover:shadow-xl'
        }`}>
          
          {/* Premium shimmer effect for top performers */}
          {currentRank && currentRank <= 3 && (
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          )}

          <div className="p-6 space-y-5">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 space-y-2">
                {subEventName && (
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {subEventName}
                    </h3>
                    {currentRank && currentRank <= 3 && (
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {registration.event_name}
                </p>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {registration.attendance && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                      <CheckCircle className="h-3 w-3" />
                      Verified Attendance
                    </span>
                  )}

                  {currentRank && currentRank <= 3 && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${rankColors.bg} ${rankColors.text} ${rankColors.border}`}>
                      {React.createElement(getRankIcon(currentRank), { className: `h-3 w-3 ${rankColors.icon}` })}
                      {currentRank}{getRankSuffix(currentRank)} Place {isTeamEvent ? 'Team' : ''}
                    </span>
                  )}
                </div>

                {/* Team Information */}
                {isTeamEvent && myTeam && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Team: {myTeam.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium">
                  Registered {formatDate(registration.registration_date)}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {registration.razorpay_payment_id ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    <Crown className="h-3 w-3" />
                    Premium Event
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                    <Sparkles className="h-3 w-3" />
                    Free Access
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowWinners(true)}
                className="flex-1 group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">View Rankings</span>
                </div>
              </button>

              <button
                onClick={handleDownloadCertificate}
                disabled={downloading}
                className="flex-1 group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white font-semibold shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Download className={`h-4 w-4 ${downloading ? 'animate-bounce' : ''}`} />
                  <span className="text-sm">
                    {downloading ? 'Downloading...' : 
                      `${currentRank && currentRank <= 3 ? 'Merit' : 'Participation'} Certificate`
                    }
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Leaderboard Modal */}
      {showWinners && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowWinners(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Premium gradient border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-20 blur-sm"></div>
            
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      🏆 {isTeamEvent ? "Team Rankings" : "Individual Rankings"}
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                      Top performers in {subEventName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWinners(false)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Leaderboard Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {(isTeamEvent ? teamLeaderboard : individualLeaderboard).map((entry, index) => {
                    const isCurrentUser = isTeamEvent 
                      ? myTeam && entry.team_id === myTeam.id
                      : entry.student_id === registration.student_id;
                    
                    const rankColors = getRankColors(entry.rank);
                    const RankIcon = getRankIcon(entry.rank);

                    return (
                      <div
                        key={isTeamEvent ? entry.team_id : entry.student_id}
                        className={`relative group p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-600 shadow-lg'
                            : entry.rank <= 3
                            ? `${rankColors.bg} ${rankColors.border} shadow-md hover:shadow-lg`
                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {/* Rank indicator */}
                        <div className="absolute -left-3 top-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                            entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            entry.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-amber-600' :
                            'bg-gradient-to-r from-blue-500 to-indigo-600'
                          }`}>
                            {entry.rank}
                          </div>
                        </div>

                        <div className="ml-6 flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <RankIcon className={`h-6 w-6 flex-shrink-0 ${
                              entry.rank <= 3 ? rankColors.icon : 'text-gray-500'
                            }`} />
                            
                            <div className="min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                                {isTeamEvent ? entry.Team.name : entry.student_name}
                              </h3>
                              {isTeamEvent && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {entry.Team.TeamMembers?.length || 0} members
                                </p>
                              )}
                              {isCurrentUser && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  <Star className="h-3 w-3" />
                                  You
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {entry.score}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              points
                            </div>
                            <div className={`text-sm font-medium mt-1 ${
                              entry.rank <= 3 ? rankColors.text : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {entry.rank}{getRankSuffix(entry.rank)} Place
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {((isTeamEvent && teamLeaderboard.length === 0) ||
                    (!isTeamEvent && individualLeaderboard.length === 0)) && (
                    <div className="text-center py-12">
                      <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Rankings will be available soon
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaidEventCard;
