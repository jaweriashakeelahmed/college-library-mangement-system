const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const updatedLogic = `
  const handleApproveReturnRequest = (requestId: string, approved: boolean) => {
    setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: approved ? 'Approved' : 'Rejected' } : r));
    
    if (approved) {
      const request = returnRequests.find(r => r.id === requestId);
      if (request && request.type === 'Renewal') {
         setTrackingRecords(prev => prev.map(r => {
             if (r.bookId === request.bookId && r.studentId === request.studentId && r.status === 'Issued') {
                 const newDue = new Date(r.expectedReturnDate);
                 newDue.setDate(newDue.getDate() + 15);
                 return { ...r, expectedReturnDate: newDue.toISOString().split('T')[0], renewals: (r.renewals || 0) + 1 };
             }
             return r;
         }));
      }
    }
  };
`;

code = code.replace(
  /const handleApproveReturnRequest = \(requestId: string, approved: boolean\) => \{[\s\S]*?\}\;\n  \}\;/,
  updatedLogic.trim()
);

fs.writeFileSync('src/app/App.tsx', code);
