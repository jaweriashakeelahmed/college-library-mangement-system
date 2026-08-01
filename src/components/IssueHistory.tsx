import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { IssueRecord } from '../types';

interface IssueHistoryProps {
  records: IssueRecord[];
}

export function IssueHistory({ records }: IssueHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);

  const getComputedRecord = (r: IssueRecord) => {
    let status = r.status;
    let lateDays = r.lateDays || 0;
    let fine = r.fine || 0;

    if (status === 'Issued') {
      const expected = new Date(r.expectedReturnDate);
      if (todayDate > expected) {
        status = 'Overdue';
        const diffTime = todayDate.getTime() - expected.getTime();
        lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fine = lateDays * 10;
      }
    }
    return { ...r, status, lateDays, fine };
  };

  const computedRecords = records.map(getComputedRecord);

  const filteredRecords = computedRecords.filter(r => {
    const matchesSearch = r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.bookId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || r.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Issue History</h2>
        <p className="text-slate-500 mt-1">Track all current and past book issuances.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Student ID or Book ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
          </div>
          
          <div className="relative max-w-xs w-full">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Book ID</th>
                <th className="px-6 py-4">Book Name</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Return Date</th>
                <th className="px-6 py-4">Late Days</th>
                <th className="px-6 py-4">Fine</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map((record, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{record.studentId}</td>
                  <td className="px-6 py-4 text-slate-700">{record.studentName}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{record.bookId}</td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={record.bookName}>{record.bookName}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(record.issueDate)}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(record.expectedReturnDate)}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(record.returnDate)}</td>
                  <td className="px-6 py-4 text-slate-500">{record.lateDays > 0 ? record.lateDays : '-'}</td>
                  <td className="px-6 py-4 text-slate-500">{record.fine > 0 ? `Rs.${record.fine}` : '-'}</td>
                  <td className="px-6 py-4">
                    {record.status === 'Issued' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        Issued
                      </span>
                    )}
                    {record.status === 'Returned' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Returned
                      </span>
                    )}
                    {record.status === 'Overdue' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60">
                        Overdue
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    No records found matching your search.
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
