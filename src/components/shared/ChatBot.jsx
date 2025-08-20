// import React, { useState, useEffect } from 'react';
// import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../lib/api';
// import toast from 'react-hot-toast';

// const FAQs = [
//   {
//     id: 1,
//     question: "I can't register for an event",
//     category: "registration"
//   },
//   {
//     id: 2,
//     question: "Payment failed but amount deducted",
//     category: "payment"
//   },
//   {
//     id: 3,
//     question: "Unable to download certificate",
//     category: "certificate"
//   },
//   {
//     id: 4,
//     question: "Event attendance not marked",
//     category: "attendance"
//   },
//   {
//     id: 5,
//     question: "Other issue",
//     category: "other"
//   }
// ];

// function ChatBot() {
//   const { user } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [step, setStep] = useState(0);
//   const [selectedFAQ, setSelectedFAQ] = useState(null);
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       addMessage("Hi! How can I help you today?", true);
//       setStep(1);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (user) {
//       fetchComplaints();
//     }
//   }, [user]);

//   const fetchComplaints = async () => {
//     try {
//       const response = await api.get('/complaints/my-complaints');
//       setComplaints(response.data);
//     } catch (error) {
//       console.error('Failed to fetch complaints:', error);
//     }
//   };

//   const addMessage = (text, isBot = false, options = null) => {
//     setMessages(prev => [...prev, { text, isBot, options }]);
//   };

//   const handleFAQSelect = (faq) => {
//     setSelectedFAQ(faq);
//     addMessage(faq.question, false);
//     if (faq.category === 'other') {
//       addMessage("Please describe your issue:", true);
//       setStep(3);
//     } else {
//       addMessage("Please provide more details about your issue:", true);
//       setStep(3);
//     }
//   };

//   const botIsOpen = () => setIsOpen(!isOpen);

//   const handleSubmit = async () => {
//     if (!input.trim()) return;

//     try {
//       const complaintData = {
//         student_id: user.id,
//         category: selectedFAQ?.category || 'other',
//         complaint_text: input,
//         status: 'pending'
//       };

//       await api.post('/complaints', complaintData);
      
//       addMessage(input, false);
//       addMessage("Thank you for submitting your complaint. We'll get back to you soon!", true);
//       setInput('');
//       setStep(4);
//       fetchComplaints();
//       toast.success('Complaint submitted successfully');
//     } catch (error) {
//       toast.error('Failed to submit complaint');
//     }
//   };

//   const resetChat = () => {
//     setMessages([]);
//     setStep(0);
//     setSelectedFAQ(null);
//     setInput('');
//     setIsOpen(false);
//   };

//   return (
//     <>
//       {/* Chat button with premium styling */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={botIsOpen}
//           className="group relative p-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ease-out transform hover:scale-110 hover:rotate-3"
//         >
//           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse opacity-75"></div>
//           <MessageCircle className="relative h-7 w-7 group-hover:animate-bounce" />
          
//           {/* Notification dot */}
//           <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white animate-ping"></div>
//           <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white"></div>
//         </button>
//       </div>

//       {/* Chat window with enhanced mobile responsiveness and fixed scrolling */}
//       {isOpen && (
//         <>
//           {/* Mobile backdrop */}
//           <div 
//             className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
//             onClick={() => setIsOpen(false)}
//           ></div>
          
//           {/* Fixed height container with proper flex layout */}
//           <div className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-96 h-[70vh] md:h-[70vh] z-50 md:rounded-2xl flex flex-col">
//             {/* Animated background gradient */}
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 md:rounded-2xl"></div>
//             <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl md:rounded-2xl"></div>
            
//             {/* Content container with proper flex layout */}
//             <div className="relative h-full flex flex-col">
              
//               {/* Fixed Header */}
//               <div className="flex-shrink-0 flex justify-between items-center p-6 md:p-4 border-b border-purple-200/30 dark:border-gray-600/30">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                   <h3 className="text-xl md:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                     NRolEHub Support
//                   </h3>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button 
//                     onClick={resetChat}
//                     className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800/30 rounded-xl transition-all duration-200 hover:scale-110"
//                   >
//                     {/* <MessageCircle className="h-5 w-5 text-purple-600" /> */}
//                   </button>
//                   <button 
//                     onClick={() => setIsOpen(false)}
//                     className="p-2 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-xl transition-all duration-200 hover:scale-110"
//                   >
//                     <X className="h-5 w-5 text-red-600" />
//                   </button>
//                 </div>
//               </div>

//               {/* Scrollable content area */}
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="flex-1 overflow-y-auto px-6 md:px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                  
//                   {/* Messages */}
//                   <div className="space-y-4">
//                     {messages.map((msg, i) => (
//                       <div
//                         key={i}
//                         className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
//                         style={{ animationDelay: `${i * 100}ms` }}
//                       >
//                         <div className={`max-w-[85%] md:max-w-[80%] p-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
//                           msg.isBot 
//                             ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600/50' 
//                             : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-purple-500/25'
//                         }`}>
//                           <span className="text-sm md:text-base leading-relaxed">{msg.text}</span>
//                         </div>
//                       </div>
//                     ))}

//                     {/* FAQ Options */}
//                     {step === 1 && (
//                       <div className="space-y-3 animate-in fade-in duration-500">
//                         {FAQs.map((faq, index) => (
//                           <button
//                             key={faq.id}
//                             onClick={() => handleFAQSelect(faq)}
//                             className="w-full p-4 text-left rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-1"
//                             style={{ animationDelay: `${index * 100}ms` }}
//                           >
//                             <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
//                               {faq.question}
//                             </span>
//                             <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Recent Complaints - now inside scrollable area */}
//                   {complaints.length > 0 && (
//                     <div className="pt-4 border-t border-purple-200/50 dark:border-gray-600/50 animate-in slide-in-from-bottom duration-500">
//                       <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
//                         <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
//                         Recent Complaints
//                       </h4>
//                       <div className="space-y-2">
//                         {complaints.slice(0, 3).map((complaint, index) => (
//                           <div
//                             key={complaint.id}
//                             className="text-sm p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 transform hover:scale-[1.02] animate-in slide-in-from-left duration-300"
//                             style={{ animationDelay: `${index * 100}ms` }}
//                           >
//                             <div className="flex justify-between items-center">
//                               <span className="truncate text-gray-700 dark:text-gray-200 flex-1 mr-2">
//                                 {complaint.complaint_text}
//                               </span>
//                               <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
//                                 complaint.status === 'resolved' 
//                                   ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400'
//                                   : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20 dark:text-yellow-400'
//                               }`}>
//                                 {complaint.status}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Fixed Input area at bottom */}
//                 {step === 3 && (
//                   <div className="flex-shrink-0 p-4 border-t border-purple-200/30 dark:border-gray-600/30">
//                     <div className="flex space-x-3 p-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800/50 dark:to-purple-800/20 rounded-2xl border border-purple-200/50 dark:border-purple-500/30">
//                       <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
//                         placeholder="Type your message..."
//                         className="flex-1 p-3 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm md:text-base"
//                       />
//                       <button
//                         onClick={handleSubmit}
//                         disabled={!input.trim()}
//                         className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                       >
//                         <Send className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Custom styles for animations and scrollbar */}
//       <style jsx>{`
//         @keyframes animate-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-in {
//           animation: animate-in 0.3s ease-out forwards;
//         }
        
//         .scrollbar-thin::-webkit-scrollbar {
//           width: 4px;
//         }
        
//         .scrollbar-thumb-purple-300::-webkit-scrollbar-thumb {
//           background-color: rgb(196 181 253);
//           border-radius: 9999px;
//         }
        
//         .scrollbar-track-transparent::-webkit-scrollbar-track {
//           background-color: transparent;
//         }
        
//         .slide-in-from-bottom-2 {
//           animation: slideInFromBottom 0.3s ease-out;
//         }
        
//         .slide-in-from-left {
//           animation: slideInFromLeft 0.3s ease-out;
//         }
        
//         .slide-in-from-bottom {
//           animation: slideInFromBottom 0.5s ease-out;
//         }
        
//         .fade-in {
//           animation: fadeIn 0.5s ease-out;
//         }
        
//         @keyframes slideInFromBottom {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slideInFromLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// export default ChatBot;
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  ChevronRight,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  RefreshCw,
  AlertCircle,
  CreditCard,
  FileText,
  Users,
  LogIn,
  HelpCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/api";
import toast from "react-hot-toast";

// Custom CSS styles for fancy scrollbar
const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
    background-clip: content-box;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(147, 51, 234, 1));
    background-clip: content-box;
  }

  /* Dark mode scrollbar */
  @media (prefers-color-scheme: dark) {
    .custom-scrollbar {
      scrollbar-color: rgba(107, 114, 128, 0.6) transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
    }
  }

  /* Smooth scrolling animation */
  .custom-scrollbar {
    scroll-behavior: smooth;
  }

  /* Hide scrollbar on mobile for cleaner look */
  @media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
  }
`;

const CONVERSATION_STATES = {
  GREETING: "greeting",
  CATEGORY_SELECTION: "category_selection",
  PROBLEM_INQUIRY: "problem_inquiry",
  PROVIDING_HELP: "providing_help",
  SATISFACTION_CHECK: "satisfaction_check",
  COMPLAINT_COLLECTION: "complaint_collection",
  SUBEVENT_REGISTRATION: "subevent_registration",
  EVENT_SELECTION: "event_selection",
  EVENT_STATUS_DISPLAY: "event_status_display",
  STATUS_INQUIRY: "status_inquiry",
  CONVERSATION_END: "conversation_end",
  POST_COMPLAINT_FOLLOW_UP: "post_complaint_follow_up",
};

const COMPLAINT_CATEGORIES = [
  {
    key: "registration",
    title: "Registration Issues",
    description: "Sign up problems, event joining issues",
    icon: Users,
    color: "blue",
    keywords: ["register", "registration", "sign up", "join event"],
  },
  {
    key: "payment",
    title: "Payment Problems",
    description: "Transaction issues, refunds, billing",
    icon: CreditCard,
    color: "green",
    keywords: ["payment", "pay", "money", "deducted", "charged", "transaction"],
  },
  {
    key: "certificate",
    title: "Certificate Issues",
    description: "Download problems, missing certificates",
    icon: Award,
    color: "purple",
    keywords: ["certificate", "download", "cert", "diploma"],
  },
  {
    key: "attendance",
    title: "Attendance Concerns",
    description: "Marking issues, presence verification",
    icon: CheckCircle,
    color: "orange",
    keywords: ["attendance", "present", "absent", "mark", "attend"],
  },
  {
    key: "login",
    title: "Login & Account",
    description: "Password, access, account issues",
    icon: LogIn,
    color: "red",
    keywords: ["login", "password", "forgot", "access", "account"],
  },
  {
    key: "subevent_registration",
    title: "SubEvent Status",
    description: "Check your event registrations status",
    icon: FileText,
    color: "indigo",
    keywords: ["subevent", "sub event", "sub-event", "status", "check"],
  },
  {
    key: "other",
    title: "Other Issues",
    description: "Something else? We're here to help",
    icon: HelpCircle,
    color: "gray",
    keywords: [],
  },
];
// ...existing code...

const COMMON_ISSUES = {
  registration: {
    response: [
      <span key="title">📝 <b>Registration Help</b></span>,
      <span key="1">1️⃣ Ensure you're <b>logged in</b>.</span>,
      <span key="2">2️⃣ Check if the event is <b>still open</b> for registration.</span>,
      <span key="3">💳 Verify your <b>payment method</b> if it's a paid event.</span>,
      <span key="4">❓ Still having trouble? I can help you check your specific registrations.</span>,
    ],
  },
  payment: {
    response: [
      <span key="title">💸 <b>Payment Issues</b></span>,
      <span key="1">1️⃣ Check your <b>email</b> for payment confirmation.</span>,
      <span key="2">2️⃣ Verify the transaction in your <b>bank statement</b>.</span>,
      <span key="3">⚠️ If payment was <b>deducted but registration failed</b>, contact support immediately.</span>,
      <span key="4">🔍 I can help you check your payment status for specific events.</span>,
    ],
  },
  certificate: {
    response: [
      <span key="title">🎓 <b>Certificate Issues</b></span>,
      <span key="1">1️⃣ Certificates are generated <b>after event completion</b> and attendance verification.</span>,
      <span key="2">2️⃣ Check your <b>registered events</b> to see certificate status.</span>,
      <span key="3">3️⃣ Ensure you <b>attended</b> the event.</span>,
      <span key="4">📄 I can help you check your certificate status.</span>,
    ],
  },
  attendance: {
    response: [
      <span key="title">🕒 <b>Attendance Concerns</b></span>,
      <span key="1">1️⃣ Attendance is marked by <b>event organizers</b> during the event.</span>,
      <span key="2">2️⃣ You must be <b>physically present</b> to be marked.</span>,
      <span key="3">3️⃣ Contact event organizers if you were present but <b>not marked</b>.</span>,
      <span key="4">✅ I can help you check your attendance status.</span>,
    ],
  },
  login: {
    response: [
      <span key="title">🔐 <b>Login & Account Issues</b></span>,
      <span key="1">1️⃣ Use the <b>'Forgot Password'</b> option if you can't remember your password.</span>,
      <span key="2">2️⃣ Ensure you're using the <b>correct email address</b>.</span>,
      <span key="3">3️⃣ Check your email for <b>verification links</b>.</span>,
      <span key="4">🔄 Try logging out and back in.</span>,
    ],
  },
};

// Complaints Popup Component
function ComplaintsPopup({ isOpen, onClose, complaints }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Your Support Tickets ({complaints.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
          {complaints.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Support Tickets
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You haven't submitted any support tickets yet.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  {/* Ticket Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Ticket #{complaint.id}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.status === "resolved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : complaint.status === "in_progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {complaint.status === "resolved" ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Resolved
                          </div>
                        ) : complaint.status === "in_progress" ? (
                          <div className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            In Progress
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Category */}
                  {complaint.category && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                        {complaint.category.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Event Info */}
                  {complaint.event_name && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                      <div className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>Event:</strong> {complaint.event_name}
                        {complaint.subevent_title && (
                          <span> - {complaint.subevent_title}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Complaint Text */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Issue Description:
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded border">
                      {complaint.complaint_text
                        .split("\n")
                        .map((line, index) => (
                          <div key={index} className="mb-1">
                            {line}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Admin Response */}
                  {complaint.admin_response && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                        Support Response:
                      </h4>
                      <div className="text-sm text-green-700 dark:text-green-400">
                        {complaint.admin_response
                          .split("\n")
                          .map((line, index) => (
                            <div key={index} className="mb-1">
                              {line}
                            </div>
                          ))}
                      </div>
                      {complaint.resolved_at && (
                        <div className="text-xs text-green-600 dark:text-green-500 mt-2">
                          Resolved on{" "}
                          {new Date(complaint.resolved_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending Message */}
                  {!complaint.admin_response &&
                    complaint.status === "pending" && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Our support team will respond within 24 hours.
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function injectScrollbarStyles() {
  if (typeof window === "undefined") return;
  if (document.getElementById("custom-scrollbar-style")) return;
  const style = document.createElement("style");
  style.id = "custom-scrollbar-style";
  style.innerHTML = scrollbarStyles;
  document.head.appendChild(style);
}

function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showComplaintsPopup, setShowComplaintsPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState(
    CONVERSATION_STATES.GREETING
  );
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStatuses, setEventStatuses] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [currentIssueCategory, setCurrentIssueCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    injectScrollbarStyles();
  }, []);

  // Initialize conversation when chat opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeConversation();
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

  // Force scroll to top on fresh open
  useLayoutEffect(() => {
    if (isOpen && chatContainerRef.current && messages.length <= 2) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  // Auto-scroll to bottom only for new messages (not initial load)
  useEffect(() => {
    if (isOpen && messages.length > 2) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints/my-complaints");
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await api.get("/registrations/my-registrations");
      const paidRegistrations = response.data.filter(
        (reg) => reg.payment_status === "paid"
      );

      // Enhance registrations with event and subevent details
      const enhancedRegistrations = await Promise.all(
        paidRegistrations.map(async (reg) => {
          try {
            const [eventResponse, subeventsResponse] = await Promise.all([
              api.get(`/events/${reg.event_id}`),
              api.get(`/subevents/${reg.event_id}`),
            ]);

            const event = eventResponse.data;
            const subevent = subeventsResponse.data.subevents.find(
              (se) => se.id === reg.subevent_id
            );

            return {
              ...reg,
              event_name: event?.event_name || reg.event_name,
              subevent_title: subevent?.title || "Sub Event",
              event_details: event,
            };
          } catch (error) {
            console.error("Failed to fetch event/subevent details:", error);
            return {
              ...reg,
              subevent_title: "Sub Event",
            };
          }
        })
      );

      setUserRegistrations(enhancedRegistrations);
      return enhancedRegistrations;
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      return [];
    }
  };

  const fetchEventStatus = async (registration) => {
    try {
      // Check certificate status
      let certificateStatus = "Not Generated";
      try {
        await api.get(`/certificates/${registration.event_id}`, {
          params: { subevent_id: registration.subevent_id },
        });
        certificateStatus = "Generated";
      } catch (error) {
        certificateStatus = "Not Generated";
      }

      // Check winner status
      let winnerStatus = null;
      try {
        const leaderboardResponse = await api.get(
          `/leaderboard/${registration.event_id}`,
          {
            params: { subevent_id: registration.subevent_id },
          }
        );

        const userEntry = leaderboardResponse.data.find(
          (entry) => entry.student_id === user.id
        );

        if (userEntry && userEntry.rank <= 3) {
          const rankSuffix =
            userEntry.rank === 1 ? "st" : userEntry.rank === 2 ? "nd" : "rd";
          const emoji =
            userEntry.rank === 1 ? "🥇" : userEntry.rank === 2 ? "🥈" : "🥉";
          winnerStatus = `You secured ${userEntry.rank}${rankSuffix} place ${emoji}`;
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }

      return {
        attendance: registration.attendance ? "Marked" : "Not Marked",
        payment:
          registration.payment_status === "paid" ? "Completed" : "Pending",
        certificate: certificateStatus,
        winner: winnerStatus,
      };
    } catch (error) {
      console.error("Failed to fetch event status:", error);
      return {
        attendance: "Unknown",
        payment: "Unknown",
        certificate: "Unknown",
        winner: null,
      };
    }
  };

  const initializeConversation = () => {
    setMessages([]);
    addMessage(
      `Hello ${
        user?.username || "there"
      }! 👋 I'm here to help you with any issues you might be facing.`,
      true
    );
    addMessage(
      "Please select the category that best describes your issue:",
      true,
      {
        type: "category_selection",
        categories: COMPLAINT_CATEGORIES,
      }
    );
    setConversationState(CONVERSATION_STATES.CATEGORY_SELECTION);
  };

  const addMessage = (text, isBot = false, options = null) => {
    setMessages((prev) => [
      ...prev,
      { text, isBot, options, timestamp: Date.now() },
    ]);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      green:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-800 dark:text-green-300",
      purple:
        "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      orange:
        "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-800 dark:text-orange-300",
      red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-800 dark:text-red-300",
      indigo:
        "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
      gray: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300",
    };
    return colorMap[color] || colorMap.gray;
  };

  const handleCategorySelection = async (category) => {
    setCurrentIssueCategory(category.key);

    if (category.key === "subevent_registration") {
      addMessage(
        "Let me fetch your registered events to check their status...",
        true
      );
      const registrations = await fetchUserRegistrations();

      if (registrations.length === 0) {
        addMessage(
          "It looks like you haven't registered for any events yet. Would you like me to help you find available events?",
          true
        );
        setConversationState(CONVERSATION_STATES.SATISFACTION_CHECK);
      } else {
        addMessage(
          "Here are your registered events. Click on any event to check its detailed status:",
          true,
          {
            type: "event_list",
            events: registrations,
          }
        );
        setConversationState(CONVERSATION_STATES.EVENT_SELECTION);
      }
    } else if (category.key !== "other") {
      // Provide direct answer for common issues
      const response = COMMON_ISSUES[category.key].response.map((line, index) => (
        <div key={index}>{line}<br /></div>
      ));
      addMessage(response, true);
      addMessage("Did this solve your problem?", true, {
        type: "yes_no",
        options: ["Yes, this helped!", "No, I need more help"],
      });
      setConversationState(CONVERSATION_STATES.SATISFACTION_CHECK);
    } else {
      // For other issues, ask for more details
      addMessage(
        "I'd be happy to help! Could you provide more specific details about the issue you're experiencing?",
        true
      );
      addMessage(
        "Or would you like me to connect you with our support team?",
        true,
        {
          type: "yes_no",
          options: ["Provide more details", "Contact support team"],
        }
      );
      setConversationState(CONVERSATION_STATES.SATISFACTION_CHECK);
    }
  };

  const handleUserInput = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, false);
    setInput("");

    switch (conversationState) {
      case CONVERSATION_STATES.PROBLEM_INQUIRY:
        await handleProblemInquiry(userMessage);
        break;

      case CONVERSATION_STATES.SATISFACTION_CHECK:
        await handleSatisfactionResponse(userMessage);
        break;

      case CONVERSATION_STATES.COMPLAINT_COLLECTION:
        await handleComplaintSubmission(userMessage);
        break;

      case CONVERSATION_STATES.STATUS_INQUIRY:
        await handleStatusInquiry(userMessage);
        break;

      case CONVERSATION_STATES.POST_COMPLAINT_FOLLOW_UP:
        await handlePostComplaintFollowUp(userMessage);
        break;

      default:
        addMessage(
          "I'm not sure how to help with that. Let me restart our conversation.",
          true
        );
        setTimeout(() => initializeConversation(), 1000);
        break;
    }
  };

  const handleProblemInquiry = async (userMessage) => {
    addMessage(
      "Let me help you with that. Please select a category to get started:",
      true,
      {
        type: "category_selection",
        categories: COMPLAINT_CATEGORIES,
      }
    );
    setConversationState(CONVERSATION_STATES.CATEGORY_SELECTION);
  };

  const handleSatisfactionResponse = async (userMessage) => {
    const response = userMessage.toLowerCase();

    if (
      response.includes("yes") ||
      response.includes("helped") ||
      response.includes("solved")
    ) {
      addMessage(
        "Great! I'm glad I could help. Feel free to reach out anytime if you have more questions. Have a wonderful day! 😊",
        true
      );
      setConversationState(CONVERSATION_STATES.CONVERSATION_END);
    } else if (
      response.includes("no") ||
      response.includes("more help") ||
      response.includes("support") ||
      response.includes("details")
    ) {
      addMessage(
        "I understand you need additional assistance. Please describe your specific issue in detail, and I'll make sure our support team gets your message.",
        true
      );
      setConversationState(CONVERSATION_STATES.COMPLAINT_COLLECTION);
    } else {
      addMessage(
        "I didn't quite understand that. Could you please respond with 'Yes' if your issue is resolved, or 'No' if you need more help?",
        true
      );
    }
  };

  const handleComplaintSubmission = async (userMessage) => {
    try {
      let complaintText = userMessage;

      // If user has selected an event and we have status information, include it automatically
      if (selectedEvent && eventStatuses) {
        const eventInfo = `
Event Details:
- Event Name: ${selectedEvent.event_name}
- Sub-Event: ${selectedEvent.subevent_title}
- Registration ID: ${selectedEvent.id}

Current Status:
- Attendance: ${eventStatuses.attendance}
- Payment: ${eventStatuses.payment}
- Certificate: ${eventStatuses.certificate}
${eventStatuses.winner ? `- Achievement: ${eventStatuses.winner}` : ""}

User's Issue Description:
${userMessage}`;

        complaintText = eventInfo;
      }

      const complaintData = {
        student_id: user.id,
        event_id: selectedEvent?.event_id || null,
        subevent_id: selectedEvent?.subevent_id || null,
        category: currentIssueCategory || "other",
        complaint_text: complaintText,
        status: "pending",
        event_name: selectedEvent?.event_name || null,
        subevent_title: selectedEvent?.subevent_title || null,
      };

      await api.post("/complaints", complaintData);

      if (selectedEvent) {
        addMessage(
          `Thank you for providing those details. I've submitted your complaint about "${selectedEvent.event_name} - ${selectedEvent.subevent_title}" to our support team with all the relevant event status information.`,
          true
        );
      } else {
        addMessage(
          "Thank you for providing those details. I've submitted your complaint to our support team.",
          true
        );
      }

      addMessage(
        "You'll receive an email response within 24 hours. Do you need help with anything else today?",
        true,
        {
          type: "post_complaint_options",
          options: ["Yes, different issue", "No, that's all"],
        }
      );

      fetchComplaints();
      setConversationState(CONVERSATION_STATES.POST_COMPLAINT_FOLLOW_UP);
      toast.success("Complaint submitted successfully");
    } catch (error) {
      addMessage(
        "I'm sorry, there was an error submitting your complaint. Please try again or contact support directly.",
        true
      );
      toast.error("Failed to submit complaint");
    }
  };

  const handlePostComplaintFollowUp = async (userMessage) => {
    const response = userMessage.toLowerCase();

    if (response.includes("yes") || response.includes("different")) {
      addMessage(
        "I'm here to help with your next issue. Please select a category:",
        true,
        {
          type: "category_selection",
          categories: COMPLAINT_CATEGORIES,
        }
      );
      setConversationState(CONVERSATION_STATES.CATEGORY_SELECTION);
      // Reset state for new issue
      setSelectedEvent(null);
      setEventStatuses(null);
      setCurrentIssueCategory(null);
    } else {
      addMessage(
        "Thank you for using NRolEHub Support! Have a great day! 😊",
        true
      );
      setConversationState(CONVERSATION_STATES.CONVERSATION_END);
    }
  };

  const handleEventSelection = async (event) => {
    setSelectedEvent(event);
    addMessage(
      "Please wait while I fetch the latest status information...",
      true
    );

    const statuses = await fetchEventStatus(event);
    setEventStatuses(statuses);

    // Enhanced status display with better UI
    addMessage("Here's your registration status:", true, {
      type: "status_display",
      event: event,
      statuses: statuses,
    });

    addMessage("Which of the above statuses is your concern?", true, {
      type: "status_options",
      options: [
        "Attendance not marked",
        "Payment issue",
        "Certificate not available",
        ...(statuses.winner ? ["Winner status query"] : []),
        "Other issue",
      ],
    });
    setConversationState(CONVERSATION_STATES.STATUS_INQUIRY);
  };

  const handleStatusInquiry = async (userMessage) => {
    const concern = userMessage.toLowerCase();
    let response = "";

    if (concern.includes("attendance")) {
      response = `For attendance issues with "${selectedEvent?.event_name} - ${selectedEvent?.subevent_title}": Attendance is marked by event organizers during the event. If you were present but not marked, please contact the event organizers immediately. I'll submit this as a priority complaint with your current status details.`;
    } else if (concern.includes("payment")) {
      response = `For payment issues with "${selectedEvent?.event_name} - ${selectedEvent?.subevent_title}": I'll help you escalate this to our finance team with your current payment status. Payment discrepancies are handled with high priority to ensure quick resolution.`;
    } else if (concern.includes("certificate")) {
      response = `For certificate issues with "${selectedEvent?.event_name} - ${selectedEvent?.subevent_title}": Certificates are generated after event completion and attendance verification. Since your attendance is ${eventStatuses?.attendance}, I'll report this to the admin team with full status details.`;
    } else if (concern.includes("winner")) {
      response = `For winner status queries regarding "${selectedEvent?.event_name} - ${selectedEvent?.subevent_title}": If you believe there's an error in the results or have questions about the ranking, I'll forward this to the event management team for review with your current status.`;
    } else {
      response = `I understand you have a specific concern about "${selectedEvent?.event_name} - ${selectedEvent?.subevent_title}". Let me collect the details and ensure the right team handles your issue with all the relevant event information.`;
    }

    addMessage(response, true);
    addMessage(
      "Please provide any additional details about this issue. I'll automatically include your event information and current status when submitting your complaint:",
      true
    );
    setConversationState(CONVERSATION_STATES.COMPLAINT_COLLECTION);
  };

  const handleOptionClick = async (option, optionType) => {
    if (optionType === "category_selection") {
      // Don't add user message here as it will be added by handleCategorySelection
      await handleCategorySelection(option);
    } else {
      // For other types, add the user message
      addMessage(option.title || option, false);

      if (optionType === "yes_no") {
        await handleSatisfactionResponse(option);
      } else if (optionType === "event_list") {
        await handleEventSelection(option);
      } else if (optionType === "status_options") {
        await handleStatusInquiry(option);
      } else if (optionType === "post_complaint_options") {
        await handlePostComplaintFollowUp(option);
      }
    }
  };

  const resetChat = () => {
    setMessages([]);
    setConversationState(CONVERSATION_STATES.GREETING);
    setSelectedEvent(null);
    setEventStatuses(null);
    setCurrentIssueCategory(null);
    setInput("");
    setIsInitialized(false);
  };

  const restartConversation = () => {
    addMessage(
      "I'm here to help with your next issue. Please select a category:",
      true,
      {
        type: "category_selection",
        categories: COMPLAINT_CATEGORIES,
      }
    );
    setConversationState(CONVERSATION_STATES.CATEGORY_SELECTION);
    setSelectedEvent(null);
    setEventStatuses(null);
    setCurrentIssueCategory(null);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => {
          setIsOpen(true);
            resetChat();
        }}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-110 transition-all duration-200 hover:shadow-xl z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] glass-card max-h-[70vh] flex flex-col z-40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NRolEHub Support
            </h3>
            <div className="flex items-center space-x-2">
              {/* View Complaints Button */}
              {complaints.length > 0 && (
                <button
                  onClick={() => setShowComplaintsPopup(true)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
                  title="View your support tickets"
                >
                  <Eye className="h-5 w-5 text-gray-500" />
                  {complaints.filter((c) => c.status !== "resolved").length >
                    0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {
                          complaints.filter((c) => c.status !== "resolved")
                            .length
                        }
                      </span>
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={resetChat}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Restart conversation"
              >
                <RefreshCw className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96 custom-scrollbar"
            ref={chatContainerRef}
          >
            {messages.map((msg, i) => (
              <div key={i} className="space-y-3">
                <div
                  className={`flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      msg.isBot
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>

                {/* Render options */}
                {msg.options && (
                  <div className="ml-2 space-y-3">
                    {msg.options.type === "category_selection" && (
                      <div className="grid grid-cols-1 gap-2">
                        {msg.options.categories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <button
                              key={category.key}
                              onClick={() =>
                                handleOptionClick(
                                  category,
                                  "category_selection"
                                )
                              }
                              className={`p-3 rounded-lg border transition-all duration-200 ${getColorClasses(
                                category.color
                              )}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-sm">
                                    {category.title}
                                  </div>
                                  <div className="text-xs opacity-75 mt-1">
                                    {category.description}
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-50" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {(msg.options.type === "yes_no" ||
                      msg.options.type === "post_complaint_options") && (
                      <div className="flex flex-wrap gap-2">
                        {msg.options.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              handleOptionClick(option, msg.options.type)
                            }
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.options.type === "event_list" && (
                      <div className="space-y-2">
                        {msg.options.events.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => handleEventSelection(event)}
                            className="w-full p-3 text-left rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {event.event_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {event.subevent_title}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.options.type === "status_display" && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Event Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {msg.options.event.event_name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {msg.options.event.subevent_title}
                          </p>
                        </div>

                        {/* Status Cards */}
                        <div className="p-4 space-y-3">
                          {/* Attendance Status */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-full ${
                                  msg.options.statuses.attendance === "Marked"
                                    ? "bg-green-100 dark:bg-green-900/20"
                                    : "bg-red-100 dark:bg-red-900/20"
                                }`}
                              >
                                {msg.options.statuses.attendance ===
                                "Marked" ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  Attendance
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Event participation status
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                msg.options.statuses.attendance === "Marked"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {msg.options.statuses.attendance}
                            </div>
                          </div>

                          {/* Payment Status */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-full ${
                                  msg.options.statuses.payment === "Completed"
                                    ? "bg-green-100 dark:bg-green-900/20"
                                    : "bg-yellow-100 dark:bg-yellow-900/20"
                                }`}
                              >
                                <CreditCard
                                  className={`h-4 w-4 ${
                                    msg.options.statuses.payment === "Completed"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-yellow-600 dark:text-yellow-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  Payment
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Transaction status
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                msg.options.statuses.payment === "Completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {msg.options.statuses.payment}
                            </div>
                          </div>

                          {/* Certificate Status */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-full ${
                                  msg.options.statuses.certificate ===
                                  "Generated"
                                    ? "bg-green-100 dark:bg-green-900/20"
                                    : "bg-gray-100 dark:bg-gray-600"
                                }`}
                              >
                                <Award
                                  className={`h-4 w-4 ${
                                    msg.options.statuses.certificate ===
                                    "Generated"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  Certificate
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Completion certificate
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                msg.options.statuses.certificate === "Generated"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {msg.options.statuses.certificate}
                            </div>
                          </div>

                          {/* Winner Status (if applicable) */}
                          {msg.options.statuses.winner && (
                            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                  <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-yellow-800 dark:text-yellow-300">
                                    🎉 Congratulations!
                                  </div>
                                  <div className="text-sm text-yellow-700 dark:text-yellow-400">
                                    {msg.options.statuses.winner}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {msg.options.type === "status_options" && (
                      <div className="space-y-2">
                        {msg.options.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              handleOptionClick(option, "status_options")
                            }
                            className="w-full p-3 text-left rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {option}
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          {conversationState !== CONVERSATION_STATES.CONVERSATION_END && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUserInput()}
                placeholder="Type your message..."
                className="glass-input flex-1 text-sm"
              />
              <button
                onClick={handleUserInput}
                disabled={!input.trim()}
                className="btn btn-primary p-2 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Restart conversation button */}
          {conversationState === CONVERSATION_STATES.CONVERSATION_END && (
            <div className="flex space-x-2">
              <button
                onClick={restartConversation}
                className="flex-1 btn btn-primary text-sm"
              >
                Ask Another Question
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary text-sm"
              >
                Close Chat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Complaints Popup */}
      <ComplaintsPopup
        isOpen={showComplaintsPopup}
        onClose={() => setShowComplaintsPopup(false)}
        complaints={complaints}
      />
    </>
  );
}

export default ChatBot;

