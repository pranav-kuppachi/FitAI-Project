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

    // Get existing users from storage
    let users = JSON.parse(localStorage.getItem('fitai_users')) || [];

    if (isSignUp) {
        // CAPTURE ALL DATA
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        const activity = document.querySelector('input[name="activity"]:checked')?.value;
        const goal = document.querySelector('input[name="goal"]:checked')?.value;

        // Validation
        if (!name || !weight || !height || !activity || !goal) {
            alert("⚠️ Please complete your biometric profile.");
            return;
        }

        // Check for duplicates
        if (users.find(u => u.email === email)) {
            alert("❌ User already exists. Try logging in.");
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
        localStorage.setItem('currentUser', email); // Set active user
        
        window.location.href = 'profile.html';
    } else {
        // LOGIN CHECK
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', email);
            window.location.href = 'profile.html';
        } else {
            alert("❌ Invalid credentials.");
        }
    }
});

window.onload = function() {
    document.getElementById('signupFields').style.display = 'block';
};