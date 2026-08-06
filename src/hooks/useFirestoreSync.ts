import { useState, useEffect } from 'react';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '@/src/firebase';

export function useFirestoreSync<T>(collectionName: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: T[] = [];
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() } as unknown as T);
      });
      setData(result);
      setLoading(false);
    }, (error) => {
      console.error(`Error syncing ${collectionName}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, setData }; // setData is included for local optimistic updates if needed, though mostly Firestore will drive this
}

export function useFirestoreDocument<T>(collectionName: string, docId: string, initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }
    const { doc, onSnapshot } = require('firebase/firestore');
    const unsubscribe = onSnapshot(doc(db, collectionName, docId), (snapshot: any) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as unknown as T);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (error: any) => {
      console.error(`Error syncing ${collectionName}/${docId}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, setData };
}
