const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');
code = code.replace(
  `          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}`,
  `          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}`
);
code = code.replace(
  `          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}`,
  `          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}`
);
fs.writeFileSync('src/app/App.tsx', code);
