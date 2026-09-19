// ========== ADVANCED APP CONTROLLER WITH MODAL SYSTEM & DARK MODE ==========
    const APP = {
      courseDebounceTimer: null,
      debounceCourseRender() {
        clearTimeout(this.courseDebounceTimer);
        this.courseDebounceTimer = setTimeout(() => {
          this.renderCoursesPage();
        }, 300);
      },
      userXP: parseInt(localStorage.getItem('smartstudy_xp')) || 385,
      userName: localStorage.getItem('smartstudy_username') || 'Jamie Doe',
      userEmail: localStorage.getItem('smartstudy_email') || 'jamie@smartstudy.ai',
      userSkills: JSON.parse(localStorage.getItem('smartstudy_skills')) || ['Focus', 'Math', 'Writing'],
      userCollege: localStorage.getItem('smartstudy_college') || '',
      userCourse: localStorage.getItem('smartstudy_course') || '',
      userYear: localStorage.getItem('smartstudy_year') || '',
      userBranch: localStorage.getItem('smartstudy_branch') || '',
      userMobile: localStorage.getItem('smartstudy_mobile') || '',
      userTimeZone: localStorage.getItem('smartstudy_timezone') || (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
      whatsappNumber: localStorage.getItem('smartstudy_whatsapp_number') || '',
      whatsappOptIn: localStorage.getItem('smartstudy_whatsapp_opt_in') === 'true',
      whatsappReminderLeadMinutes: parseInt(localStorage.getItem('smartstudy_whatsapp_lead') || '120', 10),
      whatsappDailyDigest: localStorage.getItem('smartstudy_whatsapp_digest') !== 'false',
      whatsappDailyDigestTime: localStorage.getItem('smartstudy_whatsapp_digest_time') || '18:00',
      whatsappTaskAlerts: localStorage.getItem('smartstudy_whatsapp_task_alerts') !== 'false',
      whatsappAssignmentAlerts: localStorage.getItem('smartstudy_whatsapp_assignment_alerts') !== 'false',
      whatsappScheduleAlerts: localStorage.getItem('smartstudy_whatsapp_schedule_alerts') !== 'false',
      whatsappFocusAlerts: localStorage.getItem('smartstudy_whatsapp_focus_alerts') === 'true',
      whatsappQuietHoursStart: localStorage.getItem('smartstudy_whatsapp_quiet_start') || '22:00',
      whatsappQuietHoursEnd: localStorage.getItem('smartstudy_whatsapp_quiet_end') || '07:00',
      whatsappActivity: JSON.parse(localStorage.getItem('smartstudy_whatsapp_activity') || '[]'),
      lastLiveSyncAt: parseInt(localStorage.getItem('smartstudy_live_sync_at') || '0', 10) || 0,
      examCredits: parseInt(localStorage.getItem('smartstudy_credits')) || 60,
      jwtToken: localStorage.getItem('smartstudy_jwt') || '',
      apiUrl: localStorage.getItem('smartstudy_api_url') || '/api',
      apiStatus: localStorage.getItem('smartstudy_api_status') || 'ready',
      syncTimer: null,
      syncInProgress: false,
      liveSyncSource: null,
      liveSyncReconnectTimer: null,
      liveSyncConnected: false,
      liveTabId: sessionStorage.getItem('smartstudy_live_tab_id') || (() => {
        const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem('smartstudy_live_tab_id', id);
        return id;
      })(),
      liveBusReady: false,
      liveChannel: null,
      liveBroadcastTimer: null,
      localRealtimeConnected: false,
      lastLocalBroadcastAt: parseInt(localStorage.getItem('smartstudy_local_broadcast_at') || '0', 10) || 0,
      lastRemoteRealtimeAt: parseInt(localStorage.getItem('smartstudy_remote_realtime_at') || '0', 10) || 0,
      livePresence: JSON.parse(localStorage.getItem('smartstudy_live_presence') || '{}'),
      liveEvents: JSON.parse(localStorage.getItem('smartstudy_live_events') || '[]'),
      refreshInFlight: null,
      communityFetchInProgress: false,
      tasks: JSON.parse(localStorage.getItem('smartstudy_tasks')) || (() => {
        const due = (offset) => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          return d.toISOString().slice(0, 10);
        };
        return [
          { id: 't1', title: 'Review AI flashcards', due: due(0), completed: false, xp: 15, priority: 'Medium', category: 'Revision', estimate: 25, recurrence: 'none' },
          { id: 't2', title: 'Calculus assignment', due: due(1), completed: false, xp: 30, priority: 'High', category: 'Math', estimate: 60, recurrence: 'none' },
          { id: 't3', title: 'Group study prep', due: due(-1), completed: true, xp: 10, priority: 'Low', category: 'Collab', estimate: 30, recurrence: 'none' }
        ];
      })(),
      notes: JSON.parse(localStorage.getItem('smartstudy_notes')) || [
        { id: 'n1', title: 'Neural networks summary', content: 'Transformers, backpropagation, attention.', date: Date.now(), subject: 'AI', category: 'Lecture', tags: ['ai'], visibility: 'private', downloads: 0, likes: 0, ratingAvg: 0, ratingCount: 0 },
        { id: 'n2', title: 'Essay outline: AI ethics', content: 'Bias, fairness, accountability.', date: Date.now(), subject: 'Writing', category: 'Essay', tags: ['ethics'], visibility: 'private', downloads: 0, likes: 0, ratingAvg: 0, ratingCount: 0 }
      ],
      notesServer: JSON.parse(localStorage.getItem('smartstudy_public_notes')) || [
        { id: 'sn1', title: 'Calculus - Chain Rule', content: 'Steps, sample problems, and common mistakes.', date: Date.now() - 86400000, author: 'Ava', subject: 'Mathematics', category: 'Exam', tags: ['calculus', 'derivatives'], visibility: 'public', downloads: 42, likes: 14, ratingAvg: 4.6, ratingCount: 12, commentsCount: 2 },
        { id: 'sn2', title: 'Physics - Optics Quick Notes', content: 'Refraction, Snell law, critical angle.', date: Date.now() - 172800000, author: 'Liam', subject: 'Physics', category: 'Cheatsheet', tags: ['optics', 'refraction'], visibility: 'public', downloads: 31, likes: 9, ratingAvg: 4.2, ratingCount: 8, commentsCount: 1 }
      ],
      notesServerStatus: localStorage.getItem('smartstudy_notes_status') || 'online',
      notesServerLastSync: parseInt(localStorage.getItem('smartstudy_notes_last_sync')) || null,
      wellnessCheckins: JSON.parse(localStorage.getItem('smartstudy_wellness_checkins')) || [],
      wellnessActivities: JSON.parse(localStorage.getItem('smartstudy_wellness_activities')) || { break: 0, hydrate: 0, stretch: 0 },
      assignments: JSON.parse(localStorage.getItem('smartstudy_assignments')) || (() => {
        const due = (offset) => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          return d.toISOString().slice(0, 10);
        };
        return [
          { id: 'a1', name: 'ML project', course: 'CS50', weight: 30, due: due(4), hours: 6, type: 'Project', priority: 'High', completed: false, xp: 80 },
          { id: 'a2', name: 'Literature review', course: 'ENG201', weight: 20, due: due(7), hours: 4, type: 'Study', priority: 'Medium', completed: false, xp: 60 }
        ];
      })(),
      scheduleEvents: JSON.parse(localStorage.getItem('smartstudy_events')) || [
        { id: 'e1', title: 'ML lecture', day: 'Mon', time: '14:00', duration: 90, type: 'Lecture', location: 'Hall A' },
        { id: 'e2', title: 'Study room: AI group', day: 'Mon', time: '16:30', duration: 60, type: 'Study', location: 'Library' },
        { id: 'e3', title: 'Quiz prep', day: 'Tue', time: '19:00', duration: 45, type: 'Exam', location: 'Online' }
      ],
      studyRooms: JSON.parse(localStorage.getItem('smartstudy_rooms')) || [
        {
          id: 'r1',
          name: 'ai-lab',
          topic: 'ML Study',
          level: 'Advanced',
          description: 'Deep dives on algorithms, papers, and model intuition.',
          tags: ['focus', 'project'],
          joined: true,
          members: 3,
          membersList: ['Ava', 'Liam', 'Jamie'],
          pins: [{ text: 'Read: Attention Is All You Need summary', time: Date.now() - 86400000 }],
          messages: [
            { sender: 'Ava', text: 'Let us review backprop today?', time: Date.now() - 7200000 },
            { sender: 'Liam', text: 'Shared notes in the docs channel.', time: Date.now() - 5400000 }
          ]
        },
        {
          id: 'r2',
          name: 'essay-writing',
          topic: 'Writing',
          level: 'Intermediate',
          description: 'Drafting, outlining, and peer review support.',
          tags: ['collab', 'exam'],
          joined: false,
          members: 5,
          membersList: ['Priya', 'Noah', 'Zoe', 'Ethan', 'Mira'],
          pins: [],
          messages: [
            { sender: 'Priya', text: 'Share thesis statements here.', time: Date.now() - 3600000 }
          ]
        },
        {
          id: 'r3',
          name: 'quiet-zone',
          topic: 'Focus',
          level: 'Beginner',
          description: 'Silent sprints and accountability check-ins.',
          tags: ['focus'],
          joined: false,
          members: 2,
          membersList: ['Kai', 'Sana'],
          pins: [{ text: '45-min sprint starts at 7pm', time: Date.now() - 1800000 }],
          messages: []
        }
      ],
      flashcardDecks: JSON.parse(localStorage.getItem('smartstudy_decks')) || [
        { id: 'd1', name: 'Calculus', cards: [
          { id: 'c1', front: 'Derivative of x^2?', back: '2x', nextReview: Date.now(), easeFactor: 2.5, interval: 1 },
          { id: 'c2', front: 'Integral of 2x dx?', back: 'x^2 + C', nextReview: Date.now(), easeFactor: 2.5, interval: 1 }
        ]},
        { id: 'd2', name: 'Vocabulary', cards: [
          { id: 'c3', front: 'What does "ephemeral" mean?', back: 'Lasting for a very short time', nextReview: Date.now(), easeFactor: 2.5, interval: 1 }
        ]}
      ],
      flashcardSettings: JSON.parse(localStorage.getItem('smartstudy_flashcard_settings')) || { shuffle: true, sessionSize: 20, dailyGoal: 20 },
      // NEW: Courses data
      courses: JSON.parse(localStorage.getItem('smartstudy_courses')) || [
        { id: 'crs1', name: 'Mathematics 101', code: 'MATH101', level: 'Intermediate', instructor: 'Dr. Patel', credits: 4, target: 'A', weeklyGoal: 5, modules: [
          { name: 'Algebra basics', completed: false },
          { name: 'Calculus intro', completed: false },
          { name: 'Geometry', completed: false }
        ]},
        { id: 'crs2', name: 'Web Development', code: 'CS50', level: 'Advanced', instructor: 'Prof. Nguyen', credits: 5, target: 'A+', weeklyGoal: 6, modules: [
          { name: 'HTML/CSS', completed: false },
          { name: 'JavaScript', completed: false },
          { name: 'React', completed: false }
        ]}
      ],
      courseSettings: JSON.parse(localStorage.getItem('smartstudy_course_settings')) || { autoplay: false, showAnalysis: true, levelGating: true },
      selectedCourseId: localStorage.getItem('smartstudy_course_selected') || null,
      selectedModuleIndex: parseInt(localStorage.getItem('smartstudy_course_module') || '-1', 10),
      activeModuleSession: null,
      youtubeResolveCache: JSON.parse(localStorage.getItem('smartstudy_youtube_resolve_cache') || '{}'),
      videoCatalog: [
        { id: 'v1', youtubeId: 'TfUFyMC0obY', title: 'Active Recall Study Method', channel: 'YouTube Learning', minutes: 12, level: 'Beginner', tags: ['study', 'memory', 'active recall', 'focus'], query: 'active recall study system' },
        { id: 'v2', youtubeId: '-DM5bxsvtFo', title: 'Spaced Repetition Technique', channel: 'YouTube Learning', minutes: 18, level: 'Beginner', tags: ['spaced repetition', 'flashcards', 'memory'], query: 'spaced repetition study techniques' },
        { id: 'v3', youtubeId: 'BDEHLn2EpoM', title: 'How to Focus for Long Study Sessions', channel: 'YouTube Learning', minutes: 14, level: 'Intermediate', tags: ['focus', 'deep work', 'productivity'], query: 'deep work focus sprint' },
        { id: 'v4', youtubeId: '-D5u5HJbISc', title: 'Introduction to Data Structures and Algorithms', channel: 'YouTube Learning', minutes: 30, level: 'Intermediate', tags: ['algorithms', 'cs', 'data structures'], query: 'data structures overview' },
        { id: 'v5', youtubeId: 'et7nT2Gu1mI', title: 'Calculus: Limits and Derivatives', channel: 'YouTube Learning', minutes: 25, level: 'Intermediate', tags: ['math', 'calculus', 'derivatives'], query: 'calculus limits derivatives' },
        { id: 'v6', youtubeId: 'd3jXofmQm44', title: 'JavaScript Async Patterns', channel: 'YouTube Learning', minutes: 22, level: 'Advanced', tags: ['javascript', 'web development', 'async'], query: 'javascript async patterns' },
        { id: 'v7', youtubeId: '8HTQoADbbGA', title: 'Writing Strong Research Introductions', channel: 'YouTube Learning', minutes: 16, level: 'Beginner', tags: ['writing', 'research', 'essays'], query: 'research paper introduction tips' },
        { id: 'v8', youtubeId: 'PFDu9oVAE-g', title: 'Linear Algebra: Eigenvalues Intuition', channel: 'YouTube Learning', minutes: 20, level: 'Advanced', tags: ['linear algebra', 'math'], query: 'eigenvalues intuition' },
        { id: 'v9', youtubeId: 'BHf0MLgM7gY', title: 'Exam Study Techniques', channel: 'YouTube Learning', minutes: 10, level: 'Beginner', tags: ['exam', 'planning', 'study'], query: 'exam preparation last week' },
        { id: 'v10', youtubeId: 'NybHckSEQBI', title: 'Algebra Basics Tutorial', channel: 'YouTube Learning', minutes: 24, level: 'Beginner', tags: ['math', 'algebra', 'basics'], query: 'algebra basics tutorial' },
        { id: 'v11', youtubeId: 'YGnmM6ZZW24', title: 'Geometry Basics Tutorial', channel: 'YouTube Learning', minutes: 22, level: 'Beginner', tags: ['math', 'geometry', 'basics'], query: 'geometry basics tutorial' },
        { id: 'v12', youtubeId: 'HcOc7P5BMi4', title: 'HTML and CSS Tutorial for Beginners', channel: 'YouTube Learning', minutes: 45, level: 'Beginner', tags: ['html', 'css', 'web development'], query: 'html css tutorial beginners' },
        { id: 'v13', youtubeId: '3LRZRSIh_KE', title: 'React JS Tutorial for Beginners', channel: 'YouTube Learning', minutes: 35, level: 'Intermediate', tags: ['react', 'javascript', 'web development'], query: 'react js tutorial beginners' }
      ],
      habits: JSON.parse(localStorage.getItem('smartstudy_habits')) || [
        { id: 'h1', title: 'Read 20 min', target: 1, history: {} },
        { id: 'h2', title: 'Practice problems', target: 2, history: {} }
      ],
      currentDeck: null,
      currentCardIndex: 0,
      chatHistory: [],
      chatMode: 'Explain',
      chatTone: 'Concise',
      lastExamNotes: '',
      dailyXP: JSON.parse(localStorage.getItem('smartstudy_dailyXP')) || {},
      dailyGoal: parseInt(localStorage.getItem('smartstudy_dailyGoal')) || 100,
      focusSessions: JSON.parse(localStorage.getItem('smartstudy_focusSessions')) || [],
      focusDailyGoal: parseInt(localStorage.getItem('smartstudy_focus_goal')) || 60,
      timerLength: parseInt(localStorage.getItem('smartstudy_timerLength')) || 25,
      currentRoom: null,
      currentDeckSourceCount: null,
      xpChart: null, taskChart: null, focusChart: null, habitChart: null, examChart: null, focusPageChart: null,
      timerSeconds: (parseInt(localStorage.getItem('smartstudy_timerLength')) || 25) * 60, timerInterval: null, isTimerRunning: false,
      quotes: [
        { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" }
      ],
      modalResolve: null,
      commandResults: [],
      commandIndex: 0,
      darkMode: localStorage.getItem('darkMode') === 'true',
      loaderTimer: null,
      loaderProgress: 0,
      loaderIndex: 0,
      loaderStart: 0,
      loaderDuration: 5000,
      loaderMinProgress: 0,
      loaderSteps: [
        { pct: 14, text: 'Booting UI shell' },
        { pct: 28, text: 'Aligning focus modules' },
        { pct: 44, text: 'Indexing study data' },
        { pct: 62, text: 'Syncing momentum' },
        { pct: 78, text: 'Rendering dashboards' },
        { pct: 92, text: 'Finalizing launch' }
      ],

      startLoader() {
        const loader = document.getElementById('app-loader');
        if (!loader || loader.dataset.started === 'true') return;
        loader.dataset.started = 'true';
        document.body.classList.add('is-loading');
        document.body.setAttribute('aria-busy', 'true');
        this.loaderProgress = 0;
        this.loaderIndex = 0;
        this.loaderMinProgress = 0;
        this.loaderStart = (performance && performance.now) ? performance.now() : Date.now();
        this.updateLoader(this.loaderProgress, this.loaderSteps[0]?.text || 'Boot sequence');
        this.loaderTimer = setInterval(() => {
          const now = (performance && performance.now) ? performance.now() : Date.now();
          const elapsed = now - this.loaderStart;
          const baseProgress = Math.min(90, (elapsed / this.loaderDuration) * 90);
          this.loaderProgress = Math.max(this.loaderMinProgress, baseProgress);
          const step = this.loaderSteps[this.loaderIndex];
          if (step && this.loaderProgress >= step.pct && this.loaderIndex < this.loaderSteps.length - 1) {
            this.loaderIndex += 1;
            this.updateLoader(this.loaderProgress, this.loaderSteps[this.loaderIndex]?.text);
            return;
          }
          this.updateLoader(this.loaderProgress);
        }, 80);
      },
      bumpLoader(target, text) {
        const loader = document.getElementById('app-loader');
        if (!loader) return;
        if (typeof target === 'number') {
          this.loaderMinProgress = Math.max(this.loaderMinProgress, Math.min(98, target));
        }
        this.updateLoader(this.loaderProgress, text);
      },
      updateLoader(progress, text) {
        const fill = document.getElementById('loader-progress-fill');
        const value = document.getElementById('loader-progress-value');
        const label = document.getElementById('loader-progress-text');
        const sync = document.getElementById('loader-metric-sync');
        const cache = document.getElementById('loader-metric-cache');
        const ai = document.getElementById('loader-metric-ai');
        const hint = document.getElementById('loader-hint');
        const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));
        if (fill) fill.style.width = `${safeProgress}%`;
        if (value) value.innerText = `${safeProgress}%`;
        if (label && text) label.innerText = text;
        if (sync) sync.innerText = `${Math.min(100, safeProgress + 6)}%`;
        if (cache) cache.innerText = `${Math.min(100, Math.round(safeProgress * 0.9))}%`;
        if (ai) ai.innerText = `${Math.min(100, Math.round(safeProgress * 0.8))}%`;
        if (hint && safeProgress > 60) hint.innerText = 'Tip: Use the AI Tutor for quick explanations.';
      },
      finishLoader() {
        const loader = document.getElementById('app-loader');
        if (!loader) return;
        const now = (performance && performance.now) ? performance.now() : Date.now();
        const elapsed = now - this.loaderStart;
        const remaining = Math.max(0, this.loaderDuration - elapsed);
        const finalize = () => {
          clearInterval(this.loaderTimer);
          this.loaderProgress = 100;
          this.updateLoader(100, 'Ready');
          setTimeout(() => {
            document.body.classList.remove('is-loading');
            document.body.removeAttribute('aria-busy');
            loader.setAttribute('aria-hidden', 'true');
          }, 450);
        };
        if (remaining > 0) {
          setTimeout(finalize, remaining);
        } else {
          finalize();
        }
      },

      getLevelFromXP(xp) { return xp < 100 ? 1 : xp < 250 ? 2 : xp < 450 ? 3 : xp < 700 ? 4 : xp < 1000 ? 5 : 6 + Math.floor((xp - 1000) / 400); },
      getXPForNextLevel(lvl) { const t = [0,100,250,450,700,1000,1400,1800,2300,2800]; return t[lvl] || (lvl * 400 + 600); },
      getDateKey(date = new Date()) { return date.toDateString(); },
      formatTime(ts) { return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); },
      formatShortDate(ts) { return new Date(ts).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }); },
      saveAll(opts = {}) {
        const { sync = true, broadcast = true } = opts;
        localStorage.setItem('smartstudy_xp', this.userXP);
        localStorage.setItem('smartstudy_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('smartstudy_notes', JSON.stringify(this.notes));
        localStorage.setItem('smartstudy_public_notes', JSON.stringify(this.notesServer));
        localStorage.setItem('smartstudy_notes_status', this.notesServerStatus);
        localStorage.setItem('smartstudy_notes_last_sync', this.notesServerLastSync || '');
        localStorage.setItem('smartstudy_wellness_checkins', JSON.stringify(this.wellnessCheckins));
        localStorage.setItem('smartstudy_wellness_activities', JSON.stringify(this.wellnessActivities));
        localStorage.setItem('smartstudy_assignments', JSON.stringify(this.assignments));
        localStorage.setItem('smartstudy_events', JSON.stringify(this.scheduleEvents));
        localStorage.setItem('smartstudy_username', this.userName);
        localStorage.setItem('smartstudy_email', this.userEmail);
        localStorage.setItem('smartstudy_skills', JSON.stringify(this.userSkills));
        localStorage.setItem('smartstudy_college', this.userCollege);
        localStorage.setItem('smartstudy_course', this.userCourse);
        localStorage.setItem('smartstudy_year', this.userYear);
        localStorage.setItem('smartstudy_branch', this.userBranch);
        localStorage.setItem('smartstudy_mobile', this.userMobile);
        localStorage.setItem('smartstudy_timezone', this.userTimeZone);
        localStorage.setItem('smartstudy_whatsapp_number', this.whatsappNumber);
        localStorage.setItem('smartstudy_whatsapp_opt_in', this.whatsappOptIn);
        localStorage.setItem('smartstudy_whatsapp_lead', this.whatsappReminderLeadMinutes);
        localStorage.setItem('smartstudy_whatsapp_digest', this.whatsappDailyDigest);
        localStorage.setItem('smartstudy_whatsapp_digest_time', this.whatsappDailyDigestTime);
        localStorage.setItem('smartstudy_whatsapp_task_alerts', this.whatsappTaskAlerts);
        localStorage.setItem('smartstudy_whatsapp_assignment_alerts', this.whatsappAssignmentAlerts);
        localStorage.setItem('smartstudy_whatsapp_schedule_alerts', this.whatsappScheduleAlerts);
        localStorage.setItem('smartstudy_whatsapp_focus_alerts', this.whatsappFocusAlerts);
        localStorage.setItem('smartstudy_whatsapp_quiet_start', this.whatsappQuietHoursStart);
        localStorage.setItem('smartstudy_whatsapp_quiet_end', this.whatsappQuietHoursEnd);
        localStorage.setItem('smartstudy_whatsapp_activity', JSON.stringify(this.whatsappActivity || []));
        localStorage.setItem('smartstudy_live_sync_at', this.lastLiveSyncAt || 0);
        localStorage.setItem('smartstudy_local_broadcast_at', this.lastLocalBroadcastAt || 0);
        localStorage.setItem('smartstudy_remote_realtime_at', this.lastRemoteRealtimeAt || 0);
        localStorage.setItem('smartstudy_live_events', JSON.stringify(this.liveEvents || []));
        localStorage.setItem('smartstudy_live_presence', JSON.stringify(this.livePresence || {}));
        localStorage.setItem('smartstudy_decks', JSON.stringify(this.flashcardDecks));
        localStorage.setItem('smartstudy_flashcard_settings', JSON.stringify(this.flashcardSettings));
        localStorage.setItem('smartstudy_dailyXP', JSON.stringify(this.dailyXP));
        localStorage.setItem('smartstudy_dailyGoal', this.dailyGoal);
        localStorage.setItem('smartstudy_courses', JSON.stringify(this.courses)); // save courses
        localStorage.setItem('smartstudy_course_settings', JSON.stringify(this.courseSettings));
        localStorage.setItem('smartstudy_course_selected', this.selectedCourseId || '');
        localStorage.setItem('smartstudy_course_module', this.selectedModuleIndex ?? -1);
        localStorage.setItem('smartstudy_youtube_resolve_cache', JSON.stringify(this.youtubeResolveCache || {}));
        localStorage.setItem('smartstudy_habits', JSON.stringify(this.habits));
        localStorage.setItem('smartstudy_focusSessions', JSON.stringify(this.focusSessions));
        localStorage.setItem('smartstudy_focus_goal', this.focusDailyGoal);
        localStorage.setItem('smartstudy_timerLength', this.timerLength);
        localStorage.setItem('smartstudy_rooms', JSON.stringify(this.studyRooms));
        localStorage.setItem('smartstudy_credits', this.examCredits);
        localStorage.setItem('smartstudy_jwt', this.jwtToken);
        localStorage.setItem('smartstudy_api_url', this.apiUrl);
        localStorage.setItem('smartstudy_api_status', this.apiStatus);
        if (sync && this.jwtToken) this.scheduleSync();
        if (broadcast) this.queueRealtimeBroadcast('state-updated');
      },
      getApiBase() {
        const raw = (this.apiUrl || '').trim();
        if (!raw || raw.includes('smartstudy.ai')) return '/api';
        return raw.endsWith('/') ? raw.slice(0, -1) : raw;
      },
      buildApiUrl(path) {
        const base = this.getApiBase();
        const normalized = path.startsWith('/') ? path : `/${path}`;
        return `${base}${normalized}`;
      },
      async refreshAuth() {
        if (this.refreshInFlight) return this.refreshInFlight;
        this.refreshInFlight = (async () => {
          try {
            const res = await fetch(this.buildApiUrl('/auth/refresh'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            });
            if (!res.ok) return false;
            const data = await res.json();
            if (data?.token) this.setAuth(data.token, data.user);
            return !!data?.token;
          } catch {
            return false;
          } finally {
            this.refreshInFlight = null;
          }
        })();
        return this.refreshInFlight;
      },
      async apiFetch(path, options = {}) {
        const url = this.buildApiUrl(path);
        const headers = { ...(options.headers || {}) };
        const { _retry, ...fetchOptions } = options;
        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
        if (this.jwtToken) headers['Authorization'] = `Bearer ${this.jwtToken}`;
        const res = await fetch(url, { ...fetchOptions, headers, credentials: 'include' });
        if (res.status === 401 && !_retry && !path.startsWith('/auth/')) {
          const refreshed = await this.refreshAuth();
          if (refreshed) return this.apiFetch(path, { ...options, _retry: true });
        }
        return res;
      },
      setAuth(token, user) {
        const previousToken = this.jwtToken;
        if (token !== undefined) this.jwtToken = token || '';
        if (user) {
          this.userName = user.name || this.userName;
          this.userEmail = user.email || this.userEmail;
          this.userSkills = Array.isArray(user.skills) ? user.skills : this.userSkills;
          this.userCollege = user.college ?? this.userCollege;
          this.userCourse = user.course ?? this.userCourse;
          this.userYear = user.year ?? this.userYear;
          this.userBranch = user.branch ?? this.userBranch;
          this.userMobile = user.mobile ?? this.userMobile;
          this.userTimeZone = user.timezone || this.userTimeZone;
          this.whatsappNumber = user.whatsappNumber ?? this.whatsappNumber;
          if (typeof user.whatsappOptIn === 'boolean') this.whatsappOptIn = user.whatsappOptIn;
          if (typeof user.whatsappReminderLeadMinutes === 'number') this.whatsappReminderLeadMinutes = user.whatsappReminderLeadMinutes;
          if (typeof user.whatsappDailyDigest === 'boolean') this.whatsappDailyDigest = user.whatsappDailyDigest;
          this.whatsappDailyDigestTime = user.whatsappDailyDigestTime || this.whatsappDailyDigestTime;
          if (typeof user.whatsappTaskAlerts === 'boolean') this.whatsappTaskAlerts = user.whatsappTaskAlerts;
          if (typeof user.whatsappAssignmentAlerts === 'boolean') this.whatsappAssignmentAlerts = user.whatsappAssignmentAlerts;
          if (typeof user.whatsappScheduleAlerts === 'boolean') this.whatsappScheduleAlerts = user.whatsappScheduleAlerts;
          if (typeof user.whatsappFocusAlerts === 'boolean') this.whatsappFocusAlerts = user.whatsappFocusAlerts;
          this.whatsappQuietHoursStart = user.whatsappQuietHoursStart || this.whatsappQuietHoursStart;
          this.whatsappQuietHoursEnd = user.whatsappQuietHoursEnd || this.whatsappQuietHoursEnd;
          if (typeof user.xp === 'number') this.userXP = user.xp;
          if (typeof user.dailyGoal === 'number') this.dailyGoal = user.dailyGoal;
          if (typeof user.examCredits === 'number') this.examCredits = user.examCredits;
        }
        this.saveAll({ sync: false });
        if (token !== undefined) {
          if (this.jwtToken) this.connectRealtimeStream();
          if (!this.jwtToken && previousToken) this.disconnectRealtimeStream();
        }
        this.updateAuthNav();
      },
      updateAuthNav() {
        const signedIn = !!this.jwtToken;
        const signinNav = document.getElementById('nav-signin');
        const signupNav = document.getElementById('nav-signup');
        const signoutNav = document.getElementById('nav-signout');
        if (signinNav) signinNav.classList.toggle('hidden', signedIn);
        if (signupNav) signupNav.classList.toggle('hidden', signedIn);
        if (signoutNav) signoutNav.classList.toggle('hidden', !signedIn);
      },
      applyServerData(payload, options = {}) {
        if (!payload) return;
        const replaceEmpty = !!options.replaceEmpty;
        if (payload.profile) this.setAuth(this.jwtToken, payload.profile);

        const hasTasks = Array.isArray(payload.tasks) && (replaceEmpty || payload.tasks.length);
        const hasAssignments = Array.isArray(payload.assignments) && (replaceEmpty || payload.assignments.length);
        const hasNotes = Array.isArray(payload.notes) && (replaceEmpty || payload.notes.length);
        const hasSchedule = Array.isArray(payload.scheduleEvents) && (replaceEmpty || payload.scheduleEvents.length);
        const hasHabits = Array.isArray(payload.habits) && (replaceEmpty || payload.habits.length);
        const hasFocus = Array.isArray(payload.focusSessions) && (replaceEmpty || payload.focusSessions.length);

        if (hasTasks) this.tasks = payload.tasks;
        if (hasAssignments) this.assignments = payload.assignments;
        if (hasNotes) {
          this.notes = payload.notes.map(n => ({ ...n, serverId: n.serverId || n.id }));
        }
        if (hasSchedule) this.scheduleEvents = payload.scheduleEvents;
        if (hasHabits) this.habits = payload.habits;
        if (hasFocus) this.focusSessions = payload.focusSessions;
        if (Array.isArray(payload.whatsappActivity) && (replaceEmpty || payload.whatsappActivity.length)) {
          this.whatsappActivity = payload.whatsappActivity;
        }

        this.saveAll({ sync: false });
        this.updateXPUI();
        this.renderChatSidebar();
        this.refreshActivePage();
      },
      parseRealtimeEvent(event) {
        try {
          return JSON.parse(event.data || '{}');
        } catch {
          return null;
        }
      },
      disconnectRealtimeStream() {
        if (this.liveSyncReconnectTimer) {
          clearTimeout(this.liveSyncReconnectTimer);
          this.liveSyncReconnectTimer = null;
        }
        if (this.liveSyncSource) {
          this.liveSyncSource.close();
          this.liveSyncSource = null;
        }
        this.liveSyncConnected = false;
      },
      connectRealtimeStream() {
        if (!this.jwtToken || typeof window === 'undefined' || typeof EventSource === 'undefined') return;
        if (this.liveSyncSource) return;
        const streamUrl = this.buildApiUrl('/sync/stream');
        if (/^https?:\/\//i.test(streamUrl) && !streamUrl.startsWith(window.location.origin)) return;

        const source = new EventSource(streamUrl, { withCredentials: true });
        this.liveSyncSource = source;

        source.addEventListener('connected', (event) => {
          const data = this.parseRealtimeEvent(event);
          this.liveSyncConnected = true;
          this.lastLiveSyncAt = data?.ts || Date.now();
          this.apiStatus = 'online';
          this.saveAll({ sync: false });
          this.updateRealtimeUI();
        });

        source.addEventListener('snapshot', (event) => {
          const data = this.parseRealtimeEvent(event);
          if (data?.payload) this.applyServerData(data.payload, { replaceEmpty: true });
          this.liveSyncConnected = true;
          this.lastLiveSyncAt = data?.ts || Date.now();
          this.apiStatus = 'online';
          this.saveAll({ sync: false });
          this.updateRealtimeUI();
        });

        source.addEventListener('whatsapp', (event) => {
          const data = this.parseRealtimeEvent(event);
          if (Array.isArray(data?.activity)) this.whatsappActivity = data.activity;
          this.liveSyncConnected = true;
          this.lastLiveSyncAt = data?.ts || Date.now();
          this.apiStatus = 'online';
          this.saveAll({ sync: false });
          this.updateRealtimeUI();
          if (data?.summary?.sent > 0) this.showToast(`WhatsApp live: ${data.summary.sent} delivered`);
          if (data?.summary?.failed > 0) this.showToast(`WhatsApp live: ${data.summary.failed} failed`);
          const profilePage = document.getElementById('page-profile');
          if (profilePage && !profilePage.classList.contains('hidden')) this.renderProfile();
        });

        source.addEventListener('heartbeat', (event) => {
          const data = this.parseRealtimeEvent(event);
          this.liveSyncConnected = true;
          this.lastLiveSyncAt = data?.ts || Date.now();
          this.apiStatus = 'online';
          this.saveAll({ sync: false });
          this.updateRealtimeUI();
        });

        source.onerror = () => {
          if (this.liveSyncSource !== source) return;
          source.close();
          this.liveSyncSource = null;
          this.liveSyncConnected = false;
          if (this.jwtToken && !this.liveSyncReconnectTimer) {
            this.liveSyncReconnectTimer = setTimeout(() => {
              this.liveSyncReconnectTimer = null;
              this.connectRealtimeStream();
            }, 4000);
          }
          const profilePage = document.getElementById('page-profile');
          if (profilePage && !profilePage.classList.contains('hidden')) this.renderProfile();
          this.saveAll({ sync: false });
          this.updateRealtimeUI();
        };
      },
      async loadProfileFromServer() {
        if (!this.jwtToken) return false;
        try {
          const res = await this.apiFetch('/auth/me', { method: 'GET' });
          if (!res.ok) {
            if (res.status === 401) {
              this.jwtToken = '';
              this.disconnectRealtimeStream();
            }
            this.apiStatus = 'offline';
            this.saveAll({ sync: false });
            return false;
          }
          const data = await res.json();
          if (data?.user) this.setAuth(this.jwtToken, data.user);
          this.apiStatus = 'online';
          this.saveAll({ sync: false });
          return true;
        } catch (err) {
          this.apiStatus = 'offline';
          this.saveAll({ sync: false });
          return false;
        }
      },
      scheduleSync() {
        if (!this.jwtToken || this.syncInProgress) return;
        clearTimeout(this.syncTimer);
        this.syncTimer = setTimeout(() => this.syncToServer(), 1200);
      },
      async syncToServer() {
        if (!this.jwtToken || this.syncInProgress) return;
        this.syncInProgress = true;
        try {
          const payload = {
            profile: {
              name: this.userName,
              skills: this.userSkills || [],
              college: this.userCollege || '',
              course: this.userCourse || '',
              year: this.userYear || '',
              mobile: this.userMobile || '',
              timezone: this.userTimeZone || 'UTC',
              whatsappNumber: this.whatsappNumber || '',
              whatsappOptIn: this.whatsappOptIn,
              whatsappReminderLeadMinutes: this.whatsappReminderLeadMinutes,
              whatsappDailyDigest: this.whatsappDailyDigest,
              whatsappDailyDigestTime: this.whatsappDailyDigestTime,
              whatsappTaskAlerts: this.whatsappTaskAlerts,
              whatsappAssignmentAlerts: this.whatsappAssignmentAlerts,
              whatsappScheduleAlerts: this.whatsappScheduleAlerts,
              whatsappFocusAlerts: this.whatsappFocusAlerts,
              whatsappQuietHoursStart: this.whatsappQuietHoursStart,
              whatsappQuietHoursEnd: this.whatsappQuietHoursEnd,
              xp: this.userXP,
              dailyGoal: this.dailyGoal,
              examCredits: this.examCredits
            },
            tasks: this.tasks || [],
            assignments: this.assignments || [],
            notes: this.notes || [],
            scheduleEvents: this.scheduleEvents || [],
            habits: this.habits || [],
            focusSessions: this.focusSessions || []
          };
          const res = await this.apiFetch('/sync', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            this.applyServerData(data, { replaceEmpty: true });
            this.apiStatus = 'online';
          } else {
            this.apiStatus = 'offline';
          }
          this.saveAll({ sync: false });
        } catch (err) {
          this.apiStatus = 'offline';
          this.saveAll({ sync: false });
        } finally {
          this.syncInProgress = false;
        }
      },
      async syncFromServer() {
        if (!this.jwtToken) return false;
        try {
          const res = await this.apiFetch('/sync', { method: 'GET' });
          if (!res.ok) {
            if (res.status === 401) {
              this.jwtToken = '';
              this.disconnectRealtimeStream();
            }
            this.apiStatus = 'offline';
            this.saveAll({ sync: false });
            return false;
          }
          const data = await res.json();
          this.applyServerData(data);

          const hasRemote =
            (data.tasks || []).length +
            (data.assignments || []).length +
            (data.notes || []).length +
            (data.scheduleEvents || []).length +
            (data.habits || []).length +
            (data.focusSessions || []).length;

          if (!hasRemote) {
            this.scheduleSync();
          }

          this.apiStatus = 'online';
          this.saveAll({ sync: false });
          return true;
        } catch (err) {
          this.apiStatus = 'offline';
          this.saveAll({ sync: false });
          return false;
        }
      },
      async refreshCommunityNotes() {
        if (this.communityFetchInProgress) return;
        this.communityFetchInProgress = true;
        try {
          const res = await this.apiFetch('/notes/public', { method: 'GET' });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.notes)) {
              this.notesServer = data.notes;
              this.notesServerStatus = 'online';
              this.notesServerLastSync = Date.now();
              this.saveAll({ sync: false });
              const notesPage = document.getElementById('page-notes');
              if (notesPage && !notesPage.classList.contains('hidden')) this.renderNotesPage();
            }
          } else {
            this.notesServerStatus = 'offline';
            this.saveAll({ sync: false });
          }
        } catch (err) {
          this.notesServerStatus = 'offline';
          this.saveAll({ sync: false });
        } finally {
          this.communityFetchInProgress = false;
        }
      },
      refreshActivePage() {
        const active = document.querySelector('.page:not(.hidden)');
        if (!active || !active.id) return;
        const pageId = active.id.replace('page-', '');
        if (pageId) this.showPage(pageId);
      },
      setupRealtimeBus() {
        if (this.liveBusReady || typeof window === 'undefined') return;
        this.liveBusReady = true;
        this.localRealtimeConnected = true;

        if (typeof BroadcastChannel !== 'undefined') {
          this.liveChannel = new BroadcastChannel('smartstudy-live');
          this.liveChannel.onmessage = (event) => this.handleRealtimeMessage(event.data);
        }

        window.addEventListener('storage', (event) => {
          try {
            if (event.key === 'smartstudy_live_snapshot' && event.newValue) {
              this.handleRealtimeMessage(JSON.parse(event.newValue));
            }
            if (event.key === 'smartstudy_live_presence_ping' && event.newValue) {
              this.handleRealtimeMessage(JSON.parse(event.newValue));
            }
          } catch (err) {
            console.warn('[realtime:storage]', err);
          }
        });

        window.addEventListener('beforeunload', () => this.broadcastPresence('offline'));
        this.pruneLivePresence();
        this.broadcastPresence('online');

        const last = this.liveEvents && this.liveEvents[0];
        if (!last || Date.now() - last.time > 60000) {
          this.recordLiveEvent('Real-time ready', 'Local workspace sync is active.', 'sync', { broadcast: false });
        }
        this.updateRealtimeUI();
      },
      getRealtimeSnapshot() {
        return {
          userXP: this.userXP,
          dailyXP: this.dailyXP || {},
          tasks: this.tasks || [],
          assignments: this.assignments || [],
          notes: this.notes || [],
          scheduleEvents: this.scheduleEvents || [],
          habits: this.habits || [],
          focusSessions: this.focusSessions || [],
          studyRooms: this.studyRooms || [],
          courses: this.courses || [],
          liveEvents: this.liveEvents || [],
          currentRoomId: this.currentRoom?.id || null
        };
      },
      queueRealtimeBroadcast(reason = 'state-updated') {
        if (!this.liveBusReady || typeof window === 'undefined') return;
        clearTimeout(this.liveBroadcastTimer);
        this.liveBroadcastTimer = setTimeout(() => this.broadcastRealtime(reason), 220);
      },
      broadcastRealtime(reason = 'state-updated') {
        if (!this.liveBusReady || typeof window === 'undefined') return;
        const message = {
          type: 'snapshot',
          origin: this.liveTabId,
          at: Date.now(),
          reason,
          payload: this.getRealtimeSnapshot()
        };
        this.lastLocalBroadcastAt = message.at;
        localStorage.setItem('smartstudy_local_broadcast_at', this.lastLocalBroadcastAt);
        localStorage.setItem('smartstudy_live_snapshot', JSON.stringify(message));
        if (this.liveChannel) this.liveChannel.postMessage(message);
        this.broadcastPresence('online');
        this.updateRealtimeUI();
      },
      broadcastPresence(state = 'online') {
        if (typeof window === 'undefined') return;
        const activePage = document.querySelector('.page:not(.hidden)')?.id?.replace('page-', '') || 'dashboard';
        const presence = {
          type: 'presence',
          origin: this.liveTabId,
          at: Date.now(),
          state,
          name: this.userName || 'Student',
          page: activePage,
          roomId: this.currentRoom?.id || null
        };
        if (state === 'offline') {
          delete this.livePresence[this.liveTabId];
          localStorage.setItem('smartstudy_live_presence', JSON.stringify(this.livePresence));
          localStorage.setItem('smartstudy_live_presence_ping', JSON.stringify(presence));
          if (this.liveChannel) this.liveChannel.postMessage(presence);
          return;
        }
        this.livePresence[this.liveTabId] = presence;
        this.pruneLivePresence();
        localStorage.setItem('smartstudy_live_presence', JSON.stringify(this.livePresence));
        localStorage.setItem('smartstudy_live_presence_ping', JSON.stringify(presence));
        if (this.liveChannel) this.liveChannel.postMessage(presence);
      },
      handleRealtimeMessage(message) {
        if (!message || message.origin === this.liveTabId) return;
        if (message.type === 'presence') {
          this.livePresence[message.origin] = message;
          this.pruneLivePresence();
          localStorage.setItem('smartstudy_live_presence', JSON.stringify(this.livePresence));
          this.updateRealtimeUI();
          return;
        }
        if (message.type === 'snapshot') {
          this.applyRealtimeSnapshot(message);
        }
      },
      applyRealtimeSnapshot(message) {
        const payload = message.payload || {};
        if (message.at && message.at < this.lastRemoteRealtimeAt) return;
        this.lastRemoteRealtimeAt = message.at || Date.now();

        if (typeof payload.userXP === 'number') this.userXP = payload.userXP;
        if (payload.dailyXP) this.dailyXP = payload.dailyXP;
        if (Array.isArray(payload.tasks)) this.tasks = payload.tasks;
        if (Array.isArray(payload.assignments)) this.assignments = payload.assignments;
        if (Array.isArray(payload.notes)) this.notes = payload.notes;
        if (Array.isArray(payload.scheduleEvents)) this.scheduleEvents = payload.scheduleEvents;
        if (Array.isArray(payload.habits)) this.habits = payload.habits;
        if (Array.isArray(payload.focusSessions)) this.focusSessions = payload.focusSessions;
        if (Array.isArray(payload.studyRooms)) {
          this.studyRooms = payload.studyRooms;
          this.currentRoom = this.studyRooms.find(r => r.id === (payload.currentRoomId || this.currentRoom?.id)) || this.studyRooms[0] || null;
        }
        if (Array.isArray(payload.courses)) this.courses = payload.courses;
        if (Array.isArray(payload.liveEvents)) {
          const events = [...payload.liveEvents, ...(this.liveEvents || [])];
          const byId = new Map();
          events.forEach(event => {
            if (event && event.id && !byId.has(event.id)) byId.set(event.id, event);
          });
          this.liveEvents = [...byId.values()].sort((a, b) => (b.time || 0) - (a.time || 0)).slice(0, 25);
        }

        this.apiStatus = this.apiStatus === 'offline' ? 'ready' : this.apiStatus;
        this.saveAll({ sync: false, broadcast: false });
        this.updateXPUI();
        this.refreshActivePage();
        this.updateRealtimeUI();
      },
      pruneLivePresence() {
        const now = Date.now();
        Object.keys(this.livePresence || {}).forEach(id => {
          const item = this.livePresence[id];
          if (!item || item.state === 'offline' || now - (item.at || 0) > 45000) {
            delete this.livePresence[id];
          }
        });
        this.livePresence[this.liveTabId] = {
          type: 'presence',
          origin: this.liveTabId,
          at: now,
          state: 'online',
          name: this.userName || 'Student',
          page: document.querySelector('.page:not(.hidden)')?.id?.replace('page-', '') || 'dashboard',
          roomId: this.currentRoom?.id || null
        };
      },
      getPresenceList() {
        this.pruneLivePresence();
        return Object.values(this.livePresence || {}).sort((a, b) => (b.at || 0) - (a.at || 0));
      },
      recordLiveEvent(title, detail = '', type = 'info', options = {}) {
        if (!title) return;
        const event = {
          id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title,
          detail,
          type,
          time: Date.now(),
          source: this.userName || 'Student'
        };
        this.liveEvents = [event, ...(this.liveEvents || [])].slice(0, 25);
        localStorage.setItem('smartstudy_live_events', JSON.stringify(this.liveEvents));
        if (options.broadcast !== false) this.queueRealtimeBroadcast('activity');
        this.updateRealtimeUI();
      },
      getRealtimeStatusCopy() {
        if (this.liveSyncConnected) {
          return { state: 'online', label: 'Server live', detail: 'Connected to the StudyLonger stream.' };
        }
        if (this.syncInProgress) {
          return { state: 'syncing', label: 'Syncing', detail: 'Sending your latest study changes.' };
        }
        if (this.jwtToken && this.apiStatus === 'offline') {
          return { state: 'offline', label: 'Reconnecting', detail: 'Server sync is offline, local live sync remains active.' };
        }
        return { state: 'local', label: 'Local live sync', detail: 'Changes update instantly across open StudyLonger tabs.' };
      },
      getRoomMessagesToday(room = this.currentRoom) {
        if (!room) return 0;
        const todayKey = this.getDateKey();
        return (room.messages || []).filter(m => this.getDateKey(new Date(m.time || Date.now())) === todayKey).length;
      },
      updateRealtimeUI() {
        const status = this.getRealtimeStatusCopy();
        const label = document.getElementById('global-live-label');
        const dot = document.getElementById('global-live-dot');
        if (label) label.innerText = status.label;
        if (dot) {
          const color = status.state === 'offline' ? 'text-red-500' : status.state === 'syncing' ? 'text-amber-500' : 'text-green-500';
          dot.className = `fas fa-circle text-[6px] mr-1.5 ${color} animate-pulse`;
        }

        const presence = this.getPresenceList();
        const lastPulse = Math.max(this.lastLiveSyncAt || 0, this.lastLocalBroadcastAt || 0, this.lastRemoteRealtimeAt || 0) || Date.now();
        const currentRoom = this.currentRoom || (this.studyRooms || [])[0];
        const activeRoomMessages = currentRoom ? this.getRoomMessagesToday(currentRoom) : 0;
        const eventsEl = document.getElementById('dashboard-live-events');

        const setText = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.innerText = value;
        };
        setText('dashboard-live-status', status.label);
        setText('dashboard-live-detail', status.detail);
        setText('dashboard-live-updated', this.formatTime(lastPulse));
        setText('dashboard-live-tabs', presence.length || 1);
        setText('dashboard-live-room-activity', `${activeRoomMessages} today`);
        setText('dashboard-live-mode', this.liveSyncConnected ? 'Server stream mode' : 'Cross-tab mode');
        setText('dashboard-live-focus-state', this.isTimerRunning ? 'Running' : 'Idle');
        setText('dashboard-live-room', currentRoom ? `#${currentRoom.name}` : '-');
        setText('dashboard-live-api', this.apiStatus === 'offline' ? 'Offline' : (this.liveSyncConnected ? 'Live' : 'Ready'));

        const statusDot = document.getElementById('dashboard-live-status-dot');
        if (statusDot) statusDot.dataset.state = status.state;
        if (eventsEl) {
          const events = (this.liveEvents || []).slice(0, 5);
          eventsEl.innerHTML = events.map(event => `
            <div class="live-feed-item" data-type="${event.type || 'info'}">
              <span class="live-feed-icon"><i class="fas ${event.type === 'xp' ? 'fa-bolt' : event.type === 'room' ? 'fa-users' : event.type === 'focus' ? 'fa-bullseye' : event.type === 'task' ? 'fa-check' : 'fa-signal'}"></i></span>
              <div class="min-w-0">
                <p class="font-semibold text-gray-800 truncate">${this.escapeHtml(event.title)}</p>
                <p class="text-xs text-gray-500 truncate">${this.escapeHtml(event.detail || '')}</p>
              </div>
              <span class="ml-auto text-[10px] text-gray-400">${this.formatTime(event.time || Date.now())}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">Live changes will appear here.</p>';
        }

        if (currentRoom) {
          const activeMembers = new Set((currentRoom.messages || [])
            .filter(m => this.getDateKey(new Date(m.time || Date.now())) === this.getDateKey())
            .map(m => m.sender)).size || (currentRoom.membersList || []).length;
          setText('room-live-status', status.label);
          setText('room-live-members-now', `${activeMembers} members`);
          setText('room-live-activity-rate', `${activeRoomMessages} updates`);
          setText('room-live-challenge', this.isTimerRunning ? 'Focus sprint running' : 'Start a focus sprint');
        }
      },
      async manualRealtimeSync() {
        this.recordLiveEvent('Manual sync requested', this.jwtToken ? 'Server and local channels refreshed.' : 'Local channel broadcast sent.', 'sync');
        if (this.jwtToken) await this.syncToServer();
        this.broadcastRealtime('manual-sync');
        this.showToast('Real-time sync refreshed');
      },
      tickRealtime() {
        this.broadcastPresence('online');
        this.updateRealtimeUI();
      },
      addRoomSystemPrompt() {
        if (!this.currentRoom || !this.currentRoom.joined) return;
        const prompts = ['Focus sprint starts in 5 min', 'Share your goal for this session', 'Quick check-in: progress update?'];
        const text = prompts[Math.floor(Math.random() * prompts.length)];
        this.currentRoom.messages.push({ sender: 'system', text, time: Date.now() });
        this.saveAll();
        this.recordLiveEvent('Room prompt posted', `#${this.currentRoom.name}: ${text}`, 'room');
        this.updateRoomChatUI();
      },
      updateXPUI() {
        const level = this.getLevelFromXP(this.userXP);
        const currentXP = this.getXPForNextLevel(level), nextXP = this.getXPForNextLevel(level+1);
        const xpIn = this.userXP - currentXP, need = nextXP - currentXP, percent = Math.min((xpIn/need)*100,100);
        document.querySelectorAll('.user-level-display').forEach(el => el.innerText = level);
        document.querySelectorAll('.global-xp-value').forEach(el => el.innerText = this.userXP);
        document.querySelectorAll('.xp-progress-fill').forEach(el => el.style.width = percent + '%');
        document.querySelectorAll('.xp-text-detail').forEach(el => el.innerText = `${Math.floor(xpIn)} / ${need} XP`);
        document.getElementById('user-display-name').innerText = this.userName;
        document.getElementById('user-initials').innerText = (this.userName.split(' ').map(n=>n[0]).join('') || 'JD').toUpperCase();

        const today = new Date().toDateString();
        const earnedToday = this.dailyXP[today] || 0;
        document.getElementById('daily-goal-display').innerText = `${earnedToday}/${this.dailyGoal}`;
        const profileDailyEarned = document.getElementById('profile-daily-earned');
        if (profileDailyEarned) {
          profileDailyEarned.innerText = earnedToday;
          document.getElementById('profile-daily-goal').innerText = this.dailyGoal;
          const percentDaily = Math.min((earnedToday / this.dailyGoal) * 100, 100);
          document.getElementById('profile-daily-progress').style.width = percentDaily + '%';
        }
        const welcomePage = document.getElementById('page-welcome');
        if (welcomePage && !welcomePage.classList.contains('hidden')) {
          this.renderWelcome();
        }
      },
      addXP(amount, reason = '') {
        this.userXP += amount;
        const today = new Date().toDateString();
        this.dailyXP[today] = (this.dailyXP[today] || 0) + amount;
        this.updateXPUI();
        this.saveAll();
        if (reason) this.showToast(`+${amount} XP (${reason})`);
        this.recordLiveEvent('XP earned', `+${amount} XP${reason ? ' for ' + reason : ''}`, 'xp');
        this.checkAchievements();
      },
      showToast(msg) { const t = document.createElement('div'); t.className = 'fixed bottom-24 right-8 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-sm backdrop-blur-sm border border-white/20 animate-bounce'; t.innerText = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); },

      // Modal system
      openModal(title, fields) {
        return new Promise((resolve) => {
          this.modalResolve = resolve;
          document.getElementById('modalTitle').innerText = title;
          const container = document.getElementById('modalFields');
          const modalBox = document.querySelector('#advancedModal .modal-container');
          if (modalBox) modalBox.style.maxWidth = '450px';
          const confirmBtn = document.getElementById('modalConfirmBtn');
          if (confirmBtn) confirmBtn.innerText = 'Confirm';
          container.innerHTML = fields.map(f => `<div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${this.escapeHtml(f.label)}</label><input id="modal-${this.escapeHtml(f.name)}" type="${this.escapeHtml(f.type || 'text')}" class="w-full bg-white/70 dark:bg-gray-800/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" placeholder="${this.escapeHtml(f.placeholder || '')}" value="${this.escapeHtml(f.value || '')}"></div>`).join('');
          document.getElementById('advancedModal').style.display = 'flex';
          confirmBtn.onclick = () => {
            const result = {};
            fields.forEach(f => result[f.name] = document.getElementById(`modal-${f.name}`).value);
            this.closeModal();
            resolve(result);
          };
        });
      },
      closeModal() {
        document.getElementById('advancedModal').style.display = 'none';
        const modalBox = document.querySelector('#advancedModal .modal-container');
        if (modalBox) modalBox.style.maxWidth = '450px';
        const confirmBtn = document.getElementById('modalConfirmBtn');
        if (confirmBtn) {
          confirmBtn.innerText = 'Confirm';
          confirmBtn.onclick = null;
        }
        this.modalResolve = null;
      },

      // Dark mode
      toggleDarkMode() { this.darkMode = !this.darkMode; document.body.classList.toggle('dark', this.darkMode); localStorage.setItem('darkMode', this.darkMode); },

      // Routing (updated with 'courses')
      showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        const activePage = document.getElementById('page-' + pageId);
        if (activePage) activePage.classList.remove('hidden');
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active-nav'));
        const navItem = document.getElementById('nav-' + pageId);
        if (navItem) navItem.classList.add('active-nav');
        const titles = { welcome:'Welcome', dashboard:'Dashboard', 'student-life':'Student Life', tasks:'Tasks', assignments:'Assignments', schedule:'Schedule', notes:'Notes', focus:'Focus', habits:'Habits', flashcards:'Flashcards', 'ai-test':'AI Test Generator', 'study-rooms':'Study Rooms', chatbot:'AI Tutor', analytics:'Analytics', achievements:'Achievements', profile:'Profile', courses:'Courses', signin:'Sign In', signup:'Sign Up' };
        document.getElementById('current-page-title').innerText = titles[pageId] || 'Dashboard';
        if (pageId === 'welcome') this.renderWelcome();
        if (pageId === 'dashboard') this.renderDashboard();
        if (pageId === 'tasks') this.renderTasksPage();
        if (pageId === 'notes') {
          this.renderNotesPage();
          this.refreshCommunityNotes();
        }
        if (pageId === 'assignments') this.renderAssignments();
        if (pageId === 'schedule') this.renderSchedule();
        if (pageId === 'flashcards') this.renderFlashcardDecks();
        if (pageId === 'ai-test') this.renderExamGenerator();
        if (pageId === 'study-rooms') this.renderStudyRooms();
        if (pageId === 'achievements') this.renderAchievements();
        if (pageId === 'analytics') this.renderAnalytics();
        if (pageId === 'student-life') this.renderStudentLife();
        if (pageId === 'chatbot') this.renderChatSidebar();
        if (pageId === 'profile') this.renderProfile();
        if (pageId === 'courses') this.renderCoursesPage();
        if (pageId === 'focus') this.renderFocusPage();
        if (pageId === 'habits') this.renderHabitsPage();
        if (pageId === 'signin' || pageId === 'signup') this.updateAuthNav();
        this.broadcastPresence('online');
        this.updateRealtimeUI();
      },

      completeWelcome(nextPage = 'dashboard') {
        localStorage.setItem('smartstudy_seen_welcome', 'true');
        if (nextPage) this.showPage(nextPage);
      },

      renderWelcome() {
        const setText = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.innerText = value;
        };

        const name = (this.userName || 'Student').trim();
        const shortName = name.split(' ')[0] || 'Student';
        const level = this.getLevelFromXP(this.userXP);
        const currentXP = this.getXPForNextLevel(level);
        const nextXP = this.getXPForNextLevel(level + 1);
        const xpToNext = Math.max(nextXP - this.userXP, 0);

        const todayKey = this.getDateKey();
        const earnedToday = this.dailyXP[todayKey] || 0;
        const dailyGoal = this.dailyGoal || 100;
        const dailyPercent = Math.min((earnedToday / dailyGoal) * 100, 100);

        const focusStats = this.getFocusStats();
        const now = new Date();
        const todayISO = now.toISOString().slice(0, 10);

        const tasks = Array.isArray(this.tasks) ? this.tasks : [];
        const tasksDue = tasks.filter(t => !t.completed && t.due === todayISO).length;
        const overdue = tasks.filter(t => !t.completed && t.due && new Date(`${t.due}T00:00:00`) < new Date(`${todayISO}T00:00:00`)).length;
        const priorityScore = (t) => (t.priority === 'High' ? 3 : t.priority === 'Low' ? 1 : 2);
        const topTask = tasks
          .filter(t => !t.completed)
          .sort((a, b) => {
            const ap = priorityScore(a);
            const bp = priorityScore(b);
            if (ap !== bp) return bp - ap;
            const ad = a.due ? new Date(`${a.due}T00:00:00`).getTime() : Infinity;
            const bd = b.due ? new Date(`${b.due}T00:00:00`).getTime() : Infinity;
            return ad - bd;
          })[0];

        const scheduleMeta = (this.scheduleEvents || []).map(e => this.buildScheduleEventMeta(e));
        const nextEvent = scheduleMeta
          .filter(e => e.date >= now)
          .sort((a, b) => a.date - b.date)[0];

        const assignments = (this.assignments || []).filter(a => !a.completed);
        const upcomingAssignments = assignments.filter(a => a.due && new Date(`${a.due}T00:00:00`) >= new Date(`${todayISO}T00:00:00`));

        setText('welcome-user-name', shortName);
        setText('welcome-level', level);
        setText('welcome-xp', this.userXP);
        setText('welcome-xp-to-next', xpToNext);
        setText('welcome-streak', focusStats.streakDays || 0);
        setText('welcome-daily-xp', earnedToday);
        setText('welcome-daily-goal', dailyGoal);
        setText('welcome-priority-task', topTask ? topTask.title : 'Set a priority');
        setText('welcome-next-event', nextEvent ? `${nextEvent.title} ${nextEvent.time}` : '-');
        setText('welcome-tasks-due', tasksDue);
        setText('welcome-overdue', overdue);
        setText('welcome-focus-today', `${focusStats.todayMinutes || 0} min`);
        setText('welcome-daily-progress', Math.round(dailyPercent));
        setText('welcome-focus-streak', focusStats.streakDays || 0);
        setText('welcome-deep-sessions', focusStats.deepSessions || 0);
        setText('welcome-assignments', upcomingAssignments.length);
        setText('welcome-credits', this.examCredits || 0);

        const ring = document.getElementById('welcome-ring');
        if (ring) ring.style.setProperty('--progress', Math.round(dailyPercent));
        const dailyBar = document.getElementById('welcome-daily-bar');
        if (dailyBar) dailyBar.style.width = `${dailyPercent}%`;

        const apiEl = document.getElementById('welcome-api-status');
        if (apiEl) {
          const apiOnline = this.apiStatus === 'online' || this.apiStatus === 'ready';
          apiEl.innerText = apiOnline ? 'API online' : 'API offline';
          apiEl.dataset.state = apiOnline ? 'online' : 'offline';
        }

        const notesOnline = this.notesServerStatus === 'online';
        setText('welcome-notes-status', notesOnline ? 'online' : 'offline');
        setText('welcome-community-detail', notesOnline ? 'Online' : 'Offline');

        const syncState = this.syncInProgress ? 'syncing' : (this.jwtToken ? 'ready' : 'local');
        setText('welcome-sync-status', syncState);
        setText('welcome-sync-detail', syncState === 'syncing' ? 'Syncing' : syncState === 'local' ? 'Local only' : 'Ready');
      },

      // Dashboard
      renderDashboard() {
        const today = new Date();
        const todayKey = this.getDateKey(today);
        const todayISO = today.toISOString().slice(0, 10);
        const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const todayName = dayNames[today.getDay()];

        const focusStats = this.getFocusStats();
        const xpToday = this.dailyXP[todayKey] || 0;

        const tasksMeta = (this.tasks || []).map(t => {
          const dueDate = t.due ? new Date(`${t.due}T00:00:00`) : null;
          const overdue = dueDate && dueDate < new Date(`${todayISO}T00:00:00`) && !t.completed;
          const dueToday = t.due === todayISO;
          const priority = t.priority || 'Medium';
          const priorityScore = priority === 'High' ? 3 : priority === 'Low' ? 1 : 2;
          return { ...t, dueDate, overdue, dueToday, priority, priorityScore };
        });
        const incomplete = tasksMeta.filter(t => !t.completed);
        const dueTodayTasks = incomplete.filter(t => t.dueToday);
        const overdueTasks = incomplete.filter(t => t.overdue);
        const topTask = [...incomplete].sort((a, b) => {
          if (a.priorityScore !== b.priorityScore) return b.priorityScore - a.priorityScore;
          const ad = a.dueDate ? a.dueDate.getTime() : Infinity;
          const bd = b.dueDate ? b.dueDate.getTime() : Infinity;
          return ad - bd;
        })[0];

        const scheduleMeta = (this.scheduleEvents || []).map(e => this.buildScheduleEventMeta(e));
        const upcomingEvent = scheduleMeta
          .filter(e => e.date >= today)
          .sort((a, b) => a.date - b.date)[0];
        const todaysEvents = scheduleMeta.filter(e => e.day === todayName).sort((a, b) => a.startMinutes - b.startMinutes);

        const assignmentsMeta = (this.assignments || []).map(a => ({
          ...a,
          dueDate: a.due ? new Date(`${a.due}T00:00:00`) : null
        }));
        const upcomingAssignments = assignmentsMeta
          .filter(a => !a.completed && a.dueDate)
          .sort((a, b) => a.dueDate - b.dueDate);
        const weekAhead = new Date();
        weekAhead.setDate(weekAhead.getDate() + 7);
        const assignmentsWeek = upcomingAssignments.filter(a => a.dueDate <= weekAhead).length;
        const nextAssignment = upcomingAssignments[0];

        const habitsToday = (this.habits || []).filter(h => {
          const count = h.history?.[todayKey] || 0;
          return count >= h.target;
        }).length;
        const wellnessStreak = this.calcWellnessStreak();
        const roomsActive = (this.studyRooms || []).filter(r => r.joined).length;

        const welcomeEl = document.getElementById('dashboard-welcome-name');
        if (welcomeEl) welcomeEl.innerText = this.userName || 'Student';

        const xpEl = document.getElementById('dashboard-xp-today');
        const focusEl = document.getElementById('dashboard-focus-today');
        const tasksDueEl = document.getElementById('dashboard-tasks-due');
        const overdueEl = document.getElementById('dashboard-overdue-count');
        if (xpEl) xpEl.innerText = xpToday;
        if (focusEl) focusEl.innerText = focusStats.todayMinutes;
        if (tasksDueEl) tasksDueEl.innerText = dueTodayTasks.length;
        if (overdueEl) overdueEl.innerText = overdueTasks.length;

        const focusCard = document.getElementById('dashboard-focus-card');
        const assignmentsWeekEl = document.getElementById('dashboard-assignments-week');
        const habitsDoneEl = document.getElementById('dashboard-habits-done');
        const wellnessEl = document.getElementById('dashboard-wellness-streak');
        const roomsEl = document.getElementById('dashboard-rooms-active');
        if (focusCard) focusCard.innerText = `${focusStats.todayMinutes} min`;
        if (assignmentsWeekEl) assignmentsWeekEl.innerText = assignmentsWeek;
        if (habitsDoneEl) habitsDoneEl.innerText = habitsToday;
        if (wellnessEl) wellnessEl.innerText = wellnessStreak;
        if (roomsEl) roomsEl.innerText = roomsActive;

        const topTaskEl = document.getElementById('dashboard-top-task');
        const nextEventEl = document.getElementById('dashboard-next-event');
        const nextAssignmentEl = document.getElementById('dashboard-next-assignment');
        if (topTaskEl) topTaskEl.innerText = topTask ? `Top task: ${this.escapeHtml(topTask.title)}` : 'Top task: -';
        if (nextEventEl) nextEventEl.innerText = upcomingEvent ? `Next event: ${this.escapeHtml(upcomingEvent.title)} (${upcomingEvent.day} ${upcomingEvent.time})` : 'Next event: -';
        if (nextAssignmentEl) nextAssignmentEl.innerText = nextAssignment ? `Next assignment: ${this.escapeHtml(nextAssignment.name)} (${nextAssignment.due})` : 'Next assignment: -';

        const tasksList = document.getElementById('dashboard-tasks-list');
        if (tasksList) {
          const list = (dueTodayTasks.length ? dueTodayTasks : incomplete.slice(0, 4));
          tasksList.innerHTML = list.map(t => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(t.title)}</span>
              <span class="text-[10px] ${t.overdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} px-2 py-0.5 rounded-full">${t.due || 'No due'}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No tasks yet.</p>';
        }

        const scheduleList = document.getElementById('dashboard-schedule-list');
        if (scheduleList) {
          const list = todaysEvents.length ? todaysEvents : scheduleMeta.sort((a, b) => a.date - b.date).slice(0, 3);
          scheduleList.innerHTML = list.map(e => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(e.title)}</span>
              <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${e.day} ${e.time}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No events scheduled.</p>';
        }

        const assignmentsList = document.getElementById('dashboard-assignments-list');
        if (assignmentsList) {
          assignmentsList.innerHTML = upcomingAssignments.slice(0, 3).map(a => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(a.name)}</span>
              <span class="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">${a.due || 'TBD'}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No upcoming assignments.</p>';
        }

        const recentNotes = [...this.notes].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 3);
        const notesList = document.getElementById('dashboard-notes-list');
        if (notesList) {
          notesList.innerHTML = recentNotes.map(n => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span class="truncate">${this.escapeHtml(n.title)}</span>
              <span class="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">${this.formatShortDate(n.date)}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No notes yet.</p>';
        }

        const wellnessSummary = document.getElementById('dashboard-wellness-summary');
        if (wellnessSummary) {
          const lastCheckin = [...this.wellnessCheckins].sort((a, b) => b.time - a.time)[0];
          const lastText = lastCheckin
            ? `Mood ${lastCheckin.mood} - Energy ${lastCheckin.energy}`
            : 'No check-in logged';
          wellnessSummary.innerHTML = `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>Last check-in</span>
              <span class="text-[10px] text-gray-500">${lastText}</span>
            </div>
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>Breaks logged</span>
              <span class="text-[10px] text-gray-500">${this.wellnessActivities?.break || 0}</span>
            </div>
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>Hydration</span>
              <span class="text-[10px] text-gray-500">${this.wellnessActivities?.hydrate || 0}</span>
            </div>
          `;
        }

        if (topTask) {
          document.getElementById('timer-suggestion').innerText = `Suggested: ${topTask.title}`;
        } else {
          document.getElementById('timer-suggestion').innerText = 'No tasks pending - take a break!';
        }

        this.renderFocusDashboard();
        this.renderHabitsDashboard();
        this.updateRealtimeUI();
      },

      // Focus
      getFocusStats() {
        const todayKey = this.getDateKey();
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);
        let todayMinutes = 0;
        let weekMinutes = 0;
        let totalMinutes = 0;
        let deepSessions = 0;
        let longestSession = null;
        this.focusSessions.forEach(s => {
          const d = new Date(s.endedAt);
          if (this.getDateKey(d) === todayKey) todayMinutes += s.duration;
          if (d >= weekStart) weekMinutes += s.duration;
          totalMinutes += s.duration;
          if (s.duration >= 45) deepSessions += 1;
          if (!longestSession || s.duration > longestSession.duration) longestSession = s;
        });
        const totalSessions = this.focusSessions.length;
        const avgSession = totalSessions ? Math.round(totalMinutes / totalSessions) : 0;
        const streakDays = this.calcFocusStreak();
        return { todayMinutes, weekMinutes, totalSessions, totalMinutes, avgSession, streakDays, deepSessions, longestSession };
      },
      getFocusDayTotals(days = 7) {
        const totals = {};
        this.focusSessions.forEach(s => {
          const key = this.getDateKey(new Date(s.endedAt));
          totals[key] = (totals[key] || 0) + s.duration;
        });
        const results = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          results.push({
            key,
            label: d.toLocaleDateString('en-GB', { weekday: 'short' }),
            minutes: totals[key] || 0
          });
        }
        return results;
      },
      calcFocusStreak() {
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          const minutes = this.focusSessions
            .filter(s => this.getDateKey(new Date(s.endedAt)) === key)
            .reduce((acc, s) => acc + s.duration, 0);
          if (minutes > 0) streak++;
          else break;
        }
        return streak;
      },
      logFocusSession(task, duration) {
        this.focusSessions.push({
          id: 'fs' + Date.now(),
          task: task || 'Focus session',
          duration,
          endedAt: Date.now()
        });
        this.saveAll();
        this.recordLiveEvent('Focus session logged', `${duration} min${task ? ' on ' + task : ''}`, 'focus');
        this.renderFocusDashboard();
        if (!document.getElementById('page-focus').classList.contains('hidden')) {
          this.renderFocusPage();
        }
      },
      renderFocusDashboard() {
        const list = document.getElementById('focus-log-list');
        if (!list) return;
        const sessions = [...this.focusSessions].sort((a, b) => b.endedAt - a.endedAt);
        const stats = this.getFocusStats();
        const todayEl = document.getElementById('focus-today-total');
        if (todayEl) todayEl.innerText = stats.todayMinutes;
        const lastEl = document.getElementById('focus-last-session');
        if (lastEl) {
          const last = sessions[0];
          lastEl.innerText = last ? `${last.duration}m${last.task ? ' - ' + last.task : ''}` : 'None yet';
        }
        list.innerHTML = sessions.slice(0, 3).map(s => `
          <div class="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2">
            <div>
              <p class="font-medium">${s.task}</p>
              <p class="text-xs text-gray-500">${this.formatShortDate(s.endedAt)} ${this.formatTime(s.endedAt)}</p>
            </div>
            <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">${s.duration} min</span>
          </div>
        `).join('') || '<p class="text-gray-500">No focus sessions yet. Start the timer to log one.</p>';
      },
      renderFocusPage() {
        const stats = this.getFocusStats();
        const todayEl = document.getElementById('focus-today-minutes');
        const weekEl = document.getElementById('focus-week-minutes');
        const avgEl = document.getElementById('focus-avg-session');
        const streakEl = document.getElementById('focus-streak-days');
        if (todayEl) todayEl.innerText = stats.todayMinutes;
        if (weekEl) weekEl.innerText = stats.weekMinutes;
        if (avgEl) avgEl.innerText = stats.avgSession;
        if (streakEl) streakEl.innerText = stats.streakDays;

        const goalInput = document.getElementById('focus-daily-goal');
        if (goalInput) goalInput.value = this.focusDailyGoal;
        const goal = this.focusDailyGoal || 60;
        const goalBar = document.getElementById('focus-goal-bar');
        const goalLabel = document.getElementById('focus-goal-label');
        const goalProgress = goal ? Math.min((stats.todayMinutes / goal) * 100, 100) : 0;
        if (goalBar) goalBar.style.width = `${goalProgress}%`;
        if (goalLabel) goalLabel.innerText = `${stats.todayMinutes} / ${goal} min`;

        const rangeValue = document.getElementById('focus-range')?.value || '7';
        const rangeDays = rangeValue === 'all' ? 30 : parseInt(rangeValue) || 7;
        const dayTotals = this.getFocusDayTotals(rangeDays);
        const chartEl = document.getElementById('focus-page-chart');
        if (chartEl) {
          if (this.focusPageChart) this.focusPageChart.destroy();
          this.focusPageChart = new Chart(chartEl.getContext('2d'), {
            type: 'line',
            data: {
              labels: dayTotals.map(d => d.label),
              datasets: [{
                label: 'Focus minutes',
                data: dayTotals.map(d => d.minutes),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79,70,229,0.12)',
                tension: 0.3,
                fill: true
              }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
          });
        }

        const bestDay = dayTotals.reduce((best, d) => (d.minutes > best.minutes ? d : best), { minutes: 0, label: '-' });
        const deepRatio = stats.totalSessions ? Math.round((stats.deepSessions / stats.totalSessions) * 100) : 0;
        const longest = stats.longestSession;
        const insightsList = document.getElementById('focus-insights-list');
        if (insightsList) {
          const longestLabel = longest ? `${longest.duration} min - ${this.escapeHtml(longest.task || 'Focus session')}` : 'No sessions yet';
          insightsList.innerHTML = [
            `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Best day</span><span class="text-xs text-gray-500">${bestDay.label} (${bestDay.minutes} min)</span></div>`,
            `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Longest session</span><span class="text-xs text-gray-500">${longestLabel}</span></div>`,
            `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Deep work ratio</span><span class="text-xs text-gray-500">${deepRatio}%</span></div>`
          ].join('');
        }

        const recommendationEl = document.getElementById('focus-recommendation');
        if (recommendationEl) {
          if (stats.todayMinutes < goal) recommendationEl.innerText = 'Schedule a 45-minute deep work block to hit your goal.';
          else if (stats.streakDays >= 3) recommendationEl.innerText = 'Protect your streak with a shorter focus sprint.';
          else recommendationEl.innerText = 'Plan your next focus session to build momentum.';
        }

        const search = (document.getElementById('focus-search')?.value || '').trim().toLowerCase();
        const sort = document.getElementById('focus-sort')?.value || 'recent';
        let sessions = [...this.focusSessions];
        if (rangeValue !== 'all') {
          const start = new Date();
          start.setDate(start.getDate() - (rangeDays - 1));
          start.setHours(0, 0, 0, 0);
          sessions = sessions.filter(s => new Date(s.endedAt) >= start);
        }
        if (search) {
          sessions = sessions.filter(s => (s.task || '').toLowerCase().includes(search));
        }
        sessions.sort((a, b) => {
          if (sort === 'duration') return (b.duration || 0) - (a.duration || 0);
          if (sort === 'task') return (a.task || '').localeCompare(b.task || '');
          return (b.endedAt || 0) - (a.endedAt || 0);
        });

        const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
        const logCount = document.getElementById('focus-log-count');
        if (logCount) logCount.innerText = `${sessions.length} sessions - ${totalMinutes} min`;

        const list = document.getElementById('focus-log-full');
        if (list) {
          list.innerHTML = sessions.map(s => {
            const label = s.duration >= 45 ? 'Deep' : s.duration >= 25 ? 'Standard' : 'Sprint';
            const tagClass = s.duration >= 45 ? 'bg-indigo-100 text-indigo-700' : s.duration >= 25 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700';
            return `
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white/60 rounded-xl px-3 py-2">
                <div>
                  <p class="font-medium">${this.escapeHtml(s.task || 'Focus session')}</p>
                  <p class="text-xs text-gray-500">${this.formatShortDate(s.endedAt)} ${this.formatTime(s.endedAt)}</p>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="${tagClass} px-2 py-1 rounded-full">${label}</span>
                  <span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">${s.duration} min</span>
                </div>
              </div>
            `;
          }).join('') || '<p class="text-gray-500">No sessions yet. Complete a timer to populate this.</p>';
        }
      },
      updateFocusGoal() {
        const value = parseInt(document.getElementById('focus-daily-goal')?.value || '60');
        this.focusDailyGoal = Math.max(15, Math.min(value || 60, 240));
        this.saveAll();
        this.renderFocusPage();
        this.showToast('Focus goal updated');
      },
      clearFocusLog() {
        if (!confirm('Clear all focus sessions?')) return;
        this.focusSessions = [];
        this.saveAll();
        this.renderFocusDashboard();
        this.renderFocusPage();
      },
      toggleFocusMode() {
        document.body.classList.toggle('focus-mode');
        const isOn = document.body.classList.contains('focus-mode');
        const exitBtn = document.getElementById('focus-exit-btn');
        if (exitBtn) exitBtn.classList.toggle('hidden', !isOn);
        this.showToast(isOn ? 'Focus mode on' : 'Focus mode off');
      },
      setTimerLength(value) {
        if (this.isTimerRunning) {
          this.showToast('Pause timer to change length');
          document.getElementById('timer-length').value = this.timerLength;
          return;
        }
        this.timerLength = parseInt(value) || 25;
        this.timerSeconds = this.timerLength * 60;
        this.saveAll();
        this.updateTimerDisplay();
      },

      // Habits
      renderHabitsDashboard() {
        const container = document.getElementById('dashboard-habits-list');
        if (!container) return;
        if (!this.habits.length) {
          container.innerHTML = '<p class="text-gray-500">No habits yet. Add one!</p>';
          return;
        }
        const todayKey = this.getDateKey();
        container.innerHTML = this.habits.slice(0, 3).map(h => {
          const count = h.history[todayKey] || 0;
          const percent = Math.min((count / h.target) * 100, 100);
          return `
            <div class="bg-white/60 rounded-xl px-3 py-2">
              <div class="flex justify-between text-xs font-medium">
                <span>${h.title}</span>
                <span>${count}/${h.target}</span>
              </div>
              <div class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-1.5 bg-green-500" style="width:${percent}%"></div>
              </div>
            </div>
          `;
        }).join('');
      },
      getHabitStats() {
        const todayKey = this.getDateKey();
        const totalHabits = this.habits.length;
        const completedToday = this.habits.filter(h => (h.history[todayKey] || 0) >= h.target).length;
        const bestStreak = totalHabits ? Math.max(...this.habits.map(h => this.calcHabitStreak(h))) : 0;
        const consistency = totalHabits
          ? Math.round(this.habits.reduce((acc, h) => acc + this.calcHabitConsistency(h, 7), 0) / totalHabits)
          : 0;
        return { totalHabits, completedToday, bestStreak, consistency };
      },
      calcHabitConsistency(habit, days = 7) {
        let completed = 0;
        for (let i = 0; i < days; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          const count = habit.history[key] || 0;
          if (count >= habit.target) completed++;
        }
        return Math.round((completed / days) * 100);
      },
      buildHabitWeekHeatmap() {
        const container = document.getElementById('habits-week-heatmap');
        const labelEl = document.getElementById('habits-week-label');
        if (!container) return;
        if (!this.habits.length) {
          container.innerHTML = '<p class="text-sm text-gray-500">Add a habit to see consistency.</p>';
          if (labelEl) labelEl.innerText = 'Last 7 days of habit completion.';
          return;
        }
        let html = '';
        let ratioTotal = 0;
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          const completed = this.habits.filter(h => (h.history[key] || 0) >= h.target).length;
          const ratio = completed / this.habits.length;
          ratioTotal += ratio;
          let level = 0;
          if (ratio > 0.8) level = 5;
          else if (ratio > 0.6) level = 4;
          else if (ratio > 0.4) level = 3;
          else if (ratio > 0.2) level = 2;
          else if (ratio > 0) level = 1;
          html += `<span class="heatmap-cell" data-level="${level}" title="${key}: ${completed}/${this.habits.length} complete"></span>`;
        }
        container.innerHTML = html;
        if (labelEl) {
          const avg = Math.round((ratioTotal / 7) * 100);
          labelEl.innerText = `Average ${avg}% completion in the last 7 days.`;
        }
      },
      renderHabitsPage() {
        const container = document.getElementById('habits-container');
        if (!container) return;
        const stats = this.getHabitStats();
        const totalEl = document.getElementById('habits-total-count');
        const completedEl = document.getElementById('habits-completed-today');
        const bestEl = document.getElementById('habits-best-streak');
        const consistencyEl = document.getElementById('habits-consistency');
        if (totalEl) totalEl.innerText = stats.totalHabits;
        if (completedEl) completedEl.innerText = stats.completedToday;
        if (bestEl) bestEl.innerText = stats.bestStreak;
        if (consistencyEl) consistencyEl.innerText = `${stats.consistency}%`;

        this.buildHabitWeekHeatmap();

        if (!this.habits.length) {
          container.innerHTML = '<p class="text-gray-500">No habits yet. Create one to start tracking.</p>';
          return;
        }
        const search = (document.getElementById('habits-search')?.value || '').trim().toLowerCase();
        const filter = document.getElementById('habits-filter')?.value || 'all';
        const sort = document.getElementById('habits-sort')?.value || 'streak';
        const showEmpty = document.getElementById('habits-show-empty')?.checked ?? true;
        const todayKey = this.getDateKey();

        let list = this.habits.map(h => {
          const count = h.history[todayKey] || 0;
          const percent = Math.min((count / h.target) * 100, 100);
          const streak = this.calcHabitStreak(h);
          const consistency = this.calcHabitConsistency(h, 7);
          const hasHistory = Object.values(h.history || {}).some(v => v > 0);
          return { habit: h, count, percent, streak, consistency, hasHistory };
        });
        const allItems = [...list];

        if (search) {
          list = list.filter(item => (item.habit.title || '').toLowerCase().includes(search));
        }
        if (!showEmpty) list = list.filter(item => item.hasHistory);
        if (filter === 'completed') list = list.filter(item => item.count >= item.habit.target);
        if (filter === 'pending') list = list.filter(item => item.count < item.habit.target);
        if (filter === 'struggling') list = list.filter(item => item.consistency < 40 || (item.streak === 0 && item.count < item.habit.target));

        list.sort((a, b) => {
          if (sort === 'completion') return b.percent - a.percent;
          if (sort === 'name') return (a.habit.title || '').localeCompare(b.habit.title || '');
          if (sort === 'consistency') return b.consistency - a.consistency;
          return b.streak - a.streak;
        });

        const insightsList = document.getElementById('habits-insight-list');
        if (insightsList) {
          const sortedByStreak = [...allItems].sort((a, b) => b.streak - a.streak);
          const sortedByConsistency = [...allItems].sort((a, b) => b.consistency - a.consistency);
          const topStreak = sortedByStreak[0];
          const mostConsistent = sortedByConsistency[0];
          const needsFocus = [...allItems].sort((a, b) => a.consistency - b.consistency)[0];
          insightsList.innerHTML = [
            topStreak ? `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Top streak</span><span class="text-xs text-gray-500">${this.escapeHtml(topStreak.habit.title)} (${topStreak.streak}d)</span></div>` : '',
            mostConsistent ? `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Most consistent</span><span class="text-xs text-gray-500">${this.escapeHtml(mostConsistent.habit.title)} (${mostConsistent.consistency}%)</span></div>` : '',
            needsFocus ? `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Needs focus</span><span class="text-xs text-gray-500">${this.escapeHtml(needsFocus.habit.title)} (${needsFocus.consistency}%)</span></div>` : ''
          ].filter(Boolean).join('') || '<p class="text-sm text-gray-500">Track habits to see insights.</p>';
        }

        container.innerHTML = list.map(item => {
          const h = item.habit;
          const week = this.getHabitWeekCells(h);
          const statusClass = item.count >= h.target ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
          const statusLabel = item.count >= h.target ? 'On track' : 'Behind';
          return `
            <div class="glass-card p-5">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-lg">${this.escapeHtml(h.title)}</h4>
                  <p class="text-xs text-gray-500">Target: ${h.target} / day</p>
                </div>
                <span class="text-xs ${statusClass} px-2 py-1 rounded-full">${statusLabel}</span>
              </div>
              <div class="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-2 bg-green-500" style="width:${item.percent}%"></div>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>Today: ${item.count}/${h.target}</span>
                <span>Consistency: ${item.consistency}%</span>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>Streak: ${item.streak} day${item.streak === 1 ? '' : 's'}</span>
                <div class="flex gap-1">${week}</div>
              </div>
              <div class="mt-4 flex gap-2">
                <button onclick="APP.incrementHabit('${h.id}')" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs">Check in</button>
                <button onclick="APP.resetHabitToday('${h.id}')" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-xl text-xs">Reset</button>
                <button onclick="APP.deleteHabit('${h.id}')" class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-xl text-xs"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          `;
        }).join('') || '<p class="text-gray-500">No habits match this filter.</p>';
      },
      getHabitWeekCells(habit) {
        let html = '';
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          const count = habit.history[key] || 0;
          let level = 0;
          if (count >= habit.target) level = 2;
          else if (count > 0) level = 1;
          html += `<span class="habit-day" data-level="${level}" title="${key}: ${count}/${habit.target}"></span>`;
        }
        return html;
      },
      calcHabitStreak(habit) {
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          const count = habit.history[key] || 0;
          if (count >= habit.target) streak++;
          else break;
        }
        return streak;
      },
      async openAddHabitModal() {
        const res = await this.openModal('New Habit', [
          { label: 'Habit name', name: 'title', placeholder: 'e.g., Read 20 minutes' },
          { label: 'Target per day', name: 'target', type: 'number', value: '1' }
        ]);
        if (res) {
          this.habits.push({
            id: 'h' + Date.now(),
            title: res.title || 'New Habit',
            target: Math.max(1, parseInt(res.target) || 1),
            history: {}
          });
          this.saveAll();
          this.renderHabitsPage();
          this.renderHabitsDashboard();
          this.addXP(3, 'new habit');
        }
      },
      addHabitTemplate(title, target) {
        this.habits.push({
          id: 'h' + Date.now(),
          title,
          target: Math.max(1, parseInt(target) || 1),
          history: {}
        });
        this.saveAll();
        this.renderHabitsPage();
        this.renderHabitsDashboard();
        this.addXP(2, 'habit template');
      },
      incrementHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;
        const todayKey = this.getDateKey();
        const prev = habit.history[todayKey] || 0;
        const next = Math.min(habit.target, prev + 1);
        habit.history[todayKey] = next;
        if (prev < habit.target && next >= habit.target) {
          this.addXP(5, 'habit complete');
        }
        this.saveAll();
        this.renderHabitsPage();
        this.renderHabitsDashboard();
      },
      resetHabitToday(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;
        habit.history[this.getDateKey()] = 0;
        this.saveAll();
        this.renderHabitsPage();
        this.renderHabitsDashboard();
      },
      resetAllHabitsToday() {
        const todayKey = this.getDateKey();
        this.habits.forEach(h => { h.history[todayKey] = 0; });
        this.saveAll();
        this.renderHabitsPage();
        this.renderHabitsDashboard();
        this.showToast('Habits reset for today');
      },
      deleteHabit(id) {
        this.habits = this.habits.filter(h => h.id !== id);
        this.saveAll();
        this.renderHabitsPage();
        this.renderHabitsDashboard();
      },

      // Tasks
      renderTasksPage() {
        const container = document.getElementById('tasks-list-container');
        if (!container) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const search = (document.getElementById('tasks-search')?.value || '').trim().toLowerCase();
        const filter = document.getElementById('tasks-filter')?.value || 'all';
        const sort = document.getElementById('tasks-sort')?.value || 'due';
        const showCompleted = document.getElementById('tasks-show-completed')?.checked ?? true;

        const priorityRank = { High: 3, Medium: 2, Low: 1 };
        const tasksMeta = this.tasks.map(t => {
          const dueDate = t.due ? new Date(`${t.due}T00:00:00`) : null;
          const overdue = dueDate && dueDate < today && !t.completed;
          const dueToday = dueDate && dueDate.getTime() === today.getTime();
          const priority = t.priority || 'Medium';
          return {
            ...t,
            dueDate,
            overdue,
            dueToday,
            priority,
            priorityScore: priorityRank[priority] || 2,
            category: t.category || 'General',
            estimate: t.estimate || 30
          };
        });

        const totalTasks = tasksMeta.length;
        const completedTasks = tasksMeta.filter(t => t.completed).length;
        const overdueTasks = tasksMeta.filter(t => t.overdue).length;
        const dueTodayTasks = tasksMeta.filter(t => t.dueToday && !t.completed).length;
        const xpPotential = tasksMeta.filter(t => !t.completed).reduce((acc, t) => acc + (t.xp || 0), 0);

        const totalEl = document.getElementById('tasks-total-count');
        const completedEl = document.getElementById('tasks-completed-count');
        const dueTodayEl = document.getElementById('tasks-due-today');
        const overdueEl = document.getElementById('tasks-overdue-count');
        const xpEl = document.getElementById('tasks-xp-total');
        if (totalEl) totalEl.innerText = totalTasks;
        if (completedEl) completedEl.innerText = completedTasks;
        if (dueTodayEl) dueTodayEl.innerText = dueTodayTasks;
        if (overdueEl) overdueEl.innerText = overdueTasks;
        if (xpEl) xpEl.innerText = xpPotential;

        let list = [...tasksMeta];
        if (search) {
          list = list.filter(t => `${t.title} ${t.category}`.toLowerCase().includes(search));
        }
        if (!showCompleted) list = list.filter(t => !t.completed);
        if (filter === 'pending') list = list.filter(t => !t.completed);
        if (filter === 'completed') list = list.filter(t => t.completed);
        if (filter === 'overdue') list = list.filter(t => t.overdue);
        if (filter === 'today') list = list.filter(t => t.dueToday);

        list.sort((a, b) => {
          if (sort === 'priority') return b.priorityScore - a.priorityScore;
          if (sort === 'xp') return (b.xp || 0) - (a.xp || 0);
          if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
          const ad = a.dueDate ? a.dueDate.getTime() : Infinity;
          const bd = b.dueDate ? b.dueDate.getTime() : Infinity;
          return ad - bd;
        });

        const listCountEl = document.getElementById('tasks-list-count');
        if (listCountEl) listCountEl.innerText = `${list.length} tasks`;

        const insights = document.getElementById('tasks-insights-list');
        if (insights) {
          const topPriority = tasksMeta.filter(t => !t.completed).sort((a, b) => b.priorityScore - a.priorityScore)[0];
          const nextDue = tasksMeta.filter(t => !t.completed && t.dueDate).sort((a, b) => a.dueDate - b.dueDate)[0];
          const overdue = tasksMeta.filter(t => t.overdue).length;
          insights.innerHTML = [
            topPriority ? `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Top priority</span><span class="text-xs text-gray-500">${this.escapeHtml(topPriority.title)}</span></div>` : '',
            nextDue ? `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Next due</span><span class="text-xs text-gray-500">${this.escapeHtml(nextDue.title)} (${nextDue.due})</span></div>` : '',
            `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>Overdue</span><span class="text-xs text-gray-500">${overdue} tasks</span></div>`
          ].filter(Boolean).join('') || '<p class="text-sm text-gray-500">Add tasks to see insights.</p>';
        }

        const upcomingEl = document.getElementById('tasks-upcoming-list');
        if (upcomingEl) {
          const upcoming = tasksMeta.filter(t => !t.completed && t.dueDate).sort((a, b) => a.dueDate - b.dueDate).slice(0, 5);
          upcomingEl.innerHTML = upcoming.map(t => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(t.title)}</span>
              <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${t.due}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No upcoming tasks.</p>';
        }

        container.innerHTML = list.map(t => {
          const priorityClass = t.priority === 'High'
            ? 'bg-red-100 text-red-700'
            : t.priority === 'Low'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-amber-100 text-amber-700';
          const statusClass = t.overdue ? 'bg-red-50 border-red-200' : 'bg-white/60';
          return `
            <div class="p-3 rounded-xl border ${statusClass}">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-3">
                  <i onclick="APP.toggleTaskComplete('${t.id}')" class="fas ${t.completed ? 'fa-check-circle text-green-600' : 'fa-circle text-gray-300'} cursor-pointer text-lg mt-0.5"></i>
                  <div>
                    <p class="${t.completed ? 'line-through text-gray-400' : 'font-medium'}">${this.escapeHtml(t.title)}</p>
                    <div class="flex flex-wrap gap-2 text-[10px] text-gray-500 mt-1">
                      <span class="bg-gray-100 px-2 py-0.5 rounded-full">${this.escapeHtml(t.category)}</span>
                      <span class="${priorityClass} px-2 py-0.5 rounded-full">${t.priority}</span>
                      <span class="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">+${t.xp} XP</span>
                      <span class="bg-gray-100 px-2 py-0.5 rounded-full">${t.estimate} min</span>
                      ${t.recurrence && t.recurrence !== 'none' ? `<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">${t.recurrence}</span>` : ''}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="bg-gray-100 px-2 py-1 rounded-full">${t.due || 'No due'}</span>
                  <button onclick="APP.startTaskFocus('${t.id}')" class="bg-indigo-600 text-white px-2.5 py-1 rounded-full">Focus</button>
                  <i onclick="APP.deleteTask('${t.id}')" class="fas fa-trash text-red-400 hover:text-red-600 cursor-pointer"></i>
                </div>
              </div>
            </div>
          `;
        }).join('') || '<p class="text-gray-500">No tasks match this filter.</p>';
      },
      startTaskFocus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        this.startTimer();
        this.showToast(`Focus started: ${task.title}`);
      },
      completeAllTasks() {
        const pending = this.tasks.filter(t => !t.completed);
        if (!pending.length) {
          this.showToast('No pending tasks');
          return;
        }
        pending.forEach(t => {
          t.completed = true;
          t.completedAt = Date.now();
        });
        this.saveAll();
        this.recordLiveEvent('Tasks completed', `${pending.length} tasks cleared at once`, 'task');
        this.renderTasksPage();
        this.renderDashboard();
        this.addXP(10, 'all tasks completed');
      },
      toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task && !task.completed) {
          task.completed = true;
          task.completedAt = Date.now();
          this.recordLiveEvent('Task completed', task.title || 'Task done', 'task');
          this.addXP(task.xp, 'task completed');
          if (task.recurrence && task.recurrence !== 'none') {
            let nextDue = new Date(task.due);
            if (task.recurrence === 'daily') nextDue.setDate(nextDue.getDate() + 1);
            else if (task.recurrence === 'weekly') nextDue.setDate(nextDue.getDate() + 7);
            else if (task.recurrence === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);
            const newTask = { ...task, id: 't' + Date.now(), completed: false, due: nextDue.toISOString().slice(0,10) };
            this.tasks.push(newTask);
          }
        } else if (task) task.completed = false;
        this.saveAll();
        this.renderTasksPage();
        this.renderDashboard();
      },
      deleteTask(id) { this.tasks = this.tasks.filter(t => t.id !== id); this.saveAll(); this.renderTasksPage(); this.renderDashboard(); },
      async openAddTaskModal() {
        const res = await this.openModal('New Task', [
          { label: 'Title', name: 'title', placeholder: 'e.g., Read chapter 5' },
          { label: 'Due date', name: 'due', type: 'date', value: new Date().toISOString().slice(0,10) },
          { label: 'XP reward', name: 'xp', type: 'number', value: '15' },
          { label: 'Priority (High/Medium/Low)', name: 'priority', value: 'Medium' },
          { label: 'Category', name: 'category', placeholder: 'e.g., Math' },
          { label: 'Estimate (minutes)', name: 'estimate', type: 'number', value: '30' },
          { label: 'Recurrence (none/daily/weekly/monthly)', name: 'recurrence', value: 'none' }
        ]);
        if (res) {
          this.tasks.push({
            id: 't'+Date.now(),
            title: res.title,
            due: res.due,
            completed: false,
            xp: parseInt(res.xp) || 15,
            priority: res.priority || 'Medium',
            category: res.category || 'General',
            estimate: parseInt(res.estimate) || 30,
            recurrence: res.recurrence || 'none'
          });
          this.saveAll(); this.renderTasksPage(); this.renderDashboard(); this.addXP(5, 'created task');
          this.recordLiveEvent('Task created', res.title || 'New task', 'task');
        }
      },

      // Flashcards
      getDeckStats(deck) {
        const cards = deck.cards || [];
        const total = cards.length;
        const now = Date.now();
        const due = cards.filter(c => !c.nextReview || c.nextReview <= now).length;
        const mastery = total ? cards.reduce((acc, c) => acc + (c.easeFactor || 2.5), 0) / total : 0;
        const intervalAvg = total ? cards.reduce((acc, c) => acc + (c.interval || 1), 0) / total : 0;
        const nextReview = cards
          .filter(c => c.nextReview && c.nextReview > now)
          .sort((a, b) => a.nextReview - b.nextReview)[0]?.nextReview;
        return { total, due, mastery, intervalAvg, nextReview };
      },
      getNextReviewLabel(stats) {
        if (!stats.total) return 'No cards yet';
        if (stats.due > 0) return 'Due now';
        if (!stats.nextReview) return 'No schedule';
        const diff = stats.nextReview - Date.now();
        const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
        if (days <= 1) return 'Due in 1 day';
        return `Due in ${days} days`;
      },
      renderFlashcardDecks() {
        const container = document.getElementById('decks-container');
        if (!container) return;

        const search = (document.getElementById('flashcards-search')?.value || '').trim().toLowerCase();
        const filter = document.getElementById('flashcards-filter')?.value || 'all';
        const sort = document.getElementById('flashcards-sort')?.value || 'name';
        const showEmpty = document.getElementById('flashcards-show-empty')?.checked ?? true;

        const deckData = this.flashcardDecks.map(deck => ({ deck, stats: this.getDeckStats(deck) }));
        const totals = deckData.reduce((acc, item) => {
          acc.decks += 1;
          acc.cards += item.stats.total;
          acc.due += item.stats.due;
          acc.mastery += item.stats.mastery * item.stats.total;
          return acc;
        }, { decks: 0, cards: 0, due: 0, mastery: 0 });
        const masteryScore = totals.cards ? Math.round((totals.mastery / totals.cards) * 10) / 10 : 0;

        const totalDecksEl = document.getElementById('flashcards-total-decks');
        const totalCardsEl = document.getElementById('flashcards-total-cards');
        const dueEl = document.getElementById('flashcards-due-count');
        const masteryEl = document.getElementById('flashcards-mastery-score');
        if (totalDecksEl) totalDecksEl.innerText = totals.decks;
        if (totalCardsEl) totalCardsEl.innerText = totals.cards;
        if (dueEl) dueEl.innerText = totals.due;
        if (masteryEl) masteryEl.innerText = masteryScore.toFixed(1);

        const settings = this.flashcardSettings || { shuffle: true, sessionSize: 20, dailyGoal: 20 };
        const shuffleEl = document.getElementById('flashcards-shuffle-toggle');
        const sizeEl = document.getElementById('flashcards-session-size');
        const goalEl = document.getElementById('flashcards-daily-goal');
        if (shuffleEl) shuffleEl.checked = !!settings.shuffle;
        if (sizeEl) sizeEl.value = settings.sessionSize || 20;
        if (goalEl) goalEl.value = settings.dailyGoal || 20;

        const reviewGoal = settings.dailyGoal || 20;
        const reviewBar = document.getElementById('flashcards-review-bar');
        const reviewGoalEl = document.getElementById('flashcards-review-goal');
        const reviewLabelEl = document.getElementById('flashcards-due-count-label');
        const progress = reviewGoal ? Math.min((totals.due / reviewGoal) * 100, 100) : 0;
        if (reviewBar) reviewBar.style.width = `${progress}%`;
        if (reviewGoalEl) reviewGoalEl.innerText = reviewGoal;
        if (reviewLabelEl) reviewLabelEl.innerText = `${totals.due} due`;

        const dueListEl = document.getElementById('flashcards-due-list');
        if (dueListEl) {
          const dueDecks = deckData
            .filter(d => d.stats.due > 0)
            .sort((a, b) => b.stats.due - a.stats.due)
            .slice(0, 4);
          dueListEl.innerHTML = dueDecks.map(d => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(d.deck.name)}</span>
              <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${d.stats.due} due</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No due cards. Great job!</p>';
        }

        const quickDeckSelect = document.getElementById('flashcards-quick-deck');
        if (quickDeckSelect) {
          quickDeckSelect.innerHTML = this.flashcardDecks.length
            ? this.flashcardDecks.map(d => `<option value="${d.id}">${this.escapeHtml(d.name)}</option>`).join('')
            : '<option value="">Create a deck first</option>';
        }

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        let filtered = [...deckData];
        if (search) {
          filtered = filtered.filter(d => {
            const deckMatch = (d.deck.name || '').toLowerCase().includes(search);
            const cardMatch = (d.deck.cards || []).some(c => `${c.front || ''} ${c.back || ''}`.toLowerCase().includes(search));
            return deckMatch || cardMatch;
          });
        }
        if (!showEmpty) filtered = filtered.filter(d => d.stats.total > 0);
        if (filter === 'due') filtered = filtered.filter(d => d.stats.due > 0);
        if (filter === 'today') {
          filtered = filtered.filter(d => (d.deck.cards || []).some(c => !c.nextReview || c.nextReview <= endOfDay.getTime()));
        }
        if (filter === 'empty') filtered = filtered.filter(d => d.stats.total === 0);

        filtered.sort((a, b) => {
          if (sort === 'cards') return b.stats.total - a.stats.total;
          if (sort === 'due') return b.stats.due - a.stats.due;
          if (sort === 'mastery') return b.stats.mastery - a.stats.mastery;
          return (a.deck.name || '').localeCompare(b.deck.name || '');
        });

        container.innerHTML = filtered.map(({ deck, stats }) => {
          const masteryLabel = stats.mastery >= 2.8 ? 'Strong' : stats.mastery >= 2.3 ? 'Growing' : 'Fresh';
          const masteryClass = stats.mastery >= 2.8 ? 'bg-emerald-100 text-emerald-700' : stats.mastery >= 2.3 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700';
          const progress = stats.total ? Math.round(((stats.total - stats.due) / stats.total) * 100) : 0;
          const nextLabel = this.getNextReviewLabel(stats);
          return `
            <div class="glass-card p-5 cursor-pointer" onclick="APP.startFlashcardReview('${deck.id}')">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-semibold text-lg">${this.escapeHtml(deck.name)}</h4>
                  <p class="text-sm text-gray-600">${stats.total} cards - ${stats.due} due</p>
                </div>
                <span class="text-[10px] ${masteryClass} px-2 py-0.5 rounded-full">${masteryLabel} ${stats.mastery.toFixed(1)}</span>
              </div>
              <div class="mt-3">
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div class="h-2 rounded-full bg-indigo-500" style="width:${progress}%"></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">${nextLabel}</p>
              </div>
              <div class="mt-4 flex flex-wrap gap-2 text-xs">
                <button class="bg-indigo-600 text-white px-3 py-1.5 rounded-full" onclick="event.stopPropagation(); APP.startFlashcardReview('${deck.id}')">Review</button>
                <button class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full" onclick="event.stopPropagation(); APP.openAddCardModal('${deck.id}')">Add card</button>
              </div>
            </div>
          `;
        }).join('') || '<p class="text-sm text-gray-500">No decks found. Create a new deck to get started.</p>';
      },
      updateFlashcardSettings() {
        const shuffle = document.getElementById('flashcards-shuffle-toggle')?.checked ?? true;
        const sessionSize = parseInt(document.getElementById('flashcards-session-size')?.value || '20');
        const dailyGoal = parseInt(document.getElementById('flashcards-daily-goal')?.value || '20');
        this.flashcardSettings = {
          shuffle,
          sessionSize: Math.max(5, Math.min(sessionSize || 20, 100)),
          dailyGoal: Math.max(5, Math.min(dailyGoal || 20, 200))
        };
        this.saveAll();
        this.renderFlashcardDecks();
      },
      async openCreateDeckModal() {
        const res = await this.openModal('New Deck', [{ label: 'Deck name', name: 'name', placeholder: 'e.g., Physics' }]);
        if (res) {
          this.flashcardDecks.push({ id: 'd'+Date.now(), name: res.name, cards: [] });
          this.saveAll();
          this.renderFlashcardDecks();
        }
      },
      async openAddCardModal(deckId) {
        const res = await this.openModal('Add Card', [
          { label: 'Front', name: 'front', placeholder: 'Question' },
          { label: 'Back', name: 'back', placeholder: 'Answer' }
        ]);
        if (res) {
          const deck = this.flashcardDecks.find(d => d.id === deckId);
          if (!deck) {
            this.showToast('Deck not found');
            return;
          }
          deck.cards.push({ id: 'c'+Date.now(), front: res.front, back: res.back, nextReview: Date.now(), easeFactor: 2.5, interval: 1 });
          this.saveAll();
          this.renderFlashcardDecks();
        }
      },
      async openFlashcardImportModal() {
        if (!this.notes.length) {
          this.showToast('No notes to import');
          return;
        }
        const res = await this.openModal('Import from Notes', [
          { label: 'Deck name', name: 'name', placeholder: 'e.g., Notes Import' },
          { label: 'Number of notes', name: 'count', type: 'number', value: '5' }
        ]);
        if (res) {
          const count = Math.min(this.notes.length, parseInt(res.count) || 5);
          const sorted = [...this.notes].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, count);
          const cards = sorted.map((note, idx) => ({
            id: 'c' + (Date.now() + idx),
            front: note.title || 'Note',
            back: (note.content || '').substring(0, 160),
            nextReview: Date.now(),
            easeFactor: 2.5,
            interval: 1
          }));
          const name = res.name || 'Notes Import';
          this.flashcardDecks.push({ id: 'd' + Date.now(), name, cards });
          this.saveAll();
          this.renderFlashcardDecks();
          this.showToast(`Imported ${cards.length} cards`);
        }
      },
      quickAddFlashcard() {
        const deckId = document.getElementById('flashcards-quick-deck')?.value;
        const front = document.getElementById('flashcards-quick-front')?.value.trim();
        const back = document.getElementById('flashcards-quick-back')?.value.trim();
        if (!deckId) {
          this.showToast('Create a deck first');
          return;
        }
        if (!front || !back) {
          this.showToast('Add both front and back');
          return;
        }
        const deck = this.flashcardDecks.find(d => d.id === deckId);
        if (!deck) return;
        deck.cards.push({ id: 'c'+Date.now(), front, back, nextReview: Date.now(), easeFactor: 2.5, interval: 1 });
        document.getElementById('flashcards-quick-front').value = '';
        document.getElementById('flashcards-quick-back').value = '';
        this.saveAll();
        this.renderFlashcardDecks();
        this.showToast('Card added');
      },
      buildFlashcardSession(cards, name, sourceCount = null) {
        if (!cards || !cards.length) {
          this.showToast('No cards available');
          return;
        }
        const settings = this.flashcardSettings || { shuffle: true, sessionSize: cards.length, dailyGoal: 20 };
        let queue = [...cards];
        if (settings.shuffle) queue = queue.sort(() => 0.5 - Math.random());
        const limit = Math.min(queue.length, settings.sessionSize || queue.length);
        queue = queue.slice(0, limit);
        this.currentDeck = { id: 'session', name, cards: queue };
        this.currentDeckSourceCount = sourceCount || queue.length;
        this.currentCardIndex = 0;
        const browse = document.getElementById('flashcards-browse');
        if (browse) browse.classList.add('hidden');
        document.getElementById('flashcard-review-area').classList.remove('hidden');
        document.getElementById('current-deck-name').innerText = name;
        this.updateFlashcardSessionMeta();
        this.displayFlashcard();
      },
      startFlashcardSession(mode) {
        const now = Date.now();
        if (mode === 'due') {
          const dueCards = [];
          this.flashcardDecks.forEach(deck => {
            (deck.cards || []).forEach(card => {
              if (!card.nextReview || card.nextReview <= now) dueCards.push(card);
            });
          });
          this.buildFlashcardSession(dueCards, 'Daily Review', dueCards.length);
          return;
        }
        if (mode === 'all') {
          const allCards = this.flashcardDecks.flatMap(d => d.cards || []);
          this.buildFlashcardSession(allCards, 'Cram Session', allCards.length);
          return;
        }
        this.showToast('Unknown session type');
      },
      startFlashcardReview(deckId) {
        const deck = this.flashcardDecks.find(d => d.id === deckId);
        if (!deck || deck.cards.length === 0) {
          this.showToast('No cards in this deck');
          return;
        }
        this.buildFlashcardSession(deck.cards, deck.name, deck.cards.length);
      },
      updateFlashcardSessionMeta() {
        if (!this.currentDeck) return;
        const shuffle = this.flashcardSettings?.shuffle ? 'shuffle on' : 'in order';
        const total = this.currentDeck.cards.length;
        const source = this.currentDeckSourceCount || total;
        const meta = document.getElementById('flashcard-session-meta');
        if (meta) {
          meta.innerText = source !== total
            ? `${total} of ${source} cards - ${shuffle}`
            : `${total} cards - ${shuffle}`;
        }
      },
      displayFlashcard() {
        const card = this.currentDeck.cards[this.currentCardIndex];
        if (!card) return;
        const container = document.getElementById('flashcard-container');
        container.innerHTML = `
          <div class="flashcard" onclick="this.classList.toggle('flipped')">
            <div class="flashcard-inner">
              <div class="flashcard-front">${this.escapeHtml(card.front || '')}</div>
              <div class="flashcard-back">${this.escapeHtml(card.back || '')}</div>
            </div>
          </div>
        `;
        const total = this.currentDeck.cards.length;
        const progress = Math.round(((this.currentCardIndex + 1) / total) * 100);
        document.getElementById('flashcard-progress').innerText = `Card ${this.currentCardIndex+1}/${total}`;
        const bar = document.getElementById('flashcard-progress-bar');
        if (bar) bar.style.width = `${progress}%`;
        const meta = document.getElementById('flashcard-card-meta');
        if (meta) {
          const nextLabel = card.nextReview && card.nextReview > Date.now()
            ? `Next review ${this.formatShortDate(card.nextReview)}`
            : 'Due now';
          const ease = (card.easeFactor || 2.5).toFixed(2);
          const interval = Math.round(card.interval || 1);
          meta.innerText = `Ease ${ease} - interval ${interval}d - ${nextLabel}`;
        }
      },
      flashcardCorrect() {
        if (!this.currentDeck) return;
        const card = this.currentDeck.cards[this.currentCardIndex];
        const ease = Math.max(1.3, card.easeFactor || 2.5);
        const interval = Math.max(1, card.interval || 1);
        card.easeFactor = ease;
        card.interval = Math.min(interval * ease, 30);
        card.nextReview = Date.now() + card.interval * 24 * 60 * 60 * 1000;
        this.addXP(5, 'flashcard correct');
        this.nextFlashcard();
      },
      flashcardIncorrect() {
        if (!this.currentDeck) return;
        const card = this.currentDeck.cards[this.currentCardIndex];
        card.interval = 1;
        card.easeFactor = Math.max(1.3, (card.easeFactor || 2.5) - 0.2);
        card.nextReview = Date.now() + 24 * 60 * 60 * 1000;
        this.addXP(2, 'flashcard review');
        this.nextFlashcard();
      },
      nextFlashcard() {
        this.currentCardIndex++;
        if (this.currentCardIndex >= this.currentDeck.cards.length) {
          this.exitFlashcardReview();
          this.showToast('Deck completed! +20 XP');
          this.addXP(20, 'deck completed');
        } else {
          this.displayFlashcard();
        }
      },
      exitFlashcardReview() {
        this.currentDeck = null;
        this.currentDeckSourceCount = null;
        const browse = document.getElementById('flashcards-browse');
        if (browse) browse.classList.remove('hidden');
        document.getElementById('flashcard-review-area').classList.add('hidden');
        this.renderFlashcardDecks();
      },

      // ========== NEW COURSES METHODS ==========
      ensureCourseStructure() {
        this.courses = (this.courses || []).map((course) => {
          const modules = (course.modules || []).map((m, idx) => {
            const normalized = typeof m === 'string' ? { name: m } : { ...m };
            return {
              id: normalized.id || `m_${course.id}_${idx}`,
              name: normalized.name || `Module ${idx + 1}`,
              completed: !!normalized.completed,
              minutes: Number(normalized.minutes || 0),
              assessmentScore: normalized.assessmentScore ?? null,
              quiz: normalized.quiz || null,
              logs: Array.isArray(normalized.logs) ? normalized.logs : [],
              lastStudied: normalized.lastStudied || null
            };
          });
          return {
            ...course,
            modules
          };
        });
      },
      getLearningContext() {
        const keywords = [
          ...(this.userSkills || []),
          this.userCourse,
          this.userCollege,
          this.userYear,
          this.userBranch,
          ...this.courses.map(c => c.name),
          ...this.courses.map(c => c.code),
          ...this.courses.flatMap(c => c.skills || []),
          ...this.assignments.map(a => a.course),
          ...this.notes.map(n => n.subject),
          ...this.notes.flatMap(n => n.tags || []),
          ...this.tasks.map(t => t.category)
        ];
        const cleaned = keywords
          .filter(Boolean)
          .map(k => k.toString().toLowerCase().trim())
          .flatMap(k => k.split(/[,/|]+/))
          .map(k => k.trim())
          .filter(Boolean);
        const unique = Array.from(new Set(cleaned));
        return {
          keywords: unique.slice(0, 20),
          skills: this.userSkills || [],
          levelPreference: this.getProfileLevelPreference(),
          branch: this.userBranch || '',
          classYear: this.userYear || ''
        };
      },
      getAISuggestions() {
        const context = this.getLearningContext();
        const suggestions = [];
        const courses = this.courses || [];
        const existingCourseNames = courses.map(c => c.name.toLowerCase());
        const existingCodes = courses.map(c => (c.code || '').toLowerCase());
        const skillSuggestions = {
          'computer science': ['Data Structures', 'Algorithms', 'Machine Learning', 'Web Development', 'Database Systems'],
          'electronics': ['Circuit Analysis', 'Signal Processing', 'Microcontrollers', 'Digital Electronics', 'VLSI'],
          'mechanical': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'CAD/CAM'],
          'civil': ['Structural Analysis', 'Concrete Technology', 'Fluid Mechanics', 'Geotechnical Engineering', 'Transportation'],
          'electrical': ['Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics', 'Measurements'],
          'chemical': ['Chemical Thermodynamics', 'Reaction Engineering', 'Process Control', 'Mass Transfer', 'Chemical Process'],
          'biotechnology': ['Molecular Biology', 'Biochemistry', 'Genetic Engineering', 'Bioprocess Engineering', 'Bioinformatics'],
          'mathematics': ['Linear Algebra', 'Calculus', 'Differential Equations', 'Probability', 'Numerical Methods'],
          'physics': ['Quantum Mechanics', 'Electromagnetism', 'Thermodynamics', 'Optics', 'Solid State Physics'],
          'chemistry': ['Organic Chemistry', 'Physical Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Biochemistry']
        };
        const branchLower = (this.userBranch || '').toLowerCase();
        for (const [branch, skills] of Object.entries(skillSuggestions)) {
          if (branchLower.includes(branch) || branch.includes(branchLower)) {
            skills.forEach(skill => {
              if (!context.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
                suggestions.push({ type: 'skill', value: skill, reason: `Recommended for ${this.userBranch}` });
              }
            });
          }
        }
        if (!branchLower.includes('computer') && !branchLower.includes('cs')) {
          const commonSkills = ['Problem Solving', 'Critical Thinking', 'Data Analysis', 'Research'];
          commonSkills.forEach(skill => {
            if (!context.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
              suggestions.push({ type: 'skill', value: skill, reason: 'Essential for your year' });
            }
          });
        }
        if (this.userYear) {
          const yearSuggestions = {
            '1': ['Study Fundamentals', 'Time Management', 'Note Taking', 'Basic Lab Skills'],
            '2': ['Advanced Concepts', 'Practical Applications', 'Group Projects', 'Internship Prep'],
            '3': ['Specialization', 'Capstone Projects', 'Industry Ready', 'Research Methods'],
            '4': ['Final Year Project', 'Placement Prep', 'Higher Studies', 'Professional Skills']
          };
          const yearNum = this.userYear.toString().match(/\d+/)?.[0] || '';
          for (const [yr, yrSkills] of Object.entries(yearSuggestions)) {
            if (yearNum === yr) {
              yrSkills.forEach(skill => {
                if (!suggestions.find(s => s.value === skill)) {
                  suggestions.push({ type: 'skill', value: skill, reason: `Year ${yr} essential` });
                }
              });
            }
          }
        }
        const courseSuggestions = {
          'data structures': ['Algorithms', 'Database Management', 'Operating Systems', 'System Design'],
          'algorithms': ['Data Structures', 'Complexity Analysis', 'Graph Theory', 'Dynamic Programming'],
          'machine learning': ['Data Science', 'Deep Learning', 'Neural Networks', 'Statistics'],
          'web development': ['React', 'Node.js', 'Database', 'REST APIs', 'CSS'],
          'circuit': ['Electronics', 'Signal Processing', 'Power Systems', 'Control Systems'],
          'thermodynamics': ['Heat Transfer', 'Fluid Mechanics', 'Power Plant', 'Refrigeration']
        };
        courses.forEach(course => {
          const courseLower = (course.name || '').toLowerCase();
          for (const [key, suggested] of Object.entries(courseSuggestions)) {
            if (courseLower.includes(key)) {
              suggested.forEach(s => {
                if (!suggestions.find(x => x.value === s)) {
                  suggestions.push({ type: 'course', value: s, reason: `Complements ${course.name}` });
                }
              });
            }
          }
        });
        return suggestions.slice(0, 10);
      },
      getCourseMeta(course) {
        const modules = course.modules || [];
        const totalModules = modules.length;
        const completedModules = modules.filter(m => m.completed).length;
        const progress = totalModules ? Math.round((completedModules / totalModules) * 100) : 0;
        const level = course.level || (totalModules >= 6 ? 'Advanced' : totalModules >= 4 ? 'Intermediate' : 'Beginner');
        const instructor = course.instructor || 'TBA';
        const credits = course.credits || Math.max(1, Math.min(6, Math.ceil(totalModules / 3)));
        const target = course.target || 'A';
        const weeklyGoal = course.weeklyGoal || Math.max(3, Math.ceil(totalModules / 2));
        const nextModule = modules.find(m => !m.completed)?.name || (totalModules ? 'All modules complete' : 'Add modules to start');
        const timeSpent = modules.reduce((acc, m) => acc + (m.minutes || 0), 0);
        const scored = modules.filter(m => typeof m.assessmentScore === 'number');
        const avgScore = scored.length ? Math.round(scored.reduce((acc, m) => acc + (m.assessmentScore || 0), 0) / scored.length) : 0;
        return { modules, totalModules, completedModules, progress, level, instructor, credits, target, weeklyGoal, nextModule, timeSpent, avgScore };
      },
      getCourseRelevance(course, context) {
        const meta = this.getCourseMeta(course);
        const hay = `${course.name || ''} ${course.code || ''} ${course.branch || ''} ${course.classYear || ''} ${meta.instructor || ''} ${(meta.modules || []).map(m => m.name).join(' ')} ${(course.skills || []).join(' ')}`.toLowerCase();
        let score = 0;
        context.keywords.forEach(k => {
          if (hay.includes(k)) score += 4;
        });
        if (context.branch && course.branch && course.branch.toLowerCase().includes(context.branch.toLowerCase())) score += 6;
        if (context.classYear && course.classYear && course.classYear.toLowerCase().includes(context.classYear.toLowerCase())) score += 5;
        const courseSkills = (course.skills || []).map(s => s.toLowerCase());
        context.skills.forEach(s => {
          if (courseSkills.includes(s.toLowerCase())) score += 5;
        });
        if (meta.level === context.levelPreference) score += 8;
        const levelRank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        if ((levelRank[meta.level] || 1) > (levelRank[context.levelPreference] || 1)) score -= 4;
        if ((levelRank[meta.level] || 1) < (levelRank[context.levelPreference] || 1)) score += 2;
        if (meta.progress < 100) score += 6;
        return score;
      },
      buildLearningPath() {
        const context = this.getLearningContext();
        const items = [];
        (this.courses || []).forEach(course => {
          const meta = this.getCourseMeta(course);
          const nextIndex = meta.modules.findIndex(m => !m.completed);
          if (nextIndex !== -1) {
            const levelGate = this.courseSettings.levelGating;
            const locked = levelGate && nextIndex > 0 && meta.modules.slice(0, nextIndex).some(m => !m.completed);
            items.push({
              courseId: course.id,
              courseName: course.name,
              moduleIndex: nextIndex,
              moduleName: meta.modules[nextIndex]?.name || 'Next module',
              level: meta.level,
              progress: meta.progress,
              relevance: this.getCourseRelevance(course, context),
              locked
            });
          }
        });
        return items.sort((a, b) => (b.relevance - a.relevance) || (a.progress - b.progress)).slice(0, 6);
      },
      renderLearningPath() {
        const list = document.getElementById('courses-path-list');
        if (!list) return;
        const items = this.buildLearningPath();
        if (!items.length) {
          list.innerHTML = '<p class="text-gray-500">No open modules yet. Add a course or module to start.</p>';
          return;
        }
        list.innerHTML = items.map(item => `
          <div class="flex items-center justify-between bg-white/70 rounded-xl px-4 py-3">
            <div>
              <p class="font-semibold">${this.escapeHtml(item.courseName)} · ${this.escapeHtml(item.moduleName)}</p>
              <p class="text-xs text-gray-500">Level: ${item.level} · Progress ${item.progress}%</p>
            </div>
            <div class="flex items-center gap-2">
              ${item.locked ? '<span class="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Locked</span>' : '<span class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Next</span>'}
              <button onclick="APP.selectModule('${item.courseId}', ${item.moduleIndex})" class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl">Focus</button>
            </div>
          </div>
        `).join('');
      },
      renderModuleList() {
        const list = document.getElementById('courses-module-list');
        if (!list) return;
        const course = this.getActiveCourse();
        if (!course) {
          list.innerHTML = '<p class="text-gray-500">Select a course to view modules.</p>';
          return;
        }
        const firstIncomplete = course.modules.findIndex(m => !m.completed);
        list.innerHTML = (course.modules || []).map((m, idx) => {
          const locked = this.courseSettings.levelGating && firstIncomplete !== -1 && idx > firstIncomplete;
          const status = locked ? 'Locked' : (m.completed ? 'Done' : 'In progress');
          const statusClass = locked
            ? 'bg-red-100 text-red-700'
            : (m.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700');
          const action = locked ? `APP.showToast('Complete previous modules to unlock')` : `APP.selectModule('${course.id}', ${idx})`;
          return `
            <button onclick="${action}" class="w-full text-left bg-white/70 hover:bg-indigo-50 px-3 py-2 rounded-xl flex items-center justify-between">
              <span class="${m.completed ? 'line-through text-gray-400' : locked ? 'text-gray-400' : 'text-gray-700'}">${this.escapeHtml(m.name)}</span>
              <span class="text-[10px] ${statusClass} px-2 py-0.5 rounded-full">${status}</span>
            </button>
          `;
        }).join('') || '<p class="text-gray-500">No modules yet.</p>';
      },
      getActiveCourse() {
        if (this.selectedCourseId) {
          const match = this.courses.find(c => c.id === this.selectedCourseId);
          if (match) return match;
        }
        const path = this.buildLearningPath();
        if (path.length) {
          const next = this.courses.find(c => c.id === path[0].courseId);
          if (next) {
            this.selectedCourseId = next.id;
            this.selectedModuleIndex = path[0].moduleIndex;
            return next;
          }
        }
        return this.courses[0] || null;
      },
      selectModule(courseId, moduleIndex) {
        this.selectedCourseId = courseId;
        this.selectedModuleIndex = moduleIndex;
        this.saveAll({ sync: false });
        const course = this.courses.find(c => c.id === courseId);
        const mod = course?.modules?.[moduleIndex];
        const input = document.getElementById('courses-youtube-query');
        if (input && mod) {
          input.value = [mod.name, course?.name].filter(Boolean).join(' ');
        }
        this.renderModuleList();
        this.renderModuleDetail();
      },
      renderModuleDetail() {
        const detail = document.getElementById('courses-module-detail');
        const quizPanel = document.getElementById('courses-quiz-panel');
        if (!detail || !quizPanel) return;
        const course = this.getActiveCourse();
        if (!course || !course.modules || course.modules.length === 0) {
          detail.innerHTML = 'Select a module to view details.';
          quizPanel.classList.add('hidden');
          return;
        }
        const index = this.selectedModuleIndex >= 0 ? this.selectedModuleIndex : 0;
        const module = course.modules[index];
        if (!module) {
          detail.innerHTML = 'Select a module to view details.';
          quizPanel.classList.add('hidden');
          return;
        }
        const firstIncomplete = course.modules.findIndex(m => !m.completed);
        const locked = this.courseSettings.levelGating && firstIncomplete !== -1 && index > firstIncomplete;
        const score = typeof module.assessmentScore === 'number' ? `${module.assessmentScore}%` : 'Not taken';
        const minutes = module.minutes || 0;
        detail.innerHTML = `
          <div class="space-y-2">
            <p class="font-semibold text-gray-800">${this.escapeHtml(module.name)}</p>
            <p class="text-xs text-gray-500">Course: ${this.escapeHtml(course.name)} · ${course.code || '-'}</p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Time: ${minutes} min</span>
              <span class="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Quiz: ${score}</span>
              <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">${locked ? 'Locked' : module.completed ? 'Completed' : 'In progress'}</span>
            </div>
            ${locked ? '<p class="text-xs text-red-500">Complete earlier modules to unlock this lesson.</p>' : ''}
            <div class="flex flex-wrap gap-2 text-xs mt-2">
              <button onclick="${locked ? "APP.showToast('Unlock previous modules first')" : `APP.toggleModule('${course.id}', ${index})`}" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl">${module.completed ? 'Mark incomplete' : 'Mark complete'}</button>
              <button onclick="${locked ? "APP.showToast('Unlock previous modules first')" : `APP.toggleModuleTimer('${course.id}', ${index})`}" class="bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-xl">${this.activeModuleSession && this.activeModuleSession.courseId === course.id && this.activeModuleSession.moduleIndex === index ? 'Stop timer' : 'Start timer'}</button>
              <button onclick="${locked ? "APP.showToast('Unlock previous modules first')" : `APP.quickLogModule('${course.id}', ${index}, 25)`}" class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-xl">Log 25 min</button>
              <button onclick="${locked ? "APP.showToast('Unlock previous modules first')" : `APP.openModuleQuiz('${course.id}', ${index})`}" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl">Take quiz</button>
            </div>
          </div>
        `;
        quizPanel.classList.add('hidden');
      },
      toggleModuleTimer(courseId, moduleIndex) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;
        const mod = course.modules[moduleIndex];
        if (!mod) return;
        const active = this.activeModuleSession;
        if (active && active.courseId === courseId && active.moduleIndex === moduleIndex) {
          const elapsedMs = Date.now() - active.startedAt;
          const minutes = Math.max(1, Math.round(elapsedMs / 60000));
          this.logModuleMinutes(courseId, moduleIndex, minutes);
          this.activeModuleSession = null;
          this.showToast(`Logged ${minutes} min`);
        } else {
          this.activeModuleSession = { courseId, moduleIndex, startedAt: Date.now() };
          this.showToast('Timer started');
        }
        this.saveAll();
        this.renderModuleDetail();
        this.renderCoursesPage();
      },
      logModuleMinutes(courseId, moduleIndex, minutes) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;
        const mod = course.modules[moduleIndex];
        if (!mod) return;
        mod.minutes = (mod.minutes || 0) + minutes;
        mod.lastStudied = Date.now();
        mod.logs = Array.isArray(mod.logs) ? mod.logs : [];
        mod.logs.push({ at: Date.now(), minutes });
      },
      quickLogModule(courseId, moduleIndex, minutes = 25) {
        this.logModuleMinutes(courseId, moduleIndex, minutes);
        this.saveAll();
        this.renderCoursesPage();
        this.renderModuleDetail();
      },
      generateQuizForModule(topic) {
        const base = topic || 'this topic';
        return {
          question: `Which statement best summarizes the core idea of ${base}?`,
          options: [
            `The central principle that defines ${base}.`,
            `A minor detail that is rarely used.`,
            `An unrelated concept from a different field.`,
            `A historical anecdote about ${base}.`
          ],
          answer: 0,
          explanation: `Focus on the primary definition and purpose of ${base}.`
        };
      },
      openModuleQuiz(courseId, moduleIndex) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;
        const mod = course.modules[moduleIndex];
        if (!mod) return;
        if (!mod.quiz) mod.quiz = this.generateQuizForModule(mod.name);
        const panel = document.getElementById('courses-quiz-panel');
        if (!panel) return;
        panel.classList.remove('hidden');
        panel.innerHTML = `
          <div class="bg-white/70 rounded-xl p-4 space-y-3">
            <p class="text-sm font-semibold">${this.escapeHtml(mod.quiz.question)}</p>
            <div class="space-y-2">
              ${mod.quiz.options.map((opt, idx) => `
                <label class="flex items-center gap-2 text-sm">
                  <input type="radio" name="course-quiz" value="${idx}">
                  ${this.escapeHtml(opt)}
                </label>
              `).join('')}
            </div>
            <button onclick="APP.submitModuleQuiz('${courseId}', ${moduleIndex})" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs">Submit</button>
            <p id="courses-quiz-feedback" class="text-xs text-gray-600"></p>
          </div>
        `;
      },
      submitModuleQuiz(courseId, moduleIndex) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;
        const mod = course.modules[moduleIndex];
        if (!mod || !mod.quiz) return;
        const choice = document.querySelector('input[name="course-quiz"]:checked');
        if (!choice) {
          this.showToast('Select an answer');
          return;
        }
        const picked = parseInt(choice.value, 10);
        const correct = picked === mod.quiz.answer;
        mod.assessmentScore = correct ? 100 : 60;
        mod.lastStudied = Date.now();
        const feedback = document.getElementById('courses-quiz-feedback');
        if (feedback) {
          feedback.innerText = correct ? 'Correct! Great job.' : `Not quite. ${mod.quiz.explanation}`;
        }
        this.addXP(correct ? 8 : 3, 'module quiz');
        this.saveAll();
        this.renderCoursesPage();
        this.renderModuleDetail();
      },
      updateCourseSettings() {
        const autoplay = document.getElementById('courses-setting-autoplay')?.checked ?? false;
        const analysis = document.getElementById('courses-setting-analysis')?.checked ?? true;
        const gating = document.getElementById('courses-setting-gating')?.checked ?? true;
        this.courseSettings = { autoplay, showAnalysis: analysis, levelGating: gating };
        this.saveAll({ sync: false });
        const ytAutoplay = document.getElementById('courses-youtube-autoplay');
        if (ytAutoplay) ytAutoplay.checked = autoplay;
        if (!analysis) {
          const analysisEl = document.getElementById('courses-video-analysis');
          if (analysisEl) analysisEl.innerHTML = '';
        }
        this.renderCoursesPage();
      },
      resetCourseSettings() {
        this.courseSettings = { autoplay: false, showAnalysis: true, levelGating: true };
        this.saveAll({ sync: false });
        this.renderCoursesPage();
      },
      analyzeVideo(video, keywords) {
        const title = (video.title || '').toLowerCase();
        const tags = (video.tags || []).map(t => t.toLowerCase());
        let relevance = 30;
        keywords.forEach(k => {
          if (title.includes(k)) relevance += 8;
          if (tags.includes(k)) relevance += 10;
        });
        relevance = Math.min(100, relevance);
        let quality = 40;
        if (video.minutes >= 15) quality += 20;
        if (video.minutes >= 25) quality += 10;
        if ((video.channel || '').toLowerCase().includes('academy')) quality += 15;
        if ((video.channel || '').toLowerCase().includes('university')) quality += 15;
        if ((video.tags || []).length >= 4) quality += 10;
        quality = Math.min(100, quality);
        const reasons = [
          `Matches ${Math.min(3, keywords.length)} of your focus keywords.`,
          `Video length ${video.minutes} min fits a focused session.`,
          `Channel ${video.channel} aligns with structured learning content.`
        ];
        return { relevance, quality, reasons };
      },
      analyzeQuery(query) {
        const keywords = this.getProfileKeywords();
        const normalized = (query || '').toLowerCase();
        let relevance = 40;
        keywords.forEach(k => {
          if (normalized.includes(k)) relevance += 8;
        });
        relevance = Math.min(100, relevance);
        const quality = 55;
        const reasons = [
          `Query aligned with ${Math.min(3, keywords.length)} of your focus keywords.`,
          'Search results are filtered to match your current learning path.',
          'Review titles and descriptions for best fit.'
        ];
        return { relevance, quality, reasons };
      },
      setYouTubePlayer(url, analysis, meta = {}) {
        const player = document.getElementById('courses-youtube-player');
        const placeholder = document.getElementById('courses-youtube-placeholder');
        if (player) {
          player.src = url;
          player.classList.remove('hidden');
        }
        if (placeholder) placeholder.classList.add('hidden');
        const qualityEl = document.getElementById('courses-video-quality');
        const relevanceEl = document.getElementById('courses-video-relevance');
        if (qualityEl) qualityEl.innerText = analysis ? `${analysis.quality}%` : '-';
        if (relevanceEl) relevanceEl.innerText = analysis ? `${analysis.relevance}%` : '-';
        const analysisEl = document.getElementById('courses-video-analysis');
        if (analysisEl) {
          if (!analysis || !this.courseSettings.showAnalysis) {
            analysisEl.innerHTML = '';
          } else {
            analysisEl.innerHTML = `
              <div class="bg-white/70 rounded-xl p-3">
                <p class="text-xs text-gray-700 font-semibold">AI analysis summary</p>
                <ul class="list-disc ml-4 mt-2 space-y-1">
                  ${analysis.reasons.map(r => `<li>${this.escapeHtml(r)}</li>`).join('')}
                </ul>
              </div>
            `;
          }
        }
        this.renderYouTubeHelper({ ...meta, canEmbed: true, embedUrl: url });
      },
      setYouTubeSearchState(query, analysis, meta = {}) {
        const player = document.getElementById('courses-youtube-player');
        const placeholder = document.getElementById('courses-youtube-placeholder');
        if (player) {
          player.src = 'about:blank';
          player.classList.add('hidden');
        }
        if (placeholder) {
          placeholder.classList.remove('hidden');
          placeholder.innerHTML = `
            <i class="fab fa-youtube"></i>
            <p class="font-semibold">Search ready on YouTube</p>
            <span>${this.escapeHtml(query)} · open results, choose a video, then paste its link here to embed.</span>
          `;
        }
        const qualityEl = document.getElementById('courses-video-quality');
        const relevanceEl = document.getElementById('courses-video-relevance');
        if (qualityEl) qualityEl.innerText = analysis ? `${analysis.quality}%` : '-';
        if (relevanceEl) relevanceEl.innerText = analysis ? `${analysis.relevance}%` : '-';
        const analysisEl = document.getElementById('courses-video-analysis');
        if (analysisEl) {
          if (!analysis || !this.courseSettings.showAnalysis) {
            analysisEl.innerHTML = '';
          } else {
            analysisEl.innerHTML = `
              <div class="bg-white/70 rounded-xl p-3">
                <p class="text-xs text-gray-700 font-semibold">Search guidance</p>
                <ul class="list-disc ml-4 mt-2 space-y-1">
                  ${analysis.reasons.map(r => `<li>${this.escapeHtml(r)}</li>`).join('')}
                </ul>
              </div>
            `;
          }
        }
        this.renderYouTubeHelper({ ...meta, query, canEmbed: false });
      },
      setYouTubeLoadingState(query) {
        const player = document.getElementById('courses-youtube-player');
        const placeholder = document.getElementById('courses-youtube-placeholder');
        if (player) {
          player.src = 'about:blank';
          player.classList.add('hidden');
        }
        if (placeholder) {
          placeholder.classList.remove('hidden');
          placeholder.innerHTML = `
            <i class="fab fa-youtube"></i>
            <p class="font-semibold">Finding a playable lesson...</p>
            <span>${this.escapeHtml(query)} · resolving a real YouTube video for the course player.</span>
          `;
        }
      },
      async searchYouTube() {
        const input = document.getElementById('courses-youtube-query');
        const query = (input?.value || '').trim();
        if (!query) {
          this.showToast('Enter a search query');
          return;
        }
        const autoplay = document.getElementById('courses-youtube-autoplay')?.checked || this.courseSettings.autoplay;
        const youtubeId = this.extractYouTubeId(query);
        if (youtubeId) {
          const directVideo = this.videoCatalog.find(v => v.youtubeId === youtubeId) || {
            id: `custom-${youtubeId}`,
            title: 'YouTube lesson',
            channel: 'YouTube',
            minutes: 0,
            level: this.getProfileLevelPreference(),
            tags: this.getProfileKeywords().slice(0, 4),
            youtubeId,
            query
          };
          const analysis = this.analyzeVideo(directVideo, this.getProfileKeywords());
          this.setYouTubePlayer(this.buildDirectEmbedUrl(youtubeId, autoplay), analysis, { video: directVideo, query, youtubeId });
          this.showToast('Video embedded');
          return;
        }

        const match = this.findBestCourseVideo(query);
        if (match?.video?.youtubeId && match.score >= 3) {
          const analysis = this.analyzeVideo(match.video, this.getProfileKeywords());
          this.setYouTubePlayer(this.buildEmbedUrl(match.video, autoplay), analysis, { video: match.video, query });
          return;
        }

        this.setYouTubeLoadingState(query);
        const resolvedId = await this.resolveYouTubeVideoId(query);
        if (resolvedId) {
          const resolvedVideo = {
            id: `yt-${resolvedId}`,
            youtubeId: resolvedId,
            title: query,
            channel: 'YouTube',
            minutes: 0,
            level: this.getProfileLevelPreference(),
            tags: this.getProfileKeywords().slice(0, 4),
            query
          };
          this.setYouTubePlayer(this.buildDirectEmbedUrl(resolvedId, autoplay), this.analyzeQuery(query), { video: resolvedVideo, query, youtubeId: resolvedId });
          this.showToast('Video loaded');
          return;
        }

        this.setYouTubeSearchState(query, this.analyzeQuery(query), { query });
      },
      useAiYoutubeQuery() {
        const context = this.getLearningContext();
        const course = this.getActiveCourse();
        const module = course?.modules?.[this.selectedModuleIndex >= 0 ? this.selectedModuleIndex : 0];
        const query = this.buildAiVideoQuery(course, module, context);
        const input = document.getElementById('courses-youtube-query');
        if (input) input.value = query;
        this.searchYouTube();
      },
      buildAiVideoQuery(course, module, context) {
        const parts = [];
        if (module?.name) parts.push(module.name);
        if (course?.name) parts.push(course.name);
        if (course?.branch) parts.push(course.branch);
        if (course?.skills && course.skills.length > 0) {
          parts.push(course.skills.slice(0, 2).join(' '));
        }
        const level = course?.level || context.levelPreference;
        if (level && level !== 'Intermediate') {
          parts.push(level + ' level');
        }
        if (context.branch) parts.push(context.branch);
        if (context.classYear) parts.push(context.classYear);
        parts.push('tutorial');
        parts.push('lecture');
        return parts.filter(Boolean).slice(0, 6).join(' ');
      },
      getRecommendedVideos() {
        const context = this.getLearningContext();
        const course = this.getActiveCourse();
        const recommendations = [];
        const seenQueries = new Set();
        if (course) {
          course.modules?.forEach((mod, idx) => {
            if (!mod.completed && mod.name) {
              const query = `${mod.name} ${course.name} tutorial lecture ${course.level || 'intermediate'}`;
              if (!seenQueries.has(query.toLowerCase())) {
                seenQueries.add(query.toLowerCase());
                recommendations.push({
                  type: 'module',
                  moduleName: mod.name,
                  courseName: course.name,
                  query: query,
                  priority: idx === 0 ? 'high' : 'medium'
                });
              }
            }
          });
        }
        const skillVideos = {
          'data structures': 'Data Structures and Algorithms tutorial',
          'algorithms': 'Algorithms tutorial lecture',
          'machine learning': 'Machine Learning tutorial beginners',
          'web development': 'Web Development full course',
          'react': 'React JS tutorial',
          'python': 'Python programming tutorial',
          'database': 'Database Management System tutorial',
          'circuit': 'Circuit Analysis tutorial',
          'thermodynamics': 'Thermodynamics lecture'
        };
        const skills = (course?.skills || context.skills || []).slice(0, 4);
        skills.forEach(skill => {
          const lowerSkill = skill.toLowerCase();
          for (const [key, query] of Object.entries(skillVideos)) {
            if (lowerSkill.includes(key) || key.includes(lowerSkill)) {
              if (!seenQueries.has(query.toLowerCase())) {
                seenQueries.add(query.toLowerCase());
                recommendations.push({
                  type: 'skill',
                  skill: skill,
                  query: query,
                  priority: 'medium'
                });
              }
            }
          }
        });
        if (context.branch) {
          const branchQueries = {
            'computer': `${context.branch} programming tutorial`,
            'electronics': `${context.branch} circuits tutorial`,
            'mechanical': `${context.branch} engineering tutorial`,
            'civil': `${context.branch} structural analysis tutorial`,
            'electrical': `${context.branch} power systems tutorial`
          };
          for (const [key, query] of Object.entries(branchQueries)) {
            if (context.branch.toLowerCase().includes(key)) {
              if (!seenQueries.has(query.toLowerCase())) {
                seenQueries.add(query.toLowerCase());
                recommendations.push({
                  type: 'branch',
                  branch: context.branch,
                  query: query,
                  priority: 'medium'
                });
              }
            }
          }
        }
        return recommendations.slice(0, 8);
      },
      quickAiVideoSearch() {
        const panel = document.getElementById('ai-video-recommendations');
        const list = document.getElementById('ai-video-list');
        if (!panel || !list) return;
        const recommendations = this.getRecommendedVideos();
        if (!recommendations.length) {
          list.innerHTML = '<p class="text-gray-500">Add courses and modules to get video recommendations.</p>';
          panel.classList.remove('hidden');
          return;
        }
        list.innerHTML = recommendations.map((rec, idx) => `
          <div class="bg-white/70 rounded-xl p-3 hover:bg-white transition cursor-pointer" onclick="APP.playAiVideo(decodeURIComponent('${encodeURIComponent(rec.query)}'))">
            <div class="flex items-start gap-2">
              <span class="text-lg">${this.getVideoEmoji(rec.type)}</span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-800 truncate">${rec.type === 'module' ? this.escapeHtml(rec.moduleName) : this.escapeHtml(rec.skill || rec.branch)}</p>
                <p class="text-xs text-gray-500 truncate">${this.escapeHtml(rec.query)}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] bg-${rec.priority === 'high' ? 'amber' : 'indigo'}-100 text-${rec.priority === 'high' ? 'amber' : 'indigo'}-700 px-2 py-0.5 rounded-full">${rec.priority}</span>
                  <span class="text-[10px] text-gray-400">${rec.type}</span>
                </div>
              </div>
              <i class="fas fa-play-circle text-indigo-500 text-xl"></i>
            </div>
          </div>
        `).join('');
        panel.classList.remove('hidden');
      },
      getVideoEmoji(type) {
        const emojis = { module: '📚', skill: '⚡', branch: '🎯' };
        return emojis[type] || '🎬';
      },
      playAiVideo(query) {
        const input = document.getElementById('courses-youtube-query');
        if (input) input.value = query;
        this.searchYouTube();
        document.getElementById('ai-video-recommendations')?.classList.add('hidden');
      },
      renderCoursesPage() {
        this.ensureCourseStructure();
        this.saveAll({ sync: false });
        const container = document.getElementById('courses-container');
        const search = (document.getElementById('courses-search')?.value || '').trim().toLowerCase();
        const sort = document.getElementById('courses-sort')?.value || 'progress-desc';
        const showCompleted = document.getElementById('courses-show-complete')?.checked ?? true;

        const courseMeta = (course) => this.getCourseMeta(course);

        const autoplayToggle = document.getElementById('courses-setting-autoplay');
        const analysisToggle = document.getElementById('courses-setting-analysis');
        const gatingToggle = document.getElementById('courses-setting-gating');
        if (autoplayToggle) autoplayToggle.checked = !!this.courseSettings.autoplay;
        if (analysisToggle) analysisToggle.checked = this.courseSettings.showAnalysis !== false;
        if (gatingToggle) gatingToggle.checked = this.courseSettings.levelGating !== false;
        const ytAutoplay = document.getElementById('courses-youtube-autoplay');
        if (ytAutoplay) ytAutoplay.checked = !!this.courseSettings.autoplay;

        const totals = this.courses.reduce((acc, course) => {
          const meta = courseMeta(course);
          acc.totalCourses += 1;
          acc.modulesTotal += meta.totalModules;
          acc.modulesDone += meta.completedModules;
          acc.timeSpent += meta.timeSpent || 0;
          acc.assessments.push(meta.avgScore || 0);
          return acc;
        }, { totalCourses: 0, modulesTotal: 0, modulesDone: 0, timeSpent: 0, assessments: [] });

        const avgProgress = totals.modulesTotal ? Math.round((totals.modulesDone / totals.modulesTotal) * 100) : 0;
        const left = Math.max(0, totals.modulesTotal - totals.modulesDone);
        const totalEl = document.getElementById('courses-total');
        const avgEl = document.getElementById('courses-avg-progress');
        const doneEl = document.getElementById('courses-modules-done');
        const leftEl = document.getElementById('courses-modules-left');
        if (totalEl) totalEl.innerText = totals.totalCourses;
        if (avgEl) avgEl.innerText = avgProgress;
        if (doneEl) doneEl.innerText = totals.modulesDone;
        if (leftEl) leftEl.innerText = left;

        const avgAssessment = totals.assessments.length
          ? Math.round(totals.assessments.reduce((a, b) => a + b, 0) / totals.assessments.length)
          : 0;
        const assessmentEl = document.getElementById('courses-assessment-score');
        if (assessmentEl) assessmentEl.innerText = avgAssessment;

        const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const weekMinutes = this.courses.reduce((acc, course) => {
          const modules = course.modules || [];
          modules.forEach(m => {
            (m.logs || []).forEach(log => {
              if (log.at >= weekStart) acc += log.minutes || 0;
            });
          });
          return acc;
        }, 0);
        const timeWeekEl = document.getElementById('courses-time-week');
        if (timeWeekEl) timeWeekEl.innerText = weekMinutes;

        const path = this.buildLearningPath();
        const nextRecoEl = document.getElementById('courses-next-reco');
        if (nextRecoEl) {
          if (path.length) {
            nextRecoEl.innerText = `${path[0].courseName} · ${path[0].moduleName}`;
          } else {
            nextRecoEl.innerText = 'All modules complete';
          }
        }

        let list = [...this.courses];
        if (search) {
          list = list.filter(c => {
            const meta = courseMeta(c);
            return (
              (c.name || '').toLowerCase().includes(search) ||
              (c.code || '').toLowerCase().includes(search) ||
              (meta.instructor || '').toLowerCase().includes(search) ||
              (meta.level || '').toLowerCase().includes(search)
            );
          });
        }
        if (!showCompleted) {
          list = list.filter(c => {
            const meta = courseMeta(c);
            return meta.totalModules === 0 || meta.completedModules < meta.totalModules;
          });
        }

        const levelRank = { Advanced: 3, Intermediate: 2, Beginner: 1 };
        list.sort((a, b) => {
          const am = courseMeta(a);
          const bm = courseMeta(b);
          if (sort === 'progress-asc') return am.progress - bm.progress;
          if (sort === 'progress-desc') return bm.progress - am.progress;
          if (sort === 'name') return (a.name || '').localeCompare(b.name || '');
          if (sort === 'modules-left') return (am.totalModules - am.completedModules) - (bm.totalModules - bm.completedModules);
          if (sort === 'level') return (levelRank[bm.level] || 0) - (levelRank[am.level] || 0);
          return 0;
        });

        if (!list.length) {
          container.innerHTML = '<p class="text-gray-500">No courses match this filter. Try clearing search or add a new course.</p>';
          this.renderLearningPath();
          this.renderModuleList();
          this.renderModuleDetail();
          this.renderAISuggestions();
          return;
        }

        container.innerHTML = list.map(course => {
          const meta = courseMeta(course);
          const levelClass = meta.level === 'Advanced'
            ? 'bg-purple-100 text-purple-700'
            : meta.level === 'Intermediate'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-emerald-100 text-emerald-700';
          const remaining = Math.max(0, meta.totalModules - meta.completedModules);
          const modulePreview = meta.modules.slice(0, 4).map((mod, idx) => `
            <div class="flex items-center gap-2">
              <i onclick="APP.toggleModule('${course.id}', ${idx})" class="fas ${mod.completed ? 'fa-check-circle text-green-600' : 'fa-circle text-gray-300'} cursor-pointer text-sm"></i>
              <span class="text-sm ${mod.completed ? 'line-through text-gray-400' : ''}">${mod.name}</span>
            </div>
          `).join('');
          const extraCount = meta.modules.length - 4;
          return `
            <div class="glass-card p-6 flex flex-col gap-4 hover:shadow-lg">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h4 class="font-semibold text-lg">${course.name}</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">${course.code || '-'}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full ${levelClass}">${meta.level}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">${meta.credits} credits</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Instructor: ${meta.instructor}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">Target: ${meta.target}</span>
                  <button onclick="APP.openAddModuleModal('${course.id}')" class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl">Add module</button>
                  <i onclick="APP.deleteCourse('${course.id}')" class="fas fa-trash text-red-300 hover:text-red-500 cursor-pointer ml-1"></i>
                </div>
              </div>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="md:col-span-1">
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Progress</p>
                  <p class="text-3xl font-bold text-indigo-600 mt-2">${meta.progress}%</p>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-indigo-600 h-2 rounded-full" style="width: ${meta.progress}%"></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">${meta.completedModules}/${meta.totalModules} modules complete</p>
                  <p class="text-xs text-gray-500 mt-1">Time spent: ${meta.timeSpent} min</p>
                  <p class="text-xs text-gray-500">Avg quiz: ${meta.avgScore || 0}%</p>
                  <div class="mt-3 text-xs text-gray-600">
                    <p class="font-medium">Weekly goal</p>
                    <p>${meta.weeklyGoal} hrs - ${remaining} modules left</p>
                  </div>
                </div>
                <div class="md:col-span-2">
                  <div class="flex justify-between items-center">
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Modules</p>
                    <span class="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Next: ${meta.nextModule}</span>
                  </div>
                  <div class="mt-2 space-y-2">
                    ${meta.modules.length ? modulePreview : '<p class="text-sm text-gray-500">No modules yet. Add your first module.</p>'}
                    ${extraCount > 0 ? `<p class="text-xs text-gray-500">+${extraCount} more modules</p>` : ''}
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Modules left: ${remaining}</span>
                <span class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Focus: ${meta.weeklyGoal} hrs/week</span>
                <button onclick="APP.selectModule('${course.id}', ${Math.max(0, meta.modules.findIndex(m => !m.completed))})" class="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs">Open workspace</button>
              </div>
            </div>
          `;
        }).join('');
        this.renderLearningPath();
        this.renderModuleList();
        this.renderModuleDetail();
        this.renderCourseVideos();
        this.renderAISuggestions();
      },

      renderAISuggestions() {
        const list = document.getElementById('ai-suggestions-list');
        if (!list) return;
        const suggestions = this.getAISuggestions();
        if (!suggestions.length) {
          list.innerHTML = '<p class="text-gray-500 text-xs">Complete your profile for personalized suggestions.</p>';
          return;
        }
        list.innerHTML = suggestions.slice(0, 6).map(s => `
          <div class="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
            <div>
              <p class="font-medium text-gray-700">${this.escapeHtml(s.value)}</p>
              <p class="text-[10px] text-gray-500">${this.escapeHtml(s.reason)}</p>
            </div>
            <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${s.type}</span>
          </div>
        `).join('');
      },

      async openAddCourseModal() {
        const aiSuggestions = this.getAISuggestions();
        const res = await this.openModal('New Course', [
          { label: 'Course Name', name: 'name', placeholder: 'e.g., Data Structures' },
          { label: 'Course Code', name: 'code', placeholder: 'e.g., CS201' },
          { label: 'Branch', name: 'branch', placeholder: 'e.g., Computer Science', value: this.userBranch || '' },
          { label: 'Class/Year', name: 'classYear', placeholder: 'e.g., Year 2', value: this.userYear || '' },
          { label: 'Level (Beginner/Intermediate/Advanced)', name: 'level', value: 'Intermediate' },
          { label: 'Instructor', name: 'instructor', placeholder: 'Dr. Rao' },
          { label: 'Skills (comma separated)', name: 'skills', placeholder: 'e.g., Programming, Algorithms', value: (this.userSkills || []).join(', ') },
          { label: 'Credits', name: 'credits', type: 'number', value: '4' },
          { label: 'Target grade', name: 'target', value: 'A' },
          { label: 'Weekly goal (hrs)', name: 'weeklyGoal', type: 'number', value: '5' }
        ]);
        if (res) {
          const skills = (res.skills || '').split(',').map(s => s.trim()).filter(Boolean);
          const newCourse = {
            id: 'crs' + Date.now(),
            name: res.name,
            code: res.code || '-',
            branch: res.branch || '',
            classYear: res.classYear || '',
            level: res.level || 'Intermediate',
            instructor: res.instructor || 'TBA',
            skills: skills,
            credits: parseInt(res.credits) || 4,
            target: res.target || 'A',
            weeklyGoal: parseInt(res.weeklyGoal) || 5,
            modules: []
          };
          this.courses.push(newCourse);
          this.selectedCourseId = newCourse.id;
          this.selectedModuleIndex = 0;
          this.saveAll();
          this.renderCoursesPage();
          this.addXP(10, 'new course');
        }
      },

      markNextModuleComplete(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course || !course.modules.length) {
          this.showToast('Add modules first');
          return;
        }
        const idx = course.modules.findIndex(m => !m.completed);
        if (idx === -1) {
          this.showToast('All modules completed');
          return;
        }
        this.toggleModule(courseId, idx);
      },

      // Video recommendations for courses
      getProfileKeywords() {
        const context = this.getLearningContext();
        return context.keywords.slice(0, 12);
      },
      getProfileLevelPreference() {
        const year = parseInt((this.userYear || '').toString().match(/\d+/)?.[0] || '0', 10);
        if (year >= 3) return 'Advanced';
        if (year === 2) return 'Intermediate';
        if (this.userXP >= 700) return 'Advanced';
        if (this.userXP >= 300) return 'Intermediate';
        return 'Beginner';
      },
      getVideoScore(video, keywords) {
        let score = 0;
        const title = video.title.toLowerCase();
        const tags = (video.tags || []).map(t => t.toLowerCase());
        keywords.forEach(k => {
          if (!k) return;
          if (title.includes(k)) score += 3;
          if (tags.includes(k)) score += 4;
          if (tags.some(t => t.includes(k))) score += 2;
        });
        const pref = this.getProfileLevelPreference();
        if (video.level === pref) score += 6;
        return score;
      },
      buildVideoUrl(video) {
        if (video.youtubeId) return `https://www.youtube.com/watch?v=${video.youtubeId}`;
        const q = video.query || video.title;
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
      },
      buildSearchUrl(query) {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(query || '')}`;
      },
      buildYouTubeParams(autoplay = false) {
        const params = new URLSearchParams({
          rel: '0',
          modestbranding: '1',
          playsinline: '1'
        });
        if (autoplay) params.set('autoplay', '1');
        if (typeof location !== 'undefined' && /^https?:\/\//.test(location.origin || '')) {
          params.set('origin', location.origin);
        }
        return params;
      },
      extractYouTubeId(value) {
        const raw = (value || '').trim();
        if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
        try {
          const url = new URL(raw);
          const host = url.hostname.replace(/^www\./, '').toLowerCase();
          if (host === 'youtu.be') {
            const id = url.pathname.split('/').filter(Boolean)[0];
            return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null;
          }
          if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
            const watchId = url.searchParams.get('v');
            if (/^[a-zA-Z0-9_-]{11}$/.test(watchId || '')) return watchId;
            const parts = url.pathname.split('/').filter(Boolean);
            const markerIndex = parts.findIndex(part => ['embed', 'shorts', 'live'].includes(part));
            const pathId = markerIndex >= 0 ? parts[markerIndex + 1] : null;
            return /^[a-zA-Z0-9_-]{11}$/.test(pathId || '') ? pathId : null;
          }
        } catch {
          return null;
        }
        return null;
      },
      buildDirectEmbedUrl(youtubeId, autoplay = false) {
        const params = this.buildYouTubeParams(autoplay);
        return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
      },
      buildEmbedUrl(video, autoplay = false) {
        const params = this.buildYouTubeParams(autoplay);
        if (video.youtubeId) {
          return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params.toString()}`;
        }
        const q = video.query || video.title;
        params.set('listType', 'search');
        params.set('list', q);
        return `https://www.youtube-nocookie.com/embed?${params.toString()}`;
      },
      findBestCourseVideo(query) {
        const normalized = (query || '').toLowerCase();
        const stopWords = new Set(['tutorial', 'lecture', 'course', 'lesson', 'video', 'learn', 'learning', 'beginner', 'beginners', 'advanced', 'level', 'full', 'complete']);
        const keywords = normalized
          .split(/[^a-z0-9+.#]+/i)
          .map(k => k.trim())
          .filter(k => k.length > 2 && !stopWords.has(k));
        let best = null;
        this.videoCatalog.forEach(video => {
          const hay = `${video.title || ''} ${video.channel || ''} ${(video.tags || []).join(' ')} ${video.query || ''}`.toLowerCase();
          let score = 0;
          keywords.forEach(k => {
            if (hay.includes(k)) score += 3;
            if ((video.tags || []).some(tag => tag.toLowerCase() === k)) score += 3;
          });
          if (normalized && hay.includes(normalized)) score += 8;
          if (!best || score > best.score) best = { video, score };
        });
        return best;
      },
      async resolveYouTubeVideoId(query) {
        const key = (query || '').trim().toLowerCase();
        if (!key) return null;

        const cached = this.youtubeResolveCache?.[key];
        const maxAge = 7 * 24 * 60 * 60 * 1000;
        if (cached?.videoId && Date.now() - (cached.at || 0) < maxAge) {
          return cached.videoId;
        }

        if (typeof window !== 'undefined' && window.location?.protocol === 'file:') {
          return null;
        }

        try {
          const res = await fetch(this.buildApiUrl(`/youtube/search?q=${encodeURIComponent(query)}`), {
            headers: { Accept: 'application/json' },
            credentials: 'include'
          });
          if (!res.ok) return null;
          const data = await res.json();
          const videoId = data?.videoId;
          if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId || '')) return null;
          this.youtubeResolveCache = {
            ...(this.youtubeResolveCache || {}),
            [key]: { videoId, at: Date.now() }
          };
          localStorage.setItem('smartstudy_youtube_resolve_cache', JSON.stringify(this.youtubeResolveCache));
          return videoId;
        } catch {
          return null;
        }
      },
      playCourseVideo(videoId) {
        const video = this.videoCatalog.find(v => v.id === videoId);
        if (!video) return;
        const keywords = this.getProfileKeywords();
        const analysis = this.analyzeVideo(video, keywords);
        const autoplay = this.courseSettings.autoplay || document.getElementById('courses-youtube-autoplay')?.checked;
        if (video.youtubeId) {
          const url = this.buildEmbedUrl(video, autoplay);
          this.setYouTubePlayer(url, analysis, { video });
        } else {
          const query = video.query || video.title;
          const input = document.getElementById('courses-youtube-query');
          if (input) input.value = query;
          this.setYouTubeSearchState(query, analysis, { video, query });
        }
      },
      renderYouTubeHelper(meta = {}) {
        const helper = document.getElementById('courses-youtube-helper');
        if (!helper) return;
        const query = meta.query || '';
        const video = meta.video || null;
        const canEmbed = meta.canEmbed !== false;
        const openUrl = meta.openUrl || (video ? this.buildVideoUrl(video) : (query ? this.buildSearchUrl(query) : 'https://www.youtube.com'));
        const title = video && canEmbed ? `Now playing: ${video.title}` : (query ? `Search: ${query}` : 'Open on YouTube');
        const subtitle = canEmbed
          ? 'If the embedded player is blocked, open the session in YouTube.'
          : 'YouTube search results cannot be embedded reliably. Open results, choose a video, then paste its link here.';
        helper.innerHTML = `
          <div class="courses-youtube-helper-card">
            <div>
              <div class="courses-youtube-helper-title">${this.escapeHtml(title)}</div>
              <div class="courses-youtube-helper-sub">${this.escapeHtml(subtitle)}</div>
            </div>
            <div class="courses-youtube-helper-actions">
              <a class="courses-youtube-helper-btn" href="${openUrl}" target="_blank" rel="noopener">${canEmbed ? 'Open on YouTube' : 'Open results'}</a>
              <button class="courses-youtube-helper-btn ghost" data-copy>Copy link</button>
              ${canEmbed ? '<button class="courses-youtube-helper-btn ghost" data-retry>Retry embed</button>' : '<button class="courses-youtube-helper-btn ghost" data-focus-input>Paste link here</button>'}
            </div>
          </div>
        `;
        const copyBtn = helper.querySelector('[data-copy]');
        if (copyBtn) copyBtn.onclick = () => this.copyText(openUrl);
        const retryBtn = helper.querySelector('[data-retry]');
        if (retryBtn) retryBtn.onclick = () => {
          const player = document.getElementById('courses-youtube-player');
          if (player) player.src = player.src;
        };
        const focusBtn = helper.querySelector('[data-focus-input]');
        if (focusBtn) focusBtn.onclick = () => document.getElementById('courses-youtube-query')?.focus();
      },
      copyText(value) {
        if (!value) return;
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(value).then(() => this.showToast('Link copied')).catch(() => this.showToast('Copy failed'));
          return;
        }
        const el = document.createElement('textarea');
        el.value = value;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
          this.showToast('Link copied');
        } catch (err) {
          this.showToast('Copy failed');
        } finally {
          document.body.removeChild(el);
        }
      },
      addVideoToNotes(video) {
        const url = this.buildVideoUrl(video);
        this.notes.push({
          id: 'n' + Date.now(),
          title: `Video: ${video.title}`,
          content: `Recommended video for your learning.\nChannel: ${video.channel}\nLink: ${url}\nTags: ${(video.tags || []).join(', ')}`,
          date: Date.now(),
          author: this.userName,
          subject: 'Learning',
          category: 'Video',
          tags: video.tags || [],
          visibility: 'private',
          downloads: 0,
          likes: 0,
          ratingAvg: 0,
          ratingCount: 0,
          commentsCount: 0
        });
        this.saveAll();
        this.renderNotesPage();
        this.addXP(3, 'saved video');
        this.showToast('Video saved to notes');
      },
      addVideoToNotesById(id) {
        const video = this.videoCatalog.find(v => v.id === id);
        if (!video) return;
        this.addVideoToNotes(video);
      },
      renderCourseVideos() {
        const grid = document.getElementById('courses-video-grid');
        if (!grid) return;
        const search = (document.getElementById('courses-video-search')?.value || '').trim().toLowerCase();
        const filter = document.getElementById('courses-video-filter')?.value || 'recommended';
        const keywords = this.getProfileKeywords();
        const skillTag = document.getElementById('video-skill-tags');
        const courseTag = document.getElementById('video-course-tags');
        if (skillTag) skillTag.innerText = (this.userSkills || []).slice(0, 3).join(', ') || 'None';
        if (courseTag) courseTag.innerText = this.courses.slice(0, 2).map(c => c.code || c.name).join(', ') || 'None';

        let list = this.videoCatalog.map(v => ({
          ...v,
          score: this.getVideoScore(v, keywords),
          analysis: this.analyzeVideo(v, keywords)
        }));
        if (filter === 'recommended') list = list.filter(v => v.score > 0);
        if (filter === 'beginner') list = list.filter(v => v.level === 'Beginner');
        if (filter === 'intermediate') list = list.filter(v => v.level === 'Intermediate');
        if (filter === 'advanced') list = list.filter(v => v.level === 'Advanced');
        if (search) {
          list = list.filter(v =>
            v.title.toLowerCase().includes(search) ||
            v.channel.toLowerCase().includes(search) ||
            (v.tags || []).some(t => t.toLowerCase().includes(search))
          );
        }
        list.sort((a, b) => (b.score - a.score) || a.title.localeCompare(b.title));
        if (!list.length) {
          grid.innerHTML = '<p class="text-gray-500">No videos found. Try another search or switch to All videos.</p>';
          const qualityEl = document.getElementById('courses-video-quality');
          const relevanceEl = document.getElementById('courses-video-relevance');
          if (qualityEl) qualityEl.innerText = '-';
          if (relevanceEl) relevanceEl.innerText = '-';
          return;
        }

        const player = document.getElementById('courses-youtube-player');
        const playerSrc = player?.getAttribute('src') || '';
        if (player && !playerSrc) {
          const top = list[0];
          const autoplay = this.courseSettings.autoplay || document.getElementById('courses-youtube-autoplay')?.checked;
          if (top.youtubeId) {
            this.setYouTubePlayer(this.buildEmbedUrl(top, autoplay), top.analysis, { video: top });
          } else {
            const query = top.query || top.title;
            this.setYouTubeSearchState(query, top.analysis, { video: top, query });
          }
        }

        grid.innerHTML = list.map(v => {
          const match = Math.min(100, 40 + v.score * 6);
          const url = this.buildVideoUrl(v);
          const tagPills = (v.tags || []).slice(0, 3).map(t => `<span class="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">${this.escapeHtml(t)}</span>`).join('');
          const levelClass = v.level === 'Advanced'
            ? 'bg-purple-100 text-purple-700'
            : v.level === 'Intermediate'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-emerald-100 text-emerald-700';
          const analysis = v.analysis || { relevance: match, quality: match, reasons: [] };
          const analysisBadge = this.courseSettings.showAnalysis
            ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Quality ${analysis.quality}%</span>`
            : '';
          const analysisDetail = this.courseSettings.showAnalysis
            ? `<div class="text-[10px] text-gray-500 mt-2">Relevance ${analysis.relevance}% · ${this.escapeHtml(analysis.reasons[0] || 'AI matched to your profile.')}</div>`
            : '';
          return `
            <div class="glass-card p-4 flex flex-col gap-3">
              <div class="h-28 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center text-indigo-500">
                <i class="fab fa-youtube text-3xl"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-800">${this.escapeHtml(v.title)}</p>
                <p class="text-xs text-gray-500">${this.escapeHtml(v.channel)} - ${v.minutes} min</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full ${levelClass}">${v.level}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">AI match ${match}%</span>
                ${analysisBadge}
                ${tagPills}
              </div>
              ${analysisDetail}
              <div class="flex gap-2 text-xs">
                <button onclick="APP.playCourseVideo('${v.id}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl"><i class="fab fa-youtube mr-1"></i>${v.youtubeId ? 'Play' : 'Search'}</button>
                <button onclick="APP.addVideoToNotesById('${v.id}')" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-xl">Save to notes</button>
              </div>
              <a class="text-[10px] text-indigo-600 hover:underline" onclick="window.open('${url}', '_blank')">Open on YouTube</a>
            </div>
          `;
        }).join('');
      },

      async openAddModuleModal(courseId) {
        const res = await this.openModal('Add Module', [
          { label: 'Module Name', name: 'moduleName', placeholder: 'e.g., Recursion' }
        ]);
        if (res) {
          const course = this.courses.find(c => c.id === courseId);
          if (course) {
            course.modules.push({
              id: `m_${courseId}_${Date.now()}`,
              name: res.moduleName,
              completed: false,
              minutes: 0,
              assessmentScore: null,
              quiz: null,
              logs: [],
              lastStudied: null
            });
            this.saveAll();
            this.selectedCourseId = courseId;
            this.selectedModuleIndex = course.modules.length - 1;
            this.renderCoursesPage();
          }
        }
      },

      toggleModule(courseId, moduleIndex) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
          const mod = course.modules[moduleIndex];
          if (!mod.completed) {
            mod.completed = true;
            mod.lastStudied = Date.now();
            this.addXP(5, 'module completed');
          } else {
            mod.completed = false; // optional: allow uncheck
          }
          this.saveAll();
          this.renderCoursesPage();
        }
      },

      deleteCourse(courseId) {
        this.courses = this.courses.filter(c => c.id !== courseId);
        this.saveAll();
        this.renderCoursesPage();
      },

      // AI Tutor
      escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return str.toString().replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
      },
      setChatMode(mode) {
        this.chatMode = mode;
        document.getElementById('chat-mode-label').innerText = mode;
        document.querySelectorAll('#chat-mode-group .chat-chip').forEach(btn => {
          btn.classList.toggle('active', btn.innerText === mode);
        });
      },
      setChatTone(tone) {
        this.chatTone = tone;
        document.getElementById('chat-tone-label').innerText = tone;
        document.querySelectorAll('#chat-tone-group .chat-chip').forEach(btn => {
          btn.classList.toggle('active', btn.innerText === tone);
        });
      },
      applyChatPrompt(text) {
        const input = document.getElementById('chat-input');
        input.value = text;
        input.focus();
      },
      formatBilingual(enHtml, hiHtml) {
        return `
          <div class="space-y-3">
            <div>
              <p class="text-[10px] uppercase text-gray-400 tracking-wider">English</p>
              ${enHtml}
            </div>
            <div>
              <p class="text-[10px] uppercase text-gray-400 tracking-wider">हिंदी</p>
              ${hiHtml}
            </div>
          </div>
        `;
      },
      clearChat() {
        this.chatHistory = [];
        document.getElementById('chat-messages').innerHTML = '';
        this.showToast('Chat cleared');
      },
      renderChatSidebar() {
        const skills = (this.userSkills || []).slice(0, 4);
        const courses = this.courses.slice(0, 3).map(c => c.code || c.name);
        const year = this.userYear || '-';
        const skillEl = document.getElementById('chat-skill-tags');
        const courseEl = document.getElementById('chat-course-tags');
        const yearEl = document.getElementById('chat-year-tag');
        if (skillEl) skillEl.innerText = skills.length ? skills.join(', ') : 'Add skills in Profile';
        if (courseEl) courseEl.innerText = courses.length ? courses.join(', ') : 'No courses yet';
        if (yearEl) yearEl.innerText = year;

        const list = document.getElementById('chat-prompt-list');
        if (!list) return;
        const suggested = [];
        const topSkill = skills[0] || 'your topic';
        const topCourse = courses[0] || 'your course';
        suggested.push(`Explain ${topSkill} with a simple example.`);
        suggested.push(`Create a 1-hour plan to study ${topCourse}.`);
        suggested.push(`Quiz me with 5 questions on ${topCourse}.`);
        suggested.push('Turn my notes into a checklist.');
        list.innerHTML = suggested.map(p => `
          <button onclick="APP.applyChatPrompt('${p.replace(/'/g, '&#39;')}')" class="w-full text-left bg-white/70 hover:bg-indigo-50 px-3 py-2 rounded-xl text-sm">${p}</button>
        `).join('');
      },
      generateChatReply(msg) {
        const lower = msg.toLowerCase();
        const topic = (this.userSkills && this.userSkills[0]) || (this.courses[0] && this.courses[0].name) || 'this topic';
        const tone = this.chatTone;
        const mode = this.chatMode;
        const concise = tone === 'Concise';
        const detailed = tone === 'Detailed';
        const step = tone === 'Step-by-step' || mode === 'Plan';

        if (mode === 'Quiz' || lower.includes('quiz')) {
          const en = `
            <p class="font-semibold">Quick quiz on ${this.escapeHtml(topic)}:</p>
            <ul class="list-disc ml-5 space-y-1">
              <li>Define the core concept.</li>
              <li>Give one real-world example.</li>
              <li>What is a common mistake?</li>
              <li>How would you test understanding?</li>
              <li>Summarize in one sentence.</li>
            </ul>
          `;
          const hi = `
            <p class="font-semibold">${this.escapeHtml(topic)} पर त्वरित क्विज़:</p>
            <ul class="list-disc ml-5 space-y-1">
              <li>मुख्य अवधारणा की परिभाषा दें।</li>
              <li>एक वास्तविक उदाहरण दें।</li>
              <li>एक सामान्य गलती बताएं।</li>
              <li>समझ जांचने का तरीका बताएं।</li>
              <li>एक वाक्य में सार लिखें।</li>
            </ul>
          `;
          return this.formatBilingual(en, hi);
        }
        if (mode === 'Plan' || lower.includes('plan')) {
          const en = `
            <p class="font-semibold">Study plan for ${this.escapeHtml(topic)}:</p>
            <ul class="list-disc ml-5 space-y-1">
              <li>10 min: recap key terms and definitions.</li>
              <li>25 min: work through 2 focused examples.</li>
              <li>10 min: self-quiz and note gaps.</li>
              <li>15 min: review gaps + summarize.</li>
            </ul>
          `;
          const hi = `
            <p class="font-semibold">${this.escapeHtml(topic)} के लिए अध्ययन योजना:</p>
            <ul class="list-disc ml-5 space-y-1">
              <li>10 मिनट: मुख्य शब्द और परिभाषाएँ दोहराएं।</li>
              <li>25 मिनट: 2 केंद्रित उदाहरण हल करें।</li>
              <li>10 मिनट: खुद से क्विज़ लें और कमियाँ नोट करें।</li>
              <li>15 मिनट: कमियों की समीक्षा + सार लिखें।</li>
            </ul>
          `;
          return this.formatBilingual(en, hi);
        }
        if (mode === 'Draft' || lower.includes('draft')) {
          const en = `
            <p class="font-semibold">Draft response:</p>
            <p>${this.escapeHtml(topic)} is best understood by connecting the core idea to a simple example and then expanding into edge cases. Focus first on the definition, then show how it behaves in practice. Finish with a short summary that highlights why it matters.</p>
          `;
          const hi = `
            <p class="font-semibold">ड्राफ्ट उत्तर:</p>
            <p>${this.escapeHtml(topic)} को समझने का अच्छा तरीका है कि पहले इसकी मुख्य अवधारणा को एक सरल उदाहरण से जोड़ें, फिर विशेष स्थितियों तक विस्तार करें। पहले परिभाषा पर ध्यान दें, फिर व्यवहारिक उपयोग दिखाएं। अंत में छोटा सार लिखें कि यह क्यों महत्वपूर्ण है।</p>
          `;
          return this.formatBilingual(en, hi);
        }

        let reply = `Here is a ${tone.toLowerCase()} explanation of ${this.escapeHtml(topic)}.`;
        let replyHi = `${this.escapeHtml(topic)} का ${tone === 'Concise' ? 'संक्षिप्त' : tone === 'Detailed' ? 'विस्तृत' : 'क्रमबद्ध'} विवरण यहां है।`;
        if (step) {
          reply += `<ul class="list-disc ml-5 space-y-1 mt-2"><li>Define the core idea.</li><li>Work one example.</li><li>Check understanding with a quick question.</li></ul>`;
          replyHi += `<ul class="list-disc ml-5 space-y-1 mt-2"><li>मुख्य विचार की परिभाषा दें।</li><li>एक उदाहरण हल करें।</li><li>समझ जांचने के लिए एक छोटा प्रश्न करें।</li></ul>`;
        } else if (detailed) {
          reply += `<p class="mt-2">Start with the definition, then relate it to a concrete example, and finally connect it to why it appears in your coursework. If you want, I can generate practice questions or flashcards.</p>`;
          replyHi += `<p class="mt-2">पहले परिभाषा से शुरू करें, फिर इसे एक ठोस उदाहरण से जोड़ें, और अंत में बताएँ कि यह आपके पाठ्यक्रम में क्यों आता है। चाहें तो मैं अभ्यास प्रश्न या फ्लैशकार्ड बना सकता हूँ।</p>`;
        } else if (concise) {
          reply += `<p class="mt-2">Want an example or a short quiz?</p>`;
          replyHi += `<p class="mt-2">क्या आप एक उदाहरण या छोटा क्विज़ चाहेंगे?</p>`;
        }
        return this.formatBilingual(`<div>${reply}</div>`, `<div>${replyHi}</div>`);
      },
      sendChatMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim(); if(!msg) return;
        const chatDiv = document.getElementById('chat-messages');
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble-user';
        userBubble.innerHTML = this.escapeHtml(msg);
        chatDiv.appendChild(userBubble);
        this.chatHistory.push({ role: 'user', content: msg, mode: this.chatMode, tone: this.chatTone });
        input.value = '';
        this.addXP(5, 'AI question');

        const typing = document.createElement('div');
        typing.className = 'chat-bubble-ai';
        typing.id = 'typing-indicator';
        typing.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        chatDiv.appendChild(typing);
        chatDiv.scrollTop = chatDiv.scrollHeight;

        setTimeout(() => {
          const replyHtml = this.generateChatReply(msg);
          typing.remove();
          const aiBubble = document.createElement('div');
          aiBubble.className = 'chat-bubble-ai';
          aiBubble.innerHTML = replyHtml;
          chatDiv.appendChild(aiBubble);
          this.chatHistory.push({ role: 'assistant', content: replyHtml });
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }, 700);
      },

      // Timer
      startTimer() {
        if (this.isTimerRunning) return;
        this.isTimerRunning = true;
        this.timerInterval = setInterval(() => {
          if (this.timerSeconds > 0) this.timerSeconds--;
          else {
            clearInterval(this.timerInterval);
            this.isTimerRunning = false;
            this.addXP(10, 'Pomodoro');
            const taskSuggestion = document.getElementById('timer-suggestion').innerText.replace('Suggested: ', '');
            this.logFocusSession(taskSuggestion, this.timerLength);
            this.timerSeconds = this.timerLength * 60;
            setTimeout(() => {
              if (confirm(`Pomodoro complete! Did you work on "${taskSuggestion}"?`)) {
                this.addXP(5, 'focused work');
              }
            }, 100);
          }
          this.updateTimerDisplay();
        }, 1000);
      },
      pauseTimer() { clearInterval(this.timerInterval); this.isTimerRunning = false; },
      resetTimer() { clearInterval(this.timerInterval); this.isTimerRunning = false; this.timerSeconds = this.timerLength * 60; this.updateTimerDisplay(); },
      updateTimerDisplay() { const m = Math.floor(this.timerSeconds / 60), s = this.timerSeconds % 60; document.getElementById('timer-display').innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; },

      // Achievements
      renderAchievements() {
        const level = this.getLevelFromXP(this.userXP);
        const levelTitles = [
          'Novice', 'Learner', 'Apprentice', 'Scholar', 'Strategist', 'Mentor',
          'Expert', 'Master', 'Elite', 'Legend'
        ];
        const levelTitle = levelTitles[level - 1] || 'Elite Scholar';

        const tasksCompleted = this.tasks.filter(t => t.completed).length;
        const totalMembers = this.studyRooms.reduce((a, r) => a + r.members, 0);
        const flashcardsReviewed = this.flashcardDecks.reduce((acc, d) => acc + d.cards.filter(c => c.interval > 1).length, 0);
        const recurringTasksCompleted = this.tasks.filter(t => t.recurrence !== 'none' && t.completed).length;
        const goalDays = Object.values(this.dailyXP).filter(xp => xp >= this.dailyGoal).length;
        const focusStats = this.getFocusStats();
        const habitBest = this.habits.length ? Math.max(...this.habits.map(h => this.calcHabitStreak(h))) : 0;
        const examNotesCount = this.notes.filter(n => (n.title || '').toLowerCase().includes('exam notes')).length;
        const courseTotals = this.courses.reduce((acc, c) => {
          const total = c.modules.length;
          const done = c.modules.filter(m => m.completed).length;
          acc.total += total;
          acc.done += done;
          return acc;
        }, { total: 0, done: 0 });
        const courseProgress = courseTotals.total ? Math.round((courseTotals.done / courseTotals.total) * 100) : 0;

        const badges = [
          { name: 'Early Bird', xp: 50, icon: 'fa-star', progress: this.userXP, target: 200, detail: 'Earn 200 XP' },
          { name: 'Quiz Master', xp: 100, icon: 'fa-flask', progress: tasksCompleted, target: 5, detail: 'Complete 5 tasks' },
          { name: 'Collaborator', xp: 75, icon: 'fa-users', progress: totalMembers, target: 6, detail: 'Join busy rooms' },
          { name: 'Focus Pro', xp: 80, icon: 'fa-clock', progress: focusStats.weekMinutes, target: 120, detail: '120 focus minutes' },
          { name: 'Flashcard Master', xp: 120, icon: 'fa-layer-group', progress: flashcardsReviewed, target: 10, detail: 'Review 10 cards' },
          { name: 'Recurring Pro', xp: 90, icon: 'fa-sync-alt', progress: recurringTasksCompleted, target: 5, detail: 'Complete 5 recurring tasks' },
          { name: 'Goal Crusher', xp: 150, icon: 'fa-flag-checkered', progress: goalDays, target: 3, detail: 'Meet goal 3 days' },
          { name: 'Course Captain', xp: 120, icon: 'fa-graduation-cap', progress: courseTotals.done, target: 5, detail: 'Finish 5 modules' },
          { name: 'Habit Hero', xp: 110, icon: 'fa-seedling', progress: habitBest, target: 7, detail: '7-day habit streak' },
          { name: 'Exam Architect', xp: 130, icon: 'fa-pen-nib', progress: examNotesCount, target: 3, detail: 'Generate 3 exam notes' }
        ].map(b => ({ ...b, unlocked: b.progress >= b.target }));

        const unlockedCount = badges.filter(b => b.unlocked).length;
        const unlockedEl = document.getElementById('achievements-unlocked-count');
        if (unlockedEl) unlockedEl.innerText = unlockedCount;

        const titleEl = document.getElementById('achievement-level-title');
        if (titleEl) titleEl.innerText = levelTitle;

        const focusWeekEl = document.getElementById('achievement-focus-week');
        const focusSessionsEl = document.getElementById('achievement-focus-sessions');
        const habitBestEl = document.getElementById('achievement-habit-best');
        const goalDaysEl = document.getElementById('achievement-goal-days');
        if (focusWeekEl) focusWeekEl.innerText = focusStats.weekMinutes;
        if (focusSessionsEl) focusSessionsEl.innerText = focusStats.totalSessions;
        if (habitBestEl) habitBestEl.innerText = habitBest;
        if (goalDaysEl) goalDaysEl.innerText = goalDays;

        const courseProgressEl = document.getElementById('achievement-course-progress');
        const courseBarEl = document.getElementById('achievement-course-bar');
        if (courseProgressEl) courseProgressEl.innerText = `${courseProgress}%`;
        if (courseBarEl) courseBarEl.style.width = `${courseProgress}%`;

        const nextBadge = badges.filter(b => !b.unlocked).sort((a, b) => (b.progress / b.target) - (a.progress / a.target))[0];
        const nextBadgeEl = document.getElementById('achievement-next-badge');
        if (nextBadgeEl) {
          if (nextBadge) {
            const pct = Math.min(100, Math.round((nextBadge.progress / nextBadge.target) * 100));
            nextBadgeEl.innerText = `${nextBadge.name} (${pct}%)`;
          } else {
            nextBadgeEl.innerText = 'All badges unlocked';
          }
        }

        const progressList = document.getElementById('achievements-progress-list');
        if (progressList) {
          progressList.innerHTML = badges.map(b => {
            const pct = Math.min(100, Math.round((b.progress / b.target) * 100));
            return `
              <div class="bg-white/70 rounded-xl p-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <i class="fas ${b.icon} text-indigo-500"></i>
                    <span class="font-medium">${b.name}</span>
                  </div>
                  <span class="text-xs ${b.unlocked ? 'text-emerald-600' : 'text-gray-500'}">${b.unlocked ? 'Unlocked' : `${pct}%`}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">${b.detail}</p>
                <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-2 bg-indigo-600" style="width:${pct}%"></div>
                </div>
              </div>
            `;
          }).join('');
        }

        const grid = document.getElementById('achievements-grid');
        if (grid) {
          grid.innerHTML = badges.map(b => `
            <div class="bg-gray-50/80 p-4 rounded-2xl text-center ${b.unlocked ? 'opacity-100' : 'opacity-40'} backdrop-blur-sm">
              <i class="fas ${b.icon} text-2xl text-yellow-500"></i>
              <p class="text-sm font-medium mt-1">${b.name}</p>
              <span class="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full">+${b.xp} XP</span>
            </div>
          `).join('');
        }
      },
      checkAchievements() {},

      // Profile
      getProfileInitials(name = this.userName) {
        const initials = (name || 'Student')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map(part => part[0])
          .join('');
        return (initials || 'U').toUpperCase();
      },
      parseProfileSkills(value) {
        const raw = Array.isArray(value) ? value.join(',') : (value || '');
        const seen = new Set();
        return raw
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean)
          .filter(skill => {
            const key = skill.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, 12);
      },
      getProfileCompletion() {
        const fields = [
          { label: 'name', value: this.userName },
          { label: 'email', value: this.userEmail },
          { label: 'mobile', value: this.userMobile },
          { label: 'college', value: this.userCollege },
          { label: 'course', value: this.userCourse },
          { label: 'year', value: this.userYear },
          { label: 'branch', value: this.userBranch },
          { label: 'timezone', value: this.userTimeZone },
          { label: 'skills', value: (this.userSkills || []).length }
        ];
        const completed = fields.filter(field => {
          if (Array.isArray(field.value)) return field.value.length > 0;
          return !!String(field.value || '').trim();
        });
        return {
          percent: Math.round((completed.length / fields.length) * 100),
          missing: fields.filter(field => !completed.includes(field)).map(field => field.label)
        };
      },
      validateProfileDraft(draft) {
        const errors = {};
        if (!draft.name || draft.name.trim().length < 2) {
          errors.name = 'Enter your full name.';
        }
        if (!draft.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
          errors.email = 'Enter a valid email address.';
        }
        if (draft.mobile && !/^\+?[\d\s().-]{7,20}$/.test(draft.mobile)) {
          errors.mobile = 'Use a valid mobile number.';
        }
        if (draft.timeZone && !/^[A-Za-z0-9_+\-/ ]{2,40}$/.test(draft.timeZone)) {
          errors.timeZone = 'Use a valid timezone like Asia/Kolkata.';
        }
        return errors;
      },
      renderProfile() {
        document.getElementById('profile-display-name').innerText = this.userName;
        document.getElementById('profile-email').innerText = this.userEmail;
        document.getElementById('profile-avatar-initials').innerText = this.getProfileInitials();
        const level = this.getLevelFromXP(this.userXP);
        document.querySelectorAll('.profile-level').forEach(el => el.innerText = level);
        document.querySelectorAll('.profile-xp').forEach(el => el.innerText = this.userXP);

        const tasksCompleted = this.tasks.filter(t => t.completed).length;
        const assignmentsCompleted = this.assignments.filter(a => a.completed).length;
        const notesCount = this.notes.length;
        const streak = localStorage.getItem('streak') || 5;
        document.getElementById('profile-tasks-completed').innerText = tasksCompleted;
        document.getElementById('profile-assignments-completed').innerText = assignmentsCompleted;
        document.getElementById('profile-notes-count').innerText = notesCount;
        document.getElementById('profile-streak').innerText = streak;

        const skills = this.userSkills || [];
        document.getElementById('profile-skills-count').innerText = skills.length;
        const skillsList = document.getElementById('profile-skills-list');
        skillsList.innerHTML = skills.length
          ? skills.map(s => `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">${this.escapeHtml(s)}</span>`).join('')
          : '<p class="text-gray-500 text-sm">No skills yet. Add some in Edit profile.</p>';

        const collegeEl = document.getElementById('profile-college');
        const courseEl = document.getElementById('profile-course');
        const yearEl = document.getElementById('profile-year');
        const branchEl = document.getElementById('profile-branch');
        const timeZoneEl = document.getElementById('profile-timezone');
        const mobileEl = document.getElementById('profile-mobile');
        const completionLabelEl = document.getElementById('profile-completion-label');
        const completionBarEl = document.getElementById('profile-completion-bar');
        const whatsappStatusEl = document.getElementById('profile-whatsapp-status');
        const whatsappNumberEl = document.getElementById('profile-whatsapp-number');
        const whatsappDigestEl = document.getElementById('profile-whatsapp-digest');
        const whatsappQuietHoursEl = document.getElementById('profile-whatsapp-quiet-hours');
        const whatsappLiveSyncEl = document.getElementById('profile-whatsapp-live-sync');
        const whatsappTagsEl = document.getElementById('profile-whatsapp-tags');
        const whatsappActivityEl = document.getElementById('profile-whatsapp-activity');
        if (collegeEl) collegeEl.innerText = this.userCollege || '-';
        if (courseEl) courseEl.innerText = this.userCourse || '-';
        if (yearEl) yearEl.innerText = this.userYear || '-';
        if (branchEl) branchEl.innerText = this.userBranch || '-';
        if (timeZoneEl) timeZoneEl.innerText = this.userTimeZone || '-';
        if (mobileEl) mobileEl.innerText = this.userMobile || '-';
        const completion = this.getProfileCompletion();
        if (completionLabelEl) completionLabelEl.innerText = `${completion.percent}%`;
        if (completionBarEl) completionBarEl.style.width = `${completion.percent}%`;

        const activeWhatsAppNumber = this.whatsappNumber || this.userMobile || '';
        const whatsappEnabled = !!this.whatsappOptIn && !!activeWhatsAppNumber;
        if (whatsappStatusEl) whatsappStatusEl.innerText = whatsappEnabled ? 'Enabled' : activeWhatsAppNumber ? 'Configured, opt-in off' : 'Missing number';
        if (whatsappNumberEl) whatsappNumberEl.innerText = activeWhatsAppNumber || '-';
        if (whatsappDigestEl) whatsappDigestEl.innerText = this.whatsappDailyDigest ? `Daily ${this.whatsappDailyDigestTime}` : 'Off';
        if (whatsappQuietHoursEl) whatsappQuietHoursEl.innerText = `${this.whatsappQuietHoursStart} - ${this.whatsappQuietHoursEnd}`;
        if (whatsappLiveSyncEl) {
          if (!this.jwtToken) whatsappLiveSyncEl.innerText = 'Sign in required';
          else if (this.liveSyncConnected && this.lastLiveSyncAt) whatsappLiveSyncEl.innerText = `Live at ${this.formatTime(this.lastLiveSyncAt)}`;
          else if (this.lastLiveSyncAt) whatsappLiveSyncEl.innerText = `Last update ${this.formatTime(this.lastLiveSyncAt)}`;
          else whatsappLiveSyncEl.innerText = 'Connecting';
        }
        if (whatsappTagsEl) {
          const tags = [
            this.whatsappTaskAlerts ? 'Task alerts' : null,
            this.whatsappAssignmentAlerts ? 'Assignment alerts' : null,
            this.whatsappScheduleAlerts ? 'Schedule alerts' : null,
            this.whatsappFocusAlerts ? 'Focus nudges' : null,
            `Lead ${this.whatsappReminderLeadMinutes}m`,
            this.userTimeZone || 'UTC'
          ].filter(Boolean);
          whatsappTagsEl.innerHTML = tags.map(tag => `<span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">${this.escapeHtml(tag)}</span>`).join('');
        }
        if (whatsappActivityEl) {
          const activity = (this.whatsappActivity || []).slice(0, 4);
          whatsappActivityEl.innerHTML = activity.length
            ? activity.map(item => `
                <div class="rounded-xl bg-white/70 px-3 py-2">
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-semibold text-gray-700">${this.escapeHtml(item.type || 'message')}</span>
                    <span class="text-[11px] uppercase tracking-wide ${item.status === 'failed' ? 'text-rose-600' : item.status === 'sent' || item.status === 'simulated' ? 'text-emerald-600' : 'text-gray-500'}">${this.escapeHtml(item.status || 'queued')}</span>
                  </div>
                  <p class="mt-1 text-gray-500">${this.escapeHtml(((item.body || '').slice(0, 96)) + ((item.body || '').length > 96 ? '...' : ''))}</p>
                </div>
              `).join('')
            : '<p class="text-gray-500">No WhatsApp activity yet. Real-time deliveries will appear here.</p>';
        }

        const focusStats = this.getFocusStats();
        document.getElementById('profile-focus-today').innerText = focusStats.todayMinutes;
        document.getElementById('profile-focus-week').innerText = focusStats.weekMinutes;
        document.getElementById('profile-focus-total').innerText = focusStats.totalSessions;
        const bestHabitStreak = this.habits.length ? Math.max(...this.habits.map(h => this.calcHabitStreak(h))) : 0;
        const goalDays = Object.values(this.dailyXP).filter(xp => xp >= this.dailyGoal).length;
        document.getElementById('profile-best-habit-streak').innerText = bestHabitStreak;
        document.getElementById('profile-habits-total').innerText = this.habits.length;
        document.getElementById('profile-goal-days').innerText = goalDays;

        const currentXP = this.getXPForNextLevel(level);
        const nextXP = this.getXPForNextLevel(level+1);
        const xpIn = this.userXP - currentXP;
        const need = nextXP - currentXP;
        const percent = Math.min((xpIn/need)*100,100);
        document.getElementById('profile-xp-bar').style.width = percent + '%';
        document.getElementById('profile-xp-detail').innerText = `${Math.floor(xpIn)} / ${need} XP`;

        this.renderHeatmap();
      },
      renderHeatmap() {
        const heatmapDiv = document.getElementById('heatmap');
        const today = new Date();
        const dayMs = 24 * 60 * 60 * 1000;
        let html = '';
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today.getTime() - i * dayMs);
          const dateStr = date.toDateString();
          const xp = this.dailyXP[dateStr] || 0;
          let level = 0;
          if (xp > 0) level = Math.min(5, Math.floor(xp / 20) + 1);
          html += `<div class="heatmap-cell" data-level="${level}" title="${dateStr}: ${xp} XP"></div>`;
        }
        heatmapDiv.innerHTML = html;
      },

      async openSetGoalModal() {
        const res = await this.openModal('Set Daily XP Goal', [{ label: 'Goal (XP)', name: 'goal', type: 'number', value: this.dailyGoal }]);
        if (res) {
          this.dailyGoal = parseInt(res.goal) || 100;
          this.saveAll();
          this.updateXPUI();
        }
      },

      // Rest of existing functions (unchanged)
      renderAssignments() {
        const listEl = document.getElementById('assignments-list');
        if (!listEl) return;
        const search = (document.getElementById('assignments-search')?.value || '').trim().toLowerCase();
        const filter = document.getElementById('assignments-filter')?.value || 'all';
        const sort = document.getElementById('assignments-sort')?.value || 'due';
        const showCompleted = document.getElementById('assignments-show-completed')?.checked ?? true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let list = this.assignments.map(a => {
          const dueDate = a.due ? new Date(`${a.due}T00:00:00`) : null;
          const overdue = dueDate && dueDate < today && !a.completed;
          return {
            ...a,
            dueDate,
            overdue,
            type: a.type || 'Study',
            course: a.course || 'General',
            priority: a.priority || 'Medium',
            hours: a.hours || Math.round(((a.weight || 10) / 10) * 2)
          };
        });

        const total = list.length;
        const completed = list.filter(a => a.completed).length;
        const upcoming = list.filter(a => !a.completed && a.dueDate && a.dueDate >= today).length;
        const workload = list.filter(a => !a.completed).reduce((acc, a) => acc + (a.hours || 0), 0);

        const totalEl = document.getElementById('assignments-total');
        const completedEl = document.getElementById('assignments-completed');
        const upcomingEl = document.getElementById('assignments-upcoming');
        const workloadEl = document.getElementById('assignments-workload-hours');
        if (totalEl) totalEl.innerText = total;
        if (completedEl) completedEl.innerText = completed;
        if (upcomingEl) upcomingEl.innerText = upcoming;
        if (workloadEl) workloadEl.innerText = `${workload}h`;

        if (search) {
          list = list.filter(a => `${a.name} ${a.course} ${a.type}`.toLowerCase().includes(search));
        }
        if (!showCompleted) list = list.filter(a => !a.completed);
        if (filter === 'pending') list = list.filter(a => !a.completed);
        if (filter === 'completed') list = list.filter(a => a.completed);
        if (filter === 'overdue') list = list.filter(a => a.overdue);

        list.sort((a, b) => {
          if (sort === 'weight') return (b.weight || 0) - (a.weight || 0);
          if (sort === 'hours') return (b.hours || 0) - (a.hours || 0);
          if (sort === 'title') return (a.name || '').localeCompare(b.name || '');
          const ad = a.dueDate ? a.dueDate.getTime() : Infinity;
          const bd = b.dueDate ? b.dueDate.getTime() : Infinity;
          return ad - bd;
        });

        const totalWeight = this.assignments.reduce((acc, a) => acc + (a.weight || 0), 0) || 1;
        const completedWeight = this.assignments.filter(a => a.completed).reduce((acc, a) => acc + (a.weight || 0), 0);
        const weightPercent = Math.min(Math.round((completedWeight / totalWeight) * 100), 100);
        const weightBar = document.getElementById('assignments-weight-bar');
        const weightLabel = document.getElementById('assignments-weight-label');
        if (weightBar) weightBar.style.width = `${weightPercent}%`;
        if (weightLabel) weightLabel.innerText = `${weightPercent}% completed`;

        const upcomingList = document.getElementById('assignments-upcoming-list');
        if (upcomingList) {
          const upcomingItems = this.assignments
            .map(a => ({ ...a, dueDate: a.due ? new Date(`${a.due}T00:00:00`) : null }))
            .filter(a => !a.completed && a.dueDate && a.dueDate >= today)
            .sort((a, b) => a.dueDate - b.dueDate)
            .slice(0, 5);
          upcomingList.innerHTML = upcomingItems.map(a => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(a.name)}</span>
              <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${a.due}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No upcoming assignments.</p>';
        }

        const focusList = document.getElementById('assignments-focus-list');
        if (focusList) {
          const heavy = [...this.assignments]
            .filter(a => !a.completed)
            .sort((a, b) => (b.hours || 0) - (a.hours || 0))
            .slice(0, 4);
          focusList.innerHTML = heavy.map(a => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(a.name)}</span>
              <span class="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">${a.hours || 0}h</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No workload items.</p>';
        }

        listEl.innerHTML = list.map(a => {
          const statusClass = a.overdue ? 'border-red-200 bg-red-50/70' : 'border-transparent bg-white/70';
          const priorityClass = a.priority === 'High'
            ? 'bg-red-100 text-red-700'
            : a.priority === 'Low'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-amber-100 text-amber-700';
          return `
            <div class="glass-card p-5 border ${statusClass}">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-semibold">${this.escapeHtml(a.name)}</h4>
                  <p class="text-xs text-gray-500">Due ${a.due || 'TBD'} - ${a.course}</p>
                  <div class="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <span class="${priorityClass} px-2 py-0.5 rounded-full">${a.priority}</span>
                    <span class="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${a.type}</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">${a.weight || 0}%</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">${a.hours || 0}h</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span class="text-indigo-600 text-sm font-bold">+${a.xp} XP</span>
                  <button onclick="APP.completeAssignment('${a.id}')" class="bg-green-100 hover:bg-green-200 px-4 py-1.5 rounded-full text-xs font-medium transition">mark done</button>
                </div>
              </div>
            </div>
          `;
        }).join('') || '<p class="text-gray-500">No assignments. Add one!</p>';
      },
      completeAssignment(id) {
        const a = this.assignments.find(a => a.id === id);
        if (a && !a.completed) {
          a.completed = true;
          a.completedAt = Date.now();
          this.addXP(a.xp, 'assignment');
        }
        this.saveAll();
        this.renderAssignments();
        this.renderDashboard();
      },
      async openAddAssignmentModal() {
        const res = await this.openModal('New Assignment', [
          { label: 'Name', name: 'name', placeholder: 'ML project' },
          { label: 'Course', name: 'course', placeholder: 'e.g., CS50' },
          { label: 'Due date', name: 'due', type: 'date' },
          { label: 'Weight (%)', name: 'weight', type: 'number', value: '20' },
          { label: 'Estimated hours', name: 'hours', type: 'number', value: '4' },
          { label: 'Type (Study/Lecture/Exam/Project/Personal)', name: 'type', value: 'Project' },
          { label: 'Priority (High/Medium/Low)', name: 'priority', value: 'Medium' },
          { label: 'XP', name: 'xp', type: 'number', value: '50' }
        ]);
        if (res) {
          this.assignments.push({
            id:'a'+Date.now(),
            name: res.name,
            course: res.course || 'General',
            due: res.due,
            weight: parseInt(res.weight) || 20,
            hours: parseInt(res.hours) || 4,
            type: res.type || 'Project',
            priority: res.priority || 'Medium',
            completed: false,
            xp: parseInt(res.xp) || 50
          });
          this.saveAll();
          this.renderAssignments();
          this.renderDashboard();
        }
      },
      normalizeNote(note, fallbackAuthor = 'Student', source = 'local') {
        return {
          id: note.id || `n${Date.now()}`,
          title: note.title || 'Untitled note',
          content: note.content || '',
          date: note.date || Date.now(),
          author: note.author || fallbackAuthor,
          subject: note.subject || 'General',
          category: note.category || 'General',
          tags: Array.isArray(note.tags) ? note.tags : (note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
          visibility: note.visibility || (source === 'community' ? 'public' : 'private'),
          downloads: note.downloads || 0,
          likes: note.likes || 0,
          ratingAvg: note.ratingAvg || 0,
          ratingCount: note.ratingCount || 0,
          commentsCount: note.commentsCount || 0,
          comments: Array.isArray(note.comments) ? note.comments : [],
          summary: note.summary || '',
          fileName: note.fileName || '',
          fileUrl: note.fileUrl || '',
          fileType: note.fileType || '',
          fileSize: note.fileSize || 0,
          serverId: note.serverId || null,
          source
        };
      },
      getNoteFileType(note) {
        const name = (note.fileName || note.fileUrl || '').toLowerCase();
        if (name.endsWith('.pdf')) return 'pdf';
        if (name.endsWith('.doc') || name.endsWith('.docx')) return 'doc';
        if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'ppt';
        if (name.match(/\.(png|jpg|jpeg|gif|webp)$/)) return 'image';
        if (name.match(/\.(txt|md)$/)) return 'text';
        return note.fileType ? note.fileType.split('/')[0] : '';
      },
      renderRatingStars(avg) {
        const rounded = Math.round(avg || 0);
        return Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star ${i < rounded ? 'text-yellow-400' : 'text-gray-300'}"></i>`).join('');
      },
      updateNotesStatusUI() {
        const statusEl = document.getElementById('notes-server-status');
        const syncEl = document.getElementById('notes-last-sync');
        const status = (this.notesServerStatus || 'online').toLowerCase() === 'online' ? 'Online' : 'Offline';
        if (statusEl) {
          statusEl.className = status === 'Online'
            ? 'bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs'
            : 'bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs';
          statusEl.innerText = `Server: ${status}`;
        }
        if (syncEl) {
          syncEl.innerText = this.notesServerLastSync
            ? `Last sync: ${this.formatShortDate(this.notesServerLastSync)} ${this.formatTime(this.notesServerLastSync)}`
            : 'Last sync: -';
        }
      },
      async syncNotesToServer() {
        if (!this.jwtToken) {
          this.showToast('Sign in to sync notes');
          return;
        }
        await this.syncToServer();
        await this.refreshCommunityNotes();
        this.notesServerLastSync = Date.now();
        this.saveAll({ sync: false });
        this.renderNotesPage();
        this.showToast('Notes synced to server');
      },
      async uploadNoteFromForm() {
        const title = document.getElementById('notes-upload-title')?.value.trim();
        const subject = document.getElementById('notes-upload-subject')?.value.trim();
        const category = document.getElementById('notes-upload-category')?.value.trim();
        const tags = document.getElementById('notes-upload-tags')?.value.trim();
        const visibility = document.getElementById('notes-upload-visibility')?.value || 'public';
        const contentInput = document.getElementById('notes-upload-content')?.value.trim();
        const fileInput = document.getElementById('notes-upload-file');
        const file = fileInput?.files?.[0];

        if (!title) {
          this.showToast('Add a note title');
          return;
        }

        const createNote = async (contentText, fileName, fileMeta = {}) => {
          const note = {
            id: 'n' + Date.now(),
            title,
            content: contentText || '',
            date: Date.now(),
            author: this.userName,
            subject: subject || 'General',
            category: category || 'General',
            tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            visibility,
            downloads: 0,
            likes: 0,
            ratingAvg: 0,
            ratingCount: 0,
            commentsCount: 0,
            fileName: fileName || '',
            fileUrl: fileMeta.fileUrl || '',
            fileType: fileMeta.fileType || '',
            fileSize: fileMeta.fileSize || 0
          };
          this.notes.push(note);
          this.saveAll();
          this.renderNotesPage();
          this.renderDashboard();
          document.getElementById('notes-upload-title').value = '';
          document.getElementById('notes-upload-subject').value = '';
          document.getElementById('notes-upload-category').value = '';
          document.getElementById('notes-upload-tags').value = '';
          document.getElementById('notes-upload-content').value = '';
          if (fileInput) fileInput.value = '';
          if (this.jwtToken && visibility === 'public') {
            await this.syncToServer();
            await this.refreshCommunityNotes();
          }
          this.showToast(visibility === 'public' ? 'Note uploaded to server' : 'Note saved');
          this.addXP(4, 'note upload');
        };

        if (visibility === 'public' && !this.jwtToken) {
          this.showToast('Sign in to publish notes');
          return;
        }

        if (this.jwtToken) {
          try {
            const form = new FormData();
            const clientId = 'n' + Date.now();
            form.append('title', title);
            form.append('subject', subject || 'General');
            form.append('category', category || 'General');
            form.append('tags', tags || '');
            form.append('visibility', visibility);
            form.append('content', contentInput || '');
            form.append('clientId', clientId);
            if (file) form.append('file', file);
            const res = await this.apiFetch('/notes/upload', { method: 'POST', body: form });
            if (res.ok) {
              const data = await res.json();
              const note = data?.note || {};
              this.notes.push({
                id: note.id || clientId,
                title: note.title || title,
                content: note.content || contentInput || '',
                date: Date.now(),
                author: this.userName,
                subject: note.subject || subject || 'General',
                category: note.category || category || 'General',
                tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                visibility,
                downloads: 0,
                likes: 0,
                ratingAvg: 0,
                ratingCount: 0,
                commentsCount: 0,
                fileName: note.fileName || file?.name || '',
                fileUrl: note.fileUrl || '',
                fileType: note.fileType || file?.type || '',
                fileSize: note.fileSize || file?.size || 0,
                serverId: note.serverId || null
              });
              this.saveAll();
              await this.refreshCommunityNotes();
              this.renderNotesPage();
              this.renderDashboard();
              if (fileInput) fileInput.value = '';
              document.getElementById('notes-upload-title').value = '';
              document.getElementById('notes-upload-subject').value = '';
              document.getElementById('notes-upload-category').value = '';
              document.getElementById('notes-upload-tags').value = '';
              document.getElementById('notes-upload-content').value = '';
              this.showToast('Note uploaded to server');
              this.addXP(4, 'note upload');
              return;
            }
          } catch (err) {}
        }

        if (file) {
          if (file.type && file.type.startsWith('text')) {
            const reader = new FileReader();
            reader.onload = async () => {
              await createNote(reader.result, file.name);
            };
            reader.readAsText(file);
          } else {
            await createNote(contentInput || `Uploaded file: ${file.name}`, file.name);
          }
        } else {
          await createNote(contentInput, '');
        }
      },
      async downloadNote(noteId, source = 'local') {
        const list = source === 'community' ? this.notesServer : this.notes;
        const note = list.find(n => n.id === noteId || n.serverId === noteId);
        if (!note) return;
        if (note.fileUrl) {
          const link = document.createElement('a');
          link.href = note.fileUrl;
          link.download = note.fileName || `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note'}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          const payload = `Title: ${note.title}\nSubject: ${note.subject || 'General'}\nAuthor: ${note.author || this.userName}\nTags: ${(note.tags || []).join(', ')}\n\n${note.content || ''}`;
          const blob = new Blob([payload], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note'}.txt`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(link.href);
        }
        note.downloads = (note.downloads || 0) + 1;
        this.saveAll();
        this.renderNotesPage();
        if (source === 'community') {
          try {
            const res = await this.apiFetch('/notes/public', {
              method: 'POST',
              body: JSON.stringify({ id: note.id, action: 'download' })
            });
            if (res.ok) {
              const data = await res.json();
              if (typeof data.downloads === 'number') note.downloads = data.downloads;
            }
          } catch (err) {}
        } else {
          this.scheduleSync();
        }
        this.showToast('Note downloaded');
      },
      async toggleNoteLike(noteId, source = 'local') {
        const list = source === 'community' ? this.notesServer : this.notes;
        const note = list.find(n => n.id === noteId || n.serverId === noteId);
        if (!note) return;
        note.likes = (note.likes || 0) + 1;
        this.saveAll();
        this.renderNotesPage();
        if (source === 'community') {
          try {
            const res = await this.apiFetch('/notes/public', {
              method: 'POST',
              body: JSON.stringify({ id: note.id, action: 'like' })
            });
            if (res.ok) {
              const data = await res.json();
              if (typeof data.likes === 'number') note.likes = data.likes;
            }
          } catch (err) {}
        } else {
          this.scheduleSync();
        }
      },
      async openRateNoteModal(noteId, source = 'community') {
        if (!this.jwtToken) {
          this.showToast('Sign in to rate notes');
          return;
        }
        const res = await this.openModal('Rate Note', [
          { label: 'Rating (1-5)', name: 'rating', type: 'number', value: '5', placeholder: '1-5' }
        ]);
        if (res) {
          const value = Math.max(1, Math.min(5, parseInt(res.rating, 10) || 0));
          if (!value) return;
          await this.rateNote(noteId, source, value);
        }
      },
      async rateNote(noteId, source = 'community', value = 5) {
        if (source !== 'community') return;
        try {
          const res = await this.apiFetch('/notes/public', {
            method: 'POST',
            body: JSON.stringify({ id: noteId, action: 'rate', value })
          });
          if (res.ok) {
            const data = await res.json();
            const note = this.notesServer.find(n => n.id === noteId);
            if (note) {
              note.ratingAvg = data.ratingAvg ?? note.ratingAvg;
              note.ratingCount = data.ratingCount ?? note.ratingCount;
            }
            this.saveAll({ sync: false });
            this.renderNotesPage();
            this.showToast('Rating submitted');
          }
        } catch (err) {
          this.showToast('Failed to rate note');
        }
      },
      async openCommentModal(noteId, source = 'community') {
        if (!this.jwtToken) {
          this.showToast('Sign in to comment');
          return;
        }
        const res = await this.openModal('Add Comment', [
          { label: 'Comment', name: 'comment', placeholder: 'Share feedback or tips...' }
        ]);
        if (res && res.comment) {
          await this.addCommentToNote(noteId, source, res.comment);
        }
      },
      async addCommentToNote(noteId, source = 'community', content = '') {
        if (source !== 'community') return;
        try {
          const res = await this.apiFetch('/notes/public', {
            method: 'POST',
            body: JSON.stringify({ id: noteId, action: 'comment', content })
          });
          if (res.ok) {
            const data = await res.json();
            const note = this.notesServer.find(n => n.id === noteId);
            if (note) {
              note.comments = Array.isArray(note.comments) ? note.comments : [];
              if (data.comment) note.comments.unshift(data.comment);
              note.commentsCount = data.commentsCount ?? (note.commentsCount || 0) + 1;
            }
            this.saveAll({ sync: false });
            this.renderNotesPage();
            this.showToast('Comment added');
          }
        } catch (err) {
          this.showToast('Failed to add comment');
        }
      },
      copyNoteLink(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note || note.visibility !== 'public') {
          this.showToast('Make the note public to share');
          return;
        }
        if (!note.serverId) {
          this.showToast('Sync notes to generate a share link');
          return;
        }
        const base = window.location.origin;
        const link = `${base}/notes/${note.serverId}`;
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(link).then(() => this.showToast('Share link copied'));
        } else {
          this.showToast(link);
        }
      },
      async toggleNoteVisibility(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        note.visibility = note.visibility === 'public' ? 'private' : 'public';
        this.saveAll();
        if (this.jwtToken) {
          await this.syncToServer();
          await this.refreshCommunityNotes();
        }
        this.renderNotesPage();
      },
      summarizeNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        const content = note.content || '';
        const sentences = content.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
        note.summary = sentences.slice(0, 2).join('. ') || content.substring(0, 120);
        this.saveAll();
        this.renderNotesPage();
        this.showToast('Summary generated');
      },
      createDeckFromNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        const sentences = (note.content || '').split(/[.!?]/).map(s => s.trim()).filter(Boolean).slice(0, 6);
        if (!sentences.length) {
          this.showToast('Note content is empty');
          return;
        }
        const cards = sentences.map((s, idx) => ({
          id: 'c' + (Date.now() + idx),
          front: note.title || 'Note',
          back: s,
          nextReview: Date.now(),
          easeFactor: 2.5,
          interval: 1
        }));
        this.flashcardDecks.push({ id: 'd' + Date.now(), name: `Flashcards - ${note.title}`, cards });
        this.saveAll();
        this.showToast('Flashcards created');
      },
      renderNotesPage() {
        const grid = document.getElementById('notes-grid');
        if (!grid) return;

        this.updateNotesStatusUI();

        const localNotes = this.notes.map(n => this.normalizeNote(n, this.userName, 'local'));
        const communityNotes = this.notesServer.map(n => this.normalizeNote(n, n.author || 'Student', 'community'));

        const totalEl = document.getElementById('notes-total-count');
        const sharedEl = document.getElementById('notes-shared-count');
        const downloadsEl = document.getElementById('notes-downloads-total');
        const likesEl = document.getElementById('notes-likes-total');
        const sharedCount = localNotes.filter(n => n.visibility === 'public').length;
        const downloadsTotal = localNotes.reduce((acc, n) => acc + (n.downloads || 0), 0) + communityNotes.reduce((acc, n) => acc + (n.downloads || 0), 0);
        const likesTotal = localNotes.reduce((acc, n) => acc + (n.likes || 0), 0) + communityNotes.reduce((acc, n) => acc + (n.likes || 0), 0);
        if (totalEl) totalEl.innerText = localNotes.length;
        if (sharedEl) sharedEl.innerText = sharedCount;
        if (downloadsEl) downloadsEl.innerText = downloadsTotal;
        if (likesEl) likesEl.innerText = likesTotal;

        const subjectFilter = document.getElementById('notes-subject-filter');
        const allSubjects = Array.from(new Set([...localNotes, ...communityNotes].map(n => n.subject || 'General'))).sort();
        if (subjectFilter) {
          const current = subjectFilter.value;
          subjectFilter.innerHTML = `<option value="all">All subjects</option>` + allSubjects.map(s => `<option value="${s}">${s}</option>`).join('');
          subjectFilter.value = current || 'all';
        }

        const categoryFilter = document.getElementById('notes-category-filter');
        const allCategories = Array.from(new Set([...localNotes, ...communityNotes].map(n => n.category || 'General'))).sort();
        if (categoryFilter) {
          const currentCat = categoryFilter.value;
          categoryFilter.innerHTML = `<option value="all">All categories</option>` + allCategories.map(s => `<option value="${s}">${s}</option>`).join('');
          categoryFilter.value = currentCat || 'all';
        }

        const search = (document.getElementById('notes-search')?.value || '').trim().toLowerCase();
        const subject = document.getElementById('notes-subject-filter')?.value || 'all';
        const category = document.getElementById('notes-category-filter')?.value || 'all';
        const fileFilter = document.getElementById('notes-file-filter')?.value || 'all';
        const visibility = document.getElementById('notes-visibility-filter')?.value || 'all';
        const sort = document.getElementById('notes-sort')?.value || 'recent';
        const showCommunity = document.getElementById('notes-show-community')?.checked ?? true;

        let filtered = [...localNotes];
        if (search) {
          filtered = filtered.filter(n => {
            const hay = `${n.title} ${n.content} ${(n.tags || []).join(' ')} ${n.author} ${n.subject} ${n.category}`.toLowerCase();
            return hay.includes(search);
          });
        }
        if (subject !== 'all') filtered = filtered.filter(n => (n.subject || 'General') === subject);
        if (category !== 'all') filtered = filtered.filter(n => (n.category || 'General') === category);
        if (fileFilter !== 'all') filtered = filtered.filter(n => this.getNoteFileType(n) === fileFilter);
        if (visibility !== 'all') filtered = filtered.filter(n => n.visibility === visibility);

        filtered.sort((a, b) => {
          if (sort === 'popular') return (b.likes || 0) - (a.likes || 0);
          if (sort === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
          if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
          return (b.date || 0) - (a.date || 0);
        });

        grid.innerHTML = filtered.map(n => {
          const tags = (n.tags || []).slice(0, 3).map(t => `<span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">${this.escapeHtml(t)}</span>`).join('');
          const preview = n.summary || (n.content || '').substring(0, 120);
          const visibilityClass = n.visibility === 'public' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700';
          const fileType = this.getNoteFileType(n);
          const fileBadge = n.fileUrl || n.fileName ? `<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">${fileType || 'file'}</span>` : '';
          const rating = n.ratingAvg || 0;
          return `
            <div class="glass-card p-5 space-y-3">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-lg">${this.escapeHtml(n.title)}</h4>
                  <p class="text-xs text-gray-500">${this.escapeHtml(n.subject)} · ${this.escapeHtml(n.category || 'General')} · ${this.formatShortDate(n.date)}</p>
                </div>
                <button onclick="APP.deleteNote('${n.id}')" class="text-red-300 hover:text-red-500 text-sm"><i class="fas fa-trash"></i></button>
              </div>
              <p class="text-sm text-gray-600">${this.escapeHtml(preview)}${(n.content || '').length > 120 ? '...' : ''}</p>
              <div class="flex flex-wrap gap-2 text-[10px]">
                <span class="${visibilityClass} px-2 py-0.5 rounded-full">${n.visibility}</span>
                ${fileBadge}
                ${tags}
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span><i class="fas fa-download mr-1"></i>${n.downloads}</span>
                <span><i class="fas fa-heart mr-1"></i>${n.likes}</span>
                <span>${this.renderRatingStars(rating)} <span class="ml-1 text-[10px]">(${n.ratingCount || 0})</span></span>
                <span>${this.escapeHtml(n.author || this.userName)}</span>
              </div>
              <div class="flex flex-wrap gap-2 text-xs">
                <button onclick="APP.downloadNote('${n.id}','local')" class="bg-indigo-600 text-white px-3 py-1.5 rounded-full">${n.fileUrl ? 'Download file' : 'Download'}</button>
                <button onclick="APP.toggleNoteLike('${n.id}','local')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Like</button>
                <button onclick="APP.summarizeNote('${n.id}')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Summarize</button>
                <button onclick="APP.createDeckFromNote('${n.id}')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Flashcards</button>
                <button onclick="APP.copyNoteLink('${n.id}')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Share</button>
                <button onclick="APP.toggleNoteVisibility('${n.id}')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">${n.visibility === 'public' ? 'Make private' : 'Publish'}</button>
              </div>
            </div>
          `;
        }).join('') || '<p class="text-gray-500">No notes match this filter.</p>';

        const communityList = document.getElementById('notes-community-list');
        if (communityList) {
          if (!showCommunity) {
            communityList.innerHTML = '<p class="text-gray-500">Community notes hidden.</p>';
          } else {
            let list = [...communityNotes];
            if (search) {
              list = list.filter(n => {
                const hay = `${n.title} ${n.content} ${(n.tags || []).join(' ')} ${n.author} ${n.subject} ${n.category}`.toLowerCase();
                return hay.includes(search);
              });
            }
            if (subject !== 'all') list = list.filter(n => (n.subject || 'General') === subject);
            if (category !== 'all') list = list.filter(n => (n.category || 'General') === category);
            if (fileFilter !== 'all') list = list.filter(n => this.getNoteFileType(n) === fileFilter);
            list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
            communityList.innerHTML = list.slice(0, 6).map(n => `
              <div class="bg-white/70 rounded-xl p-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold">${this.escapeHtml(n.title)}</p>
                    <p class="text-xs text-gray-500">${this.escapeHtml(n.subject)} · ${this.escapeHtml(n.category || 'General')} · ${this.escapeHtml(n.author)}</p>
                  </div>
                  <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${n.downloads} downloads</span>
                </div>
                <p class="text-xs text-gray-600 mt-2">${this.escapeHtml((n.content || '').substring(0, 80))}...</p>
                <div class="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mt-2">
                  <span>${this.renderRatingStars(n.ratingAvg || 0)} (${n.ratingCount || 0})</span>
                  <span><i class="fas fa-comment mr-1"></i>${n.commentsCount || 0}</span>
                  ${n.fileUrl || n.fileName ? `<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">${this.getNoteFileType(n) || 'file'}</span>` : ''}
                </div>
                <div class="flex flex-wrap gap-2 text-xs mt-3">
                  <button onclick="APP.downloadNote('${n.id}','community')" class="bg-indigo-600 text-white px-3 py-1.5 rounded-full">Download</button>
                  <button onclick="APP.toggleNoteLike('${n.id}','community')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Like</button>
                  <button onclick="APP.openRateNoteModal('${n.id}','community')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Rate</button>
                  <button onclick="APP.openCommentModal('${n.id}','community')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Comment</button>
                </div>
                ${Array.isArray(n.comments) && n.comments.length ? `
                  <div class="mt-3 space-y-2 text-[10px] text-gray-600">
                    ${n.comments.map(c => `<p><span class="font-semibold">${this.escapeHtml(c.author)}:</span> ${this.escapeHtml(c.content)}</p>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('') || '<p class="text-gray-500">No community notes yet.</p>';
          }
        }
      },
      deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.saveAll();
        this.scheduleSync();
        this.renderNotesPage();
        this.renderDashboard();
      },
      async openAddNoteModal() {
        const res = await this.openModal('New Note', [
          { label: 'Title', name: 'title', placeholder: 'Note title' },
          { label: 'Subject', name: 'subject', placeholder: 'e.g., Biology' },
          { label: 'Category (e.g., Lecture/Exam)', name: 'category', placeholder: 'Lecture' },
          { label: 'Tags (comma separated)', name: 'tags', placeholder: 'exam, revision' },
          { label: 'Visibility (public/private)', name: 'visibility', value: 'private' },
          { label: 'Content', name: 'content', placeholder: 'Write something...' }
        ]);
        if (res) {
          const note = {
            id: 'n' + Date.now(),
            title: res.title,
            content: res.content,
            date: Date.now(),
            author: this.userName,
            subject: res.subject || 'General',
            category: res.category || 'General',
            tags: (res.tags || '').split(',').map(t => t.trim()).filter(Boolean),
            visibility: res.visibility === 'public' ? 'public' : 'private',
            downloads: 0,
            likes: 0,
            ratingAvg: 0,
            ratingCount: 0,
            commentsCount: 0
          };
          this.notes.push(note);
          this.saveAll();
          this.scheduleSync();
          this.renderNotesPage();
          this.renderDashboard();
          this.addXP(3, 'note added');
        }
      },
      parseTimeToMinutes(time) {
        if (!time || !time.includes(':')) return 0;
        const [h, m] = time.split(':').map(v => parseInt(v, 10));
        return (h || 0) * 60 + (m || 0);
      },
      getScheduleBaseMonday() {
        const now = new Date();
        const dayIndex = (now.getDay() + 6) % 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayIndex);
        monday.setHours(0, 0, 0, 0);
        return monday;
      },
      buildScheduleEventMeta(event) {
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const baseMonday = this.getScheduleBaseMonday();
        const dayIndex = days.indexOf(event.day);
        const date = new Date(baseMonday);
        date.setDate(baseMonday.getDate() + (dayIndex >= 0 ? dayIndex : 0));
        const time = event.time || '08:00';
        const [h, m] = time.split(':').map(v => parseInt(v, 10));
        date.setHours(h || 0, m || 0, 0, 0);
        const duration = parseInt(event.duration, 10) || 60;
        const startMinutes = this.parseTimeToMinutes(time);
        const endMinutes = startMinutes + duration;
        return {
          ...event,
          time,
          type: event.type || 'Study',
          location: event.location || '',
          duration,
          date,
          dayIndex: dayIndex >= 0 ? dayIndex : 0,
          startMinutes,
          endMinutes
        };
      },
      renderSchedule() {
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const search = (document.getElementById('schedule-search')?.value || '').trim().toLowerCase();
        const typeFilter = document.getElementById('schedule-type-filter')?.value || 'all';
        const dayFilter = document.getElementById('schedule-day-filter')?.value || 'all';
        const sort = document.getElementById('schedule-sort')?.value || 'time';
        const now = new Date();

        const eventsMeta = this.scheduleEvents.map(e => this.buildScheduleEventMeta(e));
        const totalEvents = eventsMeta.length;
        const totalMinutes = eventsMeta.reduce((acc, e) => acc + e.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        const availableMinutes = 7 * 10 * 60;
        const freeHours = Math.max(0, availableMinutes - totalMinutes) / 60;

        const nextEvent = eventsMeta
          .filter(e => e.date >= now)
          .sort((a, b) => a.date - b.date)[0];

        const eventsWeekEl = document.getElementById('schedule-events-week');
        const nextEventEl = document.getElementById('schedule-next-event');
        const nextEventTimeEl = document.getElementById('schedule-next-event-time');
        const totalHoursEl = document.getElementById('schedule-total-hours');
        const freeSlotsEl = document.getElementById('schedule-free-slots');
        if (eventsWeekEl) eventsWeekEl.innerText = totalEvents;
        if (totalHoursEl) totalHoursEl.innerText = totalHours;
        if (freeSlotsEl) freeSlotsEl.innerText = freeHours.toFixed(1);
        if (nextEventEl) nextEventEl.innerText = nextEvent ? this.escapeHtml(nextEvent.title) : '-';
        if (nextEventTimeEl) {
          nextEventTimeEl.innerText = nextEvent
            ? `${nextEvent.day} ${nextEvent.time} (${nextEvent.duration}m)`
            : '-';
        }

        let filtered = [...eventsMeta];
        if (search) {
          filtered = filtered.filter(e => {
            const hay = `${e.title} ${e.location} ${e.type}`.toLowerCase();
            return hay.includes(search);
          });
        }
        if (typeFilter !== 'all') filtered = filtered.filter(e => e.type === typeFilter);
        if (dayFilter !== 'all') filtered = filtered.filter(e => e.day === dayFilter);

        filtered.sort((a, b) => {
          if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
          if (sort === 'duration') return (b.duration || 0) - (a.duration || 0);
          return a.date - b.date;
        });

        const conflictCountEl = document.getElementById('schedule-conflict-count');
        let conflictCount = 0;

        const weekGrid = document.getElementById('schedule-week-grid');
        if (weekGrid) {
          weekGrid.innerHTML = days.map((day, idx) => {
            const dayEvents = filtered.filter(e => e.dayIndex === idx).sort((a, b) => a.startMinutes - b.startMinutes);
            let lastEnd = -1;
            const eventHtml = dayEvents.map(e => {
              const conflict = e.startMinutes < lastEnd;
              if (conflict) conflictCount += 1;
              lastEnd = Math.max(lastEnd, e.endMinutes);
              const tagClass = e.type === 'Exam'
                ? 'bg-red-100 text-red-700'
                : e.type === 'Lecture'
                  ? 'bg-blue-100 text-blue-700'
                  : e.type === 'Project'
                    ? 'bg-amber-100 text-amber-700'
                    : e.type === 'Personal'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-indigo-100 text-indigo-700';
              return `
                <div class="p-3 rounded-xl border ${conflict ? 'border-red-200 bg-red-50/70' : 'border-transparent bg-white/70'}">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-800">${this.escapeHtml(e.title)}</span>
                    <span class="${tagClass} px-2 py-0.5 rounded-full">${e.type}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">${e.time} - ${e.duration}m ${e.location ? `@ ${this.escapeHtml(e.location)}` : ''}</p>
                  <div class="mt-2 flex justify-between text-[10px] text-gray-400">
                    <span>${this.escapeHtml(day)}</span>
                    <button onclick="APP.deleteEvent('${e.id}')" class="text-red-400 hover:text-red-600">Remove</button>
                  </div>
                </div>
              `;
            }).join('') || '<p class="text-xs text-gray-400">No events</p>';
            return `
              <div class="bg-white/60 rounded-xl p-3">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-semibold text-gray-800">${day}</p>
                  <span class="text-xs text-gray-500">${dayEvents.length} events</span>
                </div>
                <div class="space-y-2">${eventHtml}</div>
              </div>
            `;
          }).join('');
        }
        if (conflictCountEl) conflictCountEl.innerText = `${conflictCount} conflicts`;

        const upcomingList = document.getElementById('schedule-upcoming-list');
        if (upcomingList) {
          const upcoming = eventsMeta
            .filter(e => e.date >= now)
            .sort((a, b) => a.date - b.date)
            .slice(0, 6);
          upcomingList.innerHTML = upcoming.map(e => `
            <div class="bg-white/70 rounded-xl p-3">
              <div class="flex items-center justify-between">
                <p class="font-semibold">${this.escapeHtml(e.title)}</p>
                <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${e.type}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">${e.day} ${e.time} - ${e.duration}m</p>
              <p class="text-xs text-gray-500">${e.location || 'No location'}</p>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No upcoming events. Add one!</p>';
        }

        const focusWindowsEl = document.getElementById('schedule-focus-windows');
        if (focusWindowsEl) {
          const todayIndex = (now.getDay() + 6) % 7;
          const todayEvents = eventsMeta.filter(e => e.dayIndex === todayIndex).sort((a, b) => a.startMinutes - b.startMinutes);
          const windows = [];
          let current = 8 * 60;
          const end = 20 * 60;
          todayEvents.forEach(e => {
            if (e.startMinutes - current >= 45) {
              windows.push({ start: current, end: e.startMinutes });
            }
            current = Math.max(current, e.endMinutes);
          });
          if (end - current >= 45) windows.push({ start: current, end });

          const formatGap = (min) => {
            const h = Math.floor(min / 60).toString().padStart(2, '0');
            const m = (min % 60).toString().padStart(2, '0');
            return `${h}:${m}`;
          };
          focusWindowsEl.innerHTML = windows.slice(0, 3).map(w => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${formatGap(w.start)} - ${formatGap(w.end)}</span>
              <span class="text-xs text-gray-500">${Math.round((w.end - w.start) / 60 * 10) / 10} hrs</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No open windows today.</p>';
        }
      },
      addScheduleQuick() {
        const title = document.getElementById('schedule-quick-title')?.value.trim();
        const day = document.getElementById('schedule-quick-day')?.value || 'Mon';
        const time = document.getElementById('schedule-quick-time')?.value || '09:00';
        const type = document.getElementById('schedule-quick-type')?.value || 'Study';
        const duration = parseInt(document.getElementById('schedule-quick-duration')?.value || '60');
        const location = document.getElementById('schedule-quick-location')?.value.trim() || '';

        if (!title) {
          this.showToast('Add a title');
          return;
        }
        this.scheduleEvents.push({
          id: 'e' + Date.now(),
          title,
          day,
          time,
          duration: Math.max(15, duration || 60),
          type,
          location
        });
        document.getElementById('schedule-quick-title').value = '';
        document.getElementById('schedule-quick-time').value = '';
        document.getElementById('schedule-quick-duration').value = '';
        document.getElementById('schedule-quick-location').value = '';
        this.saveAll();
        this.renderSchedule();
        this.renderDashboard();
        this.addXP(2, 'schedule add');
      },
      exportSchedule() {
        if (!this.scheduleEvents.length) {
          this.showToast('No events to export');
          return;
        }
        const header = 'Title,Day,Time,Duration,Type,Location';
        const rows = this.scheduleEvents.map(e => {
          const duration = e.duration || 60;
          return `"${(e.title || '').replace(/\"/g, '""')}","${e.day || ''}","${e.time || ''}","${duration}","${e.type || 'Study'}","${(e.location || '').replace(/\"/g, '""')}"`;
        });
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'smartstudy_schedule.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
        this.showToast('Schedule downloaded');
      },
      syncSchedule() {
        this.showToast('Schedule synced');
      },
      deleteEvent(id) {
        this.scheduleEvents = this.scheduleEvents.filter(e => e.id !== id);
        this.saveAll();
        this.renderSchedule();
        this.renderDashboard();
      },
      async openAddEventModal() {
        const res = await this.openModal('New Event', [
          { label: 'Title', name: 'title', placeholder: 'Study group' },
          { label: 'Day (Mon-Sun)', name: 'day', value: 'Mon' },
          { label: 'Time (HH:MM)', name: 'time', value: '15:00' },
          { label: 'Duration (minutes)', name: 'duration', type: 'number', value: '60' },
          { label: 'Type (Study/Lecture/Exam/Project/Personal)', name: 'type', value: 'Study' },
          { label: 'Location', name: 'location', placeholder: 'Library / Room / Online' }
        ]);
        if (res) {
          this.scheduleEvents.push({
            id: 'e' + Date.now(),
            title: res.title,
            day: res.day,
            time: res.time,
            duration: Math.max(15, parseInt(res.duration, 10) || 60),
            type: res.type || 'Study',
            location: res.location || ''
          });
          this.saveAll();
          this.renderSchedule();
          this.renderDashboard();
        }
      },
      renderStudentLife() {
        const tips = [
          "Take 5 deep breaths",
          "Drink water now",
          "Stretch your neck",
          "Walk for 5 minutes",
          "Listen to lo-fi",
          "2-minute mindfulness",
          "Write down one win from today"
        ];
        const plans = [
          { title: '3-min breathing', detail: 'Box breathing to reset focus', action: 'Start' },
          { title: '10-min stretch', detail: 'Release neck and shoulder tension', action: 'Start' },
          { title: 'Screen break', detail: 'Look 20 feet away for 20 seconds', action: 'Do now' }
        ];
        const events = [
          { title: 'Campus yoga', time: 'Today 5:00 PM', tag: 'Wellness' },
          { title: 'Study buddy mixer', time: 'Wed 6:30 PM', tag: 'Community' },
          { title: 'Sleep hygiene talk', time: 'Fri 4:00 PM', tag: 'Workshop' }
        ];
        const resources = [
          { title: 'Guided breathing', detail: '5-min reset playlist' },
          { title: 'Meal prep ideas', detail: 'Brain fuel for study weeks' },
          { title: 'Sleep tracker', detail: 'Track rest and recovery' }
        ];

        const tipEl = document.getElementById('wellness-daily-tip');
        if (tipEl) tipEl.innerText = tips[Math.floor(Math.random() * tips.length)] + ".";

        const checkins = [...this.wellnessCheckins].sort((a, b) => b.time - a.time);
        const last7 = checkins.slice(0, 7);
        const avg = (key) => {
          if (!last7.length) return 0;
          const sum = last7.reduce((acc, c) => acc + (parseInt(c[key]) || 0), 0);
          return (sum / last7.length).toFixed(1);
        };
        const moodEl = document.getElementById('wellness-mood-avg');
        const energyEl = document.getElementById('wellness-energy-avg');
        const stressEl = document.getElementById('wellness-stress-avg');
        const countEl = document.getElementById('wellness-checkins-count');
        const streakEl = document.getElementById('wellness-streak');
        if (moodEl) moodEl.innerText = avg('mood');
        if (energyEl) energyEl.innerText = avg('energy');
        if (stressEl) stressEl.innerText = avg('stress');
        if (countEl) countEl.innerText = checkins.length;
        if (streakEl) streakEl.innerText = this.calcWellnessStreak();

        const lastCheckinEl = document.getElementById('wellness-last-checkin');
        if (lastCheckinEl) {
          lastCheckinEl.innerText = checkins.length
            ? `Last: ${this.formatShortDate(checkins[0].time)} ${this.formatTime(checkins[0].time)}`
            : 'Last: -';
        }

        const history = document.getElementById('wellness-checkin-history');
        if (history) {
          history.innerHTML = checkins.slice(0, 4).map(c => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.formatShortDate(c.time)} ${this.formatTime(c.time)}</span>
              <span class="text-xs text-gray-500">Mood ${c.mood} | Energy ${c.energy} | Stress ${c.stress}</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No check-ins yet.</p>';
        }

        const planList = document.getElementById('wellness-plan-list');
        if (planList) {
          planList.innerHTML = plans.map(p => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <div>
                <p class="font-medium">${p.title}</p>
                <p class="text-xs text-gray-500">${p.detail}</p>
              </div>
              <button onclick="APP.logWellnessActivity('break')" class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full">${p.action}</button>
            </div>
          `).join('');
        }

        const eventList = document.getElementById('wellness-events-list');
        if (eventList) {
          eventList.innerHTML = events.map(e => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <div>
                <p class="font-medium">${e.title}</p>
                <p class="text-xs text-gray-500">${e.time}</p>
              </div>
              <span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">${e.tag}</span>
            </div>
          `).join('');
        }

        const resourceList = document.getElementById('wellness-resource-list');
        if (resourceList) {
          resourceList.innerHTML = resources.map(r => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <div>
                <p class="font-medium">${r.title}</p>
                <p class="text-xs text-gray-500">${r.detail}</p>
              </div>
              <button onclick="APP.logWellnessActivity('stretch')" class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">Open</button>
            </div>
          `).join('');
        }
      },
      calcWellnessStreak() {
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = this.getDateKey(d);
          const hasCheckin = this.wellnessCheckins.some(c => this.getDateKey(new Date(c.time)) === key);
          if (hasCheckin) streak++;
          else break;
        }
        return streak;
      },
      logWellnessCheckin() {
        const mood = parseInt(document.getElementById('wellness-mood')?.value || '3');
        const energy = parseInt(document.getElementById('wellness-energy')?.value || '3');
        const stress = parseInt(document.getElementById('wellness-stress')?.value || '3');
        const note = document.getElementById('wellness-gratitude')?.value.trim() || '';
        this.wellnessCheckins.push({
          id: 'wc' + Date.now(),
          mood,
          energy,
          stress,
          note,
          time: Date.now()
        });
        if (document.getElementById('wellness-gratitude')) {
          document.getElementById('wellness-gratitude').value = '';
        }
        this.saveAll();
        this.renderStudentLife();
        this.addXP(2, 'wellness check-in');
        this.showToast('Check-in saved');
      },
      logWellnessActivity(type) {
        if (!this.wellnessActivities) this.wellnessActivities = {};
        this.wellnessActivities[type] = (this.wellnessActivities[type] || 0) + 1;
        this.saveAll();
        this.showToast(`${type} logged`);
      },
      // AI Exam Notes Generator
      renderExamGenerator() {
        this.updateExamCreditsUI();
        this.updateExamCostUI();
        this.updateExamJwtUI();
        const output = document.getElementById('exam-notes-output');
        if (output && !output.innerHTML.trim()) {
          output.innerHTML = '<p class="text-gray-500">Generate exam notes to see output here.</p>';
        }
        const apiInput = document.getElementById('exam-api-url');
        if (apiInput) apiInput.value = this.apiUrl || '';
      },
      updateExamCreditsUI() {
        const creditEl = document.getElementById('exam-credit-count');
        if (creditEl) creditEl.innerText = this.examCredits;
      },
      calculateExamCost() {
        const revision = document.getElementById('exam-revision')?.checked;
        const diagrams = document.getElementById('exam-diagrams')?.checked;
        const questions = document.getElementById('exam-questions')?.checked;
        let cost = revision ? 3 : 5;
        if (diagrams) cost += 2;
        if (questions) cost += 1;
        return cost;
      },
      updateExamCostUI() {
        const cost = this.calculateExamCost();
        const costEl = document.getElementById('exam-credit-cost');
        if (costEl) costEl.innerText = cost;
      },
      updateExamJwtUI() {
        const status = this.jwtToken ? 'Active' : 'Guest';
        const shortToken = this.jwtToken ? `${this.jwtToken.slice(0, 10)}...` : '-';
        const statusEl = document.getElementById('exam-jwt-status');
        const tokenEl = document.getElementById('exam-jwt-token');
        const pill = document.getElementById('jwt-status-pill');
        if (statusEl) statusEl.innerText = status;
        if (tokenEl) tokenEl.innerText = shortToken;
        if (pill) {
          pill.innerText = `JWT: ${status}`;
          pill.className = this.jwtToken ? 'bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full' : 'bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full';
        }
        const apiPill = document.getElementById('api-status-pill');
        if (apiPill) {
          const ready = this.apiStatus === 'connected' || this.apiStatus === 'ready';
          apiPill.innerText = `API: ${ready ? 'Ready' : 'Offline'}`;
          apiPill.className = ready ? 'bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full' : 'bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-full';
        }
      },
      signInExam() {
        const email = document.getElementById('exam-login-email')?.value || 'student@smartstudy.ai';
        const pass = document.getElementById('exam-login-pass')?.value || 'password';
        if (!email || !pass) {
          this.showToast('Enter email and password');
          return;
        }
        this.jwtToken = `jwt_${Math.random().toString(36).slice(2, 12)}`;
        this.saveAll();
        this.updateExamJwtUI();
        this.showToast('JWT session active (demo)');
      },
      signOutExam() {
        this.jwtToken = '';
        this.disconnectRealtimeStream();
        this.saveAll();
        this.updateExamJwtUI();
        this.showToast('Signed out');
      },
      testApiConnection() {
        const apiInput = document.getElementById('exam-api-url');
        this.apiUrl = apiInput ? apiInput.value.trim() : this.apiUrl;
        this.apiStatus = this.apiUrl ? 'connected' : 'offline';
        this.saveAll();
        this.updateExamJwtUI();
        this.showToast(this.apiStatus === 'connected' ? 'API connected (demo)' : 'API offline');
      },
      buyCredits(amount) {
        this.examCredits += amount;
        this.saveAll();
        this.updateExamCreditsUI();
        this.showToast(`Credits added: +${amount} (Stripe demo)`);
      },
      getExamTemplates(subject) {
        const templates = {
          Mathematics: {
            concepts: ['Definitions and key identities', 'Step-by-step derivations', 'Common tricks', 'Typical problem patterns'],
            formulas: ['Core formula set', 'Shortcuts and identities', 'Graph behavior summary']
          },
          Physics: {
            concepts: ['Fundamental laws', 'Units and dimensions', 'Free-body analysis', 'Energy and momentum'],
            formulas: ['Key equations', 'Boundary conditions', 'Common approximations']
          },
          Chemistry: {
            concepts: ['Reaction mechanisms', 'Periodic trends', 'Stoichiometry flow', 'Equilibrium basics'],
            formulas: ['Rate laws', 'Equilibrium expressions', 'Thermo relations']
          },
          Biology: {
            concepts: ['Core processes', 'Terminology', 'Diagram labeling', 'Cause and effect'],
            formulas: ['Key pathways', 'Classification cues', 'Rapid recall list']
          },
          'Computer Science': {
            concepts: ['Core definitions', 'Time complexity', 'Data structures', 'Algorithm patterns'],
            formulas: ['Big-O table', 'Recurrence patterns', 'Common optimizations']
          },
          Economics: {
            concepts: ['Demand-supply logic', 'Elasticity', 'Market structures', 'Policy impacts'],
            formulas: ['Key curves', 'Elasticity formulas', 'Macro indicators']
          },
          History: {
            concepts: ['Timeline anchors', 'Key figures', 'Causes and effects', 'Turning points'],
            formulas: ['Short summaries', 'Event comparisons', 'Essay frameworks']
          }
        };
        return templates[subject] || templates.Mathematics;
      },
      buildImportantQuestions(subject, topic) {
        return [
          `Explain ${topic} with a clear example.`,
          `List key definitions related to ${topic}.`,
          `Solve a standard exam question on ${topic}.`,
          `Compare ${topic} with a related concept in ${subject}.`,
          `Write a short answer: why is ${topic} important?`
        ];
      },
      generateExamNotes() {
        if (!this.jwtToken) {
          this.showToast('Sign in to generate notes');
          return;
        }
        const cost = this.calculateExamCost();
        if (this.examCredits < cost) {
          this.showToast('Not enough credits');
          return;
        }
        const classLevel = document.getElementById('exam-class')?.value || 'Class';
        const subject = document.getElementById('exam-subject')?.value || 'Subject';
        const topic = document.getElementById('exam-topic')?.value || 'General topic';
        const examType = document.getElementById('exam-type')?.value || 'Exam';
        const outputType = document.getElementById('exam-output')?.value || 'outline';
        const revision = document.getElementById('exam-revision')?.checked;
        const diagrams = document.getElementById('exam-diagrams')?.checked;
        const questions = document.getElementById('exam-questions')?.checked;

        this.examCredits -= cost;
        this.saveAll();
        this.updateExamCreditsUI();
        this.updateExamCostUI();

        const template = this.getExamTemplates(subject);
        const concepts = template.concepts;
        const formulas = template.formulas;
        const importantQ = this.buildImportantQuestions(subject, topic);
        const timeStr = new Date().toLocaleString('en-GB');
        const listHtml = (items) => items.map(i => `<li>${this.escapeHtml(i)}</li>`).join('');

        let body = '';
        if (outputType === 'qa') {
          body += `<h4 class="font-semibold">Quick Q&A</h4><ul class="list-disc ml-5">${listHtml(importantQ)}</ul>`;
        } else {
          body += `<h4 class="font-semibold">Key concepts</h4><ul class="list-disc ml-5">${listHtml(concepts)}</ul>`;
          body += `<h4 class="font-semibold mt-3">Formulas / frameworks</h4><ul class="list-disc ml-5">${listHtml(formulas)}</ul>`;
        }

        if (revision) {
          body += `<div class="mt-3 bg-amber-50/70 rounded-xl p-3"><p class="text-xs font-semibold text-amber-700">Revision mode</p><ul class="list-disc ml-5 text-sm">${listHtml(concepts.slice(0, 3))}</ul></div>`;
        }
        if (questions) {
          body += `<h4 class="font-semibold mt-3">Important questions</h4><ol class="list-decimal ml-5">${listHtml(importantQ)}</ol>`;
        }

        let diagramHtml = '';
        let chartId = '';
        if (diagrams) {
          chartId = `exam-chart-${Date.now()}`;
          diagramHtml = `
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white/80 rounded-xl p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">Concept flow</p>
                <svg viewBox="0 0 240 120" class="w-full h-28">
                  <rect x="10" y="20" width="70" height="30" rx="6" fill="#e0e7ff"></rect>
                  <rect x="85" y="70" width="70" height="30" rx="6" fill="#c7d2fe"></rect>
                  <rect x="160" y="20" width="70" height="30" rx="6" fill="#a5b4fc"></rect>
                  <line x1="80" y1="35" x2="160" y2="35" stroke="#6366f1" stroke-width="2"></line>
                  <line x1="120" y1="50" x2="120" y2="70" stroke="#6366f1" stroke-width="2"></line>
                  <text x="18" y="40" font-size="10" fill="#1f2937">Theory</text>
                  <text x="96" y="90" font-size="10" fill="#1f2937">Example</text>
                  <text x="168" y="40" font-size="10" fill="#1f2937">Exam Q</text>
                </svg>
              </div>
              <div class="bg-white/80 rounded-xl p-3">
                <p class="text-xs text-gray-500 uppercase tracking-wider">Topic weightage</p>
                <canvas id="${chartId}" height="120"></canvas>
              </div>
            </div>
          `;
        }

        const header = `
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-lg font-bold">${this.escapeHtml(subject)} - ${this.escapeHtml(topic)}</h3>
              <p class="text-xs text-gray-500">${this.escapeHtml(classLevel)} - ${this.escapeHtml(examType)}</p>
            </div>
            <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">AI generated</span>
          </div>
          <p class="text-[10px] text-gray-500">Generated: ${timeStr}</p>
        `;

        const output = document.getElementById('exam-notes-output');
        const html = `${header}<div class="mt-3 space-y-3">${body}</div>${diagramHtml}`;
        if (output) output.innerHTML = html;
        this.lastExamNotes = `${subject} - ${topic}\\n${concepts.join(', ')}`;

        if (diagrams && chartId) {
          if (this.examChart) this.examChart.destroy();
          const ctx = document.getElementById(chartId).getContext('2d');
          this.examChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Basics', 'Examples', 'Problems', 'Revision'],
              datasets: [{ data: [25, 30, 30, 15], backgroundColor: ['#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1'] }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
          });
        }
      },
      saveExamNotesToNotes() {
        const output = document.getElementById('exam-notes-output');
        if (!output || !output.innerText.trim()) {
          this.showToast('Generate notes first');
          return;
        }
        this.notes.push({
          id: 'n' + Date.now(),
          title: 'Exam Notes',
          content: output.innerText.trim(),
          date: Date.now(),
          author: this.userName,
          subject: 'Exam',
          category: 'Exam',
          tags: ['exam', 'revision'],
          visibility: 'private',
          downloads: 0,
          likes: 0,
          ratingAvg: 0,
          ratingCount: 0,
          commentsCount: 0
        });
        this.saveAll();
        this.renderNotesPage();
        this.addXP(5, 'exam notes saved');
        this.showToast('Exam notes saved to notes');
      },
      generateAITest() {
        const subject = document.getElementById('ai-subject')?.value || 'Calculus';
        const count = parseInt(document.getElementById('ai-question-count')?.value || '5');
        const qbank = { 
          'Calculus': ['Derivative of x^2?', 'Integral of 2x dx?', 'Limit of sin(x)/x', 'Chain rule example', 'Product rule', 'Optimization steps'],
          'Linear Algebra': ['Eigenvector definition', 'Rank of matrix', 'Dot product', 'Inverse of 2x2', 'Span concept', 'Orthogonal projection'],
          'Physics': ['Newton second law', "Ohm's law", 'Kinetic energy', "Snell's law", 'Photon energy', 'Momentum'],
          'CS: Algorithms': ['Time complexity of merge sort', 'BFS vs DFS', 'Dynamic programming', 'Hash table collision', 'Binary search', 'Dijkstra']
        };
        let questions = qbank[subject] || qbank['Calculus'];
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, count);
        const html = questions.map((q,i) => `<div class="p-3 bg-white rounded-xl shadow-sm"><span class="font-semibold text-indigo-600">Q${i+1}:</span> ${q}</div>`).join('');
        document.getElementById('ai-test-output').innerHTML = html + '<p class="text-xs text-indigo-500 mt-3">AI-generated (smart bank)</p>';
        this.addXP(2, 'test generation');
      },
      renderStudyRooms() {
        if (!this.currentRoom) this.currentRoom = this.studyRooms[0];
        const list = document.getElementById('rooms-list');
        if (!list) return;
        const search = (document.getElementById('rooms-search')?.value || '').trim().toLowerCase();
        const filter = document.getElementById('rooms-filter')?.value || 'all';
        const sort = document.getElementById('rooms-sort')?.value || 'activity';
        let rooms = [...this.studyRooms];

        if (search) {
          rooms = rooms.filter(r => {
            const hay = `${r.name} ${r.topic} ${(r.tags || []).join(' ')}`.toLowerCase();
            return hay.includes(search);
          });
        }
        if (filter !== 'all') {
          rooms = rooms.filter(r => (r.tags || []).includes(filter) || (r.topic || '').toLowerCase().includes(filter));
        }

        const lastActivity = (room) => {
          const last = room.messages && room.messages.length ? room.messages[room.messages.length - 1].time : 0;
          return last || 0;
        };
        rooms.sort((a, b) => {
          if (sort === 'members') return (b.members || 0) - (a.members || 0);
          if (sort === 'name') return (a.name || '').localeCompare(b.name || '');
          return lastActivity(b) - lastActivity(a);
        });

        list.innerHTML = rooms.map(r => {
          const isActive = this.currentRoom && r.id === this.currentRoom.id;
          const lastTime = lastActivity(r);
          const timeLabel = lastTime ? this.formatTime(lastTime) : '-';
          const levelClass = r.level === 'Advanced'
            ? 'bg-purple-100 text-purple-700'
            : r.level === 'Intermediate'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-emerald-100 text-emerald-700';
          return `
            <div onclick="APP.setCurrentRoom('${r.id}')" class="p-3 rounded-xl cursor-pointer transition border ${isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-white/60 border-transparent hover:bg-indigo-50'}">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-gray-800">#${r.name}</span>
                <span class="text-xs bg-gray-200 px-2 py-0.5 rounded-full">${r.members || 0}</span>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                <span class="${levelClass} px-2 py-0.5 rounded-full">${r.level || 'Beginner'}</span>
                <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">${r.topic || 'General'}</span>
                <span class="text-gray-400">Last: ${timeLabel}</span>
              </div>
            </div>
          `;
        }).join('') || '<p class="text-sm text-gray-500">No rooms found.</p>';
        this.updateRoomChatUI();
      },
      setCurrentRoom(roomId) {
        this.currentRoom = this.studyRooms.find(r => r.id === roomId) || this.studyRooms[0];
        this.updateRoomChatUI();
        this.renderStudyRooms();
      },
      toggleRoomJoin() {
        if (!this.currentRoom) return;
        const room = this.currentRoom;
        if (room.joined) {
          room.joined = false;
          room.members = Math.max(0, (room.members || 0) - 1);
          room.membersList = (room.membersList || []).filter(n => n !== this.userName);
          this.showToast('Left room');
        } else {
          room.joined = true;
          room.members = (room.members || 0) + 1;
          if (!room.membersList) room.membersList = [];
          if (!room.membersList.includes(this.userName)) room.membersList.push(this.userName);
          this.showToast('Joined room');
        }
        this.recordLiveEvent(room.joined ? 'Joined study room' : 'Left study room', `#${room.name}`, 'room');
        this.saveAll();
        this.updateRoomChatUI();
        this.renderStudyRooms();
      },
      updateRoomChatUI() {
        if (!this.currentRoom) return;
        const room = this.currentRoom;
        const header = document.getElementById('current-room-header');
        const desc = document.getElementById('current-room-desc');
        const topic = document.getElementById('current-room-topic');
        const level = document.getElementById('current-room-level');
        const joinBtn = document.getElementById('room-join-btn');
        if (header) header.innerHTML = `#${room.name} - ${room.members || 0} members`;
        if (desc) desc.innerText = room.description || 'Study together and stay accountable.';
        if (topic) topic.innerText = room.topic || 'General';
        if (level) level.innerText = room.level || 'Beginner';
        if (joinBtn) joinBtn.innerText = room.joined ? 'Leave' : 'Join';

        const msgDiv = document.getElementById('room-messages');
        if (msgDiv) {
          msgDiv.innerHTML = (room.messages || []).map(m => {
            const isMe = m.sender === this.userName;
            const time = m.time ? this.formatTime(m.time) : '';
            return `
              <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                <div class="${isMe ? 'bg-indigo-600 text-white' : 'bg-white/80 text-gray-700'} rounded-2xl px-3 py-2 max-w-[70%] shadow-sm">
                  <p class="text-[10px] opacity-70">${this.escapeHtml(m.sender)} - ${time}</p>
                  <p class="text-sm">${this.escapeHtml(m.text)}</p>
                </div>
              </div>
            `;
          }).join('') || '<p class="text-sm text-gray-500">No messages yet. Start the conversation.</p>';
          msgDiv.scrollTop = msgDiv.scrollHeight;
        }

        const todayKey = this.getDateKey();
        const messagesToday = (room.messages || []).filter(m => this.getDateKey(new Date(m.time)) === todayKey).length;
        const activeMembers = new Set((room.messages || []).filter(m => this.getDateKey(new Date(m.time)) === todayKey).map(m => m.sender)).size;
        const msgTodayEl = document.getElementById('room-messages-today');
        const activeEl = document.getElementById('room-active-members');
        if (msgTodayEl) msgTodayEl.innerText = messagesToday;
        if (activeEl) activeEl.innerText = activeMembers || (room.membersList ? room.membersList.length : 0);

        const membersList = document.getElementById('room-members-list');
        if (membersList) {
          const list = room.membersList || [];
          membersList.innerHTML = list.map(n => `
            <div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
              <span>${this.escapeHtml(n)}</span>
              <span class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">online</span>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">No members yet.</p>';
        }

        const pinsList = document.getElementById('room-pins-list');
        if (pinsList) {
          const pins = room.pins || [];
          pinsList.innerHTML = pins.map(p => `
            <div class="bg-white/70 rounded-xl px-3 py-2">
              <p class="text-xs text-gray-500">${this.formatShortDate(p.time || Date.now())}</p>
              <p class="text-sm">${this.escapeHtml(p.text)}</p>
            </div>
          `).join('') || '<p class="text-sm text-gray-500">Pin a highlight to keep it visible.</p>';
        }
        this.updateRealtimeUI();
      },
      pinLastMessage() {
        if (!this.currentRoom) return;
        const room = this.currentRoom;
        if (!room.messages || !room.messages.length) {
          this.showToast('No messages to pin');
          return;
        }
        const last = room.messages[room.messages.length - 1];
        if (!room.pins) room.pins = [];
        room.pins.unshift({ text: `${last.sender}: ${last.text}`, time: Date.now() });
        room.pins = room.pins.slice(0, 5);
        this.saveAll();
        this.recordLiveEvent('Pinned room highlight', `#${room.name}`, 'room');
        this.updateRoomChatUI();
        this.showToast('Pinned latest message');
      },
      sendRoomMessage() {
        const inp = document.getElementById('room-message-input');
        if (!inp || !inp.value.trim()) return;
        if (!this.currentRoom) return;
        if (!this.currentRoom.joined) {
          this.showToast('Join the room to chat');
          return;
        }
        this.currentRoom.messages.push({ sender: this.userName, text: inp.value.trim(), time: Date.now() });
        this.recordLiveEvent('Room message sent', `#${this.currentRoom.name}: ${inp.value.trim()}`, 'room');
        inp.value = '';
        this.updateRoomChatUI();
        this.addXP(1, 'room chat');
      },
      async createStudyRoom() {
        const res = await this.openModal('Create Study Room', [
          { label: 'Room name', name: 'name', placeholder: 'e.g., calculus-sprint' },
          { label: 'Topic', name: 'topic', placeholder: 'e.g., Calculus' },
          { label: 'Level (Beginner/Intermediate/Advanced)', name: 'level', value: 'Beginner' },
          { label: 'Description', name: 'description', placeholder: 'Short purpose of the room' },
          { label: 'Tags (comma separated)', name: 'tags', placeholder: 'focus, exam' }
        ]);
        if (res && res.name) {
          const tags = (res.tags || '').split(',').map(t => t.trim()).filter(Boolean);
          const room = {
            id: 'r' + Date.now(),
            name: res.name,
            topic: res.topic || 'General',
            level: res.level || 'Beginner',
            description: res.description || 'Study together and stay accountable.',
            tags,
            joined: true,
            members: 1,
            membersList: [this.userName],
            pins: [],
            messages: []
          };
          this.studyRooms.push(room);
          this.currentRoom = room;
          this.saveAll();
          this.recordLiveEvent('Study room created', `#${room.name}`, 'room');
          this.renderStudyRooms();
          this.showToast('Room created');
        }
      },
      toggleQuickChat() { document.getElementById('quickChatPanel').classList.toggle('hidden'); },
      quickChatSend() {
        const inp = document.getElementById('quickChatInput');
        const msg = inp.value.trim(); if(!msg) return;
        const chatDiv = document.getElementById('quickChatMessages');
        chatDiv.innerHTML += `<div class="bg-indigo-100 p-2 rounded-xl self-end text-right">${msg}</div>`;
        inp.value = '';
        setTimeout(() => chatDiv.innerHTML += `<div class="bg-gray-100 p-2 rounded-xl">I'm here to help!</div>`, 400);
        chatDiv.scrollTop = chatDiv.scrollHeight;
      },
      // Command palette
      openCommandPalette() {
        const overlay = document.getElementById('commandPalette');
        overlay.classList.add('active');
        const input = document.getElementById('command-input');
        input.value = '';
        input.focus();
        this.updateCommandResults('');
      },
      closeCommandPalette() {
        document.getElementById('commandPalette').classList.remove('active');
      },
      buildCommandResults(query) {
        const q = query.trim().toLowerCase();
        const results = [];
        const add = (label, hint, action) => results.push({ label, hint, action });
        const pages = [
          { id: 'welcome', label: 'Welcome' },
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'tasks', label: 'Tasks' },
          { id: 'assignments', label: 'Assignments' },
          { id: 'notes', label: 'Notes' },
          { id: 'focus', label: 'Focus' },
          { id: 'habits', label: 'Habits' },
          { id: 'flashcards', label: 'Flashcards' },
          { id: 'study-rooms', label: 'Study Rooms' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'profile', label: 'Profile' }
        ];
        pages.forEach(p => {
          if (!q || p.label.toLowerCase().includes(q)) {
            add(`Go to ${p.label}`, 'Page', () => this.showPage(p.id));
          }
        });
        if (!q || 'new task'.includes(q)) add('Create new task', 'Action', () => this.openAddTaskModal());
        if (!q || 'new note'.includes(q)) add('Create new note', 'Action', () => this.openAddNoteModal());
        if (!q || 'start timer'.includes(q)) add('Start focus timer', 'Action', () => this.startTimer());
        if (!q || 'focus mode'.includes(q)) add('Toggle focus mode', 'Action', () => this.toggleFocusMode());
        if (!q || 'new habit'.includes(q)) add('Create new habit', 'Action', () => this.openAddHabitModal());
        if (q) {
          this.tasks.filter(t => t.title.toLowerCase().includes(q)).slice(0, 4).forEach(t => {
            add(`Task: ${t.title}`, `Due ${t.due}`, () => this.showPage('tasks'));
          });
          this.notes.filter(n => n.title.toLowerCase().includes(q)).slice(0, 4).forEach(n => {
            add(`Note: ${n.title}`, 'Open notes', () => this.showPage('notes'));
          });
          this.assignments.filter(a => a.name.toLowerCase().includes(q)).slice(0, 4).forEach(a => {
            add(`Assignment: ${a.name}`, `Due ${a.due}`, () => this.showPage('assignments'));
          });
          this.courses.filter(c => c.name.toLowerCase().includes(q)).slice(0, 4).forEach(c => {
            add(`Course: ${c.name}`, c.code || 'Course', () => this.showPage('courses'));
          });
        }
        return results.slice(0, 12);
      },
      updateCommandResults(query) {
        this.commandResults = this.buildCommandResults(query);
        this.commandIndex = 0;
        this.renderCommandResults();
      },
      renderCommandResults() {
        const container = document.getElementById('command-results');
        if (!this.commandResults.length) {
          container.innerHTML = '<p class="text-gray-500 text-sm px-3 py-2">No matches found.</p>';
          return;
        }
        container.innerHTML = this.commandResults.map((r, i) => `
          <div class="command-item ${i === this.commandIndex ? 'active' : ''}" onclick="APP.runCommand(${i})">
            <div>
              <p class="text-sm font-medium text-gray-800">${r.label}</p>
              <p class="text-xs text-gray-500">${r.hint}</p>
            </div>
            <span class="text-[10px] text-gray-400">Enter</span>
          </div>
        `).join('');
      },
      runCommand(index) {
        const item = this.commandResults[index];
        if (!item) return;
        this.closeCommandPalette();
        setTimeout(() => item.action(), 50);
      },
      setupCommandPalette() {
        const input = document.getElementById('command-input');
        if (!input) return;
        input.addEventListener('input', () => this.updateCommandResults(input.value));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.commandIndex = Math.min(this.commandIndex + 1, this.commandResults.length - 1);
            this.renderCommandResults();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.commandIndex = Math.max(this.commandIndex - 1, 0);
            this.renderCommandResults();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            this.runCommand(this.commandIndex);
          } else if (e.key === 'Escape') {
            this.closeCommandPalette();
          }
        });
        document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            this.openCommandPalette();
          } else if (e.key === 'Escape') {
            const overlay = document.getElementById('commandPalette');
            if (overlay.classList.contains('active')) this.closeCommandPalette();
          }
        });
      },
      renderAnalytics() {
        if (this.xpChart) this.xpChart.destroy();
        if (this.taskChart) this.taskChart.destroy();
        if (this.focusChart) this.focusChart.destroy();
        if (this.habitChart) this.habitChart.destroy();

        const today = new Date();
        const dayMs = 24 * 60 * 60 * 1000;
        const labels = [];
        const xpValues = [];
        const focusValues = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today.getTime() - i * dayMs);
          const key = d.toDateString();
          labels.push(d.toLocaleDateString('en-GB', { weekday: 'short' }));
          xpValues.push(this.dailyXP[key] || 0);
          const focusMin = this.focusSessions
            .filter(s => this.getDateKey(new Date(s.endedAt)) === key)
            .reduce((acc, s) => acc + s.duration, 0);
          focusValues.push(focusMin);
        }

        const ctx = document.getElementById('xpChart').getContext('2d');
        this.xpChart = new Chart(ctx, {
          type: 'line',
          data: { labels, datasets: [{ label: 'XP earned', data: xpValues, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.15)', tension: 0.35, fill: true }] },
          options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });

        const completedTasks = this.tasks.filter(t => t.completed).length;
        const pendingTasks = this.tasks.filter(t => !t.completed).length;
        const ctx2 = document.getElementById('taskChart').getContext('2d');
        this.taskChart = new Chart(ctx2, {
          type: 'doughnut',
          data: { labels: ['Completed','Pending'], datasets: [{ data: [completedTasks, pendingTasks], backgroundColor: ['#4f46e5','#e5e7eb'] }] },
          options: { plugins: { legend: { position: 'bottom' } } }
        });

        const ctx3 = document.getElementById('focusChart').getContext('2d');
        this.focusChart = new Chart(ctx3, {
          type: 'bar',
          data: { labels, datasets: [{ label: 'Focus (min)', data: focusValues, backgroundColor: '#10b981' }] },
          options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });

        const habitLabels = (this.habits || []).map(h => h.title).slice(0, 5);
        const habitData = (this.habits || []).slice(0, 5).map(h => this.calcHabitStreak(h));
        const ctx4 = document.getElementById('habitChart').getContext('2d');
        this.habitChart = new Chart(ctx4, {
          type: 'bar',
          data: { labels: habitLabels, datasets: [{ label: 'Streak (days)', data: habitData, backgroundColor: '#6366f1' }] },
          options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });

        const todayKey = this.getDateKey();
        const xpToday = this.dailyXP[todayKey] || 0;
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);
        const xpWeek = Object.keys(this.dailyXP).reduce((acc, key) => {
          const d = new Date(key);
          if (d >= weekStart) acc += this.dailyXP[key] || 0;
          return acc;
        }, 0);
        const goalDays = Object.values(this.dailyXP).filter(xp => xp >= this.dailyGoal).length;
        const focusWeek = focusValues.reduce((a, b) => a + b, 0);

        document.getElementById('analytics-xp-today').innerText = xpToday;
        document.getElementById('analytics-xp-week').innerText = xpWeek;
        document.getElementById('analytics-focus-week').innerText = focusWeek;
        document.getElementById('analytics-goal-days').innerText = goalDays;
        document.getElementById('analytics-xp-range').innerText = `${labels[0]} - ${labels[labels.length - 1]}`;

        document.getElementById('total-tasks-done').innerText = completedTasks;
        document.getElementById('analytics-tasks-pending').innerText = pendingTasks;
        document.getElementById('total-focus-hours').innerText = (focusWeek / 60).toFixed(1);
        document.getElementById('total-tasks-done-dup').innerText = completedTasks;
        document.getElementById('streak-count').innerText = localStorage.getItem('streak') || 5;

        const skillList = document.getElementById('analytics-skill-list');
        const skills = (this.userSkills || []).slice(0, 6);
        if (skillList) {
          skillList.innerHTML = skills.length
            ? skills.map(s => `<div class="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2"><span>${this.escapeHtml(s)}</span><span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">active</span></div>`).join('')
            : '<p class="text-gray-500">Add skills in Profile to see insights.</p>';
        }
      },
      async openEditProfileModal() {
        const container = document.getElementById('modalFields');
        const modalBox = document.querySelector('#advancedModal .modal-container');
        const confirmBtn = document.getElementById('modalConfirmBtn');
        const currentSkills = (this.userSkills || []).join(', ');
        const safe = (value) => this.escapeHtml(value || '');

        if (modalBox) modalBox.style.maxWidth = '760px';
        document.getElementById('modalTitle').innerText = 'Edit Profile';
        if (confirmBtn) confirmBtn.innerText = 'Save profile';
        container.innerHTML = `
          <div class="profile-edit-shell">
            <div class="profile-edit-summary">
              <div class="profile-edit-avatar" id="profile-edit-avatar">${this.getProfileInitials()}</div>
              <div>
                <strong id="profile-edit-preview-name">${safe(this.userName || 'Student')}</strong>
                <span id="profile-edit-preview-line">${safe(this.userEmail || 'No email yet')}</span>
              </div>
            </div>
            <div class="profile-edit-grid">
              <div class="profile-edit-field">
                <label for="profile-edit-name">Full name</label>
                <input id="profile-edit-name" type="text" autocomplete="name" value="${safe(this.userName)}" placeholder="Your full name">
                <p class="profile-edit-error" id="profile-edit-error-name"></p>
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-email">Email</label>
                <input id="profile-edit-email" type="email" autocomplete="email" value="${safe(this.userEmail)}" placeholder="you@example.com">
                <p class="profile-edit-error" id="profile-edit-error-email"></p>
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-mobile">Mobile</label>
                <input id="profile-edit-mobile" type="tel" autocomplete="tel" value="${safe(this.userMobile)}" placeholder="+91 98765 43210">
                <p class="profile-edit-error" id="profile-edit-error-mobile"></p>
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-timezone">Timezone</label>
                <input id="profile-edit-timezone" type="text" value="${safe(this.userTimeZone || 'Asia/Kolkata')}" placeholder="Asia/Kolkata">
                <p class="profile-edit-error" id="profile-edit-error-timeZone"></p>
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-college">College / University</label>
                <input id="profile-edit-college" type="text" value="${safe(this.userCollege)}" placeholder="College or university">
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-course">Course / Class</label>
                <input id="profile-edit-course" type="text" value="${safe(this.userCourse)}" placeholder="B.Tech, Class 12, MBA">
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-year">Year</label>
                <input id="profile-edit-year" type="text" value="${safe(this.userYear)}" placeholder="2nd year">
              </div>
              <div class="profile-edit-field">
                <label for="profile-edit-branch">Branch / Stream</label>
                <input id="profile-edit-branch" type="text" value="${safe(this.userBranch)}" placeholder="CSE, Commerce, Science">
              </div>
              <div class="profile-edit-field full">
                <label for="profile-edit-skills">Skills</label>
                <textarea id="profile-edit-skills" placeholder="JavaScript, Algebra, Physics, Communication">${safe(currentSkills)}</textarea>
                <p class="profile-edit-help">Separate skills with commas. Duplicates are removed and the first 12 are saved.</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Skill preview</label>
              <div id="profile-edit-skill-preview" class="profile-edit-preview"></div>
            </div>
          </div>
        `;
        document.getElementById('advancedModal').style.display = 'flex';

        const readDraft = () => ({
          name: document.getElementById('profile-edit-name')?.value.trim() || '',
          email: document.getElementById('profile-edit-email')?.value.trim() || '',
          mobile: document.getElementById('profile-edit-mobile')?.value.trim() || '',
          timeZone: document.getElementById('profile-edit-timezone')?.value.trim() || 'UTC',
          college: document.getElementById('profile-edit-college')?.value.trim() || '',
          course: document.getElementById('profile-edit-course')?.value.trim() || '',
          year: document.getElementById('profile-edit-year')?.value.trim() || '',
          branch: document.getElementById('profile-edit-branch')?.value.trim() || '',
          skills: document.getElementById('profile-edit-skills')?.value || ''
        });
        const renderErrors = (errors = {}) => {
          ['name', 'email', 'mobile', 'timeZone'].forEach(key => {
            const el = document.getElementById(`profile-edit-error-${key}`);
            if (el) el.innerText = errors[key] || '';
          });
        };
        const renderPreview = () => {
          const draft = readDraft();
          const skills = this.parseProfileSkills(draft.skills);
          const avatar = document.getElementById('profile-edit-avatar');
          const previewName = document.getElementById('profile-edit-preview-name');
          const previewLine = document.getElementById('profile-edit-preview-line');
          const skillPreview = document.getElementById('profile-edit-skill-preview');
          if (avatar) avatar.innerText = this.getProfileInitials(draft.name);
          if (previewName) previewName.innerText = draft.name || 'Student';
          if (previewLine) previewLine.innerText = [draft.email, draft.course, draft.branch].filter(Boolean).join(' - ') || 'Profile preview';
          if (skillPreview) {
            skillPreview.innerHTML = skills.length
              ? skills.map(skill => `<span>${this.escapeHtml(skill)}</span>`).join('')
              : '<p class="profile-edit-help">No skills added yet.</p>';
          }
        };

        ['profile-edit-name', 'profile-edit-email', 'profile-edit-mobile', 'profile-edit-timezone', 'profile-edit-college', 'profile-edit-course', 'profile-edit-year', 'profile-edit-branch', 'profile-edit-skills']
          .forEach(id => document.getElementById(id)?.addEventListener('input', () => {
            renderErrors();
            renderPreview();
          }));
        renderPreview();

        confirmBtn.onclick = () => {
          const draft = readDraft();
          const errors = this.validateProfileDraft(draft);
          if (Object.keys(errors).length) {
            renderErrors(errors);
            this.showToast('Please fix profile details');
            return;
          }

          this.userName = draft.name;
          this.userEmail = draft.email;
          this.userMobile = draft.mobile;
          this.userTimeZone = draft.timeZone || 'UTC';
          this.userCollege = draft.college;
          this.userCourse = draft.course;
          this.userYear = draft.year;
          this.userBranch = draft.branch;
          this.userSkills = this.parseProfileSkills(draft.skills);

          this.closeModal();
          this.saveAll();
          this.updateXPUI();
          const profilePage = document.getElementById('page-profile');
          if (profilePage && !profilePage.classList.contains('hidden')) this.renderProfile();
          const coursesPage = document.getElementById('page-courses');
          if (coursesPage && !coursesPage.classList.contains('hidden')) this.renderCoursesPage();
          this.renderChatSidebar();
          this.recordLiveEvent('Profile updated', 'Identity, academic details, and skills refreshed.', 'sync');
          this.showToast('Profile updated');
        };
      },
      async openWhatsAppSettingsModal() {
        const container = document.getElementById('modalFields');
        document.getElementById('modalTitle').innerText = 'WhatsApp Automation';
        container.innerHTML = `
          <div class="space-y-4">
            <label class="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-gray-700">
              <input id="wa-optin" type="checkbox" class="rounded" ${this.whatsappOptIn ? 'checked' : ''}>
              Enable advanced WhatsApp reminders
            </label>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
              <input id="wa-number" type="text" class="w-full bg-white/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" placeholder="+1 555 123 4567" value="${this.escapeHtml(this.whatsappNumber || '')}">
              <p class="text-xs text-gray-500 mt-1">Leave empty to use your profile mobile number.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <input id="wa-timezone" type="text" class="w-full bg-white/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" placeholder="Asia/Kolkata" value="${this.escapeHtml(this.userTimeZone || 'UTC')}">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reminder lead (minutes)</label>
                <input id="wa-lead" type="number" min="5" max="1440" class="w-full bg-white/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" value="${this.whatsappReminderLeadMinutes}">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Daily digest time</label>
                <input id="wa-digest-time" type="time" class="w-full bg-white/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" value="${this.whatsappDailyDigestTime}">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quiet hours</label>
                <div class="grid grid-cols-2 gap-2">
                  <input id="wa-quiet-start" type="time" class="w-full bg-white/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" value="${this.whatsappQuietHoursStart}">
                  <input id="wa-quiet-end" type="time" class="w-full bg-white/70 border-0 rounded-xl p-3 shadow-sm focus:ring-2 ring-indigo-300" value="${this.whatsappQuietHoursEnd}">
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <label class="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2"><input id="wa-digest" type="checkbox" class="rounded" ${this.whatsappDailyDigest ? 'checked' : ''}>Daily digest</label>
              <label class="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2"><input id="wa-task-alerts" type="checkbox" class="rounded" ${this.whatsappTaskAlerts ? 'checked' : ''}>Task alerts</label>
              <label class="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2"><input id="wa-assignment-alerts" type="checkbox" class="rounded" ${this.whatsappAssignmentAlerts ? 'checked' : ''}>Assignment alerts</label>
              <label class="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2"><input id="wa-schedule-alerts" type="checkbox" class="rounded" ${this.whatsappScheduleAlerts ? 'checked' : ''}>Schedule alerts</label>
              <label class="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2"><input id="wa-focus-alerts" type="checkbox" class="rounded" ${this.whatsappFocusAlerts ? 'checked' : ''}>Focus nudges</label>
            </div>
          </div>
        `;
        document.getElementById('advancedModal').style.display = 'flex';
        document.getElementById('modalConfirmBtn').onclick = async () => {
          const optIn = !!document.getElementById('wa-optin')?.checked;
          const whatsappNumber = document.getElementById('wa-number')?.value.trim() || '';
          const timeZone = document.getElementById('wa-timezone')?.value.trim() || 'UTC';
          const lead = parseInt(document.getElementById('wa-lead')?.value || '120', 10);
          const digestTime = document.getElementById('wa-digest-time')?.value || '18:00';
          const quietStart = document.getElementById('wa-quiet-start')?.value || '22:00';
          const quietEnd = document.getElementById('wa-quiet-end')?.value || '07:00';
          const hasNumber = !!(whatsappNumber || this.userMobile);
          const isTimeValue = (value) => /^\d{2}:\d{2}$/.test(value);

          if (optIn && !hasNumber) {
            this.showToast('Add a mobile or WhatsApp number with country code first');
            return;
          }
          if (!Number.isFinite(lead) || lead < 5 || lead > 1440) {
            this.showToast('Reminder lead must be between 5 and 1440 minutes');
            return;
          }
          if (![digestTime, quietStart, quietEnd].every(isTimeValue)) {
            this.showToast('Use valid times for digest and quiet hours');
            return;
          }

          this.whatsappOptIn = optIn;
          this.whatsappNumber = whatsappNumber;
          this.userTimeZone = timeZone;
          this.whatsappReminderLeadMinutes = lead;
          this.whatsappDailyDigest = !!document.getElementById('wa-digest')?.checked;
          this.whatsappTaskAlerts = !!document.getElementById('wa-task-alerts')?.checked;
          this.whatsappAssignmentAlerts = !!document.getElementById('wa-assignment-alerts')?.checked;
          this.whatsappScheduleAlerts = !!document.getElementById('wa-schedule-alerts')?.checked;
          this.whatsappFocusAlerts = !!document.getElementById('wa-focus-alerts')?.checked;
          this.whatsappDailyDigestTime = digestTime;
          this.whatsappQuietHoursStart = quietStart;
          this.whatsappQuietHoursEnd = quietEnd;
          this.closeModal();
          this.saveAll({ sync: false });
          if (this.jwtToken) await this.syncToServer();
          this.renderProfile();
          this.showToast('WhatsApp automation updated');
        };
      },
      async runWhatsAppCommand(action) {
        if (!this.jwtToken) {
          this.showToast('Sign in to use WhatsApp automation');
          return null;
        }
        try {
          const res = await this.apiFetch('/sync', {
            method: 'POST',
            body: JSON.stringify({
              whatsappCommand: {
                action,
                scope: 'self',
                force: true
              }
            })
          });
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            this.showToast(data?.error || 'WhatsApp request failed');
            return null;
          }
          this.applyServerData(data, { replaceEmpty: true });
          const summary = data?.whatsapp || null;
          if (summary) {
            if (summary.sent > 0) this.showToast(`WhatsApp ${action} sent`);
            else if (summary.duplicates > 0) this.showToast('WhatsApp already sent recently');
            else this.showToast(summary.reason === 'no_jobs' ? 'No WhatsApp alerts are due right now' : 'WhatsApp settings are active');
          }
          return summary;
        } catch (err) {
          this.showToast('WhatsApp request failed');
          return null;
        }
      },
      async sendWhatsAppTest() {
        return this.runWhatsAppCommand('test');
      },
      async sendWhatsAppDigest() {
        return this.runWhatsAppCommand('digest');
      },
      async mockSignIn() {
        const email = document.getElementById('signin-email')?.value.trim();
        const password = document.getElementById('signin-password')?.value || '';
        if (email && password) {
          try {
            const res = await this.apiFetch('/auth/login', {
              method: 'POST',
              body: JSON.stringify({ email, password })
            });
            if (res.ok) {
              const data = await res.json();
              this.setAuth(data.token, data.user);
              await this.syncFromServer();
              await this.refreshCommunityNotes();
              this.updateXPUI();
              this.renderChatSidebar();
              this.renderExamGenerator();
              this.showPage('dashboard');
              this.showToast(`Welcome, ${this.userName}!`);
              return;
            }
          } catch (err) {
            this.apiStatus = 'offline';
          }
        }

        this.userName = (email || 'Jamie').split('@')[0] || 'Jamie';
        this.userEmail = email || 'jamie@smartstudy.ai';
        this.userSkills = JSON.parse(localStorage.getItem('smartstudy_skills')) || this.userSkills;
        this.userCollege = localStorage.getItem('smartstudy_college') || this.userCollege;
        this.userCourse = localStorage.getItem('smartstudy_course') || this.userCourse;
        this.userYear = localStorage.getItem('smartstudy_year') || this.userYear;
        this.userBranch = localStorage.getItem('smartstudy_branch') || this.userBranch;
        this.userMobile = localStorage.getItem('smartstudy_mobile') || this.userMobile;
        this.userTimeZone = localStorage.getItem('smartstudy_timezone') || this.userTimeZone;
        this.whatsappNumber = localStorage.getItem('smartstudy_whatsapp_number') || this.whatsappNumber;
        this.whatsappOptIn = localStorage.getItem('smartstudy_whatsapp_opt_in') === 'true';
        this.whatsappReminderLeadMinutes = parseInt(localStorage.getItem('smartstudy_whatsapp_lead') || `${this.whatsappReminderLeadMinutes}`, 10);
        this.whatsappDailyDigest = localStorage.getItem('smartstudy_whatsapp_digest') !== 'false';
        this.whatsappDailyDigestTime = localStorage.getItem('smartstudy_whatsapp_digest_time') || this.whatsappDailyDigestTime;
        this.whatsappTaskAlerts = localStorage.getItem('smartstudy_whatsapp_task_alerts') !== 'false';
        this.whatsappAssignmentAlerts = localStorage.getItem('smartstudy_whatsapp_assignment_alerts') !== 'false';
        this.whatsappScheduleAlerts = localStorage.getItem('smartstudy_whatsapp_schedule_alerts') !== 'false';
        this.whatsappFocusAlerts = localStorage.getItem('smartstudy_whatsapp_focus_alerts') === 'true';
        this.whatsappQuietHoursStart = localStorage.getItem('smartstudy_whatsapp_quiet_start') || this.whatsappQuietHoursStart;
        this.whatsappQuietHoursEnd = localStorage.getItem('smartstudy_whatsapp_quiet_end') || this.whatsappQuietHoursEnd;
        this.examCredits = parseInt(localStorage.getItem('smartstudy_credits')) || this.examCredits;
        this.jwtToken = localStorage.getItem('smartstudy_jwt') || this.jwtToken;
        this.apiUrl = localStorage.getItem('smartstudy_api_url') || this.apiUrl;
        this.apiStatus = localStorage.getItem('smartstudy_api_status') || this.apiStatus;
        localStorage.setItem('smartstudy_username', this.userName);
        localStorage.setItem('smartstudy_email', this.userEmail);
        this.saveAll({ sync: false });
        this.updateXPUI();
        this.renderChatSidebar();
        this.renderExamGenerator();
        this.showPage('dashboard');
        this.showToast(`Welcome, ${this.userName}!`);
      },
      async mockSignUp() {
        const name = document.getElementById('signup-name')?.value || 'Student';
        const email = document.getElementById('signup-email')?.value || 'student@smartstudy.ai';
        const password = document.getElementById('signup-password')?.value || 'password123';
        const skills = (document.getElementById('signup-skills')?.value || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const college = document.getElementById('signup-college')?.value || '';
        const course = document.getElementById('signup-course')?.value || '';
        const year = document.getElementById('signup-year')?.value || '';
        const mobile = document.getElementById('signup-mobile')?.value || '';
        const whatsappOptIn = !!document.getElementById('signup-whatsapp-optin')?.checked;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        try {
          const res = await this.apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              name,
              email,
              password,
              skills,
              college,
              course,
              year,
              mobile,
              timezone,
              whatsappNumber: mobile,
              whatsappOptIn
            })
          });
          if (res.ok) {
            const data = await res.json();
            this.setAuth(data.token, data.user);
            await this.syncToServer();
            await this.refreshCommunityNotes();
            this.updateXPUI();
            this.renderChatSidebar();
            this.renderExamGenerator();
            this.showPage('dashboard');
            this.showToast('Account created');
            return;
          }
        } catch (err) {
          this.apiStatus = 'offline';
        }

        this.userName = name;
        this.userEmail = email;
        this.userSkills = skills;
        this.userCollege = college;
        this.userCourse = course;
        this.userYear = year;
        this.userMobile = mobile;
        this.userTimeZone = timezone;
        this.whatsappNumber = mobile;
        this.whatsappOptIn = whatsappOptIn;
        this.whatsappReminderLeadMinutes = 120;
        this.whatsappDailyDigest = true;
        this.whatsappDailyDigestTime = '18:00';
        this.whatsappTaskAlerts = true;
        this.whatsappAssignmentAlerts = true;
        this.whatsappScheduleAlerts = true;
        this.whatsappFocusAlerts = false;
        this.whatsappQuietHoursStart = '22:00';
        this.whatsappQuietHoursEnd = '07:00';
        this.examCredits = 60;
        this.jwtToken = '';
        this.disconnectRealtimeStream();
        localStorage.setItem('smartstudy_username', this.userName);
        localStorage.setItem('smartstudy_email', this.userEmail);
        localStorage.setItem('smartstudy_skills', JSON.stringify(this.userSkills));
        localStorage.setItem('smartstudy_college', this.userCollege);
        localStorage.setItem('smartstudy_course', this.userCourse);
        localStorage.setItem('smartstudy_year', this.userYear);
        localStorage.setItem('smartstudy_mobile', this.userMobile);
        localStorage.setItem('smartstudy_credits', this.examCredits);
        localStorage.setItem('smartstudy_jwt', this.jwtToken);
        this.saveAll({ sync: false });
        this.updateXPUI();
        this.renderChatSidebar();
        this.renderExamGenerator();
        this.showPage('dashboard');
        this.showToast('Account created (offline)');
      },
      async signOut() {
        try {
          await this.apiFetch('/auth/logout', { method: 'POST' });
        } catch (err) {
          console.error('[signOut]', err);
        }
        this.disconnectRealtimeStream();
        this.jwtToken = '';
        this.apiStatus = 'ready';
        this.saveAll({ sync: false });
        this.showPage('signin');
        this.showToast('Signed out successfully');
      },
      refreshQuote() {
        const q = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        const el = document.getElementById('daily-quote');
        if (el) el.innerText = `"${q.text}" - ${q.author}`;
      },
      updateClock() {
        document.getElementById('realtime-clock').innerText = new Date().toLocaleTimeString('en-GB');
        this.updateRealtimeUI();
      },
      async init() {
        this.startLoader();
        if (this.darkMode) document.body.classList.add('dark');
        if (this.apiUrl.includes('smartstudy.ai')) this.apiUrl = '/api';
        this.currentRoom = this.studyRooms[0];
        this.setupRealtimeBus();
        this.updateXPUI();
        this.updateAuthNav();
        this.bumpLoader(20, 'Calibrating UI');
        const seenWelcome = localStorage.getItem('smartstudy_seen_welcome') === 'true';
        this.showPage(seenWelcome ? 'dashboard' : 'welcome');
        this.updateTimerDisplay();
        this.bumpLoader(32, 'Rendering workspace');
        const timerSelect = document.getElementById('timer-length');
        if (timerSelect) timerSelect.value = this.timerLength.toString();
        this.refreshQuote();
        this.renderDashboard();
        this.bumpLoader(52, 'Loading dashboards');
        this.renderStudentLife();
        this.bumpLoader(60, 'Loading wellness');
        this.renderChatSidebar();
        this.bumpLoader(68, 'Configuring AI tools');
        this.setChatMode(this.chatMode);
        this.setChatTone(this.chatTone);
        this.renderExamGenerator();
        this.renderFocusDashboard();
        this.renderHabitsDashboard();
        this.setupCommandPalette();
        if (this.jwtToken) {
          await this.syncFromServer();
          this.connectRealtimeStream();
          this.bumpLoader(82, 'Syncing progress');
        }
        await this.refreshCommunityNotes();
        this.bumpLoader(90, 'Finalizing launch');
        setInterval(() => this.tickRealtime(), 4000);
        setInterval(() => this.updateClock(), 1000);
        setInterval(() => this.addRoomSystemPrompt(), 20000);
      }
    };
    window.APP = APP;
    window.addEventListener('load', () => {
      APP.startLoader();
      APP.init().finally(() => APP.finishLoader());
    });
  
