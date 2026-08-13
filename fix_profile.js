import fs from 'fs';

const file = 'src/pages/Student/components/StudentProfileTab.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `             <div className="relative w-28 h-28 rounded-full overflow-hidden bg-indigo-50 border-4 border-indigo-100 shadow-md mb-4 flex items-center justify-center shrink-0">
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

const newStr = `             {/* Profile Photo Avatar Display */}
             <div className="relative w-28 h-28 mb-6 group shrink-0">
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

code = code.replace(targetStr, newStr);

fs.writeFileSync(file, code);
