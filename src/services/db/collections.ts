import { collection } from 'firebase/firestore';
import { db } from '@/src/firebase';

export const collections = {
  students: collection(db, 'students'),
  staffs: collection(db, 'staff'),
  administrators: collection(db, 'administrators'),
  books: collection(db, 'books'),
  bookRequests: collection(db, 'bookRequests'),
  bookIssues: collection(db, 'bookIssues'),
  bookReturns: collection(db, 'bookReturns'),
  notifications: collection(db, 'notifications'),
  wishlist: collection(db, 'wishlist'),
  fineRecords: collection(db, 'fineRecords'),
  fineChallans: collection(db, 'fineChallans'),
  libraryCards: collection(db, 'libraryCards'),
  auditLogs: collection(db, 'auditLogs'),
  authenticationLogs: collection(db, 'authenticationLogs'),
  settings: collection(db, 'settings')
};
