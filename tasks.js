// ---------- TASKS ----------
/* expects: STATE, saveState(), renderCalendar(), renderNotes(), updateCharts(), escapeHtml() */

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
        saveState(); renderTasks(); updateCharts(); renderCalendar(); renderNotes(); renderAssignments();
      });
    });
    list.querySelectorAll('[data-del]').forEach(bt=>{
      bt.addEventListener('click', e=>{
        const i = parseInt(e.target.dataset.del);
        STATE.tasks.splice(i,1);
        saveState(); renderTasks(); updateCharts(); renderCalendar(); renderNotes(); renderAssignments();
      });
    });
    Array.from(list.children).forEach((ti, idx)=>{
      ti.setAttribute('draggable','true');
      ti.addEventListener('dragstart', ev => ev.dataTransfer.setData('text/plain', idx));
    });
  });
}

$('addTask')?.addEventListener('click', ()=>{
  const title = $('taskTitle').value.trim();
  if(!title) return alert('Enter title');
  const subject = $('taskSubject').value;
  const due = $('taskDue').value || null;
  STATE.tasks.push({title, subject, due, done:false, created:Date.now()});
  saveState();
  $('taskTitle').value=''; $('taskDue').value='';
  renderTasks(); updateCharts(); renderCalendar();
});

$('quickAddBtn')?.addEventListener('click', ()=>{
  const t = $('quickTitle').value.trim();
  if(!t) return;
  STATE.tasks.push({title:t, subject:$('quickSubject').value, done:false, created:Date.now()});
  saveState(); renderTasks(); updateCharts(); renderCalendar();
  $('quickTitle').value='';
});
