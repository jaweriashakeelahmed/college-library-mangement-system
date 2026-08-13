import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student } from '@/src/types';

interface LibraryCardProps {
  student: Student;
}

export const LibraryCard = forwardRef<HTMLDivElement, LibraryCardProps>(({ student }, ref) => {
  const issueDate = student.admissionDate || student.createdDate || new Date().toISOString().split('T')[0];
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
  if (displayDept === 'IT') displayDept = 'Information Technology';

  return (
    <div ref={ref} className="w-[3.375in] h-[2.125in] relative bg-white overflow-hidden text-slate-900 border border-slate-200 box-border print:border-none print:break-inside-avoid shadow-lg" style={{ width: '3.375in', height: '2.125in' }}>
      {/* Front */}
      <div className="absolute inset-0 flex flex-col page-break-after-always">
        {/* Header */}
        <div className="bg-blue-800 text-white h-12 flex items-center px-3 justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">University of</span>
            <span className="text-sm font-black uppercase leading-none">Mirpurkhas</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[8px] uppercase tracking-wider text-blue-200 leading-tight">Central</span>
            <span className="text-xs font-bold uppercase leading-none">Library</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 p-3 gap-3 bg-slate-50 relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center gap-1 z-10 w-20">
            <div className="w-16 h-20 bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-xs text-center p-1">No Photo</span>
              )}
            </div>
            <div className="mt-1">
              <QRCodeSVG value={qrData} size={48} level="M" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col z-10 text-[9px] leading-tight pt-1">
            <h2 className="text-sm font-extrabold text-blue-900 mb-0.5 uppercase tracking-wide truncate">{student.name}</h2>
            <div className="font-bold text-slate-700 mb-2 truncate">{student.id}</div>
            
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr>
                  <td className="text-slate-500 font-semibold w-12 pb-1">Dept:</td>
                  <td className="font-bold truncate pb-1" title={displayDept}>{displayDept}</td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-semibold pb-1">Program:</td>
                  <td className="font-bold truncate pb-1" title={displayProgram}>{displayProgram}</td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-semibold pb-0.5">Valid:</td>
                  <td className="font-bold text-xs text-slate-800 pb-0.5">{issueDate} &rarr; {expiryStr}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-blue-800 to-blue-600 w-full"></div>
      </div>
    </div>
  );
});

export const LibraryCardBack = forwardRef<HTMLDivElement, LibraryCardProps>(({ student }, ref) => {
  return (
    <div ref={ref} className="w-[3.375in] h-[2.125in] relative bg-white overflow-hidden text-slate-900 border border-slate-200 box-border print:border-none print:break-inside-avoid shadow-lg" style={{ width: '3.375in', height: '2.125in' }}>
      <div className="absolute inset-0 flex flex-col bg-slate-50 p-4">
        <h3 className="text-center font-bold text-[10px] text-slate-800 uppercase mb-2 border-b border-slate-300 pb-1">Library Rules & Regulations</h3>
        <ul className="list-disc pl-3 text-[8px] text-slate-700 space-y-1 mb-auto pr-2 text-justify">
          <li>This card is non-transferable and must be presented for all library transactions.</li>
          <li>Loss of this card must be reported immediately to the Central Library desk.</li>
          <li>A replacement fee will be charged for a lost or damaged card.</li>
          <li>Books must be returned by the due date to avoid late fines.</li>
        </ul>
        
        <div className="mt-3 flex justify-between items-end border-t border-slate-300 pt-2 px-1">
          <div className="text-center">
            <div className="w-20 border-b border-slate-800 mb-1 h-4"></div>
            <span className="text-[7px] text-slate-500 font-bold uppercase">Student Signature</span>
          </div>
          
          <div className="text-center">
            <div className="text-[6px] text-slate-400 mb-1">Emergency: +92-300-0000000</div>
            <div className="text-[8px] font-mono text-slate-500 bg-slate-200 px-1 py-0.5 rounded">CARD: {student.id.replace(/\W/g, '').substring(0,8).toUpperCase()}</div>
          </div>

          <div className="text-center">
            <div className="w-20 border-b border-slate-800 mb-1 h-4 relative flex items-center justify-center">
               <span className="text-blue-800/20 font-black italic text-[8px] absolute">APPROVED</span>
            </div>
            <span className="text-[7px] text-slate-500 font-bold uppercase">Librarian Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
});
