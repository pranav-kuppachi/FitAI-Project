const WORKOUT_DATABASE = {
    "performance": {
        "lightly_active": {
            strategy: "Intense Strength (Low Vol / High Intensity)",
            split: {
                "Monday": { name: "Power: Lower", exercises: [{e: "Squats", s: "5x5"}, {e: "RDL", s: "3x8"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Power: Upper", exercises: [{e: "Bench Press", s: "5x5"}, {e: "Rows", s: "5x5"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Neural Recovery", exercises: [] },
                "Thursday": { name: "Power: Chain", exercises: [{e: "Deadlift", s: "1x5"}, {e: "Weighted Pullups", s: "3x5"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Power: Accessory", exercises: [{e: "OHP", s: "5x5"}, {e: "Lunges", s: "3x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "moderate": {
            strategy: "Hybrid Athleticism (Strength + Hypertrophy)",
            split: {
                "Monday": { name: "Push Day", exercises: [{e: "Incline Bench", s: "4x8"}, {e: "Shoulder Press", s: "3x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Pull Day", exercises: [{e: "Pullups", s: "4x8"}, {e: "Barbell Rows", s: "3x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Leg Day", exercises: [{e: "Squats", s: "4x8"}, {e: "Leg Press", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Upper Focus", exercises: [{e: "Dips", s: "3x12"}, {e: "Face Pulls", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Lower Focus", exercises: [{e: "Deadlifts", s: "3x5"}, {e: "Calf Raises", s: "4x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "active": {
            strategy: "Consistent Performance (High Volume)",
            split: {
                "Monday": { name: "Chest/Back", exercises: [{e: "Bench Press", s: "4x10"}, {e: "Rows", s: "4x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Legs Power", exercises: [{e: "Squats", s: "5x5"}, {e: "Leg Curls", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Shoulders/Arms", exercises: [{e: "OHP", s: "4x10"}, {e: "Curls", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Back/Chest", exercises: [{e: "Lat Pulldowns", s: "4x12"}, {e: "Incline DB", s: "4x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Legs Hypertrophy", exercises: [{e: "Hack Squat", s: "3x12"}, {e: "Extensions", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        }
    },
    "lose_weight": {
        "lightly_active": {
            strategy: "High Intensity (EPOC Effect)",
            split: {
                "Monday": { name: "HIIT: Cardio", exercises: [{e: "Burpees", s: "45s Work"}, {e: "Mountain Climbers", s: "45s"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Full Body Burn", exercises: [{e: "Goblet Squats", s: "4x20"}, {e: "Pushups", s: "4xAMRAP"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "HIIT: Explosive", exercises: [{e: "Jump Squats", s: "4x15"}, {e: "Sprints", s: "10x30s"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Metabolic Circuit", exercises: [{e: "Kettlebell Swings", s: "5x20"}, {e: "Plank Jacks", s: "1m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Walk", s: "30m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "moderate": {
            strategy: "Steady State + Resistance",
            split: {
                "Monday": { name: "Upper + 20m Cardio", exercises: [{e: "Presses", s: "3x12"}, {e: "Rows", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Lower + 20m Cardio", exercises: [{e: "Lunges", s: "3x15"}, {e: "RDL", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Full Body Circuit", exercises: [{e: "Thrusters", s: "4x12"}, {e: "Pullups", s: "4x8"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "HIIT Finisher", exercises: [{e: "Battle Ropes", s: "5m"}, {e: "Jump Rope", s: "10m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Outdoor Activity", exercises: [{e: "Hiking/Cycling", s: "1h"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "active": {
            strategy: "Endurance & Conditioning",
            split: {
                "Monday": { name: "Long Distance", exercises: [{e: "Running", s: "45m"}, {e: "Core", s: "10m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Strength Circuit", exercises: [{e: "Squats", s: "4x15"}, {e: "Pushups", s: "4x20"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Interval Sprints", exercises: [{e: "Sprints", s: "15x100m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Mobility & Abs", exercises: [{e: "Yoga", s: "30m"}, {e: "Planks", s: "5x1m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Swimming/Rowing", exercises: [{e: "Cardio Focus", s: "40m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        }
    },
    "gain_muscle": {
        "lightly_active": {
            strategy: "Heavy Compounds (Mass Focus)",
            split: {
                "Monday": { name: "Squat/Bench", exercises: [{e: "Squats", s: "3x8"}, {e: "Bench", s: "3x8"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Deadlift/OHP", exercises: [{e: "Deadlift", s: "3x5"}, {e: "OHP", s: "3x8"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Rows/Dips", exercises: [{e: "Rows", s: "3x8"}, {e: "Dips", s: "3x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "moderate": {
            strategy: "Standard PPL (Push Pull Legs)",
            split: {
                "Monday": { name: "Push", exercises: [{e: "Bench", s: "3x10"}, {e: "Lateral Raise", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Pull", exercises: [{e: "Rows", s: "3x10"}, {e: "Curls", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Legs", exercises: [{e: "Squats", s: "3x10"}, {e: "Leg Curls", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Push", exercises: [{e: "OHP", s: "3x10"}, {e: "Triceps", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Pull", exercises: [{e: "Pullups", s: "3xAMRAP"}, {e: "Facepulls", s: "3x20"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "active": {
            strategy: "Body Part Split (Max Hypertrophy)",
            split: {
                "Monday": { name: "Chest", exercises: [{e: "Flat Bench", s: "4x10"}, {e: "Incline Flyes", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Back", exercises: [{e: "Deadlifts", s: "3x8"}, {e: "Pulldowns", s: "4x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Shoulders", exercises: [{e: "OHP", s: "3x10"}, {e: "Upright Rows", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Legs", exercises: [{e: "Squats", s: "4x10"}, {e: "Extensions", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Arms", exercises: [{e: "Curls", s: "4x12"}, {e: "Pushdowns", s: "4x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        }
    },
    "feel_better": {
        "lightly_active": {
            strategy: "Stretching & Yoga Flow",
            split: {
                "Monday": { name: "Hip Mobility", exercises: [{e: "90/90 Stretch", s: "2m"}, {e: "Pigeon Pose", s: "2m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Spine Health", exercises: [{e: "Cat-Cow", s: "20 reps"}, {e: "Childs Pose", s: "3m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Upper Mobility", exercises: [{e: "Wall Slides", s: "3x15"}, {e: "Thoracic Twist", s: "3x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Yoga Flow", exercises: [{e: "Sun Salutation", s: "5 Rounds"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Rest", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "moderate": {
            strategy: "Pilates & Core Longevity",
            split: {
                "Monday": { name: "Core Control", exercises: [{e: "Deadbug", s: "3x12"}, {e: "Bird-Dog", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Lower Strength", exercises: [{e: "Glute Bridges", s: "3x20"}, {e: "Bodyweight Squats", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Upper Strength", exercises: [{e: "Pushups (Knees)", s: "3x10"}, {e: "Y-Raises", s: "3x15"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Balance/Stability", exercises: [{e: "Single Leg Stand", s: "1m"}, {e: "Plank", s: "3x45s"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Swimming/Cycling", exercises: [{e: "Active Recovery", s: "30m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Meditation", exercises: [{e: "Deep Breathing", s: "10m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        },
        "active": {
            strategy: "Functional Movement & Calisthenics",
            split: {
                "Monday": { name: "Pullups/Dips", exercises: [{e: "Pullups", s: "3x8"}, {e: "Dips", s: "3x10"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Tuesday": { name: "Leg Skill", exercises: [{e: "Pistol Squat Prep", s: "3x8"}, {e: "Lunges", s: "3x20"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Wednesday": { name: "Core Power", exercises: [{e: "Hanging Leg Raise", s: "3x10"}, {e: "L-Sit Hold", s: "3x15s"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Thursday": { name: "Push Power", exercises: [{e: "Archer Pushups", s: "3x10"}, {e: "Handstand Prep", s: "5m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Friday": { name: "Full Body Flow", exercises: [{e: "Muscle Up Prep", s: "3x5"}, {e: "Hindu Pushups", s: "3x12"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Saturday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] },
                "Sunday": { name: "Active Recovery", exercises: [{e: "Light Walk", s: "20m"}, {e: "Core Twist", s: "3x20"}, {e: "Plank", s: "60s"}, {e: "Stretching", s: "5m"}] }
            }
        }
    }
};

/*
 Call this from dashboard.js
 */

function getTodayProtocol(userProfile) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    
    const goal = (userProfile.goal || "performance").toLowerCase().replace(" ", "_");
    const level = (userProfile.activityLevel || "moderate").toLowerCase().replace(" ", "_");

    // Safety check for undefined goals/levels
    const plan = (WORKOUT_DATABASE[goal] && WORKOUT_DATABASE[goal][level]) 
                 ? WORKOUT_DATABASE[goal][level] 
                 : WORKOUT_DATABASE["performance"]["moderate"];

    const todayData = plan.split[today];

    return {
        strategy: plan.strategy,
        workoutName: todayData.name,
        exercises: todayData.exercises,
        isRest: todayData.exercises.length === 0
    };
}
// --- DOM MANIPULATION & LOGIC ---
const electronIpc = require('electron').ipcRenderer;

let currentProfile = null;
let sessionTimerInterval = null;
let restTimerInterval = null;

async function initWorkoutPage() {
    const currentWorkoutId = localStorage.getItem('currentUserId');
    if (!currentWorkoutId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const data = await electronIpc.invoke('get-user-data', currentWorkoutId);
        currentProfile = data.userProfile;

        // Avatar
        const avatarEl = document.querySelector('.user-avatar-circle');
        if (avatarEl && currentProfile?.name) {
            avatarEl.innerText = currentProfile.name.charAt(0).toUpperCase();
        }

        // Goal
        document.getElementById('user-goal-text').innerText = `Goal: ${currentProfile?.goal || "Performance"}`;

        renderWorkout();
        startSessionTimer();

    } catch (err) {
        console.error("Init Error:", err);
    }
}

function renderWorkout() {
    const protocol = getTodayProtocol(currentProfile);
    const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][new Date().getDay()];
    
    document.getElementById('workout-day-title').innerText = `${dayName}: ${protocol.workoutName.toUpperCase()}`;

    const listContainer = document.getElementById('exercise-list');
    listContainer.innerHTML = '';

    if (protocol.exercises.length === 0) {
        listContainer.innerHTML = '<div class="glass-box" style="padding: 2rem; text-align: center;">REST DAY. RECOVER WELL!</div>';
        return;
    }

    protocol.exercises.forEach((ex, idx) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <div class="ex-info">
                <h3>${ex.e}</h3>
                <span>${ex.s}</span>
            </div>
            <label class="custom-checkbox">
                <input type="checkbox" id="ex-${idx}">
                <div class="checkmark"></div>
            </label>
        `;
        listContainer.appendChild(card);

        // Listen for Checkbox check
        const cb = card.querySelector('input');
        cb.addEventListener('change', (e) => {
            if (e.target.checked) {
                card.classList.add('completed');
                startRestTimer();
            } else {
                card.classList.remove('completed');
            }
        });
    });
}

function startSessionTimer() {
    const timerDisplay = document.getElementById('session-timer');
    let seconds = 0;
    sessionTimerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${m}:${s}`;
    }, 1000);
}

function startRestTimer() {
    const container = document.getElementById('rest-timer-container');
    const countdownEl = document.getElementById('rest-countdown');
    const circle = document.getElementById('rest-ring__circle');
    
    clearInterval(restTimerInterval);
    container.classList.remove('hidden');
    
    let timeLeft = 60;
    countdownEl.innerText = timeLeft;
    circle.style.strokeDashoffset = 0;
    circle.style.transition = 'stroke-dashoffset 1s linear';
    
    restTimerInterval = setInterval(() => {
        timeLeft--;
        countdownEl.innerText = timeLeft;
        
        // Calculate offset (314 is circumference)
        const offset = 314 - (timeLeft / 60) * 314;
        circle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(restTimerInterval);
            container.classList.add('hidden');
        }
    }, 1000);
}

// Start sequence when page loads
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initWorkoutPage);
}
