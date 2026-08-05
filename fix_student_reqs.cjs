const fs = require('fs');

let reqCode = fs.readFileSync('src/pages/Student/components/StudentRequests.tsx', 'utf8');

reqCode = reqCode.replace(
  `import { ReturnRequest, Book } from '@/src/types';`,
  `import { ReturnRequest, BorrowRequest, Book } from '@/src/types';`
);

reqCode = reqCode.replace(
  `  requests: ReturnRequest[];
  books: Book[];
  allRequests?: ReturnRequest[];`,
  `  requests: ReturnRequest[];
  borrowRequests?: BorrowRequest[];
  books: Book[];
  allRequests?: ReturnRequest[];`
);

reqCode = reqCode.replace(
  /export function StudentRequests\(\{([^}]+)\}: StudentRequestsProps\) \{/,
  `export function StudentRequests({ $1 }: StudentRequestsProps) {`
);

// We need to merge borrowRequests with returnRequests for display.
// The easiest way is to map borrowRequests to a format compatible with ReturnRequest, or update the rendering.
reqCode = reqCode.replace(
  `  const sortedRequests = [...requests].sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());`,
  `
  const mergedRequests = [
    ...requests,
    ...(borrowRequests || []).map(br => ({
      id: br.id,
      studentId: br.studentId,
      studentName: br.studentName,
      bookId: br.bookId,
      bookName: br.bookName,
      type: br.type,
      reason: br.studentNotes || 'Requested to borrow',
      status: br.status,
      requestDate: br.requestDate
    } as unknown as ReturnRequest))
  ];
  const sortedRequests = mergedRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  `
);

fs.writeFileSync('src/pages/Student/components/StudentRequests.tsx', reqCode);

// Fix StudentDashboard to pass borrowRequests
let dashCode = fs.readFileSync('src/pages/Student/StudentDashboard.tsx', 'utf8');
dashCode = dashCode.replace(
  `<StudentRequests requests={studentRequests} books={books} allRequests={returnRequests} />`,
  `<StudentRequests requests={studentRequests} borrowRequests={borrowRequests.filter(br => br.studentId === student.id)} books={books} allRequests={returnRequests} />`
);
fs.writeFileSync('src/pages/Student/StudentDashboard.tsx', dashCode);

