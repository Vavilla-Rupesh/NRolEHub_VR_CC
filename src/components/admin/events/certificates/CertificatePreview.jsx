import React, { useState, useRef } from "react";
import { Eye, X, MousePointer, Save } from "lucide-react";
// Assuming you have a utility function for classnames, e.g., from shadcn/ui
// import { cn } from "@/lib/utils";
// For standalone use, let's define a simple cn function
const cn = (...classes) => classes.filter(Boolean).join(' ');


// Mocking toast for standalone example
const toast = {
  error: (message) => console.error(message),
};


export default function CertificatePreview({
  template,
  onClose,
  onUpdatePositions,
  type = "", // ✅ FIX: Added default value to prevent crash if type is undefined
  isTeam = false,
}) {
  const [selectedField, setSelectedField] = useState(null);
  // Ensure template.positions is an object, even if it's undefined in props
  const [positions, setPositions] = useState(template?.positions || {});
  const [previewMode, setPreviewMode] = useState(false);
  const imageRef = useRef(null);

  const fields = {
    name: "Student Name",
    event: "Event Name",
    date: "Date",
    certificateId: "Certificate ID",
    rollNumber: "Roll Number",
    year: "Year",
    sem: "Semester",
    stream: "Stream",
    college: "College Name",
    ...(type === "merit" && { rank: "Rank" }),
    ...(isTeam && { teamName: "Team Name" }),
  };

  const handleImageClick = (e) => {
    // Only allow placing markers when not in preview mode and a field is selected
    if (!previewMode && selectedField && imageRef.current) {
      const img = imageRef.current;
      const rect = img.getBoundingClientRect();

      // Calculate the click position relative to the image (from 0.0 to 1.0)
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      setPositions((prev) => ({
        ...prev,
        [selectedField]: { x: relX, y: relY },
      }));
    }
  };

  /**
   * Generates the style for placing an element over the image.
   * It uses percentage-based positioning which scales with the container,
   * preventing any shifting between different view sizes.
   * @param {object} pos - The position object with x and y properties (0.0 to 1.0)
   * @returns {object} - The CSS style object
   */
  const getPreviewStyle = (pos) => {
    if (!pos) return {}; // Return empty style if position is not set
    return {
      position: "absolute",
      left: `${pos.x * 100}%`, // Convert relative X to percentage
      top: `${pos.y * 100}%`,  // Convert relative Y to percentage
    };
  };

  const handleSave = () => {
    const requiredFields = Object.keys(fields);
    const missingFields = requiredFields.filter((field) => !positions[field]);

    // Check if any fields are missing positions
    if (missingFields.length > 0) {
      toast.error(`Please set positions for: ${missingFields.join(", ")}`);
      return;
    }

    // Call the parent handler to save the positions
    onUpdatePositions(positions);
    // You might want to add a success toast here as well
    // toast.success("Positions saved successfully!");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-slate-900/90 to-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 dark:from-slate-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                Certificate Preview
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Template
                Configuration
              </p>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              {/* Toggle Preview/Edit Button */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={cn(
                  "group relative overflow-hidden rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 flex-1 sm:flex-none",
                  "shadow-lg hover:shadow-xl border border-white/20",
                  previewMode
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/30"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30"
                )}
              >
                <div className="relative flex items-center justify-center space-x-2">
                  {previewMode ? (
                    <>
                      <MousePointer className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Edit Positions</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Preview</span>
                    </>
                  )}
                </div>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 flex-1 sm:flex-none"
              >
                <div className="relative flex items-center justify-center space-x-2">
                  <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Save</span>
                </div>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="group bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl p-2 sm:p-2.5 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/20">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Field Selector Panel (visible in edit mode) */}
              {!previewMode && (
                <div className="w-full lg:w-80 xl:w-96">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-slate-700/50 sticky top-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6">
                      Field Positioning
                    </h3>
                    <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-96 overflow-y-auto custom-scrollbar">
                      {Object.entries(fields).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedField(key)}
                          className={cn(
                            "group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg border border-white/20 text-left",
                            selectedField === key
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/30"
                              : positions[key]
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
                              : "bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Certificate Display Area */}
              <div className="flex-1 min-w-0">
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
                  <div className="relative overflow-auto max-h-[60vh] lg:max-h-[70vh] custom-scrollbar">
                    {/* This container holds the image and the absolutely positioned elements */}
                    <div className="relative inline-block min-w-full">
                      <img
                        ref={imageRef}
                        src={template?.preview || 'https://placehold.co/1200x800/e2e8f0/475569?text=Certificate+Template'}
                        alt="Certificate Template"
                        className={cn(
                          "max-w-full h-auto rounded-xl shadow-lg transition-all duration-300",
                          !previewMode && selectedField
                            ? "cursor-crosshair hover:shadow-2xl"
                            : "cursor-default"
                        )}
                        onClick={handleImageClick}
                      />

                      {/* Edit Mode Markers */}
                      {!previewMode &&
                        Object.entries(positions).map(([field, pos]) => (
                          <div
                            key={field}
                            style={getPreviewStyle(pos)}
                            className="absolute z-10"
                          >
                            <div className="relative transform -translate-x-1/2 -translate-y-1/2 animate-bounce-gentle">
                              {/* The marker dot */}
                              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg border-2 border-white relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                              </div>
                              {/* The text label */}
                              <div className="mt-2 whitespace-nowrap text-center">
                                <span className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg border border-white/20">
                                  {fields[field]}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Preview Mode Text */}
                      {previewMode &&
                        Object.entries(positions).map(([field, pos]) => {
                          const style = getPreviewStyle(pos);
                          let content = "";
                          // Base class plus a transform to center the text on the point
                          let className = "absolute font-semibold drop-shadow-lg animate-fade-in whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 ";

                          switch (field) {
                            case "name":
                              content = "John Doe";
                              className += "text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100";
                              break;
                            case "event":
                              content = "Web Development Workshop";
                              className += "text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100";
                              break;
                            case "date":
                              content = "March 15, 2024";
                              className += "text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-200";
                              break;
                            case "certificateId":
                              content = "CC-123456";
                              className += "text-sm sm:text-base text-slate-600 dark:text-slate-300";
                              break;
                            case "rollNumber":
                              content = "20CS123";
                              className += "text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200";
                              break;
                            case "year":
                              content = "IV";
                              className += "text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200";
                              break;
                            case "sem":
                              content = "II";
                              className += "text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200";
                              break;
                            case "stream":
                              content = "B.tech/CSE";
                              className += "text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200";
                              break;
                            case "college":
                              content = "Sample Engineering College";
                              className += "text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200";
                              break;
                            case "rank":
                              content = "1st Place";
                              className += "text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent";
                              break;
                            case "teamName":
                              content = "Team Awesome";
                              className += "text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100";
                              break;
                            default:
                              content = "Sample Text";
                              className += "text-base text-slate-700 dark:text-slate-200";
                          }

                          return (
                            <div
                              key={field}
                              style={style}
                              className={className}
                            >
                              {content}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
