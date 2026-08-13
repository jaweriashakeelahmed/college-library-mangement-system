import fs from 'fs';
const file = 'src/pages/Student/components/StudentProfileTab.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `             <div className="relative w-28 h-28 mb-6 group shrink-0">
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

const newStr = `             <div className="relative w-28 h-28 mb-6 group shrink-0">
               <div className="w-full h-full rounded-full overflow-hidden bg-indigo-50 border-4 border-indigo-100 shadow-md flex items-center justify-center relative">
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
               
               {/* Professional Pencil Dropdown */}
               <div className="absolute bottom-0 right-0">
                 <button 
                   type="button"
                   onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110 flex items-center justify-center"
                 >
                   <Edit3 className="w-4 h-4" />
                 </button>
                 
                 {showPhotoMenu && (
                   <div className="absolute top-10 right-[-40px] bg-white border border-slate-200 shadow-xl rounded-xl w-36 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                     <button
                       type="button"
                       onClick={() => { setShowPhotoMenu(false); fileInputRef.current?.click(); }}
                       className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                     >
                       <Upload className="w-4 h-4" /> {student.photoUrl ? 'Change Photo' : 'Upload Photo'}
                     </button>
                     {student.photoUrl && (
                       <button
                         type="button"
                         onClick={() => { setShowPhotoMenu(false); onUpdateProfile({ photoUrl: '' }); }}
                         className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                       >
                         <Trash2 className="w-4 h-4" /> Remove Photo
                       </button>
                     )}
                   </div>
                 )}
               </div>
             </div>`;

code = code.replace(targetStr, newStr);

// We also need to add state for showPhotoMenu
const oldState = `  const idCardRef = useRef<HTMLDivElement>(null);`;
const newState = `  const idCardRef = useRef<HTMLDivElement>(null);\n  const [showPhotoMenu, setShowPhotoMenu] = useState(false);`;
code = code.replace(oldState, newState);

fs.writeFileSync(file, code);
