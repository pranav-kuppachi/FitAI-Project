// Load split data
const currentUserId = localStorage.getItem('currentUserId');
if (!currentUserId) window.location.href = "login.html";

const profiles = JSON.parse(localStorage.getItem('fitai_profiles')) || [];
const activities = JSON.parse(localStorage.getItem('fitai_activity')) || [];

const user = profiles.find(p => p.userId === currentUserId) || { name: "Aarush", weight: 84, height: 175, age: 20 };
const activityRecord = activities.find(a => a.userId === currentUserId) || { history: [], streak: 0 };

document.getElementById('userName').innerText = user.name;
document.getElementById('userInitial').innerText = user.name.charAt(0).toUpperCase();

function logWorkout() {
    const today = new Date().toISOString().split('T')[0];
    if (!activityRecord.history.includes(today)) {
        activityRecord.history.push(today);
        
        // Update the master activity list
        const idx = activities.findIndex(a => a.userId === currentUserId);
        if (idx !== -1) activities[idx] = activityRecord;
        
        localStorage.setItem('fitai_activity', JSON.stringify(activities));
        updateUI();
        alert("✅ LOG SUCCESSFUL");
    } else {
        alert("⚠️YOU CAN ONLY LOG ONCE PER DAY!");
    }
}

function handleLogout() {
    if (confirm("Terminate secure session?")) {
        localStorage.removeItem('currentUserId');
        window.location.href = "login.html";
    }
}

function updateUI() {
    document.getElementById('totalCount').innerText = activityRecord.history.length;
    
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - (now.getDay() || 7) + 1)).setHours(0,0,0,0);
    const weeklyLogs = activityRecord.history.filter(date => new Date(date).getTime() >= monday);
    document.getElementById('weekCount').innerText = weeklyLogs.length;

    let streak = 0; let checkDate = new Date();
    while (true) {
        let dateStr = checkDate.toISOString().split('T')[0];
        if (activityRecord.history.includes(dateStr)) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
        else { break; }
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
        for (let i = 1; i <= 30; i++) {
            const dStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const box = document.createElement('div');
            box.className = 'day-box' + (activityRecord.history.includes(dStr) ? ' active' : '');
            grid.appendChild(box);
        }
        container.appendChild(grid);
        wrapper.appendChild(container);
    });
}

document.getElementById('bmiVal').innerText = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
document.getElementById('bmrVal').innerText = `${Math.round((10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5)} KCAL`;

updateUI();