export interface Book {
  id: string;
  name: string;
  author: string;
  department: string;
  status: 'Available' | 'Issued';
}

export interface Student {
  id: string;
  name: string;
  department: string;
  semester: number;
  phone: string;
}

export interface IssueRecord {
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
  status: 'Issued' | 'Returned' | 'Overdue';
  returnStatus?: 'Early' | 'On Time' | 'Late';
}

export interface ReturnRecord {
  studentId: string;
  bookId: string;
  returnDate: string;
  fine: number;
  status: 'Returned';
}
