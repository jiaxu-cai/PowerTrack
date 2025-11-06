

// fallback pic
export const UNAVAILABLE_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f2f2f2"/>
      <g fill="none" stroke="#cccccc" stroke-width="4">
        <rect x="60" y="40" width="280" height="200" rx="8"/>
        <circle cx="150" cy="110" r="28"/>
        <path d="M80 220 L160 160 L220 200 L280 150 L340 200"/>
      </g>
      <text x="200" y="270" font-family="Arial, sans-serif" font-size="16" fill="#999999" text-anchor="middle">Image Unavailable</text>
    </svg>`
  );

// Map muscle groups to folder names
function getMuscleGroupFolder(muscleGroups, exerciseId = null) {
  if (!muscleGroups || !Array.isArray(muscleGroups)) return null;
  
  const muscle = muscleGroups[0]?.toLowerCase();
  
  // Map primary muscle groups to folder names
  const muscleMap = {
    'back': 'Back',
    'chest': 'Chest',
    'legs': 'Leg',
    'leg': 'Leg',
    'glutes': 'Leg',
    'shoulders': 'Shoulder',
    'shoulder': 'Shoulder',
    'arms': 'Bicep', // Default to Bicep for arms, but we'll check for tricep-specific exercises
    'bicep': 'Bicep',
    'biceps': 'Bicep',
    'tricep': 'Tricep',
    'triceps': 'Tricep',
    'core': 'Core',
    'obliques': 'Core',
    'full_body': 'Cardio',
    'cardio': 'Cardio'
  };
  
  // Check for cardio-specific exercises first (even if they have other muscle groups)
  if (exerciseId) {
    const cardioExercises = ['jump_squats', 'box_jumps', 'burpees', 'mountain_climbers', 
                            'jumping_jacks', 'high_knees', 'battle_ropes', 'rowing_machine',
                            'kettlebell_swings', 'thrusters'];
    if (cardioExercises.includes(exerciseId)) {
      return 'Cardio';
    }
  }
  
  // Check for tricep-specific exercises first (even if they have 'arms' as muscle group)
  if (exerciseId) {
    const tricepExercises = ['tricep_dips', 'tricep_pushdown', 'overhead_tricep_extension', 
                             'skull_crushers', 'close_grip_bench', 'close_grip_bench_press'];
    if (tricepExercises.includes(exerciseId)) {
      return 'Tricep';
    }
  }
  
  // Check for specific muscle groups
  // Prioritize cardio if it's in the muscle groups
  if (muscleGroups.some(mg => mg.toLowerCase() === 'cardio' || mg.toLowerCase() === 'full_body')) {
    return 'Cardio';
  }
  
  for (const mg of muscleGroups) {
    const mgLower = mg.toLowerCase();
    if (muscleMap[mgLower]) {
      return muscleMap[mgLower];
    }
  }
  
  // Fallback to first muscle group
  return muscleMap[muscle] || null;
}

// Map exercise IDs to image file names (handles naming variations)
function getImageFileName(exerciseId) {
  if (!exerciseId) return null;
  
  // Map exercise IDs to image file names (handling variations)
  const imageNameMap = {
    // Back exercises
    'bent_over_row': 'bent-over_row',
    'pullup': 'pull_up',
    'chinup': 'chin_up',
    'dumbbell_row': 'dumbbell_row',
    'lat_pulldown': 'lat_pulldown',
    'seated_cable_row': 'seated_cable_row',
    't_bar_row': 't-bar_row',
    'inverted_row': 'inverted_row',
    
    // Chest exercises
    'pushup': 'push_up',
    'bench_press': 'bench_press',
    'incline_bench_press': 'incline_bench_press',
    'dumbbell_bench_press': 'dumbbell_bench_press',
    'dumbbell_flyes': 'dumbbell_flyes',
    'cable_crossover': 'cable_crossover',
    'dips_chest': 'chest_dips',
    
    // Leg exercises
    'squat': 'bodyweight_squat',
    'barbell_squat': 'barbell_squat',
    'front_squat': 'front_squat',
    'deadlift': 'deadlift',
    'romanian_deadlift': 'Romanian_Deadlift',
    'lunges': 'lunges',
    'walking_lunges': 'walking_lunges',
    'bulgarian_split_squat': 'Bulgarian_Split_Squat',
    'leg_press': 'leg_press',
    'leg_curl': 'leg_curl',
    'leg_extension': 'leg_extension',
    'calf_raises': 'calf_raises',
    
    // Shoulder exercises
    'overhead_press': 'overhead_press',
    'dumbbell_shoulder_press': 'dumbell_shoulder_press', 
    'arnold_press': 'arnold_press',
    'lateral_raises': 'lateral_raise',
    'front_raises': 'front_raise',
    'rear_delt_flyes': 'rear_delt_flyes',
    'face_pulls': 'face_pull',
    'upright_row': 'upright_row',
    
    // Bicep exercises
    'barbell_curl': 'barbell_curl',
    'dumbbell_curl': 'Dumbbell_Curl',
    'hammer_curl': 'hammer_curl',
    'preacher_curl': 'Preacher_Curl',
    
    // Tricep exercises
    'tricep_dips': 'tricep_dips',
    'close_grip_bench': 'close_grip_bench_press',
    'close_grip_bench_press': 'close_grip_bench_press',
    'tricep_pushdown': 'tricep_pushdown',
    'overhead_tricep_extension': 'overhead_tricep_extension',
    'skull_crushers': 'skullcrusher',
    
    // Core exercises
    'plank': 'plank',
    'side_plank': 'side_plank',
    'crunches': 'Crunches',
    'bicycle_crunches': 'bicycle_crunch',
    'russian_twists': 'Russian_Twists',
    'leg_raises': 'leg_raises',
    'hanging_leg_raises': 'Hanging_Leg_Raises',
    'ab_wheel_rollout': 'Ab_Wheel_Rollout',
    'dead_bug': 'Dead_Bug',
    
    // Cardio exercises
    'burpees': 'burpees',
    'mountain_climbers': 'mountain_climbers',
    'jumping_jacks': 'jumping_jacks',
    'high_knees': 'high_knees',
    'jump_squats': 'jump_squats',
    'box_jumps': 'box_jump',
    'battle_ropes': 'battling_ropes',
    'rowing_machine': 'rowing_machine',
    'kettlebell_swings': 'kettlebell_swings',
    'thrusters': 'thrusters'
  };
  
  return imageNameMap[exerciseId] || exerciseId;
}

export function resolveExerciseImage(exerciseId, exercise = null) {
  if (!exerciseId) return UNAVAILABLE_DATA_URI;
  
  // Determine muscle group folder
  const muscleGroups = exercise?.muscle || [];
  const folder = getMuscleGroupFolder(muscleGroups, exerciseId);
  
  if (!folder) {
    return UNAVAILABLE_DATA_URI;
  }
  
  // Get the image file name
  const imageName = getImageFileName(exerciseId);
  
  // Construct the path relative to the assets folder
  // Assets are in public/assets/ so they're served at /assets/
  const basePath = '/assets';
  
  // Special cases for different file extensions
  const extensionMap = {
    'overhead_press': 'png',  // Shoulder/overhead_press.png
    'high_knees': 'webp'      // Cardio/high_knees.webp
  };
  
  // Check if this exercise has a specific extension
  const ext = extensionMap[exerciseId] || 'jpg';
  
  const imagePath = `${basePath}/${folder}/${imageName}.${ext}`;
  return imagePath;
}

export default { resolveExerciseImage, UNAVAILABLE_DATA_URI };


