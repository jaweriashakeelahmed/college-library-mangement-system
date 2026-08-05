const fs = require('fs');
const data = fs.readFileSync('src/data/booksData.json', 'utf8');
fs.writeFileSync('src/data/booksData.ts', `import { Book } from '@/src/types/index';\n\nexport const INITIAL_BOOKS: Book[] = ${data};\n`);
