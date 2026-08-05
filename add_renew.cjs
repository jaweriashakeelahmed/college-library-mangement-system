const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/components/StudentMyBooks.tsx', 'utf8');

code = code.replace(
  /<button onClick=\{\(\) => setRequestModal\(\{ isOpen: true, record, type: 'Exchange' \}\)\} className="flex-1 flex items-center justify-center gap-1\.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-200">[\s\S]*?<\/button>/,
  `$&
                    <button onClick={() => setRequestModal({ isOpen: true, record, type: 'Renewal' })} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-200">
                      <RefreshCw className="w-4 h-4" /> Renew
                    </button>`
);

code = code.replace(
  /\{requestModal\.type === 'Exchange' \? 'Exchange Book' : 'Return Book'\}/g,
  "{requestModal.type === 'Exchange' ? 'Exchange Book' : requestModal.type === 'Renewal' ? 'Renew Book' : 'Return Book'}"
);

code = code.replace(
  /Reason for \{requestModal\.type === 'Exchange' \? 'Exchange' : 'Return'\} \*/g,
  "Reason for {requestModal.type === 'Exchange' ? 'Exchange' : requestModal.type === 'Renewal' ? 'Renewal' : 'Return'} *"
);

fs.writeFileSync('src/pages/Student/components/StudentMyBooks.tsx', code);
