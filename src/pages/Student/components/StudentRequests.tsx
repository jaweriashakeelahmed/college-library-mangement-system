import React, { useState } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { ReturnRequest, BorrowRequest, Book } from '@/src/types';

interface StudentRequestsProps {
  requests: ReturnRequest[];
  borrowRequests?: BorrowRequest[];
  books: Book[];
  allRequests?: ReturnRequest[];
}

export function StudentRequests({  requests, borrowRequests, books, allRequests = []  }: StudentRequestsProps) {
  const [filter, setFilter] = useState('All');

  const filteredRequests = requests
    .filter(r => filter === 'All' || r.status === filter)
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Approved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Requests</h2>
          <p className="text-slate-500 mt-1">Track the status of your return and exchange requests.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === status 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-white rounded-2xl border border-slate-200 p-8">
            <Activity className="w-16 h-16 mb-4 text-slate-300" />
            <p className="font-medium text-lg text-slate-700">No requests found</p>
            <p className="text-sm mt-1">You haven't made any return or exchange requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(request => {
              const book = books.find(b => b.id === request.bookId);
              return (
                <div key={request.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                  
                  {/* Book Image */}
                  <div className="w-16 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-inner hidden sm:block">
                    {book?.imageUrl ? (
                      <img src={book.imageUrl} alt={request.bookName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 font-bold text-2xl">{request.bookName.charAt(0)}</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">{request.type} Request</span>
                           <span className="text-xs text-slate-400 font-medium">{request.requestDate}</span>
                         </div>
                         <h3 className="font-bold text-slate-900 text-base leading-tight truncate" title={request.bookName}>{request.bookName}</h3>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 shrink-0 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl mt-3 text-sm text-slate-600 border border-slate-100">
                      <span className="font-semibold text-slate-700">Reason:</span> {request.reason}
                    </div>

                    {request.status === 'Approved' && request.type === 'Exchange' && (
                      <div className="mt-3 text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Your request has been approved. Please visit the library with the current book to process the exchange.</p>
                      </div>
                    )}
                    {request.type === 'Book Reservation' && (
                      <div className="mt-3 text-sm text-indigo-700 bg-indigo-50 p-2 rounded-lg flex items-start gap-2 border border-indigo-100">
                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          {request.status === 'Approved' ? (
                            <p className="font-semibold text-emerald-700">Your reserved book is now available! Please collect it from the library desk.</p>
                          ) : (
                            <>
                              <p className="font-semibold">Queue Position: {
                                allRequests
                                  .filter(r => r.type === 'Book Reservation' && r.bookId === request.bookId && ['Pending', 'Approved'].includes(r.status))
                                  .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime())
                                  .findIndex(r => r.id === request.id) + 1
                              }</p>
                              <p className="text-xs opacity-90 mt-0.5">You will be notified when the book becomes available.</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
