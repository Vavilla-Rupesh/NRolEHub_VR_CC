// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Mail,
//   Lock,
//   User,
//   Shield,
//   Phone,
//   Hash,
//   Calendar,
//   Building,
//   BookOpen,
//   RefreshCw,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import InputField from "./InputField";
// import toast from "react-hot-toast";
// import api from "../../lib/api";

// export default function Register() {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "student",
//     mobile_number: "",
//     roll_number: "",
//     college_name: "",
//     stream: "",
//     year: "",
//     semester: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [otp, setOTP] = useState("");
//   const [tempId, setTempId] = useState(null);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [resendCooldown, setResendCooldown] = useState(0);

//   // Cooldown timer effect
//   useEffect(() => {
//     let timer;
//     if (resendCooldown > 0) {
//       timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCooldown]);

//   const handleResendOTP = async () => {
//     if (resendCooldown > 0 || !tempId) return;

//     try {
//       setResendLoading(true);
//       const response = await api.post("/auth/resend-otp", { temp_id: tempId });
//       toast.success("New OTP sent to your email");
//       setResendCooldown(60); // 60 second cooldown
//       setOTP(""); // Clear current OTP input
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to resend OTP");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (formData.role === "student") {
//       if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
//         toast.error("Please enter a valid 10-digit mobile number");
//         return;
//       }

//       if (!formData.college_name?.trim()) {
//         toast.error("College name is required");
//         return;
//       }

//       if (!formData.stream?.trim()) {
//         toast.error("Stream/Branch is required");
//         return;
//       }
//     }

//     try {
//       setLoading(true);

//       if (!showOTPInput) {
//         // First step: Register and get OTP
//         const response = await register(formData);

//         // Handle admin registration pending approval
//         if (response.isPendingApproval) {
//           toast.success(
//             "Admin registration submitted for approval. You will receive an email once reviewed."
//           );
//           navigate("/login");
//           return;
//         }

//         if (response.temp_id) {
//           setTempId(response.temp_id);
//           setShowOTPInput(true);
//           toast.success("OTP sent to your email");
//         } else {
//           throw new Error("Failed to get temporary ID");
//         }
//       } else {
//         // Second step: Verify OTP
//         if (!otp || otp.length !== 6) {
//           toast.error("Please enter a valid 6-digit OTP");
//           return;
//         }

//         const response = await register({
//           temp_id: tempId,
//           otp: otp.toString(),
//         });

//         // Handle pending admin approval for admin role
//         if (response.isPendingApproval) {
//           toast.success(
//             "Admin registration submitted for approval. You will receive an email once reviewed."
//           );
//           navigate("/login");
//           return;
//         }

//         if (response.user && response.token) {
//           if (response.user.role === "student") {
//             toast.success("Registration successful! Please login to continue.");
//             navigate("/login");
//           } else {
//             toast.success("Registration successful!");
//             navigate(`/${response.user.role}`);
//           }
//         } else {
//           throw new Error("Invalid response from server");
//         }
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(error.message || "Registration failed");

//       // Reset OTP input if verification fails
//       if (showOTPInput) {
//         setOTP("");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const STREAMS = [
//     "B.Tech - Computer Science",
//     "B.Tech - Information Technology",
//     "B.Tech - Electronics",
//     "B.Tech - Mechanical",
//     "B.Tech - Civil",
//     "B.Tech - Electrical",
//     "B.Tech - Chemical",
//     "B.Tech - Biotechnology",
//     "Other",
//   ];

//   return (
//     <>
//       {/* Container */}
//       <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
//         {/* Background Blobs */}
//         <div className="absolute inset-0 w-full h-full pointer-events-none">
//           <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
//           <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
//           <div className="absolute bottom-[15%] left-[15%] w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
//         </div>

//         {/* Card */}
//         <div className="relative w-full max-w-lg">
//           <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 rounded-3xl shadow-2xl border border-white/30 p-10">
//             {/* Logo */}
//             <div className="flex flex-col items-center mb-8">
//               <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner">
//                 <img
//                   src="/logo.png"
//                   alt="logo"
//                   width={90}
//                   height={50}
//                   className="animate-pulse"
//                 />
//               </div>
//               <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 {showOTPInput ? "Verify OTP" : "Create Account"}
//               </h2>
//               <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
//                 {showOTPInput
//                   ? "Enter the OTP sent to your email"
//                   : "Join NRolEHub today"}
//               </p>
//             </div>

//             {/* Important Note */}
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 rounded-md">
//               <p className="text-yellow-700 text-sm font-medium">
//                 Please fill in the details carefully, as they will be reflected
//                 on your certificates.
//               </p>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Inputs */}
//               {!showOTPInput ? (
//                 <>
//                   <InputField
//                     icon={User}
//                     placeholder="Username"
//                     value={formData.username}
//                     onChange={(e) =>
//                       setFormData({ ...formData, username: e.target.value })
//                     }
//                     required
//                   />
//                   <InputField
//                     icon={Mail}
//                     type="email"
//                     placeholder="Email Address"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     required
//                   />
//                   <InputField
//                     icon={Lock}
//                     type="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
//                     required
//                   />
//                   <InputField
//                     icon={Lock}
//                     type="password"
//                     placeholder="Confirm Password"
//                     value={formData.confirmPassword}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         confirmPassword: e.target.value,
//                       })
//                     }
//                     required
//                   />

//                   {/* Role Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Select Role
//                     </label>
//                     <div className="flex gap-4">
//                       {["student", "admin"].map((role) => (
//                         <button
//                           key={role}
//                           type="button"
//                           onClick={() => setFormData({ ...formData, role })}
//                           className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center hover:shadow-md ${
//                             formData.role === role
//                               ? "border-primary bg-primary/10 text-primary"
//                               : "border-gray-200 dark:border-gray-700"
//                           }`}
//                         >
//                           {role === "student" ? (
//                             <User className="h-6 w-6 mb-1" />
//                           ) : (
//                             <Shield className="h-6 w-6 mb-1" />
//                           )}
//                           <span className="text-sm capitalize">{role}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Student-only fields */}
//                   {formData.role === "student" && (
//                     <>
//                       <InputField
//                         icon={Phone}
//                         type="tel"
//                         placeholder="Mobile Number"
//                         value={formData.mobile_number}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             mobile_number: e.target.value,
//                           })
//                         }
//                         required
//                         pattern="[0-9]{10}"
//                       />
//                       <InputField
//                         icon={Hash}
//                         placeholder="Roll Number"
//                         value={formData.roll_number}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             roll_number: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                       <InputField
//                         icon={Building}
//                         placeholder="College Name"
//                         value={formData.college_name}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             college_name: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                       <InputField
//                         icon={BookOpen}
//                         placeholder="Stream/Branch"
//                         value={formData.stream}
//                         onChange={(e) =>
//                           setFormData({ ...formData, stream: e.target.value })
//                         }
//                         required
//                       />

//                       {/* Year/Semester */}
//                       <div className="dark:text-gray-500 grid grid-cols-2 gap-4">
//                         <select
//                           className="input w-full rounded-xl border border-gray-300 p-3"
//                           value={formData.year}
//                           onChange={(e) =>
//                             setFormData({ ...formData, year: e.target.value })
//                           }
//                           required
//                         >
//                           <option value="">Select Year</option>
//                           {[1, 2, 3, 4].map((y) => (
//                             <option key={y} value={y}>
//                               {y}
//                             </option>
//                           ))}
//                         </select>
//                         <select
//                           className="dark:text-gray-500 input w-full rounded-xl border border-gray-300 p-3"
//                           value={formData.semester}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               semester: e.target.value,
//                             })
//                           }
//                           required
//                         >
//                           <option value="">Select Semester</option>
//                           {[1, 2].map((s) => (
//                             <option key={s} value={s}>
//                               {s}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <InputField
//                   icon={Lock}
//                   placeholder="Enter 6-digit OTP"
//                   value={otp}
//                   onChange={(e) =>
//                     setOTP(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
//                   }
//                   required
//                   maxLength={6}
//                 />
//               )}

//               {/* Resend OTP */}
//               {showOTPInput && (
//                 <div className="flex justify-center">
//                   <button
//                     type="button"
//                     onClick={handleResendOTP}
//                     disabled={resendLoading || resendCooldown > 0}
//                     className="text-sm text-primary hover:underline flex items-center gap-2 disabled:text-gray-400"
//                   >
//                     <RefreshCw
//                       className={`${
//                         resendLoading ? "animate-spin" : ""
//                       } h-4 w-4`}
//                     />
//                     {resendCooldown > 0
//                       ? `Resend OTP in ${resendCooldown}s`
//                       : "Resend OTP"}
//                   </button>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
//               >
//                 {loading
//                   ? "Processing..."
//                   : showOTPInput
//                   ? "Verify OTP"
//                   : "Create Account"}
//               </button>

//               {/* Already have account */}
//               <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => navigate("/login")}
//                   className="text-primary hover:underline"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Shield,
  Phone,
  Hash,
  Calendar,
  Building,
  BookOpen,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "./InputField";
import toast from "react-hot-toast";
import api from "../../lib/api";

// Password validation component
const PasswordChecker = ({ password, confirmPassword }) => {
  const validations = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter", 
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: "Contains a number",
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(pwd),
    },
    {
      label: "Doesn't start with number or symbol",
      test: (pwd) => pwd.length > 0 && /^[A-Za-z]/.test(pwd),
    },
  ];

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const allValidationsPassed = validations.every(v => v.test(password));

  return (
    <div className="mt-2 space-y-2">
      {password && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password Requirements:
          </div>
          <div className="space-y-1">
            {validations.map((validation, index) => {
              const isValid = validation.test(password);
              return (
                <div key={index} className="flex items-center space-x-2">
                  {isValid ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-400" />
                  )}
                  <span
                    className={`text-xs ${
                      isValid
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {validation.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center space-x-2">
                {passwordsMatch ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <X className="h-3 w-3 text-red-400" />
                )}
                <span
                  className={`text-xs ${
                    passwordsMatch
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  Passwords match
                </span>
              </div>
            </div>
          )}
          
          {/* Strength Indicator */}
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password Strength:
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => {
                const validCount = validations.filter(v => v.test(password)).length;
                const strength = Math.ceil(validCount / 1.5);
                return (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      level <= strength
                        ? strength <= 2
                          ? "bg-red-400"
                          : strength <= 3
                          ? "bg-yellow-400"
                          : "bg-green-500"
                        : "bg-slate-200 dark:bg-slate-600"
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-xs mt-1">
              {(() => {
                const validCount = validations.filter(v => v.test(password)).length;
                const strength = Math.ceil(validCount / 1.5);
                if (strength <= 2) return <span className="text-red-500">Weak</span>;
                if (strength <= 3) return <span className="text-yellow-600">Fair</span>;
                if (strength <= 4) return <span className="text-green-600">Strong</span>;
                return <span className="text-green-600">Very Strong</span>;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    mobile_number: "",
    roll_number: "",
    college_name: "",
    stream: "",
    year: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const [tempId, setTempId] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Password validation function
  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(password),
      startsWithLetter: password.length > 0 && /^[A-Za-z]/.test(password),
    };

    const errors = [];
    if (!validations.minLength) errors.push("Password must be at least 8 characters long");
    if (!validations.hasUppercase) errors.push("Password must contain at least one uppercase letter");
    if (!validations.hasLowercase) errors.push("Password must contain at least one lowercase letter");
    if (!validations.hasNumber) errors.push("Password must contain at least one number");
    if (!validations.hasSpecialChar) errors.push("Password must contain at least one special character");
    if (!validations.startsWithLetter) errors.push("Password must start with a letter");

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !tempId) return;

    try {
      setResendLoading(true);
      const response = await api.post("/auth/resend-otp", { temp_id: tempId });
      toast.success("New OTP sent to your email");
      setResendCooldown(60); // 60 second cooldown
      setOTP(""); // Clear current OTP input
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors[0]); // Show first error
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.role === "student") {
      if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }

      if (!formData.college_name?.trim()) {
        toast.error("College name is required");
        return;
      }

      if (!formData.stream?.trim()) {
        toast.error("Stream/Branch is required");
        return;
      }
    }

    try {
      setLoading(true);

      if (!showOTPInput) {
        // First step: Register and get OTP
        const response = await register(formData);

        // Handle admin registration pending approval
        if (response.isPendingApproval) {
          toast.success(
            "Admin registration submitted for approval. You will receive an email once reviewed."
          );
          navigate("/login");
          return;
        }

        if (response.temp_id) {
          setTempId(response.temp_id);
          setShowOTPInput(true);
          toast.success("OTP sent to your email");
        } else {
          throw new Error("Failed to get temporary ID");
        }
      } else {
        // Second step: Verify OTP
        if (!otp || otp.length !== 6) {
          toast.error("Please enter a valid 6-digit OTP");
          return;
        }

        const response = await register({
          temp_id: tempId,
          otp: otp.toString(),
        });

        // Handle pending admin approval for admin role
        if (response.isPendingApproval) {
          toast.success(
            "Admin registration submitted for approval. You will receive an email once reviewed."
          );
          navigate("/login");
          return;
        }

        if (response.user && response.token) {
          if (response.user.role === "student") {
            toast.success("Registration successful! Please login to continue.");
            navigate("/login");
          } else {
            toast.success("Registration successful!");
            navigate(`/${response.user.role}`);
          }
        } else {
          throw new Error("Invalid response from server");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");

      // Reset OTP input if verification fails
      if (showOTPInput) {
        setOTP("");
      }
    } finally {
      setLoading(false);
    }
  };

  const STREAMS = [
    "B.Tech - Computer Science",
    "B.Tech - Information Technology",
    "B.Tech - Electronics",
    "B.Tech - Mechanical",
    "B.Tech - Civil",
    "B.Tech - Electrical",
    "B.Tech - Chemical",
    "B.Tech - Biotechnology",
    "Other",
  ];

  return (
    <>
      {/* Container */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8 from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 relative overflow-hidden">
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[30%] right-[15%] w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-[10%] right-[10%] w-56 h-56 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/40 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-3xl group">
            
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
            
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
              {/* Logo Container */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-500/20 shadow-inner mb-4 group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-blue-500 dark:text-blue-400 animate-pulse" />
                </div>
              </div>
              
              {/* Title with enhanced styling */}
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
                {showOTPInput ? "Verify Email" : "Join NRolEHub"}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base text-center max-w-sm">
                {showOTPInput
                  ? "We've sent a 6-digit code to your email"
                  : "Create your account and unlock endless opportunities"}
              </p>
            </div>

            {/* Enhanced Alert Box */}
            <div className="relative mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 shadow-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800 dark:text-amber-200 text-sm font-medium leading-relaxed">
                  Please fill in your details carefully, as they will appear on your certificates and profile.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Main Form Fields */}
              {!showOTPInput ? (
                <div className="space-y-4">
                  {/* Enhanced Input Fields */}
                  <div className="group">
                    <InputField
                      icon={User}
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                      className="transition-all duration-300 focus-within:scale-[1.02]"
                    />
                  </div>
                  
                  <div className="group">
                    <InputField
                      icon={Mail}
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value.toLowerCase() })
                      }
                      required
                      className="transition-all duration-300 focus-within:scale-[1.02]"
                    />
                  </div>
                  
                  {/* Enhanced Password Field with Visibility Toggle */}
                  <div className="group relative">
                    <div className="relative">
                      <InputField
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min. 8 characters)"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        className="transition-all duration-300 focus-within:scale-[1.02] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {/* Password Checker */}
                    <PasswordChecker 
                      password={formData.password} 
                      confirmPassword={formData.confirmPassword}
                    />
                  </div>
                  
                  {/* Enhanced Confirm Password Field */}
                  <div className="group relative">
                    <div className="relative">
                      <InputField
                        icon={Lock}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        className="transition-all duration-300 focus-within:scale-[1.02] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Role Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Select Your Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "student", icon: User, label: "Student", gradient: "from-blue-500 to-cyan-500" },
                        { key: "admin", icon: Shield, label: "Admin", gradient: "from-purple-500 to-pink-500" }
                      ].map(({ key, icon: Icon, label, gradient }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: key })}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transform hover:scale-[1.02] ${
                            formData.role === key
                              ? `border-transparent bg-gradient-to-br ${gradient} text-white shadow-lg scale-[1.02]`
                              : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          {formData.role === key && (
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`}></div>
                          )}
                          <Icon className="h-6 w-6 relative z-10" />
                          <span className="text-sm font-medium relative z-10">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student-only fields with enhanced styling */}
                  {formData.role === "student" && (
                    <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Student Information</span>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
                      </div>
                      
                      <InputField
                        icon={Phone}
                        type="tel"
                        placeholder="Mobile Number (10 digits)"
                        value={formData.mobile_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile_number: e.target.value,
                          })
                        }
                        required
                        pattern="[0-9]{10}"
                        className="transition-all duration-300 focus-within:scale-[1.02]"
                      />
                      
                      <InputField
                        icon={Hash}
                        placeholder="Roll Number"
                        value={formData.roll_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            roll_number: e.target.value,
                          })
                        }
                        required
                        className="transition-all duration-300 focus-within:scale-[1.02]"
                      />
                      
                      <InputField
                        icon={Building}
                        placeholder="College Name"
                        value={formData.college_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            college_name: e.target.value,
                          })
                        }
                        required
                        className="transition-all duration-300 focus-within:scale-[1.02]"
                      />
                      
                      <InputField
                        icon={BookOpen}
                        placeholder="Stream/Branch"
                        value={formData.stream}
                        onChange={(e) =>
                          setFormData({ ...formData, stream: e.target.value })
                        }
                        required
                        className="transition-all duration-300 focus-within:scale-[1.02]"
                      />

                      {/* Enhanced Year/Semester selectors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <select
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                            value={formData.year}
                            onChange={(e) =>
                              setFormData({ ...formData, year: e.target.value })
                            }
                            required
                          >
                            <option value="" disabled>Select Year</option>
                            {[1, 2, 3, 4].map((y) => (
                              <option key={y} value={y}>Year {y}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="group">
                          <select
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                            value={formData.semester}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                semester: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="" disabled>Semester</option>
                            {[1, 2].map((s) => (
                              <option key={s} value={s}>Semester {s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* OTP Input Section */
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mb-4">
                      <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="group">
                    <InputField
                      icon={Lock}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) =>
                        setOTP(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                      }
                      required
                      maxLength={6}
                      className="text-center text-2xl font-mono tracking-wider transition-all duration-300 focus-within:scale-[1.02]"
                    />
                  </div>

                  {/* Enhanced Resend OTP */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading || resendCooldown > 0}
                      className="group inline-flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:text-slate-400 transition-all duration-300"
                    >
                      <RefreshCw
                        className={`h-4 w-4 transition-transform duration-300 ${
                          resendLoading ? "animate-spin" : "group-hover:rotate-180"
                        }`}
                      />
                      <span>
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend OTP"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                {/* Button background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : showOTPInput ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Verify & Complete</span>
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </div>
              </button>

              {/* Enhanced Sign In Link */}
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Custom styles */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
              opacity: 0.2;
            }
            50% { 
              transform: translateY(-20px) rotate(180deg); 
              opacity: 0.4;
            }
          }
          
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-float {
            animation: float 20s infinite ease-in-out;
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
          }
        `}</style>
      </div>
    </>
  );
}
