import React, { useState } from 'react';
import { GraduationCap, Users, Shield, ArrowLeft, Building2, AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Student, Staff, CurrentUser } from '@/src/types/index';
import { validatePassword, validateEmail, validatePhone, validateRollNumber } from '@/src/utils/validation';
import { checkLockout, sendResetEmail, generateResetToken } from '@/src/services/auth/authService';

interface AuthProps {
  onLogin: (user: CurrentUser, rememberMe: boolean) => void;
  students: Student[];
  staffs: Staff[];
  onRegisterStudent: (student: Student) => void;
  onRegisterStaff: (staff: Staff) => void;
  onFailedLogin: (id: string, role: 'student' | 'staff') => void;
  onResetRequested: (id: string, role: 'student' | 'staff', token: string, expiry: string) => void;
}

export function Auth({ onLogin, students, staffs, onRegisterStudent, onRegisterStaff, onFailedLogin, onResetRequested }: AuthProps) {
  const [view, setView] = useState<'selection' | 'student-login' | 'student-register' | 'staff-login' | 'staff-register' | 'student-forgot' | 'staff-forgot'>('selection');

  // Form states
  const [id, setId] = useState(''); // rollNo or username
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (view === 'student-forgot') setView('student-login');
    else if (view === 'staff-forgot') setView('staff-login');
    else setView('selection');
    
    setError('');
    setSuccess('');
    setId('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setDepartment('');
    setSemester('1');
    setPhone('');
    setEmail('');
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const trimmedId = id.trim();
    if (!trimmedId || !password) {
      setError('Please fill all fields.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate loading
    
    const student = students.find(s => s.id.toLowerCase() === trimmedId.toLowerCase());
    
    if (student) {
      const lockout = checkLockout(student);
      if (lockout.isLocked) {
        setError(`Too many failed attempts. Please try again later (${lockout.remainingMinutes} mins left).`);
        setIsLoading(false);
        return;
      }

      // CHECK ADMIN APPROVAL STATUS
      const status = student.accountStatus || 'Active';
      if (status === 'Pending' || status === 'Pending Approval') {
        setError('Your account registration is PENDING Admin Approval. Once approved by library staff, you will get access to the Student Portal.');
        setIsLoading(false);
        return;
      }
      if (status === 'Rejected') {
        setError('Your registration request has been REJECTED by the library administration. You cannot access the student portal.');
        setIsLoading(false);
        return;
      }
      if (status === 'Suspended') {
        setError('Your student library account is SUSPENDED. Please contact library staff.');
        setIsLoading(false);
        return;
      }
      if (status === 'Inactive') {
        setError('Your student library account is INACTIVE. Please contact library staff.');
        setIsLoading(false);
        return;
      }

      const isPassCorrect = student.password ? student.password === password : (password === 'password' || password === 'student');

      if (isPassCorrect) {
        onLogin({ role: 'student', id: student.id, name: student.name }, rememberMe);
      } else {
        onFailedLogin(student.id, 'student');
        setError('Invalid Student ID or Password');
      }
    } else {
      setError('Invalid Student ID or Password');
    }
    setIsLoading(false);
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const trimmedId = id.trim();
    if (!trimmedId || !password) {
      setError('Please fill all fields.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const allowedStaffUsernames = [
      'head of library',
      'assistant librarian',
      'admin 1',
      'admin 2',
      'admin 3',
      'principle',
      'principal',
      'admin',
      'head librarian',
      'librarian',
      'administrator'
    ];

    const cleanId = trimmedId.toLowerCase();
    const isAllowedRole = allowedStaffUsernames.includes(cleanId);
    const existingStaff = staffs.find(s => s.id.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId);

    // Check if password matches #Admin098, admin, password, or existing staff's password
    const isPasswordValid = password === '#Admin098' || password === 'admin' || password === 'password' || (existingStaff && existingStaff.password === password);

    if ((isAllowedRole || existingStaff) && isPasswordValid) {
      const staffName = existingStaff ? existingStaff.name : (trimmedId.charAt(0).toUpperCase() + trimmedId.slice(1));
      onLogin({ role: 'staff', id: existingStaff ? existingStaff.id : trimmedId, name: staffName }, rememberMe);
      setIsLoading(false);
      return;
    }

    onFailedLogin(trimmedId, 'staff');
    setError('Wrong Password');
    setIsLoading(false);
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedId = id.trim();
    if (!trimmedId || !password || !confirmPassword || !name.trim() || !department || !semester || !phone.trim() || !email.trim()) {
      setError('Please fill all fields.');
      return;
    }

    const { isValid: isValidRoll, rollNo } = validateRollNumber(trimmedId);
    if (!isValidRoll) {
      setError('Invalid Roll Number format. Expected format like 2k24/DS/9 or 2k24/CS/12');
      return;
    }

    const { isValid: isValidEmail, email: validEmail } = validateEmail(email);
    if (!isValidEmail) {
      setError('Invalid email format.');
      return;
    }

    const { isValid: isValidPhone, phone: validPhone } = validatePhone(phone);
    if (!isValidPhone) {
      setError('Invalid phone number. Must be 11 digits starting with 03.');
      return;
    }

    const passValidation = validatePassword(password);
    if (!passValidation.isValid) {
      setError('Please choose a stronger password matching all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Duplicate Check
    if (students.some(s => s.id.toLowerCase() === rollNo.toLowerCase())) {
      setError('Roll Number already registered. Please login.');
      return;
    }
    if (students.some(s => s.email?.toLowerCase() === validEmail)) {
      setError('Email address is already registered.');
      return;
    }
    if (students.some(s => s.phone === validPhone)) {
      setError('Phone number is already registered.');
      return;
    }
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newStudent: Student = {
      id: rollNo,
      name: name.trim(),
      department,
      semester: parseInt(semester),
      phone: validPhone,
      email: validEmail,
      password,
      accountStatus: 'Pending',
      createdDate: new Date().toISOString()
    };
    
    onRegisterStudent(newStudent);
    setIsLoading(false);

    setSuccess('Registration submitted successfully! Your account is currently PENDING approval by the library administration. Once approved, you will be able to log into the Student Portal.');
    setView('student-login');
    setId(rollNo);
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const trimmedId = id.trim();
    const { email: validEmail } = validateEmail(email);

    if (!trimmedId || !validEmail) {
      setError('Please provide valid ID and email.');
      return;
    }

    setIsLoading(true);

    if (view === 'student-forgot') {
      const student = students.find(s => s.id.toLowerCase() === trimmedId.toLowerCase() && s.email?.toLowerCase() === validEmail);
      if (student) {
        const { token, user } = generateResetToken(student);
        onResetRequested(user.id, 'student', token, user.resetTokenExpiry!);
        const sent = await sendResetEmail(validEmail, token, 'student');
        if (sent) setSuccess(`A password reset link has been sent to ${validEmail}`);
        else setError('Failed to send email. Please try again later.');
      } else {
        setError('No student found with this ID and Email combination.');
      }
    } else if (view === 'staff-forgot') {
      const staff = staffs.find(s => s.id.toLowerCase() === trimmedId.toLowerCase() && s.email.toLowerCase() === validEmail);
      if (staff) {
        const { token, user } = generateResetToken(staff);
        onResetRequested(user.id, 'staff', token, user.resetTokenExpiry!);
        const sent = await sendResetEmail(validEmail, token, 'staff');
        if (sent) setSuccess(`A password reset link has been sent to ${validEmail}`);
        else setError('Failed to send email. Please try again later.');
      } else {
        setError('No staff found with this Username and Email combination.');
      }
    }
    
    setIsLoading(false);
  };

  const handleStaffRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = id.trim();
    const { email: validEmail, isValid: isValidEmail } = validateEmail(email);

    if (!trimmedId || !password || !confirmPassword || !name.trim() || !validEmail) {
      setError('Please fill all fields.');
      return;
    }

    if (!isValidEmail) {
      setError('Invalid email format.');
      return;
    }

    const passValidation = validatePassword(password);
    if (!passValidation.isValid) {
      setError('Please choose a stronger password matching all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const allowedDesignations = [
      'principal',
      'head of library',
      'assistant librarian',
      'staff 1',
      'staff 2',
      'staff 3'
    ];

    if (!allowedDesignations.includes(trimmedId.toLowerCase())) {
      setError('Incorrect username.'); // Do not reveal valid usernames
      return;
    }

    if (staffs.some(s => s.id.toLowerCase() === trimmedId.toLowerCase())) {
      setError('Incorrect username.'); // Obfuscate
      return;
    }
    if (staffs.some(s => s.email.toLowerCase() === validEmail)) {
      setError('Email address is already registered.');
      return;
    }
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const newStaff: Staff = {
      id: trimmedId,
      name: name.trim(),
      email: validEmail,
      password
    };
    
    onRegisterStaff(newStaff);
    onLogin({ role: 'staff', id: newStaff.id, name: newStaff.name }, true);
    setIsLoading(false);
  };

  const renderPasswordStrength = () => {
    if (!password || view.includes('login') || view.includes('forgot')) return null;
    const passValidation = validatePassword(password);
    
    return (
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
    );
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
                {view === 'student-forgot' && 'Reset Student Password'}
                {view === 'staff-forgot' && 'Reset Staff Password'}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {view.includes('login') ? 'Welcome back! Please enter your details.' : view.includes('forgot') ? 'Enter your ID and registered email to reset password.' : 'Create a new account to access the portal.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={
              view === 'student-login' ? handleStudentLogin :
              view === 'staff-login' ? handleStaffLogin :
              view === 'student-register' ? handleStudentRegister :
              view.includes('forgot') ? handleForgotPassword :
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
                <input 
                  type="text" 
                  required
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder={view.includes('student') ? "e.g. 2k24/CS/12" : view === 'staff-register' ? "Enter designation" : "Enter username"}
                />
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
                        {['Computer Science', 'Software Engineering', 'AI', 'IT', 'Accounting & Finance', 'Education', 'BBA', 'English Literature'].map(dept => (
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
                          '2nd year part 3', '2nd year part 4',
                          '3rd year part 5', '3rd year part 6',
                          '4th year part 7', '4th year part 8'
                        ].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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

              {view.includes('forgot') && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Registered Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Enter registered email address"
                  />
                </div>
              )}

              {!view.includes('forgot') && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                      placeholder="Enter password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {renderPasswordStrength()}

                  {view.includes('login') && (
                    <div className="flex justify-between items-center mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 font-medium">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setView(view === 'student-login' ? 'student-forgot' : 'staff-forgot');
                          setError('');
                          setSuccess('');
                        }}
                        className={`text-sm font-medium hover:underline ${view.includes('student') ? 'text-emerald-600' : 'text-blue-600'}`}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {view.includes('register') && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                      placeholder="Confirm password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white rounded-xl font-bold transition-colors mt-2 flex items-center justify-center gap-2 ${
                  isLoading ? 'bg-slate-400 cursor-not-allowed' :
                  view.includes('student') ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {view.includes('login') ? 'Sign In' : view.includes('forgot') ? 'Reset Password' : 'Create Account'}
              </button>

            </form>

            <div className="mt-8 text-center">
              {view === 'student-login' ? (
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setView('student-register'); setError(''); setSuccess(''); }}
                    className="font-semibold hover:underline text-emerald-600"
                  >
                    Register here
                  </button>
                </p>
              ) : view.includes('forgot') ? (
                <p className="text-sm text-slate-500">
                  Remember your password?{' '}
                  <button 
                    onClick={() => { setView(view === 'student-forgot' ? 'student-login' : 'staff-login'); setError(''); setSuccess(''); }}
                    className={`font-semibold hover:underline ${view.includes('student') ? 'text-emerald-600' : 'text-blue-600'}`}
                  >
                    Sign in here
                  </button>
                </p>
              ) : view === 'student-register' ? (
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setView('student-login'); setError(''); setSuccess(''); }}
                    className="font-semibold hover:underline text-emerald-600"
                  >
                    Sign in here
                  </button>
                </p>
              ) : null}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
