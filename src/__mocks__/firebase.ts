// src/__mocks__/firebase.ts
export const initializeApp = jest.fn();
export const getFirestore = jest.fn();
export const getAuth = jest.fn(() => ({
  currentUser: { uid: 'test-uid', email: 'test@example.com' },
  signOut: jest.fn(),
}));
export const getStorage = jest.fn();
export const ref = jest.fn();
export const uploadBytes = jest.fn();
export const getDownloadURL = jest.fn();
export const collection = jest.fn();
export const addDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const doc = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const getDocs = jest.fn();