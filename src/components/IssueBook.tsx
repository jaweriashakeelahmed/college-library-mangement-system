import React, { useState } from 'react';
import { BookUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Book, IssueRecord } from '../types';

interface IssueBookProps {
  books: Book[];
  trackingRecords: IssueRecord[];
  onIssueBook: (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => void;
}

export function IssueBook({ books, trackingRecords, onIssueBook }: IssueBookProps) {
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleIssue = () => {
    if (!studentId || !bookId) {
      showToast('Please enter both Student ID and Book ID.', 'error');
      return;
    }

    // Check limit
    const currentlyIssuedCount = trackingRecords.filter(r => r.studentId === studentId && r.status === 'Issued').length;
    if (currentlyIssuedCount >= 3) {
      showToast('Maximum borrowing limit reached (3 books). Please return a book before borrowing another.', 'error');
      return;
    }

    const book = books.find(b => b.id.toLowerCase() === bookId.toLowerCase());
    if (!book) {
      showToast('Book ID not found in the library.', 'error');
      return;
    }

    if (book.status !== 'Available') {
      showToast('This book is currently issued to another student and is not available.', 'error');
      return;
    }

    // Success
    showToast('Book is available and allotted successfully!', 'success');
    onIssueBook('Student ' + studentId, studentId, book.id, book.name, expectedReturnDate);
    
    // Clear form
    setStudentId('');
    setBookId('');
    const d = new Date();
    d.setDate(d.getDate() + 15);
    setExpectedReturnDate(d.toISOString().split('T')[0]);
  };

  const clearForm = () => {
    setStudentId('');
    setBookId('');
    const d = new Date();
    d.setDate(d.getDate() + 15);
    setExpectedReturnDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${
          toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="font-medium">{toastMessage.text}</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-800">Issue a Book</h2>
        <p className="text-slate-500 mt-1">Assign a book to a student. Limit: 3 books per student.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Student ID</label>
              <input 
                type="text" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 2k26/CS/12"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Book ID</label>
              <input 
                type="text" 
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="e.g. B002"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Issue Date</label>
              <input 
                type="date" 
                readOnly
                value={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700 opacity-80 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Expected Return Date</label>
              <input 
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-8">
            <button type="button" onClick={clearForm} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
              Clear
            </button>
            <button type="button" onClick={handleIssue} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
              <BookUp className="w-5 h-5" />
              Issue Book
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50/50 text-blue-900 p-5 rounded-2xl border border-blue-100/50 text-sm">
        <strong className="font-semibold text-blue-800">Rules:</strong> 
        <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-800/80">
          <li>A student cannot issue more than 3 books at a time.</li>
          <li>A single book cannot be issued twice simultaneously.</li>
          <li>Ensure the student ID and book ID are correct before confirming.</li>
        </ul>
      </div>
    </div>
  );
}
