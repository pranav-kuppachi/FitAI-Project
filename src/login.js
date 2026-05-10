// Import the ipcRenderer module from Electron to communicate with the main desktop app process
const { ipcRenderer } = require('electron');

// Function to load default/seed data into local storage when the app first opens
async function initializeData() {
    try {
        // If the 'fitai_auth' database doesn't exist yet, it means this is the first run
        if (!localStorage.getItem('fitai_auth')) {
            // Fetch default data from local JSON files and save them to the browser's local storage
            const authRes = await fetch('../data/auth.json');
            localStorage.setItem('fitai_auth', JSON.stringify(await authRes.json()));
            
            const profRes = await fetch('../data/profiles.json');
            localStorage.setItem('fitai_profiles', JSON.stringify(await profRes.json()));
            
            const actRes = await fetch('../data/activity.json');
            localStorage.setItem('fitai_activity', JSON.stringify(await actRes.json()));
        }
    } catch (e) { 
        // If files are missing, don't crash, just use whatever is in local storage
        console.warn("Seed data skip: Using local persistence."); 
    }
}

// Function to switch the form view between "Login" and "Signup" modes
function toggleAuth() {
    // Grab HTML elements by their IDs so we can change them dynamically
    const signupFields = document.getElementById('signupFields');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleAuthLink = document.getElementById('toggleAuth');

    // If signup fields are currently visible, switch to LOGIN mode
    if (signupFields.style.display !== 'none') {
        signupFields.style.display = 'none'; // Hide biometric fields
        // Update all text on the page to reflect Login state
        authTitle.innerText = "Welcome Back";
        authSubtitle.innerText = "Enter your credentials to continue your journey.";
        submitBtn.innerText = "ACCESS DASHBOARD →";
        toggleText.innerText = "DON'T HAVE AN ACC?";
        toggleAuthLink.innerText = "SIGN UP";
    } else {
        // If signup fields are hidden, switch to SIGNUP mode
        signupFields.style.display = 'block'; // Show biometric fields
        // Update all text on the page to reflect Signup state
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Set your profile up to begin tracking.";
        submitBtn.innerText = "START JOURNEY →";
        toggleText.innerText = "ALREADY HAVE AN ACC?";
        toggleAuthLink.innerText = "LOGIN";
    }
}

// Listen for the form submission (when the user clicks the submit button)
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the page from refreshing automatically on submit

    // Check if we are currently in Signup mode (true) or Login mode (false)
    const isSignUp = document.getElementById('signupFields').style.display !== 'none';
    
    // Get the email and password, removing any accidental spaces at the ends using .trim()
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // 1. SHARED VALIDATION (Runs for both login and signup)
    // Ensure email has an @ and a . and isn't too short
    if (!email.includes('@') || !email.includes('.') || email.length < 5) {
        alert("⚠️ Enter a valid email (e.g., name@gmail.com)");
        return; // Stop execution if invalid
    }   

    // Ensure password is at least 8 characters
    if (password.length < 8) {
        alert("⚠️ Password must be at least 8 characters long.");
        return;
    }

    // Load existing databases from local storage (or create empty arrays '[]' if they don't exist)
    let authDb = JSON.parse(localStorage.getItem('fitai_auth')) || [];
    let profilesDb = JSON.parse(localStorage.getItem('fitai_profiles')) || [];
    let activityDb = JSON.parse(localStorage.getItem('fitai_activity')) || [];

    // --- SIGNUP LOGIC ---
    if (isSignUp) {
        // Get values from all the extra signup fields
        const name = document.getElementById('name').value.trim();
        const age = parseInt(document.getElementById('age').value); // Convert text to whole number
        const weight = parseFloat(document.getElementById('weight').value); // Convert text to decimal number
        const height = parseFloat(document.getElementById('height').value);
        // Find which radio button is currently checked for activity and goal
        const activity = document.querySelector('input[name="activity"]:checked')?.value;
        const goal = document.querySelector('input[name="goal"]:checked')?.value;

        // Check if any fields were left empty
        if (!name || !age || !weight || !height || !activity || !goal) {
            alert("⚠️ Biometric data incomplete. Please fill all fields.");
            return;
        }

        // Validate that numbers make sense (no negative age/weight)
        if (age <= 0 || weight <= 0 || height <= 0) {
            alert("⚠️ Invalid Metrics: Age, Weight, and Height must be positive numbers.");
            return;
        }

        // Check the database to see if an account with this email already exists
        if (authDb.find(u => u.email === email)) {
            alert("❌ Identity Conflict: User already exists. Try logging in.");
            return;
        }

        // GENERATE UNIQUE ID based on the exact current timestamp
        const userId = "usr_" + Date.now();

        // PREPARE DATA PACKAGE: Bundle all new user data into three categories
        const payload = {
            auth: { userId, email, password },
            profile: { userId, name, age, weight, height, activity, goal },
            activity: { userId, streak: 0, history: [] } // Empty history for a new user
        };

        // SYNC TO LOCAL STORAGE: Add new data to the arrays
        authDb.push(payload.auth);
        profilesDb.push(payload.profile);
        activityDb.push(payload.activity);

        // Save updated arrays back into the browser's local storage as strings
        localStorage.setItem('fitai_auth', JSON.stringify(authDb));
        localStorage.setItem('fitai_profiles', JSON.stringify(profilesDb));
        localStorage.setItem('fitai_activity', JSON.stringify(activityDb));

        // SEND TO ELECTRON MAIN PROCESS: Tell the backend to save this user data permanently
        ipcRenderer.send('signup-user', payload);

        // HANDLE RESPONSE: Wait for backend to confirm success
        ipcRenderer.on('signup-success', (event, result) => {
            // Save their ID so the app knows who is currently logged in
            localStorage.setItem('currentUserId', result.userId);
            alert("🔥 Account Created and Data Synced!");
            window.location.href = 'profile.html'; // Redirect them to the dashboard
        });

    // --- LOGIN LOGIC ---
    } else {
        // LOGIN CHECK: Search the database for an exact email AND password match
        const user = authDb.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Success: Save their ID to remember they are logged in and redirect
            localStorage.setItem('currentUserId', user.userId);
            window.location.href = 'profile.html';
        } else {
            // Failure: Show error alert
            alert("❌ Authentication Failed: Invalid credentials.");
        }
    }
});

// Code that runs the very moment the webpage finishes loading
window.onload = function() {
    initializeData(); // Load seed data if necessary
    document.getElementById('signupFields').style.display = 'block'; // Ensure signup fields are visible initially
};