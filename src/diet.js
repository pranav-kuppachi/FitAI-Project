const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const calorieChartCtx = document.getElementById('calorieChart');
    const mealInput = document.getElementById('meal-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const recipeInput = document.querySelector('.recipe-search');
    const recipeBtn = document.querySelector('.small-neon'); // The Generate button
    const recipeGrid = document.querySelector('.recipe-grid');

    // DEBUG LOG: Check if buttons are found
    console.log("Analyze Button:", analyzeBtn);
    console.log("Meal Input:", mealInput);
    console.log("Recipe Button:", recipeBtn);

    // Global Macro State
    let currentMacros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    };

    let calorieChart;

    // Load User Avatar & Diet History
    const avatarCircle = document.querySelector('.user-avatar-circle');
    const currentUserId = localStorage.getItem('currentUserId');
    const todayStr = new Date().toISOString().split('T')[0];

    // Initialize blank chart
    calorieChart = initChart(calorieChartCtx);

    if (currentUserId) {
        ipcRenderer.invoke('get-user-data', currentUserId)
            .then(data => {
                // Set Avatar
                if (data && data.userProfile && data.userProfile.name) {
                    const firstLetter = data.userProfile.name.charAt(0).toUpperCase();
                    if (avatarCircle) avatarCircle.textContent = firstLetter;
                }
                
                // Load Diet History
                if (data && data.userDiet && data.userDiet.logs) {
                    const logs = data.userDiet.logs;
                    if (logs[todayStr]) {
                        currentMacros = logs[todayStr].totals;
                    }
                    
                    // Populate Chart History
                    const dataArr = [];
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const dateStr = d.toISOString().split('T')[0];
                        dataArr.push(logs[dateStr] ? logs[dateStr].totals.calories : 0);
                    }
                    if (calorieChart) {
                        calorieChart.data.datasets[0].data = dataArr;
                        calorieChart.update();
                    }
                }
                updateRings(currentMacros);
            })
            .catch(err => console.error("Data Load Error:", err));
    } else {
        updateRings(currentMacros);
    }

    // 3. MEAL ANALYSIS LOGIC
    if (analyzeBtn && mealInput) {
        // ENTER KEY HANDLER
        mealInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log("Enter pressed in meal input");
                e.preventDefault(); // Prevent page refresh
                handleMealAnalysis();
            }
        });

        analyzeBtn.addEventListener('click', handleMealAnalysis);
    }

    async function handleMealAnalysis() {
        const foodQuery = mealInput.value.trim();
        if (!foodQuery) return;

        const originalText = analyzeBtn.textContent;
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        try {
            console.log("Fetching data for:", foodQuery);
            const response = await ipcRenderer.invoke('food-lookup', foodQuery);
            console.log("API Response:", response);

            if (response && response.success) {
                // ACCUMULATE MACROS
                currentMacros.calories += Math.round(response.data.calories || 0);
                currentMacros.protein += Math.round(response.data.protein || 0);
                currentMacros.carbs += Math.round(response.data.carbs || 0);
                currentMacros.fat += Math.round(response.data.fat || 0);

                // Save to JSON Database
                if (currentUserId) {
                    ipcRenderer.invoke('save-diet-log', {
                        userId: currentUserId,
                        dateStr: todayStr,
                        macros: currentMacros,
                        foodItem: {
                            name: foodQuery,
                            calories: Math.round(response.data.calories || 0),
                            protein: Math.round(response.data.protein || 0),
                            carbs: Math.round(response.data.carbs || 0),
                            fat: Math.round(response.data.fat || 0)
                        }
                    }).catch(err => console.error("Save Error:", err));
                }

                updateRings(currentMacros);

                // Update graph dynamically with today's total
                if (calorieChart) {
                    const dataArr = calorieChart.data.datasets[0].data;
                    dataArr[dataArr.length - 1] = currentMacros.calories; // Update the final day (Today)
                    calorieChart.update();
                }

                mealInput.value = '';
            } else {
                alert(response.error || 'Food not found.');
            }
        } catch (error) {
            console.error('IPC Error:', error);
            alert('An error occurred while communicating with the backend.');
        } finally {
            analyzeBtn.textContent = originalText;
            analyzeBtn.disabled = false;
        }
    }

    // 4. RECIPE LOGIC
    if (recipeBtn && recipeInput) {
        recipeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log("Enter pressed in recipe input");
                e.preventDefault();
                handleRecipeGeneration();
            }
        });

        recipeBtn.addEventListener('click', handleRecipeGeneration);
    }

    async function handleRecipeGeneration() {
        const ingredients = recipeInput.value.trim();
        if (!ingredients) return;

        const originalText = recipeBtn.textContent;
        recipeBtn.textContent = 'Generating...';
        recipeBtn.disabled = true;

        try {
            console.log("Generating recipes for:", ingredients);
            const response = await ipcRenderer.invoke('get-recipes', ingredients);
            console.log("Recipe API Response:", response);

            if (response && response.success && response.recipes.length > 0) {
                if (recipeGrid) recipeGrid.innerHTML = '';

                response.recipes.forEach(r => {
                    const card = document.createElement('div');
                    card.className = 'glass-box recipe-card';
                    card.innerHTML = `
                        <div class="recipe-img" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url('${r.image}')"></div>
                        <div class="recipe-info">
                            <h4>${r.title}</h4>
                            <div class="recipe-meta">
                                <span>${r.calories ? r.calories + ' kcal' : 'N/A'}</span>
                                <span>${r.protein ? r.protein + 'g P' : 'N/A'}</span>
                            </div>
                            <button class="neon-btn small-neon view-recipe-btn" data-id="${r.id}" style="margin-top: 15px; width: 100%; font-size: 12px; padding: 10px;">View Recipe</button>
                        </div>
                    `;
                    if (recipeGrid) recipeGrid.appendChild(card);
                });

                // Attach event listeners to all new "View Recipe" buttons
                document.querySelectorAll('.view-recipe-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const recipeId = e.target.getAttribute('data-id');
                        const originalText = e.target.textContent;
                        e.target.textContent = 'Opening...';

                        try {
                            const res = await ipcRenderer.invoke('open-recipe', recipeId);
                            if (!res.success) alert(res.error || 'Failed to open recipe.');
                        } catch (err) {
                            console.error(err);
                        } finally {
                            e.target.textContent = originalText;
                        }
                    });
                });

                recipeInput.value = '';
            } else {
                alert('No recipes found for those ingredients.');
            }
        } catch (error) {
            console.error('Recipe Error:', error);
            alert('Failed to generate recipes. Try again later.');
        } finally {
            recipeBtn.textContent = originalText;
            recipeBtn.disabled = false;
        }
    }
});

// --- HELPER FUNCTIONS ---

function initChart(ctx) {
    if (!ctx) return null;
    
    const labels = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(i === 0 ? 'Today' : days[d.getDay()]);
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calories',
                data: [0, 0, 0, 0, 0, 0, 0], // Replaced dynamically on load
                borderColor: '#22D3EE',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#07080A',
                pointBorderColor: '#22D3EE',
                pointBorderWidth: 2,
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } },
                x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } }
            }
        }
    });
}

function updateRings(macros) {
    renderRing('.progress-ring__circle', macros.calories, 2500);
    renderRing('.protein-ring', macros.protein, 150);
    renderRing('.carbs-ring', macros.carbs, 250);
    renderRing('.fats-ring', macros.fat, 70);

    // Update text labels
    const calVal = document.querySelector('.calories-val .val');
    if (calVal) calVal.textContent = macros.calories;

    const mVals = document.querySelectorAll('.macro-val .m-val');
    if (mVals.length > 0) mVals[0].textContent = `${macros.protein}g`;
    if (mVals.length > 1) mVals[1].textContent = `${macros.carbs}g`;
    if (mVals.length > 2) mVals[2].textContent = `${macros.fat}g`;
}

function renderRing(selector, value, target) {
    const circle = document.querySelector(selector);
    if (!circle) return;
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const percent = Math.min(value / target, 1);
    circle.style.strokeDashoffset = circumference - (percent * circumference);
}