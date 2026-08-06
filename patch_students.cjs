const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Students.tsx', 'utf8');

if (!code.includes('import { doc, updateDoc, deleteDoc } from')) {
  code = `import { db } from '@/src/firebase';\nimport { doc, updateDoc, deleteDoc } from 'firebase/firestore';\n${code}`;
}

// Fix handleUpdateStudent
const updateStudentRegex = /const handleUpdateStudent = \(updates: Partial<Student>\) => \{[\s\S]*?\}\n\s*\};/;
const updateStudentReplacement = `const handleUpdateStudent = async (updates: Partial<Student>) => {
    if (!selectedStudent) return;
    try {
      await updateDoc(doc(db, 'students', selectedStudent.id), updates);
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...updates } : s));
    } catch (e) {
      console.error("Error updating student", e);
    }
  };`;
code = code.replace(updateStudentRegex, updateStudentReplacement);

// Fix handleDelete
const handleDeleteRegex = /const handleDelete = \(id: string\) => \{[\s\S]*?\}\n\s*\};/;
const handleDeleteReplacement = `const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
      setStudents(prev => prev.filter(s => s.id !== id));
      setDeleteConfirmId(null);
    } catch (e) {
      console.error("Error deleting student", e);
    }
  };`;
code = code.replace(handleDeleteRegex, handleDeleteReplacement);

// Fix filterStatus to include Pending
code = code.replace(/<option value="Active">Active<\/option>/, '<option value="Active">Active</option>\n<option value="Pending">Pending</option>');

// Add approval buttons for Pending
code = code.replace(/<div className="flex items-center justify-end gap-2">/, `<div className="flex items-center justify-end gap-2">
                          {(student.accountStatus === 'Pending') && (
                            <>
                              <button onClick={async () => {
                                await updateDoc(doc(db, 'students', student.id), { accountStatus: 'Active' });
                              }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button onClick={async () => {
                                await updateDoc(doc(db, 'students', student.id), { accountStatus: 'Rejected' });
                              }} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject">
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          )}`);

fs.writeFileSync('src/pages/Staff/Students.tsx', code);
