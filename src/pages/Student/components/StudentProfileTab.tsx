import React, { useState, useRef } from 'react';
import { User, Phone, Mail, MapPin, Edit3, Key, Shield, AlertTriangle, Upload, Trash2 } from 'lucide-react';
import { Student } from '@/src/types';
import { LibraryCard } from '../../Staff/components/LibraryCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StudentProfileTabProps {
  student: Student;
  onUpdateProfile: (updated: Partial<Student>) => void;
  onChangePassword: (current: string, next: string) => void;
}

export function StudentProfileTab({ student, onUpdateProfile, onChangePassword }: StudentProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const downloadIDCard = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${student.id}_library_card.pdf`);
    } catch (err) {
      console.error('Failed to download PDF', err);
    }
  };

  const [formData, setFormData] = useState({
    phone: student.phone || '',
    address: student.address || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateProfile({ photoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    onChangePassword(passwordForm.current, passwordForm.next);
    
    setPasswordSuccess(true);
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 mt-1">Manage your account settings, update profile picture, and view your digital library card.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-8">
        {/* Left Col: Photo, Digital Card & Info */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
             
             {/* Profile Photo Avatar Display */}
             <div className="relative w-28 h-28 rounded-full overflow-hidden bg-indigo-50 border-4 border-indigo-100 shadow-md mb-4 flex items-center justify-center shrink-0">
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
             </div>

             <div className="w-full mb-2 flex flex-col items-center">
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
             </div>
             
             <div className="w-full border-t border-slate-100 pt-4 space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Status</span>
                 <span className={`font-bold ${student.accountStatus === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {student.accountStatus}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Max Books</span>
                 <span className="font-bold text-slate-800">3</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Joined</span>
                 <span className="font-bold text-slate-800">{student.createdDate ? new Date(student.createdDate).toLocaleDateString() : 'N/A'}</span>
               </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-slate-400" /> Account Security</h3>
             <form onSubmit={handlePasswordSubmit} className="space-y-4">
               <div>
                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Current Password</label>
                 <div className="relative">
                   <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="password" 
                     required
                     value={passwordForm.current}
                     onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                     className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">New Password</label>
                 <input 
                   type="password" 
                   required
                   value={passwordForm.next}
                   onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                 />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Confirm New Password</label>
                 <input 
                   type="password" 
                   required
                   value={passwordForm.confirm}
                   onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                 />
               </div>
               {passwordError && (
                 <div className="text-xs text-rose-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {passwordError}</div>
               )}
               {passwordSuccess && (
                 <div className="text-xs text-emerald-600 font-medium">Password updated successfully!</div>
               )}
               <button type="submit" className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition-colors">Update Password</button>
             </form>
           </div>
        </div>

        {/* Right Col: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><User className="w-5 h-5 text-slate-400" /> Personal Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                  <Edit3 className="w-4 h-4" /> Edit Contact Info
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email (Read-only)</label>
                     <input type="text" value={student.email} disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</div>
                  <div className="font-medium text-slate-800">{student.email}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</div>
                  <div className="font-medium text-slate-800">{student.phone || 'Not provided'}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Address</div>
                  <div className="font-medium text-slate-800">{student.address || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student ID</div>
                  <div className="font-medium text-slate-800">{student.id}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">CNIC</div>
                  <div className="font-medium text-slate-800">{student.cnic}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</div>
                  <div className="font-medium text-slate-800">{student.department}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Semester</div>
                  <div className="font-medium text-slate-800">{student.semester}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
