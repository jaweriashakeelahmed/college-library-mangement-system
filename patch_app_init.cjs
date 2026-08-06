const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

code = code.replace(/INITIAL_STUDENTS/g, "[]");
code = code.replace(/import \{.*?INITIAL_BOOKS.*?\} from '@\/src\/data\/mockData';/, "import { INITIAL_STUDENTS } from '@/src/data/mockData';");

fs.writeFileSync('src/app/App.tsx', code);
