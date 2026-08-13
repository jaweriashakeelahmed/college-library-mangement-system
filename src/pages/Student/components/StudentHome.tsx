import React, { useMemo } from 'react';
import { BookOpen, Clock, AlertCircle, Bookmark, Star, ArrowRight, BookMarked, Bell, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { Student, Book, IssueRecord } from '@/src/types';

interface StudentHomeProps {
  student: Student;
  books: Book[];
  records: IssueRecord[];
  onNavigate: (tab: string) => void;
  onBookClick: (book: Book) => void;
}

export function StudentHome({ student, books, records, onNavigate, onBookClick }: StudentHomeProps) {
  const currentBorrowed = records.filter(r => r.status === 'Issued');
  const today = new Date();
  
  const dueToday = currentBorrowed.filter(r => {
    const due = new Date(r.expectedReturnDate);
    return due.toDateString() === today.toDateString();
  });
  
  const overdue = currentBorrowed.filter(r => {
    const due = new Date(r.expectedReturnDate);
    return due < today;
  });

  const totalFine = records.reduce((sum, r) => sum + (r.fine || 0), 0);
  
  const recommendations = useMemo(() => {
    return books
      .filter(b => b.department === student.department || b.semester === student.semester)
      .slice(0, 4);
  }, [books, student]);

  const quickActions = [
    { name: 'Search Books', icon: BookOpen, color: 'bg-blue-100 text-blue-700', tab: 'Search Books' },
    { name: 'My Borrowed', icon: Bookmark, color: 'bg-emerald-100 text-emerald-700', tab: 'My Books' },
    { name: 'Wishlist', icon: Star, color: 'bg-amber-100 text-amber-700', tab: 'Wishlist' },
    { name: 'Borrow History', icon: Clock, color: 'bg-purple-100 text-purple-700', tab: 'History' },
    { name: 'Digital Card', icon: BookMarked, color: 'bg-rose-100 text-rose-700', tab: 'Profile' },
    { name: 'Requests', icon: Activity, color: 'bg-indigo-100 text-indigo-700', tab: 'Requests' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-50 rounded-3xl p-8 text-blue-900 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 overflow-hidden flex items-center justify-center shrink-0 shadow-xl backdrop-blur-sm">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold">{student.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Welcome back, {student.name.split(' ')[0]}!</h1>
            <p className="text-blue-700 font-medium flex items-center gap-2">
              <span>{student.department} • Semester {student.semester}</span>
            </p>
          </div>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 md:w-32 text-center border border-white/10">
            <div className="text-3xl font-black">{currentBorrowed.length}</div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mt-1">Borrowed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 md:w-32 text-center border border-white/10">
            <div className="text-3xl font-black text-rose-300">Rs. {totalFine}</div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mt-1">Total Fine</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActions.map(action => (
                <button 
                  key={action.name} 
                  onClick={() => onNavigate(action.tab)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center text-center gap-3 active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700">{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          </div>
        {/* Right Col: Sidebar */}
        <div className="space-y-6">
          
          {/* Alerts & Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-800">Alerts</h3>
            </div>
            <div className="p-2">
              {overdue.length > 0 && (
                <div className="p-3 bg-rose-50 rounded-xl mb-2 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-800 text-sm">Overdue Books</div>
                    <div className="text-xs text-rose-600/80 mt-0.5">You have {overdue.length} overdue book(s). Please return them immediately.</div>
                  </div>
                </div>
              )}
              {dueToday.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl mb-2 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-800 text-sm">Due Today</div>
                    <div className="text-xs text-amber-600/80 mt-0.5">{dueToday.length} book(s) are due today.</div>
                  </div>
                </div>
              )}
              {overdue.length === 0 && dueToday.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  You're all caught up! No pending alerts.
                </div>
              )}
            </div>
          </div>

          {/* Reading Stats Widget */}
          <div className="bg-indigo-50 border border-blue-100 rounded-2xl p-6 text-blue-900 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <TrendingUp className="w-24 h-24" />
             </div>
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10"><Activity className="w-5 h-5"/> Reading Stats</h3>
             
             <div className="space-y-4 relative z-10">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">Total Borrowed</span>
                   <span className="font-bold">{records.length}</span>
                 </div>
                 <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">Returned on Time</span>
                   <span className="font-bold">{records.filter(r => r.status === 'Returned' && (r.lateDays || 0) === 0).length}</span>
                 </div>
                 <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(records.filter(r => r.status === 'Returned' && (r.lateDays || 0) === 0).length / (records.length || 1)) * 100}%` }}></div>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
