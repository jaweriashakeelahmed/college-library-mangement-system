const fs = require('fs');
let code = fs.readFileSync('src/pages/Authentication/Auth.tsx', 'utf8');

const studentRegRegex = /const handleStudentRegister = async \(e: React\.FormEvent\) => \{[\s\S]*?name: newStudent\.name \}, true\);\n\s*\};/;
const studentRegReplacement = `const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      
      const newStudent: Student = {
        id: userCred.user.uid,
        name, email, phone, department, semester, rollNumber: id,
        accountStatus: 'Pending',
        wishlist: [],
        createdAt: new Date().toISOString()
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'students', userCred.user.uid), newStudent);
      
      setSuccess('Registration successful! Your account is pending staff approval.');
      setTimeout(() => setView('student-login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };`;
code = code.replace(studentRegRegex, studentRegReplacement);

const forgotRegex = /const handleForgotPassword = async \(e: React\.FormEvent\) => \{[\s\S]*?\} else if \(view === 'staff-forgot'\) \{[\s\S]*?\}\n\s*\};/;
const forgotReplacement = `const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      if (view === 'student-forgot') {
        if (!email) throw new Error('Please enter your email address');
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent! Check your inbox.');
      } else if (view === 'staff-forgot') {
        throw new Error('Staff password cannot be reset via email. Please contact the Super Admin.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };`;
code = code.replace(forgotRegex, forgotReplacement);

fs.writeFileSync('src/pages/Authentication/Auth.tsx', code);
