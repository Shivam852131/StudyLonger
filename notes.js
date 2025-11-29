// ---------- NOTES ----------
/* expects: STATE, saveState(), escapeHtml() */

function renderNotes(){
  safe(()=>{
    const list = $('notesList'); if(!list) return;
    const q = ($('searchNotes')?.value || '').toLowerCase();
    const subj = $('noteSubject')?.value || '';
    const cls = $('noteClass')?.value || '';
    list.innerHTML = '';

    STATE.notes
      .filter(n => (!subj || n.subject === subj))
      .filter(n => (!cls || n.class === cls))
      .filter(n => (!q || (n.title||'').toLowerCase().includes(q) || (n.text||'').toLowerCase().includes(q)))
      .forEach((n,i) => {
        const div = document.createElement('div');
        div.className = 'card note-card';
        const fileButton = n.fileURL ? `<a href='${n.fileURL}' target='_blank' class='btn ghost small' style='margin-top:8px'>View File</a>` : '';
        div.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${escapeHtml(n.title)}</strong>
            <div class="small hint">Class: ${escapeHtml(n.class || '')} • Subject: ${escapeHtml(n.subject || '')}</div>
          </div>
          <div class='hint small' style='margin-top:8px'>${escapeHtml(n.text || '')}</div>
          <div style='margin-top:8px'>${fileButton}
            <button class='btn ghost small' data-del='${i}' style='margin-left:8px'>Delete</button>
          </div>`;
        list.appendChild(div);
      });

    list.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.del);
        if(isNaN(id)) return;
        if(!confirm('Delete this note?')) return;
        STATE.notes.splice(id,1);
        saveState();
        renderNotes();
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
      saveState(); renderNotes();
      $('noteTitle').value=''; $('noteText').value=''; if(fileInput) fileInput.value='';
    };
    reader.readAsDataURL(file);
  } else {
    STATE.notes.push({title, text, subject:subj, class:cls, fileURL:null, created:Date.now()});
    saveState(); renderNotes();
    $('noteTitle').value=''; $('noteText').value=''; if(fileInput) fileInput.value='';
  }
});

['searchNotes','noteSubject','noteClass'].forEach(id=>{
  if($(id)) $(id).addEventListener('input', ()=> renderNotes());
});
