import { Book, Student, IssueRecord, FineSettings, FineRecord } from '../../types';

export class BorrowValidationService {
  static validate(
    student: Student,
    book: Book,
    activeIssues: IssueRecord[],
    pendingFines: FineRecord[],
    fineSettings: FineSettings
  ): { isValid: boolean; reason?: string } {
    // 1. Account Status
    if (student.accountStatus !== 'Active') {
      return { isValid: false, reason: `Account is ${student.accountStatus}. You must have an Active account to borrow books.` };
    }

    // 2. Unpaid Fines
    const totalPendingFines = pendingFines
      .filter(f => f.studentId === student.id && (f.status === 'Pending' || f.status === 'Partially Paid'))
      .reduce((sum, f) => sum + (f.amount - f.amountPaid - f.waivedAmount), 0);
      
    if (totalPendingFines > 0) {
      return { isValid: false, reason: `You have pending fines of ${totalPendingFines}. Please clear your dues before borrowing.` };
    }

    // 3. Book Availability
    if (book.status !== 'Available' || (book.availableCopies ?? 0) <= 0) {
      return { isValid: false, reason: 'This book is currently unavailable.' };
    }

    // 4. Overdue Books
    const overdueBooks = activeIssues.filter(i => i.studentId === student.id && i.status === 'Overdue');
    if (overdueBooks.length > 0) {
      return { isValid: false, reason: 'You have overdue books. Please return them before borrowing new ones.' };
    }

    return { isValid: true };
  }
}
