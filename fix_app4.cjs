const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

// For StaffDashboard
code = code.replace(
  /returnRequests=\{returnRequests\}\s+borrowRequests=\{borrowRequests\}\s+setBorrowRequests=\{setBorrowRequests\}\s+addActivityLog=\{handleAddActivityLog\}\s+activityLogs=\{activityLogs\}/g,
  `returnRequests={returnRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          addActivityLog={handleAddActivityLog}
          activityLogs={activityLogs}`
);

// For StudentDashboard (clean up duplicates and invalid props)
let studentMatch = code.match(/<StudentDashboard[\s\S]*?onLogout=\{handleLogout\}/);
if (studentMatch) {
  let inner = studentMatch[0];
  inner = inner.replace(/borrowRequests=\{borrowRequests\}\s*/g, '');
  inner = inner.replace(/setBorrowRequests=\{setBorrowRequests\}\s*/g, '');
  inner = inner.replace(/addActivityLog=\{handleAddActivityLog\}\s*/g, '');
  inner = inner.replace(
    /returnRequests=\{returnRequests\}/,
    `returnRequests={returnRequests}\n          borrowRequests={borrowRequests}\n          setBorrowRequests={setBorrowRequests}`
  );
  code = code.replace(studentMatch[0], inner);
}

fs.writeFileSync('src/app/App.tsx', code);
