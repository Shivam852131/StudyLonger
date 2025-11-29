// ---------- STORAGE & STATE ----------
  const STORAGE_KEYS = { STATE:'ssp_state_v2', AUTH:'ssp_auth_v2' };
  let STATE = { notes:[], tasks:[], goals:[], assigns:[], calendar:{}, users:[], chats:{}, messages:{} };

  function saveState(){ try{ localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(STATE)); }catch(e){ console.warn('saveState failed',e); } }
  function loadState(){ try{ const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATE)||'null'); if(s) STATE = Object.assign({}, STATE, s); }catch(e){ console.warn('loadState failed',e); } }
  loadState();

  const $ = id => document.getElementById(id);
  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  
  // GLOBAL STUDY TIMER
  let timerInterval = null;
  let totalSeconds = 0;

  function updateTimerUI() {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    const disp = document.getElementById("timerDisplay");
    if (disp) disp.innerText = `${hrs}:${mins}:${secs}`;
  }

  document.getElementById("timerStart")?.addEventListener("click", () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      totalSeconds++;
      updateTimerUI();
    }, 1000);
  });

  document.getElementById("timerPause")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  document.getElementById("timerReset")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    updateTimerUI();
  });

  // Initialize STATE structures
  if (!STATE.users) STATE.users = [];
  if (!STATE.chats) STATE.chats = {};
  if (!STATE.messages) STATE.messages = {};

  function initializeDemoUsers(){
    if(STATE.users.length === 0){
      STATE.users = [
        { uid: 'user_1', name: 'Alice Student', email: 'alice@college.com', role: 'Student', college: 'Tech Institute', roleClass: 'B.Tech 2nd Year', xp: 150 },
        { uid: 'user_2', name: 'Bob Teacher', email: 'bob@college.com', role: 'Teacher', college: 'Tech Institute', roleClass: 'Faculty', xp: 500 },
        { uid: 'user_3', name: 'Charlie Student', email: 'charlie@college.com', role: 'Student', college: 'Tech Institute', roleClass: 'Class 12', xp: 75 }
      ];
      saveState();
    }
  }

  initializeDemoUsers();

  document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    renderAdminStudents();
  });

  // ---------- NAVIGATION ----------
  function showPage(id){
    document.querySelectorAll('.page').forEach(p=>p.style.display='none');
    const el = document.getElementById(id);
    if(el) el.style.display = 'block';
    document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active', b.dataset.page===id));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function calculateLevel(xp){
    if(xp < 100) return 1;
    if(xp < 250) return 2;
    if(xp < 500) return 3;
    if(xp < 900) return 4;
    return 5;
  }

  function updateUserLevelUI(){
    if(!CURRENT_USER) return;
    const box = document.getElementById("userLevelDisplay");
    if(box) box.innerText = `Level: ${calculateLevel(CURRENT_USER.xp||0)} • XP: ${CURRENT_USER.xp||0}`;
    if(CURRENT_USER.role === "Teacher"){
      document.getElementById("navAdmin").style.display = "block";
    }
  }

  function awardXpTo(uidTarget, amount){
    const u = STATE.users.find(x=>x.uid === uidTarget);
    if(!u) return;
    u.xp = (u.xp || 0) + Number(amount);
    saveState();
    if(CURRENT_USER && CURRENT_USER.uid === uidTarget){
      CURRENT_USER = u;
      saveAuthLocal(u);
      updateUserLevelUI();
    }
    updateUserLevelUI();
  }

  document.querySelectorAll('#nav button').forEach(b=>{
    b.addEventListener('click', ()=> {
      const page = b.dataset.page;
      if(page) showPage(page);
    });
  });

  // ---------- AUTH & PROFILE (Partial Code) ----------
  let CURRENT_USER = null;

  function saveAuthLocal(user){
    if(user){
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }

  function loadAuthLocal(){
    try{
      const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)||'null');
      CURRENT_USER = u;
    }catch(e){
      console.warn('loadAuthLocal failed',e);
    }
  }

  loadAuthLocal();

  function updateProfileUI(){
    if(CURRENT_USER){
      // Display profile/logout buttons
      $('navLogin').style.display = 'none';
      $('navSignup').style.display = 'none';
      $('navProfile').style.display = 'block';

      // Update Topbar
      $('userGreeting').innerText = `Welcome, ${CURRENT_USER.name.split(' ')[0]}`;
      $('roleDisplay').innerText = CURRENT_USER.role + (CURRENT_USER.role === 'Teacher' ? ' (Admin)' : '');
      $('avatar').innerText = CURRENT_USER.name.charAt(0).toUpperCase();
      if(CURRENT_USER.role === 'Teacher'){
        $('avatar').style.background = 'linear-gradient(135deg, #FF6F00, #F44336)';
      } else {
        $('avatar').style.background = 'linear-gradient(135deg,#60a5fa,#8b5cf6)';
      }
      
      // Update Profile Page
      $('profileName').innerText = CURRENT_USER.name;
      $('profileEmail').innerText = CURRENT_USER.email;
      $('profileCollege').innerText = CURRENT_USER.college || 'N/A';
      $('profileRoleClass').innerText = CURRENT_USER.roleClass || 'N/A';
      if(CURRENT_USER.role === 'Teacher'){
        $('adminBadge').innerHTML = '<span class="admin-badge">Admin/Teacher</span>';
      } else {
        $('adminBadge').innerHTML = '';
      }
      if(CURRENT_USER.photoURL){
        $('profilePhoto').innerHTML = `<img src="${CURRENT_USER.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:12px">`;
      } else {
        $('profilePhoto').innerHTML = 'No Photo';
      }

      updateUserLevelUI();
    } else {
      // Display login/signup buttons
      $('navLogin').style.display = 'block';
      $('navSignup').style.display = 'block';
      $('navProfile').style.display = 'none';
      $('userGreeting').innerText = 'Welcome To';
      $('roleDisplay').innerText = 'Guest';
      $('avatar').innerText = 'S';
      $('adminBadge').innerHTML = '';

      updateUserLevelUI(); // Will show default Level: 1 • XP: 0
    }
  }

  updateProfileUI();

  $('navLogin')?.addEventListener('click', ()=> showPage('login'));
  $('navSignup')?.addEventListener('click', ()=> showPage('signup'));
  $('navProfile')?.addEventListener('click', ()=> showPage('profile'));
  $('toSchedule')?.addEventListener('click', ()=> showPage('schedule'));
  
  $('toSignup')?.addEventListener('click', (e)=>{
    e.preventDefault();
    showPage('signup');
  });
  $('toLogin')?.addEventListener('click', (e)=>{
    e.preventDefault();
    showPage('login');
  });

  // Safe wrapper for DOM manipulation
  function safe(fn) {
    try { fn(); } catch(e) { console.error('Safe execution error:', e); }
  }


  // ---------- TASKS ----------
  function renderTasks(){
    safe(()=>{
      const list = $('taskList');
      if(!list) return;
      list.innerHTML = '';
      STATE.tasks.forEach((t,i)=>{
        const item = document.createElement('div');
        item.className = 'task-item' + (t.done? ' done':'');
        item.innerHTML = `<div><strong>${escapeHtml(t.title)}</strong><div class="hint small">${escapeHtml(t.subject)} • ${t.due||'no due'}</div></div>
          <div>
            <input type='checkbox' data-idx='${i}' ${t.done? 'checked':''}>
            <button class='btn ghost' data-del='${i}'>Delete</button>
          </div>`;
        list.appendChild(item);
      });

      list.querySelectorAll('input[type=checkbox]').forEach(ch=>{
        ch.addEventListener('change', e=>{
          const i = parseInt(e.target.dataset.idx);
          STATE.tasks[i].done = e.target.checked;
          if(e.target.checked && CURRENT_USER){
            awardXpTo(CURRENT_USER.uid, 5); // Award 5 XP for task completion
            alert('Task complete! +5 XP awarded.');
          }
          saveState();
          renderTasks();
          updateCharts();
          renderCalendar();
          renderNotes();
          renderAssignments();
        });
      });

      list.querySelectorAll('[data-del]').forEach(bt=>{
        bt.addEventListener('click', e=>{
          const i = parseInt(e.target.dataset.del);
          STATE.tasks.splice(i,1);
          saveState();
          renderTasks();
          updateCharts();
          renderCalendar();
          renderNotes();
          renderAssignments();
        });
      });

      // Make tasks draggable for schedule
      Array.from(list.children).forEach((ti, idx)=>{
        ti.setAttribute('draggable','true');
        ti.addEventListener('dragstart', ev => ev.dataTransfer.setData('text/plain', idx));
      });
    });
  }

  $('addTask')?.addEventListener('click', ()=>{
    const title = $('taskTitle').value.trim();
    if(!title) return alert('Enter task title');
    STATE.tasks.push({title, subject:$('taskSubject').value, due:$('taskDue').value || null, done:false, created:Date.now()});
    saveState();
    renderTasks();
    $('taskTitle').value='';
    $('taskDue').value='';
  });

  $('quickAddBtn')?.addEventListener('click', ()=>{
    const title = $('quickTitle').value.trim();
    if(!title) return alert('Enter task title');
    STATE.tasks.push({title, subject:$('quickSubject').value, due:null, done:false, created:Date.now()});
    saveState();
    renderTasks();
    $('quickTitle').value='';
  });

  renderTasks();

  // ---------- GOALS ----------
  function renderGoals(){
    safe(()=>{
      const el = $('goalList');
      if(!el) return;
      el.innerHTML = '';
      STATE.goals.forEach(g=>{
        const d = document.createElement('div');
        d.className='card';
        d.style.marginTop='8px';
        d.innerHTML = `<strong>${escapeHtml(g.name)}</strong><div class="hint small">${escapeHtml(g.subject)} • target ${g.target||'—'}</div>
          <div style="margin-top:6px"><div style="height:10px;background:rgba(255,255,255,0.03);border-radius:999px;overflow:hidden">
            <div style="height:100%;background:linear-gradient(90deg,var(--accent1),var(--accent2));width:${g.progress||0}%"></div></div></div>`;
        el.appendChild(d);
      });
    });
  }

  $('addGoal')?.addEventListener('click', ()=>{
    const name = $('goalName').value.trim();
    if(!name) return alert('Enter goal');
    STATE.goals.push({name, subject:$('goalSubject').value, target:$('goalDate').value || null, progress:0});
    saveState();
    renderGoals();
    $('goalName').value='';
    $('goalDate').value='';
  });

  $('genGoals')?.addEventListener('click', ()=>{
    const subjCount = {};
    STATE.tasks.forEach(t=> subjCount[t.subject] = (subjCount[t.subject]||0) + 1);
    const top = Object.entries(subjCount).sort((a,b)=>b[1]-a[1])[0];
    const generated = [];
    if(top) generated.push({name:`Deepen ${top[0]} understanding`, subject:top[0], target: new Date(Date.now()+1000*60*60*24*21).toISOString().slice(0,10), progress:5});
    generated.push({name:'Complete 90 min daily review', subject:'General', target:new Date(Date.now()+1000*60*60*24*14).toISOString().slice(0,10), progress:3});
    STATE.goals = STATE.goals.concat(generated);
    saveState();
    renderGoals();
    alert('AI suggested '+generated.length+' goals');
  });

  renderGoals();

  // ---------- CALENDAR / SCHEDULE ----------
  const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  function renderCalendar(){
    safe(()=>{
      const el = $('calendar');
      if(!el) return;
      el.innerHTML = '';
      for(let i=0;i<7;i++){
        const d = document.createElement('div');
        d.className='day';
        d.dataset.day = i;
        d.innerHTML = `<h4>${weekDays[i]}</h4><div class='slot' id='slot-${i}'></div>`;
        el.appendChild(d);
      }

      // Render items from STATE.calendar
      Object.entries(STATE.calendar).forEach(([day, tasks])=>{
        const slot = $(`slot-${day}`);
        if(slot){
          tasks.forEach(task => {
            const el2 = document.createElement('div');
            el2.className = 'draggable';
            el2.innerText = task.title;
            el2.style.background = task.subject === 'CS' ? '#3d0ee4' : (task.subject === 'General' ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(90deg,var(--accent1),var(--accent2))');
            slot.appendChild(el2);
          });
        }
      });

      document.querySelectorAll('.day').forEach(dd=>{
        dd.addEventListener('dragover', e=> e.preventDefault());
        dd.addEventListener('drop', e=>{
          e.preventDefault();
          const idx = e.dataTransfer.getData('text/plain');
          const t = STATE.tasks[idx];
          if(!t) return;
          const day = dd.dataset.day;

          // Add to calendar state
          if(!STATE.calendar[day]) STATE.calendar[day] = [];
          STATE.calendar[day].push({title:t.title, subject:t.subject, originalIndex:idx});

          saveState();
          renderCalendar();
        });
      });
    });
  }

  $('suggestTimes')?.addEventListener('click', ()=>{
    let userName = CURRENT_USER?.name || 'User';
    let userRole = CURRENT_USER?.role || 'Guest';
    let msg = `AI generated a study schedule tailored for ${userName}.`;

    const totalPending = STATE.tasks.filter(t => !t.done).length;
    const taskSubjects = STATE.tasks.map(t => t.subject);
    const subjectCounts = taskSubjects.reduce((acc, sub) => {
      acc[sub] = (acc[sub] || 0) + 1;
      return acc;
    }, {});
    
    // Simple logic to find the subject with the most tasks (weakest focus area)
    let weakestSubject = 'General';
    let maxTasks = 0;
    for (const [subject, count] of Object.entries(subjectCounts)) {
      if (count > maxTasks && subject !== 'General') {
        maxTasks = count;
        weakestSubject = subject;
      }
    }

    // Reset calendar state for new suggestions
    STATE.calendar = {};
    const scheduleBlocks = [];

    // Core Study Block - Focus on Weakest Subject
    scheduleBlocks.push({ day: 0, title: `Deep Focus: ${weakestSubject} (90m)`, subject: weakestSubject });
    scheduleBlocks.push({ day: 2, title: `Focused Practice: ${weakestSubject} (60m)`, subject: weakestSubject });
    
    // Balanced Subjects (Example: CS or COA)
    if (taskSubjects.includes('CS') || taskSubjects.includes('COA')) {
        scheduleBlocks.push({ day: 4, title: `Project/Tech Work (90m)`, subject: "CS/COA" });
    } else {
        scheduleBlocks.push({ day: 4, title: "General Knowledge/Skill Building (60m)", subject: "General" });
    }

    // Review and Planning Blocks
    scheduleBlocks.push({ day: 1, title: `Quick Review of ${totalPending} Pending Tasks (60m)`, subject: "General" });
    scheduleBlocks.push({ day: 5, title: `Weekly Review & Planning (90m)`, subject: "General" });
    scheduleBlocks.push({ day: 6, title: "Self-Care & Light Reading (30m)", subject: "General" });


    // Add to STATE.calendar
    scheduleBlocks.forEach(block => {
      const day = block.day;
      if (!STATE.calendar[day]) STATE.calendar[day] = [];
      STATE.calendar[day].push({title:block.title, subject:block.subject});
    });

    saveState();
    renderCalendar();

    alert(msg + `\n\nGenerated schedule for ${userName} (${userRole}). Drag tasks into these blocks.`);
  });

  renderCalendar();

  // ---------- ASSIGNMENTS ----------
  function renderAssignments(){
    safe(()=>{
      const el = $('assignList');
      if(!el) return;
      el.innerHTML = '';
      STATE.assigns.forEach((a, i)=>{
        const d = document.createElement('div');
        d.className='card';
        d.style.marginTop='8px';
        d.innerHTML = `<strong>${escapeHtml(a.subject)} - ${escapeHtml(a.desc)}</strong>
          <div class="hint small">Due: ${a.due||'—'} | XP Reward: ${a.xp||0} | Assigned By: ${a.assignedBy || 'User'}</div>
          <button class="btn ghost" data-idx="${i}" data-action="completeAssign">Complete</button>
          <button class="btn ghost" data-idx="${i}" data-action="delAssign">Delete</button>`;
        el.appendChild(d);
      });

      el.querySelectorAll('[data-action="completeAssign"]').forEach(btn=>{
        btn.addEventListener('click', e=>{
          const i = parseInt(e.target.dataset.idx);
          const assign = STATE.assigns[i];
          if(!assign) return;
          if(CURRENT_USER){
             awardXpTo(CURRENT_USER.uid, assign.xp || 10);
             alert(`Assignment complete! +${assign.xp || 10} XP awarded.`);
          }
          STATE.assigns.splice(i, 1);
          saveState();
          renderAssignments();
        });
      });

      el.querySelectorAll('[data-action="delAssign"]').forEach(btn=>{
        btn.addEventListener('click', e=>{
          const i = parseInt(e.target.dataset.idx);
          STATE.assigns.splice(i, 1);
          saveState();
          renderAssignments();
        });
      });
    });
  }

  $('addAssign')?.addEventListener('click', ()=>{
    const subject = $('assignSubject').value.trim();
    const desc = $('assignDesc').value.trim();
    if(!subject || !desc) return alert('Fill subject and description');
    STATE.assigns.push({subject, desc, due:$('assignDue').value || null, xp: 30, assignedBy: CURRENT_USER?.name || 'User'});
    saveState();
    renderAssignments();
    $('assignSubject').value='';
    $('assignDesc').value='';
    $('assignDue').value='';
  });

  renderAssignments();

  // ---------- CHARTS ----------
  let miniChart=null, hoursChart=null, rateChart=null;

  function setupCharts(){
    safe(()=>{
      const miniCtx = $('miniChart')?.getContext('2d');
      if(miniCtx) miniChart = new Chart(miniCtx,{type:'doughnut',data:{labels:['Done','Left'],datasets:[{data:[1,4]}]},options:{plugins:{legend:{display:false}}}});

      const hoursCtx = $('hoursChart')?.getContext('2d');
      if(hoursCtx) hoursChart = new Chart(hoursCtx,{type:'bar',data:{labels:weekDays,datasets:[{label:'Hours',data:[1,2,1,3,2,0,2]}]},options:{responsive:true}});

      const rateCtx = $('rateChart')?.getContext('2d');
      if(rateCtx) rateChart = new Chart(rateCtx,{type:'pie',data:{labels:['Completed','Pending'],datasets:[{data:[2,5]}]},options:{plugins:{legend:{position:'bottom'}}}});
    });
  }

  setupCharts();

  function updateCharts(){
    safe(()=>{
      const completed = STATE.tasks.filter(t=>t.done).length;
      const total = STATE.tasks.length || 1;
      const left = total - completed;

      if(miniChart) miniChart.data.datasets[0].data = [completed, left];
      if(rateChart) rateChart.data.datasets[0].data = [completed, left];
      
      miniChart?.update();
      rateChart?.update();
      
      // Update AI Insights based on completion rate
      const rate = Math.round((completed/total)*100);
      let insightText = '';
      if(rate >= 80) insightText = 'Excellent completion rate! Focus on tackling challenging goals next.';
      else if(rate >= 50) insightText = 'Good progress. Try to block out specific study times for better focus.';
      else insightText = 'Completion rate is low. Break tasks into smaller steps or use the AI Schedule tool.';
      
      const aiInsightsEl = $('aiInsights');
      if(aiInsightsEl) aiInsightsEl.innerText = insightText;

      // Update Weekly Highlights
      const subjectCounts = STATE.tasks.reduce((acc, t) => {
        if(t.done) acc[t.subject] = (acc[t.subject] || 0) + 1;
        return acc;
      }, {});
      const topSub = Object.entries(subjectCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A';
      if($('topSub')) $('topSub').innerText = topSub;
    });
  }

  updateCharts();

  // ---------- NOTES ----------
  function renderNotes(){
    safe(()=>{
      const el = $('notesList');
      if(!el) return;
      el.innerHTML = '';

      const search = ($('searchNotes')?.value || '').toLowerCase();
      const subject = ($('noteSubject')?.value || '');
      const classFilter = ($('noteClass')?.value || '');

      const filteredNotes = STATE.notes.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(search) || n.text.toLowerCase().includes(search);
        const matchesSubject = !subject || n.subject === subject;
        const matchesClass = !classFilter || n.class === classFilter;
        return matchesSearch && matchesSubject && matchesClass;
      });

      filteredNotes.forEach((n, i)=>{
        const date = new Date(n.created).toLocaleDateString();
        const d = document.createElement('div');
        d.className='card note-card';
        d.innerHTML = `<strong>${escapeHtml(n.title)}</strong>
          <div class="hint small">${escapeHtml(n.subject)} • Class: ${escapeHtml(n.class)} • Uploaded: ${date}</div>
          <p class="small" style="max-height:60px;overflow:hidden">${escapeHtml(n.text || 'No text content.')}</p>
          ${n.fileURL ? `<div style="margin-top:8px"><a href="${n.fileURL}" target="_blank">View File</a></div>` : ''}
          <div style="text-align:right; margin-top:8px">
            <button class="btn small ghost" data-idx="${i}" data-action="deleteNote">Delete</button>
          </div>`;
        el.appendChild(d);
      });

      el.querySelectorAll('[data-action="deleteNote"]').forEach(btn=>{
        btn.addEventListener('click', e=>{
          const i = parseInt(e.target.dataset.idx);
          // Note: Since we are filtering, need to find the original index or use a unique ID.
          // For simplicity with array index, we'll re-filter to find the note to delete
          const noteToDelete = filteredNotes[i];
          const originalIndex = STATE.notes.findIndex(n => n.created === noteToDelete.created && n.title === noteToDelete.title);
          if(originalIndex > -1){
            STATE.notes.splice(originalIndex, 1);
            saveState();
            renderNotes();
          }
        });
      });
    });
  }

  $('addNote')?.addEventListener('click', ()=>{
    const title = ($('noteTitle')?.value || '').trim();
    const text = ($('noteText')?.value || '').trim();
    const subj = ($('noteSubject')?.value || '').trim();
    const cls = ($('noteClass')?.value || '').trim();
    const fileInput = $('noteFile');

    if(!title || !subj || !cls) return alert('Fill all required fields');

    const file = fileInput?.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        const fileURL = reader.result;
        STATE.notes.push({title, text, subject:subj, class:cls, fileURL, created:Date.now()});
        saveState();
        renderNotes();
        $('noteTitle').value='';
        $('noteText').value='';
        if(fileInput) fileInput.value='';
      };
      reader.readAsDataURL(file);
    } else {
      STATE.notes.push({title, text, subject:subj, class:cls, fileURL:null, created:Date.now()});
      saveState();
      renderNotes();
      $('noteTitle').value='';
      $('noteText').value='';
      if(fileInput) fileInput.value='';
    }
  });

  ['searchNotes','noteSubject','noteClass'].forEach(id=>{
    if($(id)) $(id).addEventListener('input', ()=> renderNotes());
  });

  renderNotes();

  // ---------- ADVANCED CHATBOT ----------
  const botKnowledgeBase = {
    study_tips: [
      "📚 Use **Spaced Repetition**: Review information at increasing intervals for 300% better retention.",
      "🧠 Try **Feynman Technique**: Teach concepts aloud to identify knowledge gaps.",
      "⏰ **Pomodoro Method**: 25 min focus + 5 min break. Increases productivity by 40%.",
      "🎯 **Active Recall**: Test yourself instead of re-reading. 50% more effective.",
      "🌙 **Sleep & Learning**: Sleep consolidates memory. Get 7-9 hours for optimal learning.",
      "📝 **Cornell Notes**: Three sections (Cue, Notes, Summary) for better organization.",
      "🔄 **Interleaving**: Mix different topics/problems to boost adaptive learning.",
      "💪 **Growth Mindset**: Challenges are opportunities. Your brain grows with effort."
    ],
    exam_prep: [
      "Plan 4-6 weeks ahead. Study weak topics 60% of your time.",
      "Create a mock test schedule. Simulate exam conditions to build stamina and identify pacing issues.",
      "Don't cram. Focus on consistent, small review sessions.",
      "Practice past papers to understand exam format and common questions.",
      "Ensure you understand the core concepts, not just memorizing formulas."
    ],
    motivation: [
      "Break down your goal. A journey of a thousand miles begins with a single step.",
      "Reward yourself after a focused study session.",
      "Visualize your success. See yourself achieving your academic goals.",
      "Remember your 'Why'. Why are you studying this? Let that be your fuel.",
      "Take a short walk. Movement boosts blood flow to the brain."
    ],
    time_management: [
      "Prioritize using the **Eisenhower Matrix** (Urgent/Important).",
      "Use time-blocking: Assign specific times to specific tasks.",
      "Eliminate distractions (social media, notifications) during deep work periods.",
      "Be realistic. Don't overschedule yourself.",
      "Batch similar tasks together (e.g., reply to all emails at once)."
    ]
  };

  function botReply(message, el){
    let response = `I'm StudyBot, an AI planner and study assistant. I can help with study plans, exam prep, motivation, time management, and general knowledge. What would you like?`;
    if(!message || message === 'hi' || message === 'hello') return appendChat(el, response);

    message = message.toLowerCase().trim();

    // Study Tips
    if(message.includes('tip') || message.includes('study') || message.includes('technique')){
      const tips = botKnowledgeBase.study_tips;
      return appendChat(el, tips[Math.floor(Math.random() * tips.length)]);
    }

    // Exam Prep
    if(message.includes('exam') || message.includes('test') || message.includes('prepare')){
      const exams = botKnowledgeBase.exam_prep;
      return appendChat(el, exams[Math.floor(Math.random() * exams.length)]);
    }

    // Motivation
    if(message.includes('motivat') || message.includes('discourag') || message.includes('tired') || message.includes('stress')){
      const motiv = botKnowledgeBase.motivation;
      return appendChat(el, motiv[Math.floor(Math.random() * motiv.length)]);
    }

    // Time Management
    if(message.includes('time') || message.includes('schedule') || message.includes('organize')){
      const timeM = botKnowledgeBase.time_management;
      return appendChat(el, timeM[Math.floor(Math.random() * timeM.length)]);
    }

    // Progress Check
    if(message.includes('progress') || message.includes('summary') || message.includes('how am i')){
      const comp = STATE.tasks.filter(t=>t.done).length;
      const total = STATE.tasks.length || 1;
      const rate = Math.round((comp/total)*100);
      return appendChat(el, `📊 Your progress: ${comp}/${total} tasks completed (${rate}% completion rate). Keep up the great work! 💪`);
    }
    
    // Subject Help
    if(message.includes('math') || message.includes('physics') || message.includes('cs') || message.includes('chemistry')){
      return appendChat(el, `📐 For complex subjects, try: (1) Watch concept videos, (2) Work through examples, (3) Solve practice problems, (4) Review mistakes. Which topic needs clarification?`);
    }

    // General Q&A with simulated knowledge
    const qaResponses = {
      "what is": "Great question! This is a fundamental concept. Break it down into smaller parts, understand each, then connect them. Want a specific example?",
      "how do": "Here's the approach: (1) Identify the core problem. (2) Review the necessary formula/steps. (3) Apply it to the data. Where are you stuck?",
      "define": "Definition is key! I can give you a precise definition, but try rephrasing it in your own words first. This boosts retention.",
      "explain": "I can explain that! To explain clearly, I need to know your current understanding level (e.g., beginner, intermediate).",
    };

    for(const key in qaResponses){
      if(message.startsWith(key)){
        return appendChat(el, qaResponses[key]);
      }
    }

    // Fallback response
    const fallbacks = [
      "I'm not sure about that specific query, but I can help you with your studies! Try asking about: study tips, exam prep, motivation, or how you're progressing.",
      "📚 Let me help you learn better! What aspect of your studies would you like to focus on?",
      "🎯 That's a good question. For complex topics, use active recall and practice. What subject are you studying?"
    ];
    appendChat(el, fallbacks[Math.floor(Math.random() * fallbacks.length)]);
  }

  function appendChat(el, text, who='bot'){
    if(!el) return;
    const b = document.createElement('div');
    b.className = 'bubble ' + (who==='user'? 'user':'bot');
    b.innerText = text;
    el.appendChild(b);
    el.scrollTop = el.scrollHeight;
  }

  // Popup Chat
  $('chatSend')?.addEventListener('click', ()=>{
    const m = ($('chatInput')?.value || '').trim();
    if(!m) return;
    appendChat($('chatBody'), m, 'user');
    $('chatInput').value='';
    setTimeout(()=> botReply(m, $('chatBody')), 600);
  });
  
  $('openChatBtn')?.addEventListener('click', ()=>{
    $('chatPopup').style.display='flex';
    $('openChatBtn').style.display='none';
  });
  $('closeChat')?.addEventListener('click', ()=>{
    $('chatPopup').style.display='none';
    $('openChatBtn').style.display='flex';
  });

  // Inline Chat (Chatbot page)
  $('chatSendInline')?.addEventListener('click', ()=>{
    const m = ($('chatInputInline')?.value || '').trim();
    if(!m) return;
    appendChat($('chatBodyInline'), m, 'user');
    $('chatInputInline').value='';
    setTimeout(()=> botReply(m, $('chatBodyInline')), 600);
  });


  // ---------- ADMIN PANEL ----------
  function renderAdminStudents(){
    safe(()=>{
      const el = $('adminStudentsList');
      if(!el) return;
      el.innerHTML = '';
      
      const adminAssignTo = $('adminAssignTo');
      if(adminAssignTo){
        // Clear previous options except 'All Students'
        Array.from(adminAssignTo.options).forEach((opt, i) => i > 0 && opt.remove());
      }
      
      STATE.users.filter(u=>u.role==='Student').forEach(u=>{
        const div = document.createElement("div");
        div.style.padding = "8px";
        div.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        div.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong>${u.name}</strong>
              <div class="small hint">${u.email} • XP: ${u.xp || 0} • Lvl: ${calculateLevel(u.xp || 0)}</div>
            </div>
            <div style="display:flex;gap:8px">
              <input type="number" placeholder="XP" class="xpInput" data-uid="${u.uid}" style="width:80px">
              <button class="btn small" data-uid="${u.uid}" data-action="addXp">Give XP</button>
            </div>
          </div>`;
        el.appendChild(div);

        // Add to Assignment drop down
        if(adminAssignTo){
          const opt = document.createElement("option");
          opt.value = u.uid;
          opt.innerText = u.name;
          adminAssignTo.appendChild(opt);
        }
      });

      el.querySelectorAll('[data-action="addXp"]').forEach(btn=>{
        btn.addEventListener("click",()=>{
          const uid = btn.dataset.uid;
          const input = el.querySelector(`.xpInput[data-uid='${uid}']`);
          const xp = Number(input.value || 0);
          if(xp <= 0) return alert("Enter XP amount");
          awardXpTo(uid, xp);
          renderAdminStudents();
          alert("XP awarded!");
        });
      });
    });
  }

  $('adminAddTask')?.addEventListener('click', ()=>{
    if(CURRENT_USER?.role !== 'Teacher') return alert('Access Denied');
    const title = $('adminTaskTitle').value.trim();
    const subject = $('adminTaskSubject').value.trim();
    const xp = Number($('adminTaskXp').value || 10);
    const assignAll = $('adminAssignAll').checked;
    
    if(!title || !subject) return alert('Fill title and subject');

    const newTask = {title: title + ' (Assigned)', subject, due: null, done: false, created: Date.now(), xp, assignedBy: CURRENT_USER.name};
    
    if(assignAll){
      STATE.tasks.push(newTask);
      alert(`Task "${title}" created and assigned to all students.`);
    } else {
      // In a real app, this would assign to specific students, but for this state, we just add it to tasks
      STATE.tasks.push(newTask);
      alert(`Task "${title}" created.`);
    }

    if(!STATE.adminCreatedItems) STATE.adminCreatedItems = [];
    STATE.adminCreatedItems.push({...newTask, type: 'task'});

    saveState();
    renderTasks();
    renderAdminCreated();
    $('adminTaskTitle').value='';
    $('adminTaskSubject').value='';
  });

  $('adminAddAssign')?.addEventListener('click', ()=>{
    if(CURRENT_USER?.role !== 'Teacher') return alert('Access Denied');
    const title = $('adminAssignTitle').value.trim();
    const due = $('adminAssignDue').value;
    const xp = Number($('adminAssignXp').value || 30);
    const assignTo = $('adminAssignTo').value;
    
    if(!title || !due) return alert('Fill title and due date');

    const newAssign = {subject: title, desc: `Due: ${due}`, due, xp, assignedTo: assignTo, assignedBy: CURRENT_USER.name};
    
    // Simple state: all assignments go to the main list
    STATE.assigns.push(newAssign);
    
    if(!STATE.adminCreatedItems) STATE.adminCreatedItems = [];
    STATE.adminCreatedItems.push({...newAssign, type: 'assignment'});

    saveState();
    renderAssignments();
    renderAdminCreated();
    alert(`Assignment "${title}" created.`);
  });

  function renderAdminCreated(){
    safe(()=>{
      const el = $('adminCreatedList');
      if(!el) return;
      el.innerHTML = '';
      if(!STATE.adminCreatedItems) STATE.adminCreatedItems = [];
      
      STATE.adminCreatedItems.forEach(item => {
        const div = document.createElement("div");
        div.style.padding = "6px 0";
        div.style.borderBottom = "1px dotted rgba(255,255,255,0.1)";
        let info = '';
        if(item.type === 'task'){
          info = `[TASK] ${item.title} (${item.subject}) - ${item.xp} XP`;
        } else if(item.type === 'assignment'){
          info = `[ASSIGNMENT] ${item.subject} (Due: ${item.due}) - ${item.xp} XP`;
        }
        div.innerHTML = `<div class="small">${info}</div>`;
        el.appendChild(div);
      });
    });
  }

  renderAdminCreated();


  // ---------- AI TEST PAGE LOGIC ----------

  function esc(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function buildAnalysisPayload({title, subject, text, file, mode}) {
    // In a real application, this would prepare an API request
    return {
      prompt_meta: "Smart Study Planner AI — advanced exam-focused analysis",
      mode,
      title,
      subject,
      text,
      filename: file ? file.name : null,
      timestamp: new Date().toISOString()
    };
  }

  async function callBackendOrSimulate(formData) {
    // This is a simulation since a real backend call is not possible.
    try {
      // Attempt a simulated API call (e.g., using a mocked fetch with timeout)
      // For this environment, we skip the mocked fetch and go straight to simulation
      // const resp = await fetch('/api/analyze', { method: 'POST', body: formData, timeout: 30000 });
      // if(!resp.ok) throw new Error('Backend responded with ' + resp.status);
      // const json = await resp.json();
      // if(json && json.detected_subject) return json;
      // throw new Error('Invalid backend response');
    } catch (err) {
      const payload = {};
      for (const pair of formData.entries()) payload[pair[0]] = pair[1];
      return simulateAnalysis(payload);
    }
    const payload = {};
    for (const pair of formData.entries()) payload[pair[0]] = pair[1];
    return simulateAnalysis(payload);
  }

  function simulateAnalysis(payload) {
    const title = payload.title || 'Untitled Chapter';
    const subject = payload.subject || 'General';
    const mode = payload.mode || 'test';
    const text = payload.text || 'No text provided.';
    
    const important_topics = [
      { topic: 'The First Law of Thermodynamics', reason: 'This law is the most foundational concept of the chapter.', verified: true },
      { topic: 'Heat Engines and Refrigerators', reason: 'Common application problems are based on this mechanism.', verified: true },
      { topic: 'Entropy and the Second Law', reason: 'Often tested in conceptual questions and short answers.', verified: true },
      { topic: 'Kinetic Theory of Gases', reason: 'Minor topic, but provides context for thermal systems.', verified: false },
    ];
    
    const weak_topics = [{ topic: 'Kinetic Theory of Gases', reason: 'Low frequency in text, likely a blind spot.' }];

    const generated_questions = [];
    const answers = [];

    important_topics.filter(t => t.verified).forEach(t => {
      const base = t.topic;
      const qset = [];
      qset.push({ q: `What is the core idea of ${base}?`, difficulty: 'Easy', type: 'conceptual' });
      answers.push({ question: qset[qset.length-1].q, answer_short: `Key idea of ${base}.`, answer_long: `Detailed explanation of ${base}.` });
      qset.push({ q: `Describe one practical application of ${base}.`, difficulty: 'Moderate', type: 'application' });
      answers.push({ question: qset[qset.length-1].q, answer_short: `Application of ${base}.`, answer_long: `Real-world use of ${base}.` });
      qset.push({ q: `Solve a typical problem related to ${base}.`, difficulty: 'Hard', type: 'numerical' });
      answers.push({ question: qset[qset.length-1].q, answer_short: `Solution for ${base}.`, answer_long: `Step-by-step solution.` });
      generated_questions.push({ topic: base, questions: qset });
    });

    const improvement_plan = `Focus on ${important_topics[0].topic}. Use 45–60 min focused session, 3 practice problems, review mistakes for 15 min.`;
    const study_block = { title: `Revision: ${title}`, duration_min: 50, recommended_when: 'Evening (6–8pm)' };
    const suggested_tasks = [{ title: `Revision: ${title} Test`, subject, duration_min: 50, due: null }];
    const performance_summary = mode === 'exam' ? 'Weak — needs focus' : 'Average — requires revision';

    return {
      detected_subject: subject,
      detected_chapter: title,
      performance_summary,
      weak_topics,
      important_topics,
      verified_topics: important_topics.filter(t => t.verified).map(t => t.topic),
      generated_questions,
      answers,
      improvement_plan,
      suggested_tasks,
      study_block
    };
  }

  function renderAnalysisResult(result) {
    const aiTopicsEl = document.getElementById('aiTopics');
    if(aiTopicsEl){
      aiTopicsEl.innerHTML = '';
      result.important_topics.forEach((t, i)=>{
        const item = document.createElement('div');
        item.className = 'topic-item-verify' + (t.verified ? '' : ' unverified');
        item.dataset.topicId = String(i);
        item.innerHTML = `Topic: <strong>${esc(t.topic)}</strong> <div style="display:flex;gap:8px;align-items:center"> <div class="hint small" style="max-width:320px">${esc(t.reason)}</div> <button class="btn small" data-idx="${i}" style="padding:4px 8px">${t.verified ? 'Verified' : 'Unverified'}</button> </div>`;
        aiTopicsEl.appendChild(item);
        
        item.addEventListener('click', ()=> {
          t.verified = !t.verified;
          result.verified_topics = result.important_topics.filter(pp => pp.verified).map(pp => pp.topic);
          renderAnalysisResult(result);
        });
      });
      document.getElementById('verificationCard').querySelector('p.hint').innerHTML = `AI identified **${result.important_topics.length}** core topics. Click on any topic to **un-verify** it. Only verified topics will be used for question generation.`;
    }
    
    // Display Questions placeholder/initial message
    const qEl = document.getElementById('testQuestions');
    if(qEl){
      qEl.innerHTML = `<p class="hint" style="text-align: center; padding: 10px;">Questions will appear here after topic analysis and **verification**.</p>`;
    }
  }


  document.getElementById('generateTestBtn')?.addEventListener('click', async () => {
    const title = ($('testTitle')?.value || '').trim();
    const subject = ($('testSubject')?.value || '').trim();
    const text = ($('testText')?.value || '').trim();
    const file = $('testFile')?.files?.[0];
    const mode = 'test'; // Default mode
    
    if(!title || !subject || (!text && !file)) return alert('Fill title, subject, and paste text or upload a file.');

    alert(`Analyzing "${title}"...`);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('text', text);
    formData.append('mode', mode);
    if(file) formData.append('file', file);
    
    // Simulate API call
    const result = await callBackendOrSimulate(formData); 

    // Ensure all keys are present for robustness
    const requiredKeys = ["detected_subject","detected_chapter","performance_summary","weak_topics","important_topics","verified_topics","generated_questions","answers","improvement_plan","suggested_tasks","study_block"];
    for(const k of requiredKeys) if(!(k in result)) result[k] = (k === 'important_topics' || k === 'weak_topics' || k === 'generated_questions' || k === 'answers' || k === 'verified_topics' || k === 'suggested_tasks') ? [] : '';
    
    renderAnalysisResult(result);
    window.__LAST_ANALYSIS_RESULT = result;
  });

  document.getElementById('finalizeTopicsBtn')?.addEventListener('click', () => {
    const result = window.__LAST_ANALYSIS_RESULT;
    if(!result) return alert('Please analyze a chapter first.');
    
    const verified = result.important_topics.filter(t => t.verified);
    if(verified.length === 0) return alert('Please verify at least one topic.');
    
    const filteredQuestions = result.generated_questions.filter(g => verified.some(v => v.topic === g.topic));
    
    const finalTest = {
      detected_subject: result.detected_subject,
      detected_chapter: result.detected_chapter,
      performance_summary: result.performance_summary,
      weak_topics: result.weak_topics,
      important_topics: result.important_topics,
      verified_topics: verified.map(v => v.topic),
      generated_questions: filteredQuestions,
      answers: result.answers,
      improvement_plan: result.improvement_plan,
      suggested_tasks: result.suggested_tasks,
      study_block: result.study_block
    };

    const qEl = document.getElementById('testQuestions');
    if(qEl){
      qEl.innerHTML = `<pre style="white-space:pre-wrap; max-height:400px; overflow:auto; padding:10px; background:rgba(0,0,0,0.3); border-radius:8px;">${esc(JSON.stringify(finalTest, null, 2))}</pre>`;
    }
    window.__LAST_FINAL_TEST = finalTest;
    alert('Test generated! Download or add to your planner.');
  });
  
  document.getElementById('addStudyTask')?.addEventListener('click', () => {
    const finalTest = window.__LAST_FINAL_TEST || window.__LAST_ANALYSIS_RESULT;
    if(!finalTest) return alert('Generate a test first.');

    const suggested = (finalTest.suggested_tasks && finalTest.suggested_tasks[0]) || { 
      title: `Revision: ${finalTest.detected_chapter}`, 
      subject: finalTest.detected_subject, 
      duration_min: 45 
    };

    if(window.STATE && Array.isArray(window.STATE.tasks)){
      window.STATE.tasks.push({
        title: suggested.title,
        subject: suggested.subject || 'General',
        done: false,
        created: Date.now(),
        due: null
      });
      try{
        window.saveState && window.saveState();
        window.renderTasks && window.renderTasks();
        alert('Task added to your Tasks list!');
      } catch(e){
        console.error('Error saving task:', e);
      }
    }
  });


  // ---------- LOGIN/SIGNUP Handlers (Full) ----------
  $('signupBtn')?.addEventListener('click', ()=>{
    const name = ($('signupName')?.value || '').trim();
    const email = ($('signupEmail')?.value || '').trim();
    const pass = ($('signupPass')?.value || '').trim();
    const college = ($('signupCollege')?.value || '').trim();
    const roleClass = ($('signupRoleClass')?.options[$('signupRoleClass').selectedIndex]?.text || '').trim(); // Using text for better display
    const role = ($('signupRoleClass2')?.options[$('signupRoleClass2').selectedIndex]?.text || 'Student').trim(); // Assuming a second select for role, but using default 'Student'
    
    if(!name || !email || !pass || !college || !roleClass) return alert('Fill all required fields');
    
    // Check if user already exists
    if(STATE.users.find(u => u.email === email)) return alert('User already exists with this email.');

    CURRENT_USER = { uid: ''+Date.now(), name, email, role, college, roleClass, xp: 0 };
    STATE.users.push(CURRENT_USER);
    
    saveAuthLocal(CURRENT_USER);
    saveState();
    updateProfileUI();
    renderChatUsers();
    renderAdminStudents();
    alert('Account created! Logging you in.');
    showPage('home');
  });

  $('loginBtn')?.addEventListener('click', ()=>{
    const email = ($('loginEmail')?.value || '').trim();
    const pass = ($('loginPass')?.value || '').trim(); // Password check is simulated

    if(!email || !pass) return alert('Enter credentials');

    const demo = STATE.users.find(u => u.email === email);
    
    if(!demo) return alert('User not found. Create an account first.');
    // In a real app, you would check the password hash here: if(demo.passHash !== hash(pass)) return alert('Wrong password');

    CURRENT_USER = demo;
    saveAuthLocal(CURRENT_USER);
    updateProfileUI();
    renderChatUsers();
    renderAdminStudents();
    showPage('home');
    alert('Logged in successfully!');
  });

  $('logoutBtn')?.addEventListener('click', ()=>{
    CURRENT_USER = null;
    saveAuthLocal(null);
    updateProfileUI();
    showPage('home');
    alert('Signed out');
  });

  $('uploadPhoto')?.addEventListener('click', ()=>{
    const f = $('photoFile')?.files?.[0];
    if(!f) return alert('Choose a file');

    const reader = new FileReader();
    reader.onload = () => {
      if(CURRENT_USER){
        CURRENT_USER.photoURL = reader.result;
        saveAuthLocal(CURRENT_USER);
        updateProfileUI();
        alert('Photo uploaded!');
      }
    };
    reader.readAsDataURL(f);
  });
  
  // ---------- LIVE CHAT ---------- 
  function ensureChat(userA, userB){
    // Keying chat by sorted UIDs for consistency
    const key = [userA, userB].sort().join('_'); 
    if(!STATE.messages[key]) STATE.messages[key] = [];
    if(!STATE.chats[userA]) STATE.chats[userA] = {};
    if(!STATE.chats[userB]) STATE.chats[userB] = {};

    STATE.chats[userA][userB] = key;
    STATE.chats[userB][userA] = key;
    return key;
  }

  function appendLiveChat(key, senderUID, message){
    if(!STATE.messages[key]) return;
    STATE.messages[key].push({sender: senderUID, text: message, timestamp: Date.now()});
    saveState();
  }

  function renderLiveChatMessages(targetUID){
    const chatMessagesEl = $('chatMessages');
    if(!chatMessagesEl || !CURRENT_USER) return;
    
    const chatKey = STATE.chats[CURRENT_USER.uid]?.[targetUID];
    if(!chatKey) {
      chatMessagesEl.innerHTML = '<div class="hint" style="text-align:center">Start a new conversation.</div>';
      return;
    }

    const messages = STATE.messages[chatKey] || [];
    chatMessagesEl.innerHTML = '';
    
    messages.forEach(m => {
      const isUser = m.sender === CURRENT_USER.uid;
      const d = document.createElement('div');
      d.className = `bubble ${isUser ? 'user' : 'bot'}`; // Using 'bot' class for the other user too
      d.innerText = m.text;
      chatMessagesEl.appendChild(d);
    });

    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function renderChatUsers(){
    const chatUserListEl = $('chatUserList');
    if(!chatUserListEl || !CURRENT_USER) return;

    chatUserListEl.innerHTML = '';
    
    STATE.users.filter(u => u.uid !== CURRENT_USER.uid).forEach(u => {
      const lastMsg = STATE.messages[STATE.chats[CURRENT_USER.uid]?.[u.uid]]?.slice(-1)[0]?.text || 'No messages yet';
      const d = document.createElement('div');
      d.className = 'topic-item-verify'; // Reusing a card style
      d.dataset.targetUid = u.uid;
      d.innerHTML = `<strong>${u.name}</strong><div class="hint small">${lastMsg}</div>`;
      chatUserListEl.appendChild(d);

      d.addEventListener('click', e => {
        const targetUID = u.uid;
        window.CURRENT_CHAT_TARGET = targetUID;
        ensureChat(CURRENT_USER.uid, targetUID);
        $('chatHeader').innerText = `Chatting with: ${u.name}`;
        renderLiveChatMessages(targetUID);
      });
    });
  }

  $('sendChatBtn')?.addEventListener('click', ()=>{
    const targetUID = window.CURRENT_CHAT_TARGET;
    const input = $('chatInput');
    const message = input?.value.trim();

    if(!targetUID || !message) return;
    
    const key = ensureChat(CURRENT_USER.uid, targetUID);
    appendLiveChat(key, CURRENT_USER.uid, message);
    
    input.value = '';
    renderLiveChatMessages(targetUID);
    renderChatUsers(); // Update the list with the last message snippet
  });
  
  if(CURRENT_USER){
    renderChatUsers();
  }

  // --- Final Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    // Only show home if not logged in, otherwise let updateProfileUI handle navigation
    if(!CURRENT_USER) showPage('home');
    updateTimerUI(); // Initial display
  });

  // Re-run checks/updates on login/logout etc.
  window.renderAdminStudents = renderAdminStudents; // Expose for admin actions
  window.updateUserLevelUI = updateUserLevelUI; // Expose for XP awards
  window.awardXpTo = awardXpTo; // Expose XP logic
  window.saveState = saveState; // Expose save state
  window.showPage = showPage; // Expose showPage
  window.STATE = STATE; // Expose STATE
  window.renderTasks = renderTasks; // Expose renderTasks for admin view
  window.renderAssignments = renderAssignments; // Expose renderAssignments for admin view