import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  BookUp, 
  BookDown, 
  History, 
  Info,
  LayoutDashboard,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Books } from './components/Books';
import { Students } from './components/Students';
import { IssueBook } from './components/IssueBook';
import { ReturnBook } from './components/ReturnBook';
import { IssueHistory } from './components/IssueHistory';
import { About } from './components/About';
import { Requests } from './components/Requests';
import { INITIAL_BOOKS, INITIAL_STUDENTS } from './data';
import { IssueRecord, Book, Student, Staff, CurrentUser } from './types';
import { Auth } from './components/Auth';
import { StudentDashboard } from './components/StudentDashboard';

export type TabType = 'Home' | 'Books' | 'Students' | 'Issue' | 'Return' | 'Tracking' | 'Requests' | 'About';

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('lms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lms_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students_accounts');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [staffs, setStaffs] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('staff_accounts');
    return saved ? JSON.parse(saved) : [];
  });
  const [trackingRecords, setTrackingRecords] = useState<IssueRecord[]>(() => {
    const saved = localStorage.getItem('lms_tracking');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'REC001', studentId: '2k26/CS/12', studentName: 'Ayesha Malik', bookId: 'B004', bookName: 'Data Structures', issueDate: '2026-07-20', expectedReturnDate: '2026-08-04', status: 'Issued' },
      { id: 'REC002', studentId: '2k25/IT/10', studentName: 'Zainab Tariq', bookId: 'B003', bookName: 'C++ Programming', issueDate: '2026-07-25', expectedReturnDate: '2026-08-09', status: 'Issued' },
    ];
  });
  const [returnRequests, setReturnRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('lms_return_requests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lms_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('students_accounts', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('staff_accounts', JSON.stringify(staffs));
  }, [staffs]);

  useEffect(() => {
    localStorage.setItem('lms_tracking', JSON.stringify(trackingRecords));
  }, [trackingRecords]);

  useEffect(() => {
    localStorage.setItem('lms_return_requests', JSON.stringify(returnRequests));
  }, [returnRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lms_current_user');
    }
  }, [currentUser]);

  const handleToggleWishlist = (studentId: string, bookId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const wishlist = s.wishlist || [];
        if (wishlist.includes(bookId)) {
          return { ...s, wishlist: wishlist.filter(id => id !== bookId) };
        } else {
          return { ...s, wishlist: [...wishlist, bookId] };
        }
      }
      return s;
    }));
  };

  const handleIssueBook = (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => {
    // Update book status
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: 'Issued' } : b));
    
    // Create new tracking record
    const today = new Date();
    const issueDate = today.toISOString().split('T')[0];
    let expectedReturnDate = customExpectedReturnDate;
    
    if (!expectedReturnDate) {
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 15);
      expectedReturnDate = returnDate.toISOString().split('T')[0];
    }

    const newRecord: IssueRecord = {
      id: `REC${String(trackingRecords.length + 1).padStart(3, '0')}`,
      studentId: rollNo,
      studentName,
      bookId,
      bookName,
      issueDate,
      expectedReturnDate,
      status: 'Issued'
    };
    
    setTrackingRecords(prev => [newRecord, ...prev]);
  };

  const handleReturnBook = (recordId: string, returnDate: string, lateDays: number, fine: number, returnStatus: 'Early' | 'On Time' | 'Late') => {
    setTrackingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        // Update book status
        setBooks(booksPrev => booksPrev.map(b => b.id === r.bookId ? { ...b, status: 'Available' } : b));
        return { ...r, status: 'Returned', returnDate, lateDays, fine, returnStatus };
      }
      return r;
    }));
  };

  const handleRegisterStudent = (student: Student) => {
    if (!students.find(s => s.id.toLowerCase() === student.id.toLowerCase())) {
      setStudents(prev => [student, ...prev]);
    }
  };

  const handleRegisterStaff = (staff: Staff) => {
    if (!staffs.find(s => s.id.toLowerCase() === staff.id.toLowerCase())) {
      setStaffs(prev => [staff, ...prev]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleReturnRequest = (request: any) => {
    setReturnRequests(prev => [request, ...prev]);
  };

  const handleApproveReturnRequest = (requestId: string, status: 'Approved' | 'Rejected') => {
    setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    if (status === 'Approved') {
      const request = returnRequests.find(r => r.id === requestId);
      if (request) {
        // If it's a return or exchange, mark book as available or handle logic
        setBooks(prev => prev.map(b => b.id === request.bookId ? { ...b, status: 'Available' } : b));
        setTrackingRecords(prev => prev.map(r => 
          (r.bookId === request.bookId && r.status === 'Issued') 
            ? { ...r, status: 'Returned', returnDate: new Date().toISOString().split('T')[0] } 
            : r
        ));
      }
    }
  };

  if (!currentUser) {
    return (
      <Auth 
        onLogin={setCurrentUser} 
        students={students} 
        staffs={staffs} 
        onRegisterStudent={handleRegisterStudent}
        onRegisterStaff={handleRegisterStaff}
      />
    );
  }

  if (currentUser.role === 'student') {
    const studentData = students.find(s => s.id.toLowerCase() === currentUser.id.toLowerCase());
    if (!studentData) {
      return <div className="p-8">Error loading student data. <button onClick={handleLogout}>Logout</button></div>;
    }
    return (
      <StudentDashboard 
        student={studentData} 
        books={books} 
        trackingRecords={trackingRecords} 
        returnRequests={returnRequests}
        onLogout={handleLogout} 
        onIssueBook={handleIssueBook}
        onToggleWishlist={handleToggleWishlist}
        onReturnRequest={handleReturnRequest}
        onUpdateProfile={(studentId, updates) => {
          setStudents(students.map(s => s.id === studentId ? { ...s, ...updates } : s));
        }}
      />
    );
  }

  // Staff Portal
  const renderContent = () => {
    switch (activeTab) {
      case 'Home': return <Dashboard books={books} students={students} trackingRecords={trackingRecords} />;
      case 'Books': return <Books books={books} setBooks={setBooks} />;
      case 'Students': return <Students students={students} setStudents={setStudents} trackingRecords={trackingRecords} />;
      case 'Issue': return <IssueBook books={books} students={students} onIssueBook={handleIssueBook} trackingRecords={trackingRecords} />;
      case 'Return': return <ReturnBook trackingRecords={trackingRecords} onReturnBook={handleReturnBook} />;
      case 'Tracking': return <IssueHistory records={trackingRecords} />;
      case 'Requests': return <Requests returnRequests={returnRequests} onApprove={handleApproveReturnRequest} />;
      case 'About': return <About />;
      default: return <Dashboard books={books} students={students} trackingRecords={trackingRecords} />;
    }
  };

  const navItems = [
    { id: 'Home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Books', label: 'Books', icon: BookOpen },
    { id: 'Students', label: 'Students', icon: Users },
    { id: 'Issue', label: 'Issue Book', icon: BookUp },
    { id: 'Return', label: 'Return Book', icon: BookDown },
    { id: 'Tracking', label: 'Tracking Records', icon: History },
    { id: 'Requests', label: 'Requests', icon: Info },
    { id: 'About', label: 'About', icon: Info },
  ] as const;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);
  const activeOverdueCount = trackingRecords.filter(r => r.status === 'Issued' && todayDate > new Date(r.expectedReturnDate)).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Bar */}
      <header className="bg-white text-slate-800 py-4 px-6 border-b border-slate-200 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100/50">
            <GraduationCap className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Staff Portal</h1>
        </div>
        <h2 className="text-sm font-medium text-slate-500 hidden sm:block">Welcome, {currentUser.name}</h2>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-0">
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isDashboard = item.id === 'Home';
              const showBadge = isDashboard && activeOverdueCount > 0;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {showBadge && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {activeOverdueCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation (Bottom Bar) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDashboard = item.id === 'Home';
            const showBadge = isDashboard && activeOverdueCount > 0;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`relative flex flex-col items-center justify-center min-w-[72px] flex-1 py-3 px-1 transition-all duration-200 ${
                  isActive ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {activeOverdueCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-center whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 pb-24 md:pb-6 z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-3">
          <p className="text-slate-600 font-medium">Designed & Developed by <span className="font-bold text-slate-800">Jaweria Shakeel</span></p>
          <p className="text-sm text-slate-500 font-medium text-center">1st Year &middot; BS Computer Science &middot; University of Mirpurkhas</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 shadow-sm">C++</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md border border-orange-200 shadow-sm">HTML</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md border border-sky-200 shadow-sm">CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
