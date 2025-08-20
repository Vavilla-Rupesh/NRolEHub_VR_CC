// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock ,ArrowLeft} from 'lucide-react';
// import InputField from './InputField';
// import api from '../../lib/api';
// import toast from 'react-hot-toast';

// export default function ForgotPassword() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [tempId, setTempId] = useState(null);
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) return;

//     try {
//       setLoading(true);
//       const response = await api.post('/auth/forgot-password', { email });
//       setTempId(response.data.temp_id);
//       toast.success('OTP sent to your email');
//       setStep(2);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPVerification = async (e) => {
//     e.preventDefault();
//     if (!otp || !tempId) return;

//     try {
//       setLoading(true);
//       await api.post('/auth/verify-reset-otp', {
//         temp_id: tempId,
//         otp: otp.toString()
//       });
//       toast.success('OTP verified successfully');
//       setStep(3);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Invalid OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordReset = async (e) => {
//     e.preventDefault();
//     if (!newPassword || !confirmPassword || !tempId) return;

//     if (newPassword !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.post('/auth/reset-password', {
//         temp_id: tempId,
//         new_password: newPassword
//       });
//       toast.success('Password reset successful');
//       navigate('/login');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to reset password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 w-full h-full">
//         <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
//         <div className="absolute top-[20%] right-[15%] w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-[15%] left-[15%] w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         <div className="glass-card backdrop-blur-lg bg-white/10 dark:bg-gray-900/10 rounded-2xl p-8 shadow-2xl border border-white/20">
//           <button
//             onClick={() => navigate('/login')}
//             className="absolute top-4 left-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>

//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               {step === 1 ? 'Forgot Password' : 
//                step === 2 ? 'Verify OTP' : 
//                'Reset Password'}
//             </h2>
//             <p className="mt-2 text-gray-600 dark:text-gray-300">
//               {step === 1 ? 'Enter your email to receive OTP' :
//                step === 2 ? 'Enter the OTP sent to your email' :
//                'Enter your new password'}
//             </p>
//           </div>

//           {step === 1 && (
//             <form onSubmit={handleEmailSubmit} className="space-y-6">
//               <InputField
//                 icon={Mail}
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn btn-primary w-full"
//               >
//                 {loading ? 'Sending OTP...' : 'Send OTP'}
//               </button>
//             </form>
//           )}

//           {step === 2 && (
//             <form onSubmit={handleOTPVerification} className="space-y-6">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit OTP"
//                 value={otp}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only digits
//                   if (value.length <= 6) {
//                     setOtp(value);
//                   }
//                 }}
//                 required
//                 maxLength={6}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl glass-input text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary w-full"
//             >
//               {loading ? 'Verifying...' : 'Verify OTP'}
//             </button>
//           </form>          
//           )}

//           {step === 3 && (
//             <form onSubmit={handlePasswordReset} className="space-y-6">
//               <InputField
//                 icon={Lock}
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//               />
//               <InputField
//                 icon={Lock}
//                 type="password"
//                 placeholder="Confirm New Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn btn-primary w-full"
//               >
//                 {loading ? 'Resetting...' : 'Reset Password'}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock ,ArrowLeft} from 'lucide-react';
import InputField from './InputField';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [tempId, setTempId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email });
      setTempId(response.data.temp_id);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!otp || !tempId) return;

    try {
      setLoading(true);
      await api.post('/auth/verify-reset-otp', {
        temp_id: tempId,
        otp: otp.toString()
      });
      toast.success('OTP verified successfully');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || !tempId) return;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', {
        temp_id: tempId,
        new_password: newPassword
      });
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Premium gradient background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-cyan-500/20"></div>
      </div> */}

      {/* Animated background elements */}
      {/* <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
         */}
        {/* Floating particles */}
        {/* <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-300/50 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300/40 rounded-full animate-pulse animation-delay-1000"></div>
      </div> */}

      <div className="relative w-full max-w-md mx-auto">
        {/* Glassmorphism card with enhanced styling */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 from-pink-600 to-violet-600 rounded-2xl blur opacity-30 animate-pulse"></div>
          
          <div className="relative backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500 hover:shadow-violet-500/20 hover:shadow-2xl">
            {/* Back button with enhanced styling */}
            <button
              onClick={() => navigate('/login')}
              className="absolute top-4 left-4 p-2.5 hover:bg-gray-200/60 dark:hover:bg-white/20 hover:bg-gray-800/20 rounded-full transition-all duration-300 group hover:scale-110 backdrop-blur-sm border border-gray-300/30 dark:border-white/10"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-white/80 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
            </button>

            {/* Progress indicator */}
            <div className="flex justify-center mb-6 mt-2">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      step >= i 
                        ? 'bg-gradient-to-r from-pink-500 to-violet-500 shadow-lg shadow-pink-400/50' 
                        : 'bg-gray-300 dark:bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Header with enhanced typography */}
            <div className="text-center mb-8">
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 dark:from-pink-400 dark:via-violet-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2 animate-pulse">
                  {step === 1 ? 'Forgot Password' : 
                   step === 2 ? 'Verify OTP' : 
                   'Reset Password'}
                </h2>
                {/* Subtle underline animation */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400 rounded-full animate-pulse"></div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-white/70 text-sm sm:text-base leading-relaxed">
                {step === 1 ? 'Enter your email address and we\'ll send you a verification code' :
                 step === 2 ? 'Check your email and enter the 6-digit code we sent' :
                 'Create a strong new password for your account'}
              </p>
            </div>

            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Mail className="h-5 w-5 text-pink-500 dark:text-pink-400 group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-300/40 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-violet-400/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-white/15 hover:border-gray-400/50 dark:hover:border-white/30"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 via-violet-400/0 to-cyan-400/0 group-focus-within:from-pink-400/10 group-focus-within:via-violet-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none"></div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 group-hover:animate-shimmer"></div>
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        'Send Verification Code'
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <form onSubmit={handleOTPVerification} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Mail className="h-5 w-5 text-cyan-500 dark:text-cyan-400 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit verification code"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 6) {
                          setOtp(value);
                        }
                      }}
                      required
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-300/40 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-pink-400/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-white/15 hover:border-gray-400/50 dark:hover:border-white/30 text-center text-2xl font-mono tracking-widest"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-pink-400/0 to-violet-400/0 group-focus-within:from-cyan-400/10 group-focus-within:via-pink-400/10 group-focus-within:to-violet-400/10 transition-all duration-500 pointer-events-none"></div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-600 hover:from-cyan-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 group-hover:animate-shimmer"></div>
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        'Verify Code'
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Password Reset */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-violet-500 dark:text-violet-400 group-focus-within:text-pink-500 dark:group-focus-within:text-pink-400 transition-colors duration-300" />
                      </div>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-300/40 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-pink-400/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-white/15 hover:border-gray-400/50 dark:hover:border-white/30"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400/0 via-pink-400/0 to-cyan-400/0 group-focus-within:from-violet-400/10 group-focus-within:via-pink-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none"></div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-pink-500 dark:text-pink-400 group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400 transition-colors duration-300" />
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-300/40 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-violet-400/50 transition-all duration-300 hover:bg-white/70 dark:hover:bg-white/15 hover:border-gray-400/50 dark:hover:border-white/30"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 via-violet-400/0 to-cyan-400/0 group-focus-within:from-pink-400/10 group-focus-within:via-violet-400/10 group-focus-within:to-cyan-400/10 transition-all duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-violet-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 group-hover:animate-shimmer"></div>
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Resetting Password...</span>
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Security note */}
            <div className="mt-6 p-4 rounded-lg bg-gray-100/60 dark:bg-white/5 backdrop-blur-sm border border-gray-300/30 dark:border-white/10">
              <p className="text-xs text-gray-600 dark:text-white/60 text-center leading-relaxed">
                🔒 Your security is our priority. All communications are encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-out;
        }
      `}</style>
    </div>
  );
}
