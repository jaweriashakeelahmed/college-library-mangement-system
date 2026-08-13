const fs = require('fs');

let content = fs.readFileSync('src/pages/Student/components/StudentBookDetails.tsx', 'utf8');

// Remove left image section entirely
const leftImgStart = '{/* Left: Image */}';
const leftImgEnd = '{/* Right: Details */}';

const beforeImg = content.substring(0, content.indexOf(leftImgStart));
const afterImg = content.substring(content.indexOf(leftImgEnd) + leftImgEnd.length);

content = beforeImg + afterImg;

// Update classes for layout
content = content.replace(/flex flex-col md:flex-row/, 'flex flex-col');
content = content.replace(/<div className="md:w-3\/5 p-8 md:p-10 flex flex-col overflow-y-auto bg-white">/, '<div className="w-full p-8 md:p-10 flex flex-col overflow-y-auto bg-white">');
content = content.replace(/<span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">\{book\.category\}<\/span>/, '');

// Always show "Request Book" button if onRequestBorrow is provided
content = content.replace(/\{!isAvailable && onRequestBorrow && \(/, '{onRequestBorrow && (');
content = content.replace(/Borrow Book/, 'Request Book');

fs.writeFileSync('src/pages/Student/components/StudentBookDetails.tsx', content);
