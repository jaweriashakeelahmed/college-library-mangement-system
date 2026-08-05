import React, { useState, useMemo } from 'react';
import { Banknote, Search, Plus, FileText, Settings, CheckCircle2, AlertCircle, TrendingUp, Filter, Printer, Receipt } from 'lucide-react';
import { FineRecord, PaymentRecord, FineSettings, Student, Staff } from '@/src/types/index';

interface FinesDashboardProps {
  fines: FineRecord[];
  setFines: React.Dispatch<React.SetStateAction<FineRecord[]>>;
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  fineSettings: FineSettings;
  setFineSettings: React.Dispatch<React.SetStateAction<FineSettings>>;
  students: Student[];
  staffData: Staff;
}

export function FinesDashboard({ fines, setFines, payments, setPayments, fineSettings, setFineSettings, students, staffData }: FinesDashboardProps) {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Paid' | 'Settings'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingFines = fines.filter(f => f.status === 'Pending' || f.status === 'Partially Paid');
  const paidFines = fines.filter(f => f.status === 'Paid' || f.status === 'Waived' || f.status === 'Cancelled');

  const totalPendingAmount = pendingFines.reduce((acc, f) => acc + (f.amount - f.amountPaid - f.waivedAmount), 0);
  const totalCollectedAmount = payments.reduce((acc, p) => acc + p.amount, 0);

  const filteredPending = pendingFines.filter(f => f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || f.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPaid = paidFines.filter(f => f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || f.studentId.toLowerCase().includes(searchQuery.toLowerCase()));

  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean, fine: FineRecord | null }>({ isOpen: false, fine: null });
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Card'>('Cash');
  const [paymentRemarks, setPaymentRemarks] = useState('');

  const [waiverModal, setWaiverModal] = useState<{ isOpen: boolean, fine: FineRecord | null }>({ isOpen: false, fine: null });
  const [waiverAmount, setWaiverAmount] = useState<number>(0);
  const [waiverReason, setWaiverReason] = useState('');
  const [addFineModal, setAddFineModal] = useState({ isOpen: false });
  const [newFineStudentId, setNewFineStudentId] = useState('');
  const [newFineAmount, setNewFineAmount] = useState<number>(0);
  const [newFineReason, setNewFineReason] = useState('');

  const handleAddFine = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newFineStudentId || s.email === newFineStudentId);
    if (!student) {
      alert('Student not found');
      return;
    }
    const newFine: FineRecord = {
      id: `F${String(Date.now()).slice(-6)}`,
      studentId: student.id,
      studentName: student.name,
      amount: newFineAmount,
      reason: newFineReason,
      dateIssued: new Date().toISOString().split('T')[0],
      status: 'Pending',
      amountPaid: 0,
      waivedAmount: 0
    };
    setFines(prev => [newFine, ...prev]);
    setAddFineModal({ isOpen: false });
    alert('Fine added successfully.');
  };


  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal.fine) return;
    
    const fine = paymentModal.fine;
    const amount = Number(paymentAmount);
    
    const newPayment: PaymentRecord = {
      id: `PAY${String(payments.length + 1).padStart(4, '0')}`,
      fineId: fine.id,
      studentId: fine.studentId,
      amount,
      date: new Date().toISOString(),
      method: paymentMethod,
      status: 'Completed',
      processedBy: staffData.name,
      receiptNumber: `REC${Date.now().toString().slice(-6)}`,
      remarks: paymentRemarks
    };
    
    setPayments(prev => [newPayment, ...prev]);
    
    setFines(prev => prev.map(f => {
      if (f.id === fine.id) {
        const newPaid = f.amountPaid + amount;
        const remaining = f.amount - f.waivedAmount - newPaid;
        return {
          ...f,
          amountPaid: newPaid,
          status: remaining <= 0 ? 'Paid' : 'Partially Paid'
        };
      }
      return f;
    }));
    
    setPaymentModal({ isOpen: false, fine: null });
    alert(`Payment of Rs. ${amount} processed successfully. Receipt: ${newPayment.receiptNumber}`);
  };

  const handleWaiveFine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waiverModal.fine) return;

    const fine = waiverModal.fine;
    const amount = Number(waiverAmount);

    setFines(prev => prev.map(f => {
      if (f.id === fine.id) {
        const newWaived = f.waivedAmount + amount;
        const remaining = f.amount - f.amountPaid - newWaived;
        return {
          ...f,
          waivedAmount: newWaived,
          remarks: (f.remarks ? f.remarks + '\n' : '') + `Waived Rs. ${amount}. Reason: ${waiverReason}`,
          status: remaining <= 0 ? (f.amountPaid > 0 ? 'Paid' : 'Waived') : f.status
        };
      }
      return f;
    }));

    setWaiverModal({ isOpen: false, fine: null });
    alert(`Waived Rs. ${amount} successfully.`);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fines & Payments</h2>
          <p className="text-slate-500 mt-1">Manage overdue fines, lost book charges, and payments.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setAddFineModal({ isOpen: true })}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-emerald-100 text-emerald-700 hover:bg-emerald-200 mr-2 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Fine
          </button>

          {['Pending', 'Paid', 'Settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab !== 'Settings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Pending Fines</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {totalPendingAmount}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Collected</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {totalCollectedAmount}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Fine Records</p>
              <p className="text-2xl font-bold text-slate-800">{fines.length}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 overflow-y-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Fine & Fee Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 border-b pb-2">Overdue Rules</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Daily Fine Rate (Rs.)</label>
                  <input type="number" value={fineSettings.finePerDay} onChange={e => setFineSettings({...fineSettings, finePerDay: Number(e.target.value)})} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Grace Period (Days)</label>
                  <input type="number" value={fineSettings.gracePeriodDays} onChange={e => setFineSettings({...fineSettings, gracePeriodDays: Number(e.target.value)})} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Maximum Fine Limit (Rs.)</label>
                  <input type="number" value={fineSettings.maxFine} onChange={e => setFineSettings({...fineSettings, maxFine: Number(e.target.value)})} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 border-b pb-2">Damage & Lost Fees</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Lost Book Processing Fee (Rs.)</label>
                  <input type="number" value={fineSettings.lostBookProcessingFee} onChange={e => setFineSettings({...fineSettings, lostBookProcessingFee: Number(e.target.value)})} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Minor Damage Fee (Rs.)</label>
                  <input type="number" value={fineSettings.minorDamageFee} onChange={e => setFineSettings({...fineSettings, minorDamageFee: Number(e.target.value)})} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Major Damage Fee (Rs.)</label>
                  <input type="number" value={fineSettings.majorDamageFee} onChange={e => setFineSettings({...fineSettings, majorDamageFee: Number(e.target.value)})} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'Settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search student or ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Date Issued</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Paid</th>
                  <th className="px-6 py-4 text-right">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(activeTab === 'Pending' ? filteredPending : filteredPaid).map(fine => {
                  const balance = fine.amount - fine.amountPaid - fine.waivedAmount;
                  return (
                    <tr key={fine.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{fine.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{fine.studentName}</div>
                        <div className="text-xs text-slate-500">{fine.studentId}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{fine.reason}</td>
                      <td className="px-6 py-4 text-slate-500">{fine.dateIssued}</td>
                      <td className="px-6 py-4 text-right font-medium">Rs. {fine.amount}</td>
                      <td className="px-6 py-4 text-right text-emerald-600">Rs. {fine.amountPaid}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">Rs. {balance}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          fine.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                          fine.status === 'Waived' ? 'bg-slate-100 text-slate-700' :
                          fine.status === 'Partially Paid' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {fine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {activeTab === 'Pending' && (
                          <>
                            <button onClick={() => { setPaymentModal({ isOpen: true, fine }); setPaymentAmount(balance); }} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors">
                              Pay
                            </button>
                            <button onClick={() => { setWaiverModal({ isOpen: true, fine }); setWaiverAmount(balance); }} className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors border border-slate-200">
                              Waive
                            </button>
                          </>
                        )}
                        {activeTab === 'Paid' && (
                           <button className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1 ml-auto">
                              <Receipt className="w-3.5 h-3.5" /> Receipt
                           </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {(activeTab === 'Pending' ? filteredPending : filteredPaid).length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                      No fines found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.isOpen && paymentModal.fine && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Banknote className="w-5 h-5 text-emerald-600"/> Process Payment</h3>
            </div>
            <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                <div className="flex justify-between text-slate-500 mb-1"><span>Student:</span> <span className="font-bold text-slate-800">{paymentModal.fine.studentName}</span></div>
                <div className="flex justify-between text-slate-500 mb-1"><span>Reason:</span> <span className="font-bold text-slate-800">{paymentModal.fine.reason}</span></div>
                <div className="flex justify-between text-slate-500"><span>Pending Balance:</span> <span className="font-bold text-rose-600">Rs. {paymentModal.fine.amount - paymentModal.fine.amountPaid - paymentModal.fine.waivedAmount}</span></div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Amount (Rs.)</label>
                <input type="number" required min="1" max={paymentModal.fine.amount - paymentModal.fine.amountPaid - paymentModal.fine.waivedAmount} value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPaymentModal({isOpen: false, fine: null})} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">Process Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Waiver Modal */}
      {waiverModal.isOpen && waiverModal.fine && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Filter className="w-5 h-5 text-amber-600"/> Waive Fine</h3>
            </div>
            <form onSubmit={handleWaiveFine} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                <div className="flex justify-between text-slate-500 mb-1"><span>Pending Balance:</span> <span className="font-bold text-rose-600">Rs. {waiverModal.fine.amount - waiverModal.fine.amountPaid - waiverModal.fine.waivedAmount}</span></div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Waive Amount (Rs.)</label>
                <input type="number" required min="1" max={waiverModal.fine.amount - waiverModal.fine.amountPaid - waiverModal.fine.waivedAmount} value={waiverAmount} onChange={e => setWaiverAmount(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Waiver</label>
                <textarea required rows={3} value={waiverReason} onChange={e => setWaiverReason(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="E.g. Approved by Head Librarian"></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setWaiverModal({isOpen: false, fine: null})} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold">Approve Waiver</button>
              </div>
            </form>
          </div>
        </div>
      )}

    
      {/* Add Fine Modal */}
      {addFineModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-600"/> Add Manual Fine</h3>
            </div>
            <form onSubmit={handleAddFine} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID or Email</label>
                <input type="text" required value={newFineStudentId} onChange={e => setNewFineStudentId(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="e.g. STU001" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Fine Amount (Rs.)</label>
                <input type="number" required min="1" value={newFineAmount} onChange={e => setNewFineAmount(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                <input type="text" required value={newFineReason} onChange={e => setNewFineReason(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Late Return, Lost ID Card" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setAddFineModal({isOpen: false})} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">Add Fine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
