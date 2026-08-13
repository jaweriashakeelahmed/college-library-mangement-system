const fs = require('fs');
const file = 'src/pages/Student/components/StudentProfileTab.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add imports
code = code.replace(
  "import { LibraryCard } from '../../Staff/components/LibraryCard';",
  "import { LibraryCard } from '../../Staff/components/LibraryCard';\nimport jsPDF from 'jspdf';\nimport html2canvas from 'html2canvas';"
);

// 2. Add idCardRef
code = code.replace(
  "const fileInputRef = useRef<HTMLInputElement>(null);",
  "const fileInputRef = useRef<HTMLInputElement>(null);\n  const idCardRef = useRef<HTMLDivElement>(null);\n\n  const downloadIDCard = async () => {\n    if (!idCardRef.current) return;\n    try {\n      const canvas = await html2canvas(idCardRef.current, { scale: 2, backgroundColor: null });\n      const imgData = canvas.toDataURL('image/png');\n      const pdf = new jsPDF({\n        orientation: 'landscape',\n        unit: 'px',\n        format: [canvas.width, canvas.height]\n      });\n      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);\n      pdf.save(`${student.id}_library_card.pdf`);\n    } catch (err) {\n      console.error('Failed to download PDF', err);\n    }\n  };"
);

// 3. Update the avatar markup
const avatarOld = `             <div className="relative w-28 h-28 rounded-full overflow-hidden bg-indigo-50 border-4 border-indigo-100 shadow-md mb-4 flex items-center justify-center shrink-0">
               {student.photoUrl ? (
                 <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-3xl font-black text-indigo-600">{student.name.charAt(0)}</span>
               )}
             </div>
             {/* Photo Management Buttons */}
             <div className="flex flex-wrap gap-2 justify-center mb-6 w-full">
               <input
                 type="file"
                 ref={fileInputRef}
                 accept="image/*"
                 className="hidden"
                 onChange={handleFileUpload}
               />
               
               <button 
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
               >
                 <Upload className="w-4 h-4" />
                 Upload Photo
               </button>
               {student.photoUrl && (
                 <button 
                   type="button"
                   onClick={() => onUpdateProfile({ photoUrl: '' })}
                   className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-rose-200"
                   title="Remove Photo"
                 >
                   <Trash2 className="w-3.5 h-3.5" />
                   Remove
                 </button>
               )}
             </div>`;

const avatarNew = `             <div className="relative w-28 h-28 mb-6 group shrink-0">
               <div className="w-full h-full rounded-full overflow-hidden bg-indigo-50 border-4 border-indigo-100 shadow-md flex items-center justify-center">
                 {student.photoUrl ? (
                   <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-3xl font-black text-indigo-600">{student.name.charAt(0)}</span>
                 )}
               </div>
               
               {/* Hidden File Input */}
               <input
                 type="file"
                 ref={fileInputRef}
                 accept="image/*"
                 className="hidden"
                 onChange={handleFileUpload}
               />
               
               {/* Pencil / Trash Buttons */}
               <div className="absolute bottom-0 right-0 flex gap-1">
                 {student.photoUrl && (
                   <button 
                     type="button"
                     onClick={() => onUpdateProfile({ photoUrl: '' })}
                     className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
                     title="Remove Photo"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
                 <button 
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
                   title="Upload Photo"
                 >
                   <Edit3 className="w-4 h-4" />
                 </button>
               </div>
             </div>`;

code = code.replace(avatarOld, avatarNew);

// 4. Update library card to add ref and download button
const cardOld = `             <div className="w-full mb-6 flex justify-center scale-75 origin-top h-[180px]">
                <LibraryCard student={student} />
             </div>`;

const cardNew = `             <div className="w-full mb-2 flex flex-col items-center">
               <div className="scale-75 origin-top h-[180px]" ref={idCardRef}>
                  <LibraryCard student={student} />
               </div>
               <button
                 type="button"
                 onClick={downloadIDCard}
                 className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline transition-colors"
               >
                 Download ID Card (PDF)
               </button>
             </div>`;

code = code.replace(cardOld, cardNew);

fs.writeFileSync(file, code);
