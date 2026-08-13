const fs = require('fs');

let content = fs.readFileSync('src/pages/Student/components/StudentSearch.tsx', 'utf8');

// Replace filterCategory with filterDepartment
content = content.replace(/filterCategory/g, 'filterDepartment');
content = content.replace(/setFilterCategory/g, 'setFilterDepartment');

// Update filtering logic
content = content.replace(/result = result\.filter\(b => b\.category === filterDepartment\);/, 
                          'result = result.filter(b => b.department === filterDepartment);');

// Update categories to departments
content = content.replace(/const categories = Array\.from\(new Set\(books\.map\(b => b\.category\)\)\);/, 
                          'const departments = Array.from(new Set(books.map(b => b.department))).filter(Boolean);');
content = content.replace(/\{categories\.map\(c => <option key=\{c\} value=\{c\}>\{c\}<\/option>\)\}/, 
                          '{departments.map(d => <option key={d} value={d}>{d}</option>)}');
content = content.replace(/<option value="">All Categories<\/option>/, 
                          '<option value="">All Departments</option>');

content = content.replace(/placeholder="Search by title, author, category, or ISBN..."/, 
                          'placeholder="Search by title, author, department, or ISBN..."');

// Replace {book.category} display with {book.department}
content = content.replace(/<div className="text-\[10px\] font-bold text-blue-600 uppercase tracking-wider mb-1">\{book\.category\}<\/div>/g, 
                          '<div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{book.department}</div>');

fs.writeFileSync('src/pages/Student/components/StudentSearch.tsx', content);
