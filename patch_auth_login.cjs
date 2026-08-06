const fs = require('fs');
let code = fs.readFileSync('src/pages/Authentication/Auth.tsx', 'utf8');

// Add firebase auth imports
if (!code.includes('import { auth }')) {
  code = `import { auth, db } from '@/src/firebase';\nimport { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';\nimport { doc, setDoc, getDoc } from 'firebase/firestore';\n${code}`;
}

// Replace handleStudentLogin
const studentLoginRegex = /const handleStudentLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?onFailedLogin\(student\.id, 'student'\);\n\s*\}\n\s*\};/;
const studentLoginReplacement = `const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Find the email for this roll number from our local students array if it's a roll number, or just assume it's email
      let loginEmail = id;
      if (!id.includes('@')) {
        const found = students.find(s => s.rollNumber === id || s.id === id);
        if (found) loginEmail = found.email;
        else throw new Error("Student not found.");
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      // Let the onAuthStateChanged in App.tsx handle the actual redirection
      setSuccess('Login successful!');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      onFailedLogin(id, 'student');
    } finally {
      setIsLoading(false);
    }
  };`;
code = code.replace(studentLoginRegex, studentLoginReplacement);

// Replace handleStaffLogin
const staffLoginRegex = /const handleStaffLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?onFailedLogin\(staff\.id, 'staff'\);\n\s*\}\n\s*\};/;
const staffLoginReplacement = `const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // 1. Call backend to verify shared password
      const response = await fetch('/api/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: id, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      
      const staffEmail = \`\${id}@staff.library.system\`.toLowerCase();
      
      try {
        await signInWithEmailAndPassword(auth, staffEmail, data.internalToken);
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          // Auto create staff account if it doesn't exist
          const userCred = await createUserWithEmailAndPassword(auth, staffEmail, data.internalToken);
          // Also create firestore doc
          await setDoc(doc(db, 'staff', userCred.user.uid), {
             id: userCred.user.uid,
             username: id,
             email: staffEmail,
             name: id.toUpperCase(),
             role: id === 'principal' ? 'principal' : 'staff',
             status: 'Active',
             createdAt: new Date().toISOString()
          });
        } else {
          throw authErr;
        }
      }
      setSuccess('Staff login successful!');
    } catch (err: any) {
      setError(err.message || 'Staff login failed.');
      onFailedLogin(id, 'staff');
    } finally {
      setIsLoading(false);
    }
  };`;
code = code.replace(staffLoginRegex, staffLoginReplacement);

fs.writeFileSync('src/pages/Authentication/Auth.tsx', code);
