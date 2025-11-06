import { auth, db } from '@lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as _signOut,
  onAuthStateChanged as _onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

async function signUpWithEmail(email, password, profile = {}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  const ref = doc(db, 'users', uid);
  const payload = stripUndefined({
    uid,
    email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...profile,
  });
  await setDoc(ref, payload, { merge: true });
  return cred.user;
}

async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

async function logOut() {
  await _signOut(auth);
}

async function signOut() {
  await _signOut(auth);
}

function onAuth(cb) {
  return _onAuthStateChanged(auth, cb);
}

function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

function getCurrentUser() {
  return auth.currentUser;
}

async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

async function updateProfile(data) {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, 'users', user.uid);
  const payload = stripUndefined({ ...data, updatedAt: serverTimestamp() });
  await setDoc(ref, payload, { merge: true });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function signUp(email, password, profile = {}) {
  return signUpWithEmail(email, password, profile);
}

async function signIn(email, password) {
  return signInWithEmail(email, password);
}

export const AuthService = {
  signUpWithEmail,
  signInWithEmail,
  signUp,
  signIn,
  signOut,
  logOut,
  onAuth,
  onAuthStateChanged,
  getCurrentUser,
  getCurrentUserProfile,
  updateProfile,
};

export {
  signUpWithEmail,
  signInWithEmail,
  signUp,
  signIn,
  signOut,
  logOut,
  onAuth,
  onAuthStateChanged,
  getCurrentUser,
  getCurrentUserProfile,
  updateProfile,
};

export default AuthService;
