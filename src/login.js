// Function to handle the UI swap
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

// Handle Form Submission
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const isSignUp = document.getElementById('signupFields').style.display !== 'none';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    //  SHARED VALIDATION (LOGIN & SIGNUP) 
    if (!email.includes('@') || !email.includes('.') || email.length < 5) {
        alert("⚠️ Enter a valid email (e.g., name@gmail.com)");
        return;
    }   

    if (password.length < 8) {
        alert("⚠️ Password must be at least 8 characters long.");
        return;
    }

    // Get existing users from storage
    let users = JSON.parse(localStorage.getItem('fitai_users')) || [];

    if (isSignUp) {
        // CAPTURE ALL DATA
        const name = document.getElementById('name').value.trim();
        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = document.querySelector('input[name="activity"]:checked')?.value;
        const goal = document.querySelector('input[name="goal"]:checked')?.value;

        //2. SIGNUP SPECIFIC VALIDATION
        if (!name || !age || !weight || !height || !activity || !goal) {
            alert("⚠️ Biometric data incomplete. Please fill all fields.");
            return;
        }

        if (age <= 0 || weight <= 0 || height <= 0) {
            alert("⚠️ Invalid Metrics: Age, Weight, and Height must be positive numbers.");
            return;
        }

        // Check for duplicates
        if (users.find(u => u.email === email)) {
            alert("❌ Identity Conflict: User already exists. Try logging in.");
            return;
        }

        // Create User Object
        const newUser = {
            name, email, password, age, weight, height, activity, goal,
            logs: [],
            streak: 0
        };

        // SAVE DATA
        users.push(newUser);
        localStorage.setItem('fitai_users', JSON.stringify(users));
        localStorage.setItem('currentUser', email);
        
        alert("🔥 Account Created. Initializing your journey...");
        window.location.href = 'profile.html';
    } else {
        // LOGIN CHECK
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', email);
            window.location.href = 'profile.html';
        } else {
            alert("❌ Authentication Failed: Invalid credentials.");
        }
    }
});

window.onload = function() {
    document.getElementById('signupFields').style.display = 'block';
};