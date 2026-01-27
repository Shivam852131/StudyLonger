// ===== GLOBAL VARIABLES =====
let currentUser = null;
let appState = {
    currentPage: 'dashboard',
    isSidebarOpen: true,
    isDarkMode: true,
    tasks: [],
    goals: [],
    assignments: [],
    notes: [],
    chatHistory: [],
    notifications: [],
    // NEW: Study Rooms State
    studyRooms: [],
    challenges: [],
    leaderboard: [],
    studyBuddies: [],
    focusTimer: {
        isRunning: false,
        timeLeft: 1500, // 25 minutes in seconds
        duration: 1500,
        participants: []
    },
    userPreferences: {
        dailyGoal: 3,
        focusMode: true,
        breakReminders: true,
        studyAnalytics: true,
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true
    }
};

// ===== DOM ELEMENTS =====
const elements = {
    // Loading Screen
    loadingScreen: document.getElementById('loadingScreen'),
    
    // Sidebar & Navigation
    sidebar: document.getElementById('sidebar'),
    mainContent: document.getElementById('mainContent'),
    menuToggle: document.getElementById('menuToggle'),
    navItems: document.querySelectorAll('.nav-item'),
    pagesContainer: document.getElementById('pagesContainer'),
    pages: document.querySelectorAll('.page'),
    
    // User Section
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    userRole: document.getElementById('userRole'),
    userMenuBtn: document.getElementById('userMenuBtn'),
    
    // Top Bar
    globalSearch: document.getElementById('globalSearch'),
    notificationBtn: document.getElementById('notificationBtn'),
    themeToggle: document.getElementById('themeToggle'),
    loginBtn: document.getElementById('loginBtn'),
    
    // Modals
    loginModal: document.getElementById('loginModal'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettingsModal: document.getElementById('closeSettingsModal'),
    
    // Auth Elements
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    authTabs: document.querySelectorAll('.auth-tab'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginSubmitBtn: document.getElementById('loginSubmitBtn'),
    signupName: document.getElementById('signupName'),
    signupEmail: document.getElementById('signupEmail'),
    signupPassword: document.getElementById('signupPassword'),
    userRoleSelect: document.getElementById('userRoleSelect'),
    signupSubmitBtn: document.getElementById('signupSubmitBtn'),
    googleLogin: document.getElementById('googleLogin'),
    githubLogin: document.getElementById('githubLogin'),
    
    // Dashboard Elements
    studyTime: document.getElementById('studyTime'),
    tasksCompleted: document.getElementById('tasksCompleted'),
    xpPoints: document.getElementById('xpPoints'),
    streakCount: document.getElementById('streakCount'),
    actionCards: document.querySelectorAll('.action-card'),
    deadlineList: document.getElementById('deadlineList'),
    
    // Student Life
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Tasks
    taskTitle: document.getElementById('taskTitle'),
    taskPriority: document.getElementById('taskPriority'),
    taskDue: document.getElementById('taskDue'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskList: document.getElementById('taskList'),
    
    // Goals
    goalTitle: document.getElementById('goalTitle'),
    goalDescription: document.getElementById('goalDescription'),
    goalDeadline: document.getElementById('goalDeadline'),
    addGoalBtn: document.getElementById('addGoalBtn'),
    goalsList: document.getElementById('goalsList'),
    
    // Assignments
    assignmentTitle: document.getElementById('assignmentTitle'),
    assignmentSubject: document.getElementById('assignmentSubject'),
    assignmentDescription: document.getElementById('assignmentDescription'),
    assignmentDue: document.getElementById('assignmentDue'),
    addAssignmentBtn: document.getElementById('addAssignmentBtn'),
    assignmentsList: document.getElementById('assignmentsList'),
    
    // Notes
    noteTitle: document.getElementById('noteTitle'),
    noteSubject: document.getElementById('noteSubject'),
    noteContent: document.getElementById('noteContent'),
    saveNoteBtn: document.getElementById('saveNoteBtn'),
    notesGrid: document.getElementById('notesGrid'),
    
    // Test Generator
    testSubject: document.getElementById('testSubject'),
    studyMaterial: document.getElementById('studyMaterial'),
    generateTopicsBtn: document.getElementById('generateTopicsBtn'),
    topicsList: document.getElementById('topicsList'),
    testQuestions: document.getElementById('testQuestions'),
    
    // Chatbot
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendMessageBtn: document.getElementById('sendMessageBtn'),
    quickQuestions: document.querySelectorAll('.quick-question'),
    
    // Live Chat
    liveChatMessages: document.getElementById('liveChatMessages'),
    liveChatInput: document.getElementById('liveChatInput'),
    sendLiveMessageBtn: document.getElementById('sendLiveMessageBtn'),
    
    // Profile Elements
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    profileLevel: document.getElementById('profileLevel'),
    profileXP: document.getElementById('profileXP'),
    profileStreak: document.getElementById('profileStreak'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileAvatarText: document.getElementById('profileAvatarText'),
    editProfileBtn: document.getElementById('editProfileBtn'),
    dailyGoal: document.getElementById('dailyGoal'),
    focusMode: document.getElementById('focusMode'),
    breakReminders: document.getElementById('breakReminders'),
    studyAnalytics: document.getElementById('studyAnalytics'),
    activityList: document.getElementById('activityList'),
    achievementsGrid: document.getElementById('achievementsGrid'),
    disconnectGoogle: document.getElementById('disconnectGoogle'),
    
    // Settings
    settingsContent: document.getElementById('settingsContent'),
    settingsTabs: document.querySelectorAll('.settings-tab'),
    
    // Notification System
    notificationDropdown: document.getElementById('notificationDropdown'),
    notificationList: document.getElementById('notificationList'),
    markAllRead: document.getElementById('markAllRead'),
    
    // Push Notifications
    pushPermissionBanner: document.getElementById('pushPermissionBanner'),
    enablePushBtn: document.getElementById('enablePushBtn'),
    dismissPushBtn: document.getElementById('dismissPushBtn'),
    
    // Chatbot Widget
    chatbotWidget: document.getElementById('chatbotWidget'),
    
    // Toast
    notificationToast: document.getElementById('notificationToast'),
    
    // NEW: Study Rooms Elements
    createRoomBtn: document.getElementById('createRoomBtn'),
    roomsGrid: document.getElementById('roomsGrid'),
    startTimer: document.getElementById('startTimer'),
    pauseTimer: document.getElementById('pauseTimer'),
    resetTimer: document.getElementById('resetTimer'),
    timerDisplay: document.getElementById('timerDisplay'),
    timerDuration: document.getElementById('timerDuration'),
    participantsCount: document.getElementById('participantsCount'),
    createChallengeBtn: document.getElementById('createChallengeBtn'),
    challengesGrid: document.getElementById('challengesGrid'),
    challengeForm: document.getElementById('challengeForm'),
    challengeTitle: document.getElementById('challengeTitle'),
    challengeDescription: document.getElementById('challengeDescription'),
    challengeType: document.getElementById('challengeType'),
    challengeGoal: document.getElementById('challengeGoal'),
    challengeDeadline: document.getElementById('challengeDeadline'),
    saveChallengeBtn: document.getElementById('saveChallengeBtn'),
    cancelChallengeBtn: document.getElementById('cancelChallengeBtn'),
    leaderboardList: document.getElementById('leaderboardList'),
    findBuddies: document.getElementById('findBuddies'),
    searchBuddiesBtn: document.getElementById('searchBuddiesBtn'),
    subjectFilter: document.getElementById('subjectFilter'),
    studyTimeFilter: document.getElementById('studyTimeFilter'),
    findCompatibleBtn: document.getElementById('findCompatibleBtn'),
    buddiesGrid: document.getElementById('buddiesGrid'),
    requestsList: document.getElementById('requestsList'),
    studyRoomsTabs: document.querySelectorAll('.study-rooms-tabs .tab-btn'),
    leaderboardTabs: document.querySelectorAll('.leaderboard-tab')
};

// ===== NOTIFICATION SYSTEM =====
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.setupNotificationListeners();
        this.loadNotifications();
        this.startRealTimeUpdates();
    }

    setupNotificationListeners() {
        // Notification button click
        elements.notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotificationDropdown();
        });

        // Mark all as read
        elements.markAllRead?.addEventListener('click', () => {
            this.markAllAsRead();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = elements.notificationDropdown;
            if (dropdown && !dropdown.contains(e.target) && !elements.notificationBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    toggleNotificationDropdown() {
        const dropdown = elements.notificationDropdown;
        dropdown.classList.toggle('active');
        
        if (dropdown.classList.contains('active')) {
            this.loadNotifications();
        }
    }

    startRealTimeUpdates() {
        // Simulate real-time notifications
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 30 seconds
                this.generateRandomNotification();
            }
        }, 30000);

        // Check for overdue tasks every minute
        setInterval(() => {
            this.checkOverdueTasks();
        }, 60000);
    }

    generateRandomNotification() {
        const notifications = [
            {
                id: Date.now(),
                type: 'reminder',
                title: 'Study Reminder',
                message: 'You have a study session starting in 15 minutes!',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'medium'
            },
            {
                id: Date.now() + 1,
                type: 'achievement',
                title: 'New Achievement!',
                message: 'You earned the "Study Streak" badge!',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'low'
            },
            {
                id: Date.now() + 2,
                type: 'deadline',
                title: 'Assignment Due Soon',
                message: 'Math assignment is due in 2 hours',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'high'
            },
            {
                id: Date.now() + 3,
                type: 'friend',
                title: 'Study Group Invitation',
                message: 'Alex invited you to join a study group',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'medium'
            }
        ];

        const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
        this.addNotification(randomNotif);
    }

    loadNotifications() {
        const saved = localStorage.getItem('studylonger_notifications');
        this.notifications = saved ? JSON.parse(saved) : [];
        this.updateNotificationCount();
        this.renderNotifications();
    }

    saveNotifications() {
        localStorage.setItem('studylonger_notifications', JSON.stringify(this.notifications));
    }

    addNotification(notification) {
        // Add new notification
        this.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        // Save to localStorage
        this.saveNotifications();
        
        // Update UI
        this.updateNotificationCount();

        // Show toast for important notifications
        if (notification.priority === 'high') {
            showToast(notification.message, 'warning');
        }

        // If dropdown is open, refresh list
        if (elements.notificationDropdown?.classList.contains('active')) {
            this.renderNotifications();
        }
    }

    renderNotifications() {
        const notificationList = elements.notificationList;
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }

        notificationList.innerHTML = this.notifications.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon ${notif.type}">
                    <i class="${this.getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span class="notification-time">${this.formatTime(notif.timestamp)}</span>
                </div>
                <button class="notification-action" onclick="notificationSystem.markAsRead(${notif.id})">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `).join('');
    }

    getNotificationIcon(type) {
        const icons = {
            'reminder': 'fas fa-clock',
            'achievement': 'fas fa-trophy',
            'deadline': 'fas fa-exclamation-triangle',
            'friend': 'fas fa-user-friends',
            'system': 'fas fa-cog',
            'message': 'fas fa-comment'
        };
        return icons[type] || 'fas fa-bell';
    }

    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return time.toLocaleDateString();
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateNotificationCount();
            this.saveNotifications();
            
            // Update UI
            const item = document.querySelector(`.notification-item[data-id="${id}"]`);
            if (item) {
                item.classList.remove('unread');
            }
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notif => notif.read = true);
        this.updateNotificationCount();
        this.saveNotifications();
        this.renderNotifications();
    }

    updateNotificationCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        
        // Update badge
        const badge = document.querySelector('.notification-count');
        if (badge) {
            badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }
        
        // Update favicon badge (if supported)
        if ('setAppBadge' in navigator && this.unreadCount > 0) {
            navigator.setAppBadge(this.unreadCount);
        } else if ('setAppBadge' in navigator && this.unreadCount === 0) {
            navigator.clearAppBadge();
        }
    }

    checkOverdueTasks() {
        const now = new Date();
        appState.tasks.forEach(task => {
            if (!task.completed && task.due !== 'No deadline') {
                const dueDate = new Date(task.due);
                const hoursDiff = (dueDate - now) / (1000 * 60 * 60);
                
                if (hoursDiff <= 24 && hoursDiff > 0) {
                    this.addNotification({
                        id: Date.now(),
                        type: 'deadline',
                        title: 'Task Due Soon',
                        message: `"${task.title}" is due in ${Math.ceil(hoursDiff)} hours`,
                        timestamp: new Date().toISOString(),
                        read: false,
                        priority: 'high'
                    });
                }
            }
        });
    }

    sendStudyReminder() {
        this.addNotification({
            id: Date.now(),
            type: 'reminder',
            title: 'Study Time!',
            message: 'Time to focus on your studies. You can do it! 💪',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
        });
    }
}

// ===== PROFILE MANAGEMENT =====
class ProfileManager {
    constructor() {
        this.userPreferences = appState.userPreferences;
        this.setupProfileListeners();
        this.loadUserData();
    }

    setupProfileListeners() {
        // Edit profile button
        elements.editProfileBtn?.addEventListener('click', () => {
            this.openSettings('personal');
        });

        // Preference changes
        elements.dailyGoal?.addEventListener('change', (e) => {
            this.updatePreference('dailyGoal', parseInt(e.target.value));
        });

        elements.focusMode?.addEventListener('change', (e) => {
            this.updatePreference('focusMode', e.target.checked);
        });

        elements.breakReminders?.addEventListener('change', (e) => {
            this.updatePreference('breakReminders', e.target.checked);
        });

        elements.studyAnalytics?.addEventListener('change', (e) => {
            this.updatePreference('studyAnalytics', e.target.checked);
        });

        // Settings modal
        elements.closeSettingsModal?.addEventListener('click', () => {
            this.closeSettings();
        });

        // Settings tabs
        elements.settingsTabs?.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchSettingsTab(tabId);
            });
        });

        // Disconnect Google
        elements.disconnectGoogle?.addEventListener('click', () => {
            if (confirm('Are you sure you want to disconnect Google account?')) {
                showToast('Google account disconnected', 'info');
            }
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === elements.settingsModal) {
                this.closeSettings();
            }
        });
    }

    loadUserData() {
        const savedUser = localStorage.getItem('studylonger_user');
        const savedPrefs = localStorage.getItem('studylonger_preferences');
        
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            this.updateProfileUI();
        }
        
        if (savedPrefs) {
            this.userPreferences = JSON.parse(savedPrefs);
            appState.userPreferences = this.userPreferences;
            this.updatePreferenceUI();
        }
    }

    updateProfileUI() {
        if (!currentUser) return;

        // Update profile page
        elements.profileName.textContent = currentUser.name || 'Guest User';
        elements.profileEmail.textContent = currentUser.email || 'guest@studylonger.com';
        elements.profileAvatarText.textContent = currentUser.name?.charAt(0).toUpperCase() || 'G';
        elements.profileLevel.textContent = currentUser.level || 1;
        elements.profileXP.textContent = currentUser.xp || 0;
        elements.profileStreak.textContent = currentUser.streak || 0;
    }

    updatePreferenceUI() {
        if (elements.dailyGoal) elements.dailyGoal.value = this.userPreferences.dailyGoal;
        if (elements.focusMode) elements.focusMode.checked = this.userPreferences.focusMode;
        if (elements.breakReminders) elements.breakReminders.checked = this.userPreferences.breakReminders;
        if (elements.studyAnalytics) elements.studyAnalytics.checked = this.userPreferences.studyAnalytics;
    }

    updatePreference(key, value) {
        this.userPreferences[key] = value;
        appState.userPreferences = this.userPreferences;
        localStorage.setItem('studylonger_preferences', JSON.stringify(this.userPreferences));
        showToast('Preference updated successfully!', 'success');
    }

    openSettings(tab = 'personal') {
        elements.settingsModal.classList.add('active');
        this.switchSettingsTab(tab);
        this.loadSettingsContent(tab);
    }

    closeSettings() {
        elements.settingsModal.classList.remove('active');
    }

    switchSettingsTab(tabId) {
        elements.settingsTabs?.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });
    }

    loadSettingsContent(tab) {
        const contentDiv = elements.settingsContent;
        if (!contentDiv) return;
        
        const templates = {
            personal: `
                <h3>Personal Information</h3>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="settingsName" value="${currentUser?.name || ''}" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="settingsEmail" value="${currentUser?.email || ''}" placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label>Bio</label>
                    <textarea id="settingsBio" placeholder="Tell us about yourself">${currentUser?.bio || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Profile Picture</label>
                    <input type="file" id="profilePicture" accept="image/*" class="file-input">
                    <small>Upload a profile picture (JPG, PNG, max 2MB)</small>
                </div>
                <button class="btn" id="savePersonalInfo">Save Changes</button>
            `,
            security: `
                <h3>Security Settings</h3>
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" id="currentPassword" placeholder="Enter current password">
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" id="newPassword" placeholder="Enter new password">
                </div>
                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm new password">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="twoFactorAuth">
                        Enable Two-Factor Authentication
                    </label>
                </div>
                <button class="btn" id="changePassword">Update Password</button>
            `,
            notifications: `
                <h3>Notification Preferences</h3>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="emailNotifs" ${this.userPreferences.emailNotifications ? 'checked' : ''}>
                        Email Notifications
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="pushNotifs" ${this.userPreferences.pushNotifications ? 'checked' : ''}>
                        Push Notifications
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="soundEnabled" ${this.userPreferences.soundEnabled ? 'checked' : ''}>
                        Sound Alerts
                    </label>
                </div>
                <div class="form-group">
                    <label>Study Reminders</label>
                    <select id="reminderFrequency" class="preference-select">
                        <option value="hourly">Every hour</option>
                        <option value="daily" selected>Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
                <button class="btn" id="saveNotificationSettings">Save Preferences</button>
            `
        };

        contentDiv.innerHTML = templates[tab] || templates.personal;
        
        // Add event listeners to the new buttons
        setTimeout(() => {
            document.getElementById('savePersonalInfo')?.addEventListener('click', () => this.savePersonalInfo());
            document.getElementById('changePassword')?.addEventListener('click', () => this.changePassword());
            document.getElementById('saveNotificationSettings')?.addEventListener('click', () => this.saveNotificationSettings());
        }, 100);
    }

    savePersonalInfo() {
        const name = document.getElementById('settingsName')?.value.trim();
        const email = document.getElementById('settingsEmail')?.value.trim();
        const bio = document.getElementById('settingsBio')?.value.trim();

        if (name && currentUser) {
            currentUser.name = name;
            currentUser.email = email;
            currentUser.bio = bio;

            localStorage.setItem('studylonger_user', JSON.stringify(currentUser));
            this.updateProfileUI();
            
            // Update global UI
            elements.userName.textContent = name;
            elements.userAvatar.textContent = name.charAt(0).toUpperCase();
            
            showToast('Profile updated successfully!', 'success');
            this.closeSettings();
        }
    }

    changePassword() {
        const currentPass = document.getElementById('currentPassword')?.value;
        const newPass = document.getElementById('newPassword')?.value;
        const confirmPass = document.getElementById('confirmPassword')?.value;

        if (!currentPass || !newPass || !confirmPass) {
            showToast('Please fill in all password fields', 'error');
            return;
        }

        if (newPass !== confirmPass) {
            showToast('New passwords do not match', 'error');
            return;
        }

        if (newPass.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        showToast('Password updated successfully!', 'success');
        
        // Clear fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    saveNotificationSettings() {
        const emailNotifs = document.getElementById('emailNotifs')?.checked || false;
        const pushNotifs = document.getElementById('pushNotifs')?.checked || false;
        const soundEnabled = document.getElementById('soundEnabled')?.checked || false;

        this.userPreferences.emailNotifications = emailNotifs;
        this.userPreferences.pushNotifications = pushNotifs;
        this.userPreferences.soundEnabled = soundEnabled;

        appState.userPreferences = this.userPreferences;
        localStorage.setItem('studylonger_preferences', JSON.stringify(this.userPreferences));
        showToast('Notification preferences saved!', 'success');
        this.closeSettings();
    }
}

// ===== STUDY ROOMS MANAGER =====
class StudyRoomsManager {
    constructor() {
        this.rooms = appState.studyRooms;
        this.challenges = appState.challenges;
        this.leaderboard = appState.leaderboard;
        this.studyBuddies = appState.studyBuddies;
        this.focusTimer = appState.focusTimer;
        
        this.setupStudyRoomsListeners();
        this.loadStudyRoomsData();
        this.initFocusTimer();
        this.initSampleData();
    }

    setupStudyRoomsListeners() {
        // Room creation
        elements.createRoomBtn?.addEventListener('click', () => this.createRoom());
        
        // Challenge creation
        elements.createChallengeBtn?.addEventListener('click', () => this.showChallengeForm());
        elements.saveChallengeBtn?.addEventListener('click', () => this.createChallenge());
        elements.cancelChallengeBtn?.addEventListener('click', () => this.hideChallengeForm());
        
        // Timer controls
        elements.startTimer?.addEventListener('click', () => this.startFocusTimer());
        elements.pauseTimer?.addEventListener('click', () => this.pauseFocusTimer());
        elements.resetTimer?.addEventListener('click', () => this.resetFocusTimer());
        elements.timerDuration?.addEventListener('change', (e) => this.setTimerDuration(e.target.value));
        
        // Study Rooms tabs
        elements.studyRoomsTabs?.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchStudyRoomsTab(tabId);
            });
        });
        
        // Leaderboard tabs
        elements.leaderboardTabs?.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.switchLeaderboardPeriod(period);
            });
        });
        
        // Buddy search
        elements.searchBuddiesBtn?.addEventListener('click', () => this.searchBuddies());
        elements.findCompatibleBtn?.addEventListener('click', () => this.findCompatibleBuddies());
        
        // Quick join room
        document.addEventListener('click', (e) => {
            if (e.target.closest('.room-card .btn') && !e.target.closest('.room-actions .btn-secondary')) {
                const roomCard = e.target.closest('.room-card');
                if (roomCard) {
                    const roomId = parseInt(roomCard.dataset.id);
                    this.joinRoom(roomId);
                }
            }
        });
    }

    initFocusTimer() {
        // Update timer every second
        setInterval(() => {
            if (this.focusTimer.isRunning && this.focusTimer.timeLeft > 0) {
                this.focusTimer.timeLeft--;
                this.updateTimerDisplay();
                
                // Notify when timer ends
                if (this.focusTimer.timeLeft === 0) {
                    this.timerComplete();
                }
            }
        }, 1000);
    }

    initSampleData() {
        // Initialize with sample data if empty
        if (this.rooms.length === 0) {
            this.rooms = [
                {
                    id: 1,
                    name: 'Math Study Group',
                    subject: 'Calculus',
                    participants: 3,
                    maxParticipants: 6,
                    duration: 90,
                    isPublic: true,
                    createdAt: '2024-03-10',
                    createdBy: 'Alex Chen'
                },
                {
                    id: 2,
                    name: 'CS Revision',
                    subject: 'Algorithms',
                    participants: 2,
                    maxParticipants: 4,
                    duration: 60,
                    isPublic: true,
                    createdAt: '2024-03-11',
                    createdBy: 'Maria Garcia'
                },
                {
                    id: 3,
                    name: 'Physics Lab Prep',
                    subject: 'Physics',
                    participants: 5,
                    maxParticipants: 8,
                    duration: 120,
                    isPublic: true,
                    createdAt: '2024-03-12',
                    createdBy: 'John Doe'
                }
            ];
            appState.studyRooms = this.rooms;
            this.saveRooms();
        }

        if (this.challenges.length === 0) {
            this.challenges = [
                {
                    id: 1,
                    title: 'Weekend Study Marathon',
                    description: 'Study for 8 hours over the weekend',
                    type: 'study_time',
                    goal: 480,
                    deadline: '2024-03-17',
                    participants: 12,
                    createdBy: 'StudyLonger Team',
                    createdAt: '2024-03-10'
                },
                {
                    id: 2,
                    title: 'Task Completion Challenge',
                    description: 'Complete 15 tasks this week',
                    type: 'tasks_completed',
                    goal: 15,
                    deadline: '2024-03-15',
                    participants: 8,
                    createdBy: 'Alex Johnson',
                    createdAt: '2024-03-09'
                }
            ];
            appState.challenges = this.challenges;
            this.saveChallenges();
        }

        if (this.leaderboard.length === 0) {
            this.generateLeaderboardData();
        }
    }

    loadStudyRoomsData() {
        const savedRooms = localStorage.getItem('studylonger_studyRooms');
        const savedChallenges = localStorage.getItem('studylonger_challenges');
        const savedLeaderboard = localStorage.getItem('studylonger_leaderboard');
        
        if (savedRooms) {
            this.rooms = JSON.parse(savedRooms);
            appState.studyRooms = this.rooms;
        }
        
        if (savedChallenges) {
            this.challenges = JSON.parse(savedChallenges);
            appState.challenges = this.challenges;
        }
        
        if (savedLeaderboard) {
            this.leaderboard = JSON.parse(savedLeaderboard);
            appState.leaderboard = this.leaderboard;
        }
        
        this.renderRooms();
        this.renderChallenges();
        this.renderLeaderboard('weekly');
    }

    saveRooms() {
        localStorage.setItem('studylonger_studyRooms', JSON.stringify(this.rooms));
    }

    saveChallenges() {
        localStorage.setItem('studylonger_challenges', JSON.stringify(this.challenges));
    }

    saveLeaderboard() {
        localStorage.setItem('studylonger_leaderboard', JSON.stringify(this.leaderboard));
    }

    createRoom() {
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'English', 'History', 'General'];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        
        const room = {
            id: Date.now(),
            name: `${randomSubject} Study Room ${this.rooms.length + 1}`,
            subject: randomSubject,
            participants: 1,
            maxParticipants: Math.floor(Math.random() * 4) + 4, // 4-7 participants
            duration: [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)],
            isPublic: true,
            createdAt: new Date().toISOString(),
            createdBy: currentUser?.name || 'Anonymous'
        };
        
        this.rooms.unshift(room);
        appState.studyRooms = this.rooms;
        this.saveRooms();
        this.renderRooms();
        
        showToast(`Created "${room.name}"`, 'success');
        
        // Add notification
        if (notificationSystem) {
            notificationSystem.addNotification({
                id: Date.now(),
                type: 'friend',
                title: 'Study Room Created',
                message: `"${room.name}" is now active. Invite friends to join!`,
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'medium'
            });
        }
    }

    joinRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            if (room.participants >= room.maxParticipants) {
                showToast('This room is full!', 'warning');
                return;
            }
            
            room.participants++;
            this.saveRooms();
            this.renderRooms();
            
            showToast(`Joined "${room.name}"`, 'success');
            
            // Update participants count in timer
            if (elements.participantsCount) {
                const currentCount = parseInt(elements.participantsCount.textContent) || 4;
                elements.participantsCount.textContent = `${currentCount + 1} people studying together`;
            }
        }
    }

    inviteToRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            showToast(`Invite link copied for "${room.name}"`, 'success');
            // In a real app, you would generate and copy an invite link
        }
    }

    createChallenge() {
        const title = elements.challengeTitle.value.trim();
        const description = elements.challengeDescription.value.trim();
        const type = elements.challengeType.value;
        const goal = parseInt(elements.challengeGoal.value);
        const deadline = elements.challengeDeadline.value;
        
        if (!title || !goal || !deadline) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        const challenge = {
            id: Date.now(),
            title,
            description,
            type,
            goal,
            deadline,
            participants: 0,
            createdBy: currentUser?.name || 'Anonymous',
            createdAt: new Date().toISOString()
        };
        
        this.challenges.unshift(challenge);
        appState.challenges = this.challenges;
        this.saveChallenges();
        this.renderChallenges();
        this.hideChallengeForm();
        
        showToast('Challenge created successfully!', 'success');
    }

    joinChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge) {
            challenge.participants++;
            this.saveChallenges();
            this.renderChallenges();
            
            showToast(`Joined "${challenge.title}" challenge!`, 'success');
        }
    }

    showChallengeForm() {
        elements.challengeForm.style.display = 'block';
        // Set default deadline to 7 days from now
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        elements.challengeDeadline.value = nextWeek.toISOString().split('T')[0];
    }

    hideChallengeForm() {
        elements.challengeForm.style.display = 'none';
        // Clear form
        elements.challengeTitle.value = '';
        elements.challengeDescription.value = '';
        elements.challengeGoal.value = '';
    }

    startFocusTimer() {
        this.focusTimer.isRunning = true;
        showToast('Focus timer started! Good luck studying!', 'success');
    }

    pauseFocusTimer() {
        this.focusTimer.isRunning = false;
        showToast('Timer paused', 'info');
    }

    resetFocusTimer() {
        const duration = parseInt(elements.timerDuration.value) * 60;
        this.focusTimer.timeLeft = duration;
        this.focusTimer.duration = duration;
        this.focusTimer.isRunning = false;
        this.updateTimerDisplay();
        showToast('Timer reset', 'info');
    }

    setTimerDuration(minutes) {
        if (!this.focusTimer.isRunning) {
            this.focusTimer.duration = minutes * 60;
            this.focusTimer.timeLeft = minutes * 60;
            this.updateTimerDisplay();
        }
    }

    updateTimerDisplay() {
        if (!elements.timerDisplay) return;
        
        const minutes = Math.floor(this.focusTimer.timeLeft / 60);
        const seconds = this.focusTimer.timeLeft % 60;
        elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress color when time is running low
        if (this.focusTimer.timeLeft < 300) { // Less than 5 minutes
            elements.timerDisplay.style.color = '#f59e0b';
        } else if (this.focusTimer.timeLeft < 60) { // Less than 1 minute
            elements.timerDisplay.style.color = '#ef4444';
        } else {
            elements.timerDisplay.style.color = 'white';
        }
    }

    timerComplete() {
        this.focusTimer.isRunning = false;
        showToast('Time\'s up! Take a 5-minute break! 🎉', 'success');
        
        // Add XP for completing a focus session
        if (currentUser) {
            currentUser.xp = (currentUser.xp || 0) + 25;
            localStorage.setItem('studylonger_user', JSON.stringify(currentUser));
            updateDashboard();
        }
        
        // Play notification sound (if enabled)
        if (appState.userPreferences.soundEnabled) {
            // In a real app, you would play a sound here
        }
    }

    switchStudyRoomsTab(tabId) {
        // Update active tab button
        elements.studyRoomsTabs?.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });
        
        // Show corresponding tab content
        document.querySelectorAll('#study-rooms .tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    }

    switchLeaderboardPeriod(period) {
        // Update active tab
        elements.leaderboardTabs?.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-period') === period) {
                tab.classList.add('active');
            }
        });
        
        this.renderLeaderboard(period);
    }

    generateLeaderboardData() {
        const names = ['Alex Chen', 'Maria Garcia', 'James Wilson', 'Sarah Johnson', 'David Lee', 
                      'Emily Brown', 'Michael Davis', 'Jessica Miller', 'Daniel Martinez', 'Sophia Anderson'];
        
        this.leaderboard = names.map((name, index) => ({
            id: index + 1,
            name,
            xp: 2000 - (index * 150) + Math.floor(Math.random() * 100),
            studyHours: 50 - (index * 3) + Math.floor(Math.random() * 10),
            rank: index + 1
        }));
        
        appState.leaderboard = this.leaderboard;
        this.saveLeaderboard();
    }

    searchBuddies() {
        const query = elements.findBuddies.value.toLowerCase();
        if (query.length < 2) {
            showToast('Please enter at least 2 characters to search', 'warning');
            return;
        }
        
        // Simulate search results
        const results = [
            {
                id: 1,
                name: 'Alex Chen',
                subjects: ['Mathematics', 'Physics'],
                studyTime: 'evening',
                compatibility: 92,
                xp: 1850
            },
            {
                id: 2,
                name: 'Maria Garcia',
                subjects: ['Computer Science', 'Mathematics'],
                studyTime: 'afternoon',
                compatibility: 87,
                xp: 2100
            }
        ].filter(buddy => 
            buddy.name.toLowerCase().includes(query) ||
            buddy.subjects.some(subject => subject.toLowerCase().includes(query))
        );
        
        this.renderBuddies(results);
    }

    findCompatibleBuddies() {
        const subject = elements.subjectFilter.value;
        const studyTime = elements.studyTimeFilter.value;
        
        // Simulate finding compatible study buddies
        const compatibleBuddies = [
            {
                id: 1,
                name: 'Alex Chen',
                subjects: ['Mathematics', 'Physics'],
                studyTime: 'evening',
                compatibility: 92,
                xp: 1850,
                avatar: 'AC'
            },
            {
                id: 2,
                name: 'Maria Garcia',
                subjects: ['Computer Science', 'Mathematics'],
                studyTime: 'afternoon',
                compatibility: 87,
                xp: 2100,
                avatar: 'MG'
            },
            {
                id: 3,
                name: 'James Wilson',
                subjects: ['Physics', 'Chemistry'],
                studyTime: 'morning',
                compatibility: 78,
                xp: 1450,
                avatar: 'JW'
            },
            {
                id: 4,
                name: 'Sarah Johnson',
                subjects: ['Biology', 'Chemistry'],
                studyTime: 'evening',
                compatibility: 85,
                xp: 1950,
                avatar: 'SJ'
            }
        ].filter(buddy => {
            if (subject && !buddy.subjects.some(s => s.toLowerCase().includes(subject))) {
                return false;
            }
            if (studyTime && buddy.studyTime !== studyTime) {
                return false;
            }
            return true;
        });
        
        this.renderCompatibleBuddies(compatibleBuddies);
    }

    renderRooms() {
        if (!elements.roomsGrid) return;
        
        if (this.rooms.length === 0) {
            elements.roomsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h4>No active study rooms</h4>
                    <p>Create a room to start studying with others!</p>
                    <button class="btn" id="createFirstRoom">Create First Room</button>
                </div>
            `;
            
            document.getElementById('createFirstRoom')?.addEventListener('click', () => this.createRoom());
            return;
        }
        
        elements.roomsGrid.innerHTML = this.rooms.map(room => `
            <div class="room-card" data-id="${room.id}">
                <div class="room-header">
                    <h4>${room.name}</h4>
                    <span class="room-status ${room.participants >= room.maxParticipants ? 'full' : 'open'}">
                        ${room.participants}/${room.maxParticipants}
                    </span>
                </div>
                <p class="room-subject">${room.subject}</p>
                <div class="room-meta">
                    <span><i class="fas fa-clock"></i> ${room.duration} min</span>
                    <span><i class="fas fa-user"></i> ${room.createdBy}</span>
                </div>
                <div class="room-actions">
                    <button class="btn" ${room.participants >= room.maxParticipants ? 'disabled style="opacity: 0.5;"' : ''}>
                        ${room.participants >= room.maxParticipants ? 'Full' : 'Join Room'}
                    </button>
                    <button class="btn btn-secondary" onclick="studyRoomsManager.inviteToRoom(${room.id})">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderChallenges() {
        if (!elements.challengesGrid) return;
        
        if (this.challenges.length === 0) {
            elements.challengesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <h4>No active challenges</h4>
                    <p>Create a challenge to compete with friends!</p>
                </div>
            `;
            return;
        }
        
        elements.challengesGrid.innerHTML = this.challenges.map(challenge => {
            const progress = Math.min(100, Math.floor(Math.random() * 100));
            return `
                <div class="challenge-card">
                    <div class="room-header">
                        <h4>${challenge.title}</h4>
                        <span class="challenge-type">${challenge.type.replace('_', ' ')}</span>
                    </div>
                    <p>${challenge.description}</p>
                    <div class="challenge-progress" style="margin: 1rem 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Progress</span>
                            <span>${progress}%</span>
                        </div>
                        <div class="progress-bar" style="height: 8px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden;">
                            <div class="progress-fill" style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary));"></div>
                        </div>
                    </div>
                    <div class="room-meta">
                        <span><i class="fas fa-users"></i> ${challenge.participants} participants</span>
                        <span><i class="fas fa-calendar"></i> ${challenge.deadline}</span>
                    </div>
                    <button class="btn" onclick="studyRoomsManager.joinChallenge(${challenge.id})" style="margin-top: 1rem;">
                        Join Challenge
                    </button>
                </div>
            `;
        }).join('');
    }

    renderLeaderboard(period = 'weekly') {
        if (!elements.leaderboardList) return;
        
        const leaderboardData = this.leaderboard.slice(0, 10); // Top 10
        
        elements.leaderboardList.innerHTML = leaderboardData.map(entry => `
            <div class="leaderboard-entry">
                <span class="rank">#${entry.rank}</span>
                <div class="user-info">
                    <div class="avatar">${entry.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <h5>${entry.name}</h5>
                        <p>${entry.studyHours}h studied • ${period} ranking</p>
                    </div>
                </div>
                <div class="leaderboard-xp">${entry.xp} XP</div>
            </div>
        `).join('');
    }

    renderBuddies(buddies) {
        if (!elements.buddiesGrid) return;
        
        if (buddies.length === 0) {
            elements.buddiesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends"></i>
                    <h4>No buddies found</h4>
                    <p>Try different search terms or filters</p>
                </div>
            `;
            return;
        }
        
        elements.buddiesGrid.innerHTML = buddies.map(buddy => `
            <div class="buddy-card">
                <div class="buddy-avatar">${buddy.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="buddy-info">
                    <h5>${buddy.name}</h5>
                    <p>${buddy.subjects.join(', ')} • ${buddy.xp} XP</p>
                </div>
                <div class="compatibility-score">${buddy.compatibility}%</div>
            </div>
        `).join('');
    }

    renderCompatibleBuddies(buddies) {
        if (!elements.buddiesGrid) return;
        
        if (buddies.length === 0) {
            elements.buddiesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends"></i>
                    <h4>No compatible buddies found</h4>
                    <p>Try different filters or check back later</p>
                </div>
            `;
            return;
        }
        
        elements.buddiesGrid.innerHTML = buddies.map(buddy => `
            <div class="buddy-card">
                <div class="buddy-avatar">${buddy.avatar}</div>
                <div class="buddy-info">
                    <h5>${buddy.name}</h5>
                    <p>${buddy.subjects.join(', ')} • ${buddy.studyTime}</p>
                </div>
                <div class="compatibility-score">${buddy.compatibility}%</div>
            </div>
        `).join('');
    }
}

// ===== GLOBAL INSTANCES =====
let notificationSystem;
let profileManager;
let studyRoomsManager;

// ===== INITIALIZATION =====
function initApp() {
    // Hide loading screen
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Check auth state
    checkAuthState();
    
    // Initialize systems
    notificationSystem = new NotificationSystem();
    profileManager = new ProfileManager();
    studyRoomsManager = new StudyRoomsManager();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize charts
    initCharts();
    
    // Load sample data
    loadSampleData();
    
    // Set default date for inputs
    setDefaultDates();
    
    // Start study reminders
    startStudyReminders();
    
    // Check for push notification permission
    checkPushPermission();
    
    console.log('StudyLonger initialized 🚀');
}

// ===== AUTHENTICATION =====
function checkAuthState() {
    const savedUser = localStorage.getItem('studylonger_user');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedIn(currentUser);
    } else {
        updateUIForLoggedOut();
    }
}

function updateUIForLoggedIn(user) {
    elements.userName.textContent = user.name || 'User';
    elements.userRole.textContent = user.role || 'Student';
    elements.userAvatar.textContent = user.name?.charAt(0).toUpperCase() || 'U';
    elements.loginBtn.style.display = 'none';
    
    // Update profile UI if profile manager is initialized
    if (profileManager) {
        profileManager.updateProfileUI();
    }
    
    // Show admin nav if user is admin
    if (user.role === 'admin') {
        document.getElementById('admin-nav').classList.remove('hidden');
    }
}

function updateUIForLoggedOut() {
    elements.userName.textContent = 'Guest User';
    elements.userRole.textContent = 'Not logged in';
    elements.userAvatar.textContent = 'G';
    elements.loginBtn.style.display = 'flex';
    document.getElementById('admin-nav').classList.add('hidden');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Menu toggle
    elements.menuToggle.addEventListener('click', toggleSidebar);
    
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            switchPage(pageId);
            
            // Update active nav item
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Quick action cards
    elements.actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const pageId = card.getAttribute('data-page');
            switchPage(pageId);
        });
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Login button
    elements.loginBtn.addEventListener('click', () => {
        showModal(elements.loginModal);
    });
    
    // Close modals
    elements.closeLoginModal.addEventListener('click', () => {
        hideModal(elements.loginModal);
    });
    
    // Auth tabs
    elements.authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAuthTab(tabId);
        });
    });
    
    // Login form
    elements.loginSubmitBtn.addEventListener('click', handleLogin);
    elements.loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Signup form
    elements.signupSubmitBtn.addEventListener('click', handleSignup);
    
    // Social login
    elements.googleLogin.addEventListener('click', handleGoogleLogin);
    elements.githubLogin.addEventListener('click', handleGitHubLogin);
    
    // Student life tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchStudentTab(tabId);
        });
    });
    
    // Tasks
    elements.addTaskBtn.addEventListener('click', addTask);
    
    // Goals
    elements.addGoalBtn.addEventListener('click', addGoal);
    
    // Assignments
    elements.addAssignmentBtn.addEventListener('click', addAssignment);
    
    // Notes
    elements.saveNoteBtn.addEventListener('click', saveNote);
    
    // Test Generator
    elements.generateTopicsBtn.addEventListener('click', generateTopics);
    
    // Chatbot
    elements.sendMessageBtn.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Quick questions
    elements.quickQuestions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const question = e.target.textContent;
            sendQuickQuestion(question);
        });
    });
    
    // Live Chat
    elements.sendLiveMessageBtn.addEventListener('click', sendLiveMessage);
    elements.liveChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendLiveMessage();
    });
    
    // Chatbot widget
    elements.chatbotWidget.addEventListener('click', () => {
        switchPage('chatbot');
    });
    
    // Global search
    elements.globalSearch.addEventListener('input', handleSearch);
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) {
            hideModal(elements.loginModal);
        }
    });
    
    // Push notification buttons
    elements.enablePushBtn?.addEventListener('click', requestPushPermission);
    elements.dismissPushBtn?.addEventListener('click', () => {
        elements.pushPermissionBanner.style.display = 'none';
    });
    
    // Study Rooms page switch
    elements.studyRoomsTabs?.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabId = e.target.getAttribute('data-tab');
            switchStudyRoomsTab(tabId);
        });
    });
}

// ===== PAGE NAVIGATION =====
function switchPage(pageId) {
    // Hide all pages
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageId;
        
        // Update document title
        document.title = `${pageId.charAt(0).toUpperCase() + pageId.slice(1).replace('-', ' ')} | StudyLonger`;
        
        // Close sidebar on mobile
        if (window.innerWidth < 992) {
            toggleSidebar();
        }
        
        // Update profile page if needed
        if (pageId === 'profile' && profileManager) {
            profileManager.updateProfileUI();
        }
        
        // Update study rooms page if needed
        if (pageId === 'study-rooms' && studyRoomsManager) {
            studyRoomsManager.renderRooms();
            studyRoomsManager.renderChallenges();
        }
    }
}

function switchStudyRoomsTab(tabId) {
    if (studyRoomsManager) {
        studyRoomsManager.switchStudyRoomsTab(tabId);
    }
}

function toggleSidebar() {
    elements.sidebar.classList.toggle('active');
    elements.mainContent.classList.toggle('expanded');
    
    // Update menu icon
    const icon = elements.menuToggle.querySelector('i');
    if (elements.sidebar.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    appState.isDarkMode = !appState.isDarkMode;
    const icon = elements.themeToggle.querySelector('i');
    
    if (appState.isDarkMode) {
        document.documentElement.style.setProperty('--bg-primary', '#0f172a');
        document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
        icon.className = 'fas fa-moon';
    } else {
        document.documentElement.style.setProperty('--bg-primary', '#f8fafc');
        document.documentElement.style.setProperty('--bg-secondary', '#f1f5f9');
        icon.className = 'fas fa-sun';
    }
    
    localStorage.setItem('studylonger_theme', appState.isDarkMode ? 'dark' : 'light');
}

// ===== AUTH FUNCTIONS =====
function switchAuthTab(tabId) {
    // Update active tab
    elements.authTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });
    
    // Show corresponding form
    elements.loginForm.classList.remove('active');
    elements.signupForm.classList.remove('active');
    document.getElementById(`${tabId}Form`).classList.add('active');
}

async function handleLogin() {
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value.trim();
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        // For demo purposes - in production, use Firebase Auth
        const user = {
            name: email.split('@')[0],
            email: email,
            role: 'student',
            xp: 450,
            level: 3,
            streak: 7,
            bio: 'Passionate student learning new things every day!'
        };
        
        localStorage.setItem('studylonger_user', JSON.stringify(user));
        currentUser = user;
        
        updateUIForLoggedIn(user);
        hideModal(elements.loginModal);
        showToast('Login successful!', 'success');
        
        // Update dashboard
        updateDashboard();
        
        // Add login notification
        if (notificationSystem) {
            notificationSystem.addNotification({
                id: Date.now(),
                type: 'system',
                title: 'Welcome Back!',
                message: 'Great to see you again. Ready to study?',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'low'
            });
        }
        
    } catch (error) {
        showToast('Login failed: ' + error.message, 'error');
    }
}

async function handleSignup() {
    const name = elements.signupName.value.trim();
    const email = elements.signupEmail.value.trim();
    const password = elements.signupPassword.value.trim();
    const role = elements.userRoleSelect.value;
    
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const user = {
            name: name,
            email: email,
            role: role,
            xp: 0,
            level: 1,
            streak: 1,
            bio: 'New student ready to learn!'
        };
        
        localStorage.setItem('studylonger_user', JSON.stringify(user));
        currentUser = user;
        
        updateUIForLoggedIn(user);
        hideModal(elements.loginModal);
        showToast('Account created successfully!', 'success');
        
        // Update dashboard
        updateDashboard();
        
        // Add welcome notification
        if (notificationSystem) {
            notificationSystem.addNotification({
                id: Date.now(),
                type: 'system',
                title: 'Welcome to StudyLonger!',
                message: 'Get started by exploring all the features available to you.',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'low'
            });
        }
        
    } catch (error) {
        showToast('Signup failed: ' + error.message, 'error');
    }
}

async function handleGoogleLogin() {
    try {
        if (window.auth && window.googleProvider) {
            const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js');
            const result = await signInWithPopup(window.auth, window.googleProvider);
            const user = result.user;
            
            const userData = {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                role: 'student',
                xp: 0,
                level: 1,
                streak: 1,
                bio: 'Google account user'
            };
            
            localStorage.setItem('studylonger_user', JSON.stringify(userData));
            currentUser = userData;
            
            updateUIForLoggedIn(userData);
            hideModal(elements.loginModal);
            showToast('Google login successful!', 'success');
            
            // Update dashboard
            updateDashboard();
            
            // Add notification
            if (notificationSystem) {
                notificationSystem.addNotification({
                    id: Date.now(),
                    type: 'system',
                    title: 'Google Account Connected',
                    message: 'Your Google account has been successfully connected.',
                    timestamp: new Date().toISOString(),
                    read: false,
                    priority: 'low'
                });
            }
        }
    } catch (error) {
        showToast('Google login failed', 'error');
    }
}

async function handleGitHubLogin() {
    // GitHub login implementation
    showToast('GitHub login coming soon!', 'info');
}

// ===== MODAL FUNCTIONS =====
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== STUDENT LIFE TABS =====
function switchStudentTab(tabId) {
    // Update active tab button
    elements.tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Show corresponding tab content
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        }
    });
}

// ===== TASK MANAGEMENT =====
function addTask() {
    const title = elements.taskTitle.value.trim();
    const priority = elements.taskPriority.value;
    const due = elements.taskDue.value;
    
    if (!title) {
        showToast('Please enter a task title', 'warning');
        return;
    }
    
    const task = {
        id: Date.now(),
        title: title,
        priority: priority,
        due: due || 'No deadline',
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    appState.tasks.push(task);
    renderTasks();
    updateDashboard();
    
    // Clear form
    elements.taskTitle.value = '';
    elements.taskDue.value = '';
    
    showToast('Task added successfully!', 'success');
    
    // Add notification
    if (notificationSystem) {
        notificationSystem.addNotification({
            id: Date.now(),
            type: 'reminder',
            title: 'New Task Added',
            message: `"${title}" has been added to your task list`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
        });
    }
}

function renderTasks() {
    if (!elements.taskList) return;
    
    elements.taskList.innerHTML = '';
    
    appState.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                onclick="toggleTaskCompletion(${task.id})">
            <div class="task-content">
                <h4>${task.title}</h4>
                <div class="task-meta">
                    <span>Priority: ${task.priority}</span>
                    <span>Due: ${task.due}</span>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        elements.taskList.appendChild(taskElement);
    });
}

function toggleTaskCompletion(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateDashboard();
        
        if (task.completed) {
            showToast('Task completed! +10 XP', 'success');
            
            // Add XP to user
            if (currentUser) {
                currentUser.xp = (currentUser.xp || 0) + 10;
                localStorage.setItem('studylonger_user', JSON.stringify(currentUser));
                updateDashboard();
            }
            
            // Add notification
            if (notificationSystem) {
                notificationSystem.addNotification({
                    id: Date.now(),
                    type: 'achievement',
                    title: 'Task Completed!',
                    message: `You completed "${task.title}" and earned 10 XP!`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    priority: 'low'
                });
            }
        }
    }
}

function deleteTask(taskId) {
    appState.tasks = appState.tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateDashboard();
    showToast('Task deleted', 'info');
}

// ===== GOAL MANAGEMENT =====
function addGoal() {
    const title = elements.goalTitle.value.trim();
    const description = elements.goalDescription.value.trim();
    const deadline = elements.goalDeadline.value;
    
    if (!title) {
        showToast('Please enter a goal title', 'warning');
        return;
    }
    
    const goal = {
        id: Date.now(),
        title: title,
        description: description,
        deadline: deadline || 'No deadline',
        progress: 0,
        createdAt: new Date().toISOString()
    };
    
    appState.goals.push(goal);
    renderGoals();
    
    // Clear form
    elements.goalTitle.value = '';
    elements.goalDescription.value = '';
    elements.goalDeadline.value = '';
    
    showToast('Goal added successfully!', 'success');
}

function renderGoals() {
    if (!elements.goalsList) return;
    
    elements.goalsList.innerHTML = '';
    
    appState.goals.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <h4>${goal.title}</h4>
                <span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;">
                    ${goal.progress}%
                </span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${goal.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${goal.progress}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                <span style="font-size: 0.875rem; color: var(--text-muted);">Deadline: ${goal.deadline}</span>
                <button class="btn btn-secondary" onclick="updateGoalProgress(${goal.id})">
                    <i class="fas fa-plus"></i> Update Progress
                </button>
            </div>
        `;
        elements.goalsList.appendChild(goalElement);
    });
}

function updateGoalProgress(goalId) {
    const goal = appState.goals.find(g => g.id === goalId);
    if (goal) {
        goal.progress = Math.min(100, goal.progress + 25);
        renderGoals();
        showToast('Goal progress updated!', 'success');
        
        if (goal.progress === 100) {
            showToast('Goal completed! 🎉', 'success');
            
            // Add XP to user
            if (currentUser) {
                currentUser.xp = (currentUser.xp || 0) + 50;
                localStorage.setItem('studylonger_user', JSON.stringify(currentUser));
                updateDashboard();
            }
        }
    }
}

// ===== ASSIGNMENT MANAGEMENT =====
function addAssignment() {
    const title = elements.assignmentTitle.value.trim();
    const subject = elements.assignmentSubject.value.trim();
    const description = elements.assignmentDescription.value.trim();
    const due = elements.assignmentDue.value;
    
    if (!title || !subject) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    
    const assignment = {
        id: Date.now(),
        title: title,
        subject: subject,
        description: description,
        due: due || 'No deadline',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    appState.assignments.push(assignment);
    renderAssignments();
    
    // Clear form
    elements.assignmentTitle.value = '';
    elements.assignmentSubject.value = '';
    elements.assignmentDescription.value = '';
    elements.assignmentDue.value = '';
    
    showToast('Assignment added successfully!', 'success');
}

function renderAssignments() {
    if (!elements.assignmentsList) return;
    
    elements.assignmentsList.innerHTML = '';
    
    appState.assignments.forEach(assignment => {
        const assignmentElement = document.createElement('div');
        assignmentElement.className = 'assignment-item';
        assignmentElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div>
                    <h4>${assignment.title}</h4>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">Subject: ${assignment.subject}</p>
                </div>
                <span style="background: var(--warning); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;">
                    ${assignment.status}
                </span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${assignment.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.875rem; color: var(--text-muted);">Due: ${assignment.due}</span>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" onclick="updateAssignmentStatus(${assignment.id})">
                        <i class="fas fa-check"></i> Mark Complete
                    </button>
                    <button class="btn btn-secondary" onclick="deleteAssignment(${assignment.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        elements.assignmentsList.appendChild(assignmentElement);
    });
}

function updateAssignmentStatus(assignmentId) {
    const assignment = appState.assignments.find(a => a.id === assignmentId);
    if (assignment) {
        assignment.status = assignment.status === 'pending' ? 'completed' : 'pending';
        renderAssignments();
        showToast('Assignment status updated!', 'success');
    }
}

function deleteAssignment(assignmentId) {
    appState.assignments = appState.assignments.filter(a => a.id !== assignmentId);
    renderAssignments();
    showToast('Assignment deleted', 'info');
}

// ===== NOTES MANAGEMENT =====
function saveNote() {
    const title = elements.noteTitle.value.trim();
    const subject = elements.noteSubject.value;
    const content = elements.noteContent.value.trim();
    
    if (!title || !content) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    
    const note = {
        id: Date.now(),
        title: title,
        subject: subject,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    appState.notes.push(note);
    renderNotes();
    
    // Clear form
    elements.noteTitle.value = '';
    elements.noteContent.value = '';
    
    showToast('Note saved successfully!', 'success');
}

function renderNotes() {
    if (!elements.notesGrid) return;
    
    elements.notesGrid.innerHTML = '';
    
    appState.notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            <h4>${note.title}</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">
                Subject: ${note.subject}
            </p>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                ${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">
                    ${new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" onclick="editNote(${note.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="deleteNote(${note.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        elements.notesGrid.appendChild(noteElement);
    });
}

function editNote(noteId) {
    const note = appState.notes.find(n => n.id === noteId);
    if (note) {
        elements.noteTitle.value = note.title;
        elements.noteSubject.value = note.subject;
        elements.noteContent.value = note.content;
        showToast('Note loaded for editing', 'info');
    }
}

function deleteNote(noteId) {
    appState.notes = appState.notes.filter(n => n.id !== noteId);
    renderNotes();
    showToast('Note deleted', 'info');
}

// ===== TEST GENERATOR =====
function generateTopics() {
    const subject = elements.testSubject.value;
    const material = elements.studyMaterial.value.trim();
    
    if (!subject || !material) {
        showToast('Please select a subject and paste study material', 'warning');
        return;
    }
    
    // Simulate AI topic extraction
    const topics = [
        'Basic Concepts and Definitions',
        'Fundamental Principles',
        'Key Formulas and Equations',
        'Problem-Solving Techniques',
        'Real-World Applications'
    ];
    
    renderTopics(topics);
    showToast('Topics generated successfully!', 'success');
}

function renderTopics(topics) {
    if (!elements.topicsList) return;
    
    elements.topicsList.innerHTML = '';
    
    topics.forEach((topic, index) => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic-item';
        topicElement.innerHTML = `
            <span>${index + 1}. ${topic}</span>
            <input type="checkbox" checked>
        `;
        elements.topicsList.appendChild(topicElement);
    });
    
    // Add generate questions button
    const generateBtn = document.createElement('button');
    generateBtn.className = 'btn';
    generateBtn.innerHTML = '<i class="fas fa-question-circle"></i> Generate Questions';
    generateBtn.onclick = generateQuestions;
    elements.topicsList.appendChild(generateBtn);
}

function generateQuestions() {
    const questions = [
        {
            question: 'Explain the fundamental concepts in your own words.',
            type: 'essay'
        },
        {
            question: 'What are the key formulas and when are they used?',
            type: 'short-answer'
        },
        {
            question: 'Solve a sample problem using the principles discussed.',
            type: 'problem-solving'
        }
    ];
    
    renderQuestions(questions);
    showToast('Questions generated successfully!', 'success');
}

function renderQuestions(questions) {
    if (!elements.testQuestions) return;
    
    elements.testQuestions.innerHTML = '<h3>Generated Questions</h3>';
    
    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-card';
        questionElement.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">Question ${index + 1}:</div>
            <p style="margin-bottom: 1rem;">${q.question}</p>
            <textarea placeholder="Your answer..." style="width: 100%; padding: 1rem; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); min-height: 100px;"></textarea>
        `;
        elements.testQuestions.appendChild(questionElement);
    });
}

// ===== CHATBOT =====
function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    addChatMessage(message, 'user');
    elements.chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "I can help you with study planning and academic questions.",
            "Based on your study patterns, I recommend taking regular breaks.",
            "Would you like me to explain any specific topic in detail?",
            "Remember to review your notes regularly for better retention."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(response, 'bot');
    }, 1000);
}

function sendQuickQuestion(question) {
    addChatMessage(question, 'user');
    
    // Simulate AI response
    setTimeout(() => {
        let response;
        if (question.includes('calculus')) {
            response = "Calculus derivatives measure rate of change. The power rule states: d/dx(xⁿ) = nxⁿ⁻¹.";
        } else if (question.includes('physics')) {
            response = "Newton's laws: 1. Inertia, 2. F=ma, 3. Action-reaction pairs.";
        } else if (question.includes('tips')) {
            response = "Study tips: Use Pomodoro technique (25 min focus, 5 min break), active recall, and spaced repetition.";
        } else {
            response = "I can help with that! Could you provide more specific details?";
        }
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(text, sender) {
    if (!elements.chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = `<p>${text}</p>`;
    elements.chatMessages.appendChild(messageElement);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    // Save to chat history
    appState.chatHistory.push({ text, sender, timestamp: new Date().toISOString() });
}

// ===== LIVE CHAT =====
function sendLiveMessage() {
    const message = elements.liveChatInput.value.trim();
    if (!message) return;
    
    addLiveMessage(message, 'user');
    elements.liveChatInput.value = '';
    
    // Simulate response from other user
    setTimeout(() => {
        const responses = [
            "Thanks for the help! That makes sense now.",
            "Could you explain that further?",
            "Do you have any resources on this topic?",
            "Let's schedule a study session to work on this together."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addLiveMessage(response, 'bot');
    }, 1500);
}

function addLiveMessage(text, sender) {
    if (!elements.liveChatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = `<p>${text}</p>`;
    elements.liveChatMessages.appendChild(messageElement);
    elements.liveChatMessages.scrollTop = elements.liveChatMessages.scrollHeight;
}

// ===== SEARCH FUNCTIONALITY =====
function handleSearch() {
    const query = elements.globalSearch.value.toLowerCase();
    if (query.length > 2) {
        // Search across all content
        const results = [];
        
        // Search tasks
        appState.tasks.forEach(task => {
            if (task.title.toLowerCase().includes(query)) {
                results.push({ type: 'task', item: task });
            }
        });
        
        // Search notes
        appState.notes.forEach(note => {
            if (note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)) {
                results.push({ type: 'note', item: note });
            }
        });
        
        // You could show results in a dropdown or modal
        console.log('Search results:', results);
    }
}

// ===== DASHBOARD UPDATES =====
function updateDashboard() {
    // Update task count
    const completedTasks = appState.tasks.filter(task => task.completed).length;
    const totalTasks = appState.tasks.length;
    if (elements.tasksCompleted) {
        elements.tasksCompleted.textContent = `${completedTasks}/${totalTasks}`;
    }
    
    // Update study time (simulated)
    const studyHours = Math.floor(Math.random() * 4);
    const studyMinutes = Math.floor(Math.random() * 60);
    if (elements.studyTime) {
        elements.studyTime.textContent = `${studyHours}h ${studyMinutes}m`;
    }
    
    // Update XP
    const xp = (currentUser?.xp || 0);
    if (elements.xpPoints) {
        elements.xpPoints.textContent = xp;
    }
    
    // Update streak
    const streak = currentUser?.streak || Math.floor(Math.random() * 10) + 1;
    if (elements.streakCount) {
        elements.streakCount.textContent = streak;
    }
}

// ===== PUSH NOTIFICATIONS =====
function checkPushPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        // Show permission banner after 5 seconds
        setTimeout(() => {
            if (elements.pushPermissionBanner) {
                elements.pushPermissionBanner.style.display = 'flex';
            }
        }, 5000);
    }
}

function requestPushPermission() {
    if (!('Notification' in window)) {
        showToast('Push notifications not supported in this browser', 'error');
        return;
    }
    
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            showToast('Push notifications enabled!', 'success');
            if (elements.pushPermissionBanner) {
                elements.pushPermissionBanner.style.display = 'none';
            }
            
            // Send welcome notification
            if (notificationSystem) {
                notificationSystem.addNotification({
                    id: Date.now(),
                    type: 'system',
                    title: 'Push Notifications Enabled',
                    message: 'You will now receive study reminders and updates directly.',
                    timestamp: new Date().toISOString(),
                    read: false,
                    priority: 'low'
                });
            }
        } else {
            showToast('Push notifications blocked', 'info');
        }
    });
}

// ===== STUDY REMINDERS =====
function startStudyReminders() {
    // Send initial reminder
    setTimeout(() => {
        if (notificationSystem) {
            notificationSystem.sendStudyReminder();
        }
    }, 5000);
    
    // Schedule daily reminders
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(10, 0, 0, 0); // 10:00 AM
    
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const timeUntilReminder = targetTime - now;
    
    setTimeout(() => {
        if (notificationSystem) {
            notificationSystem.sendStudyReminder();
        }
        // Repeat every 24 hours
        setInterval(() => {
            if (notificationSystem) {
                notificationSystem.sendStudyReminder();
            }
        }, 24 * 60 * 60 * 1000);
    }, timeUntilReminder);
}

// ===== CHARTS INITIALIZATION =====
function initCharts() {
    // Progress Chart
    const progressCtx = document.getElementById('progressChart')?.getContext('2d');
    if (progressCtx) {
        new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: [2, 3, 4, 2.5, 3.5, 1, 2],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Study Time Chart
    const studyTimeCtx = document.getElementById('studyTimeChart')?.getContext('2d');
    if (studyTimeCtx) {
        new Chart(studyTimeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Math', 'Physics', 'CS', 'Other'],
                datasets: [{
                    data: [30, 25, 35, 10],
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6']
                }]
            }
        });
    }
    
    // Completion Chart
    const completionCtx = document.getElementById('completionChart')?.getContext('2d');
    if (completionCtx) {
        new Chart(completionCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Completion %',
                    data: [65, 75, 85, 90],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
    const toast = elements.notificationToast;
    const toastMessage = toast.querySelector('.toast-message');
    
    if (!toast || !toastMessage) return;
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Format dates for input fields
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    // Set default dates
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.id === 'taskDue' || input.id === 'goalDeadline') {
            input.value = formatDate(tomorrow);
        } else if (input.id === 'assignmentDue') {
            input.value = formatDate(nextWeek);
        }
    });
}

function loadSampleData() {
    // Load sample tasks
    appState.tasks = [
        {
            id: 1,
            title: 'Complete Math Assignment',
            priority: 'high',
            due: '2024-03-12',
            completed: true,
            createdAt: '2024-03-10'
        },
        {
            id: 2,
            title: 'Read Physics Chapter 5',
            priority: 'medium',
            due: '2024-03-15',
            completed: false,
            createdAt: '2024-03-10'
        }
    ];
    
    // Load sample goals
    appState.goals = [
        {
            id: 1,
            title: 'Score 90% in Math Final',
            description: 'Achieve high score in upcoming math examination',
            deadline: '2024-04-30',
            progress: 65,
            createdAt: '2024-03-01'
        }
    ];
    
    // Load sample notes
    appState.notes = [
        {
            id: 1,
            title: 'Calculus Derivatives',
            subject: 'Mathematics',
            content: 'The derivative represents the rate of change of a function with respect to a variable. Basic rules include power rule, product rule, and chain rule.',
            createdAt: '2024-03-10',
            updatedAt: '2024-03-10'
        }
    ];
    
    // Load sample notifications
    const savedNotifications = localStorage.getItem('studylonger_notifications');
    if (!savedNotifications) {
        appState.notifications = [
            {
                id: 1,
                type: 'reminder',
                title: 'Welcome to StudyLonger!',
                message: 'Start your learning journey by exploring all the features.',
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'low'
            },
            {
                id: 2,
                type: 'deadline',
                title: 'Math Assignment Due',
                message: 'Complete your math assignment by tomorrow',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: false,
                priority: 'high'
            },
            {
                id: 3,
                type: 'achievement',
                title: 'First Task Completed!',
                message: 'You completed your first task. Keep it up!',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                read: true,
                priority: 'medium'
            }
        ];
        localStorage.setItem('studylonger_notifications', JSON.stringify(appState.notifications));
    }
    
    // Render loaded data
    renderTasks();
    renderGoals();
    renderNotes();
    updateDashboard();
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', initApp);

// ===== GLOBAL FUNCTIONS =====
// Make functions available globally for inline event handlers
window.toggleTaskCompletion = toggleTaskCompletion;
window.deleteTask = deleteTask;
window.updateGoalProgress = updateGoalProgress;
window.updateAssignmentStatus = updateAssignmentStatus;
window.deleteAssignment = deleteAssignment;
window.editNote = editNote;
window.deleteNote = deleteNote;
window.switchPage = switchPage;
window.showToast = showToast;
window.openSetting = function(setting) {
    if (profileManager) {
        profileManager.openSettings(setting);
    }
};
window.notificationSystem = notificationSystem;
window.studyRoomsManager = studyRoomsManager;
