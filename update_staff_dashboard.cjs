const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Dashboard.tsx', 'utf8');

code = code.replace(
  /const pendingReturns = returnRequests\.filter\(r => r\.type === 'Return Before Time' && r\.status === 'Pending'\)\.length;/,
  `const pendingReturns = returnRequests.filter(r => r.type === 'Return Before Time' && r.status === 'Pending').length;
  const pendingRenewals = returnRequests.filter(r => r.type === 'Renewal' && r.status === 'Pending').length;
  const pendingReservations = returnRequests.filter(r => r.type === 'Book Reservation' && r.status === 'Pending').length;`
);

code = code.replace(
  /pendingReturns \+ pendingExchanges/g,
  "pendingReturns + pendingExchanges + pendingRenewals + pendingReservations"
);

code = code.replace(
  /Please review return and exchange requests\./,
  "Please review pending returns, exchanges, renewals, and reservations."
);

fs.writeFileSync('src/pages/Staff/Dashboard.tsx', code);
