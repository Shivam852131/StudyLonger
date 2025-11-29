// ---------- LIVE CHAT (student <> teacher) ----------
/* expects: STATE, CURRENT_USER */

function ensureChat(userA, userB){
  if(!STATE.chats[userA]) STATE.chats[userA] = {};
  if(!STATE.chats[userA][userB]) STATE.chats[userA][userB] = [];
  if(!STATE.chats[userB]) STATE.chats[userB] = {};
  if(!STATE.chats[userB][userA]) STATE.chats[userB][userA] = [];
}

function sendMessage(targetUid, text){
  if(!CURRENT_USER) return alert('Login to send messages');
  ensureChat(CURRENT_USER.uid, targetUid);
  const msg = { from: CURRENT_USER.uid, to: targetUid, text, ts: Date.now() };
  STATE.chats[CURRENT_USER.uid][targetUid].push(msg);
  STATE.chats[targetUid][CURRENT_USER.uid].push(msg);
  saveState();
  loadMessages(targetUid);
}

function loadMessages(withUid){
  if(!CURRENT_USER) return;
  ensureChat(CURRENT_USER.uid, withUid);
  const box = document.getElementById('chatMessages');
  if(!box) return;
  box.innerHTML = '';
  const msgs = STATE.chats[CURRENT_USER.uid][withUid] || [];
  msgs.forEach(m => {
    const div = document.createElement('div');
    div.style.padding = '8px';
    div.style.marginBottom = '6px';
    div.style.background = m.from === CURRENT_USER.uid ? 'linear-gradient(90deg,var(--accent1),var(--accent2))' : 'rgba(255,255,255,0.04)';
    div.style.borderRadius = '8px';
    div.innerText = (m.from === CURRENT_USER.uid ? 'You: ' : '') + m.text;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

function renderChatUsers(){
  const list = document.getElementById("chatUserList");
  if(!list || !CURRENT_USER) return;
  list.innerHTML = "";

  STATE.users.forEach(u=>{
    if(u.uid === CURRENT_USER.uid) return;
    const div = document.createElement("div");
    div.style.padding = "8px";
    div.style.cursor = "pointer";
    div.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    div.innerText = u.name;
    div.addEventListener("click", ()=> {
      CURRENT_CHAT_TARGET = u.uid;
      loadMessages(u.uid);
    });
    list.appendChild(div);
  });
}

document.getElementById("sendChatBtn")?.addEventListener("click", ()=>{
  const text = document.getElementById("chatInput")?.value.trim();
  if(!text || !CURRENT_CHAT_TARGET) return alert('Select a user and enter a message');
  sendMessage(CURRENT_CHAT_TARGET, text);
  document.getElementById("chatInput").value = "";
});
