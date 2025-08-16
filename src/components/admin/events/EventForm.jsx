import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Calendar, Target, MapPin, FileText, Activity, Users } from "lucide-react";
import { validateEventForm } from "../../../lib/validation";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
function EventForm({ initialData = {}, onSubmit, submitText = "Submit" }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    end_date: "",
    venue: "",
    eligibility_criteria: "",
    nature_of_activity: "",
    other_activity: "",
    iqac_reference: "",
    created_by: user?.id,
    ...initialData,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData.event_image || ""
  );
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If 'Others' is selected, set 'other_activity' value to 'nature_of_activity'
    if (formData.nature_of_activity === "Others" && formData.other_activity) {
      formData.nature_of_activity = formData.other_activity
        .replace(/,\r?\n/g, ",") // Replace ',\r\n' or ',\n' with a single comma
        .replace(/,\r/g, ",") // Specifically replace ',\r' with a single comma
        .replace(/,\n/g, ",") // Specifically replace ',\n' with a single comma
        .replace(/(\r?\n|\r)/g, ",") // Replace remaining newlines and carriage returns with commas
        .trim(); // Remove any leading/trailing whitespace
    }

    const validationErrors = validateEventForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      setUploading(true);

      // Create FormData object
      const formDataToSubmit = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      // Append image file if exists
      if (imageFile) {
        formDataToSubmit.append("event_image", imageFile);
      }

      await onSubmit(formDataToSubmit);
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    const input = document.getElementById("event_image");
    if (input) {
      input.value = "";
    }
  };
  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-4 md:p-8">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative max-w-6xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
      >
        {/* Premium Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 md:px-12 py-12">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Create Event
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">
              Transform your vision into reality. Design an unforgettable experience that brings people together.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 md:p-12 space-y-10">
          {/* Event Name & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Event Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                <input
                  type="text"
                  name="event_name"
                  className={`relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 bg-white dark:bg-slate-800 ${
                    errors.event_name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-purple-200 dark:border-purple-600 focus:border-purple-500 focus:ring-purple-200 dark:focus:ring-purple-800/40"
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg hover:shadow-xl`}
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="Enter your amazing event name"
                  required
                />
              </div>
              {errors.event_name && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.event_name}</p>
                </div>
              )}
            </div>

            {/* Venue */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Venue <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                <input
                  type="text"
                  name="venue"
                  className={`relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 bg-white dark:bg-slate-800 ${
                    errors.venue
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-emerald-200 dark:border-emerald-600 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800/40"
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg hover:shadow-xl`}
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Where will this amazing event take place?"
                  required
                />
              </div>
              {errors.venue && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.venue}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Event Description
              </label>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
              <textarea
                name="description"
                className="relative w-full px-6 py-4 rounded-2xl border-2 border-blue-200 dark:border-blue-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800/40 focus:outline-none transition-all duration-300 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-lg hover:shadow-xl"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your event - make it exciting and engaging..."
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Event Schedule
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Start Date */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                  <input
                    type="datetime-local"
                    name="start_date"
                    className={`relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 bg-white dark:bg-slate-800 ${
                      errors.start_date
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-indigo-200 dark:border-indigo-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800/40"
                    } text-gray-900 dark:text-white shadow-lg hover:shadow-xl`}
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.start_date && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.start_date}</p>
                  </div>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                  <input
                    type="datetime-local"
                    name="end_date"
                    className={`relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 bg-white dark:bg-slate-800 ${
                      errors.end_date
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-purple-200 dark:border-purple-600 focus:border-purple-500 focus:ring-purple-200 dark:focus:ring-purple-800/40"
                    } text-gray-900 dark:text-white shadow-lg hover:shadow-xl`}
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.end_date && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.end_date}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* IQAC, Nature of Activity & Eligibility Criteria */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Left Column: IQAC + Nature of Activity */}
  <div className="space-y-6">
    {/* IQAC / Reference Field */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
          <Users className="w-5 h-5 text-white" />
        </div>
        <label className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          IQAC / Reference <span className="text-red-500">*</span>
        </label>
      </div>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
        <input
          type="text"
          name="iqac_reference"
          className={`relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 bg-white dark:bg-slate-800 ${
            errors.iqac_reference
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-indigo-200 dark:border-indigo-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800/40"
          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg hover:shadow-xl`}
          value={formData.iqac_reference}
          onChange={handleChange}
          placeholder="Enter IQAC reference / approval details"
          required
        />
      </div>
      {errors.iqac_reference && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.iqac_reference}</p>
        </div>
      )}
    </div>

    {/* Nature of Activity */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <label className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Nature of Activity <span className="text-red-500">*</span>
        </label>
      </div>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
        <select
          name="nature_of_activity"
          className="relative w-full px-6 py-4 rounded-2xl border-2 border-orange-200 dark:border-orange-600 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800/40 focus:outline-none transition-all duration-300 bg-white dark:bg-slate-800 text-gray-900 dark:text-white cursor-pointer shadow-lg hover:shadow-xl"
          value={formData.nature_of_activity}
          onChange={handleChange}
          required
        >
          <option value="" className="text-gray-500">Select your activity type</option>
          {NATURE_OF_ACTIVITY_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
              className="text-gray-900 dark:text-white bg-white dark:bg-slate-800"
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>

  {/* Right Column: Eligibility Criteria */}
  <div className="h-full flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
        <Users className="w-5 h-5 text-white" />
      </div>
      <label className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Eligibility Criteria
      </label>
    </div>
    <div className="relative group flex-1">
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
      <textarea
        name="eligibility_criteria"
        className="relative w-full h-full px-6 py-4 rounded-2xl border-2 border-teal-200 dark:border-teal-600 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-800/40 focus:outline-none transition-all duration-300 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-lg hover:shadow-xl"
        value={formData.eligibility_criteria}
        onChange={handleChange}
        placeholder="Specify who can participate in this event..."
      />
    </div>
  </div>
</div>

          {/* Other Activity (Conditional) */}
          {formData.nature_of_activity === "Others" && (
            <div className="space-y-4 animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Specify Activity
                </label>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                <textarea
                  name="other_activity"
                  className="relative w-full px-6 py-4 rounded-2xl border-2 border-yellow-200 dark:border-yellow-600 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 dark:focus:ring-yellow-800/40 focus:outline-none transition-all duration-300 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-lg hover:shadow-xl"
                  value={formData.other_activity}
                  onChange={handleChange}
                  placeholder="Tell us about your unique activity..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Event Image Upload */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <label className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Event Image/Flyer
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-2 text-sm">
                  *
                </span>
              </label>
            </div>
            
            <div className="relative group">
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all duration-200 shadow-lg transform hover:scale-110 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                  <div className="relative border-2 border-dashed border-violet-300 dark:border-violet-600 rounded-2xl p-12 text-center bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/20 dark:to-purple-900/20 hover:from-violet-100/70 hover:to-purple-100/70 dark:hover:from-violet-800/30 dark:hover:to-purple-800/30 transition-all duration-300">
                    <div className="mx-auto w-16 h-16 text-violet-400 dark:text-violet-300 mb-6">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                    <div className="space-y-4">
                      <label className="relative cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-violet-500/25">
                          <Upload className="w-5 h-5" />
                          Upload Image
                        </span>
                        <input
                          id="event_image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="text-gray-600 dark:text-gray-400"></p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full inline-block">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <button
                type="submit"
                disabled={uploading}
                className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-600 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-2xl hover:shadow-purple-500/30 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-4">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                      <span className="text-xl font-bold">Creating Your Amazing Event...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-6 h-6" />
                      <span className="text-xl font-bold">{submitText || "Create Event"}</span>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default EventForm;

const NATURE_OF_ACTIVITY_OPTIONS = [
  "CEA/NSS/National Initiatives (OLD)",
  "Sports & Games",
  "Cultural Activities",
  "Women's forum activities",
  "Hobby clubs Activities",
  "Professional society Activities",
  "Dept. Students Association Activities",
  "Technical Club Activities",
  "Innovation and Incubation Cell Activities",
  "Professional Self Initiatives",
  "Others",
];
