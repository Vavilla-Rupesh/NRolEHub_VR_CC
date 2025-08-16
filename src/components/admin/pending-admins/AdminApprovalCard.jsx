import React from 'react';
import { User, Mail, Calendar, Check, X } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function AdminApprovalCard({ 
  admin, 
  onApprove, 
  onReject, 
  processing 
}) {
  return (
    <div className="glass-card">
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
            <div className="flex items-center space-x-2 mt-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Requested on {formatDate(admin.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Pending Review
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onApprove(admin.id)}
              disabled={processing}
              className="btn btn-success btn-sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </button>
            <button
              onClick={() => onReject(admin)}
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
  );
}