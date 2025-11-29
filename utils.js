// ---------- BASIC UTILITIES ----------

// Shortcut for document.getElementById
const $ = id => document.getElementById(id);

// Escape HTML safely
function escapeHtml(s) {
    if (!s) return '';
    return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
}

// Safe executor wrapper
function safe(fn) {
    try { fn(); } catch (e) { console.warn('safe():', e); }
}

// Used in Test Page
function esc(s) {
    return String(s || '')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
}

// ---------- GLOBAL STUDY TIMER ----------
let timerInterval = null;
let totalSeconds = 0;

function updateTimerUI() {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');

    const disp = document.getElementById("timerDisplay");
    if (disp) disp.innerText = `${hrs}:${mins}:${secs}`;
}

// Start timer
document.getElementById("timerStart")?.addEventListener("click", () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        totalSeconds++;
        updateTimerUI();
    }, 1000);
});

// Pause timer
document.getElementById("timerPause")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Reset timer
document.getElementById("timerReset")?.addEventListener("click", () => {
    totalSeconds = 0;
    updateTimerUI();
});

// ---------- MISC ----------
function randomId() {
    return "id" + Math.random().toString(36).substr(2, 9);
}
