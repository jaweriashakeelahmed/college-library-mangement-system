import React, { useState, useRef } from 'react';
import { Search, Plus, Trash2, Edit, X, BookOpen, Printer, IdCard } from 'lucide-react';
import { Student, IssueRecord } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';

interface StudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  trackingRecords: IssueRecord[];
}

export function Students({ students, setStudents, trackingRecords }: StudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentDepartment, setNewStudentDepartment] = useState('CS');
  const [newStudentSemester, setNewStudentSemester] = useState(1);
  const [newStudentPhone, setNewStudentPhone] = useState('');

  const [selectedStudentForID, setSelectedStudentForID] = useState<Student | null>(null);
  const idCardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: idCardRef,
    documentTitle: `Student_ID_${selectedStudentForID?.id}`,
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIssuedBooksCount = (studentId: string) => {
    return trackingRecords.filter(r => r.studentId === studentId && r.status === 'Issued').length;
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId || !newStudentName || !newStudentPhone) return;

    const newStudent: Student = {
      id: newStudentId,
      name: newStudentName,
      department: newStudentDepartment,
      semester: newStudentSemester,
      phone: newStudentPhone
    };

    setStudents(prev => [newStudent, ...prev]);
    setIsAdding(false);
    setNewStudentId('');
    setNewStudentName('');
    setNewStudentDepartment('CS');
    setNewStudentSemester(1);
    setNewStudentPhone('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Records</h2>
          <p className="text-slate-500 mt-1">Manage enrolled students and their library access.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
            <Plus className="w-5 h-5" />
            Add New Student
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddStudent} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 fade-in duration-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-800">Register New Student</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Student ID (Roll No)</label>
              <input 
                type="text" 
                value={newStudentId}
                onChange={e => setNewStudentId(e.target.value)}
                placeholder="e.g. 2k26/CS/12" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
              <input 
                type="text" 
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                placeholder="e.g. Ali Khan" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Phone Number</label>
              <input 
                type="tel" 
                value={newStudentPhone}
                onChange={e => setNewStudentPhone(e.target.value)}
                placeholder="e.g. 03001234567" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Department</label>
              <select
                value={newStudentDepartment}
                onChange={e => setNewStudentDepartment(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              >
                <option value="CS">Computer Science (CS)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="Software Eng">Software Engineering (SE)</option>
                <option value="AI">Artificial Intelligence (AI)</option>
                <option value="DS">Data Science (DS)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Semester</label>
              <select
                value={newStudentSemester}
                onChange={e => setNewStudentSemester(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-sm active:scale-95">
              Register Student
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-white">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Student ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Issued Books</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{student.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{student.name}</td>
                  <td className="px-6 py-4 text-slate-500">{student.department}</td>
                  <td className="px-6 py-4 text-slate-500">{student.semester}</td>
                  <td className="px-6 py-4 text-slate-500">{student.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      getIssuedBooksCount(student.id) >= 3 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        : getIssuedBooksCount(student.id) > 0
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/60'
                    }`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      {getIssuedBooksCount(student.id)} / 3
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedStudentForID(student)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex items-center"
                      title="Generate ID Card"
                    >
                      <IdCard className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudentForID && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-slate-800">Student ID Card</h3>
              <button 
                onClick={() => setSelectedStudentForID(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl flex justify-center border border-slate-100">
              {/* Actual ID Card to Print */}
              <div 
                ref={idCardRef}
                className="bg-white border-2 border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col w-[300px] h-[450px]"
                style={{ WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}
              >
                {/* Header */}
                <div className="bg-blue-600 text-white text-center py-4 px-2">
                  <h2 className="text-lg font-bold tracking-tight uppercase">College Library</h2>
                  <p className="text-[10px] font-medium opacity-90 tracking-wider">STUDENT IDENTITY CARD</p>
                </div>
                
                {/* Body */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-5">
                  <div className="w-24 h-24 bg-slate-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  
                  <div className="text-center w-full space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 truncate px-2">{selectedStudentForID.name}</h3>
                    <p className="text-sm font-semibold text-blue-600">{selectedStudentForID.id}</p>
                  </div>

                  <div className="w-full text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4 px-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span className="font-bold text-slate-800 text-right">{selectedStudentForID.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Year of Study:</span>
                      <span className="font-bold text-slate-800 text-right">Year {Math.ceil(Number(selectedStudentForID.semester) / 2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with QR */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                  <QRCodeSVG 
                    value={selectedStudentForID.id} 
                    size={48}
                    level="H"
                    includeMargin={false}
                  />
                  <div className="text-right">
                    <p className="text-[8px] text-slate-400 font-medium uppercase tracking-wider mb-1">Authorized Sig.</p>
                    <div className="w-16 h-px bg-slate-300 ml-auto mt-4"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedStudentForID(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handlePrint()}
                className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print ID Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
