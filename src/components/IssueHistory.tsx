import { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { IssueRecord } from '../types';

interface IssueHistoryProps {
  records: IssueRecord[];
}

export function IssueHistory({ records }: IssueHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records.filter(r => 
    r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.bookId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
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
            <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-700 cursor-pointer">
              <option>All Time</option>
              <option>This Month</option>
              <option>Past 7 Days</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Book ID</th>
                <th className="px-6 py-4">Book Name</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Expected Return</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map((record, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{record.studentId}</td>
                  <td className="px-6 py-4 text-slate-700">{record.studentName}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{record.bookId}</td>
                  <td className="px-6 py-4 text-slate-600">{record.bookName}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(record.issueDate)}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(record.expectedReturnDate)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
