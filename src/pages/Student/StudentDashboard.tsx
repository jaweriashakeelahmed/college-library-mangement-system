import React, { useState, useEffect } from 'react';
import { Book, ReturnRequest, BorrowRequest, Student, IssueRecord, FineRecord, PaymentRecord } from '@/src/types';
import { 
  LogOut, 
  Home, 
  Search, 
  BookMarked, 
  Star, 
  Clock, 
  Activity, 
  UserCircle,
  Banknote,
  Menu,
  X
} from 'lucide-react';
import { StudentHome } from './components/StudentHome';
import { StudentSearch } from './components/StudentSearch';
import { StudentMyBooks } from './components/StudentMyBooks';
import { StudentWishlist } from './components/StudentWishlist';
import { StudentHistory } from './components/StudentHistory';
import { StudentRequests } from './components/StudentRequests';
import { StudentProfileTab } from './components/StudentProfileTab';
import { StudentBookDetails } from './components/StudentBookDetails';
import { StudentFinesTab } from './components/StudentFinesTab';
import { BorrowValidationService } from '@/src/services/borrowing/BorrowValidationService';

interface StudentDashboardProps {
  fines: FineRecord[];
  payments: PaymentRecord[];
  student: Student;
  books: Book[];
  trackingRecords: IssueRecord[];
  returnRequests: ReturnRequest[];
  borrowRequests: BorrowRequest[];
  setBorrowRequests: React.Dispatch<React.SetStateAction<BorrowRequest[]>>;
  onLogout: () => void;
  onIssueBook: (bookId: string, bookName: string, studentId: string) => void;
  onToggleWishlist: (studentId: string, bookId: string) => void;
  onReturnRequest: (request: Omit<ReturnRequest, 'id' | 'status' | 'requestDate'>) => void;
  onUpdateProfile: (studentId: string, updates: Partial<Student>) => void;
}

export function StudentDashboard({
  student,
  books,
  trackingRecords,
  returnRequests,
  borrowRequests,
  setBorrowRequests,
  onLogout,
  onIssueBook,
  onToggleWishlist,
  onReturnRequest,
  onUpdateProfile
, fines}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentRecords = trackingRecords.filter(r => r.studentId === student.id);
  const studentRequests = returnRequests.filter(r => r.studentId === student.id);
  
  useEffect(() => {
    // Simulate email notification for overdue books
    const today = new Date();
    const overdueBooks = studentRecords.filter(r => r.status === 'Issued' && new Date(r.expectedReturnDate) < today);
    if (overdueBooks.length > 0) {
      const alreadyNotified = sessionStorage.getItem(`overdue_notified_${student.id}`);
      if (!alreadyNotified) {
        console.log(`[SIMULATED EMAIL] To: ${student.email || student.id} - You have ${overdueBooks.length} overdue books. Please return them immediately.`);
        alert(`[Simulated Email] You have ${overdueBooks.length} overdue book(s). Please check your account!`);
        sessionStorage.setItem(`overdue_notified_${student.id}`, 'true');
      }
    }
  }, [studentRecords, student.id]);

  const handleRequestBorrow = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // We don't have fineSettings in StudentDashboard props right now, let's just mock it or get it
    const validation = BorrowValidationService.validate(student, book, trackingRecords, fines, {} as any, borrowRequests);
    if (!validation.isValid) {
      alert(validation.reason);
      return;
    }
    
    const newRequest: BorrowRequest = {
      id: `BR-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      membershipNumber: student.membershipNumber,
      bookId: book.id,
      bookName: book.name,
      requestDate: new Date().toISOString(),
      type: 'Borrow',
      status: 'Pending',
      statusHistory: [{ status: 'Pending', date: new Date().toISOString(), by: student.name }]
    };
    
    setBorrowRequests(prev => [...prev, newRequest]);
    alert('Borrow request submitted successfully!');
  };

  const tabs = [
    { name: 'Home', icon: Home },
    { name: 'Search Books', icon: Search },
    { name: 'My Books', icon: BookMarked },
    { name: 'Wishlist', icon: Star },
    { name: 'History', icon: Clock },
    { name: 'Requests', icon: Activity },
    { name: 'Fines', icon: Banknote },
    { name: 'Profile', icon: UserCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <StudentHome student={student} books={books} records={studentRecords} onNavigate={setActiveTab} onBookClick={setSelectedBook} />;
      case 'Search Books':
        return <StudentSearch books={books} student={student} onBookClick={setSelectedBook} onToggleWishlist={onToggleWishlist}
          onRequestBorrow={handleRequestBorrow} />;
      case 'My Books':
        return <StudentMyBooks records={studentRecords} books={books} student={student} onReturnRequest={onReturnRequest} />;
      case 'Wishlist':
        return <StudentWishlist books={books} student={student} onBookClick={setSelectedBook} onRemoveWishlist={onToggleWishlist} />;
      case 'History':
        return <StudentHistory records={studentRecords} books={books} />;
      case 'Requests':
        return <StudentRequests requests={studentRequests} borrowRequests={borrowRequests.filter(br => br.studentId === student.id)} books={books} allRequests={returnRequests} />;
      case 'Profile':
        return <StudentProfileTab 
          student={student} 
          onUpdateProfile={(updated) => onUpdateProfile(student.id, updated)} 
          onChangePassword={() => alert("Password change functionality would be integrated with auth provider.")} 
        />;
      default:
        return <StudentHome student={student} books={books} records={studentRecords} onNavigate={setActiveTab} onBookClick={setSelectedBook} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-indigo-950 text-indigo-200 flex flex-col shadow-xl shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-indigo-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-indigo-400" />
              LMS Portal
            </h2>
            <div className="mt-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center overflow-hidden shrink-0 text-white font-bold shadow-inner">
                  {student.photoUrl ? <img src={student.photoUrl} alt="" className="w-full h-full object-cover" /> : student.name.charAt(0)}
               </div>
               <div className="min-w-0">
                  <div className="text-white font-bold text-sm truncate">{student.name}</div>
                  <div className="text-xs text-indigo-300 truncate">{student.id}</div>
               </div>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-indigo-300 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.name 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'hover:bg-indigo-900/50 hover:text-white'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? 'text-white' : 'text-indigo-400'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-indigo-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-900/50 hover:bg-rose-600 hover:text-white text-indigo-300 rounded-xl transition-colors font-medium text-sm group shadow-sm"
          >
            <LogOut className="w-5 h-5 group-hover:text-white" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-600" />
              LMS Portal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden shrink-0 text-indigo-700 font-bold text-xs">
              {student.photoUrl ? <img src={student.photoUrl} alt="" className="w-full h-full object-cover" /> : student.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Global Book Details Modal */}
      {selectedBook && (
        <StudentBookDetails 
          book={selectedBook} 
          student={student} 
          onClose={() => setSelectedBook(null)} 
          onToggleWishlist={onToggleWishlist}
          onRequestBorrow={handleRequestBorrow} 
        />
      )}
    </div>
  );
}
