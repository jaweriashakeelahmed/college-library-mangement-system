import React, { useState } from 'react';
import { BookOpen, Clock, AlertCircle, RefreshCw, Undo2, X } from 'lucide-react';
import { Book, IssueRecord, Student, ReturnRequest } from '@/src/types';

interface StudentMyBooksProps {
  records: IssueRecord[];
  books: Book[];
  student: Student;
  onReturnRequest: (request: Omit<ReturnRequest, 'id' | 'status' | 'requestDate'>) => void;
}

export function StudentMyBooks({ records, books, student, onReturnRequest }: StudentMyBooksProps) {
  const currentBorrowed = records.filter(r => r.status === 'Issued');
  const [requestModal, setRequestModal] = useState<{ isOpen: boolean, record: IssueRecord | null, type: 'Return Before Time' | 'Exchange' }>({ isOpen: false, record: null, type: 'Return Before Time' });
  const [reason, setReason] = useState('');
  const today = new Date();

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModal.record) return;
    
    onReturnRequest({
      studentId: student.id,
      studentName: student.name,
      bookId: requestModal.record.bookId,
      bookName: requestModal.record.bookName,
      type: requestModal.type,
      reason: reason
    });
    
    setRequestModal({ isOpen: false, record: null, type: 'Return Before Time' });
    setReason('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Borrowed Books</h2>
        <p className="text-slate-500 mt-1">Manage your currently borrowed books and requests.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {currentBorrowed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-16 h-16 mb-4 text-slate-300" />
            <p className="font-medium text-lg text-slate-700">No books currently borrowed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBorrowed.map(record => {
              const book = books.find(b => b.id === record.bookId);
              const due = new Date(record.expectedReturnDate);
              const isOverdue = due < today;
              const diffTime = due.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
                  {isOverdue && (
                     <div className="absolute top-0 right-0 left-0 h-1 bg-rose-500"></div>
                  )}
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-inner">
                      {book?.imageUrl ? (
                        <img src={book.imageUrl} alt={record.bookName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 font-bold text-3xl">{record.bookName.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-2 mb-1" title={record.bookName}>{record.bookName}</h3>
                      <p className="text-xs text-slate-500 truncate mb-3">{book?.author}</p>
                      
                      <div className="mt-auto space-y-2">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Issue Date</div>
                          <div className="text-sm font-medium text-slate-800">{record.issueDate}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Due Date</div>
                          <div className={`text-sm font-bold flex items-center gap-1 ${isOverdue ? 'text-rose-600' : 'text-emerald-600'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {record.expectedReturnDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className={`text-xs font-bold px-2 py-1 rounded ${isOverdue ? 'bg-rose-100 text-rose-700' : diffDays <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {isOverdue ? `Overdue by ${Math.abs(diffDays)} days` : `${diffDays} days left`}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setRequestModal({ isOpen: true, record, type: 'Return Before Time' })} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition-colors">
                      <Undo2 className="w-4 h-4" /> Return
                    </button>
                    <button onClick={() => setRequestModal({ isOpen: true, record, type: 'Exchange' })} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-200">
                      <RefreshCw className="w-4 h-4" /> Exchange
                    </button>
                    <button onClick={() => setRequestModal({ isOpen: true, record, type: 'Renewal' })} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-200">
                      <RefreshCw className="w-4 h-4" /> Renew
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {requestModal.isOpen && requestModal.record && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRequestSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {requestModal.type === 'Exchange' ? 'Exchange Book' : requestModal.type === 'Renewal' ? 'Renew Book' : 'Return Book'}
              </h3>
              <button type="button" onClick={() => setRequestModal({ isOpen: false, record: null, type: 'Return Before Time' })} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-3">
                 <div className="w-10 h-14 bg-slate-200 rounded overflow-hidden shrink-0">
                    {books.find(b => b.id === requestModal.record?.bookId)?.imageUrl ? (
                      <img src={books.find(b => b.id === requestModal.record?.bookId)?.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{requestModal.record.bookName.charAt(0)}</div>
                    )}
                 </div>
                 <div>
                   <div className="font-bold text-slate-800 text-sm line-clamp-1">{requestModal.record.bookName}</div>
                   <div className="text-xs text-slate-500">ID: {requestModal.record.bookId}</div>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for {requestModal.type === 'Exchange' ? 'Exchange' : requestModal.type === 'Renewal' ? 'Renewal' : 'Return'} *</label>
                <textarea 
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                  required 
                  rows={3} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={requestModal.type === 'Exchange' ? "e.g. Completed early, want to exchange for another book." : "e.g. Finished reading."}
                ></textarea>
              </div>

              {requestModal.type === 'Exchange' && (
                <div className="p-3 bg-blue-50 rounded-lg flex gap-3 text-blue-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Exchange requests are subject to approval. You will be notified once approved to visit the library to exchange the book.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button type="button" onClick={() => setRequestModal({ isOpen: false, record: null, type: 'Return Before Time' })} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">Submit Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
