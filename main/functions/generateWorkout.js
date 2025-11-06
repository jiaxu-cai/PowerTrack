const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { filterExercises } = require('./staticExercises');

const db = admin.firestore();

exports.generateWorkout = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { timeMin, intensity, goal, muscleGroups, equipment } = data;
  const userId = context.auth.uid;

  try {
    // Get user profile for personalization
    let userDoc = await db.collection('users').doc(userId).get();
    let userData;
    
    if (!userDoc.exists) {
      // Create a default user profile if one doesn't exist
      console.log('Creating default user profile for user:', userId);
      const defaultProfile = {
        uid: userId,
        email: context.auth.token.email || '',
        username: context.auth.token.name || 'User',
        experienceLevel: 'beginner',
        heightCm: 175,
        weightKg: 70,
        goal: goal || 'general_fitness',
        preferredIntensity: intensity || 'medium',
        preferredTimeMin: timeMin || 30,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').doc(userId).set(defaultProfile);
      userData = defaultProfile;
    } else {
      userData = userDoc.data();
    }

    const userExperience = userData?.experienceLevel || 'beginner';

    // Filter exercises using static exercise database
    const availableExercises = filterExercises({
      intensity,
      muscleGroups,
      equipment
    });

    if (availableExercises.length === 0) {
      throw new functions.https.HttpsError('not-found', 'No exercises found matching criteria');
    }

    // Generate workout routine
    const routine = generateWorkoutRoutine(
      availableExercises,
      timeMin,
      intensity,
      goal,
      userExperience
    );

    // Get exercise details for the routine
    const exerciseIds = routine.items.map(item => item.exerciseId);
    const exerciseDetails = availableExercises.filter(ex => exerciseIds.includes(ex.exerciseId));

    const response = {
      routine,
      exercises: exerciseDetails
    };

    return response;

  } catch (error) {
    console.error('Error generating workout:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to generate workout');
  }
});

function generateWorkoutRoutine(exercises, timeMin, intensity, goal, userExperience) {
  const routineId = db.collection('routines').doc().id;
  const totalTimeSec = timeMin * 60;
  
  // Calculate workout parameters based on intensity and time
  const { setsPerExercise, repsPerSet, restTimeSec } = getWorkoutParameters(intensity, timeMin);
  
  // Select exercises based on goal and available time
  const selectedExercises = selectExercisesForGoal(exercises, goal, timeMin, userExperience);
  
  // Create routine items
  const items = selectedExercises.map(exercise => ({
    exerciseId: exercise.exerciseId,
    sets: setsPerExercise,
    reps: repsPerSet,
    restTimeSec: restTimeSec,
    notes: getExerciseNotes(exercise, goal)
  }));

  // Calculate actual total time
  const actualTimeMin = Math.round(
    items.reduce((total, item) => {
      const exercise = exercises.find(ex => ex.exerciseId === item.exerciseId);
      return total + (item.sets * (exercise?.timePerSetSec || 30) + (item.sets - 1) * item.restTimeSec);
    }, 0) / 60
  );

  return {
    routineId,
    ownerId: '', 
    title: `${intensity.charAt(0).toUpperCase() + intensity.slice(1)} ${goal.replace('_', ' ')} Workout`,
    goal,
    totalTimeMin: actualTimeMin,
    intensity: intensity,
    items,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function getWorkoutParameters(intensity, timeMin) {
  switch (intensity) {
    case 'low':
      return {
        setsPerExercise: Math.max(2, Math.floor(timeMin / 15)),
        repsPerSet: 12,
        restTimeSec: 30
      };
    case 'medium':
      return {
        setsPerExercise: Math.max(3, Math.floor(timeMin / 12)),
        repsPerSet: 10,
        restTimeSec: 45
      };
    case 'high':
      return {
        setsPerExercise: Math.max(4, Math.floor(timeMin / 10)),
        repsPerSet: 8,
        restTimeSec: 60
      };
    default:
      return {
        setsPerExercise: 3,
        repsPerSet: 10,
        restTimeSec: 45
      };
  }
}

function selectExercisesForGoal(exercises, goal, timeMin, userExperience) {
  // Filter exercises by difficulty based on user experience
  const difficultyFilter = (exercise) => {
    switch (userExperience) {
      case 'beginner':
        return exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate';
      case 'intermediate':
        return exercise.difficulty !== 'advanced' || Math.random() > 0.3;
      case 'advanced':
        return true;
      default:
        return true;
    }
  };

  let filteredExercises = exercises.filter(difficultyFilter);

  // Sort by usefulness score and goal relevance
  filteredExercises.sort((a, b) => {
    const aScore = a.usefulnessScore + getGoalRelevanceScore(a, goal);
    const bScore = b.usefulnessScore + getGoalRelevanceScore(b, goal);
    return bScore - aScore;
  });

  // Select appropriate number of exercises based on time
  const maxExercises = Math.min(
    Math.floor(timeMin / 5), // Roughly 5 minutes per exercise
    filteredExercises.length,
    8 // Maximum 8 exercises
  );

  return filteredExercises.slice(0, maxExercises);
}

function getGoalRelevanceScore(exercise, goal) {
  const goalMuscleMap = {
    'weight_loss': ['full_body', 'cardio', 'core'],
    'muscle_gain': ['chest', 'back', 'shoulders', 'arms', 'legs'],
    'endurance': ['cardio', 'full_body', 'core'],
    'strength': ['chest', 'back', 'legs', 'core'],
    'general_fitness': ['full_body', 'core', 'cardio']
  };

  const relevantMuscles = goalMuscleMap[goal] || [];
  const muscleScore = exercise.muscle.some(muscle => 
    relevantMuscles.some(rel => muscle.toLowerCase().includes(rel))
  ) ? 10 : 0;

  return muscleScore;
}

function getExerciseNotes(exercise, goal) {
  const notes = {
    'weight_loss': 'Focus on controlled movements and maintain elevated heart rate',
    'muscle_gain': 'Use challenging weight, focus on muscle contraction',
    'endurance': 'Maintain steady pace, focus on breathing',
    'strength': 'Use heavy weight, focus on form and power',
    'general_fitness': 'Focus on proper form and controlled movements'
  };

  return notes[goal] || 'Focus on proper form and controlled movements';
}


