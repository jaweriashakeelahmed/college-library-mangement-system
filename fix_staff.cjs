const fs = require('fs');

// Fix StaffDashboard
let staffCode = fs.readFileSync('src/pages/Staff/StaffDashboard.tsx', 'utf8');
staffCode = staffCode.replace(
  `fineSettings={fineSettings} setFineSettings={setFineSettings} students={students} staffData={staffData} />`,
  `fineSettings={props.fineSettings} setFineSettings={props.setFineSettings} students={props.students} staffData={props.staffData} />`
);
staffCode = staffCode.replace(
  `fines={fines} setFines={setFines} payments={payments} setPayments={setPayments}`,
  `fines={props.fines} setFines={props.setFines} payments={props.payments} setPayments={props.setPayments}`
);
staffCode = staffCode.replace(
  `{fineSettings.gracePeriodDays}`,
  `{props.fineSettings.gracePeriodDays}`
);
fs.writeFileSync('src/pages/Staff/StaffDashboard.tsx', staffCode);

// Fix StudentDashboard
let studentCode = fs.readFileSync('src/pages/Student/StudentDashboard.tsx', 'utf8');
studentCode = studentCode.replace(
  `trackingRecords, fines, {} as any`,
  `trackingRecords, props.fines, {} as any`
);
// Make sure fines is available
studentCode = studentCode.replace(
  /trackingRecords, fines,/,
  `trackingRecords, fines,`
);

// If the props were destructured, then the name should be correct. Let's see how it was destructured.
// It seems `fines` wasn't destructured in StudentDashboard!
let match = studentCode.match(/export function StudentDashboard\(\{([^}]+)\}: StudentDashboardProps\)/);
if (match) {
  let inner = match[1];
  if (!inner.includes('fines')) {
    inner = inner + ', fines';
  }
  studentCode = studentCode.replace(match[1], inner);
}

fs.writeFileSync('src/pages/Student/StudentDashboard.tsx', studentCode);

// Fix App.tsx
let appCode = fs.readFileSync('src/app/App.tsx', 'utf8');
appCode = appCode.replace(
  /addActivityLog=\{addActivityLog\}\s+fines=\{fines\}/g,
  `fines={fines}`
);
// ensure no duplicate or remaining `addActivityLog={addActivityLog}` under `<StudentDashboard`
let studentMatch = appCode.match(/<StudentDashboard[\s\S]*?onLogout=\{handleLogout\}/);
if (studentMatch) {
  let inner = studentMatch[0];
  inner = inner.replace(/addActivityLog=\{addActivityLog\}\s*/g, '');
  appCode = appCode.replace(studentMatch[0], inner);
}

fs.writeFileSync('src/app/App.tsx', appCode);

