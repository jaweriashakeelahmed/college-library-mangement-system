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
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
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
            <p className="text-blue-100 font-medium flex items-center gap-2">
              <span className="bg-blue-900/40 px-2 py-0.5 rounded text-sm">{student.membershipNumber || 'LIB-PENDING'}</span>
              <span>{student.department} • Semester {student.semester}</span>
            </p>
          </div>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 md:w-32 text-center border border-white/10">
            <div className="text-3xl font-black">{currentBorrowed.length}</div>
            <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider mt-1">Borrowed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 md:w-32 text-center border border-white/10">
            <div className="text-3xl font-black text-rose-300">Rs. {totalFine}</div>
            <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider mt-1">Total Fine</div>
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

          {/* Current Books */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Currently Reading</h3>
              <button onClick={() => onNavigate('My Books')} className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
            </div>
            {currentBorrowed.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h4 className="text-lg font-bold text-slate-700">No books borrowed</h4>
                <p className="text-slate-500 text-sm mt-1">Explore our catalog and find your next read.</p>
                <button onClick={() => onNavigate('Search Books')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">Browse Books</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentBorrowed.slice(0, 2).map(record => {
                  const book = books.find(b => b.id === record.bookId);
                  const isOverdue = new Date(record.expectedReturnDate) < today;
                  return (
                    <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 shadow-sm hover:shadow-md transition-all">
                      <div className="w-20 h-28 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-inner">
                        {book?.imageUrl ? (
                          <img src={book.imageUrl} alt={record.bookName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200 font-bold text-xl">{record.bookName.charAt(0)}</div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate" title={record.bookName}>{record.bookName}</h4>
                        <p className="text-xs text-slate-500 mb-2 truncate">{book?.author || 'Unknown Author'}</p>
                        <div className="mt-auto space-y-1">
                           <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Due Date</div>
                           <div className={`text-sm font-bold flex items-center gap-1 ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                             <Clock className="w-3.5 h-3.5" />
                             {record.expectedReturnDate}
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Recommendations */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Recommended for You</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map(book => (
                <div key={book.id} onClick={() => onBookClick(book)} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-[2/3] w-full bg-slate-100 rounded-lg overflow-hidden mb-3">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 font-bold text-3xl">{book.name.charAt(0)}</div>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2" title={book.name}>{book.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">{book.author}</p>
                </div>
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
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <TrendingUp className="w-24 h-24" />
             </div>
             <h3 className="font-bold text-slate-200 mb-6 flex items-center gap-2 relative z-10"><Activity className="w-5 h-5"/> Reading Stats</h3>
             
             <div className="space-y-4 relative z-10">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-400">Total Borrowed</span>
                   <span className="font-bold">{records.length}</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-400">Returned on Time</span>
                   <span className="font-bold">{records.filter(r => r.status === 'Returned' && (r.lateDays || 0) === 0).length}</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
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
