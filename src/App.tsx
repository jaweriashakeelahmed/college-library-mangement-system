import { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  BookUp, 
  BookDown, 
  History, 
  Info,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Books } from './components/Books';
import { Students } from './components/Students';
import { IssueBook } from './components/IssueBook';
import { ReturnBook } from './components/ReturnBook';
import { IssueHistory } from './components/IssueHistory';
import { About } from './components/About';
import { StudentPortal } from './components/StudentPortal';
import { INITIAL_BOOKS, INITIAL_STUDENTS } from './data';
import { IssueRecord, Book, Student } from './types';

export type TabType = 'Home' | 'Portal' | 'Books' | 'Students' | 'Issue' | 'Return' | 'Tracking' | 'About';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [trackingRecords, setTrackingRecords] = useState<IssueRecord[]>([
    { id: 'REC001', studentId: '2k26/CS/12', studentName: 'Ali Khan', bookId: 'B004', bookName: 'Data Structures', issueDate: '2026-07-20', expectedReturnDate: '2026-08-04', status: 'Issued' },
    { id: 'REC002', studentId: '2k25/IT/10', studentName: 'Sara Ahmed', bookId: 'B003', bookName: 'C++ Programming', issueDate: '2026-07-25', expectedReturnDate: '2026-08-09', status: 'Issued' },
  ]);

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

  const handleReturnBook = (recordId: string, returnDate: string, lateDays: number, fine: number) => {
    setTrackingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        // Update book status
        setBooks(booksPrev => booksPrev.map(b => b.id === r.bookId ? { ...b, status: 'Available' } : b));
        return { ...r, status: 'Returned', returnDate, lateDays, fine };
      }
      return r;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home': return <Dashboard />;
      case 'Portal': return <StudentPortal books={books} onIssueBook={handleIssueBook} trackingRecords={trackingRecords} />;
      case 'Books': return <Books books={books} setBooks={setBooks} />;
      case 'Students': return <Students students={students} setStudents={setStudents} trackingRecords={trackingRecords} />;
      case 'Issue': return <IssueBook books={books} onIssueBook={handleIssueBook} trackingRecords={trackingRecords} />;
      case 'Return': return <ReturnBook trackingRecords={trackingRecords} onReturnBook={handleReturnBook} />;
      case 'Tracking': return <IssueHistory records={trackingRecords} />;
      case 'About': return <About />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'Home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Portal', label: 'Student Portal', icon: GraduationCap },
    { id: 'Books', label: 'Books', icon: BookOpen },
    { id: 'Students', label: 'Students', icon: Users },
    { id: 'Issue', label: 'Issue Book', icon: BookUp },
    { id: 'Return', label: 'Return Book', icon: BookDown },
    { id: 'Tracking', label: 'Tracking Records', icon: History },
    { id: 'About', label: 'About', icon: Info },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Bar */}
      <header className="bg-white text-slate-800 py-4 px-6 border-b border-slate-200 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl border border-blue-100/50">🏛</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">College LMS</h1>
        </div>
        <h2 className="text-sm font-medium text-slate-500 hidden sm:block">Welcome to College Library</h2>
        <div 
          className="w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
          title="Jaweria Shakeel"
        >
          <span className="text-sm font-bold">JS</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-0">
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
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
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
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
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex flex-col items-center justify-center min-w-[72px] flex-1 py-3 px-1 transition-all duration-200 ${
                  isActive ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
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

