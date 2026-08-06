const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/components/StudentHome.tsx', 'utf8');

code = code.replace(/\{student\.membershipNumber \|\| 'LIB-PENDING'\}/, '{student.membershipNumber}');

fs.writeFileSync('src/pages/Student/components/StudentHome.tsx', code);
