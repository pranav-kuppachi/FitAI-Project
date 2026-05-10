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

//  HELPER FUNCTIONS FOR FILE I/O
const getDataPath = (file) => path.join(__dirname, 'data', file);

// Safe read function to prevent "Unexpected end of JSON" errors
const safeRead = (fileName) => {
    try {
        const filePath = getDataPath(fileName);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]'); // Create file if it doesn't exist
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

// DATA PERSISTENCE HANDLERS 

// Handle Signup
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

        // Success! Send word back to the renderer (login.js)
        event.reply('signup-success', { userId: auth.userId });
    } catch (err) {
        console.error("Signup Protocol Failed:", err);
    }
});

// APP LIFECYCLE 

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});