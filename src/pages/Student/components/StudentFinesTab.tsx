import React, { useState } from 'react';
import { FineRecord, PaymentRecord, Student } from '@/src/types/index';
import { Banknote, AlertCircle, CheckCircle2, History, CreditCard } from 'lucide-react';

interface StudentFinesTabProps {
  student: Student;
  fines: FineRecord[];
  payments: PaymentRecord[];
}

export function StudentFinesTab({ student, fines, payments }: StudentFinesTabProps) {
  const [activeTab, setActiveTab] = useState<'Fines' | 'Payments'>('Fines');

  const myFines = fines.filter(f => f.studentId === student.id);
  const myPayments = payments.filter(p => p.studentId === student.id);

  const pendingFines = myFines.filter(f => f.status === 'Pending' || f.status === 'Partially Paid');
  
  const totalDue = pendingFines.reduce((acc, f) => acc + (f.amount - f.amountPaid - f.waivedAmount), 0);
  const totalPaid = myPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Fines & Payments</h2>
        <p className="text-slate-500 mt-1">View your library fines, penalties, and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
          <AlertCircle className="w-24 h-24 absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
          <div className="relative z-10">
            <p className="text-rose-100 font-medium uppercase tracking-wider text-sm mb-1">Total Outstanding</p>
            <h3 className="text-4xl font-bold">Rs. {totalDue}</h3>
            {totalDue > 0 && <p className="text-sm mt-3 text-rose-100 bg-rose-700/50 inline-block px-3 py-1 rounded-full">Please pay at the library desk.</p>}
            {totalDue === 0 && <p className="text-sm mt-3 text-rose-100 bg-rose-700/50 inline-block px-3 py-1 rounded-full">All clear!</p>}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium uppercase tracking-wider text-sm mb-1">Total Paid</p>
            <h3 className="text-3xl font-bold text-slate-800">Rs. {totalPaid}</h3>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('Fines')}
            className={`flex-1 py-4 text-center font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'Fines' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            Fine Records
          </button>
          <button
            onClick={() => setActiveTab('Payments')}
            className={`flex-1 py-4 text-center font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'Payments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            Payment History
          </button>
        </div>

        <div className="p-0 overflow-x-auto">
          {activeTab === 'Fines' && (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Paid/Waived</th>
                  <th className="px-6 py-4 text-right">Due</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {myFines.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">You have no fine records.</td></tr>
                ) : myFines.map(fine => {
                  const balance = fine.amount - fine.amountPaid - fine.waivedAmount;
                  return (
                    <tr key={fine.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{fine.id}</td>
                      <td className="px-6 py-4 text-slate-600">{fine.reason}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(fine.dateIssued).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right font-medium">Rs. {fine.amount}</td>
                      <td className="px-6 py-4 text-right text-emerald-600">Rs. {fine.amountPaid + fine.waivedAmount}</td>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === 'Payments' && (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Receipt</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Fine ID</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {myPayments.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No payments found.</td></tr>
                ) : myPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{payment.receiptNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(payment.date).toLocaleString()}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{payment.fineId}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        <CreditCard className="w-3.5 h-3.5" /> {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">Rs. {payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
