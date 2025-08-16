// import React, { useState, useEffect } from "react";
// import { User, Mail, Trophy, Star, Calendar, Award } from "lucide-react";
// import { useAuth } from "../../../contexts/AuthContext";
// import api from "../../../lib/api";
// import { cn } from "../../../lib/utils";
// import { formatDate } from "../../../lib/utils";

// function StudentProfile() {
//   const { user } = useAuth();
//   const [registeredEvents, setRegisteredEvents] = useState([]);
//   const [upcomingEvents, setUpcomingEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [pointsByDate, setPointsByDate] = useState({});

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const registrationsResponse = await api.get(
//         "/registrations/my-registrations"
//       );
//       const registrations = registrationsResponse.data.filter(
//         (reg) => reg.payment_status === "paid"
//       );

//       const leaderboardPromises = registrations.map((reg) =>
//         api
//           .get(`/leaderboard/${reg.event_id}`, {
//             params: { subevent_id: reg.subevent_id },
//           })
//           .catch(() => ({ data: [] }))
//       );
//       const leaderboardResponses = await Promise.all(leaderboardPromises);

//       const winnersMap = new Map();
//       leaderboardResponses.forEach((response, index) => {
//         const reg = registrations[index];
//         const winners = response.data;
//         const eventKey = `${reg.event_id}-${reg.subevent_id}`;
//         const userRank = winners.find((w) => w.student_id === user.id)?.rank;
//         if (userRank) {
//           winnersMap.set(eventKey, userRank);
//         }
//       });

//       const enhancedRegistrations = registrations.map((reg) => {
//         const eventKey = `${reg.event_id}-${reg.subevent_id}`;
//         const rank = winnersMap.get(eventKey);
//         return { ...reg, rank };
//       });

//       const { total, pointsByDate } = calculatePointsByDate(
//         enhancedRegistrations
//       );
//       setTotalPoints(total);
//       setPointsByDate(pointsByDate);
//       setRegisteredEvents(enhancedRegistrations);

//       const eventsResponse = await api.get("/events");
//       const now = new Date();
//       now.setHours(0, 0, 0, 0);

//       const upcoming = eventsResponse.data.rows
//         .filter((event) => new Date(event.start_date) >= now)
//         .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
//         .slice(0, 5);
//       console.log(upcoming);
//       setUpcomingEvents(upcoming);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculatePointsByDate = (registrations) => {
//     const eventsByDate = registrations.reduce((acc, reg) => {
//       const date = new Date(reg.registration_date).toDateString();
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(reg);
//       return acc;
//     }, {});

//     let totalPoints = 0;
//     const pointsByDate = {};

//     Object.entries(eventsByDate).forEach(([date, regs]) => {
//       const eventPoints = regs.map((reg) => ({
//         ...reg,
//         points: reg.rank ? 3 : reg.attendance ? 2 : 0,
//         type: reg.rank
//           ? `${reg.rank}${getRankSuffix(reg.rank)} Place`
//           : reg.attendance
//           ? "Participation"
//           : "Registered",
//       }));

//       const topEvents = eventPoints
//         .sort((a, b) => b.points - a.points)
//         .slice(0, 2);

//       const datePoints = topEvents.reduce(
//         (sum, event) => sum + event.points,
//         0
//       );
//       totalPoints += datePoints;

//       pointsByDate[date] = {
//         events: topEvents,
//         totalPoints: datePoints,
//       };
//     });

//     return { total: totalPoints, pointsByDate };
//   };

//   const getRankSuffix = (rank) => {
//     if (!rank) return "";
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

//   return (
//     <div className="min-h-screen p-3 sm:p-6 lg:p-8">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse mb-4">
//             Student Dashboard
//           </h1>
//           <p className="text-gray-500dark:text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
//             Track your achievements, monitor your progress, and celebrate your success
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center min-h-[50vh]">
//             <div className="relative">
//               <div className="w-20 h-20 border-4 border-purple-200 rounded-full"></div>
//               <div className="w-20 h-20 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
//             {/* Profile Card */}
//             <div className="xl:col-span-2 space-y-6">
//               <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 via-purple-900/20 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
//                 {/* Animated border effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>

//                 <div className="relative p-6 sm:p-8">
//                   {/* User Info */}
//                   <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
//                     <div className="relative group/avatar">
//                       <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur group-hover/avatar:blur-md transition-all duration-300"></div>
//                       <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center transform group-hover/avatar:scale-110 transition-all duration-300 shadow-xl">
//                         <User className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-pulse" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 animate-bounce"></div>
//                     </div>

//                     <div className="text-center sm:text-left flex-grow">
//                       <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
//                         {user?.username}
//                       </h2>
//                       <div className="flex items-center justify-center sm:justify-start space-x-2 text-slate-300">
//                         <Mail className="h-4 w-4 text-cyan-400" />
//                         <span className="text-white dark:text-slate-300 text-sm sm:text-base break-all">{user?.email}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Stats Grid */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                     <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/20 p-4 sm:p-6 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105">
//                       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
//                       <div className="relative">
//                         <div className="flex items-center space-x-3 mb-3">
//                           <div className="p-2 rounded-lg bg-cyan-500/20 group-hover/stat:bg-cyan-500/30 transition-colors duration-300">
//                             <Calendar className="h-5 w-5 text-cyan-400 group-hover/stat:scale-110 transition-transform duration-300" />
//                           </div>
//                           <span className="font-semibold text-slate-200">Events Participated</span>
//                         </div>
//                         <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
//                           {registeredEvents.length}
//                         </p>
//                         <div className="w-full bg-slate-700/50 rounded-full h-2 mt-3">
//                           <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: `${Math.min((registeredEvents.length / 10) * 100, 100)}%`}}></div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 p-4 sm:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105">
//                       <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
//                       <div className="relative">
//                         <div className="flex items-center space-x-3 mb-3">
//                           <div className="p-2 rounded-lg bg-yellow-500/20 group-hover/stat:bg-yellow-500/30 transition-colors duration-300">
//                             <Trophy className="h-5 w-5 text-yellow-400 group-hover/stat:scale-110 transition-transform duration-300 group-hover/stat:rotate-12" />
//                           </div>
//                           <span className="font-semibold text-slate-200">Events Won</span>
//                         </div>
//                         <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
//                           {registeredEvents.filter((reg) => reg.rank).length}
//                         </p>
//                         <div className="w-full bg-slate-700/50 rounded-full h-2 mt-3">
//                           <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full animate-pulse" style={{width: `${Math.min((registeredEvents.filter((reg) => reg.rank).length / Math.max(registeredEvents.length, 1)) * 100, 100)}%`}}></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Upcoming Events */}
//               {upcomingEvents.length > 0 && (
//                 <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 via-indigo-900/20 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-6 sm:p-8">
//                   <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-6 flex items-center space-x-2">
//                     <Calendar className="h-6 w-6 text-indigo-400" />
//                     <span>Upcoming Events</span>
//                   </h3>
//                   <div className="space-y-3">
//                     {upcomingEvents.slice(0, 3).map((event, index) => (
//                       <div key={event.id} className="group relative overflow-hidden rounded-xl bg-slate-800/30 border border-slate-600/30 p-4 hover:border-indigo-400/40 transition-all duration-300 hover:transform hover:translate-x-2">
//                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                         <div className="relative flex items-center justify-between">
//                           <div>
//                             <h4 className="font-semibold text-white dark:text-slate-200 group-hover:text-indigo-300 transition-colors duration-300">
//                               {event.event_name}
//                             </h4>
//                             <p className="text-sm  text-white dark:text-slate-200 mt-1">
//                               {formatDate(new Date(event.start_date))}
//                             </p>
//                           </div>
//                           <div className="text-indigo-400 group-hover:scale-110 transition-transform duration-300">
//                             <Star className="h-5 w-5" />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Points Display */}
//             <div className="xl:col-span-1">
//               <div className="sticky top-6">
//                 <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-purple-900/50 backdrop-blur-xl border border-purple-500/30 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500">
//                   {/* Animated gradient background */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                   {/* Floating stars */}
//                   <div className="absolute top-4 right-4">
//                     <Star className="h-6 w-6 text-yellow-400 animate-spin-slow" />
//                   </div>
//                   <div className="absolute top-8 left-6">
//                     <Star className="h-4 w-4 text-pink-400 animate-bounce" style={{animationDelay: '1s'}} />
//                   </div>
//                   <div className="absolute bottom-8 right-8">
//                     <Star className="h-3 w-3 text-cyan-400 animate-pulse" style={{animationDelay: '2s'}} />
//                   </div>

//                   <div className="relative p-6 sm:p-8 text-center">
//                     <div className="mb-6">
//                       <div className="relative mx-auto w-20 h-20 mb-4">
//                         <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur animate-pulse"></div>
//                         <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-4 shadow-xl">
//                           <Award className="h-12 w-12 text-white animate-bounce" />
//                         </div>
//                       </div>
//                       <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-2">
//                         Total Points
//                       </h3>
//                     </div>

//                     {/* Points Display */}
//                     <div className="relative mb-6">
//                       <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse"></div>
//                       <div className="relative">
//                         <p className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse mb-2">
//                           {totalPoints}
//                         </p>
//                         <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
//                       </div>
//                     </div>

//                     {/* Points Information */}
//                     <div className="space-y-4">
//                       <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
//                         <p className="text-sm text-slate-300 leading-relaxed">
//                           Points are calculated from your top 2 events each day!
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-1 gap-3">
//                         <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
//                           <span className="text-sm font-medium text-slate-200">Ranked Events</span>
//                           <span className="px-2 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold">3 pts</span>
//                         </div>
//                         <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-3 border border-blue-500/20">
//                           <span className="text-sm font-medium text-slate-200">Participation</span>
//                           <span className="px-2 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm font-bold">2 pts</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .animate-spin-slow {
//           animation: spin-slow 3s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default StudentProfile;
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
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import { cn } from "../../../lib/utils";
import { formatDate } from "../../../lib/utils";

function StudentProfile() {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsByDate, setPointsByDate] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const registrationsResponse = await api.get(
        "/registrations/my-registrations"
      );
      const registrations = registrationsResponse.data.filter(
        (reg) => reg.payment_status === "paid"
      );

      const leaderboardPromises = registrations.map((reg) =>
        api
          .get(`/leaderboard/${reg.event_id}`, {
            params: { subevent_id: reg.subevent_id },
          })
          .catch(() => ({ data: [] }))
      );
      const leaderboardResponses = await Promise.all(leaderboardPromises);

      const winnersMap = new Map();
      leaderboardResponses.forEach((response, index) => {
        const reg = registrations[index];
        const winners = response.data;
        const eventKey = `${reg.event_id}-${reg.subevent_id}`;
        const userRank = winners.find((w) => w.student_id === user.id)?.rank;
        if (userRank) {
          winnersMap.set(eventKey, userRank);
        }
      });

      const enhancedRegistrations = registrations.map((reg) => {
        const eventKey = `${reg.event_id}-${reg.subevent_id}`;
        const rank = winnersMap.get(eventKey);
        return { ...reg, rank };
      });

      const { total, pointsByDate } = calculatePointsByDate(
        enhancedRegistrations
      );
      setTotalPoints(total);
      setPointsByDate(pointsByDate);
      setRegisteredEvents(enhancedRegistrations);

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

  const calculatePointsByDate = (registrations) => {
    const eventsByDate = registrations.reduce((acc, reg) => {
      const date = new Date(reg.registration_date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reg);
      return acc;
    }, {});

    let totalPoints = 0;
    const pointsByDate = {};

    Object.entries(eventsByDate).forEach(([date, regs]) => {
      const eventPoints = regs.map((reg) => ({
        ...reg,
        points: reg.rank ? 3 : reg.attendance ? 2 : 0,
        type: reg.rank
          ? `${reg.rank}${getRankSuffix(reg.rank)} Place`
          : reg.attendance
          ? "Participation"
          : "Registered",
      }));

      const topEvents = eventPoints
        .sort((a, b) => b.points - a.points)
        .slice(0, 2);

      const datePoints = topEvents.reduce(
        (sum, event) => sum + event.points,
        0
      );
      totalPoints += datePoints;

      pointsByDate[date] = {
        events: topEvents,
        totalPoints: datePoints,
      };
    });

    return { total: totalPoints, pointsByDate };
  };

  const getRankSuffix = (rank) => {
    if (!rank) return "";
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

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-8">
      {/* Animated Background Elements */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div> */}

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
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
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Profile Card */}
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-3xl"></div>

                {/* User Info */}
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6 mb-8">
                  <div className="relative group/avatar">
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 p-1 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/avatar:scale-110">
                      <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <User className="h-12 w-12 sm:h-14 sm:w-14 text-blue-950 dark:text-violet-200 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 bg-clip-text" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 animate-bounce shadow-lg">
                      <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="text-center sm:text-left flex-grow">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      {user?.username || "Student"}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span className="text-base break-all">
                        {user?.email || "student@example.com"}
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

                {/* Stats Grid */}
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                            Events Won
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Ranked positions
                          </span>
                        </div>
                      </div>
                      <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                        {registeredEvents.filter((reg) => reg.rank).length}
                      </p>
                      <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              (registeredEvents.filter((reg) => reg.rank)
                                .length /
                                Math.max(registeredEvents.length, 1)) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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

            {/* Points Display Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 rounded-3xl"></div>

                  {/* Decorative elements */}
                  <div className="absolute top-6 right-6">
                    <Star className="h-6 w-6 text-yellow-500 animate-spin-slow" />
                  </div>
                  <div className="absolute top-12 left-6">
                    <Star
                      className="h-4 w-4 text-orange-500 animate-bounce"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                  <div className="absolute bottom-12 right-8">
                    <Star
                      className="h-3 w-3 text-red-500 animate-pulse"
                      style={{ animationDelay: "2s" }}
                    />
                  </div>

                  <div className="relative p-8 text-center">
                    {/* Award Icon */}
                    <div className="mb-8">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-5 shadow-xl hover:scale-110 transition-transform duration-300">
                          <Award className="h-14 w-14 text-white animate-bounce" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        Total Points
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Your achievement score
                      </p>
                    </div>

                    {/* Points Display */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-2xl opacity-50 animate-pulse"></div>
                      <div className="relative">
                        <p className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                          {totalPoints}
                        </p>
                        <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto"></div>
                      </div>
                    </div>

                    {/* Points Information */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/30">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Scoring System
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          Points calculated from your top 2 events each day
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="group/item flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-700/30 hover:scale-105 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <Medal className="h-5 w-5 text-yellow-600 dark:text-yellow-400 group-hover/item:rotate-12 transition-transform duration-300" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Ranked Events
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-bold">
                            3 pts
                          </span>
                        </div>

                        <div className="group/item flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/30 hover:scale-105 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Participation
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-700 dark:text-blue-300 text-sm font-bold">
                            2 pts
                          </span>
                        </div>
                      </div>

                      {/* Progress Ring */}
                      <div className="mt-6">
                        <div className="relative w-20 h-20 mx-auto">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-gray-200 dark:text-gray-700"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="url(#progress-gradient)"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${Math.min(
                                (totalPoints / 100) * 226,
                                226
                              )} 226`}
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient
                                id="progress-gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop offset="0%" stopColor="#EAB308" />
                                <stop offset="50%" stopColor="#F97316" />
                                <stop offset="100%" stopColor="#EF4444" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                              {Math.min(
                                Math.round((totalPoints / 100) * 100),
                                100
                              )}
                              %
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Progress to next level
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentProfile;
