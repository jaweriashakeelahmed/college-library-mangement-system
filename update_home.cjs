const fs = require('fs');

let content = fs.readFileSync('src/pages/Student/components/StudentHome.tsx', 'utf8');

// 1. Change dark colors
content = content.replace(/className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden"/g, 
  'className="bg-blue-50 rounded-3xl p-8 text-blue-900 shadow-sm relative overflow-hidden border border-blue-100"');

// 2. Remove LIB- PENDING block entirely
content = content.replace(/<div className="text-blue-200 text-sm mt-1 flex items-center gap-2">[\s\S]*?<\/div>/, '');

// 3. Remove "Currently Reading" and "Recommended for You" blocks
const currentlyReadingStart = '{/* Current Books */}';
const currentlyReadingEnd = '{/* Recommendations */}';
const rightColStart = '{/* Right Col: Sidebar */}';

const part1 = content.substring(0, content.indexOf(currentlyReadingStart));
const part2 = content.substring(content.indexOf(rightColStart));

content = part1 + part2;

// Additional light color tweaks on top hero:
content = content.replace(/text-blue-100/g, 'text-blue-700');
content = content.replace(/bg-blue-500\/30/g, 'bg-blue-200/50');
content = content.replace(/bg-blue-500\/20/g, 'bg-blue-100/50');
content = content.replace(/text-blue-200/g, 'text-blue-800');
content = content.replace(/<div className="absolute top-0 right-0 p-8 opacity-10">/g, '<div className="absolute top-0 right-0 p-8 opacity-5 text-blue-900">');

fs.writeFileSync('src/pages/Student/components/StudentHome.tsx', content);
