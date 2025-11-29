// ---------- STORAGE & STATE ----------
const STORAGE_KEYS = { 
    STATE: 'ssp_state_v2', 
    AUTH: 'ssp_auth_v2' 
};

// Global state object
let STATE = { 
    notes: [], 
    tasks: [], 
    goals: [], 
    assigns: [], 
    calendar: {}, 
    users: [], 
    chats: {}, 
    messages: {} 
};

// Save full app state to localStorage
function saveState() {
    try {
        localStorage.setItem(
            STORAGE_KEYS.STATE, 
            JSON.stringify(STATE)
        );
    } catch (e) {
        console.warn('saveState failed', e);
    }
}

// Load state from localStorage
function loadState() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.STATE) || 'null'
        );
        if (saved) {
            STATE = Object.assign({}, STATE, saved);
        }
    } catch (e) {
        console.warn('loadState failed', e);
    }
}

// Load initial state immediately
loadState();

// ---------- AUTH LOCAL STORAGE ----------
function saveAuthLocal(user) {
    localStorage.setItem(
        STORAGE_KEYS.AUTH, 
        JSON.stringify(user)
    );
}

function loadAuthLocal() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.AUTH) || 'null'
    );
}

// ---------- GLOBAL SESSION VARIABLES ----------
let CURRENT_USER = loadAuthLocal() || null;
let CURRENT_CHAT_TARGET = null;

// Immediately update STATE + AUTH on load
if (CURRENT_USER && !STATE.users.find(u => u.uid === CURRENT_USER.uid)) {
    STATE.users.push(CURRENT_USER);
    saveState();
}
