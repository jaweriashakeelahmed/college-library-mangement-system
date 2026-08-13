import fs from 'fs';

const file = 'src/pages/Staff/components/LibraryCard.tsx';
let code = fs.readFileSync(file, 'utf8');

const logicStr = `  const issueDate = student.admissionDate || student.createdDate || new Date().toISOString().split('T')[0];
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 4);
  const expiryStr = expiryDate.toISOString().split('T')[0];
  const qrData = JSON.stringify({
    uid: student.id,
    mem: student.membershipNumber,
    name: student.name
  });`;

const newLogicStr = `  const issueDate = student.admissionDate || student.createdDate || new Date().toISOString().split('T')[0];
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 4);
  const expiryStr = expiryDate.toISOString().split('T')[0];
  const qrData = JSON.stringify({
    uid: student.id,
    mem: student.membershipNumber,
    name: student.name
  });

  const rollNo = student.id || '';
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
  if (displayDept === 'IT') displayDept = 'Information Technology';`;

code = code.replace(logicStr, newLogicStr);

const renderStr = `                <tr>
                  <td className="text-slate-500 font-semibold w-12 pb-1">Dept:</td>
                  <td className="font-bold truncate pb-1">{student.department}</td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-semibold pb-1">Program:</td>
                  <td className="font-bold truncate pb-1">{student.program || 'N/A'}</td>
                </tr>`;

const newRenderStr = `                <tr>
                  <td className="text-slate-500 font-semibold w-12 pb-1">Dept:</td>
                  <td className="font-bold truncate pb-1" title={displayDept}>{displayDept}</td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-semibold pb-1">Program:</td>
                  <td className="font-bold truncate pb-1" title={displayProgram}>{displayProgram}</td>
                </tr>`;

code = code.replace(renderStr, newRenderStr);

fs.writeFileSync(file, code);
