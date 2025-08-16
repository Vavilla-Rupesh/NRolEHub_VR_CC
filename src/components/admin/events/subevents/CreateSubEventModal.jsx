import React, { useState } from "react";
import { Users } from "lucide-react";
import Modal from "../../../shared/Modal";
import api from "../../../../lib/api";
import toast from "react-hot-toast";

export default function CreateSubEventModal({
  isOpen,
  onClose,
  eventId,
  onSubEventCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fee: 0,
    is_free: false,
    event_id: eventId,
    is_team_event: false,
    min_team_size: 2,
    max_team_size: 4,
  });
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate team size
    if (formData.is_team_event) {
      if (formData.min_team_size > formData.max_team_size) {
        toast.error(
          "Minimum team size cannot be greater than maximum team size"
        );
        return;
      }
      if (formData.min_team_size < 2) {
        toast.error("Minimum team size must be at least 2");
        return;
      }
      if (formData.max_team_size > 10) {
        toast.error("Maximum team size cannot exceed 10");
        return;
      }
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append resources if any
      resources.forEach((file) => {
        formDataToSend.append("resources", file);
      });

      const response = await api.post("/subevents", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Sub-event created successfully");
      onSubEventCreated?.();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create sub-event"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResources((prev) => [...prev, ...files]);
  };

  const removeResource = (index) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Sub-event"
      fullScreen
    >
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Sub-Event
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Design an engaging experience for your participants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title and Description Row */}
          <div className="lg:flex lg:gap-6">
            {/* Left Column: Event Title + Registration Fee */}
            <div className="lg:flex-1 space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Event Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-700 border-2 border-indigo-100 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Enter an exciting title..."
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              {/* Registration Fee */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
                <label className="block text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
                  💰 Registration Details
                </label>
                <div className="space-y-4">
                  {/* Free Event Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <span className="mr-2">🎁</span> This is a free event
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          is_free: !prev.is_free,
                          fee: !prev.is_free ? 0 : prev.fee,
                        }))
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                        formData.is_free
                          ? "bg-emerald-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          formData.is_free ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Fee Input (shown only if not free) */}
                  {!formData.is_free && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-lg">₹</span>
                      </div>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-emerald-200 dark:border-emerald-600 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition-all duration-300 text-gray-900 dark:text-gray-100 shadow-sm"
                        value={formData.fee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fee: parseFloat(e.target.value),
                          })
                        }
                        min="0"
                        step="0.01"
                        required
                        placeholder="Enter registration fee"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Description (stretched) */}
            <div className="lg:flex-1 flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Description
              </label>
              <div className="relative flex-1">
                <textarea
                  className="w-full h-full px-4 py-4 bg-white dark:bg-gray-700 border-2 border-indigo-100 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  placeholder="Describe what makes this event special..."
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Team Event Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                <span className="mr-2">👥</span>
                Team Event Configuration
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Individual
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="is_team_event"
                    checked={formData.is_team_event}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_team_event: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Team
                </span>
              </div>
            </div>

            {formData.is_team_event && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Minimum Team Size
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={formData.min_team_size}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          min_team_size: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-600 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 text-gray-900 dark:text-gray-100 shadow-sm text-center font-semibold"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Maximum Team Size
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={formData.max_team_size}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          max_team_size: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-600 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 text-gray-900 dark:text-gray-100 shadow-sm text-center font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-700">
            <label className="block text-lg font-semibold text-violet-800 dark:text-violet-300 mb-4 items-center">
              <span className="mr-2">📎</span>
              Resources & Attachments
            </label>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
                id="resources"
              />
              <label
                htmlFor="resources"
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl cursor-pointer hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                <Users className="h-5 w-5 mr-3" />
                Upload Resources
              </label>

              {resources.length > 0 && (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                    Uploaded Files:
                  </h4>
                  {resources.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-violet-100 dark:border-violet-700 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            📄
                          </span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate max-w-xs">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[150px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Sub-event"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
