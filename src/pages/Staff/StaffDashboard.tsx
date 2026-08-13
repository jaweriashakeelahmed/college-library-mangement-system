import React, { useState } from 'react';
import { Book, Student, IssueRecord, ReturnRequest, BorrowRequest, ActivityLog, CurrentUser, Staff, FineRecord, PaymentRecord, FineSettings } from '@/src/types';
import { 
  LogOut, LayoutDashboard, BookOpen, Users, BookUp, BookDown, History, Info, Activity, UserCircle, Bell, Search, GraduationCap, Home, ClipboardList, RefreshCw, Banknote, Settings, Menu, X
} from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Books } from './Books';
import { Students } from './Students';
import { IssueBook } from './IssueBook';
import { ReturnBook } from './ReturnBook';
import { IssueHistory } from './TrackingRecords';
import { Requests } from './Requests';
import { StaffProfile } from './components/StaffProfile';
import { FinesDashboard } from './FinesDashboard';

export type TabType = 'Home' | 'Requests' | 'Books' | 'Students' | 'Issue' | 'Return' | 'Tracking' | 'Activity' | 'Profile';

interface StaffDashboardProps {
  fines: FineRecord[];
  setFines: React.Dispatch<React.SetStateAction<FineRecord[]>>;
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  fineSettings: FineSettings;
  setFineSettings: React.Dispatch<React.SetStateAction<FineSettings>>;
  currentUser: CurrentUser;
  staffData: Staff;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  staffs: Staff[];
  setStaffs: React.Dispatch<React.SetStateAction<Staff[]>>;
  trackingRecords: IssueRecord[];
  returnRequests: ReturnRequest[];
  borrowRequests: BorrowRequest[];
  setBorrowRequests: React.Dispatch<React.SetStateAction<BorrowRequest[]>>;
  activityLogs: ActivityLog[];
  onLogout: () => void;
  onIssueBook: (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => void;
  onReturnBook: (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number) => void;
  onApproveReturnRequest: (requestId: string, approved: boolean) => void;
  onUpdateRequestStatus: (requestId: string, status: ReturnRequest['status'], reason?: string) => void;
  addActivityLog: (user: string, role: 'student' | 'staff' | 'system', action: ActivityLog['action'], details?: string) => void;
}

export function StaffDashboard(props: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'Home', icon: Home, label: 'Dashboard' },
    { id: 'Books', icon: BookOpen, label: 'Books' },
    { id: 'Students', icon: Users, label: 'Students' },
    { id: 'Issue', icon: BookUp, label: 'Issue Book' },
    { id: 'Return', icon: BookDown, label: 'Return Book' },
    { id: 'Tracking', icon: ClipboardList, label: 'Issue History' },
    { id: 'Requests', icon: RefreshCw, label: 'Requests' },
    { id: 'Fines', icon: Banknote, label: 'Fines & Payments' },
    { id: 'Activity', icon: Activity, label: 'Activity Logs' },
    { id: 'Profile', icon: Settings, label: 'Settings & Profile' },
  ];
  const todayDate = new Date();
  const activeOverdueCount = props.trackingRecords.filter(r => r.status === 'Issued' && todayDate > new Date(r.expectedReturnDate)).length;
  const pendingRequestsCount = props.returnRequests.filter(r => r.status === 'Pending').length;
  
  const unreadNotifications = activeOverdueCount + pendingRequestsCount;

  const renderContent = () => {
    switch (activeTab) {
      case 'Home': return <Dashboard 
          books={props.books} 
          students={props.students} 
          trackingRecords={props.trackingRecords} 
          returnRequests={props.returnRequests}
          onNavigate={setActiveTab} 
        />;
      case 'Books': return <Books books={props.books} setBooks={props.setBooks} trackingRecords={props.trackingRecords} />;
      case 'Students': return <Students students={props.students} setStudents={props.setStudents} trackingRecords={props.trackingRecords} />;
      case 'Issue': return <IssueBook books={props.books} students={props.students} onIssueBook={props.onIssueBook} settings={{maxBooksPerStudent: 3, maxBorrowingDays: 15}} trackingRecords={props.trackingRecords} />;
      case 'Return': return <ReturnBook trackingRecords={props.trackingRecords} onReturnBook={props.onReturnBook} fineSettings={props.fineSettings} />;
      case 'Tracking': return <IssueHistory records={props.trackingRecords} />;
      case 'Requests': return <Requests returnRequests={props.returnRequests} borrowRequests={props.borrowRequests} onUpdateBorrowRequest={(id, status, remarks) => {
    let finalStatus = status;
    const br = props.borrowRequests.find(r => r.id === id);
    if (br && (br.status === 'Approved' || br.status === 'Rejected' || br.status === 'Issued' || br.status === 'Cancelled')) {
      if (status === 'Approved' || status === 'Rejected') {
        alert("This request has already been processed.");
        return;
      }
    }
    if (status === 'Approved' && br) {
      const book = props.books.find(b => b.id === br.bookId);
      const avail = book?.availableCopies ?? (book?.status === 'Available' ? 1 : 0);
      if (avail <= 0) {
        alert("Cannot approve. Book is out of stock.");
        return; // do not approve
      }
    }
    
    props.setBorrowRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: finalStatus,
          staffRemarks: remarks,
          statusHistory: [...(req.statusHistory || []), { status: finalStatus, date: new Date().toISOString(), by: props.staffData.name, remarks }]
        };
      }
      return req;
    }));
    
    if (finalStatus === 'Approved' && br) {
      if (props.onIssueBook) {
        props.onIssueBook(br.studentName, br.rollNumber || "", br.bookId, br.bookName);
      }
    }
  }} onApprove={props.onApproveReturnRequest} onUpdateStatus={props.onUpdateRequestStatus} students={props.students} trackingRecords={props.trackingRecords} />;
      case 'Fines': return <FinesDashboard fines={props.fines} setFines={props.setFines} payments={props.payments} setPayments={props.setPayments} fineSettings={props.fineSettings} setFineSettings={props.setFineSettings} students={props.students} staffData={props.staffData} />;
      case 'Activity': return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              System Activity Log
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">User ID</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {props.activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{log.user}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.role === 'student' ? 'bg-emerald-100 text-emerald-700' :
                        log.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        log.action.includes('Failed') ? 'text-rose-600' : 'text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                      {log.details && <span className="text-slate-400 ml-2">({log.details})</span>}
                    </td>
                  </tr>
                ))}
                {props.activityLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
      case 'Profile': return <StaffProfile staff={props.staffData} onUpdateProfile={(updates) => {
        props.setStaffs(props.staffs.map(s => s.id === props.staffData.id ? { ...s, ...updates } : s));
      }} />;
      default: return <Dashboard books={props.books} students={props.students} trackingRecords={props.trackingRecords} returnRequests={props.returnRequests} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              LMS Admin
            </h2>
            <div className="mt-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 text-white font-bold shadow-inner uppercase">
                  {props.staffData.name.charAt(0)}
               </div>
               <div className="min-w-0">
                  <div className="text-white font-medium text-sm truncate">{props.staffData.name}</div>
                  <div className="text-xs text-slate-500 truncate capitalize">{props.currentUser.role}</div>
               </div>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </div>
              {item.id === 'Requests' && pendingRequestsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button
            onClick={props.onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 rounded-xl transition-colors font-medium text-sm group shadow-sm"
          >
            <LogOut className="w-5 h-5 group-hover:text-white" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Toggle navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global search (Students, Books, Requests)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
