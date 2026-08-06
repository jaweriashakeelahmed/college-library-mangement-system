const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

// handleReturnRequest
const reqRegex = /const handleReturnRequest = \(request: Omit<ReturnRequest, 'id' \| 'status' \| 'requestDate'>\) => \{[\s\S]*?\}\);?\n\s*\};/;
const reqReplacement = `const handleReturnRequest = async (request: Omit<ReturnRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest = {
      ...request,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    await addDoc(collection(db, 'returnRequests'), newRequest);
  };`;
code = code.replace(reqRegex, reqReplacement);

// handleApproveReturnRequest
const approveReqRegex = /const handleApproveReturnRequest = \(requestId: string, approved: boolean\) => \{[\s\S]*?\}\n\s*\};/;
const approveReqReplacement = `const handleApproveReturnRequest = async (requestId: string, approved: boolean) => {
    await updateDoc(doc(db, 'returnRequests', requestId), { status: approved ? 'Approved' : 'Rejected' });
    if (approved) {
      const request = returnRequests.find(r => r.id === requestId);
      if (request && request.type === 'Return Before Time') {
        await updateDoc(doc(db, 'books', request.bookId), { status: 'Available' });
        const record = trackingRecords.find(r => r.bookId === request.bookId && r.status === 'Issued');
        if (record) {
          await updateDoc(doc(db, 'trackingRecords', record.id), { status: 'Returned', returnDate: new Date().toISOString().split('T')[0] });
        }
      }
    }
  };`;
code = code.replace(approveReqRegex, approveReqReplacement);

// handleUpdateRequestStatus
const updReqStatusRegex = /const handleUpdateRequestStatus = \(requestId: string, status: ReturnRequest\['status'\]\) => \{[\s\S]*?\}\);?\n\s*\};/;
const updReqStatusReplacement = `const handleUpdateRequestStatus = async (requestId: string, status: ReturnRequest['status']) => {
    await updateDoc(doc(db, 'returnRequests', requestId), { status });
  };`;
code = code.replace(updReqStatusRegex, updReqStatusReplacement);

fs.writeFileSync('src/app/App.tsx', code);
