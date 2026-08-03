import React, { useState } from 'react';
import { ReturnRequest } from '../types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface RequestsProps {
  returnRequests: ReturnRequest[];
  onApprove: (requestId: string, status: 'Approved' | 'Rejected') => void;
}

export function Requests({ returnRequests, onApprove }: RequestsProps) {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filteredRequests = returnRequests.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Return & Exchange Requests</h2>
        <p className="text-slate-500 mt-1">Manage student requests for early returns and book exchanges.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Request Type</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{req.studentName}</p>
                    <p className="text-xs text-slate-500">ID: {req.studentId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{req.bookName}</p>
                    <p className="text-xs text-slate-500">ID: {req.bookId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{req.type}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {req.requestDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {req.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onApprove(req.id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onApprove(req.id, 'Approved')}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No requests found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
