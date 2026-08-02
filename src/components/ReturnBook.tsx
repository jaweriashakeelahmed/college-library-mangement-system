import React, { useState } from 'react';
import { BookDown, Search, CheckCircle } from 'lucide-react';
import { IssueRecord } from '../types';

interface ReturnBookProps {
  trackingRecords: IssueRecord[];
  onReturnBook: (recordId: string, returnDate: string, lateDays: number, fine: number, returnStatus: 'Early' | 'On Time' | 'Late') => void;
}

export function ReturnBook({ trackingRecords, onReturnBook }: ReturnBookProps) {
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [fine, setFine] = useState<number | null>(null);
  const [lateDays, setLateDays] = useState<number>(0);
  const [foundRecord, setFoundRecord] = useState<IssueRecord | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSearch = () => {
    setMessage(null);
    if (!studentId || !bookId) {
      setMessage({ text: 'Please enter both Student ID and Book ID.', type: 'error' });
      return;
    }
    
    const record = trackingRecords.find(r => r.studentId === studentId && r.bookId === bookId && r.status === 'Issued');
    
    if (record) {
      setFoundRecord(record);
      // Auto calculate fine on search
      calculateFineLogic(record.expectedReturnDate, returnDate);
    } else {
      setFoundRecord(null);
      setFine(null);
      setLateDays(0);
      setMessage({ text: 'No active issue record found for this student and book.', type: 'error' });
    }
  };

  const calculateFineLogic = (expectedReturnDate: string, actualReturnDate: string) => {
    const expected = new Date(expectedReturnDate);
    const actual = new Date(actualReturnDate);
    
    const diffTime = actual.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      setLateDays(diffDays);
      setFine(diffDays * 10);
    } else {
      setLateDays(0);
      setFine(0);
    }
  };

  const handleReturn = () => {
    if (!foundRecord) {
      setMessage({ text: 'Please search for a valid issue record first.', type: 'error' });
      return;
    }

    const expected = new Date(foundRecord.expectedReturnDate);
    const actual = new Date(returnDate);
    const diffTime = actual.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let returnStatus: 'Early' | 'On Time' | 'Late' = 'On Time';
    if (diffDays > 0) returnStatus = 'Late';
    else if (diffDays < 0) returnStatus = 'Early';

    onReturnBook(foundRecord.id, returnDate, lateDays, fine || 0, returnStatus);
    setMessage({ 
      text: `Book Returned Successfully\nStatus: ${returnStatus}\nLate Days: ${lateDays}\nFine: Rs.${fine || 0}`, 
      type: 'success' 
    });
    
    // Clear form
    setStudentId('');
    setBookId('');
    setFoundRecord(null);
    setFine(null);
    setLateDays(0);
  };

  const clearForm = () => {
    setStudentId('');
    setBookId('');
    setReturnDate(new Date().toISOString().split('T')[0]);
    setFoundRecord(null);
    setFine(null);
    setLateDays(0);
    setMessage(null);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Return a Book</h2>
        <p className="text-slate-500 mt-1">Process a returned book and calculate late fines.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <p className="font-medium whitespace-pre-line">{message.text}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Student ID</label>
              <input 
                type="text" 
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="e.g. 2k26/CS/12"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Book ID</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={bookId}
                  onChange={e => setBookId(e.target.value)}
                  placeholder="e.g. B002"
                  className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
                />
                <button type="button" onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-lg transition-colors shadow-sm border border-slate-100">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Return Date</label>
            <input 
              type="date" 
              value={returnDate}
              onChange={e => {
                setReturnDate(e.target.value);
                if (foundRecord) calculateFineLogic(foundRecord.expectedReturnDate, e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/60 p-5 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Calculated Fine {lateDays > 0 && `(${lateDays} late days)`}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  Rs. {fine !== null ? fine : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-8">
            <button type="button" onClick={clearForm} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
              Clear
            </button>
            <button type="button" onClick={handleReturn} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
              <CheckCircle className="w-5 h-5" />
              Complete Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
