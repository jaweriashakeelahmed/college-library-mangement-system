import React, { useState } from 'react';
import { Staff } from '@/src/types';
import { User, Mail, Shield, Save } from 'lucide-react';

interface StaffProfileProps {
  staff: Staff;
  onUpdateProfile: (updates: Partial<Staff>) => void;
}

export function StaffProfile({ staff, onUpdateProfile }: StaffProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: staff.name,
    email: staff.email,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold uppercase shadow-inner border border-blue-200">
              {staff.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{staff.name}</h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4" />
                Administrator
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:bg-slate-100 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:bg-slate-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: staff.name, email: staff.email });
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
