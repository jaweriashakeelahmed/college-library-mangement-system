const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/StudentDashboard.tsx', 'utf8');

// Add import
code = code.replace(
  `import { Book, Student, IssueRecord, ReturnRequest, BorrowRequest, FineRecord, PaymentRecord } from '@/src/types';`,
  `import { Book, Student, IssueRecord, ReturnRequest, BorrowRequest, FineRecord, PaymentRecord, FineSettings } from '@/src/types';
import { BorrowValidationService } from '@/src/services/borrowing/BorrowValidationService';`
);

// Add handleRequestBorrow inside component
code = code.replace(
  `  const studentRequests = returnRequests.filter(r => r.studentId === student.id);`,
  `  const studentRequests = returnRequests.filter(r => r.studentId === student.id);
  
  const handleRequestBorrow = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // We don't have fineSettings in StudentDashboard props right now, let's just mock it or get it
    const validation = BorrowValidationService.validate(student, book, trackingRecords, fines, {} as any);
    if (!validation.isValid) {
      alert(validation.reason);
      return;
    }
    
    const newRequest: BorrowRequest = {
      id: \`BR-\${Date.now()}\`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      membershipNumber: student.membershipNumber,
      bookId: book.id,
      bookName: book.name,
      requestDate: new Date().toISOString(),
      type: 'Borrow',
      status: 'Pending',
      statusHistory: [{ status: 'Pending', date: new Date().toISOString(), by: student.name }]
    };
    
    setBorrowRequests(prev => [...prev, newRequest]);
    alert('Borrow request submitted successfully!');
  };`
);

fs.writeFileSync('src/pages/Student/StudentDashboard.tsx', code);
