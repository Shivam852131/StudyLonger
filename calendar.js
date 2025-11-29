// ---------- CALENDAR / SCHEDULE ----------
/* expects: STATE, saveState(), safe(), renderTasks(), updateCharts() */

const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function renderCalendar(){
  safe(()=>{
    const el = $('calendar'); if(!el) return;
    el.innerHTML = '';
    for(let i=0;i<7;i++){
      const d = document.createElement('div'); d.className='day'; d.dataset.day = i;
      d.innerHTML = `<h4>${weekDays[i]}</h4><div class='slot' id='slot-${i}'></div>`;
      el.appendChild(d);
    }
    document.querySelectorAll('.day').forEach(dd=>{
      dd.addEventListener('dragover', e=> e.preventDefault());
      dd.addEventListener('drop', e=>{
        e.preventDefault();
        const idx = e.dataTransfer.getData('text/plain');
        const t = STATE.tasks[idx];
        if(!t) return;
        const slot = $('slot-'+dd.dataset.day);
        const el2 = document.createElement('div'); el2.className='draggable'; el2.innerText = t.title;
        slot.appendChild(el2);
      });
    });
  });
}
renderCalendar();

$('suggestTimes')?.addEventListener('click', ()=>{
  document.querySelectorAll('.slot').forEach(s=>s.innerHTML='');
  let msg = 'AI suggested a time-blocked study schedule.';
  const userRole = CURRENT_USER?.roleClass || 'General Student';
  const userName = CURRENT_USER?.name || 'Student';
  const subjectLoad = {};
  STATE.tasks.filter(t => !t.done).forEach(t => subjectLoad[t.subject] = (subjectLoad[t.subject] || 0) + 1);
  STATE.assigns.forEach(a => subjectLoad[a.subject] = (subjectLoad[a.subject] || 0) + 2);
  const sortedSubjects = Object.entries(subjectLoad).sort((a, b) => b[1] - a[1]);
  const weakestSubject = sortedSubjects.length > 0 ? sortedSubjects[0][0] : 'General';
  const highestLoad = sortedSubjects.length > 0 ? sortedSubjects[0][1] : 0;
  const totalPending = STATE.tasks.filter(t => !t.done).length + STATE.assigns.length;
  const pendingGoals = STATE.goals.length;

  const scheduleBlocks = [];
  if (highestLoad > 0) {
    scheduleBlocks.push({ day: 0, title: `Deep Focus: ${weakestSubject} (120m)`, subject: weakestSubject });
    msg += ` Your focus is ${weakestSubject}.`;
  } else {
    scheduleBlocks.push({ day: 0, title: "Deep Focus: Core Subject (120m)", subject: "General" });
  }
  if (STATE.assigns.length > 0 || pendingGoals > 0) {
    scheduleBlocks.push({ day: 2, title: `Work on ${STATE.assigns.length} Assignments & ${pendingGoals} Goals (90m)`, subject: "General" });
  } else {
    scheduleBlocks.push({ day: 2, title: "Review Strongest Subject (60m)", subject: "General" });
  }
  if (userRole.includes('Class')) {
    scheduleBlocks.push({ day: 4, title: `Role Focus: Math/Science Prep (90m)`, subject: "Math/Physics" });
  } else if (userRole.includes('B.Tech')) {
    scheduleBlocks.push({ day: 4, title: `Role Focus: Project/Tech Work (90m)`, subject: "CS/COA" });
  } else {
    scheduleBlocks.push({ day: 4, title: "General Knowledge/Skill Building (60m)", subject: "General" });
  }
  scheduleBlocks.push({ day: 1, title: `Quick Review of ${totalPending} Pending Tasks (60m)`, subject: "General" });
  scheduleBlocks.push({ day: 5, title: `Weekly Review & Planning (90m)`, subject: "General" });
  scheduleBlocks.push({ day: 6, title: "Self-Care & Light Reading (30m)", subject: "General" });

  scheduleBlocks.forEach(block => {
    const slot = $('slot-'+block.day);
    if (slot) {
      const el2 = document.createElement('div');
      el2.className = 'draggable';
      el2.style.background = block.subject === weakestSubject ? '#FF5733' : (block.subject === 'General' ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(90deg,var(--accent1),var(--accent2))');
      el2.innerText = `[AI Block] ${block.title}`;
      slot.appendChild(el2);
    }
  });
  alert(msg + `\n\nGenerated schedule for ${userName} (${userRole}). Drag tasks into these blocks.`);
});
