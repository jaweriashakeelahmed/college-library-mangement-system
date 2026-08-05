const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

// The best way to fix this is to use regex or string replace.
code = code.replace(
  `        <StudentDashboard 
          student={studentData} 
          books={books} 
          trackingRecords={trackingRecords} 
          returnRequests={returnRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          addActivityLog={handleAddActivityLog}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          fines={fines}
          payments={payments}
          onLogout={handleLogout} `,
  `        <StudentDashboard 
          student={studentData} 
          books={books} 
          trackingRecords={trackingRecords} 
          returnRequests={returnRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          fines={fines}
          payments={payments}
          onLogout={handleLogout} `
);

// We need to check if there are other duplicates. 
// Just in case, let's manually write a proper cleaner script.
