import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const FAQs = [
  {
    id: 1,
    question: "I can't register for an event",
    category: "registration"
  },
  {
    id: 2,
    question: "Payment failed but amount deducted",
    category: "payment"
  },
  {
    id: 3,
    question: "Unable to download certificate",
    category: "certificate"
  },
  {
    id: 4,
    question: "Event attendance not marked",
    category: "attendance"
  },
  {
    id: 5,
    question: "Other issue",
    category: "other"
  }
];

function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage("Hi! How can I help you today?", true);
      setStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints/my-complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    }
  };

  const addMessage = (text, isBot = false, options = null) => {
    setMessages(prev => [...prev, { text, isBot, options }]);
  };

  const handleFAQSelect = (faq) => {
    setSelectedFAQ(faq);
    addMessage(faq.question, false);
    if (faq.category === 'other') {
      addMessage("Please describe your issue:", true);
      setStep(3);
    } else {
      addMessage("Please provide more details about your issue:", true);
      setStep(3);
    }
  };

  const botIsOpen = () => setIsOpen(!isOpen);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const complaintData = {
        student_id: user.id,
        category: selectedFAQ?.category || 'other',
        complaint_text: input,
        status: 'pending'
      };

      await api.post('/complaints', complaintData);
      
      addMessage(input, false);
      addMessage("Thank you for submitting your complaint. We'll get back to you soon!", true);
      setInput('');
      setStep(4);
      fetchComplaints();
      toast.success('Complaint submitted successfully');
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStep(0);
    setSelectedFAQ(null);
    setInput('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat button with premium styling */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={botIsOpen}
          className="group relative p-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ease-out transform hover:scale-110 hover:rotate-3"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse opacity-75"></div>
          <MessageCircle className="relative h-7 w-7 group-hover:animate-bounce" />
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white animate-ping"></div>
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white"></div>
        </button>
      </div>

      {/* Chat window with enhanced mobile responsiveness and fixed scrolling */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Fixed height container with proper flex layout */}
          <div className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-96 h-[70vh] md:h-[70vh] z-50 md:rounded-2xl flex flex-col">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 md:rounded-2xl"></div>
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl md:rounded-2xl"></div>
            
            {/* Content container with proper flex layout */}
            <div className="relative h-full flex flex-col">
              
              {/* Fixed Header */}
              <div className="flex-shrink-0 flex justify-between items-center p-6 md:p-4 border-b border-purple-200/30 dark:border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-xl md:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NRolEHub Support
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={resetChat}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800/30 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    {/* <MessageCircle className="h-5 w-5 text-purple-600" /> */}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-6 md:px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                  
                  {/* Messages */}
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className={`max-w-[85%] md:max-w-[80%] p-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                          msg.isBot 
                            ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600/50' 
                            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-purple-500/25'
                        }`}>
                          <span className="text-sm md:text-base leading-relaxed">{msg.text}</span>
                        </div>
                      </div>
                    ))}

                    {/* FAQ Options */}
                    {step === 1 && (
                      <div className="space-y-3 animate-in fade-in duration-500">
                        {FAQs.map((faq, index) => (
                          <button
                            key={faq.id}
                            onClick={() => handleFAQSelect(faq)}
                            className="w-full p-4 text-left rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                              {faq.question}
                            </span>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Complaints - now inside scrollable area */}
                  {complaints.length > 0 && (
                    <div className="pt-4 border-t border-purple-200/50 dark:border-gray-600/50 animate-in slide-in-from-bottom duration-500">
                      <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Recent Complaints
                      </h4>
                      <div className="space-y-2">
                        {complaints.slice(0, 3).map((complaint, index) => (
                          <div
                            key={complaint.id}
                            className="text-sm p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 transform hover:scale-[1.02] animate-in slide-in-from-left duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="truncate text-gray-700 dark:text-gray-200 flex-1 mr-2">
                                {complaint.complaint_text}
                              </span>
                              <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                                complaint.status === 'resolved' 
                                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400'
                                  : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20 dark:text-yellow-400'
                              }`}>
                                {complaint.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fixed Input area at bottom */}
                {step === 3 && (
                  <div className="flex-shrink-0 p-4 border-t border-purple-200/30 dark:border-gray-600/30">
                    <div className="flex space-x-3 p-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800/50 dark:to-purple-800/20 rounded-2xl border border-purple-200/50 dark:border-purple-500/30">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm md:text-base"
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom styles for animations and scrollbar */}
      <style jsx>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thumb-purple-300::-webkit-scrollbar-thumb {
          background-color: rgb(196 181 253);
          border-radius: 9999px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .slide-in-from-bottom-2 {
          animation: slideInFromBottom 0.3s ease-out;
        }
        
        .slide-in-from-left {
          animation: slideInFromLeft 0.3s ease-out;
        }
        
        .slide-in-from-bottom {
          animation: slideInFromBottom 0.5s ease-out;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default ChatBot;
