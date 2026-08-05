const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Books.tsx', 'utf8');

code = code.replace(
  /const matchesSearch = [\s\S]*?toLowerCase\(\)\);/,
  `const q = searchQuery.toLowerCase();
      const matchesSearch = 
        (book.name || '').toLowerCase().includes(q) ||
        (book.author || '').toLowerCase().includes(q) ||
        (book.id || '').toLowerCase().includes(q) ||
        (book.isbn13 || '').includes(q) ||
        (book.isbn10 || '').includes(q) ||
        (book.category || '').toLowerCase().includes(q) ||
        (book.department || '').toLowerCase().includes(q) ||
        (book.publisher || '').toLowerCase().includes(q) ||
        (book.rackNumber || '').toLowerCase().includes(q) ||
        (book.shelfNumber || '').toLowerCase().includes(q);`
);
fs.writeFileSync('src/pages/Staff/Books.tsx', code);
