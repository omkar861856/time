// Tool Navigation
function showTool(tool) {
    document.querySelectorAll('.tool-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tool + '-section').classList.add('active');
    document.getElementById('btn-' + tool).classList.add('active');
}

// Clock logic
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('current-time').textContent = timeStr;
    document.getElementById('current-date').textContent = dateStr;
    
    // Check Alarm
    checkAlarms(timeStr.substring(0, 5));
}
setInterval(updateClock, 1000);

// Alarm logic
let activeAlarms = [];
function setAlarm() {
    const input = document.getElementById('alarm-input').value;
    if (!input) return;
    
    if (!activeAlarms.includes(input)) {
        activeAlarms.push(input);
        renderAlarms();
    }
}

function renderAlarms() {
    const list = document.getElementById('active-alarms');
    list.innerHTML = activeAlarms.map(a => `
        <div class="alarm-item">
            <span>${a}</span>
            <button onclick="removeAlarm('${a}')">×</button>
        </div>
    `).join('');
    document.getElementById('alarm-status').textContent = activeAlarms.length > 0 ? 'Alarms active' : 'No alarm set';
}

function removeAlarm(time) {
    activeAlarms = activeAlarms.filter(a => a !== time);
    renderAlarms();
}

function checkAlarms(currentTime) {
    if (activeAlarms.includes(currentTime)) {
        document.getElementById('alarm-sound').play();
        alert('ALARM! It is ' + currentTime);
        removeAlarm(currentTime);
    }
}

// Timer logic
let timerInterval;
let timerSeconds = 0;

function startTimer() {
    if (timerInterval) return;
    
    const h = parseInt(document.getElementById('timer-h').value) || 0;
    const m = parseInt(document.getElementById('timer-m').value) || 0;
    const s = parseInt(document.getElementById('timer-s').value) || 0;
    
    if (timerSeconds === 0) {
        timerSeconds = h * 3600 + m * 60 + s;
    }
    
    if (timerSeconds <= 0) return;

    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('alarm-sound').play();
            alert('Timer Finished!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    document.getElementById('timer-display').textContent = 
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
}

// Stopwatch logic
let swInterval;
let swStartTime;
let swElapsed = 0;

function startStopwatch() {
    if (swInterval) return;
    swStartTime = Date.now() - swElapsed;
    swInterval = setInterval(() => {
        swElapsed = Date.now() - swStartTime;
        updateSwDisplay();
    }, 10);
}

function updateSwDisplay() {
    const totalMs = swElapsed;
    const ms = Math.floor((totalMs % 1000) / 10);
    const s = Math.floor((totalMs / 1000) % 60);
    const m = Math.floor((totalMs / 60000) % 60);
    const h = Math.floor(totalMs / 3600000);
    
    document.getElementById('stopwatch-display').textContent = 
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
}

function stopStopwatch() {
    clearInterval(swInterval);
    swInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    swElapsed = 0;
    updateSwDisplay();
}

// Initialize
updateClock();
updateTimerDisplay();
updateSwDisplay();
