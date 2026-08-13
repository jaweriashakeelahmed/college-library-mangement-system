import fs from 'fs';
const file = 'src/pages/Staff/components/LibraryCard.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `  return (
    <div ref={ref} className="w-[3.375in] h-[2.125in] relative bg-white overflow-hidden text-slate-900 border border-slate-200 box-border print:border-none print:break-inside-avoid shadow-lg" style={{ width: '3.375in', height: '2.125in' }}>`;

const newStr = `  const rollNo = student.id || '';
  const parts = rollNo.split('/');
  let displayProgram = student.program || (parts.length > 1 ? parts[1] : 'N/A');
  let displayDept = student.department || 'N/A';

  if (displayProgram.toUpperCase() === 'BBA' || displayDept.toUpperCase() === 'BBA') {
    displayProgram = 'BBA';
    displayDept = 'Business Administration';
  } else if (displayDept.toLowerCase().includes('english') || displayProgram.toUpperCase() === 'ENG') {
    displayDept = 'English Department';
  } else if (displayDept.toLowerCase().includes('education') || displayProgram.toUpperCase() === 'B.ED') {
    displayDept = 'Education Department';
  } else if (displayProgram.toUpperCase() === 'CS') {
    displayDept = 'Computer Science';
  } else if (displayProgram.toUpperCase() === 'DS') {
    displayDept = 'Data Science';
  } else if (displayProgram.toUpperCase() === 'AI') {
    displayDept = 'Artificial Intelligence';
  } else if (displayProgram.toUpperCase() === 'SE') {
    displayDept = 'Software Engineering';
  } else if (displayProgram.toUpperCase() === 'IT') {
    displayDept = 'Information Technology';
  }
  
  if (displayDept === 'AI') displayDept = 'Artificial Intelligence';
  if (displayDept === 'IT') displayDept = 'Information Technology';

  return (
    <div ref={ref} className="w-[3.375in] h-[2.125in] relative bg-white overflow-hidden text-slate-900 border border-slate-200 box-border print:border-none print:break-inside-avoid shadow-lg" style={{ width: '3.375in', height: '2.125in' }}>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync(file, code);
