// ---------- ASSIGNMENTS ----------
/* expects: STATE, saveState() */

function renderAssignments(){
  safe(()=>{
    const el = $('assignList'); if(!el) return;
    el.innerHTML = '';
    STATE.assigns.forEach((a,i)=>{
      const div = document.createElement('div'); div.className='card note-card'; div.style.marginTop='8px';
      div.innerHTML = `<strong>${escapeHtml(a.subject)}</strong><div class="hint small">${escapeHtml(a.desc)} • ${a.due||'no due'}</div>
        <div style="margin-top:6px"><button class="btn ghost" data-del="${i}">Delete</button></div>`;
      el.appendChild(div);
    });
    el.querySelectorAll('[data-del]').forEach(bt=>{
      bt.addEventListener('click', e=>{
        const i = parseInt(e.target.dataset.del);
        STATE.assigns.splice(i,1); saveState(); renderAssignments();
      });
    });
  });
}

$('addAssign')?.addEventListener('click', ()=>{
  const s = $('assignSubject').value.trim(); if(!s) return alert('Enter subject');
  STATE.assigns.push({subject:s, due: $('assignDue').value || null, desc: $('assignDesc').value || ''});
  saveState(); renderAssignments(); $('assignSubject').value=''; $('assignDesc').value=''; $('assignDue').value='';
});
