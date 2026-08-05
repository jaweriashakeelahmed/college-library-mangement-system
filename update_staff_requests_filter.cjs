const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Requests.tsx', 'utf8');

code = code.replace(
  /const \[filterStatus, setFilterStatus\] = useState<'All' \| 'Pending' \| 'Under Review' \| 'Approved' \| 'Rejected' \| 'Completed'>\('Pending'\);/,
  `const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed'>('Pending');
  const [filterType, setFilterType] = useState<string>('All');`
);

code = code.replace(
  /const filteredRequests = returnRequests\.filter\(r => \n    \(filterStatus === 'All' \|\| r\.status === filterStatus\) &&\n    \(r\.bookName\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\|\n     r\.studentName\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\)\n  \)/,
  `const filteredRequests = returnRequests.filter(r => 
    (filterStatus === 'All' || r.status === filterStatus) &&
    (filterType === 'All' || r.type === filterType) &&
    (r.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())`
);

code = code.replace(
  /<select \n            value=\{filterStatus\}/,
  `<select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All', 'Return Before Time', 'Exchange', 'Book Reservation', 'Renewal'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Types' : s}</option>
            ))}
          </select>
          <select 
            value={filterStatus}`
);

fs.writeFileSync('src/pages/Staff/Requests.tsx', code);
