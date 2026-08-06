const fs = require('fs');
let code = fs.readFileSync('src/pages/Authentication/Auth.tsx', 'utf8');

// The props definition
code = code.replace(/interface AuthProps \{[\s\S]*?\}/, `interface AuthProps {
  students: Student[];
  staffs: Staff[];
}`);

code = code.replace(/export function Auth\(\{.*?\}\: AuthProps\) \{/, 'export function Auth({ students, staffs }: AuthProps) {');

// We have usages of onFailedLogin
code = code.replace(/onFailedLogin\(id, 'student'\);/g, "console.error('Login failed');");
code = code.replace(/onFailedLogin\(id, 'staff'\);/g, "console.error('Staff Login failed');");
code = code.replace(/onResetRequested\(.*?\);/g, "console.log('Reset requested');");

fs.writeFileSync('src/pages/Authentication/Auth.tsx', code);
