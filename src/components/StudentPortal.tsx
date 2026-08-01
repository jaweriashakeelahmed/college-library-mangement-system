import React, { useState } from 'react';
import { BookOpen, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Book, IssueRecord } from '../types';

interface StudentPortalProps {
  books: Book[];
  trackingRecords: IssueRecord[];
  onIssueBook: (studentName: string, rollNo: string, bookId: string, bookName: string) => void;
}

export function StudentPortal({ books, trackingRecords, onIssueBook }: StudentPortalProps) {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentClass || !rollNo) {
      showToast('Please fill all registration fields.', 'error');
      return;
    }
    if (!selectedBook) {
      showToast('Please select a book to borrow.', 'error');
      return;
    }

    // Check limit
    const currentlyIssuedCount = trackingRecords.filter(r => r.studentId === rollNo && r.status === 'Issued').length;
    if (currentlyIssuedCount >= 3) {
      showToast('Maximum borrowing limit reached (3 books). Please return a book before borrowing another.', 'error');
      return;
    }

    const book = books.find(b => b.id === selectedBook);
    if (!book) return;

    if (book.status !== 'Available') {
      showToast('This book is currently issued to another student and is not available.', 'error');
    } else {
      showToast('Your book is registered and issued successfully! Check Tracking Records.', 'success');
      onIssueBook(name, rollNo, book.id, book.name);
      
      // Clear form after successful issue
      setName('');
      setStudentClass('');
      setRollNo('');
      setSelectedBook(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 relative">
      
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
        <h2 className="text-2xl font-bold text-slate-800">Student Portal (Self-Service)</h2>
        <p className="text-slate-500 mt-1">Register yourself and select a book to borrow instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Registration Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 border border-blue-100/50">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Student Registration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Khan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Class / Department</label>
              <input 
                type="text" 
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="e.g. CS 3rd Sem"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Roll No</label>
              <input 
                type="text" 
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 2k26/CS/12"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Book Selection Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 border border-emerald-100/50">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Select a Book</h3>
          </div>
          
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Search books..."
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {books.filter(b => b.name.toLowerCase().includes(bookSearchQuery.toLowerCase()) || b.author.toLowerCase().includes(bookSearchQuery.toLowerCase())).map((book) => (
              <label 
                key={book.id} 
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedBook === book.id 
                    ? 'border-blue-600 bg-blue-50/30 shadow-sm' 
                    : book.status !== 'Available'
                      ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center h-5 mt-1">
                  <input 
                    type="radio" 
                    name="bookSelection" 
                    value={book.id}
                    checked={selectedBook === book.id}
                    onChange={() => book.status === 'Available' && setSelectedBook(book.id)}
                    disabled={book.status !== 'Available'}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">{book.name}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{book.author}</p>
                    </div>
                    {book.status === 'Available' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 text-rose-700">
                        Issued
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm text-lg active:scale-95"
          >
            Confirm Registration & Borrow
          </button>
        </div>
      </form>
    </div>
  );
}
