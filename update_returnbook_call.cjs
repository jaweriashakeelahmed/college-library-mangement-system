const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/StaffDashboard.tsx', 'utf8');

code = code.replace(
  /<ReturnBook trackingRecords=\{props\.trackingRecords\} onReturnBook=\{props\.onReturnBook\} \/>/,
  `<ReturnBook trackingRecords={props.trackingRecords} onReturnBook={props.onReturnBook} fineSettings={fineSettings} />`
);

fs.writeFileSync('src/pages/Staff/StaffDashboard.tsx', code);
