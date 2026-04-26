let D = [];
let CAT = 'all', OPENED = new Set();

function buildCats(){
  const el=document.getElementById('catlist');
  const tot=D.reduce((a,s)=>a+s.q.length,0);
  let h=`<div class="ci${CAT==='all'?' act':''}" onclick="setC('all')"><span>كل الأسئلة</span><span class="cc">${tot}</span></div>`;
  D.forEach(s=>{
    h+=`<div class="ci${CAT===s.id?' act':''}" onclick="setC('${s.id}')"><div class="dot" style="background:${s.color}"></div><span>${s.ar}</span><span class="cc">${s.q.length}</span></div>`;
  });
  el.innerHTML=h;
}

function setC(id){CAT=id;buildCats();render();}

function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function render(){
  const srch=document.getElementById('srch').value.toLowerCase().trim();
  const c=document.getElementById('mn');
  let html='', qn=0;
  D.filter(s=>CAT==='all'||s.id===CAT).forEach(sec=>{
    const qs=sec.q.filter(q=>!srch||(q.q+' '+(q.a||'')).toLowerCase().includes(srch));
    if(!qs.length)return;
    qn+=qs.length;
    html+=`<div class="sg"><div class="sh"><div class="si" style="background:${sec.color}22;color:${sec.color}">${sec.icon}</div><div><div class="st">${sec.ar}</div><div class="se">${sec.en}</div></div><div class="sbg">${qs.length} سؤال</div></div>`;
    qs.forEach((q,i)=>{
      const id=sec.id+'-'+i;
      const isO=OPENED.has(id);
      const lc=q.l==='b'?'lb':q.l==='m'?'lm':'la';
      const lt=q.l==='b'?'أساسي':q.l==='m'?'متوسط':'متقدم';
      let body='';
      if(q.a)body+=`<div class="ans">${q.a}</div>`;
      if(q.code)body+=`<pre class="code">${escHtml(q.code)}</pre>`;
      if(q.tip)body+=`<div class="tip">💡 ${q.tip}</div>`;
      if(q.wrn)body+=`<div class="wrn">⚠️ ${q.wrn}</div>`;
      html+=`<div class="qa${isO?' op':''}" id="c${id}"><button class="qb" onclick="tog('${id}')"><span class="qn">${String(i+1).padStart(3,'0')}</span><span class="qq">${q.q}</span><div class="qm"><span class="lv ${lc}">${lt}</span><span class="ar">▼</span></div></button><div class="qbd">${body}</div></div>`;
    });
    html+=`</div>`;
  });
  if(!html)html='<div class="nores">🔍 مفيش نتائج</div>';
  c.innerHTML=html;
  document.getElementById('tq').textContent=qn;
  updP();
}

function tog(id){
  const c=document.getElementById('c'+id);
  if(!c)return;
  const isO=c.classList.contains('op');
  if(isO){c.classList.remove('op');OPENED.delete(id);}
  else{c.classList.add('op');OPENED.add(id);}
  document.getElementById('oq').textContent=OPENED.size;
  updP();
}

function updP(){
  const tot=D.reduce((a,s)=>a+s.q.length,0);
  const p=tot?Math.round(OPENED.size/tot*100):0;
  document.getElementById('pf').style.width=p+'%';
  document.getElementById('pct').textContent=p+'%';
  document.getElementById('pcl').textContent=`${OPENED.size} من ${tot}`;
}

fetch('data.json')
  .then(r=>r.json())
  .then(json=>{
    D=json;
    buildCats();
    render();
  })
  .catch(err=>{
    document.getElementById('mn').innerHTML='<div class="nores">⚠️ تعذر تحميل البيانات: '+err.message+'</div>';
  });
