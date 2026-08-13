const fs = require('fs');

let content = fs.readFileSync('src/pages/Student/StudentDashboard.tsx', 'utf8');

content = content.replace(/className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl shrink-0 z-10"/,
                          'className="w-64 bg-white text-slate-600 flex flex-col shadow-xl shrink-0 z-10 border-r border-slate-200"');
content = content.replace(/<h2 className="text-2xl font-bold text-white flex items-center gap-2">/,
                          '<h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">');
content = content.replace(/<div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 text-white font-bold shadow-inner">/,
                          '<div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0 text-blue-700 font-bold shadow-inner">');
content = content.replace(/<div className="text-white font-medium text-sm truncate">\{student\.name\}<\/div>/,
                          '<div className="text-slate-800 font-bold text-sm truncate">{student.name}</div>');
content = content.replace(/<button onClick=\{onLogout\} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors">/,
                          '<button onClick={onLogout} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">');

fs.writeFileSync('src/pages/Student/StudentDashboard.tsx', content);
