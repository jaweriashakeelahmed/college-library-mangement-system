const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const authRenderRegex = /<Auth[\s\S]*?\/>/;
const authRenderReplacement = `<Auth 
         students={students} 
         staffs={staffs} 
      />`;

code = code.replace(authRenderRegex, authRenderReplacement);
fs.writeFileSync('src/app/App.tsx', code);
