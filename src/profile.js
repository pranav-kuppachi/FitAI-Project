// 1. DATA LOADING & HYDRATION 
const currentId = localStorage.getItem('currentUserId');

// If no user is logged in, kick back to login
if (!currentId) {
    window.location.href = 'login.html';
}

// Load partitioned data from LocalStorage
const profiles = JSON.parse(localStorage.getItem('fitai_profiles')) || [];
const activities = JSON.parse(localStorage.getItem('fitai_activity')) || [];

// Find this specific user's data
const user = profiles.find(p => p.userId === currentId) || { name: "User", weight: 0, height: 0, age: 0 };
const activityRecord = activities.find(a => a.userId === currentId) || { history: [], streak: 0 };

// Map data to UI
document.getElementById('userName').innerText = user.name;
document.getElementById('userInitial').innerText = user.name.charAt(0).toUpperCase();

// 2. LOGGING LOGIC 
function logWorkout() {
    const today = new Date().toISOString().split('T')[0];
    
    if (!activityRecord.history.includes(today)) {
        activityRecord.history.push(today);
        
        // Sync back to the master activities array
        const idx = activities.findIndex(a => a.userId === currentId);
        if (idx !== -1) {
            activities[idx] = activityRecord;
        } else {
            activities.push(activityRecord);
        }

        // Save back to partitioned storage
        localStorage.setItem('fitai_activity', JSON.stringify(activities));
        
        updateUI();
        alert("✅ LOG SUCCESSFUL");
    } else {
        alert("⚠️YOU CAN ONLY LOG ONCE PER DAY!");
    }
}

// 3. SESSION MANAGEMENT 
function handleLogout() {
    if (confirm("Terminate secure session?")) {
        localStorage.removeItem('currentUserId');
        alert("🔒 SESSION ENDED: Redirecting...");
        window.location.href = "login.html";
    }
}

// 4. UI UPDATE & CALENDAR 
function updateUI() {
    document.getElementById('totalCount').innerText = activityRecord.history.length;
    
    // Calculate Weekly Logs (Mon-Sun)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff)).setHours(0,0,0,0);
    const weeklyLogs = activityRecord.history.filter(date => new Date(date).getTime() >= monday);
    document.getElementById('weekCount').innerText = weeklyLogs.length;

    // Streak Calculation
    let streak = 0; 
    let checkDate = new Date();
    while (true) {
        let dateStr = checkDate.toISOString().split('T')[0];
        if (activityRecord.history.includes(dateStr)) { 
            streak++; 
            checkDate.setDate(checkDate.getDate() - 1); 
        } else { 
            break; 
        }
    }
    document.getElementById('streakDisplay').innerText = `${streak} DAY STREAK`;

    renderCalendar();
    updateGoalProgress();
}

function updateGoalProgress() {
    document.getElementById('startWeight').innerText = `${user.weight} KG`;
    document.getElementById('targetWeight').innerText = `79 KG`;
    const progress = Math.min((activityRecord.history.length / 20) * 100, 100);
    document.getElementById('goalPercentage').innerText = `${Math.round(progress)}%`;
    document.getElementById('goalProgressFill').style.width = `${progress}%`;
}

// EXACT CALENDAR LOGIC - DO NOT CHANGE
function renderCalendar() {
    const wrapper = document.getElementById('calendarWrapper');
    wrapper.innerHTML = '';
    const months = [2, 3, 4]; 
    const year = 2026;

    months.forEach(m => {
        const container = document.createElement('div');
        container.className = 'month-container';
        container.innerHTML = `<div class="month-name">${new Date(year, m).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>`;

        const grid = document.createElement('div');
        grid.className = 'days-grid';
        const firstDay = new Date(year, m, 1).getDay();
        const daysInMonth = new Date(year, m + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'day-box';
            empty.style.opacity = '0';
            grid.appendChild(empty);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const box = document.createElement('div');
            // Check against activityRecord.history instead of global history
            box.className = 'day-box' + (activityRecord.history.includes(dStr) ? ' active' : '');
            grid.appendChild(box);
        }
        container.appendChild(grid);
        wrapper.appendChild(container);
    });
}

// Initial Bio-Metrics Calculation
const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
document.getElementById('bmiVal').innerText = bmi;
document.getElementById('bmrVal').innerText = `${Math.round((10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5)} KCAL`;

updateUI();