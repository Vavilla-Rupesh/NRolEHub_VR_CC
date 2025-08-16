import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  UserPlus,
  X,
  AlertCircle,
  Check,
  Clock,
  Ban,
  Crown,
  Shield,
  Star,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import toast from "react-hot-toast";

export default function TeamRegistration({
  isOpen,
  onClose,
  eventId,
  subEventId,
  minTeamSize,
  maxTeamSize,
}) {
  const { user } = useAuth();
  const [mode, setMode] = useState("select");
  const [teamName, setTeamName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myTeamStatus, setMyTeamStatus] = useState({
    hasPendingRequest: false,
    rejectedTeams: [],
    currentTeamId: null,
  });

  useEffect(() => {
    checkRegistrationStatus();
    checkExistingTeam();
    checkTeamStatus();
  }, [eventId, subEventId]);

  useEffect(() => {
    if (myTeam?.leader_id === user.id) {
      fetchPendingRequests();
    }
  }, [myTeam]);

  const checkTeamStatus = async () => {
    try {
      const response = await api.get(`/teams/status/${eventId}/${subEventId}`);
      setMyTeamStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch team status:", error);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await api.get("/registrations/my-registrations");
      const registration = response.data.find(
        (reg) =>
          reg.event_id === parseInt(eventId) &&
          reg.subevent_id === parseInt(subEventId) &&
          reg.payment_status === "paid"
      );
      setHasPaid(!!registration);
    } catch (error) {
      console.error("Failed to check registration status:", error);
    }
  };

  const checkExistingTeam = async () => {
    try {
      const response = await api.get(`/teams/my-team/${eventId}/${subEventId}`);
      if (response.data) {
        setMyTeam(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch team:", error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get("/teams/requests");
      const filteredRequests = response.data.filter(
        (req) =>
          req.event_id === parseInt(eventId) &&
          req.subevent_id === parseInt(subEventId)
      );
      setPendingRequests(filteredRequests);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!hasPaid) {
      toast.error("Please register and complete payment first");
      return;
    }

    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setLoading(true);
      await api.post("/teams/create", {
        name: teamName,
        event_id: parseInt(eventId),
        subevent_id: parseInt(subEventId),
      });
      toast.success("Team created successfully!");
      await checkExistingTeam();
      await checkTeamStatus();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTeams = async () => {
    if (!hasPaid) {
      toast.error("Please register and complete payment first");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/teams/search", {
        params: {
          event_id: parseInt(eventId),
          subevent_id: parseInt(subEventId),
          search: searchTerm,
        },
      });

      // Filter out teams that have rejected the user and teams that are full
      const filteredResults = response.data.filter(
        (team) =>
          !myTeamStatus.rejectedTeams.includes(team.id) &&
          team.TeamMembers.length < maxTeamSize
      );

      setSearchResults(filteredResults);
    } catch (error) {
      toast.error("Failed to search teams");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (teamId) => {
    if (!hasPaid) {
      toast.error("Please register and complete payment first");
      return;
    }

    try {
      setLoading(true);
      await api.post("/teams/join-request", {
        team_id: parseInt(teamId),
      });
      toast.success("Join request sent successfully!");
      await checkTeamStatus();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send join request"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    try {
      setLoading(true);

      // Check team size before accepting
      if (action === "accept" && myTeam?.members?.length >= maxTeamSize) {
        toast.error("Team is already full");
        return;
      }

      await api.put(`/teams/${action}-request/${requestId}`);
      toast.success(`Request ${action}ed successfully`);
      await fetchPendingRequests();
      await checkExistingTeam();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom duration-300">
        {/* Header with Gradient */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90 rounded-t-3xl"></div>
          <div className="relative flex justify-between items-center">
            <h2 className="text-xl font-bold text-white drop-shadow-sm">
              {myTeam ? "✨ My Team" : "🚀 Team Registration"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 pt-4">
          {/* Pending Request Alert */}
          {myTeamStatus.hasPendingRequest && !myTeam && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-xl">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Request Pending
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Waiting for team leader's response
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* My Team Section */}
          {myTeam ? (
            <div className="space-y-6">
              {/* Team Card */}
              <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                        {myTeam.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {myTeam.members?.length || 1}/{maxTeamSize}
                          </span>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          members
                        </span>
                      </div>
                    </div>
                    {myTeam.leader_id === user.id && (
                      <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                        <Crown className="h-3 w-3" />
                        <span>Leader</span>
                      </div>
                    )}
                  </div>

                  {/* Team Members */}
                  <div className="space-y-3">
                    {myTeam.members?.map((member, index) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl backdrop-blur-sm animate-in slide-in-from-left duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {member.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {member.username}
                          </span>
                        </div>
                        {member.isLeader && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold rounded-full">
                            <Crown className="h-3 w-3" />
                            <span>Leader</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Requests */}
              {myTeam.leader_id === user.id && pendingRequests.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                      <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Join Requests
                    </h3>
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {pendingRequests.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pendingRequests.map((request, index) => (
                      <div
                        key={request.id}
                        className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 animate-in slide-in-from-right duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {request.student_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {request.student_name}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {request.student_email}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleRequestResponse(request.id, "accept")
                              }
                              className="p-2 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                              disabled={
                                loading || myTeam.members?.length >= maxTeamSize
                              }
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleRequestResponse(request.id, "reject")
                              }
                              className="p-2 bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Mode Selection */}
              {mode === "select" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setMode("create")}
                    className="group relative w-full p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
                    disabled={myTeamStatus.hasPendingRequest}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                        <Users className="h-6 w-6" />
                      </div>
                      <span className="text-lg font-bold">Create New Team</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setMode("join")}
                    className="group relative w-full p-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
                    disabled={myTeamStatus.hasPendingRequest}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                        <UserPlus className="h-6 w-6" />
                      </div>
                      <span className="text-lg font-bold">
                        Join Existing Team
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* Create Team - This section was missing in your original code */}
              {mode === "create" && (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  <form onSubmit={handleCreateTeam} className="space-y-6">
                    <div>
                      <label
                        htmlFor="teamName"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Team Name
                      </label>
                      <input
                        type="text"
                        id="teamName"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !hasPaid}
                      className="group relative w-full py-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
                    >
                      <div className="relative flex items-center justify-center space-x-2">
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Users className="h-5 w-5" />
                            <span>Create Team</span>
                          </>
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("select")}
                      className="w-full py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                    >
                      ← Back to Options
                    </button>
                  </form>
                </div>
              )}

              {/* Join Team */}
              {mode === "join" && (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-12 pr-20 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search teams..."
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <button
                      onClick={handleSearchTeams}
                      disabled={loading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    {searchResults.map((team, index) => {
                      const isRejected = myTeamStatus.rejectedTeams.includes(
                        team.id
                      );
                      const isFull = team.TeamMembers?.length >= maxTeamSize;

                      return (
                        <div
                          key={team.id}
                          className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 flex justify-between items-center animate-in slide-in-from-bottom duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {team.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                {team.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                  {team.TeamMembers?.length || 1}/{maxTeamSize}{" "}
                                  members
                                </span>
                              </div>
                            </div>
                          </div>

                          {isRejected ? (
                            <div className="flex items-center space-x-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                              <Ban className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Rejected
                              </span>
                            </div>
                          ) : isFull ? (
                            <div className="flex items-center space-x-1 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                              <Users className="h-4 w-4" />
                              <span className="text-sm font-medium">Full</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleJoinRequest(team.id)}
                              disabled={loading}
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                            >
                              {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4" />
                                  <span>Join</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setMode("select")}
                    className="w-full py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    ← Back to Options
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
