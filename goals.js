// ---------- GOALS ----------
/* expects: STATE, saveState(), escapeHtml() */

function renderGoals(){
  safe(()=>{
    const el = $('goalList'); if(!el) return;
    el.innerHTML='';
    STATE.goals.forEach((g,i)=>{
      const d = document.createElement('div'); d.className='card'; d.style.marginTop='8px';
      d.innerHTML = `<strong>${escapeHtml(g.name)}</strong><div class="hint small">${escapeHtml(g.subject)} • target ${g.target||'—'}</div>
        <div style="margin-top:6px"><div style="height:10px;background:rgba(255,255,255,0.03);border-radius:999px;overflow:hidden">
          <div style="height:100%;background:linear-gradient(90deg,var(--accent1),var(--accent2));width:${g.progress||0}%"></div></div></div>`;
      el.appendChild(d);
    });
  });
}

$('addGoal')?.addEventListener('click', ()=>{
  const name = $('goalName').value.trim(); if(!name) return alert('Enter goal');
  STATE.goals.push({name, subject:$('goalSubject').value, target:$('goalDate').value || null, progress:0});
  saveState(); renderGoals(); $('goalName').value=''; $('goalDate').value='';
});

$('genGoals')?.addEventListener('click', ()=>{
  const subjCount = {}; STATE.tasks.forEach(t=> subjCount[t.subject] = (subjCount[t.subject]||0) + 1);
  const top = Object.entries(subjCount).sort((a,b)=>b[1]-a[1])[0];
  const generated = [];
  if(top) generated.push({name:`Deepen ${top[0]} understanding`, subject:top[0], target: new Date(Date.now()+1000*60*60*24*21).toISOString().slice(0,10), progress:5});
  generated.push({name:'Complete 90 min daily review', subject:'General', target:new Date(Date.now()+1000*60*60*24*14).toISOString().slice(0,10), progress:3});
  STATE.goals = STATE.goals.concat(generated);
  saveState(); renderGoals(); alert('AI suggested '+generated.length+' goals');
});
