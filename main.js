const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#07080A',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('src/login.html');
}

// --- HELPER FUNCTIONS ---
const getDataPath = (file) => path.join(__dirname, 'data', file);

const safeRead = (fileName) => {
    try {
        const filePath = getDataPath(fileName);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]'); 
            return [];
        }
        const content = fs.readFileSync(filePath, 'utf8').trim();
        return content ? JSON.parse(content) : [];
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return [];
    }
};

const safeWrite = (fileName, data) => {
    fs.writeFileSync(getDataPath(fileName), JSON.stringify(data, null, 2));
};

// --- IPC HANDLERS ---

// 1. INITIAL SIGNUP (Creates the 3 records)
ipcMain.on('signup-user', (event, payload) => {
    try {
        const { auth, profile, activity } = payload;
        const authDb = safeRead('auth.json');
        const profDb = safeRead('profiles.json');
        const actDb = safeRead('activity.json');

        authDb.push(auth);
        profDb.push(profile);
        actDb.push(activity);

        safeWrite('auth.json', authDb);
        safeWrite('profiles.json', profDb);
        safeWrite('activity.json', actDb);

        event.reply('signup-success', { userId: auth.userId });
    } catch (err) {
        console.error("Signup Protocol Failed:", err);
    }
});

// 2. DATA RETRIEVAL (For Dashboard Load)
ipcMain.handle('get-user-data', (event, userId) => {
    const profiles = safeRead('profiles.json');
    const activity = safeRead('activity.json');
    
    return { 
        userProfile: profiles.find(p => p.userId === userId), 
        userActivity: activity.find(a => a.userId === userId) 
    };
});

// 3. ACTIVITY UPDATER (Handles Sleep, Water, Mood, Stress)
ipcMain.on('update-activity', (event, payload) => {
    try {
        const { userId, type, value, date } = payload;
        const actDb = safeRead('activity.json');
        const userIdx = actDb.findIndex(a => a.userId === userId);

        if (userIdx !== -1) {
            // Ensure sub-arrays exist
            if (!actDb[userIdx].sleepLogs) actDb[userIdx].sleepLogs = [];
            if (!actDb[userIdx].waterLogs) actDb[userIdx].waterLogs = [];
            if (!actDb[userIdx].dailyMetrics) actDb[userIdx].dailyMetrics = [];

            // Route data to correct log
            if (type === 'sleep') {
                actDb[userIdx].sleepLogs.push({ date, hours: value });
            } else if (type === 'water') {
                // Update today's water if it exists, otherwise push new
                const waterDay = actDb[userIdx].waterLogs.find(w => w.date === date);
                if (waterDay) waterDay.liters = value;
                else actDb[userIdx].waterLogs.push({ date, liters: value });
            } else if (type === 'mood' || type === 'stress') {
                actDb[userIdx].dailyMetrics.push({ date, type, value });
            }

            safeWrite('activity.json', actDb);
        }
    } catch (err) {
        console.error("Activity Sync Failed:", err);
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});