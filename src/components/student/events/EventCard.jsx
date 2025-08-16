// import React, { useState } from 'react';
// import { 
//   Calendar, 
//   MapPin, 
//   Clock, 
//   Users, 
//   Star,
//   Sparkles,
//   ArrowRight,
//   TrendingUp,
//   Zap
// } from 'lucide-react';
// import { formatDate } from '../../../lib/utils';

// function EventCard({ event }) {
//   const [isHovered, setIsHovered] = useState(false);

//   const getPopularityLevel = (count) => {
//     if (count >= 100) return 'high';
//     if (count >= 50) return 'medium';
//     return 'low';
//   };

//   const popularityLevel = getPopularityLevel(event.registered_count || 0);
  
//   const popularityConfig = {
//     high: {
//       bg: 'from-pink-500 via-red-500 to-orange-500',
//       text: 'text-pink-600',
//       badge: 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 border-pink-200',
//       icon: 'text-pink-500',
//       label: 'Hot Event'
//     },
//     medium: {
//       bg: 'from-blue-500 via-purple-500 to-indigo-500',
//       text: 'text-blue-600',
//       badge: 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200',
//       icon: 'text-blue-500',
//       label: 'Popular'
//     },
//     low: {
//       bg: 'from-emerald-500 via-teal-500 to-cyan-500',
//       text: 'text-emerald-600',
//       badge: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200',
//       icon: 'text-emerald-500',
//       label: 'Available'
//     }
//   };

//   const config = popularityConfig[popularityLevel];

//   return (
//     <div 
//       className="group relative"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Animated premium border */}
//       <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 blur-sm animate-pulse"></div>
      
//       {/* Main card */}
//       <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
        
//         {/* Floating particles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute w-1 h-1 bg-gradient-to-r ${config.bg} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`}
//               style={{
//                 left: `${20 + i * 15}%`,
//                 top: `${10 + (i % 3) * 30}%`,
//                 animationDelay: `${i * 200}ms`,
//                 animation: isHovered ? 'float 3s ease-in-out infinite' : 'none'
//               }}
//             />
//           ))}
//         </div>

//         {/* Hero section */}
//         <div className="relative h-48 overflow-hidden">
//           <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-90`}>
//             <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
//           </div>
          
//           {/* Floating calendar icon */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="relative">
//               <div className="absolute -inset-4 bg-white/20 rounded-full animate-ping group-hover:animate-pulse"></div>
//               <div className="relative bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
//                 <Calendar className="h-12 w-12 text-white drop-shadow-lg" />
//               </div>
//             </div>
//           </div>

//           {/* Popularity badge */}
//           <div className="absolute top-4 right-4">
//             <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${config.badge} shadow-lg`}>
//               <Sparkles className="h-3 w-3" />
//               {config.label}
//             </div>
//           </div>

//           {/* Shine effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
//         </div>

//         {/* Content section */}
//         <div className="p-6 space-y-5">
//           {/* Title */}
//           <div className="space-y-2">
//             <h3 className={`text-2xl font-bold bg-gradient-to-r ${config.bg} bg-clip-text text-transparent leading-tight`}>
//               {event.event_name}
//             </h3>
//             <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
//           </div>
          
//           {/* Event details */}
//           <div className="space-y-4">
//             {/* Start Date */}
//             <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300">
//               <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 group-hover/item:scale-110 transition-transform duration-300">
//                 <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div className="flex-1">
//                 <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Date</div>
//                 <div className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(event.start_date)}</div>
//               </div>
//             </div>
            
//             {/* Venue */}
//             <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300">
//               <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 group-hover/item:scale-110 transition-transform duration-300">
//                 <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Venue</div>
//                 <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{event.venue}</div>
//               </div>
//             </div>
            
//             {/* End Date */}
//             <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300">
//               <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 group-hover/item:scale-110 transition-transform duration-300">
//                 <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
//               </div>
//               <div className="flex-1">
//                 <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date</div>
//                 <div className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(event.end_date)}</div>
//               </div>
//             </div>

//             {/* Participants */}
//             <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-all duration-300">
//               <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 group-hover/item:scale-110 transition-transform duration-300`}>
//                 <Users className={`h-5 w-5 ${config.icon}`} />
//               </div>
//               <div className="flex-1">
//                 <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Participants</div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                     {event.registered_count || 0}
//                   </span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">registered</span>
//                   {popularityLevel === 'high' && (
//                     <div className="flex items-center gap-1">
//                       <TrendingUp className="h-4 w-4 text-pink-500 animate-bounce" />
//                       <Zap className="h-3 w-3 text-orange-500" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Call to Action */}
//           <div className="pt-4">
//             <div className="group/cta flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer">
//               <div className="flex items-center gap-3">
//                 <Star className="h-5 w-5 text-purple-600 group-hover/cta:animate-spin" />
//                 <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover/cta:text-purple-600 dark:group-hover/cta:text-purple-400 transition-colors duration-300">
//                   View Details
//                 </span>
//               </div>
//               <ArrowRight className="h-5 w-5 text-gray-400 group-hover/cta:text-purple-600 group-hover/cta:translate-x-1 transition-all duration-300" />
//             </div>
//           </div>
//         </div>

//         {/* Bottom accent line */}
//         <div className={`h-1 bg-gradient-to-r ${config.bg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}></div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           25% { transform: translateY(-10px) rotate(5deg); }
//           50% { transform: translateY(-15px) rotate(-5deg); }
//           75% { transform: translateY(-5px) rotate(3deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default EventCard;
import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDate } from "../../../lib/utils";

function EventCard({ event }) {
  const today = new Date();
  const eventDate = new Date(event.start_date);

  const isToday = () =>
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear();

  const isTomorrow = () => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return (
      eventDate.getDate() === tomorrow.getDate() &&
      eventDate.getMonth() === tomorrow.getMonth() &&
      eventDate.getFullYear() === tomorrow.getFullYear()
    );
  };

  return (
    <div className="group relative block">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-lg group-hover:blur-xl"></div>

      {/* Card */}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100 dark:border-gray-800 ${
          isToday() ? "ring-2 ring-orange-400 shadow-orange-200/50 dark:shadow-orange-900/50" : ""
        }`}
      >
        {/* Banner */}
        <div className="relative h-32 overflow-hidden rounded-t-2xl group-hover:cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out transform group-hover:scale-110"
            style={{
              backgroundImage: `url(${event.event_image || "/default-banner.jpg"})`,
            }}
          ></div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/40 via-purple-600/30 to-indigo-700/40 transition-transform duration-500 ease-in-out group-hover:scale-110"></div>

          {/* Floating icon */}
          <div className="absolute bottom-4 left-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* TODAY / TOMORROW badge */}
          {isToday() && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400 rounded-full blur animate-pulse"></div>
                <span className="relative px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-lg border border-orange-300">
                  🔥 TODAY
                </span>
              </div>
            </div>
          )}
          {isTomorrow() && !isToday() && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur animate-pulse"></div>
                <span className="relative px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg border border-yellow-300">
                  🔜 TOMORROW
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="p-6 space-y-5">
          {/* Event title */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
              {event.event_name}
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full group-hover:w-20 transition-all duration-500"></div>
          </div>

          {/* Event details */}
          <div className="space-y-4">
            {/* Start date */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30 group-hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {formatDate(event.start_date)}
              </span>
            </div>

            {/* Venue */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30 group-hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300 truncate">
                {event.venue}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30 group-hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-sm font-medium text-violet-800 dark:text-violet-300 truncate">
                {formatDate(event.start_date)} - {formatDate(event.end_date)}
              </span>
            </div>
          </div>

          {/* View details button */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Available
                </span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                <span className="text-sm">View Details</span>
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
