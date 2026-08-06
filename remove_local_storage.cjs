const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const regexesToRemove = [
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('lms_books_v2'[\s\S]*?\}, \[books\]\);/g,
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('students_accounts'[\s\S]*?\}, \[students\]\);/g,
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('staff_accounts'[\s\S]*?\}, \[staffs\]\);/g,
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('lms_tracking'[\s\S]*?\}, \[trackingRecords\]\);/g,
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('lms_return_requests'[\s\S]*?\}, \[returnRequests\]\);/g,
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('lms_borrow_requests'[\s\S]*?\}, \[borrowRequests\]\);/g,
  /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('lms_activity_logs'[\s\S]*?\}, \[activityLogs\]\);/g,
  /useEffect\(\(\) => \{\n\s*if \(currentUser\) \{\n\s*localStorage\.setItem\('lms_current_user'[\s\S]*?\}, \[currentUser, rememberMe\]\);/g
];

regexesToRemove.forEach(r => {
  code = code.replace(r, '');
});

fs.writeFileSync('src/app/App.tsx', code);
