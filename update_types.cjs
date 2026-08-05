const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

const newTypes = `
export interface ReservationRecord {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookName: string;
  reservationDate: string;
  status: 'Pending' | 'Ready' | 'Completed' | 'Cancelled';
  queuePosition: number;
}

export interface LibrarySettings {
  maxBooksPerStudent: number;
  maxBooksPerFaculty: number;
  maxBorrowingDays: number;
  maxRenewals: number;
  maxReservations: number;
  finePerDay: number;
  gracePeriodDays: number;
}
`;

code = code.replace(/export interface IssueRecord \{[\s\S]*?\}/, `export interface IssueRecord {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookName: string;
  issueDate: string;
  expectedReturnDate: string;
  returnDate?: string;
  lateDays?: number;
  fine?: number;
  status: 'Issued' | 'Returned' | 'Overdue' | 'Lost' | 'Damaged';
  returnStatus?: 'Early' | 'On Time' | 'Late';
  conditionOnReturn?: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost';
  renewals?: number;
}`);

code += newTypes;

fs.writeFileSync('src/types/index.ts', code);
