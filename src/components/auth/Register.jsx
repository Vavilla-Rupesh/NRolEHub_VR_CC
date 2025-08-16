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
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "./InputField";
import toast from "react-hot-toast";
import api from "../../lib/api";

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

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[15%] left-[15%] w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Card */}
        <div className="relative w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 rounded-3xl shadow-2xl border border-white/30 p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner">
                <img
                  src="/logo.png"
                  alt="logo"
                  width={90}
                  height={50}
                  className="animate-pulse"
                />
              </div>
              <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {showOTPInput ? "Verify OTP" : "Create Account"}
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                {showOTPInput
                  ? "Enter the OTP sent to your email"
                  : "Join NRolEHub today"}
              </p>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 rounded-md">
              <p className="text-yellow-700 text-sm font-medium">
                Please fill in the details carefully, as they will be reflected
                on your certificates.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Inputs */}
              {!showOTPInput ? (
                <>
                  <InputField
                    icon={User}
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <InputField
                    icon={Lock}
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Role
                    </label>
                    <div className="flex gap-4">
                      {["student", "admin"].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, role })}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center hover:shadow-md ${
                            formData.role === role
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {role === "student" ? (
                            <User className="h-6 w-6 mb-1" />
                          ) : (
                            <Shield className="h-6 w-6 mb-1" />
                          )}
                          <span className="text-sm capitalize">{role}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student-only fields */}
                  {formData.role === "student" && (
                    <>
                      <InputField
                        icon={Phone}
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.mobile_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile_number: e.target.value,
                          })
                        }
                        required
                        pattern="[0-9]{10}"
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
                      />
                      <InputField
                        icon={BookOpen}
                        placeholder="Stream/Branch"
                        value={formData.stream}
                        onChange={(e) =>
                          setFormData({ ...formData, stream: e.target.value })
                        }
                        required
                      />

                      {/* Year/Semester */}
                      <div className="dark:text-gray-500 grid grid-cols-2 gap-4">
                        <select
                          className="input w-full rounded-xl border border-gray-300 p-3"
                          value={formData.year}
                          onChange={(e) =>
                            setFormData({ ...formData, year: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Year</option>
                          {[1, 2, 3, 4].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <select
                          className="dark:text-gray-500 input w-full rounded-xl border border-gray-300 p-3"
                          value={formData.semester}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              semester: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select Semester</option>
                          {[1, 2].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <InputField
                  icon={Lock}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOTP(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                  }
                  required
                  maxLength={6}
                />
              )}

              {/* Resend OTP */}
              {showOTPInput && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading || resendCooldown > 0}
                    className="text-sm text-primary hover:underline flex items-center gap-2 disabled:text-gray-400"
                  >
                    <RefreshCw
                      className={`${
                        resendLoading ? "animate-spin" : ""
                      } h-4 w-4`}
                    />
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP"}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : showOTPInput
                  ? "Verify OTP"
                  : "Create Account"}
              </button>

              {/* Already have account */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
