const { ipcRenderer } = require('electron');

// 1. GLOBAL STATE & CHART INSTANCES
const currentId = localStorage.getItem('currentUserId');
let userProfile = null;
let sleepTimerInterval = null;
let sleepChartInstance = null;
let waterChartInstance = null;
let totalWater = 0; // Local tracking for immediate UI updates

/**
 * INITIALIZE DASHBOARD
 */
async function initDashboard() {
    if (!currentId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const data = await ipcRenderer.invoke('get-user-data', currentId);
        userProfile = data.userProfile;

        // DYNAMIC AVATAR & GREETING
        const firstName = userProfile?.name || "User";
        const initial = firstName.charAt(0).toUpperCase();
        
        // Update the Avatar Circle
        const avatarEl = document.querySelector('.user-avatar-circle');
        if (avatarEl) avatarEl.innerText = initial;

        renderGreetings(firstName);
        renderWorkoutAndProgress();
        renderCharts(); // Initialize graph instances
        checkActiveSessions();
    } catch (err) {
        console.error("Dashboard Init Error:", err);
    }
}

/**
 * 2. CIRCADIAN GREETINGS
 */
function renderGreetings(name) {
    const hour = new Date().getHours();
    const greetEl = document.getElementById('greetingText');
    
    let message = "";
    if (hour >= 5 && hour < 12) message = `Good Morning, ${name}`;
    else if (hour >= 12 && hour < 17) message = `Good Afternoon, ${name}`;
    else if (hour >= 17 && hour < 21) message = `Good Evening, ${name}`;
    else message = `Late Night, ${name}`;

    greetEl.innerText = message;
}

/**
 * 3. DYNAMIC WATER LOGGING & PERCENTAGE
 */
function logWater() {
    totalWater += 0.25;
    
    // Update raw value
    document.getElementById('waterVal').innerText = totalWater.toFixed(2);
    
    // Update Percentage Text
    const pct = Math.min((totalWater / 3.0) * 100, 100);
    document.getElementById('waterStatus').innerText = `${Math.floor(pct)}% OF DAILY GOAL`;

    // Update Progress Bar (if exists in HTML)
    const fill = document.getElementById('waterFill');
    if (fill) fill.style.width = `${pct}%`;

    // Update Graph Dynamically (Index 6 = Sunday)
    if (waterChartInstance) {
        waterChartInstance.data.datasets[0].data[6] = totalWater;
        waterChartInstance.update('none'); // Update without full animation reset
    }

    ipcRenderer.send('update-activity', { userId: currentId, type: 'water', value: totalWater });
}

/**
 * 4. SLEEP TIMER & DYNAMIC LINE GRAPH
 */
function toggleSleepSession() {
    const btn = document.getElementById('sleepBtn');
    const sleepStart = localStorage.getItem('sleepStart');
    const container = btn.closest('.glass-box');

    if (!sleepStart) {
        const start = Date.now();
        localStorage.setItem('sleepStart', start);
        btn.innerText = "STOP SESSION";
        container.classList.add('timer-active');
        startUpdatingTimer(start);
    } else {
        clearInterval(sleepTimerInterval);
        const duration = (Date.now() - parseInt(sleepStart)) / 3600000;
        const finalHrs = parseFloat(duration.toFixed(1));
        
        document.getElementById('sleepDisplay').innerText = finalHrs;

        // Update Sleep Graph Dynamically
        if (sleepChartInstance) {
            sleepChartInstance.data.datasets[0].data[6] = finalHrs;
            sleepChartInstance.update();
        }

        ipcRenderer.send('update-activity', { userId: currentId, type: 'sleep', value: finalHrs });
        localStorage.removeItem('sleepStart');
        btn.innerText = "START SESSION";
        container.classList.remove('timer-active');
        document.getElementById('sleepTimer').innerText = "00:00:00";
    }
}

function startUpdatingTimer(start) {
    const timerDisplay = document.getElementById('sleepTimer');
    sleepTimerInterval = setInterval(() => {
        const diff = Date.now() - start;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        timerDisplay.innerText = `${h}:${m}:${s}`;
    }, 1000);
}

/**
 * 5. CHART INITIALIZATION
 */
function renderCharts() {
    const sleepCtx = document.getElementById('sleepChart').getContext('2d');
    const waterCtx = document.getElementById('waterChart').getContext('2d');

    // Create a Gradient for the Sleep Line
    const sleepGradient = sleepCtx.createLinearGradient(0, 0, 0, 100);
    sleepGradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
    sleepGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { 
                display: false,
                min: 0 // Prevents the line from clipping at the bottom
            }
        },
        interaction: { intersect: false },
        elements: {
            point: { radius: 0 } // Keeps the line clean
        }
    };

    // SLEEP LINE CHART 
    sleepChartInstance = new Chart(sleepCtx, {
        type: 'line',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                data: [6.5, 7.2, 5.8, 8, 6.4, 7.8, 0], 
                borderColor: '#22D3EE',
                borderWidth: 3,
                tension: 0.45, // Smoother curves
                fill: true,
                backgroundColor: sleepGradient
            }]
        },
        options: commonOptions
    });

    // WATER BAR CHART
    waterChartInstance = new Chart(waterCtx, {
        type: 'bar',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                data: [2.1, 2.8, 3.0, 2.5, 3.2, 2.0, 0],
                backgroundColor: '#22D3EE',
                borderRadius: 6, // Rounded bars look more modern
                barPercentage: 0.6, // Adds breathing room between bars
            }]
        },
        options: commonOptions
    });
}

/**
 * 6. UTILS & HELPERS
 */
function renderWorkoutAndProgress() {
    const protocol = getTodayProtocol(userProfile);
    document.getElementById('workoutName').innerText = protocol.workoutName;
    document.getElementById('strategyBadge').innerText = protocol.strategy.toUpperCase();

    const list = document.getElementById('exerciseList');
    list.innerHTML = protocol.exercises.map(ex => `<li><span>${ex.e}</span> <span>${ex.s}</span></li>`).join('');

    const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayCheck = document.querySelector(`[data-day="${daysShort[new Date().getDay()]}"]`);
    if (todayCheck) todayCheck.classList.add('completed');
}

function selectMood(element) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    ipcRenderer.send('update-activity', { userId: currentId, type: 'mood', value: element.dataset.mood });
}

function updateStressUI(val) {
    document.getElementById('stressLabel').innerText = val;
    ipcRenderer.send('update-activity', { userId: currentId, type: 'stress', value: val });
}

function checkActiveSessions() {
    const sleepStart = localStorage.getItem('sleepStart');
    if (sleepStart) {
        document.getElementById('sleepBtn').innerText = "STOP SESSION";
        document.getElementById('sleepBtn').closest('.glass-box').classList.add('timer-active');
        startUpdatingTimer(parseInt(sleepStart));
    }
}

function logout() {
    localStorage.removeItem('currentUserId');
    window.location.href = 'login.html';
}

window.onload = initDashboard;