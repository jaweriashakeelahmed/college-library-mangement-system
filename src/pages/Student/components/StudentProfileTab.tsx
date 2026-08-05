import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Edit3, Key, Shield, AlertTriangle } from 'lucide-react';
import { Student } from '@/src/types';
import { LibraryCard } from '../../Staff/components/LibraryCard';

interface StudentProfileTabProps {
  student: Student;
  onUpdateProfile: (updated: Partial<Student>) => void;
  onChangePassword: (current: string, next: string) => void;
}

export function StudentProfileTab({ student, onUpdateProfile, onChangePassword }: StudentProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    onChangePassword(passwordForm.current, passwordForm.next);
    
    // In a real app we'd wait for success, simulating here
    setPasswordSuccess(true);
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and view your digital library card.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-8">
        {/* Left Col: Digital Card & Info */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
             <div className="w-full mb-6 flex justify-center scale-75 origin-top h-[180px]">
                <LibraryCard student={student} />
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
                 <span className="font-bold text-slate-800">{student.accountStatus}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Joined</span>
                 <span className="font-bold text-slate-800">{student.createdDate}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Valid Until</span>
                 <span className="font-bold text-slate-800">{student.updatedDate}</span>
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
                     className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
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
                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                 />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Confirm New Password</label>
                 <input 
                   type="password" 
                   required
                   value={passwordForm.confirm}
                   onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
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
                <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm">Save Changes</button>
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
