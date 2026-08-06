export interface Book {
  id: string; // Also serves as Barcode/QR
  accessionNumber?: string;
  isbn10?: string;
  isbn13?: string;
  name: string; // Title
  subtitle?: string;
  author: string;
  coAuthor?: string;
  publisher?: string;
  edition?: string;
  publicationYear?: string;
  language?: string;
  category?: string;
  materialType?: string;
  subCategory?: string;
  department: string;
  semester?: string;
  subject?: string;
  shelfNumber?: string;
  rackNumber?: string;
  rowNumber?: string;
  floor?: string;
  totalCopies?: number;
  availableCopies?: number;
  issuedCopies?: number;
  reservedCopies?: number;
  lostCopies?: number;
  damagedCopies?: number;
  price?: number;
  purchaseDate?: string;
  vendor?: string;
  description?: string;
  keywords?: string[];
  status: 'Available' | 'Issued' | 'Reserved' | 'Out of Stock' | 'Lost' | 'Damaged' | 'Archived';
  imageUrl?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Student {
  id: string; // Used as Student ID / Roll Number originally
  rollNumber?: string;
  name: string;
  fatherName?: string;
  cnic?: string;
  department: string;
  semester: string | number;
  program?: string;
  session?: string;
  phone: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  membershipNumber?: string;
  accountStatus?: 'Active' | 'Inactive' | 'Suspended' | 'Graduated' | 'Expired Membership';
  password?: string; // added for auth
  wishlist?: string[]; // array of book IDs
  photoUrl?: string; // profile photo
  failedAttempts?: number;
  lockUntil?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Staff {
  id: string; // username
  name: string;
  email: string;
  password?: string;
  failedAttempts?: number;
  lockUntil?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
}

export interface CurrentUser {
  role: 'student' | 'staff';
  id: string;
  name: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: 'student' | 'staff' | 'system';
  action: 'Student Login' | 'Student Logout' | 'Staff Login' | 'Registration' | 'Password Change' | 'Password Reset Request' | 'Password Reset Complete' | 'Failed Login' | 'Other';
  details?: string;
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
  status: 'Issued' | 'Returned' | 'Overdue' | 'Lost' | 'Damaged';
  returnStatus?: 'Early' | 'On Time' | 'Late';
  conditionOnReturn?: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost';
  renewals?: number;
}

export interface ReturnRecord {
  studentId: string;
  bookId: string;
  returnDate: string;
  fine: number;
  status: 'Returned';
}

export interface ReturnRequest {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookName: string;
  type: 'Return Before Time' | 'Exchange' | 'Book Reservation' | 'Membership' | 'Renewal';
  reason: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  requestDate: string;
}

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

export interface FineRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  reason: string;
  relatedRecordId?: string;
  dateIssued: string;
  dueDate?: string;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Waived' | 'Cancelled';
  amountPaid: number;
  waivedAmount: number;
  remarks?: string;
}

export interface PaymentRecord {
  id: string;
  fineId: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Card' | 'Manual';
  status: 'Completed' | 'Pending' | 'Failed';
  processedBy: string;
  receiptNumber: string;
  remarks?: string;
}

export interface FineSettings {
  finePerDay: number;
  gracePeriodDays: number;
  maxFine: number;
  lostBookProcessingFee: number;
  minorDamageFee: number;
  majorDamageFee: number;
  criticalDamageFee: number;
  membershipRenewalFee: number;
}

export interface BorrowRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber?: string;
  membershipNumber?: string;
  bookId: string;
  bookName: string;
  bookCopyId?: string;
  requestDate: string;
  type: 'Borrow';
  studentNotes?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Issued' | 'Cancelled';
  statusHistory?: { status: string; date: string; by: string; remarks?: string }[];
  lastUpdatedDate?: string;
  reviewedBy?: string;
  staffRemarks?: string;
}

export * from './notifications';
