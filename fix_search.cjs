const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/components/StudentSearch.tsx', 'utf8');

code = code.replace(
  /result = result\.filter\(b =>[\s\S]*?\);/,
  `result = result.filter(b => 
        (b.name || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.isbn13 || '').includes(q) ||
        (b.isbn10 || '').includes(q) ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.department || '').toLowerCase().includes(q) ||
        (b.publisher || '').toLowerCase().includes(q) ||
        (b.rackNumber || '').toLowerCase().includes(q) ||
        (b.shelfNumber || '').toLowerCase().includes(q)
      );`
);
fs.writeFileSync('src/pages/Student/components/StudentSearch.tsx', code);
