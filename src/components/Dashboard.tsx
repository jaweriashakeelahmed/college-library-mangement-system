import { BookOpen, Users, BookUp, BookDown, Info } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Total Books', value: '1,248', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Students', value: '850', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Books Issued', value: '156', icon: BookUp, color: 'text-amber-600 bg-amber-50' },
    { label: 'Overdue Returns', value: '12', icon: BookDown, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Welcome back to the College Library Management System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex items-center gap-5 transition-shadow hover:shadow-md">
              <div className={`${stat.color} p-4 rounded-xl`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Book Issues</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50/50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100/50">
                    S{i+1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Student {100 + i}</p>
                    <p className="text-sm text-slate-500">Issued: Data Structures</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400 font-medium">Today</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">System Alerts</h3>
          <div className="space-y-4">
            <div className="bg-amber-50/80 border border-amber-200/60 text-amber-900 p-5 rounded-xl flex items-start gap-4">
              <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
              <div>
                <h4 className="font-semibold">12 Books Overdue</h4>
                <p className="text-sm mt-1 text-amber-800/80">Please check the return history and calculate fines for late students.</p>
              </div>
            </div>
            <div className="bg-blue-50/80 border border-blue-200/60 text-blue-900 p-5 rounded-xl flex items-start gap-4">
              <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
              <div>
                <h4 className="font-semibold">New Books Added</h4>
                <p className="text-sm mt-1 text-blue-800/80">50 new CS department books have been cataloged today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
