const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Import Cloud Functions
const { generateWorkout } = require('./generateWorkout');
const { onWorkoutLogCreated } = require('./progressTracking');
const { getProgressSummaries } = require('./progressTracking');
const { 
  createRoutine, 
  getUserRoutines, 
  getRoutine, 
  updateRoutine, 
  deleteRoutine, 
  saveGeneratedWorkoutAsRoutine 
} = require('./routineManagement');
const { 
  startWorkoutSession, 
  endWorkoutSession, 
  getWorkoutSession, 
  getUserWorkoutSessions,
  getUserWorkoutLogs,
  getUserRunningLogs,
  getAllActivityLogs,
  migrateWorkoutLogs
} = require('./workoutSessions');
const {
  getExercises,
  getExerciseById,
  getExercisesByMuscle,
  getExercisesByEquipment
} = require('./exerciseService');

// Export Cloud Functions
exports.generateWorkout = generateWorkout;
exports.onWorkoutLogCreated = onWorkoutLogCreated;
exports.getProgressSummaries = getProgressSummaries;
exports.createRoutine = createRoutine;
exports.getUserRoutines = getUserRoutines;
exports.getRoutine = getRoutine;
exports.updateRoutine = updateRoutine;
exports.deleteRoutine = deleteRoutine;
exports.saveGeneratedWorkoutAsRoutine = saveGeneratedWorkoutAsRoutine;
exports.startWorkoutSession = startWorkoutSession;
exports.endWorkoutSession = endWorkoutSession;
exports.getWorkoutSession = getWorkoutSession;
exports.getUserWorkoutSessions = getUserWorkoutSessions;
exports.getUserWorkoutLogs = getUserWorkoutLogs;
exports.getUserRunningLogs = getUserRunningLogs;
exports.getAllActivityLogs = getAllActivityLogs;
exports.migrateWorkoutLogs = migrateWorkoutLogs;
exports.getExercises = getExercises;
exports.getExerciseById = getExerciseById;
exports.getExercisesByMuscle = getExercisesByMuscle;
exports.getExercisesByEquipment = getExercisesByEquipment;

