const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

// Create a new routine
exports.createRoutine = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { title, goal, estimatedTimeMinutes, intendedIntensity, exercises } = data;
  const userId = context.auth.uid;

  try {
    const routineRef = db.collection('routines').doc();
    const routineId = routineRef.id;

    // Create routine document
    const routineData = {
      routineId,
      ownerId: userId,
      title,
      goal,
      estimatedTimeMinutes,
      intendedIntensity,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await routineRef.set(routineData);

    // Create routine exercises
    if (exercises && exercises.length > 0) {
      const batch = db.batch();
      
      exercises.forEach((exercise, index) => {
        const exerciseRef = db.collection('routine_exercises').doc();
        batch.set(exerciseRef, {
          routineExerciseId: exerciseRef.id,
          routineId,
          exerciseId: exercise.exerciseId,
          orderIndex: index,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
          notes: exercise.notes || ''
        });
      });

      await batch.commit();
    }

    return { routineId, ...routineData };
  } catch (error) {
    console.error('Error creating routine:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create routine');
  }
});

// Get user routines
exports.getUserRoutines = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { limit = 20 } = data;

  try {
    let routinesSnapshot;
    
    try {
      routinesSnapshot = await db
        .collection('routines')
        .where('ownerId', '==', userId)
        .orderBy('updatedAt', 'desc')
        .limit(limit)
        .get();
    } catch (orderByError) {
      console.warn('orderBy failed, fetching all routines:', orderByError.message);
      routinesSnapshot = await db
        .collection('routines')
        .where('ownerId', '==', userId)
        .get();
    }

    const routines = [];
    
    for (const doc of routinesSnapshot.docs) {
      try {
        const routineData = { routineId: doc.id, ...doc.data() };
        
        if (!routineData.updatedAt) {
          routineData.updatedAt = routineData.createdAt || new Date();
        }
        
        let exercisesSnapshot;
        try {
          exercisesSnapshot = await db
            .collection('routine_exercises')
            .where('routineId', '==', doc.id)
            .orderBy('orderIndex', 'asc')
            .get();
        } catch (exerciseOrderByError) {
          console.warn(`orderBy failed for routine ${doc.id} exercises:`, exerciseOrderByError.message);
          exercisesSnapshot = await db
            .collection('routine_exercises')
            .where('routineId', '==', doc.id)
            .get();
        }

        const exercises = exercisesSnapshot.docs.map(exerciseDoc => ({
          routineExerciseId: exerciseDoc.id,
          ...exerciseDoc.data()
        }));

        exercises.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

        routineData.exercises = exercises;
        routines.push(routineData);
      } catch (routineError) {
        console.error(`Error processing routine ${doc.id}:`, routineError.message);
      }
    }
    
    if (routines.length > limit) {
      routines.sort((a, b) => {
        const aTime = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
        const bTime = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
        return bTime - aTime;
      });
      return routines.slice(0, parseInt(limit));
    }

    return routines;
  } catch (error) {
    console.error('Error getting user routines:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get routines');
  }
});

// Get routine by ID
exports.getRoutine = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { routineId } = data;
  const userId = context.auth.uid;

  try {
    const routineDoc = await db.collection('routines').doc(routineId).get();
    
    if (!routineDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Routine not found');
    }

    const routineData = { routineId: routineDoc.id, ...routineDoc.data() };

    // Check if user owns this routine or it's public
    if (routineData.ownerId !== userId && !routineData.isPublic) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Get exercises for this routine
    const exercisesSnapshot = await db
      .collection('routine_exercises')
      .where('routineId', '==', routineId)
      .orderBy('orderIndex', 'asc')
      .get();

    const exercises = exercisesSnapshot.docs.map(exerciseDoc => ({
      routineExerciseId: exerciseDoc.id,
      ...exerciseDoc.data()
    }));

    routineData.exercises = exercises;
    return routineData;
  } catch (error) {
    console.error('Error getting routine:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to get routine');
  }
});

// Update routine
exports.updateRoutine = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { routineId, title, goal, estimatedTimeMinutes, intendedIntensity, exercises } = data;
  const userId = context.auth.uid;

  try {
    const routineRef = db.collection('routines').doc(routineId);
    const routineDoc = await routineRef.get();

    if (!routineDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Routine not found');
    }

    const routineData = routineDoc.data();
    if (routineData.ownerId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Update routine
    await routineRef.update({
      title,
      goal,
      estimatedTimeMinutes,
      intendedIntensity,
      updatedAt: new Date()
    });

    // Update exercises if provided
    if (exercises) {
      // Delete existing exercises
      const existingExercisesSnapshot = await db
        .collection('routine_exercises')
        .where('routineId', '==', routineId)
        .get();

      const batch = db.batch();
      existingExercisesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Add new exercises
      exercises.forEach((exercise, index) => {
        const exerciseRef = db.collection('routine_exercises').doc();
        batch.set(exerciseRef, {
          routineExerciseId: exerciseRef.id,
          routineId,
          exerciseId: exercise.exerciseId,
          orderIndex: index,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
          notes: exercise.notes || ''
        });
      });

      await batch.commit();
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating routine:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to update routine');
  }
});

// Delete routine
exports.deleteRoutine = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { routineId } = data;
  const userId = context.auth.uid;

  try {
    const routineRef = db.collection('routines').doc(routineId);
    const routineDoc = await routineRef.get();

    if (!routineDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Routine not found');
    }

    const routineData = routineDoc.data();
    if (routineData.ownerId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Delete routine and all its exercises
    const batch = db.batch();
    
    // Delete routine
    batch.delete(routineRef);

    // Delete all exercises for this routine
    const exercisesSnapshot = await db
      .collection('routine_exercises')
      .where('routineId', '==', routineId)
      .get();

    exercisesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error deleting routine:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to delete routine');
  }
});

// Save generated workout as routine
exports.saveGeneratedWorkoutAsRoutine = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { generatedWorkoutId, title } = data;
  const userId = context.auth.uid;

  try {
    // Get the generated workout
    const generatedWorkoutDoc = await db.collection('generated_workouts').doc(generatedWorkoutId).get();
    
    if (!generatedWorkoutDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Generated workout not found');
    }

    const generatedWorkout = generatedWorkoutDoc.data();
    
    if (generatedWorkout.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Create new routine
    const routineRef = db.collection('routines').doc();
    const routineId = routineRef.id;

    const routineData = {
      routineId,
      ownerId: userId,
      title: title || generatedWorkout.title,
      goal: generatedWorkout.goal,
      estimatedTimeMinutes: generatedWorkout.estimatedTimeMinutes,
      intendedIntensity: generatedWorkout.overallIntensity,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await routineRef.set(routineData);

    // Get generated workout exercises
    const generatedExercisesSnapshot = await db
      .collection('generated_workout_exercises')
      .where('genWorkoutId', '==', generatedWorkoutId)
      .orderBy('orderIndex', 'asc')
      .get();

    // Create routine exercises
    const batch = db.batch();
    
    generatedExercisesSnapshot.docs.forEach((exerciseDoc, index) => {
      const exerciseData = exerciseDoc.data();
      const routineExerciseRef = db.collection('routine_exercises').doc();
      
      batch.set(routineExerciseRef, {
        routineExerciseId: routineExerciseRef.id,
        routineId,
        exerciseId: exerciseData.exerciseId,
        orderIndex: index,
        sets: exerciseData.sets,
        reps: exerciseData.reps,
        restSeconds: exerciseData.restSeconds,
        notes: exerciseData.intensityCue || ''
      });
    });

    await batch.commit();

    return { routineId, ...routineData };
  } catch (error) {
    console.error('Error saving generated workout as routine:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to save routine');
  }
});

