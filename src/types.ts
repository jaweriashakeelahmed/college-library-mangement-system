export interface Book {
  id: string;
  name: string;
  author: string;
  department: string;
  status: 'Available' | 'Issued';
  imageUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  department: string;
  semester: string | number;
  phone: string;
  password?: string; // added for auth
  wishlist?: string[]; // array of book IDs
}

export interface Staff {
  id: string; // username
  name: string;
  email: string;
  password?: string;
}

export interface CurrentUser {
  role: 'student' | 'staff';
  id: string;
  name: string;
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
