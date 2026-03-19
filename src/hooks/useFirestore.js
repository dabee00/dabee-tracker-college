import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error('Firestore error:', err);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  const addData = async (dataObj) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...dataObj,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const updateData = async (id, dataObj) => {
    try {
      await updateDoc(doc(db, collectionName, id), dataObj);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const setDataState = (newData) => setData(newData); // For optimistic updates if needed

  return { data, loading, error, addData, updateData, deleteData, setDataState };
};
