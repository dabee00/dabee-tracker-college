/* Legacy localStorage utils - replaced by Firebase Firestore.
To re-enable localStorage fallback, uncomment below. */

export const storageKeys = {
  assignments: 'activity_assignments',
  pits: 'activity_pits',
  quizzes: 'activity_quizzes'
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn('localStorage save failed');
  }
};

