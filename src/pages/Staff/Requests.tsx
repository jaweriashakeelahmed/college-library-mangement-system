import React, { useState } from 'react';
import { ReturnRequest, BorrowRequest, Student, IssueRecord } from '@/src/types';
import { 
  AlertCircle, CheckCircle2, XCircle, Clock, Search, MessageSquare, 
  User, BookOpen, AlertTriangle, Info, History
} from 'lucide-react';
import { StudentProfileModal } from './components/StudentProfileModal';

interface RequestsProps {
  returnRequests: ReturnRequest[];
  borrowRequests?: BorrowRequest[];
  onUpdateBorrowRequest?: (id: string, status: BorrowRequest['status'], remarks?: string) => void;
  students: Student[];
  trackingRecords: IssueRecord[];
  onApprove: (id: string, approved: boolean) => void;
  onUpdateStatus: (id: string, status: ReturnRequest['status'], reason?: string) => void;
}

export function Requests({ returnRequests, borrowRequests = [], onUpdateBorrowRequest, students, trackingRecords, onApprove, onUpdateStatus }: RequestsProps) {
  const [activeTab, setActiveTab] = useState<'General' | 'Borrow'>('General');
  const [filterType, setFilterType] = useState<'All' | 'Return Before Time' | 'Exchange' | 'Book Reservation' | 'Membership'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{ type: 'Approve' | 'Reject' | 'MoreInfo' | 'Complete', request: ReturnRequest } | null>(null);
  const [actionReason, setActionReason] = useState('');


  // Merge borrow requests into the same view for simplicity if activeTab is not used, or just merge them
  const allReqs = [
    ...returnRequests,
    ...borrowRequests.map(br => ({
      id: br.id,
      studentId: br.studentId,
      studentName: br.studentName,
      bookId: br.bookId,
      bookName: br.bookName,
      type: br.type as any,
      reason: br.studentNotes || 'Borrow Request',
      status: br.status as any,
      requestDate: br.requestDate
    }))
  ];

  const filteredRequests = allReqs.filter(r => {
    const matchesType = filterType === 'All' || r.type === filterType;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStudent = (id: string) => students.find(s => s.id === id);

  const handleAction = () => {
    if (!showConfirmModal) return;
    const { type, request } = showConfirmModal;
    
    if (type === 'Approve') {
      onApprove(request.id, true);
    } else if (type === 'Reject') {
      onApprove(request.id, false);
      // We could pass actionReason if onApprove supported it, but we can also use onUpdateStatus
      if (actionReason) onUpdateStatus(request.id, 'Rejected', actionReason);
    } else if (type === 'MoreInfo') {
      onUpdateStatus(request.id, 'Under Review', actionReason);
    } else if (type === 'Complete') {
      onUpdateStatus(request.id, 'Completed');
    }
    
    setShowConfirmModal(null);
    setActionReason('');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-rose-100 text-rose-700';
      case 'Under Review': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Request Management Center</h2>
          <p className="text-sm text-slate-500 mt-1">Review and manage student library requests</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto shrink-0">
          {['All', 'Return Before Time', 'Exchange', 'Book Reservation', 'Membership'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                filterType === type 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'Return Before Time' ? 'Returns' : type}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 md:justify-end">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All', 'Return Before Time', 'Exchange', 'Book Reservation', 'Renewal'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Types' : s}</option>
            ))}
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Completed'].map(s => (
              <option key={s} value={s}>{s} Status</option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Request Details</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => {
                const student = getStudent(request.studentId);
                return (
                  <tr key={request.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase shrink-0 border border-blue-200">
                          {student?.photoUrl ? <img src={student.photoUrl} alt="" className="w-full h-full object-cover rounded-full" /> : request.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedRequest(request)}>
                            {request.studentName}
                          </div>
                          <div className="text-xs text-slate-500">{request.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 line-clamp-1" title={request.bookName}>{request.bookName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(request.status)}`}>
                        {request.status === 'Approved' || request.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                         request.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                         <Clock className="w-3.5 h-3.5" />}
                        {request.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5" /> Details
                        </button>
                        
                        {request.status === 'Pending' && (
                          <button
                            onClick={() => setShowConfirmModal({ type: 'MoreInfo', request })}
                            className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Review
                          </button>
                        )}
                        
                        {(request.status === 'Pending' || request.status === 'Under Review') && (
                          <>
                            <button
                              onClick={() => setShowConfirmModal({ type: 'Approve', request })}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => setShowConfirmModal({ type: 'Reject', request })}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                        
                        {request.status === 'Approved' && (
                          <button
                            onClick={() => setShowConfirmModal({ type: 'Complete', request })}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No requests found</p>
                      <p className="text-sm mt-1">There are no {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} requests matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className={`p-6 border-b border-slate-100 flex items-center gap-3 ${
              showConfirmModal.type === 'Approve' ? 'bg-emerald-50 text-emerald-800' :
              showConfirmModal.type === 'Reject' ? 'bg-rose-50 text-rose-800' :
              showConfirmModal.type === 'Complete' ? 'bg-blue-50 text-blue-800' :
              'bg-amber-50 text-amber-800'
            }`}>
              {showConfirmModal.type === 'Approve' ? <CheckCircle2 className="w-6 h-6" /> :
               showConfirmModal.type === 'Reject' ? <XCircle className="w-6 h-6" /> :
               showConfirmModal.type === 'Complete' ? <CheckCircle2 className="w-6 h-6" /> :
               <AlertTriangle className="w-6 h-6" />}
              <h3 className="text-lg font-bold">
                {showConfirmModal.type} Request
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-sm">
                <p><span className="font-medium text-slate-700">Student:</span> {showConfirmModal.request.studentName} ({showConfirmModal.request.studentId})</p>
                <p className="mt-1"><span className="font-medium text-slate-700">Book:</span> {showConfirmModal.request.bookName}</p>
              </div>
              
              <p className="text-slate-600 text-sm">
                Are you sure you want to {showConfirmModal.type.toLowerCase()} this {showConfirmModal.request.type.toLowerCase()} request?
              </p>

              {(showConfirmModal.type === 'Reject' || showConfirmModal.type === 'MoreInfo') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Reason / Remarks (Required)</label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                    rows={3}
                    placeholder={`Enter reason for ${showConfirmModal.type.toLowerCase()}...`}
                    required
                  ></textarea>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => { setShowConfirmModal(null); setActionReason(''); }}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200/50 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={(showConfirmModal.type === 'Reject' || showConfirmModal.type === 'MoreInfo') && !actionReason.trim()}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 ${
                  showConfirmModal.type === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  showConfirmModal.type === 'Reject' ? 'bg-rose-600 hover:bg-rose-700' :
                  showConfirmModal.type === 'Complete' ? 'bg-blue-600 hover:bg-blue-700' :
                  'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm {showConfirmModal.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Request Details</h3>
                <p className="text-sm text-slate-500 mt-1">ID: {selectedRequest.id} &middot; {new Date(selectedRequest.requestDate).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Request Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Info className="w-4 h-4"/> Information</h4>
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-3">
                      <div>
                        <span className="text-xs text-slate-500 block">Type</span>
                        <span className="font-semibold text-slate-800">{selectedRequest.type}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Status</span>
                        <div className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(selectedRequest.status)}`}>
                          {selectedRequest.status}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Book Target</span>
                        <span className="font-semibold text-slate-800 block truncate" title={selectedRequest.bookName}>{selectedRequest.bookName}</span>
                        <span className="text-xs text-slate-500">{selectedRequest.bookId}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Reason</h4>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap">
                      {selectedRequest.reason || "No reason provided by student."}
                    </div>
                  </div>
                </div>

                {/* Right Col: Student Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Student Profile</h4>
                    {(() => {
                      const st = getStudent(selectedRequest.studentId);
                      if (!st) return <div className="text-sm text-rose-500">Student not found</div>;
                      
                      const studentRecords = trackingRecords.filter(r => r.studentId === st.id);
                      const currentBorrowed = studentRecords.filter(r => r.status === 'Issued').length;
                      
                      return (
                        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                              {st.photoUrl ? <img src={st.photoUrl} alt="" className="w-full h-full object-cover rounded-full" /> : st.name.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-900">{st.name}</h5>
                              <p className="text-xs text-slate-500">{st.id} &middot; {st.department}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                            <div>
                              <span className="text-xs text-slate-500 block">Membership</span>
                              <span className="font-medium text-slate-800 text-sm">{st.membershipNumber || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">Acc Status</span>
                              <span className="font-medium text-slate-800 text-sm">{st.accountStatus}</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">Currently Borrowed</span>
                              <span className="font-medium text-slate-800 text-sm">{currentBorrowed} Books</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">Total Fines</span>
                              <span className="font-medium text-rose-600 text-sm">Rs. {studentRecords.reduce((acc, r) => acc + (r.fine || 0), 0)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><History className="w-4 h-4"/> Previous Requests</h4>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      {returnRequests.filter(r => r.studentId === selectedRequest.studentId && r.id !== selectedRequest.id).length > 0 ? (
                        returnRequests.filter(r => r.studentId === selectedRequest.studentId && r.id !== selectedRequest.id).map(r => (
                          <div key={r.id} className="bg-slate-50 p-2 rounded-lg text-xs border border-slate-100 flex justify-between items-center">
                            <div>
                              <span className="font-medium text-slate-800 block truncate max-w-[150px]">{r.bookName}</span>
                              <span className="text-slate-500">{r.type}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusStyle(r.status)}`}>{r.status}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">No previous requests found for this student.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
               {selectedRequest.status === 'Pending' && (
                  <button
                    onClick={() => { setSelectedRequest(null); setShowConfirmModal({ type: 'MoreInfo', request: selectedRequest }); }}
                    className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 font-semibold rounded-lg text-sm transition-colors"
                  >
                    Set to Review
                  </button>
                )}
                
                {(selectedRequest.status === 'Pending' || selectedRequest.status === 'Under Review') && (
                  <>
                    <button
                      onClick={() => { setSelectedRequest(null); setShowConfirmModal({ type: 'Reject', request: selectedRequest }); }}
                      className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold rounded-lg text-sm transition-colors"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => { setSelectedRequest(null); setShowConfirmModal({ type: 'Approve', request: selectedRequest }); }}
                      className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold rounded-lg text-sm transition-colors"
                    >
                      Approve Request
                    </button>
                  </>
                )}

                {selectedRequest.status === 'Approved' && (
                  <button
                    onClick={() => { setSelectedRequest(null); setShowConfirmModal({ type: 'Complete', request: selectedRequest }); }}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg text-sm transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
