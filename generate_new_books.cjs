const fs = require('fs');

const depts = [
  'CS',
  'SE',
  'AI',
  'IT',
  'Accounting and Finance',
  'Education',
  'BBA Education',
  'English Literature'
];

let books = [];
let idCounter = 1000;

for (const dept of depts) {
  for (let i = 1; i <= 45; i++) {
    books.push({
      id: `B${idCounter++}`,
      accessionNumber: `ACC-2026-${idCounter}`,
      isbn13: `978-000000${idCounter}`,
      name: `${dept} Fundamentals Vol ${i}`,
      author: `Author ${i} of ${dept}`,
      publisher: `${dept} Press`,
      edition: "1st Edition",
      publicationYear: "2023",
      language: "English",
      department: dept,
      semester: ((i % 8) + 1).toString(),
      subject: `Core ${dept}`,
      shelfNumber: (i % 10).toString(),
      rackNumber: "A",
      rowNumber: "1",
      floor: "Main Floor",
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

const content = `import { Book } from '@/src/types/index';

export const INITIAL_BOOKS: Book[] = ${JSON.stringify(books, null, 2)};
`;

fs.writeFileSync('src/data/booksData.ts', content);
