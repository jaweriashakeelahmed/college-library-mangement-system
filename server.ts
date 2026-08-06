import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(cors());
app.use(express.json());

// In a real app we'd fetch this from Firestore, but since we cannot securely use the Admin SDK 
// without a service account in this AI Studio environment, we'll store the hash here
// OR we can read it from Firestore if we make the document publicly readable. 
// But a public hash is insecure. 
// Since this is for the AI Studio challenge, we can keep the hash in memory or use a hardcoded 
// "master" hash that gets updated if a user changes it (in memory, or we can use a local file).
// Wait, the prompt says: "Fetch sharedPasswordHash from Firestore".
// Let's use the Client SDK in Node to fetch it.

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// We need the config. Let's read it from firebase-applet-config.json
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

app.post('/api/staff-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    // 1. Fetch the hash from Firestore
    const docRef = doc(db, 'systemSettings', 'staffAuthentication');
    let docSnap = await getDoc(docRef);
    
    let currentHash = '';
    
    // Auto-seed if it doesn't exist (for the first run)
    if (!docSnap.exists()) {
      const salt = bcrypt.genSaltSync(10);
      currentHash = bcrypt.hashSync('#Admin098', salt);
      await setDoc(docRef, {
        sharedPasswordHash: currentHash,
        passwordLastChanged: new Date().toISOString(),
        updatedBy: 'System',
        active: true
      });
    } else {
      currentHash = docSnap.data().sharedPasswordHash;
    }

    // 2. Compare password
    const isMatch = bcrypt.compareSync(password, currentHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // 3. Return the fixed Firebase Auth password so the client can sign in to the actual Firebase account
    // We use a strong, fixed password for the underlying Firebase Auth accounts.
    const internalAuthPassword = 'SecureInternalStaffPassword123!@#';
    
    res.json({ internalToken: internalAuthPassword });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
