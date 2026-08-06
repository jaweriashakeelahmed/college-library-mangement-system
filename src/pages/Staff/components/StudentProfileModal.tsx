import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { X, Save, Edit3, Image as ImageIcon, Printer, Download, CreditCard, Camera, Loader2, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { Student, IssueRecord } from '@/src/types';
import { LibraryCard, LibraryCardBack } from './LibraryCard';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StudentProfileModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
  isStaff: boolean;
  trackingRecords?: IssueRecord[];
}

export function StudentProfileModal({ student, isOpen, onClose, onSave, isStaff, trackingRecords = [] }: StudentProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Student>({ ...student });
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const studentHistory = trackingRecords.filter(r => r.studentId === student.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateMembershipNumber = () => {
    if (!isStaff) return;
    const year = new Date().getFullYear();
    const dept = formData.department || 'GEN';
    const rand = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    setFormData({ ...formData, membershipNumber: `LIB-${year}-${dept}-${rand}` });
  };

  const handleSave = () => {
    onSave({ ...formData, updatedDate: new Date().toISOString() });
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStaff) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Maximum size is 2MB.");
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_photos/${student.id}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, photoUrl: url });
    } catch(err) {
      alert("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePrintCard = useReactToPrint({
    contentRef: cardFrontRef,
    documentTitle: `Library_Card_${student.id}`,
  });

  const handleDownloadPDF = async () => {
    if (!cardFrontRef.current || !cardBackRef.current) return;
    
    try {
      const canvasFront = await html2canvas(cardFrontRef.current, { scale: 3, useCORS: true });
      const canvasBack = await html2canvas(cardBackRef.current, { scale: 3, useCORS: true });
      
      const imgFront = canvasFront.toDataURL('image/jpeg', 1.0);
      const imgBack = canvasBack.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.375, 2.125]
      });
      
      pdf.addImage(imgFront, 'JPEG', 0, 0, 3.375, 2.125);
      pdf.addPage();
      pdf.addImage(imgBack, 'JPEG', 0, 0, 3.375, 2.125);
      
      pdf.save(`Library_Card_${student.id.replace(/\W/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Student Profile</h2>
            <p className="text-sm text-slate-500">{formData.name} ({formData.id})</p>
          </div>
          <div className="flex items-center gap-2">
            {isStaff && activeTab === 'profile' && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            )}
            {isStaff && activeTab === 'profile' && isEditing && (
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Save
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-200 bg-white">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Profile Information
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'history' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Library History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {activeTab === 'profile' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Col: Photo & Actions */}
              <div className="w-full md:w-64 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <div className="relative w-32 h-40 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden mb-4 group flex items-center justify-center">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-10 h-10 text-slate-300" />
                    )}
                    
                    {isEditing && (
                      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        {isUploadingPhoto ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6 mb-1" />}
                        <span className="text-xs font-medium">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-full text-center ${
                    formData.accountStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    formData.accountStatus === 'Suspended' ? 'bg-rose-100 text-rose-700' :
                    formData.accountStatus === 'Inactive' ? 'bg-slate-100 text-slate-700' :
                    formData.accountStatus === 'Graduated' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {formData.accountStatus || 'Active'}
                  </div>
                </div>

                {isStaff && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Library Card</h3>
                    <button 
                      onClick={() => setShowCardPreview(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                    >
                      <CreditCard className="w-4 h-4" /> Preview Card
                    </button>
                    <button 
                      onClick={handleDownloadPDF}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button 
                      onClick={() => handlePrintCard()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium text-sm transition-colors"
                    >
                      <Printer className="w-4 h-4" /> Print Direct
                    </button>
                  </div>
                )}
              </div>

              {/* Right Col: Details */}
              <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  
                  {/* Basic Info */}
                  <div className="col-span-2 pb-2 border-b border-slate-100 mb-2"><h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Basic Information</h3></div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    {isEditing ? (
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.name}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Father Name</label>
                    {isEditing ? (
                      <input name="fatherName" value={formData.fatherName || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.fatherName || '-'}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">CNIC</label>
                    {isEditing ? (
                      <input name="cnic" value={formData.cnic || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.cnic || '-'}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                    {isEditing ? (
                      <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500">
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.gender || '-'}</div>}
                  </div>
                  
                  {/* Academic Info */}
                  <div className="col-span-2 pb-2 border-b border-slate-100 mt-4 mb-2"><h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Academic Details</h3></div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Student ID (Roll No)</label>
                    <div className="mt-1 text-sm font-bold text-slate-900">{formData.id}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                    {isEditing ? (
                      <input name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.department}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Program</label>
                    {isEditing ? (
                      <input name="program" value={formData.program || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.program || '-'}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                    {isEditing ? (
                      <input name="semester" type="number" value={formData.semester} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.semester}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Session</label>
                    {isEditing ? (
                      <input name="session" value={formData.session || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.session || '-'}</div>}
                  </div>

                  {/* Library & Contact */}
                  <div className="col-span-2 pb-2 border-b border-slate-100 mt-4 mb-2"><h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Library & Contact</h3></div>

                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Library Membership Number</label>
                    {isEditing ? (
                      <div className="flex gap-2 mt-1">
                        <input name="membershipNumber" value={formData.membershipNumber || ''} readOnly className="flex-1 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-sm text-slate-500 cursor-not-allowed font-mono" />
                        <button type="button" onClick={generateMembershipNumber} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-sm font-medium transition-colors shrink-0">
                          Generate Unique No.
                        </button>
                      </div>
                    ) : <div className="mt-1 text-sm font-bold text-blue-700 font-mono">{formData.membershipNumber || 'Not Generated'}</div>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    {isEditing ? (
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.phone}</div>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    {isEditing ? (
                      <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.email || '-'}</div>}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                    {isEditing ? (
                      <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    ) : <div className="mt-1 text-sm font-medium text-slate-900">{formData.address || '-'}</div>}
                  </div>
                  
                  {isEditing && (
                    <div className="col-span-2 mt-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Account Status</label>
                       <select name="accountStatus" value={formData.accountStatus || 'Active'} onChange={handleChange} className="w-full px-3 py-1.5 mt-1 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500">
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Expired Membership">Expired Membership</option>
                       </select>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Borrow & Fine History</h3>
                <div className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded border border-slate-200">
                  Total Fine: Rs. {studentHistory.reduce((sum, r) => sum + (r.fine || 0), 0)}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Book</th>
                      <th className="px-4 py-3 font-semibold">Issue Date</th>
                      <th className="px-4 py-3 font-semibold">Return Date</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Fine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentHistory.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{record.bookName}</div>
                          <div className="text-[10px] text-slate-500">{record.bookId}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{record.issueDate}</td>
                        <td className="px-4 py-3 text-slate-600">{record.returnDate || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            record.status === 'Issued' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-rose-600">
                          {record.fine ? `Rs. ${record.fine}` : '-'}
                        </td>
                      </tr>
                    ))}
                    {studentHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          No library history found for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Cards for PDF/Print */}
      <div className="hidden">
        <LibraryCard ref={cardFrontRef} student={formData} />
        <LibraryCardBack ref={cardBackRef} student={formData} />
      </div>

      {/* Preview Modal for Library Card */}
      {showCardPreview && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="flex gap-6 items-center flex-col md:flex-row">
            <div className="bg-white p-2 rounded shadow-2xl">
              <LibraryCard student={formData} />
            </div>
            <div className="bg-white p-2 rounded shadow-2xl">
              <LibraryCardBack student={formData} />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button onClick={() => setShowCardPreview(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors shadow-lg">
              Close Preview
            </button>
            <button onClick={() => handlePrintCard()} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
