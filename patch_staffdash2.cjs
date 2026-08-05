const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/StaffDashboard.tsx', 'utf8');

code = code.replace(
  `case 'Requests': return <Requests returnRequests={props.returnRequests} onApprove={props.onApproveReturnRequest} onUpdateStatus={props.onUpdateRequestStatus} students={props.students} trackingRecords={props.trackingRecords} />;`,
  `case 'Requests': return <Requests returnRequests={props.returnRequests} borrowRequests={props.borrowRequests} onUpdateBorrowRequest={(id, status, remarks) => {
    props.setBorrowRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status,
          staffRemarks: remarks,
          statusHistory: [...(req.statusHistory || []), { status, date: new Date().toISOString(), by: props.staffData.name, remarks }]
        };
      }
      return req;
    }));
    if (status === 'Approved') {
      const br = props.borrowRequests.find(r => r.id === id);
      if (br) {
        // Trigger issue book logic if it's approved
        if (props.onIssueBook) {
          props.onIssueBook(br.studentId, br.bookId);
        }
      }
    }
  }} onApprove={props.onApproveReturnRequest} onUpdateStatus={props.onUpdateRequestStatus} students={props.students} trackingRecords={props.trackingRecords} />;`
);

fs.writeFileSync('src/pages/Staff/StaffDashboard.tsx', code);
