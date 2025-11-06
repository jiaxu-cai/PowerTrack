/**
 * Comprehensive static exercise database
 * This replaces the need for seeding exercises in Firestore
 */

const EXERCISES = [
 
  {
    exerciseId: 'pushup',
    name: 'Push-up',
    muscle: ['chest', 'shoulders', 'arms'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until your chest nearly touches the floor',
      'Push back up to the starting position',
      'Keep your core tight throughout the movement'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'bench_press',
    name: 'Bench Press',
    muscle: ['chest', 'shoulders', 'arms'],
    equipment: ['barbell', 'bench'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 10,
    description: 'The king of chest exercises, performed with a barbell on a bench.',
    instructions: [
      'Lie on a bench with feet flat on the floor',
      'Grip the barbell with hands slightly wider than shoulders',
      'Lower the bar to your chest with control',
      'Press the bar up explosively'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'incline_bench_press',
    name: 'Incline Bench Press',
    muscle: ['chest', 'shoulders', 'arms'],
    equipment: ['barbell', 'bench'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 9,
    description: 'Targets the upper chest with an inclined bench angle.',
    instructions: [
      'Set bench to 30-45 degree angle',
      'Lie back with feet flat on floor',
      'Lower bar to upper chest',
      'Press up explosively'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    muscle: ['chest', 'shoulders', 'arms'],
    equipment: ['dumbbells', 'bench'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 9,
    description: 'Bench press with dumbbells for greater range of motion.',
    instructions: [
      'Lie on bench holding dumbbells at chest level',
      'Press weights up until arms are extended',
      'Lower with control',
      'Keep elbows at 45-degree angle'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'dumbbell_flyes',
    name: 'Dumbbell Flyes',
    muscle: ['chest'],
    equipment: ['dumbbells', 'bench'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 7,
    description: 'Isolation exercise that targets the chest muscles with a wide range of motion.',
    instructions: [
      'Lie on a bench holding dumbbells above your chest',
      'Lower the weights in a wide arc until you feel a stretch',
      'Bring the weights back together above your chest',
      'Keep a slight bend in your elbows throughout'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'cable_crossover',
    name: 'Cable Crossover',
    muscle: ['chest'],
    equipment: ['cable_machine'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Cable exercise for chest isolation and definition.',
    instructions: [
      'Stand between cable towers with handles at shoulder height',
      'Step forward with slight bend in elbows',
      'Bring handles together in front of chest',
      'Return to starting position with control'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'dips_chest',
    name: 'Chest Dips',
    muscle: ['chest', 'arms', 'shoulders'],
    equipment: ['dip_bars'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Bodyweight exercise emphasizing chest with forward lean.',
    instructions: [
      'Grip dip bars and lift body up',
      'Lean forward slightly',
      'Lower body until shoulders are below elbows',
      'Press back up'
    ],
    difficulty: 'advanced'
  },

  
  {
    exerciseId: 'pullup',
    name: 'Pull-up',
    muscle: ['back', 'arms'],
    equipment: ['pullup_bar'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'Bodyweight exercise that targets the back and biceps.',
    instructions: [
      'Hang from a pull-up bar with hands shoulder-width apart',
      'Pull your body up until your chin clears the bar',
      'Lower yourself with control',
      'Keep your core engaged throughout'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'chinup',
    name: 'Chin-up',
    muscle: ['back', 'arms'],
    equipment: ['pullup_bar'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Underhand grip pull-up emphasizing biceps.',
    instructions: [
      'Hang from bar with underhand grip',
      'Pull up until chin clears bar',
      'Lower with control',
      'Keep core tight'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'bent_over_row',
    name: 'Bent-Over Row',
    muscle: ['back', 'arms'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 8,
    description: 'Compound exercise that targets the back muscles.',
    instructions: [
      'Stand with feet hip-width apart, holding a barbell',
      'Hinge at the hips and lean forward slightly',
      'Pull the bar to your lower chest',
      'Squeeze your shoulder blades together'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'dumbbell_row',
    name: 'Dumbbell Row',
    muscle: ['back', 'arms'],
    equipment: ['dumbbells', 'bench'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 8,
    description: 'Unilateral back exercise for muscle balance.',
    instructions: [
      'Place one hand and knee on bench',
      'Hold dumbbell in other hand',
      'Pull dumbbell to hip',
      'Squeeze shoulder blade at top'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'lat_pulldown',
    name: 'Lat Pulldown',
    muscle: ['back', 'arms'],
    equipment: ['cable_machine'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 7,
    description: 'Cable exercise targeting the latissimus dorsi.',
    instructions: [
      'Sit at lat pulldown machine',
      'Grip bar wider than shoulder width',
      'Pull bar down to upper chest',
      'Control the return'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'seated_cable_row',
    name: 'Seated Cable Row',
    muscle: ['back', 'arms'],
    equipment: ['cable_machine'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 7,
    description: 'Seated rowing motion targeting mid-back.',
    instructions: [
      'Sit at cable row station',
      'Grip handle with both hands',
      'Pull handle to torso',
      'Squeeze shoulder blades together'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 't_bar_row',
    name: 'T-Bar Row',
    muscle: ['back', 'arms'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 8,
    description: 'Compound rowing exercise for back thickness.',
    instructions: [
      'Straddle barbell with weight on one end',
      'Bend at hips and grip bar',
      'Pull bar to chest',
      'Squeeze back muscles'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'inverted_row',
    name: 'Inverted Row',
    muscle: ['back', 'arms'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Bodyweight rowing exercise using a bar.',
    instructions: [
      'Lie under a bar set at waist height',
      'Grip bar with overhand grip',
      'Pull chest to bar',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },

  
  {
    exerciseId: 'squat',
    name: 'Bodyweight Squat',
    muscle: ['legs', 'glutes', 'core'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 10,
    description: 'Fundamental movement that targets the entire lower body.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Go down until your thighs are parallel to the floor',
      'Drive through your heels to return to standing'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'barbell_squat',
    name: 'Barbell Squat',
    muscle: ['legs', 'glutes', 'core'],
    equipment: ['barbell', 'squat_rack'],
    intensity: 'high',
    timePerSetSec: 120,
    usefulnessScore: 10,
    description: 'The king of leg exercises with barbell.',
    instructions: [
      'Position bar on upper back',
      'Feet shoulder-width apart',
      'Squat down keeping chest up',
      'Drive through heels to stand'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'front_squat',
    name: 'Front Squat',
    muscle: ['legs', 'glutes', 'core'],
    equipment: ['barbell', 'squat_rack'],
    intensity: 'high',
    timePerSetSec: 120,
    usefulnessScore: 9,
    description: 'Squat variation with bar in front position.',
    instructions: [
      'Rest bar on front of shoulders',
      'Keep elbows high',
      'Squat down maintaining upright torso',
      'Drive up through heels'
    ],
    difficulty: 'advanced'
  },
  {
    exerciseId: 'deadlift',
    name: 'Deadlift',
    muscle: ['legs', 'back', 'glutes', 'core'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 120,
    usefulnessScore: 10,
    description: 'The king of all exercises, targeting the entire posterior chain.',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend down and grip the bar with hands just outside your legs',
      'Keep your back straight and chest up',
      'Drive through your heels and hips to stand up'
    ],
    difficulty: 'advanced'
  },
  {
    exerciseId: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    muscle: ['legs', 'glutes', 'back'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 9,
    description: 'Deadlift variation emphasizing hamstrings.',
    instructions: [
      'Hold bar at hip level',
      'Hinge at hips keeping legs straight',
      'Lower bar to mid-shin',
      'Return to standing'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'lunges',
    name: 'Lunges',
    muscle: ['legs', 'glutes'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 45,
    usefulnessScore: 8,
    description: 'Unilateral leg exercise that improves balance and strength.',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg and lower your body',
      'Both knees should be at 90-degree angles',
      'Push back to the starting position'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'walking_lunges',
    name: 'Walking Lunges',
    muscle: ['legs', 'glutes'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Dynamic lunge variation moving forward.',
    instructions: [
      'Step forward into lunge',
      'Push off front foot to step forward',
      'Continue alternating legs',
      'Maintain upright posture'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    muscle: ['legs', 'glutes'],
    equipment: ['bodyweight', 'bench'],
    intensity: 'high',
    timePerSetSec: 75,
    usefulnessScore: 9,
    description: 'Single-leg squat with rear foot elevated.',
    instructions: [
      'Place rear foot on bench behind you',
      'Lower down into single-leg squat',
      'Keep front knee aligned with toes',
      'Drive through front heel to stand'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'leg_press',
    name: 'Leg Press',
    muscle: ['legs', 'glutes'],
    equipment: ['leg_press_machine'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 7,
    description: 'Machine-based leg exercise.',
    instructions: [
      'Sit in leg press machine',
      'Place feet shoulder-width on platform',
      'Lower weight with control',
      'Press through heels to extend'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'leg_curl',
    name: 'Leg Curl',
    muscle: ['legs'],
    equipment: ['leg_curl_machine'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 6,
    description: 'Isolation exercise for hamstrings.',
    instructions: [
      'Lie face down on leg curl machine',
      'Curl legs toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'leg_extension',
    name: 'Leg Extension',
    muscle: ['legs'],
    equipment: ['leg_extension_machine'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 6,
    description: 'Isolation exercise for quadriceps.',
    instructions: [
      'Sit in leg extension machine',
      'Extend legs to straighten',
      'Squeeze quads at top',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'calf_raises',
    name: 'Calf Raises',
    muscle: ['legs'],
    equipment: ['bodyweight'],
    intensity: 'low',
    timePerSetSec: 45,
    usefulnessScore: 6,
    description: 'Isolation exercise for calf muscles.',
    instructions: [
      'Stand with feet hip-width apart',
      'Rise up onto toes',
      'Hold at top',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },

  // ==================== SHOULDER EXERCISES ====================
  {
    exerciseId: 'overhead_press',
    name: 'Overhead Press',
    muscle: ['shoulders', 'arms', 'core'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 9,
    description: 'Compound exercise that targets the shoulders and triceps.',
    instructions: [
      'Stand with feet hip-width apart, holding a barbell at shoulder level',
      'Press the bar straight up overhead',
      'Lower the bar with control to shoulder level',
      'Keep your core tight throughout the movement'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    muscle: ['shoulders', 'arms'],
    equipment: ['dumbbells'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 8,
    description: 'Shoulder press with dumbbells for greater range.',
    instructions: [
      'Hold dumbbells at shoulder height',
      'Press weights overhead',
      'Lower with control',
      'Keep core engaged'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'arnold_press',
    name: 'Arnold Press',
    muscle: ['shoulders', 'arms'],
    equipment: ['dumbbells'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 7,
    description: 'Shoulder press with rotation for complete deltoid activation.',
    instructions: [
      'Start with palms facing you at shoulder level',
      'Rotate and press overhead',
      'Reverse motion on the way down',
      'Control the rotation'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'lateral_raises',
    name: 'Lateral Raises',
    muscle: ['shoulders'],
    equipment: ['dumbbells'],
    intensity: 'low',
    timePerSetSec: 45,
    usefulnessScore: 6,
    description: 'Isolation exercise for the shoulder muscles.',
    instructions: [
      'Stand holding dumbbells at your sides',
      'Raise your arms out to the sides until parallel to the floor',
      'Lower with control',
      'Keep a slight bend in your elbows'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'front_raises',
    name: 'Front Raises',
    muscle: ['shoulders'],
    equipment: ['dumbbells'],
    intensity: 'low',
    timePerSetSec: 45,
    usefulnessScore: 5,
    description: 'Isolation exercise for front deltoids.',
    instructions: [
      'Hold dumbbells in front of thighs',
      'Raise arms forward to shoulder height',
      'Lower with control',
      'Keep slight bend in elbows'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'rear_delt_flyes',
    name: 'Rear Delt Flyes',
    muscle: ['shoulders', 'back'],
    equipment: ['dumbbells'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 6,
    description: 'Isolation exercise for rear deltoids.',
    instructions: [
      'Bend forward at hips',
      'Hold dumbbells hanging down',
      'Raise arms out to sides',
      'Squeeze shoulder blades'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'face_pulls',
    name: 'Face Pulls',
    muscle: ['shoulders', 'back'],
    equipment: ['cable_machine'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Cable exercise for rear delts and upper back.',
    instructions: [
      'Set cable at face height',
      'Pull rope toward face',
      'Separate hands at end',
      'Squeeze rear delts'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'upright_row',
    name: 'Upright Row',
    muscle: ['shoulders', 'traps'],
    equipment: ['barbell'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 6,
    description: 'Compound exercise for shoulders and traps.',
    instructions: [
      'Hold bar with narrow grip',
      'Pull bar up to chin',
      'Keep elbows high',
      'Lower with control'
    ],
    difficulty: 'intermediate'
  },

  
  {
    exerciseId: 'barbell_curl',
    name: 'Barbell Curl',
    muscle: ['arms'],
    equipment: ['barbell'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Classic bicep exercise with barbell.',
    instructions: [
      'Stand holding barbell at thighs',
      'Curl bar to shoulders',
      'Squeeze biceps at top',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'dumbbell_curl',
    name: 'Dumbbell Curl',
    muscle: ['arms'],
    equipment: ['dumbbells'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Bicep curl with dumbbells for independent arm work.',
    instructions: [
      'Hold dumbbells at sides',
      'Curl weights to shoulders',
      'Alternate or both arms',
      'Control the movement'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'hammer_curl',
    name: 'Hammer Curl',
    muscle: ['arms', 'forearms'],
    equipment: ['dumbbells'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Neutral grip curl targeting biceps and forearms.',
    instructions: [
      'Hold dumbbells with palms facing each other',
      'Curl without rotating wrists',
      'Squeeze at top',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'preacher_curl',
    name: 'Preacher Curl',
    muscle: ['arms'],
    equipment: ['dumbbells', 'bench'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 6,
    description: 'Isolated bicep curl using preacher bench.',
    instructions: [
      'Rest arms on preacher bench',
      'Curl weight up',
      'Squeeze biceps',
      'Lower slowly'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'tricep_dips',
    name: 'Tricep Dips',
    muscle: ['arms', 'chest'],
    equipment: ['dip_bars'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Bodyweight exercise for triceps.',
    instructions: [
      'Grip dip bars with body upright',
      'Lower by bending elbows',
      'Keep elbows close to body',
      'Press back up'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'close_grip_bench',
    name: 'Close-Grip Bench Press',
    muscle: ['arms', 'chest'],
    equipment: ['barbell', 'bench'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 8,
    description: 'Bench press variation emphasizing triceps.',
    instructions: [
      'Lie on bench with narrow grip',
      'Lower bar to chest',
      'Keep elbows tucked',
      'Press up explosively'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'tricep_pushdown',
    name: 'Tricep Pushdown',
    muscle: ['arms'],
    equipment: ['cable_machine'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 6,
    description: 'Cable isolation exercise for triceps.',
    instructions: [
      'Stand at cable machine',
      'Push handle down to full extension',
      'Squeeze triceps',
      'Return with control'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'overhead_tricep_extension',
    name: 'Overhead Tricep Extension',
    muscle: ['arms'],
    equipment: ['dumbbells'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Overhead tricep isolation exercise.',
    instructions: [
      'Hold dumbbell overhead with both hands',
      'Lower behind head',
      'Keep elbows close to head',
      'Extend back up'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'skull_crushers',
    name: 'Skull Crushers',
    muscle: ['arms'],
    equipment: ['barbell', 'bench'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 7,
    description: 'Lying tricep extension exercise.',
    instructions: [
      'Lie on bench holding bar overhead',
      'Lower bar to forehead',
      'Keep upper arms stationary',
      'Extend back up'
    ],
    difficulty: 'intermediate'
  },

  
  {
    exerciseId: 'plank',
    name: 'Plank',
    muscle: ['core', 'shoulders'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Isometric exercise that strengthens the entire core.',
    instructions: [
      'Start in a push-up position',
      'Lower to your forearms',
      'Keep your body in a straight line',
      'Hold the position while breathing normally'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'side_plank',
    name: 'Side Plank',
    muscle: ['core', 'obliques'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Isometric exercise for obliques and core stability.',
    instructions: [
      'Lie on side supported by forearm',
      'Stack feet and lift hips',
      'Keep body in straight line',
      'Hold position'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'crunches',
    name: 'Crunches',
    muscle: ['core'],
    equipment: ['bodyweight'],
    intensity: 'low',
    timePerSetSec: 45,
    usefulnessScore: 6,
    description: 'Classic abdominal exercise.',
    instructions: [
      'Lie on back with knees bent',
      'Place hands behind head',
      'Curl upper body up',
      'Lower with control'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    muscle: ['core', 'obliques'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 45,
    usefulnessScore: 7,
    description: 'Dynamic core exercise targeting abs and obliques.',
    instructions: [
      'Lie on back with hands behind head',
      'Bring opposite elbow to knee',
      'Alternate sides in pedaling motion',
      'Keep core engaged'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'russian_twists',
    name: 'Russian Twists',
    muscle: ['core', 'obliques'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 45,
    usefulnessScore: 7,
    description: 'Dynamic core exercise that targets the obliques.',
    instructions: [
      'Sit on the floor with knees bent',
      'Lean back slightly and lift your feet off the ground',
      'Rotate your torso from side to side',
      'Keep your core engaged throughout'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'leg_raises',
    name: 'Leg Raises',
    muscle: ['core'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Lower abdominal exercise.',
    instructions: [
      'Lie flat on back',
      'Keep legs straight',
      'Raise legs to 90 degrees',
      'Lower with control'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'hanging_leg_raises',
    name: 'Hanging Leg Raises',
    muscle: ['core'],
    equipment: ['pullup_bar'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'Advanced core exercise hanging from bar.',
    instructions: [
      'Hang from pull-up bar',
      'Keep legs straight or bent',
      'Raise legs to 90 degrees',
      'Lower with control'
    ],
    difficulty: 'advanced'
  },
  {
    exerciseId: 'ab_wheel_rollout',
    name: 'Ab Wheel Rollout',
    muscle: ['core', 'shoulders'],
    equipment: ['ab_wheel'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'Advanced core exercise with ab wheel.',
    instructions: [
      'Kneel with ab wheel in hands',
      'Roll forward extending body',
      'Keep core tight',
      'Pull back to start'
    ],
    difficulty: 'advanced'
  },
  {
    exerciseId: 'dead_bug',
    name: 'Dead Bug',
    muscle: ['core'],
    equipment: ['bodyweight'],
    intensity: 'low',
    timePerSetSec: 60,
    usefulnessScore: 7,
    description: 'Core stability exercise.',
    instructions: [
      'Lie on back with arms up',
      'Extend opposite arm and leg',
      'Alternate sides',
      'Keep lower back pressed down'
    ],
    difficulty: 'beginner'
  },

 
  {
    exerciseId: 'burpees',
    name: 'Burpees',
    muscle: ['full_body', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'high',
    timePerSetSec: 30,
    usefulnessScore: 9,
    description: 'High-intensity full-body exercise that combines strength and cardio.',
    instructions: [
      'Start in a standing position',
      'Drop into a squat and place hands on the floor',
      'Jump feet back into a plank position',
      'Do a push-up, then jump feet back to squat',
      'Jump up with arms overhead'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'mountain_climbers',
    name: 'Mountain Climbers',
    muscle: ['full_body', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'high',
    timePerSetSec: 30,
    usefulnessScore: 8,
    description: 'Dynamic cardio exercise that targets the core and legs.',
    instructions: [
      'Start in a plank position',
      'Bring one knee toward your chest',
      'Quickly switch legs',
      'Continue alternating at a fast pace',
      'Keep your core tight throughout'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'jumping_jacks',
    name: 'Jumping Jacks',
    muscle: ['full_body', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'low',
    timePerSetSec: 30,
    usefulnessScore: 6,
    description: 'Classic cardio warm-up exercise.',
    instructions: [
      'Stand with feet together',
      'Jump feet apart while raising arms',
      'Jump back to start',
      'Maintain steady rhythm'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'high_knees',
    name: 'High Knees',
    muscle: ['full_body', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'high',
    timePerSetSec: 30,
    usefulnessScore: 7,
    description: 'Cardio exercise with running motion in place.',
    instructions: [
      'Stand with feet hip-width apart',
      'Run in place lifting knees high',
      'Pump arms vigorously',
      'Maintain fast pace'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'jump_squats',
    name: 'Jump Squats',
    muscle: ['legs', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'high',
    timePerSetSec: 45,
    usefulnessScore: 8,
    description: 'Explosive squat variation.',
    instructions: [
      'Perform a squat',
      'Explode upward into jump',
      'Land softly',
      'Immediately go into next rep'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'box_jumps',
    name: 'Box Jumps',
    muscle: ['legs', 'cardio'],
    equipment: ['box'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Plyometric exercise jumping onto platform.',
    instructions: [
      'Stand facing box or platform',
      'Jump up onto box',
      'Land with both feet',
      'Step down and repeat'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'battle_ropes',
    name: 'Battle Ropes',
    muscle: ['full_body', 'cardio'],
    equipment: ['battle_ropes'],
    intensity: 'high',
    timePerSetSec: 30,
    usefulnessScore: 8,
    description: 'Full-body cardio with heavy ropes.',
    instructions: [
      'Hold ends of battle ropes',
      'Create waves alternating arms',
      'Maintain steady rhythm',
      'Keep core engaged'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'rowing_machine',
    name: 'Rowing Machine',
    muscle: ['full_body', 'cardio'],
    equipment: ['rowing_machine'],
    intensity: 'medium',
    timePerSetSec: 120,
    usefulnessScore: 9,
    description: 'Full-body cardio using rowing machine.',
    instructions: [
      'Sit on rowing machine',
      'Push with legs first',
      'Pull handle to chest',
      'Reverse motion smoothly'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'kettlebell_swings',
    name: 'Kettlebell Swings',
    muscle: ['full_body', 'cardio'],
    equipment: ['kettlebell'],
    intensity: 'high',
    timePerSetSec: 45,
    usefulnessScore: 9,
    description: 'Dynamic full-body exercise with kettlebell.',
    instructions: [
      'Hold kettlebell with both hands',
      'Hinge at hips and swing back',
      'Drive hips forward to swing up',
      'Control the swing'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'thrusters',
    name: 'Thrusters',
    muscle: ['full_body', 'cardio'],
    equipment: ['dumbbells'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'Combination of squat and overhead press.',
    instructions: [
      'Hold dumbbells at shoulders',
      'Perform a squat',
      'Drive up and press overhead',
      'Lower and repeat'
    ],
    difficulty: 'intermediate'
  }
];


function getAllExercises() {
  return EXERCISES;
}


function getExerciseById(exerciseId) {
  return EXERCISES.find(ex => ex.exerciseId === exerciseId);
}


function filterExercises({ intensity, muscleGroups, equipment, difficulty }) {
  return EXERCISES.filter(exercise => {
    // Filter by intensity
    if (intensity && exercise.intensity !== intensity) {
      return false;
    }

    // Filter by muscle groups
    if (muscleGroups && muscleGroups.length > 0) {
      const hasMatchingMuscle = muscleGroups.some(muscle => {
        // Handle biceps and triceps specially
        if (muscle === 'biceps') {
          const exerciseIdLower = exercise.exerciseId?.toLowerCase() || '';
          const nameLower = exercise.name?.toLowerCase() || '';
          const hasBicepInName = exerciseIdLower.includes('bicep') || exerciseIdLower.includes('curl') || 
                                 nameLower.includes('bicep') || nameLower.includes('curl');
          const hasArmsInMuscle = exercise.muscle.includes('arms');
          const isTricepExercise = exerciseIdLower.includes('tricep') || nameLower.includes('tricep') || 
                                  exerciseIdLower.includes('dip') || nameLower.includes('dip');
          return hasBicepInName || (hasArmsInMuscle && !isTricepExercise);
        } else if (muscle === 'triceps') {
          const exerciseIdLower = exercise.exerciseId?.toLowerCase() || '';
          const nameLower = exercise.name?.toLowerCase() || '';
          const hasTricepInName = exerciseIdLower.includes('tricep') || exerciseIdLower.includes('dip') ||
                                  nameLower.includes('tricep') || nameLower.includes('dip');
          const hasArmsInMuscle = exercise.muscle.includes('arms');
          const isBicepExercise = exerciseIdLower.includes('bicep') || exerciseIdLower.includes('curl') ||
                                 nameLower.includes('bicep') || nameLower.includes('curl');
          return hasTricepInName || (hasArmsInMuscle && !isBicepExercise);
        } else {
          // Standard muscle group matching
          return exercise.muscle.some(exMuscle => exMuscle.includes(muscle));
        }
      });
      if (!hasMatchingMuscle) return false;
    }

    // Filter by equipment
    if (equipment && equipment.length > 0) {
      const hasMatchingEquipment = equipment.some(eq =>
        exercise.equipment.some(exEq => exEq.includes(eq))
      );
      if (!hasMatchingEquipment) return false;
    }

    // Filter by difficulty
    if (difficulty && exercise.difficulty !== difficulty) {
      return false;
    }

    return true;
  });
}

module.exports = {
  EXERCISES,
  getAllExercises,
  getExerciseById,
  filterExercises
};

