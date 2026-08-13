const fs = require('fs');

let content = fs.readFileSync('src/pages/Staff/Books.tsx', 'utf8');

// Replace category filtering with department filtering
content = content.replace(/const \[filterCategory, setFilterCategory\] = useState\(''\);/, 
                          "const [filterDepartment, setFilterDepartment] = useState('');");
                          
content = content.replace(/if \(filterCategory\) \{\s*result = result.filter\(b => b\.category === filterCategory\);\s*\}/, 
                          "if (filterDepartment) {\n      result = result.filter(b => b.department === filterDepartment);\n    }");

content = content.replace(/const categories = Array\.from\(new Set\(books\.map\(b => b\.category\)\)\)\.filter\(Boolean\);/, 
                          "const departments = Array.from(new Set(books.map(b => b.department))).filter(Boolean);");

content = content.replace(/<select value=\{filterCategory\} onChange=\{\(e\) => setFilterCategory\(e\.target\.value\)\} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none min-w-\[140px\]">/, 
                          '<select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none min-w-[140px]">');

content = content.replace(/<option value="">All Categories<\/option>/, '<option value="">All Departments</option>');
content = content.replace(/\{categories\.map\(c => <option key=\{c\} value=\{c\}>\{c\}<\/option>\)\}/, 
                          '{departments.map(d => <option key={d} value={d}>{d}</option>)}');

// Remove category from table column
content = content.replace(/<div className="text-xs text-slate-500">\{book\.category \|\| '-'}<\/div>/, '');

fs.writeFileSync('src/pages/Staff/Books.tsx', content);
