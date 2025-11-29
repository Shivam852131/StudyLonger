// ---------- AUTH (signup / login / logout / photo upload) ----------
/* expects: STATE, saveState(), saveAuthLocal(), loadAuthLocal(), CURRENT_USER, updateProfileUI(), renderChatUsers(), renderAdminStudents(), showPage() */

document.getElementById('signupBtn')?.addEventListener('click', ()=> {
  const name = ($('signupName')?.value || '').trim();
  const email = ($('signupEmail')?.value || '').trim();
  const pass = ($('signupPass')?.value || '').trim();
  const college = ($('signupCollege')?.value || '').trim();
  const roleClass = ($('signupRoleClass')?.value || '').trim();

  if(!name || !email || !pass || !roleClass) return alert('Fill all required fields');

  CURRENT_USER = { uid: ''+Date.now(), name, email, role:'Student', college, roleClass, xp: 0 };
  STATE.users.push(CURRENT_USER);
  saveAuthLocal(CURRENT_USER);
  saveState();
  updateProfileUI();
  alert('Account created! Please login.');
  showPage('login');
});

document.getElementById('loginBtn')?.addEventListener('click', ()=> {
  const email = ($('loginEmail')?.value || '').trim();
  const pass = ($('loginPass')?.value || '').trim();
  if(!email || !pass) return alert('Enter credentials');
  const demo = STATE.users.find(u => u.email === email);
  if(!demo) return alert('User not found. Create an account first.');
  CURRENT_USER = demo;
  saveAuthLocal(CURRENT_USER);
  updateProfileUI();
  renderChatUsers();
  renderAdminStudents();
  showPage('profile');
  alert('Logged in successfully!');
});

document.getElementById('logoutBtn')?.addEventListener('click', ()=> {
  CURRENT_USER = null;
  saveAuthLocal(null);
  updateProfileUI();
  showPage('home');
  alert('Signed out');
});

document.getElementById('uploadPhoto')?.addEventListener('click', ()=> {
  const f = $('photoFile')?.files?.[0];
  if(!f) return alert('Choose a file');
  const reader = new FileReader();
  reader.onload = () => {
    if(CURRENT_USER){ CURRENT_USER.photoURL = reader.result; saveAuthLocal(CURRENT_USER); updateProfileUI(); alert('Photo uploaded!'); }
  };
  reader.readAsDataURL(f);
});
