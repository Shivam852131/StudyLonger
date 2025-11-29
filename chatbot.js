// ---------- ADVANCED CHATBOT ----------
/* StudyBot knowledge base and reply logic */

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
    "Create a mock test schedule. Simulate exam conditions.",
    "Analyze past papers. 80% of questions follow predictable patterns.",
    "Group study (2-3 people) improves concept clarity by 40%.",
    "Review mistakes immediately. This fixes misconceptions.",
    "Practice mental imagery. Visualize solving problems before attempting."
  ],
  motivation: [
    "🚀 Every expert was once a beginner. You're progressing!",
    "💎 Consistency beats intensity. Small daily efforts = massive results.",
    "🌟 Progress > Perfection. Focus on improvement, not comparison.",
    "⚡ Your effort today = Your opportunities tomorrow.",
    "🎯 You're closer than you think. Keep pushing!"
  ],
  time_management: [
    "Use time blocking: Assign specific subjects to specific hours.",
    "Identify your peak focus time (morning/afternoon/evening).",
    "Schedule breaks before burnout: 90 mins focus → 15 min break.",
    "Batch similar tasks together (all math problems, then all reading).",
    "Use the 80/20 rule: Focus on 20% of topics that give 80% results."
  ]
};

function botReply(message, el){
  if(!message) return appendChat(el, "👋 Hi! I'm StudyBot. I can help with study plans, exam prep, motivation, time management, and general knowledge. What would you like?");
  
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
    "how do": "Here's the approach: (1) Understand the theory, (2) See examples, (3) Practice variations, (4) Test your understanding. Try this method!",
    "why is": "Understanding the 'why' is key to deep learning! This involves cause-effect relationships. Can you relate it to something you already know?",
    "can you": "I can help guide you! For detailed answers, consult your textbook or teacher. But I can definitely help you develop a study strategy for this.",
    "tell me": "Sure! That's an important topic. The key concepts are: foundation → application → practice. Which part would you like to focus on?"
  };
  
  let matched = false;
  for (let key in qaResponses) {
    if (message.includes(key)) {
      appendChat(el, qaResponses[key]);
      matched = true;
      break;
    }
  }
  
  if (!matched) {
    const fallbacks = [
      "🤔 That's an interesting question! Can you be more specific? I can help with study strategies, exam prep, time management, or motivation.",
      "💡 I'm here to help with your studies! Try asking about: study tips, exam prep, motivation, or how you're progressing.",
      "📚 Let me help you learn better! What aspect of your studies would you like to focus on?",
      "🎯 That's a good question. For complex topics, use active recall and practice. What subject are you studying?"
    ];
    appendChat(el, fallbacks[Math.floor(Math.random() * fallbacks.length)]);
  }
}

function appendChat(el, text, who='bot'){
  if(!el) return;
  const b = document.createElement('div'); 
  b.className = 'bubble ' + (who==='user'? 'user':'bot'); 
  b.innerText = text;
  el.appendChild(b); 
  el.scrollTop = el.scrollHeight;
}

// Inline chat senders
$('chatSend')?.addEventListener('click', ()=>{
  const m = ($('chatInput')?.value || '').trim();
  if(!m) return;
  appendChat($('chatBody'), m, 'user');
  $('chatInput').value='';
  setTimeout(()=> botReply(m, $('chatBody')), 600);
});

$('chatSendInline')?.addEventListener('click', ()=>{
  const m = ($('chatInputInline')?.value || '').trim();
  if(!m) return;
  appendChat($('chatBodyInline'), m, 'user');
  $('chatInputInline').value='';
  setTimeout(()=> botReply(m, $('chatBodyInline')), 600);
});
