// LeaderboardManager.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWinners } from "../../../../lib/hooks/useWinners";
import { LeaderboardService } from "../../../../lib/services/leaderboard.service";
import TopWinners from "../../../shared/leaderboard/TopWinners";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import EmptyState from "../../../shared/EmptyState";
import {
  Trophy,
  Search,
  X,
  Edit2,
  Crown,
  Medal,
  Award,
  Sparkles,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../lib/api";

export default function LeaderboardManager() {
  const { eventId, subEventId } = useParams();
  const { winners, loading, refreshWinners } = useWinners(
    parseInt(eventId),
    parseInt(subEventId)
  );
  const [declaring, setDeclaring] = useState(false);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([
    { position: 1, student_id: "", score: "", student_name: "" },
    { position: 2, student_id: "", score: "", student_name: "" },
    { position: 3, student_id: "", score: "", student_name: "" },
  ]);

  useEffect(() => {
    if (showWinnerSelection) fetchParticipants();
  }, [showWinnerSelection, eventId, subEventId]);

  useEffect(() => {
    if (winners.length > 0) {
      setSelectedWinners(
        winners.map((winner) => ({
          position: winner.rank,
          student_id: winner.student_id,
          student_name: winner.student_name,
          student_email: winner.student_email,
          score: winner.score,
        }))
      );
    }
  }, [winners]);

  const fetchParticipants = async () => {
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      const validParticipants = response.data.filter(
        (reg) =>
          reg.subevent_id === parseInt(subEventId) &&
          reg.payment_status === "paid" &&
          reg.attendance
      );
      setParticipants(validParticipants);
    } catch (error) {
      toast.error("Failed to fetch participants");
    }
  };

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.student_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participant.student_email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleSelectWinner = (position, participant) => {
    setSelectedWinners((prev) =>
      prev.map((w) => (w.position === position ? { ...w, ...participant } : w))
    );
  };

  const handleScoreChange = (position, score) => {
    setSelectedWinners((prev) =>
      prev.map((w) =>
        w.position === position ? { ...w, score: parseInt(score) || 0 } : w
      )
    );
  };

  const handleDeclareWinners = async () => {
    const invalidSelections = selectedWinners.filter(
      (w) => !w.student_id || !w.score
    );
    if (invalidSelections.length > 0) {
      toast.error("Please select winners and assign scores for all positions");
      return;
    }
    try {
      setDeclaring(true);
      const winnersData = selectedWinners.map((winner) => ({
        student_id: winner.student_id,
        score: winner.score,
        position: winner.position,
      }));
      await LeaderboardService.declareWinners(
        parseInt(eventId),
        parseInt(subEventId),
        winnersData
      );
      toast.success("Winners declared successfully!");
      setShowWinnerSelection(false);
      await refreshWinners();
    } catch (error) {
      toast.error("Failed to declare winners. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-white dark:text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-500 dark:text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getPositionGradient = (position) => {
    switch (position) {
      case 1:
        return "from-yellow-400 via-yellow-500 to-amber-600";
      case 2:
        return "from-gray-300 via-gray-400 to-gray-500";
      case 3:
        return "from-amber-500 via-amber-600 to-orange-600";
      default:
        return "from-blue-400 via-blue-500 to-blue-600";
    }
  };

  const getPositionText = (position) => {
    switch (position) {
      case 1:
        return "1st Place";
      case 2:
        return "2nd Place";
      case 3:
        return "3rd Place";
      default:
        return `${position}th Place`;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative text-slate-800 dark:text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-slate-100/10 to-transparent dark:via-slate-900/10 pointer-events-none"></div>

      <div className="relative space-y-8 p-6 max-w-7xl mx-auto">
        <div
          className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/30 
                border border-slate-300 dark:border-white/10 rounded-3xl 
                p-6 sm:p-8 shadow-2xl 
                flex flex-col sm:flex-row sm:items-center sm:justify-between 
                space-y-4 sm:space-y-0 text-center sm:text-left"
        >
          {/* Left side: Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 justify-center sm:justify-start">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce mx-auto sm:mx-0">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Leaderboard Manager
            </h1>
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce delay-500 mx-auto sm:mx-0">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Right side: Button */}
          {!showWinnerSelection &&
            (winners.length > 0 ? (
              <button
                onClick={() => setShowWinnerSelection(true)}
                className="group relative px-5 sm:px-6 py-2.5 sm:py-3 
                   bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 
                   text-white font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/25 
                   transform hover:scale-105 transition-all duration-300 overflow-hidden mx-auto sm:mx-0"
              >
                <div className="relative flex items-center justify-center sm:justify-start space-x-2">
                  <Edit2 className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Edit Winners</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowWinnerSelection(true)}
                className="group relative px-5 sm:px-6 py-2.5 sm:py-3 
                   bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
                   text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 
                   transform hover:scale-105 transition-all duration-300 overflow-hidden mx-auto sm:mx-0"
              >
                <div className="relative flex items-center justify-center sm:justify-start space-x-2">
                  <Trophy className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Declare Winners</span>
                </div>
              </button>
            ))}
        </div>

        {/* Winner Selection */}
        {showWinnerSelection && (
          <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                  {winners.length > 0 ? (
                    <Edit2 className="h-6 w-6 text-white" />
                  ) : (
                    <Crown className="h-6 w-6 text-white" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                  {winners.length > 0 ? "Edit Winners" : "Select Winners"}
                </h2>
              </div>
              <button
                onClick={() => setShowWinnerSelection(false)}
                className="p-3 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 
                           border border-red-300 dark:border-red-500/50 rounded-full 
                           text-red-600 dark:text-red-400 hover:rotate-90 hover:scale-110 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search participants..."
                className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/20 rounded-2xl 
                         text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 
                         focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>

            {/* Winner Cards */}
            <div className="space-y-6 mb-8">
              {selectedWinners.map((winner) => (
                <div
                  key={winner.position}
                  className="group relative p-4 sm:p-6 bg-white dark:bg-white/10 
                 border border-slate-200 dark:border-white/20 rounded-2xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                    {/* Position Icon */}
                    <div
                      className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 
                      bg-gradient-to-r ${getPositionGradient(winner.position)} 
                      rounded-2xl shadow-xl mx-auto sm:mx-0`}
                    >
                      <div className="text-center">
                        {getPositionIcon(winner.position)}
                        <div className="text-xs font-bold text-white mt-1">
                          #{winner.position}
                        </div>
                      </div>
                    </div>

                    {/* Position Text */}
                    <div className="sm:w-32 text-center sm:text-left">
                      <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                        {getPositionText(winner.position)}
                      </span>
                    </div>

                    {/* Select Participant */}
                    <div className="flex-1 w-full">
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-100 dark:bg-white/5 
                       border border-slate-300 dark:border-white/20 rounded-xl 
                       text-slate-800 dark:text-white focus:outline-none text-sm sm:text-base"
                        value={winner.student_id}
                        onChange={(e) => {
                          const participant = participants.find(
                            (p) => p.student_id === parseInt(e.target.value)
                          );
                          if (participant) {
                            handleSelectWinner(winner.position, participant);
                          }
                        }}
                      >
                        <option
                          value=""
                          className="bg-slate-100 dark:bg-white/5 text-slate-500"
                        >
                          Select participant
                        </option>
                        {filteredParticipants.map((participant) => (
                          <option
                            key={participant.student_id}
                            value={participant.student_id}
                            className="bg-slate-100 dark:bg-white/5 text-slate-500"
                          >
                            {participant.student_name} (
                            {participant.student_email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Score Input */}
                    <div className="sm:w-40 w-full">
                      <input
                        type="number"
                        placeholder="Score"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-100 dark:bg-white/5 
                       border border-slate-300 dark:border-white/20 rounded-xl 
                       text-slate-800 dark:text-white placeholder-slate-500 text-sm sm:text-base"
                        value={winner.score}
                        onChange={(e) =>
                          handleScoreChange(winner.position, e.target.value)
                        }
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDeclareWinners}
                disabled={declaring}
                className="group relative px-12 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 
                         text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/25 
                         transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                <div className="relative flex items-center space-x-3">
                  {declaring ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Trophy className="h-6 w-6" />
                  )}
                  <span>
                    {declaring
                      ? "Saving..."
                      : winners.length > 0
                      ? "Update Winners"
                      : "Confirm Winners"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Winners Display */}
        {winners?.length > 0 && !showWinnerSelection && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="backdrop-blur-xl rounded-3xl p-8">
              <TopWinners winners={winners} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!winners?.length && !showWinnerSelection && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
              <div className="relative p-8 bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full">
                <Trophy className="h-20 w-20 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-6 mb-3">
              No Winners Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
              Winners haven't been declared for this event. Click the button
              above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
