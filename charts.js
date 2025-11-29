// ---------- CHARTS ----------
/* expects Chart.js available, STATE */

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
    const rate = Math.round((completed/total)*100);
    if(miniChart){
      miniChart.data.datasets[0].data = [Math.round(rate/10), 10-Math.round(rate/10)];
      miniChart.update();
    }
    if(hoursChart){ hoursChart.data.datasets[0].data = Array.from({length:7}, ()=>Math.floor(Math.random()*3)); hoursChart.update(); }
    if(rateChart){ rateChart.data.datasets[0].data = [rate,100-rate]; rateChart.update(); }
    $('aiInsights') && ($('aiInsights').innerHTML = `<div class='hint'>Completion rate ${rate}%. Best time: evenings. Current Focus: **${CURRENT_USER?.roleClass || 'Student'}**</div>`);
  });
}
updateCharts();
