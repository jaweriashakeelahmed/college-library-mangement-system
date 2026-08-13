const fs = require('fs');

const rawContent = fs.readFileSync('build_real_books.cjs', 'utf-8');
const objMatch = rawContent.match(/const rawData = ({[\s\S]*?});/);
if (objMatch) {
  let rawData;
  eval(`rawData = ${objMatch[1]}`);
  
  const mapping = {
    "CS": "Computer Science",
    "SE": "Software Engineering",
    "AI": "AI",
    "IT": "IT",
    "AF": "Accounting & Finance",
    "EDU": "Education",
    "BBA": "BBA",
    "ENG": "English Literature"
  };

  let books = [];
  let idCounter = 1000;
  
  for (const [deptKey, deptArr] of Object.entries(rawData)) {
    const deptName = mapping[deptKey] || deptKey;
    let items = deptArr.slice(0, 40);
    
    // Fallback if less than 40
    while(items.length < 40) {
      items.push([
        `${deptName} Concepts Vol ${items.length + 1}`,
        `Author ${items.length + 1}`,
        `${deptName} Press`,
        "1st Edition",
        "2023"
      ]);
    }
    
    for (let i = 0; i < 40; i++) {
      const b = items[i];
      books.push({
        id: `B${idCounter++}`,
        accessionNumber: `ACC-2026-${idCounter}`,
        isbn13: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        name: b[0],
        author: b[1],
        publisher: b[2],
        edition: b[3],
        publicationYear: b[4],
        language: "English",
        department: deptName,
        semester: ((i % 8) + 1).toString(),
        subject: `Core ${deptName}`,
        shelfNumber: (i % 10 + 1).toString(),
        rackNumber: String.fromCharCode(65 + (i % 5)),
        rowNumber: ((i % 4) + 1).toString(),
        floor: "1st Floor",
        totalCopies: 5,
        availableCopies: 5,
        issuedCopies: 0,
        reservedCopies: 0,
        lostCopies: 0,
        damagedCopies: 0,
        status: "Available"
      });
    }
  }

  const content = `import { Book } from '@/src/types/index';\n\nexport const INITIAL_BOOKS: Book[] = ${JSON.stringify(books, null, 2)};\n`;
  fs.writeFileSync('src/data/booksData.ts', content);
  console.log("Written booksData.ts with", books.length, "books");
}
