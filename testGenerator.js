// ---------- AI TEST PAGE LOGIC ----------
/* expects: callBackendOrSimulate(), renderAnalysisResult(), STATE, saveState(), renderTasks() */

function buildAnalysisPayload({title, subject, text, file, mode}) {
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
  try {
    const resp = await fetch('/api/analyze', { method: 'POST', body: formData, timeout: 30000 });
    if(!resp.ok) throw new Error('Backend responded with ' + resp.status);
    const json = await resp.json();
    if(json && json.detected_subject) return json;
    throw new Error('Invalid backend response');
  } catch (err) {
    const payload = {};
    for (const pair of formData.entries()) payload[pair[0]] = pair[1];
    return simulateAnalysis(payload);
  }
}

function simulateAnalysis(payload) {
  const title = payload.title || 'Untitled Chapter';
  const subject = payload.subject || 'General';
  const text = (payload.text || '').slice(0,2000);
  const mode = payload.mode || (payload.filename ? 'exam' : 'notes');

  const keywords = ['theorem','definition','proof','derivation','entropy','thermodynamics','ohm','integration','derivative','matrix','transformer','rms'];
  const found = [];
  for(const k of keywords){
    if(text.toLowerCase().includes(k) && found.length < 6) found.push(k.charAt(0).toUpperCase() + k.slice(1));
  }
  if(found.length===0) found.push(`${subject} Core Concepts`, 'Important Formulae', 'Typical Problem Types');

  const important_topics = found.slice(0,5).map((t,i) => ({
    topic: t + (i===0 && title ? ` — ${title}` : ''),
    reason: `High exam relevance (${t}).`,
    verified: true
  }));

  const weak_topics = mode === 'exam' ? important_topics.slice(0,3).map(t => t.topic) : [];

  const generated_questions = [];
  const answers = [];
  important_topics.forEach((T, idx) => {
    const base = T.topic;
    const qset = [];
    qset.push({ q: `Explain the core idea of ${base}.`, difficulty: 'Easy', type: 'conceptual' });
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
      item.innerHTML = `Topic: <strong>${esc(t.topic)}</strong>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="hint small" style="max-width:320px">${esc(t.reason)}</div>
          <button class="btn small" data-idx="${i}" style="padding:4px 8px">${t.verified ? 'Verified' : 'Unverified'}</button>
        </div>`;
      aiTopicsEl.appendChild(item);
      item.addEventListener('click', ()=> {
        t.verified = !t.verified;
        result.verified_topics = result.important_topics.filter(pp => pp.verified).map(pp => pp.topic);
        renderAnalysisResult(result);
      });
    });
  }

  const qEl = document.getElementById('testQuestions');
  if(qEl){
    qEl.innerHTML = '';
    result.generated_questions.forEach((g, gi)=>{
      const sec = document.createElement('div');
      sec.style.borderTop = '1px solid rgba(255,255,255,0.08)';
      sec.style.padding = '8px';
      sec.innerHTML = `<strong style="display:block">${esc(g.topic)}</strong>`;
      g.questions.forEach((q, qi)=>{
        const idx = gi*10 + qi + 1;
        const qdiv = document.createElement('div');
        qdiv.style.padding = '8px 0';
        qdiv.innerHTML = `<div><strong>Q${idx} (${esc(q.difficulty)})</strong>: ${esc(q.q)}</div>
                        <div class="hint small" style="margin-top:6px">Answer: ${esc(result.answers[gi*3+qi].answer_short)}</div>`;
        sec.appendChild(qdiv);
      });
      qEl.appendChild(sec);
    });
  }
}

document.getElementById('generateTestBtn')?.addEventListener('click', async () => {
  const title = (document.getElementById('testTitle')?.value || '').trim() || 'Untitled Chapter';
  const subject = document.getElementById('testSubject')?.value || 'General';
  const text = (document.getElementById('testText')?.value || '').trim();
  const fileInput = document.getElementById('testFile');
  const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  const mode = file ? 'exam' : (text.length < 60 ? 'notes' : 'notes');

  if(!text && !file) return alert('Please provide notes or upload a file.');

  alert(`Analyzing "${title}"...`);
  const formData = new FormData();
  formData.append('title', title);
  formData.append('subject', subject);
  formData.append('text', text);
  formData.append('mode', mode);
  if(file) formData.append('file', file);

  const result = await callBackendOrSimulate(formData);
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
  const suggested = (finalTest.suggested_tasks && finalTest.suggested_tasks[0]) || { title: `Revision: ${finalTest.detected_chapter}`, subject: finalTest.detected_subject, duration_min: 45 };
  if(window.STATE && Array.isArray(window.STATE.tasks)){
    window.STATE.tasks.push({ title: suggested.title, subject: suggested.subject || 'General', done: false, created: Date.now(), due: null });
    try{ window.saveState && window.saveState(); }catch(e){}
    try{ window.renderTasks && window.renderTasks(); window.renderCalendar && window.renderCalendar(); window.updateCharts && window.updateCharts(); }catch(e){}
    alert(`Added task: "${suggested.title}"`);
  }
});
