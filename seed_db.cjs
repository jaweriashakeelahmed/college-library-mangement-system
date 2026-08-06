import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

// Mock books
const INITIAL_BOOKS = [
  {
    id: "BK001",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "978-0262033848",
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: "CS-A1-01"
  },
  {
    id: "BK002",
    title: "Design Patterns",
    author: "Erich Gamma",
    category: "Software Engineering",
    isbn: "978-0201633610",
    totalCopies: 3,
    availableCopies: 3,
    shelfLocation: "SE-B2-04"
  }
];

async function seed() {
  const booksRef = collection(db, 'books');
  const snapshot = await getDocs(booksRef);
  if (snapshot.empty) {
    for (const book of INITIAL_BOOKS) {
      await setDoc(doc(db, 'books', book.id), book);
    }
    console.log("Books seeded");
  } else {
    console.log("Books already exist");
  }
  process.exit(0);
}
seed().catch(console.error);
