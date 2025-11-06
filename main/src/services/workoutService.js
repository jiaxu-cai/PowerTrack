import { db, functions } from '@lib/firebase';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

async function upsertUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  const payload = stripUndefined({ ...data, uid, updatedAt: serverTimestamp() });
  await setDoc(ref, payload, { merge: true });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  const payload = stripUndefined({ ...data, updatedAt: serverTimestamp() });
  await updateDoc(ref, payload);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function createUserProfile(data) {
  const ref = doc(db, 'users', data.uid);
  const payload = stripUndefined({ ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(ref, payload);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function createWorkout(uid, workout) {
  const col = collection(db, 'users', uid, 'workouts');
  const payload = stripUndefined({ ...workout, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  const ref = await addDoc(col, payload);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function getExercises({ category, muscle, equipment, take } = {}) {
  const fn = httpsCallable(functions, 'getExercises');
  const { data } = await fn({ category, muscle, equipment, take });
  return data;
}

async function getUserRoutines({ limit = 20 } = {}) {
  const fn = httpsCallable(functions, 'getUserRoutines');
  const { data } = await fn({ limit });
  return data;
}

async function createUserRoutine(routine) {
  const fn = httpsCallable(functions, 'createRoutine');
  const { data } = await fn(routine);
  return data;
}

async function updateUserRoutine(routine) {
  const fn = httpsCallable(functions, 'updateRoutine');
  const { data } = await fn(routine);
  return data;
}

async function deleteUserRoutine(routineId) {
  const fn = httpsCallable(functions, 'deleteRoutine');
  const { data } = await fn({ routineId });
  return data;
}

async function saveGeneratedWorkoutAsRoutine({ generatedWorkoutId, title }) {
  const fn = httpsCallable(functions, 'saveGeneratedWorkoutAsRoutine');
  const { data } = await fn({ generatedWorkoutId, title });
  return data;
}

async function generateWorkout(params) {
  const fn = httpsCallable(functions, 'generateWorkout');
  const { data } = await fn(params);
  return data;
}

async function getProgressSummaries({ from, to } = {}) {
  const fn = httpsCallable(functions, 'getProgressSummaries');
  const { data } = await fn({ from, to });
  return data;
}

async function getUserWorkoutLogs({ limit = 50 } = {}) {
  const fn = httpsCallable(functions, 'getUserWorkoutLogs');
  const { data } = await fn({ limit });
  return data;
}

async function getUserRunningLogs({ limit = 50 } = {}) {
  const fn = httpsCallable(functions, 'getUserRunningLogs');
  const { data } = await fn({ limit });
  return data;
}

async function getAllActivityLogs({ limit = 100 } = {}) {
  const fn = httpsCallable(functions, 'getAllActivityLogs');
  const { data } = await fn({ limit });
  return data;
}

async function startWorkoutSession(sourceType, sourceId, routineData) {
  const fn = httpsCallable(functions, 'startWorkoutSession');
  const { data } = await fn({ sourceType, sourceId, routineData });
  return data;
}

async function endWorkoutSession(sessionId, perceivedIntensity, mood, notes, performedExercises) {
  const fn = httpsCallable(functions, 'endWorkoutSession');
  const { data } = await fn({ sessionId, perceivedIntensity, mood, notes, performedExercises });
  return data;
}

async function getWorkoutSession(sessionId) {
  const fn = httpsCallable(functions, 'getWorkoutSession');
  const { data } = await fn({ sessionId });
  return data;
}

async function getUserWorkoutSessions({ limit = 20 } = {}) {
  const fn = httpsCallable(functions, 'getUserWorkoutSessions');
  const { data } = await fn({ limit });
  return data;
}

async function migrateWorkoutLogs() {
  const fn = httpsCallable(functions, 'migrateWorkoutLogs');
  const { data } = await fn({});
  return data;
}

export const WorkoutService = {
  getUserProfile,
  upsertUserProfile,
  updateUserProfile,
  createUserProfile,
  createWorkout,
  getExercises,
  getUserRoutines,
  createUserRoutine,
  updateUserRoutine,
  deleteUserRoutine,
  // shortcuts
  createRoutine: createUserRoutine,
  updateRoutine: updateUserRoutine,
  deleteRoutine: deleteUserRoutine,
  saveGeneratedWorkoutAsRoutine,
  generateWorkout,
  getProgressSummaries,
  getUserWorkoutLogs,
  getUserRunningLogs,
  getAllActivityLogs,
  startWorkoutSession,
  endWorkoutSession,
  getWorkoutSession,
  getUserWorkoutSessions,
  migrateWorkoutLogs,
};

export {
  getUserProfile,
  upsertUserProfile,
  updateUserProfile,
  createUserProfile,
  createWorkout,
  getExercises,
  getUserRoutines,
  createUserRoutine,
  updateUserRoutine,
  deleteUserRoutine,
  createUserRoutine as createRoutine,
  updateUserRoutine as updateRoutine,
  deleteUserRoutine as deleteRoutine,
  saveGeneratedWorkoutAsRoutine,
  generateWorkout,
  getProgressSummaries,
  getUserWorkoutLogs,
  getUserRunningLogs,
  getAllActivityLogs,
  startWorkoutSession,
  endWorkoutSession,
  getWorkoutSession,
  getUserWorkoutSessions,
  migrateWorkoutLogs,
};

export default WorkoutService;
