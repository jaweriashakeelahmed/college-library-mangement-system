const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

code = code.replace(
  /<StudentDashboard \n          student=\{studentData\} \n          books=\{books\} \n          trackingRecords=\{trackingRecords\} \n          returnRequests=\{returnRequests\}\n          onLogout=\{handleLogout\}/,
  `<StudentDashboard 
          student={studentData} 
          books={books} 
          trackingRecords={trackingRecords} 
          returnRequests={returnRequests}
          fines={fines}
          payments={payments}
          onLogout={handleLogout}`
);

fs.writeFileSync('src/app/App.tsx', code);
