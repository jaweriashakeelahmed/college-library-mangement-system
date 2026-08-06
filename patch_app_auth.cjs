const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

if (!code.includes('import { auth, db } from')) {
  code = `import { auth, db } from '@/src/firebase';\nimport { onAuthStateChanged, signOut } from 'firebase/auth';\nimport { doc, getDoc } from 'firebase/firestore';\n${code}`;
}

const authStateRegex = /const \[currentUser, setCurrentUser\] = useState<CurrentUser \| null>\(\(\) => \{[\s\S]*?\}\);/;
const authStateReplacement = `const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Find if user is staff or student
        // Let's first check staff collection
        let isStaff = false;
        try {
          const staffDoc = await getDoc(doc(db, 'staff', user.uid));
          if (staffDoc.exists()) {
            isStaff = true;
            setCurrentUser({ id: staffDoc.data().username, role: staffDoc.data().role as any });
          } else {
            // Must be student
            setCurrentUser({ id: user.uid, role: 'student' });
          }
        } catch(e) {
           setCurrentUser({ id: user.uid, role: 'student' });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);`;

code = code.replace(authStateRegex, authStateReplacement);

const handleLogoutRegex = /const handleLogout = \(\) => \{[\s\S]*?localStorage\.setItem\('lms_remember_me', 'true'\);\n\s*\};/;
const handleLogoutReplacement = `const handleLogout = async () => {
    if (currentUser) {
      addActivityLog(currentUser.id, currentUser.role, currentUser.role === 'student' ? 'Student Logout' : 'Other', 'Staff Logout');
    }
    await signOut(auth);
  };`;
code = code.replace(handleLogoutRegex, handleLogoutReplacement);

fs.writeFileSync('src/app/App.tsx', code);
