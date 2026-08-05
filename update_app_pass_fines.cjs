const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

code = code.replace(
  /<StaffDashboard[\s\S]*?onApproveReturnRequest=\{handleApproveReturnRequest\}[\s\S]*?\/>/,
  `<StaffDashboard 
          currentUser={currentUser}
          staffData={staffs.find(s => s.id === currentUser.id)!}
          books={books}
          setBooks={setBooks}
          students={students}
          setStudents={setStudents}
          staffs={staffs}
          setStaffs={setStaffs}
          trackingRecords={trackingRecords}
          returnRequests={returnRequests}
          activityLogs={activityLogs}
          fines={fines}
          setFines={setFines}
          payments={payments}
          setPayments={setPayments}
          fineSettings={fineSettings}
          setFineSettings={setFineSettings}
          onLogout={handleLogout}
          onIssueBook={handleIssueBook}
          onReturnBook={handleReturnBook}
          onApproveReturnRequest={handleApproveReturnRequest}
          onUpdateRequestStatus={handleUpdateRequestStatus}
        />`
);

fs.writeFileSync('src/app/App.tsx', code);
