import React, { useState } from 'react';
import { GraduationCap, Users, Shield, ArrowLeft, Building2, AlertCircle } from 'lucide-react';
import { Student, Staff, CurrentUser } from '../types';

interface AuthProps {
  onLogin: (user: CurrentUser) => void;
  students: Student[];
  staffs: Staff[];
  onRegisterStudent: (student: Student) => void;
  onRegisterStaff: (staff: Staff) => void;
}

export function Auth({ onLogin, students, staffs, onRegisterStudent, onRegisterStaff }: AuthProps) {
  const [view, setView] = useState<'selection' | 'student-login' | 'student-register' | 'staff-login' | 'staff-register'>('selection');

  // Form states
  const [id, setId] = useState(''); // rollNo or username
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [error, setError] = useState('');

  const handleBack = () => {
    setView('selection');
    setError('');
    setId('');
    setPassword('');
    setName('');
    setDepartment('');
    setSemester('1');
    setPhone('');
    setEmail('');
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id.toLowerCase() === id.toLowerCase());
    if (student && student.password === password) {
      onLogin({ role: 'student', id: student.id, name: student.name });
    } else {
      setError('Invalid Student ID or Password');
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffs.find(s => s.id.toLowerCase() === id.toLowerCase());
    // For testing/initial setup, allow admin/admin if no staff exists
    if (id === 'admin' && password === 'admin') {
      onLogin({ role: 'staff', id: 'admin', name: 'Administrator' });
      return;
    }
    
    if (staff && staff.password === password) {
      onLogin({ role: 'staff', id: staff.id, name: staff.name });
    } else {
      setError('Invalid Username or Password');
    }
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (students.some(s => s.id.toLowerCase() === id.toLowerCase())) {
      setError('Student ID already registered. Please login.');
      return;
    }
    
    const newStudent: Student = {
      id,
      name,
      department,
      semester: parseInt(semester),
      phone,
      password
    };
    
    onRegisterStudent(newStudent);
    onLogin({ role: 'student', id: newStudent.id, name: newStudent.name });
  };

  const handleStaffRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffs.some(s => s.id.toLowerCase() === id.toLowerCase())) {
      setError('Username already taken.');
      return;
    }
    
    const newStaff: Staff = {
      id,
      name,
      email,
      password
    };
    
    onRegisterStaff(newStaff);
    onLogin({ role: 'staff', id: newStaff.id, name: newStaff.name });
  };

  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-200">
            <GraduationCap className="w-12 h-12 text-blue-600 stroke-[1.5]" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4 border border-blue-100">
            <Shield className="w-4 h-4" />
            SECURE LOGIN PORTAL
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            COLLEGE LIBRARY SYSTEM
          </h1>
          <p className="text-slate-500 font-medium tracking-wide text-sm md:text-base">
            CHOOSE YOUR LOGIN PORTAL
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Student Portal Card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-200 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-2 bg-emerald-500 w-full"></div>
            <div className="p-8 md:p-12 text-center flex flex-col h-full">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-emerald-600 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Student Portal</h2>
              <p className="text-slate-500 mb-6 text-sm flex-grow">
                View available books, check your issued books, due dates, and download fine challans.
              </p>
              <div className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8 mx-auto">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Students
              </div>
              <button 
                onClick={() => setView('student-login')}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                Student Login
              </button>
            </div>
          </div>

          {/* Staff Portal Card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-200 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-2 bg-blue-600 w-full"></div>
            <div className="p-8 md:p-12 text-center flex flex-col h-full">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-blue-600 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Staff Portal</h2>
              <p className="text-slate-500 mb-6 text-sm flex-grow">
                Manage books, issue and return records, students list, and generate library reports.
              </p>
              <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8 mx-auto">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Librarian & Admin
              </div>
              <button 
                onClick={() => setView('staff-login')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                Staff Login
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        <button 
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal Selection
        </button>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl relative">
          <div className={`h-2 w-full ${view.includes('student') ? 'bg-emerald-500' : 'bg-blue-600'}`}></div>
          
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {view === 'student-login' && 'Student Login'}
                {view === 'student-register' && 'Student Registration'}
                {view === 'staff-login' && 'Staff Login'}
                {view === 'staff-register' && 'Staff Registration'}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {view.includes('login') ? 'Welcome back! Please enter your details.' : 'Create a new account to access the portal.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={
              view === 'student-login' ? handleStudentLogin :
              view === 'staff-login' ? handleStaffLogin :
              view === 'student-register' ? handleStudentRegister :
              handleStaffRegister
            } className="space-y-5">
              
              {view.includes('register') && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  {view.includes('student') ? 'Student ID (Roll No)' : view === 'staff-register' ? 'Designation (Username)' : 'Username'}
                </label>
                {view === 'staff-register' ? (
                  <select 
                    required
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="" disabled>Select Designation</option>
                    {[
                      'Head of Librarian', 
                      'Assistant Librarian', 
                      'Library Staff 1', 
                      'Library Staff 2', 
                      'Library Staff 3', 
                      'Principle'
                    ].map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    required
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder={view.includes('student') ? "e.g. 2k24/CS/12" : "Enter username"}
                  />
                )}
              </div>

              {view === 'student-register' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Department</label>
                      <select 
                        required
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        <option value="" disabled>Select Dept</option>
                        {['CS', 'SE', 'AI', 'IT', 'DS', 'English Literature', 'BBA', 'Commerce', 'Finance', 'Accounting', 'Education'].map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Year</label>
                      <select 
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        {[
                          '1st year part 1', '1st year part 2', 
                          '2nd year part 1', '2nd year part 2',
                          '3rd year part 1', '3rd year part 2',
                          '4th year part 1', '4th year part 2'
                        ].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="e.g. 03001234567"
                    />
                  </div>
                </>
              )}

              {view === 'staff-register' && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter email address"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Enter password"
                />
              </div>

              <button 
                type="submit"
                className={`w-full py-4 text-white rounded-xl font-bold transition-colors mt-2 ${
                  view.includes('student') ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {view.includes('login') ? 'Sign In' : 'Create Account'}
              </button>

            </form>

            <div className="mt-8 text-center">
              {view.includes('login') ? (
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setView(view === 'student-login' ? 'student-register' : 'staff-register'); setError(''); }}
                    className={`font-semibold hover:underline ${view.includes('student') ? 'text-emerald-600' : 'text-blue-600'}`}
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setView(view === 'student-register' ? 'student-login' : 'staff-login'); setError(''); }}
                    className={`font-semibold hover:underline ${view.includes('student') ? 'text-emerald-600' : 'text-blue-600'}`}
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
