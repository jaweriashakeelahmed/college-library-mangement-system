import { BookOpen, Users, BookUp, BookDown, Info, CheckCircle2 } from 'lucide-react';
import { Book, Student, IssueRecord } from '../types';

interface DashboardProps {
  books: Book[];
  students: Student[];
  trackingRecords: IssueRecord[];
}

export function Dashboard({ books, students, trackingRecords }: DashboardProps) {
  const issuedBooksCount = trackingRecords.filter(r => r.status === 'Issued').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);
  
  const overdueCount = trackingRecords.filter(r => {
    if (r.returnStatus === 'Late') return true;
    if (r.status === 'Issued') {
      return todayDate > new Date(r.expectedReturnDate);
    }
    return false;
  }).length;
  
  const onTimeCount = trackingRecords.filter(r => r.returnStatus === 'On Time' || r.returnStatus === 'Early').length;

  const stats = [
    { label: 'Total Books', value: books.length.toString(), icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Students', value: students.length.toString(), icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Books Issued', value: issuedBooksCount.toString(), icon: BookUp, color: 'text-amber-600 bg-amber-50' },
    { label: 'Overdue Returns', value: overdueCount.toString(), icon: BookDown, color: 'text-rose-600 bg-rose-50' },
    { label: 'On Time Returns', value: onTimeCount.toString(), icon: CheckCircle2, color: 'text-teal-600 bg-teal-50' },
  ];

  const recentIssues = trackingRecords.filter(r => r.status === 'Issued').slice(0, 3);
  const activeOverdue = trackingRecords.filter(r => r.status === 'Issued' && todayDate > new Date(r.expectedReturnDate)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Welcome back to the College Library Management System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col gap-3 transition-shadow hover:shadow-md">
              <div className={`${stat.color} p-3 rounded-xl self-start`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Book Issues</h3>
          <div className="space-y-4">
            {recentIssues.length > 0 ? recentIssues.map((record, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50/50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100/50 uppercase">
                    {record.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{record.studentName}</p>
                    <p className="text-sm text-slate-500">Issued: {record.bookName}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400 font-medium">{record.issueDate}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 p-3">No recent issues found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">System Alerts</h3>
          <div className="space-y-4">
            {activeOverdue > 0 ? (
              <div className="bg-amber-50/80 border border-amber-200/60 text-amber-900 p-5 rounded-xl flex items-start gap-4">
                <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <h4 className="font-semibold">{activeOverdue} Books Overdue</h4>
                  <p className="text-sm mt-1 text-amber-800/80">Please check the return history and calculate fines for late students.</p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/80 border border-emerald-200/60 text-emerald-900 p-5 rounded-xl flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
                <div>
                  <h4 className="font-semibold">No Overdue Books</h4>
                  <p className="text-sm mt-1 text-emerald-800/80">All issued books are within their return periods.</p>
                </div>
              </div>
            )}
            <div className="bg-blue-50/80 border border-blue-200/60 text-blue-900 p-5 rounded-xl flex items-start gap-4">
              <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
              <div>
                <h4 className="font-semibold">System Updated</h4>
                <p className="text-sm mt-1 text-blue-800/80">Total {books.length} books and {students.length} students are currently registered in the system.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
