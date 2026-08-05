const fs = require('fs');

let reqCode = fs.readFileSync('src/pages/Staff/Requests.tsx', 'utf8');

reqCode = reqCode.replace(
  `  const filteredRequests = returnRequests.filter(r => {`,
  `
  // Merge borrow requests into the same view for simplicity if activeTab is not used, or just merge them
  const allReqs = [
    ...returnRequests,
    ...borrowRequests.map(br => ({
      id: br.id,
      studentId: br.studentId,
      studentName: br.studentName,
      bookId: br.bookId,
      bookName: br.bookName,
      type: br.type as any,
      reason: br.studentNotes || 'Borrow Request',
      status: br.status as any,
      requestDate: br.requestDate
    }))
  ];

  const filteredRequests = allReqs.filter(r => {`
);

// We should also handle the approval function to dispatch the correct callback
reqCode = reqCode.replace(
  `                      {r.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => onApprove(r.id, true)}
                            className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setShowConfirmModal({ type: 'Reject', request: r })}
                            className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}`,
  `                      {r.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => {
                              if (r.type === 'Borrow') {
                                onUpdateBorrowRequest?.(r.id, 'Approved', '');
                              } else {
                                onApprove(r.id, true);
                              }
                            }}
                            className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (r.type === 'Borrow') {
                                onUpdateBorrowRequest?.(r.id, 'Rejected', 'Rejected by staff');
                              } else {
                                setShowConfirmModal({ type: 'Reject', request: r });
                              }
                            }}
                            className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}`
);

fs.writeFileSync('src/pages/Staff/Requests.tsx', reqCode);
