import React, { useState, useEffect } from 'react';
import { Book, IssueRecord, Student, ReturnRequest } from '../types';
import { BookOpen, User, Clock, AlertCircle, FileText, CheckCircle2, LogOut, Bell, Heart, X, Check } from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  books: Book[];
  trackingRecords: IssueRecord[];
  returnRequests?: ReturnRequest[];
  onLogout: () => void;
  onIssueBook: (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => void;
  onToggleWishlist: (studentId: string, bookId: string) => void;
  onReturnRequest: (request: any) => void;
}

export function StudentDashboard({ student, books, trackingRecords, returnRequests = [], onLogout, onIssueBook, onToggleWishlist, onReturnRequest }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Library' | 'Issued' | 'Profile' | 'Wishlist'>('Dashboard');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<Book | null>(null);
  const [returnRequestModalOpen, setReturnRequestModalOpen] = useState(false);
  const [selectedRecordForRequest, setSelectedRecordForRequest] = useState<IssueRecord | null>(null);
  const [requestType, setRequestType] = useState<'Return Before Time' | 'Exchange'>('Return Before Time');
  const [requestReason, setRequestReason] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [issueDate, setIssueDate] = useState(todayStr);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  const myRecords = trackingRecords.filter(r => r.studentId === student.id);
  const myIssued = myRecords.filter(r => r.status === 'Issued');
  const myHistory = myRecords.filter(r => r.status !== 'Issued');

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

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const notifs = [];
    
    // 1. Overdue Books
    activeOverdue.forEach(record => {
      notifs.push({
        id: `overdue-${record.id}`,
        title: 'Overdue Book',
        message: `"${record.bookName}" is overdue by ${Math.abs(calculateDaysLeft(record.expectedReturnDate))} days.`,
        type: 'alert',
        date: new Date().toISOString()
      });
    });

    // 2. Fines
    if (totalFine > 0) {
      notifs.push({
        id: `fine-${student.id}`,
        title: 'Outstanding Fine',
        message: `You have an outstanding fine of Rs. ${totalFine}.`,
        type: 'warning',
        date: new Date().toISOString()
      });
    }

    // 3. Return Requests Updates
    const myRequests = returnRequests.filter(req => req.studentId === student.id);
    myRequests.forEach(req => {
      if (req.status !== 'Pending') {
        notifs.push({
          id: `req-${req.id}`,
          title: `Request ${req.status}`,
          message: `Your ${req.type.toLowerCase()} request for "${req.bookName}" has been ${req.status.toLowerCase()}.`,
          type: req.status === 'Approved' ? 'success' : 'alert',
          date: req.requestDate
        });
      }
    });

    // 4. New books notification
    if (books.length > 50) {
      notifs.push({
        id: 'new-books-1',
        title: 'New Books Added',
        message: 'New books have been added to the library catalog recently. Check them out!',
        type: 'info',
        date: new Date().toISOString()
      });
    }

    setNotifications(notifs);
  }, [trackingRecords, returnRequests, books.length, student.id, totalFine]);

  const downloadChallan = () => {
    // In a real app, generate PDF. Here we'll just alert.
    alert(`Downloading Fine Challan for Rs. ${totalFine} (Student ID: ${student.id})`);
  };

  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleIssueBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForIssue) return;

    if (myIssued.length >= 3) {
      showToast('Maximum borrowing limit reached (3 books). Please return a book before borrowing another.', 'error');
      return;
    }

    if (selectedBookForIssue.status !== 'Available') {
      showToast('This book is currently issued and is not available.', 'error');
      return;
    }

    onIssueBook(student.name, student.id, selectedBookForIssue.id, selectedBookForIssue.name, expectedReturnDate);
    showToast('Book is available and allotted successfully!', 'success');
    
    setTimeout(() => {
      setIssueModalOpen(false);
      setSelectedBookForIssue(null);
      setExpectedReturnDate('');
    }, 1000);
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
            <button 
              onClick={() => setActiveTab('Wishlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'Wishlist' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              My Wishlist
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
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-slate-200 text-slate-600' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
              >
                <Bell className="w-6 h-6 stroke-[1.5]" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-50 rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    {notifications.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {notifications.length} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-[24rem] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex gap-3">
                              <div className={`mt-0.5 rounded-full p-1.5 h-fit shrink-0 ${
                                notif.type === 'alert' ? 'bg-rose-100 text-rose-600' : 
                                notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {notif.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                                {notif.type === 'warning' && <Clock className="w-4 h-4" />}
                                {notif.type === 'success' && <Check className="w-4 h-4" />}
                                {notif.type === 'info' && <Bell className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                                <p className="text-sm text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                                <span className="text-xs text-slate-400 mt-1.5 block">
                                  {new Date(notif.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <Bell className="w-8 h-8 text-slate-200 mb-3" />
                        <p className="text-slate-500 font-medium">All caught up!</p>
                        <p className="text-slate-400 text-sm mt-1">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                      <th className="px-4 py-3">Fine</th>
                      <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
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
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedRecordForRequest(record);
                                setReturnRequestModalOpen(true);
                              }}
                              className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Request Return
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
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
                  <div 
                    key={book.id} 
                    onClick={() => {
                      if (!isIssued) {
                        setSelectedBookForIssue(book);
                        setIssueModalOpen(true);
                      }
                    }}
                    className={`border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative ${isIssued ? 'opacity-70 bg-slate-50/50' : 'bg-white cursor-pointer hover:border-emerald-500/50'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <BookOpen className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(student.id, book.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${student.wishlist?.includes(book.id) ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600'}`}
                      >
                        <Heart className="w-5 h-5" fill={student.wishlist?.includes(book.id) ? "currentColor" : "none"} />
                      </button>
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

        {activeTab === 'Wishlist' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
              My Wishlist
            </h3>
            
            {!student.wishlist || student.wishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-700 mb-1">Your wishlist is empty</h4>
                <p className="text-slate-500">Explore the Library Catalog and tap the heart icon to save books for later.</p>
                <button 
                  onClick={() => setActiveTab('Library')}
                  className="mt-6 px-6 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium rounded-xl transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.filter(book => student.wishlist?.includes(book.id)).map(book => {
                  const isIssued = book.status !== 'Available';
                  const expectedDate = isIssued ? getExpectedReturnDate(book.id) : null;
                  const daysLeft = expectedDate ? calculateDaysLeft(expectedDate) : null;
                  
                  return (
                    <div 
                      key={book.id} 
                      onClick={() => {
                        if (!isIssued) {
                          setSelectedBookForIssue(book);
                          setIssueModalOpen(true);
                        }
                      }}
                      className={`border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative ${isIssued ? 'opacity-70 bg-slate-50/50' : 'bg-white cursor-pointer hover:border-emerald-500/50'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <BookOpen className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(student.id, book.id);
                          }}
                          className={`p-2 rounded-full transition-colors text-rose-500 bg-rose-50 hover:bg-rose-100`}
                        >
                          <Heart className="w-5 h-5" fill="currentColor" />
                        </button>
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
            )}
          </div>
        )}

        {/* Issue Book Modal */}
        {issueModalOpen && selectedBookForIssue && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative">
              {/* Toast Notification for Modal */}
              {toastMessage && (
                <div className={`absolute top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${
                  toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="font-medium text-sm">{toastMessage.text}</p>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-500" />
                  Issue Book
                </h2>
                <button 
                  onClick={() => {
                    setIssueModalOpen(false);
                    setSelectedBookForIssue(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <h4 className="font-bold text-slate-900">{selectedBookForIssue.name}</h4>
                <p className="text-sm text-slate-500 mb-2">By {selectedBookForIssue.author}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ID: {selectedBookForIssue.id}</span>
                  <span className="text-emerald-600 font-medium">Available</span>
                </div>
              </div>

              <form onSubmit={handleIssueBookSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Student ID</label>
                    <input 
                      type="text" 
                      value={student.id}
                      readOnly
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none transition-all text-slate-700 opacity-80 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Book ID</label>
                    <input 
                      type="text" 
                      value={selectedBookForIssue.id}
                      readOnly
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none transition-all text-slate-700 opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Issue Date</label>
                    <input 
                      type="date" 
                      readOnly
                      value={issueDate}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none transition-all text-slate-700 opacity-80 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Expected Return Date</label>
                    <input 
                      type="date"
                      required
                      value={expectedReturnDate}
                      onChange={(e) => setExpectedReturnDate(e.target.value)}
                      min={issueDate}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => {
                      setIssueModalOpen(false);
                      setSelectedBookForIssue(null);
                    }}
                    className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 text-white bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
                  >
                    Confirm Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Return Request Modal */}
        {returnRequestModalOpen && selectedRecordForRequest && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  Request Return/Exchange
                </h3>
                <button 
                  onClick={() => {
                    setReturnRequestModalOpen(false);
                    setSelectedRecordForRequest(null);
                    setRequestReason('');
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                onReturnRequest({
                  id: `REQ${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                  studentId: student.id,
                  studentName: student.name,
                  bookId: selectedRecordForRequest.bookId,
                  bookName: selectedRecordForRequest.bookName,
                  type: requestType,
                  reason: requestReason,
                  status: 'Pending',
                  requestDate: new Date().toISOString().split('T')[0]
                });
                setReturnRequestModalOpen(false);
                setSelectedRecordForRequest(null);
                setRequestReason('');
                showToast('Request submitted successfully!', 'success');
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Request Type</label>
                  <select
                    value={requestType}
                    onChange={(e: any) => setRequestType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="Return Before Time">Return Before Time</option>
                    <option value="Exchange">Exchange Book</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Reason</label>
                  <textarea
                    required
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="Briefly state your reason..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => {
                      setReturnRequestModalOpen(false);
                      setSelectedRecordForRequest(null);
                      setRequestReason('');
                    }}
                    className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
