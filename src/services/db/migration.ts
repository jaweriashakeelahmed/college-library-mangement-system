import { getDocs, doc, setDoc } from 'firebase/firestore';
import { collections } from './collections';
import { INITIAL_BOOKS, INITIAL_STUDENTS } from '@/src/data/mockData';
import { migrateBooksCategory } from '@/src/utils/categoryMigration';
import { db } from '@/src/firebase';

export async function migrateDataToFirestore() {
  const booksSnap = await getDocs(collections.books);
  if (booksSnap.empty) {
    console.log("Migrating books to Firestore...");
    const books = migrateBooksCategory(INITIAL_BOOKS);
    for (const book of books) {
      await setDoc(doc(db, 'books', book.id), book);
    }
  }

  const studentsSnap = await getDocs(collections.students);
  if (studentsSnap.empty) {
    console.log("Migrating students to Firestore...");
    for (const student of INITIAL_STUDENTS) {
      await setDoc(doc(db, 'students', student.id), student);
    }
  }
}
