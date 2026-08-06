const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/StaffDashboard.tsx', 'utf8');

// Replace bg-slate-900 with bg-white text-slate-600
code = code.replace(/bg-slate-900 text-slate-300/g, 'bg-white border-r border-slate-200 text-slate-600');
// The active and inactive states in nav items
code = code.replace(/activeTab === item\.id \? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'/g, "activeTab === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 hover:text-slate-900'");

fs.writeFileSync('src/pages/Staff/StaffDashboard.tsx', code);
