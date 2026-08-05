import React from 'react';
import { Book, Student, IssueRecord, ReturnRequest } from '@/src/types';
import { 
  BookOpen, Users, BookUp, BookDown, AlertCircle, Clock, Search, BookMarked, RefreshCw, Calendar, TrendingUp, ShieldCheck
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface DashboardProps {
  books: Book[];
  students: Student[];
  trackingRecords: IssueRecord[];
  returnRequests: ReturnRequest[];
  onNavigate: (tab: any) => void;
}

export function Dashboard({ books, students, trackingRecords, returnRequests, onNavigate }: DashboardProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);

  const activeStudents = students.filter(s => s.accountStatus === 'Active').length;
  const staffCount = 2; // Fixed as mock

  const issuedToday = trackingRecords.filter(r => r.issueDate.startsWith(todayStr)).length;
  const returnedToday = trackingRecords.filter(r => r.returnDate?.startsWith(todayStr)).length;

  const pendingReturns = returnRequests.filter(r => r.status === 'Pending' && r.type === 'Return Before Time').length;
  const pendingExchanges = returnRequests.filter(r => r.status === 'Pending' && r.type === 'Exchange').length;
  const pendingReservations = returnRequests.filter(r => r.status === 'Pending' && r.type === 'Book Reservation' as any).length;
  const pendingRenewals = returnRequests.filter(r => r.status === 'Pending' && r.type === 'Renewal').length;
  
  const activeReservations = returnRequests.filter(r => r.status === 'Approved' && r.type === 'Book Reservation' as any).length;

  const overdueRecords = trackingRecords.filter(r => r.status === 'Issued' && todayDate > new Date(r.expectedReturnDate));
  
  const currentFines = trackingRecords.reduce((acc, r) => acc + (r.fine || 0), 0);

  const stats = [
    { label: 'Total Books', value: books.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', tab: 'Books' },
    { label: 'Total Students', value: students.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', tab: 'Students' },
    { label: 'Active Members', value: activeStudents, icon: BookMarked, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100', tab: 'Students' },
    { label: 'Staff Members', value: staffCount, icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', tab: 'Home' },
    { label: 'Books Issued Today', value: issuedToday, icon: BookUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', tab: 'Issue' },
    { label: 'Books Returned Today', value: returnedToday, icon: BookDown, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', tab: 'Return' },
    { label: 'Pending Returns', value: pendingReturns, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', tab: 'Requests' },
    { label: 'Pending Exchanges', value: pendingExchanges, icon: RefreshCw, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', tab: 'Requests' },
    { label: 'Pending Reservations', value: pendingReservations, icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', tab: 'Requests' },
    { label: 'Active Reservations', value: activeReservations, icon: BookMarked, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', tab: 'Requests' },
    { label: 'Overdue Books', value: overdueRecords.length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', tab: 'Tracking' },
    { label: 'Fine Collection', value: `Rs. ${currentFines}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', tab: 'Tracking' },
  ];

  // Chart data calculation
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const circulationData = last7Days.map(date => {
    const issues = trackingRecords.filter(r => r.issueDate.startsWith(date)).length;
    const returns = trackingRecords.filter(r => r.returnDate?.startsWith(date)).length;
    const dateLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { date: dateLabel, Issues: issues, Returns: returns };
  });

  const topBooksCounts: Record<string, number> = {};
  trackingRecords.forEach(r => {
    topBooksCounts[r.bookName] = (topBooksCounts[r.bookName] || 0) + 1;
  });
  const topBooksData = Object.entries(topBooksCounts)
    .map(([name, count]) => ({ name, Issues: count }))
    .sort((a, b) => b.Issues - a.Issues)
    .slice(0, 5);

  const deptCounts: Record<string, number> = {};
  students.forEach(s => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts)
    .map(([name, count]) => ({ name, value: count }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
          <p className="text-slate-500 mt-1">Here is what's happening in the library today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button 
              key={i} 
              onClick={() => onNavigate(stat.tab)}
              className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-slate-300 text-left group"
            >
              <div className={`${stat.bg} ${stat.color} ${stat.border} border p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 mb-0.5 truncate">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800 truncate">{stat.value}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Circulation Trends (Last 7 Days)</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={circulationData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="Issues" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Returns" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onNavigate('Issue')} className="p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold flex flex-col items-center gap-2 transition-colors border border-blue-100">
                <BookUp className="w-5 h-5" /> Issue Book
              </button>
              <button onClick={() => onNavigate('Return')} className="p-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold flex flex-col items-center gap-2 transition-colors border border-emerald-100">
                <BookDown className="w-5 h-5" /> Return Book
              </button>
              <button onClick={() => onNavigate('Requests')} className="p-3 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-semibold flex flex-col items-center gap-2 transition-colors border border-orange-100">
                <RefreshCw className="w-5 h-5" /> Approve Requests
              </button>
              <button onClick={() => onNavigate('Students')} className="p-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-semibold flex flex-col items-center gap-2 transition-colors border border-purple-100">
                <Users className="w-5 h-5" /> Manage Students
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">System Alerts</h3>
            <div className="space-y-3">
              {overdueRecords.length > 0 ? (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{overdueRecords.length} Books Overdue</h4>
                    <p className="text-xs mt-0.5 opacity-90">Please collect fines for late returns.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg flex items-start gap-3">
                  <BookMarked className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">No Overdue Books</h4>
                    <p className="text-xs mt-0.5 opacity-90">All issued books are within periods.</p>
                  </div>
                </div>
              )}
              {(pendingReturns > 0 || pendingExchanges > 0) && (
                <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-lg flex items-start gap-3">
                  <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{pendingReturns + pendingExchanges + pendingRenewals + pendingReservations} Pending Requests</h4>
                    <p className="text-xs mt-0.5 opacity-90">Please review pending returns, exchanges, renewals, and reservations.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Popular Books</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBooksData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={150} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Issues" radius={[0, 4, 4, 0]} barSize={24}>
                  {topBooksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Students by Department</h3>
          <div className="h-64 w-full flex items-center justify-center">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                     contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
