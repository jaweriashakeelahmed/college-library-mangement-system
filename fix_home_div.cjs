const fs = require('fs');

let content = fs.readFileSync('src/pages/Student/components/StudentHome.tsx', 'utf8');

content = content.replace('{/* Right Col: Sidebar */}', '</div>\n        {/* Right Col: Sidebar */}');

fs.writeFileSync('src/pages/Student/components/StudentHome.tsx', content);
