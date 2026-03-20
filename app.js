'use strict';

/* ================================================
   Supabase 初期化
================================================ */
const SUPABASE_URL = 'https://utjtlrmvleagdypcnfky.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0anRscm12bGVhZ2R5cGNuZmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODgzNTksImV4cCI6MjA4OTU2NDM1OX0.CoE2ZNMHZGaVBjsq28uAMt0bRg4RzfNtDiOKcH8huOM';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentProfile = null;

/* ================================================
   RPG システム
================================================ */
const RPG = {
  getLevel(xp) {
    const t = [0,50,150,300,500,800,1200,1800,2500,3500];
    return t.findIndex((v,i)=>xp<(t[i+1]||Infinity))+1 || 10;
  },
  getClass(lv) {
    return ['🗡️ 見習い剣士','⚔️ 剣士','🛡️ 戦士','🏹 弓騎士','🔥 魔法剣士','⭐ 英雄','💎 聖騎士','🐉 竜騎士','👑 大魔王','🏯 歴史王'][Math.min(lv-1,9)];
  },
  xpToNext(lv) {
    return [50,150,300,500,800,1200,1800,2500,3500,9999][Math.min(lv-1,9)];
  },
  xpBase(lv) {
    return [0,50,150,300,500,800,1200,1800,2500,3500][Math.min(lv-1,9)];
  },
  enemies: [
    {name:'年号ゴブリン',emoji:'👹'},{name:'歴史スライム',emoji:'🟢'},
    {name:'時空龍',emoji:'🐉'},{name:'古文書の亡霊',emoji:'👻'},
    {name:'忘却の魔王',emoji:'😈'},{name:'暗黒騎士',emoji:'🦹'},
    {name:'年表ゴーレム',emoji:'🗿'},{name:'記憶の怪物',emoji:'🧟'},
  ],
  randomEnemy() { return this.enemies[Math.floor(Math.random()*this.enemies.length)]; },
  updateHeader() {
    if (!currentProfile) return;
    const xp = currentProfile.xp || 0;
    const lv = this.getLevel(xp);
    document.getElementById('headerClass').textContent = this.getClass(lv);
    document.getElementById('headerLv').textContent = `Lv.${lv}`;
    document.getElementById('headerXP').textContent = xp;
    const pct = ((xp - this.xpBase(lv)) / (this.xpToNext(lv) - this.xpBase(lv))) * 100;
    document.getElementById('headerXPBar').style.width = `${Math.min(pct,100)}%`;
    document.getElementById('pbName').textContent = this.getClass(lv);
  }
};

/* ================================================
   Auth UI
================================================ */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('loginForm').style.display = tab==='login'?'block':'none';
  document.getElementById('signupForm').style.display = tab==='signup'?'block':'none';
  document.querySelector(`.auth-tab:${tab==='login'?'first':'last'}-child`).classList.add('active');
  document.getElementById('authError').textContent = '';
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.textContent = '接続中...';
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    document.getElementById('authError').textContent = 'ログイン失敗: ' + error.message;
    btn.disabled = false; btn.textContent = '冒険を始める';
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById('signupBtn');
  btn.disabled = true; btn.textContent = '登録中...';
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const { error } = await sb.auth.signUp({
    email, password,
    options: { data: { display_name: name } }
  });
  if (error) {
    document.getElementById('authError').textContent = '登録失敗: ' + error.message;
    btn.disabled = false; btn.textContent = '登録して冒険へ';
  } else {
    document.getElementById('authError').style.color = 'var(--ok)';
    document.getElementById('authError').textContent = '✅ 確認メールを送信しました！メールを確認後ログインしてください。';
    btn.disabled = false; btn.textContent = '登録して冒険へ';
  }
}

async function logout() {
  await sb.auth.signOut();
}

/* ================================================
   Main Init
================================================ */
sb.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    currentUser = session.user;
    await loadProfile();
    showScreen('screen-main');
    await loadData();
    loadRecords();
  } else {
    currentUser = null;
    currentProfile = null;
    showScreen('screen-auth');
  }
});

async function loadProfile() {
  const { data } = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
  if (data) {
    currentProfile = data;
  } else {
    // フォールバック作成
    const name = currentUser.user_metadata?.display_name || '冒険者';
    const { data: newProfile } = await sb.from('profiles')
      .upsert({ id: currentUser.id, display_name: name, xp: 0, level: 1 }, { onConflict: 'id' })
      .select().single();
    currentProfile = newProfile || { id: currentUser.id, display_name: name, xp: 0, level: 1 };
  }
  RPG.updateHeader();
}

/* ================================================
   Data（Supabase）
================================================ */
let localData = [];

async function loadData() {
  const { data, error } = await sb.from('quiz_data').select('*').eq('user_id', currentUser.id).order('year');
  if (!error) {
    localData = data || [];
    renderDataList();
  }
}

async function addEntry(year, event) {
  const y = Number(year); const e = String(event).trim();
  if (!y || !e) return false;
  if (localData.some(d => d.year === y && d.event === e)) return false;
  const { data, error } = await sb.from('quiz_data')
    .insert({ user_id: currentUser.id, year: y, event: e })
    .select().single();
  if (!error && data) { localData.push(data); return true; }
  return false;
}

async function deleteEntry(id) {
  await sb.from('quiz_data').delete().eq('id', id).eq('user_id', currentUser.id);
  localData = localData.filter(d => d.id !== id);
  renderDataList();
}

async function clearAllData() {
  if (!confirm('全データを削除しますか？')) return;
  await sb.from('quiz_data').delete().eq('user_id', currentUser.id);
  localData = [];
  renderDataList();
  showToast('🗑️ 全データを削除しました');
}

function renderDataList() {
  const list = document.getElementById('dataList');
  document.getElementById('dataCount').textContent = localData.length;
  if (!localData.length) {
    list.innerHTML = '<div class="empty-st">まだ知識がありません。巻物をアップロードしましょう。</div>';
  } else {
    list.innerHTML = '';
    localData.forEach(item => {
      const d = document.createElement('div');
      d.className = 'd-item';
      d.innerHTML = `<span class="d-year">${item.year}年</span><span>${item.event}</span><button class="d-del" onclick="deleteEntry(${item.id})">✕</button>`;
      list.appendChild(d);
    });
  }
  const has = localData.length > 0;
  ['btnQ1','btnQ2','btnQ3'].forEach(id => document.getElementById(id).disabled = !has);
}

async function manualAdd() {
  const y = document.getElementById('manualYear');
  const e = document.getElementById('manualEvent');
  const added = await addEntry(y.value, e.value);
  if (added) { y.value=''; e.value=''; renderDataList(); showToast('📜 知識を記録しました'); }
  else showToast('⚠️ 追加できませんでした（重複または不正）');
}

function exportData() {
  const blob = new Blob([JSON.stringify(localData.map(d=>({year:d.year,event:d.event})),null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`history-quest-${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url); showToast('💾 バックアップしました');
}

async function importData(e) {
  const file = e.target.files?.[0]; if (!file) return;
  try {
    const text = await file.text();
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error('配列形式ではありません');
    let added = 0;
    for (const it of arr) {
      const y = it.year ?? it.Year, ev = it.event ?? it.Event;
      if (y && ev && await addEntry(y, ev)) added++;
    }
    renderDataList();
    showToast(added ? `✅ ${added}件追加しました` : '⚠️ 新しいデータはありませんでした');
  } catch(err) { showToast('❌ 読込失敗: '+err.message); }
  e.target.value = '';
}

/* ================================================
   Records
================================================ */
async function saveRecord(mode, score, total, xpEarned, isPerfect) {
  await sb.from('quiz_records').insert({
    user_id: currentUser.id, mode, score, total, xp_earned: xpEarned, is_perfect: isPerfect
  });
}

async function loadRecords() {
  const { data } = await sb.from('quiz_records')
    .select('*').eq('user_id', currentUser.id)
    .order('created_at', { ascending: false }).limit(20);
  if (!data) return;
  const list = document.getElementById('recordsList');
  const total = data.length;
  const perfect = data.filter(r=>r.is_perfect).length;
  const totalXP = data.reduce((s,r)=>s+(r.xp_earned||0),0);
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPerfect').textContent = perfect;
  document.getElementById('statTotalXP').textContent = totalXP;
  if (!data.length) { list.innerHTML='<div class="empty-st">まだ記録がありません。クエストに挑みましょう！</div>'; return; }
  list.innerHTML = '';
  data.forEach(r => {
    const pct = Math.round((r.score/r.total)*100);
    const d = new Date(r.created_at);
    const dateStr = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    const div = document.createElement('div');
    div.className = 'rec-item';
    const modeLabel = r.mode==='yearToEvent'?'年号の試練':r.mode==='eventToYear'?'出来事の試練':'混沌の迷宮';
    div.innerHTML = `
      <div>
        <span class="rec-mode">${modeLabel}</span>
        ${r.is_perfect?'<span class="rec-perfect"> ✨満点</span>':''}
        <div class="rec-date">${dateStr}</div>
      </div>
      <div style="text-align:right">
        <span class="rec-score ${pct===100?'rec-perfect':''}">${pct}%</span>
        <div class="rec-date">+${r.xp_earned||0}XP</div>
      </div>
    `;
    list.appendChild(div);
  });
}

/* ================================================
   PDF / OCR
================================================ */
const PDFProcessor = {
  async toImageBlobs(file, onProgress) {
    const pdf = await pdfjsLib.getDocument({data: await file.arrayBuffer()}).promise;
    const blobs=[]; const c=document.createElement('canvas'); const ctx=c.getContext('2d');
    for (let i=1;i<=pdf.numPages;i++) {
      onProgress(i,pdf.numPages);
      const pg=await pdf.getPage(i); const vp=pg.getViewport({scale:2});
      c.width=vp.width; c.height=vp.height;
      await pg.render({canvasContext:ctx,viewport:vp}).promise;
      blobs.push(await new Promise(r=>c.toBlob(r,'image/png')));
    }
    return blobs;
  },
  isPDF(f){ return f.type==='application/pdf'||f.name.endsWith('.pdf'); }
};

async function processFiles(files) {
  const wrap=document.getElementById('ocrWrap');
  const bar=document.getElementById('ocrBar');
  const txt=document.getElementById('ocrStatus');
  wrap.classList.add('visible');
  const blobs=[];
  for (const f of files) {
    if (PDFProcessor.isPDF(f)) {
      const pb=await PDFProcessor.toImageBlobs(f,(p,t)=>txt.textContent=`PDF展開中 (${p}/${t})`);
      blobs.push(...pb);
    } else blobs.push(f);
  }
  let worker=null;
  try {
    txt.textContent='OCR初期化中...';
    worker=await Tesseract.createWorker(['jpn','eng']);
    let added=0;
    for (let i=0;i<blobs.length;i++) {
      bar.style.width=`${(i/blobs.length)*100}%`;
      txt.textContent=`文字解読中 (${i+1}/${blobs.length})`;
      const {data:{text}}=await worker.recognize(blobs[i]);
      for (const line of text.split(/\r?\n/)) {
        const m=line.match(/(\d{1,4})\s*[年\s]+(.{3,})/);
        if (m) {const ok=await addEntry(parseInt(m[1]),m[2].replace(/^[年\s:：]+/,'').trim()); if(ok) added++;}
      }
    }
    renderDataList();
    showToast(added?`✅ ${added}件の知識を獲得！`:'📖 新しいデータは見つかりませんでした');
  } finally {
    if (worker) await worker.terminate();
    wrap.classList.remove('visible');
    bar.style.width='0%';
  }
}

/* ================================================
   Quiz Engine
================================================ */
let curMode='random', quizList=[], quizIndex=0, quizScore=0, reviewData=[], playerHP=5, maxHP=5;

function startQuiz(mode) {
  if (!localData.length) return;
  curMode = mode;
  const shuffled=[...localData].sort(()=>Math.random()-.5).slice(0,10);
  quizList = shuffled.map(item=>{
    let type = mode==='yearToEvent'?1:mode==='eventToYear'?2:(Math.random()>.5?1:2);
    return {...item, type, pattern: type===1?'年号の試練':'出来事の試練'};
  });
  quizIndex=0; quizScore=0; reviewData=[]; playerHP=5; maxHP=5;
  document.getElementById('battleLog').innerHTML='<div>⚔️ バトル開始！歴史の迷宮へ！</div>';
  showScreen('screen-battle');
  renderQuestion();
}

function renderQuestion() {
  const q=quizList[quizIndex];
  const enemy=RPG.randomEnemy();
  const sp=document.getElementById('enemySprite');
  sp.textContent=enemy.emoji; sp.className='enemy-sprite';
  document.getElementById('enemyName').textContent=enemy.name;
  const rem=quizList.length-quizIndex;
  document.getElementById('enemyHP').style.width=`${(rem/quizList.length)*100}%`;
  document.getElementById('battleBadge').textContent=q.pattern;
  document.getElementById('battleQ').innerHTML = q.type===1
    ? `⚡ <span style="color:var(--gold);font-size:1.3em">${q.year}年</span> に何が起きた？`
    : `⚡ <span style="color:var(--gold)">${q.event}</span> は何年？`;
  const input=document.getElementById('battleInput');
  input.type=q.type===1?'text':'number';
  input.placeholder=q.type===1?'出来事を入力...':'西暦（数字）を入力...';
  input.value=''; input.disabled=false;
  document.getElementById('btnAttack').style.display='inline-flex';
  document.getElementById('btnNext').style.display='none';
  updatePlayerBar();
  setTimeout(()=>input.focus(),100);
}

function updatePlayerBar() {
  const pct=(playerHP/maxHP)*100;
  const fill=document.getElementById('playerHPBar');
  fill.style.width=`${pct}%`;
  fill.style.background=pct>50?'var(--green)':pct>25?'orange':'var(--err)';
  document.getElementById('pbHP').textContent=`HP ${playerHP}/${maxHP}`;
}

function addLog(msg, type) {
  const log=document.getElementById('battleLog');
  const d=document.createElement('div'); d.className=type; d.textContent=msg;
  log.appendChild(d); log.scrollTop=log.scrollHeight;
}

function checkAnswer() {
  const q=quizList[quizIndex];
  const ua=document.getElementById('battleInput').value.trim();
  const ok=q.type===1?(q.event.includes(ua)&&ua.length>1):(Number(ua)===q.year);
  document.getElementById('battleInput').disabled=true;
  document.getElementById('btnAttack').style.display='none';
  document.getElementById('btnNext').style.display='inline-flex';
  const sp=document.getElementById('enemySprite');
  if (ok) {
    quizScore++;
    sp.classList.add('hit'); setTimeout(()=>sp.classList.remove('hit'),400);
    addLog(`✨ 正解！${q.year}年「${q.event}」の攻撃が命中！`,'log-ok');
  } else {
    playerHP--;
    const pb=document.querySelector('.player-bar');
    pb.classList.add('shake'); setTimeout(()=>pb.classList.remove('shake'),300);
    addLog(`💥 不正解... 正解は${q.year}年「${q.event}」。ダメージ！`,'log-ng');
    updatePlayerBar();
  }
  reviewData.push({...q, userAnswer:ua, isCorrect:ok});
}

function nextQuestion() {
  quizIndex++;
  if (quizIndex<quizList.length && playerHP>0) {
    renderQuestion();
  } else {
    document.getElementById('enemySprite').classList.add('dead');
    setTimeout(showResult, 700);
  }
}

async function showResult() {
  showScreen('screen-result');
  const total=quizList.length;
  const wrong=total-quizScore;
  const isPerfect=quizScore===total;
  const isDefeat=playerHP<=0;
  const xpGained=quizScore*10+(isPerfect?50:0);

  // XP保存
  const newXP=(currentProfile.xp||0)+xpGained;
  const oldLv=RPG.getLevel(currentProfile.xp||0);
  const newLv=RPG.getLevel(newXP);
  const lvUp=newLv>oldLv;
  await sb.from('profiles').update({xp:newXP,level:newLv,updated_at:new Date().toISOString()}).eq('id',currentUser.id);
  currentProfile.xp=newXP; currentProfile.level=newLv;
  RPG.updateHeader();

  // 記録保存
  await saveRecord(curMode,quizScore,total,xpGained,isPerfect);
  loadRecords();

  // UI
  const icon=document.getElementById('rIcon');
  const title=document.getElementById('rTitle');
  const sub=document.getElementById('rSub');
  if (isPerfect) {
    icon.textContent='🏆'; title.textContent='PERFECT!'; title.className='result-title win';
    sub.textContent='全問正解！伝説の勇者！';
    confetti({particleCount:200,spread:80,colors:['#ffd764','#ffe99a','#fff','#c9a227']});
    setTimeout(()=>confetti({particleCount:80,spread:60,origin:{x:.2,y:.6}}),500);
    setTimeout(()=>confetti({particleCount:80,spread:60,origin:{x:.8,y:.6}}),1000);
    setTimeout(showCert,2000);
  } else if (isDefeat) {
    icon.textContent='💀'; title.textContent='DEFEAT...'; title.className='result-title lose';
    sub.textContent='HPが尽きた...もう一度挑もう！';
  } else {
    icon.textContent='⚔️'; title.textContent='VICTORY!'; title.className='result-title win';
    sub.textContent=`${Math.round((quizScore/total)*100)}% クリア！`;
  }

  document.getElementById('rsCorrect').textContent=quizScore;
  document.getElementById('rsWrong').textContent=wrong;
  document.getElementById('rsXP').textContent=`+${xpGained}`;
  const lvArea=document.getElementById('lvUpArea');
  if (lvUp) { lvArea.style.display='block'; document.getElementById('lvUpText').textContent=`🎉 LEVEL UP! → Lv.${newLv} ${RPG.getClass(newLv)}`; }
  else lvArea.style.display='none';

  const wrongPanel=document.getElementById('wrongPanel');
  const wrongItems=reviewData.filter(r=>!r.isCorrect);
  if (wrongItems.length) { wrongPanel.style.display='block'; document.getElementById('wrongCount').textContent=wrongItems.length; }
  else wrongPanel.style.display='none';

  const rList=document.getElementById('reviewList'); rList.innerHTML='';
  reviewData.forEach(r=>{
    const d=document.createElement('div');
    d.style.cssText='padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:.82rem';
    d.innerHTML=`<div style="display:flex;justify-content:space-between"><span>${r.year}年: ${r.event}</span><span style="color:${r.isCorrect?'var(--ok)':'var(--err)'}">${r.isCorrect?'○':'×'}</span></div><div style="font-size:.7rem;color:var(--txt3)">回答: ${r.userAnswer||'未回答'}</div>`;
    rList.appendChild(d);
  });
}

function retryWrong() {
  const wd=reviewData.filter(r=>!r.isCorrect).map(w=>({...w}));
  if (!wd.length) return;
  curMode=curMode; quizList=wd.map(item=>{let type=item.type; return {...item,type,pattern:type===1?'年号の試練':'出来事の試練'};});
  quizIndex=0; quizScore=0; reviewData=[]; playerHP=5; maxHP=5;
  document.getElementById('battleLog').innerHTML='<div>🔥 再戦！弱点克服！</div>';
  showScreen('screen-battle'); renderQuestion();
}

function exportWrong() {
  const wd=reviewData.filter(r=>!r.isCorrect).map(w=>({year:w.year,event:w.event}));
  if (!wd.length) return;
  const blob=new Blob([JSON.stringify(wd,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`weak-${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url); showToast('💾 弱点リストを保存しました');
}

/* ================================================
   Certificate
================================================ */
function showCert() {
  const now=new Date();
  document.getElementById('certName').textContent=`${currentProfile?.display_name||'冒険者'} 殿`;
  document.getElementById('certDate').textContent=`令和${now.getFullYear()-2018}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分`;
  const o=document.getElementById('certOverlay'); o.style.display='flex'; o.classList.add('active');
}
function closeCert() {
  const o=document.getElementById('certOverlay'); o.classList.remove('active'); setTimeout(()=>o.style.display='none',400);
}

/* ================================================
   UI helpers
================================================ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
  if (tab==='records') loadRecords();
}
function goHome() { showScreen('screen-main'); switchTab('quest'); }
function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500);
}

/* ================================================
   Init
================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('fileInput').addEventListener('change', e=>processFiles(Array.from(e.target.files)));
  document.getElementById('importInput').addEventListener('change', importData);
  document.getElementById('battleInput').addEventListener('keydown', e=>{
    if (e.key==='Enter'&&document.getElementById('btnAttack').style.display!=='none') checkAnswer();
  });
});
