import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, Trash2, Edit, X, BookOpen, Download, Upload, 
  Filter, ArrowUpDown, MoreVertical, FileText, FileSpreadsheet, Eye, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Student, IssueRecord } from '@/src/types/index';
import { StudentProfileModal } from './components/StudentProfileModal';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  trackingRecords: IssueRecord[];
}

export function Students({ students, setStudents, trackingRecords }: StudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters & Sorting
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'department' | 'semester' | 'membershipNumber' | 'createdDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Modals
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Alerts / Toasts
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getBorrowSummary = (studentId: string) => {
    const studentRecords = trackingRecords.filter(r => r.studentId === studentId);
    const borrowed = studentRecords.filter(r => r.status === 'Issued');
    const returned = studentRecords.filter(r => r.status === 'Returned');
    const late = returned.filter(r => r.lateDays && r.lateDays > 0);
    const totalFine = studentRecords.reduce((sum, r) => sum + (r.fine || 0), 0);
    
    return {
      totalBorrowed: studentRecords.length,
      currentlyBorrowed: borrowed.length,
      totalReturned: returned.length,
      lateReturns: late.length,
      totalFine
    };
  };

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = fd.get('id') as string;
    const name = fd.get('name') as string;
    const department = fd.get('department') as string;
    const semester = parseInt(fd.get('semester') as string);
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;

    if (students.some(s => s.id.toLowerCase() === id.toLowerCase())) {
      showToast('Student ID already exists.', 'error');
      return;
    }
    if (students.some(s => s.email?.toLowerCase() === email.toLowerCase())) {
      showToast('Email already exists.', 'error');
      return;
    }

    const newStudent: Student = {
      id,
      name,
      department,
      semester,
      phone,
      email,
      accountStatus: 'Active',
      createdDate: new Date().toISOString()
    };

    setStudents(prev => [newStudent, ...prev]);
    setIsAdding(false);
    showToast('Student added successfully.');
  };

  const handleDelete = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmId(null);
    showToast('Student removed successfully.');
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast('Profile updated successfully.');
  };

  const handleApproveStudent = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          accountStatus: 'Active',
          membershipNumber: s.membershipNumber || `MEM-2026-${s.id.replace(/[^a-zA-Z0-9]/g, '')}`
        };
      }
      return s;
    }));
    showToast('Student account APPROVED successfully! Portal access granted.', 'success');
  };

  const handleRejectStudent = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          accountStatus: 'Rejected'
        };
      }
      return s;
    }));
    showToast('Student registration REJECTED. Portal access denied.', 'error');
  };

  // EXPORT FUNCTIONS
  const exportToCSV = () => {
    const data = students.map(s => ({
      'Student ID': s.id,
      'Name': s.name,
      'Department': s.department,
      'Semester': s.semester,
      'Phone': s.phone,
      'Email': s.email || '',
      'Status': s.accountStatus || 'Active',
      'Membership No': s.membershipNumber || ''
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Records", 14, 15);
    
    const tableData = students.map(s => [
      s.id,
      s.name,
      s.department,
      s.semester.toString(),
      s.accountStatus || 'Active',
      s.membershipNumber || '-'
    ]);

    autoTable(doc, {
      head: [['ID / Roll No', 'Name', 'Department', 'Semester', 'Status', 'Mem No']],
      body: tableData,
      startY: 20,
    });

    doc.save('students_export.pdf');
  };

  // IMPORT FUNCTION
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        let addedCount = 0;
        let skippedCount = 0;
        
        const newStudents: Student[] = [];
        
        results.data.forEach((row: any) => {
          const id = row['Student ID'] || row['id'];
          const name = row['Name'] || row['name'];
          
          if (!id || !name) return; // skip invalid rows
          
          // Check duplicates in existing + new array
          if (students.some(s => s.id === id) || newStudents.some(s => s.id === id)) {
            skippedCount++;
            return;
          }

          newStudents.push({
            id,
            name,
            department: row['Department'] || row['department'] || 'CS',
            semester: parseInt(row['Semester'] || row['semester']) || 1,
            phone: row['Phone'] || row['phone'] || '',
            email: row['Email'] || row['email'] || '',
            accountStatus: row['Status'] || row['status'] || 'Active',
            membershipNumber: row['Membership No'] || row['membershipNumber'] || undefined,
            createdDate: new Date().toISOString()
          });
          addedCount++;
        });

        if (newStudents.length > 0) {
          setStudents(prev => [...newStudents, ...prev]);
        }
        
        showToast(`Imported ${addedCount} students. Skipped ${skippedCount} duplicates.`, 'success');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  // FILTER & SORT
  const filteredStudents = useMemo(() => {
    let result = students;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.membershipNumber?.toLowerCase().includes(q)
      );
    }

    if (filterDept) {
      result = result.filter(s => s.department === filterDept);
    }

    if (filterStatus) {
      result = result.filter(s => (s.accountStatus || 'Active') === filterStatus);
    }

    result.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toString().toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toString().toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchQuery, filterDept, filterStatus, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const pendingCount = useMemo(() => students.filter(s => s.accountStatus === 'Pending' || s.accountStatus === 'Pending Approval').length, [students]);

  // PAGINATION
  const totalPages = Math.ceil(filteredStudents.length / limit);
  const paginatedStudents = filteredStudents.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      
      {/* TOAST */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2 ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* PENDING APPROVAL BANNER */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl font-bold text-sm">
              {pendingCount}
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Pending Student Registration Requests</h4>
              <p className="text-xs text-amber-700">There {pendingCount === 1 ? 'is' : 'are'} {pendingCount} student registration {pendingCount === 1 ? 'request' : 'requests'} waiting for admin approval.</p>
            </div>
          </div>
          <button 
            onClick={() => setFilterStatus('Pending')} 
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Filter Pending Requests
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Management</h2>
          <p className="text-slate-500 mt-1">Advanced records, library cards, and academic tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm" title="Import CSV">
            <Upload className="w-5 h-5" />
          </button>
          <div className="relative group">
             <button className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2" title="Export">
               <Download className="w-5 h-5" />
             </button>
             <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={exportToCSV} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2 rounded-t-xl"><FileSpreadsheet className="w-4 h-4"/> Export CSV</button>
                <button onClick={exportToPDF} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2 rounded-b-xl"><FileText className="w-4 h-4"/> Export PDF</button>
             </div>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* ADD STUDENT FORM */}
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
              <label className="text-sm font-semibold text-slate-700 block">Student ID (Roll No) *</label>
              <input name="id" type="text" placeholder="e.g. 2k26/CS/12" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Full Name *</label>
              <input name="name" type="text" placeholder="e.g. Ali Khan" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Email Address *</label>
              <input name="email" type="email" placeholder="e.g. student@uni.edu.pk" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Phone Number *</label>
              <input name="phone" type="tel" placeholder="e.g. 03001234567" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Department</label>
              <select name="department" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI">Artificial Intelligence (AI)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="Accounting & Finance">Accounting & Finance</option>
                <option value="Education">Education</option>
                <option value="BBA">BBA</option>
                <option value="English Literature">English Literature</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Semester</label>
              <select name="semester" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-sm active:scale-95">
              Save Record
            </button>
          </div>
        </form>
      )}

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center z-10">
        <div className="relative w-full md:max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Universal search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none">
            <option value="">All Depts</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="SE">SE</option>
            <option value="AI">AI</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending Approval</option>
            <option value="Rejected">Rejected</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-2">Student ID {sortBy === 'id' && <ArrowUpDown className="w-3 h-3" />}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-2">Name / Details {sortBy === 'name' && <ArrowUpDown className="w-3 h-3" />}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('department')}>
                  <div className="flex items-center gap-2">Academic {sortBy === 'department' && <ArrowUpDown className="w-3 h-3" />}</div>
                </th>
                <th className="px-6 py-4 font-semibold">Borrow Summary</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((student) => {
                const summary = getBorrowSummary(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{student.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 hidden sm:block">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                              {student.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email || student.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{student.department}</div>
                      <div className="text-xs text-slate-500">Semester {student.semester}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded" title="Total Borrowed">
                           <BookOpen className="w-3 h-3"/> {summary.totalBorrowed}
                        </span>
                        {summary.lateReturns > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium bg-rose-50 text-rose-700 px-2 py-1 rounded" title="Late Returns">
                             <AlertCircle className="w-3 h-3"/> {summary.lateReturns}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        (student.accountStatus || 'Active') === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        student.accountStatus === 'Pending' || student.accountStatus === 'Pending Approval' ? 'bg-amber-100 text-amber-800 border border-amber-300 font-extrabold animate-pulse' :
                        student.accountStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        student.accountStatus === 'Suspended' ? 'bg-rose-100 text-rose-700' :
                        student.accountStatus === 'Graduated' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {student.accountStatus || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {deleteConfirmId === student.id ? (
                        <div className="flex items-center justify-end gap-2 animate-in fade-in zoom-in duration-200">
                          <span className="text-xs font-bold text-rose-600 mr-2">Confirm?</span>
                          <button onClick={() => handleDelete(student.id)} className="p-1.5 bg-rose-600 text-white rounded hover:bg-rose-700"><CheckCircle2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {(student.accountStatus === 'Pending' || student.accountStatus === 'Pending Approval') && (
                            <>
                              <button 
                                onClick={() => handleApproveStudent(student.id)} 
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                                title="Approve Student Registration"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button 
                                onClick={() => handleRejectStudent(student.id)} 
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                                title="Reject Student Registration"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                          <button onClick={() => setSelectedStudent(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View/Edit Profile">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(student.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Student">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <BookOpen className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="font-medium text-lg text-slate-700">No students found</p>
                      <p className="text-sm">Adjust your filters or add a new student.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show</span>
            <select value={limit} onChange={e => {setLimit(Number(e.target.value)); setPage(1);}} className="bg-white border border-slate-200 rounded px-2 py-1 outline-none">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, filteredStudents.length)} of {filteredStudents.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {selectedStudent && (
        <StudentProfileModal 
          student={selectedStudent} 
          isOpen={true} 
          onClose={() => setSelectedStudent(null)} 
          onSave={handleUpdateStudent}
          isStaff={true}
          trackingRecords={trackingRecords}
        />
      )}
    </div>
  );
}
