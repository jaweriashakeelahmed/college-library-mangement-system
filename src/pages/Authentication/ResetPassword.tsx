import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { validatePassword } from '@/src/utils/validation';

interface ResetPasswordProps {
  token: string;
  role: 'student' | 'staff';
  onResetComplete: (password: string) => void;
  onCancel: () => void;
}

export function ResetPassword({ token, role, onResetComplete, onCancel }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const passValidation = validatePassword(password);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passValidation.isValid) {
      setError('Please choose a stronger password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    onResetComplete(password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className={`h-2 w-full ${role === 'student' ? 'bg-emerald-500' : 'bg-blue-600'}`}></div>
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create New Password</h2>
            <p className="text-slate-500 text-sm mt-2">Enter your new strong password.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                  placeholder="Enter new password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Live Password Validation */}
              {password && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">Password Strength:</span>
                    <span className={`text-xs font-bold ${
                      passValidation.strength === 'Very Strong' ? 'text-emerald-600' :
                      passValidation.strength === 'Strong' ? 'text-emerald-500' :
                      passValidation.strength === 'Good' ? 'text-blue-500' :
                      passValidation.strength === 'Fair' ? 'text-amber-500' : 'text-rose-500'
                    }`}>{passValidation.strength}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1.5 ${passValidation.requirements.isLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 8-64 chars
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.requirements.isUpper ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 Uppercase
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.requirements.isLower ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 Lowercase
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.requirements.isNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 Number
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.requirements.isSpecial ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 Special (@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={onCancel}
                className="w-full py-4 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!passValidation.isValid}
                className={`w-full py-4 text-white rounded-xl font-bold transition-colors ${
                  !passValidation.isValid ? 'bg-slate-300 cursor-not-allowed' :
                  role === 'student' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
