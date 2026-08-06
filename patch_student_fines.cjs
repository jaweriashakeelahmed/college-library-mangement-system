const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/StudentDashboard.tsx', 'utf8');

code = code.replace(/\{ name: 'Fines', icon: Banknote \},\n\s*/, '');
code = code.replace(/case 'Fines':\n\s*return <StudentFinesTab[^\n]*\/>;/, '');
code = code.replace(/import \{ StudentFinesTab \} from '\.\/components\/StudentFinesTab';/, '');

fs.writeFileSync('src/pages/Student/StudentDashboard.tsx', code);
