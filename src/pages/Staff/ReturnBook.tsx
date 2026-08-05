
import React, { useState, useEffect } from 'react';
import { Search, Receipt, CheckCircle, X, AlertCircle, Calendar, RefreshCcw } from 'lucide-react';
import { IssueRecord, FineSettings } from '@/src/types/index';

interface ReturnBookProps {
  trackingRecords: IssueRecord[];
  onReturnBook: (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number, condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost') => void;
  fineSettings: FineSettings;
}

export function ReturnBook({ trackingRecords, onReturnBook, fineSettings }: ReturnBookProps) {
  const [query, setQuery] = useState('');
  const [foundRecord, setFoundRecord] = useState<IssueRecord | null>(null);
  
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [lateDays, setLateDays] = useState<number>(0);
  const [fine, setFine] = useState<number | null>(null);
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost'>('Good');
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const calculateFineLogic = (expected: string, actual: string, cond: string) => {
    const expDate = new Date(expected);
    const actDate = new Date(actual);
    
    expDate.setHours(0, 0, 0, 0);
    actDate.setHours(0, 0, 0, 0);
    
    const diffTime = actDate.getTime() - expDate.getTime();
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Apply grace period
    if (diffDays <= fineSettings.gracePeriodDays) {
        diffDays = 0;
    }
    
    setLateDays(diffDays);
    
    let baseFine = diffDays > 0 ? diffDays * fineSettings.finePerDay : 0;
    if (baseFine > fineSettings.maxFine) baseFine = fineSettings.maxFine;
    
    let damageFee = 0;
    if (cond === 'Lost') damageFee = fineSettings.lostBookProcessingFee;
    else if (cond === 'Damaged') damageFee = fineSettings.majorDamageFee; // simplified

    setFine(baseFine + damageFee);
  };

  useEffect(() => {
    if (foundRecord) {
      calculateFineLogic(foundRecord.expectedReturnDate, returnDate, condition);
    }
  }, [returnDate, condition, foundRecord, fineSettings]);

  const handleSearch = () => {
    if (!query) {
      showToast('Please enter a Search Query', 'error');
      return;
    }
    
    const q = query.toLowerCase();
    
    const record = trackingRecords.find(r => 
      r.status === 'Issued' && 
      (r.bookId.toLowerCase() === q || 
       r.studentId.toLowerCase() === q ||
       (r.id && r.id.toLowerCase() === q)
      )
    );
    
    if (record) {
      setFoundRecord(record);
      calculateFineLogic(record.expectedReturnDate, returnDate, condition);
      showToast('Issue record found.', 'success');
    } else {
      setFoundRecord(null);
      setLateDays(0);
      setFine(null);
      showToast('No active issue record found for this query.', 'error');
    }
  };

  const handleProcessReturn = () => {
    if (!foundRecord) {
      showToast('Search for a valid issue record first.', 'error');
      return;
    }
    setShowReceipt(true);
  };

  const confirmReturn = () => {
    if (foundRecord && fine !== null) {
      const returnStatus = lateDays > 0 ? 'Late' : (lateDays < 0 ? 'Early' : 'On Time');
      onReturnBook(foundRecord.id, returnStatus as any, lateDays, fine, condition as any);
      
      setShowReceipt(false);
      showToast('Book returned successfully!', 'success');
      clearForm();
    }
  };

  const clearForm = () => {
    setQuery('');
    setFoundRecord(null);
    setReturnDate(new Date().toISOString().split('T')[0]);
    setLateDays(0);
    setFine(null);
    setCondition('Good');
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 relative pb-10">
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${
          toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="font-medium">{toastMessage.text}</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-800">Return Book</h2>
        <p className="text-slate-500 mt-1">Scan book barcode, student ID, or enter record ID to process a return.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Search by Barcode / Student ID / Record ID</label>
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Scan or type here..."
                className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-lg font-medium"
              />
              <button 
                type="button" 
                onClick={handleSearch} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {foundRecord && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">Issue Details</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Book ID:</span>
                    <span className="font-bold text-slate-800">{foundRecord.bookId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Title:</span>
                    <span className="font-bold text-slate-800 line-clamp-1 text-right max-w-[200px]">{foundRecord.bookName}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Student ID:</span>
                    <span className="font-bold text-slate-800">{foundRecord.studentId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-bold text-slate-800">{foundRecord.studentName}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Condition on Return</label>
                    <select 
                      value={condition} 
                      onChange={e => setCondition(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Damaged">Damaged (+ Rs. {fineSettings.majorDamageFee} Penalty)</option>
                      <option value="Lost">Lost (+ Rs. {fineSettings.lostBookProcessingFee} Penalty)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Return Date</label>
                    <input 
                      type="date" 
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    Total Fine {lateDays > 0 && `(${lateDays} late days)`} {['Damaged', 'Lost'].includes(condition) && `+ ${condition} penalty`}
                  </p>
                  <p className="text-3xl font-bold text-emerald-900 mt-1">
                    Rs. {fine !== null ? fine : '0'}
                  </p>
                </div>
                <button type="button" onClick={handleProcessReturn} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95">
                  <RefreshCcw className="w-5 h-5" />
                  Process Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReceipt && foundRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Return Receipt
              </h3>
              <button 
                onClick={() => setShowReceipt(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-full hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-800">{foundRecord.studentName} ({foundRecord.studentId})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Book:</span>
                  <span className="font-bold text-slate-800 max-w-[200px] text-right truncate">{foundRecord.bookName} ({foundRecord.bookId})</span>
                </div>
              </div>
              
              <div className="h-px bg-slate-200 w-full border-dashed border-b"></div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Expected Return:</span>
                  <span className="font-medium text-slate-800">{new Date(foundRecord.expectedReturnDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Actual Return:</span>
                  <span className="font-medium text-slate-800">{new Date(returnDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Condition:</span>
                  <span className={`font-bold ${['Damaged', 'Lost'].includes(condition) ? 'text-rose-600' : 'text-emerald-600'}`}>{condition}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Late Days:</span>
                  <span className={`font-medium ${lateDays > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{lateDays} Days</span>
                </div>
              </div>
              
              <div className="h-px bg-slate-200 w-full border-dashed border-b"></div>
              
              <div className="flex justify-between items-end">
                <span className="text-base font-semibold text-slate-800">Total Fine Due:</span>
                <span className="text-3xl font-bold text-emerald-600">Rs. {fine !== null ? fine : '0'}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowReceipt(false)}
                className="px-5 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors w-full"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReturn}
                className="px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors w-full"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm & Collect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
