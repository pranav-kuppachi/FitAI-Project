const { ipcRenderer } = require('electron');

async function initializeData() {
    try {
        if (!localStorage.getItem('fitai_auth')) {
            const authRes = await fetch('../data/auth.json');
            localStorage.setItem('fitai_auth', JSON.stringify(await authRes.json()));
            
            const profRes = await fetch('../data/profiles.json');
            localStorage.setItem('fitai_profiles', JSON.stringify(await profRes.json()));
            
            const actRes = await fetch('../data/activity.json');
            localStorage.setItem('fitai_activity', JSON.stringify(await actRes.json()));
        }
    } catch (e) { console.warn("Seed data skip: Using local persistence."); }
}

function toggleAuth() {
    const signupFields = document.getElementById('signupFields');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleAuthLink = document.getElementById('toggleAuth');

    if (signupFields.style.display !== 'none') {
        signupFields.style.display = 'none';
        authTitle.innerText = "Welcome Back";
        authSubtitle.innerText = "Enter your credentials to continue your journey.";
        submitBtn.innerText = "ACCESS DASHBOARD →";
        toggleText.innerText = "DON'T HAVE AN ACC?";
        toggleAuthLink.innerText = "SIGN UP";
    } else {
        signupFields.style.display = 'block';
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Set your profile up to begin tracking.";
        submitBtn.innerText = "START JOURNEY →";
        toggleText.innerText = "ALREADY HAVE AN ACC?";
        toggleAuthLink.innerText = "LOGIN";
    }
}

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const isSignUp = document.getElementById('signupFields').style.display !== 'none';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // 1. SHARED VALIDATION
    if (!email.includes('@') || !email.includes('.') || email.length < 5) {
        alert("⚠️ Enter a valid email (e.g., name@gmail.com)");
        return;
    }   

    if (password.length < 8) {
        alert("⚠️ Password must be at least 8 characters long.");
        return;
    }

    let authDb = JSON.parse(localStorage.getItem('fitai_auth')) || [];
    let profilesDb = JSON.parse(localStorage.getItem('fitai_profiles')) || [];
    let activityDb = JSON.parse(localStorage.getItem('fitai_activity')) || [];

    if (isSignUp) {
        const name = document.getElementById('name').value.trim();
        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = document.querySelector('input[name="activity"]:checked')?.value;
        const goal = document.querySelector('input[name="goal"]:checked')?.value;

        if (!name || !age || !weight || !height || !activity || !goal) {
            alert("⚠️ Biometric data incomplete. Please fill all fields.");
            return;
        }

        if (age <= 0 || weight <= 0 || height <= 0) {
            alert("⚠️ Invalid Metrics: Age, Weight, and Height must be positive numbers.");
            return;
        }

        if (authDb.find(u => u.email === email)) {
            alert("❌ Identity Conflict: User already exists. Try logging in.");
            return;
        }

        // GENERATE UNIQUE ID
        const userId = "usr_" + Date.now();

        // PREPARE DATA PACKAGE
        const payload = {
            auth: { userId, email, password },
            profile: { userId, name, age, weight, height, activity, goal },
            activity: { userId, streak: 0, history: [] }
        };

        // SYNC TO LOCAL STORAGE
        authDb.push(payload.auth);
        profilesDb.push(payload.profile);
        activityDb.push(payload.activity);

        localStorage.setItem('fitai_auth', JSON.stringify(authDb));
        localStorage.setItem('fitai_profiles', JSON.stringify(profilesDb));
        localStorage.setItem('fitai_activity', JSON.stringify(activityDb));

        // SEND TO ELECTRON MAIN PROCESS
        ipcRenderer.send('signup-user', payload);

        // HANDLE RESPONSE
        ipcRenderer.on('signup-success', (event, result) => {
            localStorage.setItem('currentUserId', result.userId);
            alert("🔥 Account Created and Data Synced!");
            window.location.href ='dashboard.html';
        });

    } else {
        // LOGIN CHECK
        const user = authDb.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUserId', user.userId);
            window.location.href = 'dashboard.html';
        } else {
            alert("❌ Authentication Failed: Invalid credentials.");
        }
    }
});

window.onload = function() {
    initializeData();
    document.getElementById('signupFields').style.display = 'block';
};