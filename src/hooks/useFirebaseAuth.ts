import { useState, useEffect } from 'react';
import { auth, db } from '@/src/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { CurrentUser } from '@/src/types';

export function useFirebaseAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Fetch custom user profile from Firestore
        // Students are in 'students', staff in 'staff' or 'administrators'
        try {
          const studentDoc = await getDoc(doc(db, 'students', user.uid));
          if (studentDoc.exists()) {
            setCurrentUser({ id: user.uid, role: 'student' });
          } else {
            const staffDoc = await getDoc(doc(db, 'staff', user.uid));
            if (staffDoc.exists()) {
              setCurrentUser({ id: user.uid, role: staffDoc.data().role || 'staff' });
            } else {
               const adminDoc = await getDoc(doc(db, 'administrators', user.uid));
               if (adminDoc.exists()) {
                 setCurrentUser({ id: user.uid, role: adminDoc.data().role || 'admin' });
               } else {
                 setCurrentUser(null);
               }
            }
          }
        } catch (e) {
          console.error("Error fetching user role", e);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, currentUser, authLoading };
}
