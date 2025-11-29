// ---------- PAGE SWITCHING ----------
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const pg = document.getElementById(id);
    if(pg) pg.style.display = "block";

    // Highlight active nav button
    document.querySelectorAll(".nav button").forEach(btn => {
        btn.classList.remove("active");
        if(btn.dataset.page === id) {
            btn.classList.add("active");
        }
    });
}

// Navigation button click handling
document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => {
        const pg = btn.dataset.page;
        if(pg) showPage(pg);
    });
});

// ---------- UPDATE GREETING ----------
function updateGreeting() {
    const greet = document.getElementById("userGreeting");
    if (!greet) return;

    if (!CURRENT_USER) {
        greet.innerText = "Welcome";
        return;
    }

    greet.innerText = `Welcome, ${CURRENT_USER.name || "Student"}`;
}

// ---------- UPDATE DISPLAYED ROLE / AVATAR ----------
function updateProfileUI() {
    if (!CURRENT_USER) {
        if ($('profileName')) $('profileName').innerText = 'Guest';
        if ($('roleDisplay')) $('roleDisplay').innerText = 'Guest';
        if ($('avatar')) $('avatar').innerText = 'S';
        return;
    }

    if ($('profileName')) $('profileName').innerText = CURRENT_USER.name || '';
    if ($('profileEmail')) $('profileEmail').innerText = CURRENT_USER.email || '';
    if ($('profileCollege')) $('profileCollege').innerText = CURRENT_USER.college || 'N/A';
    if ($('profileRoleClass')) $('profileRoleClass').innerText = CURRENT_USER.roleClass || 'N/A';
    if ($('roleDisplay')) $('roleDisplay').innerText = CURRENT_USER.roleClass || 'Student';

    if ($('avatar')) {
        $('avatar').innerText = CURRENT_USER.name 
            ? CURRENT_USER.name.charAt(0).toUpperCase() 
            : 'U';
    }

    if (CURRENT_USER.role === "Teacher") {
        if ($('adminBadge')) $('adminBadge').innerHTML = '<span class="admin-badge">TEACHER</span>';
    } else {
        if ($('adminBadge')) $('adminBadge').innerHTML = '';
    }
}

// Initial UI updates
updateGreeting();
updateProfileUI();

// ---------- GLOBAL SEARCH ----------
document.getElementById("globalSearch")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();

    // Filter tasks, goals, assignments, notes, etc.
    // (Rendering functions are defined in their modules)
    safe(() => renderTasks());
    safe(() => renderGoals());
    safe(() => renderAssignments());
    safe(() => renderNotes());
});

// ---------- SHOW/HIDE PROFILE, LOGIN, SIGNUP PAGES ----------
document.getElementById("navLogin")?.addEventListener("click", () => showPage("login"));
document.getElementById("navSignup")?.addEventListener("click", () => showPage("signup"));
document.getElementById("navProfile")?.addEventListener("click", () => showPage("profile"));

// ---------- CHAT POPUP ----------
document.getElementById("openChatBtn")?.addEventListener("click", () => {
    $('chatPopup').style.display = 'flex';
    $('openChatBtn').style.display = 'none';
});

document.getElementById("closeChat")?.addEventListener("click", () => {
    $('chatPopup').style.display = 'none';
    $('openChatBtn').style.display = 'flex';
});
