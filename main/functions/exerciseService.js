const functions = require('firebase-functions');
const { getAllExercises, filterExercises, getExerciseById } = require('./staticExercises');


exports.getExercises = functions.https.onCall(async (data, context) => {
  try {
    const { category, muscle, equipment, intensity, difficulty, take } = data;

    // If no filters, return all exercises
    if (!category && !muscle && !equipment && !intensity && !difficulty) {
      const allExercises = getAllExercises();
      return take ? allExercises.slice(0, take) : allExercises;
    }

    // Build filter object
    const filters = {};
    if (intensity) filters.intensity = intensity;
    if (difficulty) filters.difficulty = difficulty;
    
    // For muscle and equipment, we need to handle them specially
    if (muscle) filters.muscleGroups = [muscle];
    if (equipment) filters.equipment = Array.isArray(equipment) ? equipment : [equipment];

    let results = filterExercises(filters);

    // Apply additional category filter if needed
    if (category) {
      results = results.filter(ex => ex.category === category);
    }

    // Apply limit if specified
    if (take) {
      results = results.slice(0, take);
    }

    return results;

  } catch (error) {
    console.error('Error getting exercises:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get exercises');
  }
});

/**
 * Get a single exercise by ID
 */
exports.getExerciseById = functions.https.onCall(async (data, context) => {
  try {
    const { exerciseId } = data;

    if (!exerciseId) {
      throw new functions.https.HttpsError('invalid-argument', 'Exercise ID is required');
    }

    const exercise = getExerciseById(exerciseId);

    if (!exercise) {
      throw new functions.https.HttpsError('not-found', 'Exercise not found');
    }

    return exercise;

  } catch (error) {
    console.error('Error getting exercise:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to get exercise');
  }
});

/**
 * Get exercises by muscle group
 */
exports.getExercisesByMuscle = functions.https.onCall(async (data, context) => {
  try {
    const { muscleGroups, intensity, difficulty } = data;

    if (!muscleGroups || !Array.isArray(muscleGroups) || muscleGroups.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Muscle groups array is required');
    }

    const results = filterExercises({
      muscleGroups,
      intensity,
      difficulty
    });

    return results;

  } catch (error) {
    console.error('Error getting exercises by muscle:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to get exercises');
  }
});

/**
 * Get exercises by equipment
 */
exports.getExercisesByEquipment = functions.https.onCall(async (data, context) => {
  try {
    const { equipment, intensity, difficulty } = data;

    if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Equipment array is required');
    }

    const results = filterExercises({
      equipment,
      intensity,
      difficulty
    });

    return results;

  } catch (error) {
    console.error('Error getting exercises by equipment:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to get exercises');
  }
});

