import React, { useState } from 'react';
import { Book, IssueRecord, Student } from '../types';
import { BookOpen, User, Clock, AlertCircle, FileText, CheckCircle2, LogOut, Bell } from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  books: Book[];
  trackingRecords: IssueRecord[];
  onLogout: () => void;
}

export function StudentDashboard({ student, books, trackingRecords, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Library' | 'Issued' | 'Profile'>('Dashboard');

  const myRecords = trackingRecords.filter(r => r.studentId === student.id);
  const myIssued = myRecords.filter(r => r.status === 'Issued');
  const myHistory = myRecords.filter(r => r.status !== 'Issued');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);

  const calculateDaysLeft = (expectedDate: string) => {
    const expected = new Date(expectedDate);
    const diffTime = expected.getTime() - todayDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getFine = (record: IssueRecord) => {
    if (record.status !== 'Issued') return record.fine || 0;
    const daysLeft = calculateDaysLeft(record.expectedReturnDate);
    if (daysLeft < 0) {
      return Math.abs(daysLeft) * 10;
    }
    return 0;
  };

  const totalFine = myRecords.reduce((acc, curr) => acc + getFine(curr), 0);
  const activeOverdue = myIssued.filter(r => calculateDaysLeft(r.expectedReturnDate) < 0);

  const downloadChallan = () => {
    // In a real app, generate PDF. Here we'll just alert.
    alert(`Downloading Fine Challan for Rs. ${totalFine} (Student ID: ${student.id})`);
  };

  // Find expected return dates for issued books
  const getExpectedReturnDate = (bookId: string) => {
    const record = trackingRecords.find(r => r.bookId === bookId && r.status === 'Issued');
    return record ? record.expectedReturnDate : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <User className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Student Portal</h1>
          </div>

          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('Dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'Dashboard' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
              My Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('Library')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'Library' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.5]" />
              Library Catalog
            </button>
            <button 
              onClick={() => setActiveTab('Issued')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'Issued' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[1.5]" />
              My Issued Books
            </button>
            <button 
              onClick={() => setActiveTab('Profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'Profile' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <User className="w-5 h-5 stroke-[1.5]" />
              My Profile
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
            <LogOut className="w-5 h-5 stroke-[1.5]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome, {student.name}</h2>
            <p className="text-slate-500 text-sm">{student.id} - Dept. of {student.department}, Semester {student.semester}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:bg-white rounded-full transition-colors">
              <Bell className="w-6 h-6 stroke-[1.5]" />
              {activeOverdue.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              {student.name.charAt(0)}
            </div>
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            
            {/* Notifications */}
            {activeOverdue.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 p-5 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 mt-0.5 shrink-0 text-rose-600" />
                <div>
                  <h4 className="font-semibold text-lg">Overdue Books Alert!</h4>
                  <p className="mt-1 text-rose-800/80">You have {activeOverdue.length} overdue book(s). Please return them to the library immediately.</p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                <p className="text-sm font-medium text-slate-500 mb-1">Books Issued</p>
                <p className="text-3xl font-bold text-slate-900">{myIssued.length} / 3</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                <p className="text-sm font-medium text-slate-500 mb-1">Overdue Books</p>
                <p className="text-3xl font-bold text-rose-600">{activeOverdue.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Fine</p>
                <p className="text-3xl font-bold text-slate-900">Rs. {totalFine}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-center">
                <button 
                  onClick={downloadChallan}
                  disabled={totalFine === 0}
                  className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                    totalFine > 0 ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Challan
                </button>
              </div>
            </div>

            {/* Borrowing History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Borrowing History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Book Details</th>
                      <th className="px-4 py-3">Issue Date</th>
                      <th className="px-4 py-3">Returned On</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-r-lg">Fine Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myHistory.length > 0 ? myHistory.map(record => (
                      <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">{record.bookName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">ID: {record.bookId}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{record.issueDate}</td>
                        <td className="px-4 py-4 text-slate-600">{record.returnDate || '-'}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                            record.returnStatus === 'Early' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                            record.returnStatus === 'On Time' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                            'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}>
                            Returned {record.returnStatus ? `(${record.returnStatus})` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          Rs. {record.fine || 0}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No borrowing history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        )}

        {activeTab === 'Issued' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">My Issued Books</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Book Details</th>
                      <th className="px-4 py-3">Issue Date</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-r-lg">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myIssued.length > 0 ? myIssued.map(record => {
                      const daysLeft = calculateDaysLeft(record.expectedReturnDate);
                      const isOverdue = daysLeft < 0;
                      return (
                        <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{record.bookName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">ID: {record.bookId}</p>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{record.issueDate}</td>
                          <td className="px-4 py-4 text-slate-600">{record.expectedReturnDate}</td>
                          <td className="px-4 py-4">
                            {isOverdue ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                                Overdue by {Math.abs(daysLeft)} days
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                                {daysLeft} days left
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 font-semibold text-slate-900">
                            Rs. {getFine(record)}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          You haven't issued any books currently.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Library' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Library Catalog</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => {
                const isIssued = book.status !== 'Available';
                const expectedDate = isIssued ? getExpectedReturnDate(book.id) : null;
                const daysLeft = expectedDate ? calculateDaysLeft(expectedDate) : null;
                
                return (
                  <div key={book.id} className={`border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow ${isIssued ? 'opacity-70 bg-slate-50/50' : 'bg-white'}`}>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      <BookOpen className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{book.name}</h4>
                    <p className="text-sm text-slate-500 mb-4">By {book.author}</p>
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {book.department}
                        </span>
                        {isIssued ? (
                          <span className="text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 px-2 py-1 rounded">
                            Issued
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-1 rounded">
                            Available
                          </span>
                        )}
                      </div>
                      {isIssued && daysLeft !== null && (
                        <div className="text-xs font-medium text-slate-500 mt-1">
                          {daysLeft < 0 ? 'Overdue - returning soon' : `Available in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 max-w-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">My Profile</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{student.name}</h4>
                  <p className="text-slate-500">Student</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Student ID (Roll No)</p>
                  <p className="font-semibold text-slate-900">{student.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Department</p>
                  <p className="font-semibold text-slate-900">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Semester</p>
                  <p className="font-semibold text-slate-900">{student.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                  <p className="font-semibold text-slate-900">{student.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
