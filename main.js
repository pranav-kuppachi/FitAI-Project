require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const SPOON_KEY = process.env.SPOONACULAR_API_KEY;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200, height: 800,
        backgroundColor: '#07080A',
        webPreferences: {
            nodeIntegration: true,    // Matches your existing login.js
            contextIsolation: false   // Matches your existing login.js
        }
    });
    win.loadFile('src/login.html');
}

// --- SPOONACULAR API HANDLERS ---
ipcMain.handle('food-lookup', async (event, foodName) => {
    try {
        const searchUrl = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(foodName)}&apiKey=${SPOON_KEY}`;
        const res = await fetch(searchUrl);
        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.message || `API Error: ${res.status}` };
        }

        if (data.results && data.results.length > 0) {
            const foodId = data.results[0].id;
            const nutUrl = `https://api.spoonacular.com/food/ingredients/${foodId}/information?amount=100&unit=g&apiKey=${SPOON_KEY}`;
            const nutRes = await fetch(nutUrl);
            const nutData = await nutRes.json();

            const getNutrient = (name) => {
                if (!nutData.nutrition || !nutData.nutrition.nutrients) return 0;
                const nut = nutData.nutrition.nutrients.find(n => n.name === name);
                return nut ? nut.amount : 0;
            };

            return {
                success: true,
                data: {
                    calories: getNutrient('Calories'),
                    protein: getNutrient('Protein'),
                    carbs: getNutrient('Carbohydrates'),
                    fat: getNutrient('Fat')
                }
            };
        }
        return { success: false, error: "Food not found in database." };
    } catch (e) {
        console.error('Food Lookup API Error:', e);
        return { success: false, error: "API connection failed." };
    }
});

ipcMain.handle('get-recipes', async (event, ingredients) => {
    try {
        const findUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=3&apiKey=${SPOON_KEY}`;
        const findRes = await fetch(findUrl);
        const findData = await findRes.json();

        if (!findRes.ok) {
            return { success: false, error: findData.message || `API Error: ${findRes.status}` };
        }

        if (findData && findData.length > 0) {
            const ids = findData.map(r => r.id).join(',');
            const bulkUrl = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}&includeNutrition=true&apiKey=${SPOON_KEY}`;
            const bulkRes = await fetch(bulkUrl);
            const bulkData = await bulkRes.json();

            const recipes = bulkData.map(r => {
                const getNutrient = (name) => {
                    if (!r.nutrition || !r.nutrition.nutrients) return null;
                    const nut = r.nutrition.nutrients.find(n => n.name === name);
                    return nut ? Math.round(nut.amount) : null;
                };

                return {
                    id: r.id,
                    title: r.title,
                    image: r.image,
                    calories: getNutrient('Calories'),
                    protein: getNutrient('Protein')
                };
            });
            return { success: true, recipes };
        }
        return { success: false, error: "No recipes found." };
    } catch (e) {
        console.error('Recipe API Error:', e);
        return { success: false, error: "API connection failed." };
    }
});

ipcMain.handle('open-recipe', async (event, recipeId) => {
    try {
        const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOON_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.sourceUrl) {
            require('electron').shell.openExternal(data.sourceUrl);
            return { success: true };
        }
        return { success: false, error: "Recipe URL not found." };
    } catch (e) {
        console.error('Recipe Open Error:', e);
        return { success: false, error: "API connection failed." };
    }
});

// --- DATA HELPERS ---
const getDataPath = (file) => path.join(__dirname, 'data', file);
const safeRead = (f) => {
    const p = getDataPath(f);
    if (!fs.existsSync(p)) {
        if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
        fs.writeFileSync(p, '[]'); return [];
    }
    return JSON.parse(fs.readFileSync(p, 'utf8') || '[]');
};
const safeWrite = (f, d) => fs.writeFileSync(getDataPath(f), JSON.stringify(d, null, 2));

// --- AUTH HANDLERS (Fixes the Login/Signup loop) ---
ipcMain.on('signup-user', (event, payload) => {
    const authDb = safeRead('auth.json');
    const profDb = safeRead('profiles.json');
    const actDb = safeRead('activity.json');

    authDb.push(payload.auth);
    profDb.push(payload.profile);
    actDb.push(payload.activity);

    safeWrite('auth.json', authDb);
    safeWrite('profiles.json', profDb);
    safeWrite('activity.json', actDb);

    // CRITICAL: This line tells login.js to move to dashboard
    event.reply('signup-success', { userId: payload.auth.userId });
});

ipcMain.handle('get-user-data', (event, userId) => {
    return {
        userProfile: safeRead('profiles.json').find(p => p.userId === userId),
        userActivity: safeRead('activity.json').find(a => a.userId === userId),
        userDiet: safeRead('diet.json').find(d => d.userId === userId)
    };
});

ipcMain.on('update-activity', (event, { userId, type, value }) => {
    const actDb = safeRead('activity.json');
    const u = actDb.find(a => a.userId === userId);
    if (!u) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (type === 'water') {
        if (!u.waterLogs || Array.isArray(u.waterLogs)) u.waterLogs = {};
        u.waterLogs[todayStr] = value;
    } else if (type === 'sleep') {
        if (!u.sleepLogs || Array.isArray(u.sleepLogs)) u.sleepLogs = {};
        u.sleepLogs[todayStr] = value;
    } else if (type === 'mood' || type === 'stress') {
        if (!u.dailyMetrics || Array.isArray(u.dailyMetrics)) u.dailyMetrics = {};
        if (!u.dailyMetrics[todayStr]) u.dailyMetrics[todayStr] = {};
        u.dailyMetrics[todayStr][type] = value;
    }
    safeWrite('activity.json', actDb);
});

ipcMain.handle('save-diet-log', (event, { userId, dateStr, macros, foodItem }) => {
    const dietDb = safeRead('diet.json');
    let userRecord = dietDb.find(d => d.userId === userId);
    
    if (!userRecord) {
        userRecord = { userId: userId, logs: {} };
        dietDb.push(userRecord);
    }
    
    if (!userRecord.logs[dateStr]) {
        userRecord.logs[dateStr] = { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, foods: [] };
    }
    
    userRecord.logs[dateStr].totals = macros;
    if (foodItem) {
        userRecord.logs[dateStr].foods.push(foodItem);
    }
    
    safeWrite('diet.json', dietDb);
    return { success: true };
});

app.whenReady().then(createWindow);