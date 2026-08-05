import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Download, FileSpreadsheet, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { IssueRecord, Book } from '@/src/types';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentHistoryProps {
  records: IssueRecord[];
  books: Book[];
}

export function StudentHistory({ records, books }: StudentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredRecords = useMemo(() => {
    let result = records;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.bookName.toLowerCase().includes(q) ||
        r.bookId.toLowerCase().includes(q)
      );
    }
    if (filterStatus) {
      result = result.filter(r => r.status === filterStatus);
    }
    return result.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }, [records, searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredRecords.length / limit);
  const paginatedRecords = filteredRecords.slice((page - 1) * limit, page * limit);

  const exportToCSV = () => {
    const data = filteredRecords.map(r => ({
      'Book Name': r.bookName,
      'Book ID': r.bookId,
      'Issue Date': r.issueDate,
      'Due Date': r.expectedReturnDate,
      'Return Date': r.returnDate || '-',
      'Status': r.status,
      'Fine (Rs)': r.fine || 0
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'borrow_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("My Borrow History", 14, 15);
    const tableData = filteredRecords.map(r => [
      r.bookName,
      r.issueDate,
      r.expectedReturnDate,
      r.returnDate || '-',
      r.status,
      r.fine ? `Rs. ${r.fine}` : '-'
    ]);
    autoTable(doc, {
      head: [['Book Name', 'Issue Date', 'Due Date', 'Return Date', 'Status', 'Fine']],
      body: tableData,
      startY: 20,
    });
    doc.save('borrow_history.pdf');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Borrow History</h2>
          <p className="text-slate-500 mt-1">Track all your past and current library borrowings.</p>
        </div>
        <div className="relative group z-20">
           <button className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 font-medium" title="Export">
             <Download className="w-5 h-5" /> Export Data
           </button>
           <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button onClick={exportToCSV} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2 rounded-t-xl"><FileSpreadsheet className="w-4 h-4"/> Excel / CSV</button>
              <button onClick={exportToPDF} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2 rounded-b-xl"><FileText className="w-4 h-4"/> PDF Document</button>
           </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by book name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)} 
            className="w-full md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold">Book Details</th>
                <th className="px-6 py-4 font-semibold">Issue Date</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Return Date</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.map((record) => {
                const book = books.find(b => b.id === record.bookId);
                return (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{record.bookName}</div>
                      <div className="text-xs text-slate-500">{book?.author || 'Unknown Author'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{record.issueDate}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{record.expectedReturnDate}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{record.returnDate || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        record.status === 'Returned' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.fine ? (
                        <span className="font-bold text-rose-600">Rs. {record.fine}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {paginatedRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Clock className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="font-medium text-lg text-slate-700">No history found</p>
                      <p className="text-sm">You haven't borrowed any books yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show</span>
            <select value={limit} onChange={e => {setLimit(Number(e.target.value)); setPage(1);}} className="bg-white border border-slate-200 rounded px-2 py-1 outline-none">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
