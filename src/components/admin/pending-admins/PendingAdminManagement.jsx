import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Clock, Mail, User } from 'lucide-react';
import api from '../../../lib/api';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Modal from '../../shared/Modal';
import { formatDate } from '../../../lib/utils';
import toast from 'react-hot-toast';

export default function PendingAdminManagement() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const response = await api.get('/auth/pending-admins');
      setPendingAdmins(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending admin requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pendingAdminId) => {
    try {
      setProcessing(true);
      await api.put(`/auth/approve-admin/${pendingAdminId}`);
      toast.success('Admin approved successfully');
      fetchPendingAdmins();
    } catch (error) {
      toast.error('Failed to approve admin');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAdmin || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      await api.put(`/auth/reject-admin/${selectedAdmin.id}`, {
        reason: rejectionReason
      });
      toast.success('Admin rejected successfully');
      setShowRejectModal(false);
      setSelectedAdmin(null);
      setRejectionReason('');
      fetchPendingAdmins();
    } catch (error) {
      toast.error('Failed to reject admin');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (admin) => {
    setSelectedAdmin(admin);
    setShowRejectModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="h-6 w-6 mr-2 text-primary" />
          Pending Admin Approvals
        </h1>
        <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
          <Clock className="h-5 w-5 text-yellow-600" />
          <span className="font-medium text-yellow-800 dark:text-yellow-200">
            {pendingAdmins.length} pending request(s)
          </span>
        </div>
      </div>

      {pendingAdmins.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Pending Requests
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All admin registration requests have been processed.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingAdmins.map((admin) => (
            <div key={admin.id} className="glass-card">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{admin.username}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{admin.email}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Requested on {formatDate(admin.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Pending Review
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(admin.id)}
                      disabled={processing}
                      className="btn btn-success btn-sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(admin)}
                      disabled={processing}
                      className="btn btn-destructive btn-sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedAdmin(null);
          setRejectionReason('');
        }}
        title="Reject Admin Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to reject the admin request from{' '}
            <strong>{selectedAdmin?.username}</strong>?
          </p>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason for rejection (required)
            </label>
            <textarea
              className="input w-full h-24"
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setSelectedAdmin(null);
                setRejectionReason('');
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
              className="btn btn-destructive"
            >
              {processing ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}