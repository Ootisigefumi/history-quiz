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
   初期データ（100問・10ステージ）
================================================ */
const INITIAL_DATA = [
  {year:239,event:'邪馬台国の卑弥呼が魏に使いを送る'},
  {year:538,event:'百済から仏教が伝来する'},
  {year:593,event:'聖徳太子が推古天皇の摂政になる'},
  {year:607,event:'遣隋使として小野妹子を送る'},
  {year:645,event:'大化の改新で中大兄皇子、中臣鎌足が蘇我氏を倒す'},
  {year:672,event:'壬申の乱'},
  {year:701,event:'大宝律令'},
  {year:710,event:'元明天皇が平城京に遷都'},
  {year:723,event:'三世一身の法'},
  {year:743,event:'墾田永年私財法'},
  {year:794,event:'桓武天皇が平安京に遷都'},
  {year:894,event:'遣唐使廃止'},
  {year:939,event:'平将門の乱'},
  {year:939,event:'藤原純友の乱'},
  {year:1016,event:'藤原道長が摂政'},
  {year:1086,event:'白河上皇の院政開始'},
  {year:1156,event:'保元の乱'},
  {year:1159,event:'平治の乱'},
  {year:1167,event:'平清盛が太政大臣'},
  {year:1185,event:'壇ノ浦の戦い・守護地頭'},
  {year:1192,event:'源頼朝が征夷大将軍に任命された'},
  {year:1221,event:'後鳥羽上皇が承久の乱を起こした'},
  {year:1232,event:'北条泰時が御成敗式目を制定'},
  {year:1274,event:'文永の役'},
  {year:1281,event:'弘安の役'},
  {year:1333,event:'鎌倉幕府滅亡'},
  {year:1334,event:'後醍醐天皇の建武の新政'},
  {year:1338,event:'足利尊氏が室町幕府を開く'},
  {year:1392,event:'足利義満による南北朝統一'},
  {year:1428,event:'正長の土一揆'},
  {year:1467,event:'応仁の乱'},
  {year:1485,event:'山城の国一揆'},
  {year:1488,event:'加賀一向一揆'},
  {year:1543,event:'ポルトガル人が種子島に鉄砲伝来'},
  {year:1549,event:'キリスト教伝来'},
  {year:1573,event:'室町幕府滅亡'},
  {year:1575,event:'長篠の戦い'},
  {year:1582,event:'本能寺の変'},
  {year:1588,event:'刀狩'},
  {year:1590,event:'全国統一'},
  {year:1600,event:'関ヶ原の戦い'},
  {year:1603,event:'江戸幕府成立'},
  {year:1615,event:'武家諸法度'},
  {year:1635,event:'参勤交代'},
  {year:1637,event:'島原の乱'},
  {year:1639,event:'鎖国完成'},
  {year:1716,event:'享保の改革'},
  {year:1772,event:'田沼意次'},
  {year:1787,event:'寛政の改革'},
  {year:1825,event:'異国船打払令'},
  {year:1837,event:'大塩平八郎の乱'},
  {year:1841,event:'天保の改革'},
  {year:1853,event:'ペリー来航'},
  {year:1854,event:'日米和親条約'},
  {year:1858,event:'日米修好通商条約'},
  {year:1860,event:'桜田門外の変'},
  {year:1866,event:'薩長同盟'},
  {year:1867,event:'大政奉還'},
  {year:1868,event:'五箇条の御誓文'},
  {year:1871,event:'廃藩置県'},
  {year:1872,event:'学制発布'},
  {year:1873,event:'地租改正'},
  {year:1877,event:'西南戦争'},
  {year:1881,event:'自由民権運動'},
  {year:1885,event:'内閣制度'},
  {year:1889,event:'大日本帝国憲法'},
  {year:1890,event:'帝国議会'},
  {year:1894,event:'日清戦争'},
  {year:1895,event:'下関条約'},
  {year:1901,event:'八幡製鉄所'},
  {year:1902,event:'日英同盟'},
  {year:1904,event:'日露戦争'},
  {year:1905,event:'ポーツマス条約'},
  {year:1910,event:'韓国併合'},
  {year:1911,event:'関税自主権回復'},
  {year:1914,event:'第一次世界大戦'},
  {year:1915,event:'二十一か条の要求'},
  {year:1917,event:'ロシア革命'},
  {year:1918,event:'米騒動'},
  {year:1920,event:'国際連盟'},
  {year:1923,event:'関東大震災'},
  {year:1925,event:'普通選挙法・治安維持法'},
  {year:1929,event:'世界恐慌'},
  {year:1931,event:'満州事変'},
  {year:1932,event:'五・一五事件'},
  {year:1933,event:'国際連盟脱退'},
  {year:1936,event:'二・二六事件'},
  {year:1937,event:'日中戦争'},
  {year:1938,event:'国家総動員法'},
  {year:1939,event:'第二次世界大戦'},
  {year:1941,event:'太平洋戦争'},
  {year:1945,event:'終戦'},
  {year:1950,event:'朝鮮戦争'},
  {year:1951,event:'サンフランシスコ平和条約'},
  {year:1956,event:'国連加盟'},
  {year:1964,event:'東京オリンピック'},
  {year:1972,event:'沖縄返還'},
  {year:1978,event:'日中平和友好条約'},
  {year:1990,event:'東西ドイツ統一'},
  {year:1995,event:'阪神淡路大震災'},
];

const STAGE_COUNT = 10;
const STAGE_SIZE = 10;

// ステージごとの時代名
const STAGE_LABELS = [
  '古代①','古代②','中世①','中世②','中世③',
  '近世①','近世②','近代①','近代②','現代'
];

function getStageItems(stageNum) {
  // stageNum: 1-indexed
  const start = (stageNum - 1) * STAGE_SIZE;
  return INITIAL_DATA.slice(start, start + STAGE_SIZE);
}

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
  xpToNext(lv) { return [50,150,300,500,800,1200,1800,2500,3500,9999][Math.min(lv-1,9)]; },
  xpBase(lv)   { return [0,50,150,300,500,800,1200,1800,2500,3500][Math.min(lv-1,9)]; },
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
   Auth
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
  const btn=document.getElementById('loginBtn'); btn.disabled=true; btn.textContent='接続中...';
  const {error}=await sb.auth.signInWithPassword({email:document.getElementById('loginEmail').value,password:document.getElementById('loginPassword').value});
  if(error){document.getElementById('authError').textContent='ログイン失敗: '+error.message;btn.disabled=false;btn.textContent='冒険を始める';}
}
async function handleSignup(e) {
  e.preventDefault();
  const btn=document.getElementById('signupBtn'); btn.disabled=true; btn.textContent='登録中...';
  const name=document.getElementById('signupName').value;
  const {error}=await sb.auth.signUp({email:document.getElementById('signupEmail').value,password:document.getElementById('signupPassword').value,options:{data:{display_name:name}}});
  if(error){document.getElementById('authError').textContent='登録失敗: '+error.message;}
  else{document.getElementById('authError').style.color='var(--ok)';document.getElementById('authError').textContent='✅ 確認メールを送信しました！';}
  btn.disabled=false; btn.textContent='登録して冒険へ';
}
async function logout() { await sb.auth.signOut(); }

/* ================================================
   Main Init
================================================ */
sb.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    currentUser = session.user;
    await loadProfile();
    showScreen('screen-main');
    await loadData();
    await loadStageProgress();
    loadRecords();
  } else {
    currentUser = null; currentProfile = null;
    showScreen('screen-auth');
  }
});

async function loadProfile() {
  const {data} = await sb.from('profiles').select('*').eq('id',currentUser.id).single();
  if (data) { currentProfile = data; }
  else {
    const name = currentUser.user_metadata?.display_name || '冒険者';
    const {data:np} = await sb.from('profiles').upsert({id:currentUser.id,display_name:name,xp:0,level:1},{onConflict:'id'}).select().single();
    currentProfile = np || {id:currentUser.id,display_name:name,xp:0,level:1};
  }
  RPG.updateHeader();
}

/* ================================================
   Stage Progress
================================================ */
let stageProgress = {}; // { 1: {cleared, best_score, attempts}, ... }
let selectedMode = 'yearToEvent';

async function loadStageProgress() {
  const {data} = await sb.from('stage_progress').select('*').eq('user_id', currentUser.id);
  stageProgress = {};
  if (data) { data.forEach(r => { stageProgress[r.stage] = r; }); }
  renderStageGrid();
}

async function saveStageProgress(stage, score, total, isPerfect) {
  const prev = stageProgress[stage];
  const attempts = (prev?.attempts || 0) + 1;
  const bestScore = Math.max(prev?.best_score || 0, score);
  const cleared = isPerfect || (prev?.cleared || false);

  const payload = { user_id: currentUser.id, stage, cleared, best_score: bestScore, attempts, updated_at: new Date().toISOString() };
  await sb.from('stage_progress').upsert(payload, { onConflict: 'user_id,stage' });
  stageProgress[stage] = { ...payload };
  renderStageGrid();
}

function getUnlockedUpTo() {
  let unlocked = 1;
  for (let s = 1; s <= STAGE_COUNT; s++) {
    if (stageProgress[s]?.cleared) unlocked = s + 1;
    else break;
  }
  return Math.min(unlocked, STAGE_COUNT);
}

function renderStageGrid() {
  const grid = document.getElementById('stageGrid');
  if (!grid) return;
  const unlockedUpTo = getUnlockedUpTo();
  grid.innerHTML = '';
  for (let s = 1; s <= STAGE_COUNT; s++) {
    const prog = stageProgress[s];
    const cleared = prog?.cleared || false;
    const best = prog?.best_score || 0;
    const isUnlocked = s <= unlockedUpTo;
    const isCurrent = s === unlockedUpTo && !cleared;

    const btn = document.createElement('button');
    btn.className = `stage-btn ${cleared ? 'cleared' : isUnlocked ? 'available' : 'locked'} ${isCurrent ? 'current' : ''}`;

    const start = (s-1)*STAGE_SIZE + 1;
    const end = s*STAGE_SIZE;
    const era = STAGE_LABELS[s-1];
    const stars = cleared ? '⭐⭐⭐' : best >= 7 ? '⭐⭐' : best >= 5 ? '⭐' : isUnlocked ? '　' : '🔒';

    btn.innerHTML = `<span class="s-num">${s}</span><span class="s-era">${era}</span><span style="font-size:.6rem;color:inherit;opacity:.7">${start}〜${end}</span><span class="s-stars">${stars}</span>`;

    if (isUnlocked) {
      btn.onclick = () => startStageQuiz(s);
    }
    grid.appendChild(btn);
  }
}

function selectMode(mode, el) {
  selectedMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}

/* ================================================
   Data
================================================ */
let localData = [];

async function loadData() {
  // まずDBから取得
  const {data, error} = await sb.from('quiz_data').select('*').eq('user_id', currentUser.id).order('year');
  if (!error && data) { localData = data; }
  renderDataList();
}

async function addEntry(year, event) {
  const y=Number(year); const e=String(event).trim();
  if(!y||!e) return false;
  if(localData.some(d=>d.year===y&&d.event===e)) return false;
  const {data,error}=await sb.from('quiz_data').insert({user_id:currentUser.id,year:y,event:e}).select().single();
  if(!error&&data){localData.push(data);return true;}
  return false;
}

async function deleteEntry(id) {
  await sb.from('quiz_data').delete().eq('id',id).eq('user_id',currentUser.id);
  localData=localData.filter(d=>d.id!==id);
  renderDataList();
}

async function clearAllData() {
  if(!confirm('全カスタムデータを削除しますか？')) return;
  await sb.from('quiz_data').delete().eq('user_id',currentUser.id);
  localData=[]; renderDataList(); showToast('🗑️ 削除しました');
}

function renderDataList() {
  const list=document.getElementById('dataList');
  document.getElementById('dataCount').textContent=localData.length;
  if(!localData.length){list.innerHTML='<div class="empty-st">カスタムデータなし（ステージモードは常に使えます）</div>';return;}
  list.innerHTML='';
  localData.forEach(item=>{
    const d=document.createElement('div'); d.className='d-item';
    d.innerHTML=`<span class="d-year">${item.year}年</span><span>${item.event}</span><button class="d-del" onclick="deleteEntry(${item.id})">✕</button>`;
    list.appendChild(d);
  });
}

async function manualAdd() {
  const y=document.getElementById('manualYear'); const e=document.getElementById('manualEvent');
  const added=await addEntry(y.value,e.value);
  if(added){y.value='';e.value='';renderDataList();showToast('📜 知識を記録しました');}
  else showToast('⚠️ 追加できませんでした（重複または不正）');
}

function exportData() {
  const blob=new Blob([JSON.stringify(localData.map(d=>({year:d.year,event:d.event})),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`history-quest-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  showToast('💾 バックアップしました');
}

async function importData(e) {
  const file=e.target.files?.[0]; if(!file) return;
  try{
    const arr=JSON.parse(await file.text());
    if(!Array.isArray(arr)) throw new Error('配列形式ではありません');
    let added=0;
    for(const it of arr){const y=it.year??it.Year,ev=it.event??it.Event;if(y&&ev&&await addEntry(y,ev))added++;}
    renderDataList(); showToast(added?`✅ ${added}件追加`:'⚠️ 新しいデータなし');
  }catch(err){showToast('❌ 読込失敗: '+err.message);}
  e.target.value='';
}

/* ================================================
   PDF / OCR
================================================ */
const PDFProcessor = {
  async toImageBlobs(file,onProgress){
    const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
    const blobs=[]; const c=document.createElement('canvas'); const ctx=c.getContext('2d');
    for(let i=1;i<=pdf.numPages;i++){
      onProgress(i,pdf.numPages);
      const pg=await pdf.getPage(i); const vp=pg.getViewport({scale:2});
      c.width=vp.width; c.height=vp.height;
      await pg.render({canvasContext:ctx,viewport:vp}).promise;
      blobs.push(await new Promise(r=>c.toBlob(r,'image/png')));
    }
    return blobs;
  },
  isPDF(f){return f.type==='application/pdf'||f.name.endsWith('.pdf');}
};

async function processFiles(files) {
  const wrap=document.getElementById('ocrWrap'); const bar=document.getElementById('ocrBar'); const txt=document.getElementById('ocrStatus');
  wrap.classList.add('visible');
  const blobs=[];
  for(const f of files){
    if(PDFProcessor.isPDF(f)){const pb=await PDFProcessor.toImageBlobs(f,(p,t)=>txt.textContent=`PDF展開中 (${p}/${t})`);blobs.push(...pb);}
    else blobs.push(f);
  }
  let worker=null;
  try{
    txt.textContent='OCR初期化中...'; worker=await Tesseract.createWorker(['jpn','eng']);
    let added=0;
    for(let i=0;i<blobs.length;i++){
      bar.style.width=`${(i/blobs.length)*100}%`; txt.textContent=`解読中 (${i+1}/${blobs.length})`;
      const {data:{text}}=await worker.recognize(blobs[i]);
      for(const line of text.split(/\r?\n/)){
        const m=line.match(/(\d{1,4})\s*[年\s]+(.{3,})/);
        if(m){const ok=await addEntry(parseInt(m[1]),m[2].replace(/^[年\s:：]+/,'').trim());if(ok)added++;}
      }
    }
    renderDataList(); showToast(added?`✅ ${added}件の知識を獲得！`:'📖 新しいデータは見つかりませんでした');
  }finally{if(worker)await worker.terminate();wrap.classList.remove('visible');bar.style.width='0%';}
}

/* ================================================
   Quiz Engine
================================================ */
let curMode='yearToEvent', quizList=[], quizIndex=0, quizScore=0, reviewData=[], playerHP=5, maxHP=5;
let currentStage = null; // ステージ番号（カスタムはnull）

function startStageQuiz(stageNum) {
  currentStage = stageNum;
  curMode = selectedMode;
  const items = getStageItems(stageNum);
  _buildQuiz(items, selectedMode);
  const stageName = STAGE_LABELS[stageNum-1];
  document.getElementById('battleLog').innerHTML = `<div>⚔️ ステージ${stageNum}「${stageName}」 バトル開始！</div>`;
  showScreen('screen-battle');
  renderQuestion();
}

function startQuiz(mode) {
  // カスタムデータ（ギルドのデータ）を利用
  const data = localData.length ? localData : INITIAL_DATA;
  currentStage = null;
  curMode = mode;
  _buildQuiz(data, mode);
  document.getElementById('battleLog').innerHTML = '<div>⚔️ バトル開始！</div>';
  showScreen('screen-battle');
  renderQuestion();
}

function _buildQuiz(data, mode) {
  const shuffled=[...data].sort(()=>Math.random()-.5).slice(0,Math.min(10,data.length));
  quizList=shuffled.map(item=>{
    let type=mode==='yearToEvent'?1:mode==='eventToYear'?2:(Math.random()>.5?1:2);
    return {...item,type,pattern:type===1?'年号の試練':'出来事の試練'};
  });
  quizIndex=0; quizScore=0; reviewData=[]; playerHP=5; maxHP=5;
}

function renderQuestion() {
  const q=quizList[quizIndex];
  const enemy=RPG.randomEnemy();
  const sp=document.getElementById('enemySprite');
  sp.textContent=enemy.emoji; sp.className='enemy-sprite';
  document.getElementById('enemyName').textContent=enemy.name;
  document.getElementById('enemyHP').style.width=`${((quizList.length-quizIndex)/quizList.length)*100}%`;
  document.getElementById('battleBadge').textContent=
    currentStage ? `ステージ${currentStage}「${STAGE_LABELS[currentStage-1]}」 ${quizIndex+1}/${quizList.length}` : q.pattern;
  document.getElementById('battleQ').innerHTML=q.type===1
    ?`⚡ <span style="color:var(--gold);font-size:1.3em">${q.year}年</span> に何が起きた？`
    :`⚡ <span style="color:var(--gold)">${q.event}</span> は何年？`;
  const input=document.getElementById('battleInput');
  input.type=q.type===1?'text':'number'; input.placeholder=q.type===1?'出来事を入力...':'西暦（数字）を入力...';
  input.value=''; input.disabled=false;
  document.getElementById('btnAttack').style.display='inline-flex';
  document.getElementById('btnNext').style.display='none';
  updatePlayerBar(); setTimeout(()=>input.focus(),100);
}

function updatePlayerBar() {
  const pct=(playerHP/maxHP)*100;
  const fill=document.getElementById('playerHPBar');
  fill.style.width=`${pct}%`; fill.style.background=pct>50?'var(--green)':pct>25?'orange':'var(--err)';
  document.getElementById('pbHP').textContent=`HP ${playerHP}/${maxHP}`;
}

function addLog(msg,type) {
  const log=document.getElementById('battleLog'); const d=document.createElement('div'); d.className=type; d.textContent=msg;
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
  if(ok){
    quizScore++; sp.classList.add('hit'); setTimeout(()=>sp.classList.remove('hit'),400);
    addLog(`✨ 正解！${q.year}年「${q.event}」`,'log-ok');
  }else{
    playerHP--;
    const pb=document.querySelector('.player-bar'); pb.classList.add('shake'); setTimeout(()=>pb.classList.remove('shake'),300);
    addLog(`💥 不正解... 正解は${q.year}年「${q.event}」`,'log-ng');
    updatePlayerBar();
  }
  reviewData.push({...q,userAnswer:ua,isCorrect:ok});
}

function nextQuestion() {
  quizIndex++;
  if(quizIndex<quizList.length&&playerHP>0){renderQuestion();}
  else{document.getElementById('enemySprite').classList.add('dead');setTimeout(showResult,700);}
}

/* ================================================
   Records
================================================ */
async function saveRecord(mode, score, total, xpEarned, isPerfect) {
  await sb.from('quiz_records').insert({user_id:currentUser.id,mode,score,total,xp_earned:xpEarned,is_perfect:isPerfect});
}

async function loadRecords() {
  const {data}=await sb.from('quiz_records').select('*').eq('user_id',currentUser.id).order('created_at',{ascending:false}).limit(20);
  if(!data)return;
  document.getElementById('statTotal').textContent=data.length;
  document.getElementById('statPerfect').textContent=data.filter(r=>r.is_perfect).length;
  document.getElementById('statTotalXP').textContent=data.reduce((s,r)=>s+(r.xp_earned||0),0);
  const list=document.getElementById('recordsList'); list.innerHTML='';
  if(!data.length){list.innerHTML='<div class="empty-st">まだ記録がありません</div>';return;}
  data.forEach(r=>{
    const pct=Math.round((r.score/r.total)*100);
    const d=new Date(r.created_at); const dateStr=`${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    const ml={yearToEvent:'年号の試練',eventToYear:'出来事の試練',random:'混沌の迷宮'};
    const div=document.createElement('div'); div.className='rec-item';
    div.innerHTML=`<div><span class="rec-mode">${ml[r.mode]||r.mode}</span>${r.is_perfect?'<span class="rec-perfect"> ✨満点</span>':''}<div class="rec-date">${dateStr}</div></div><div style="text-align:right"><span class="rec-score ${pct===100?'rec-perfect':''}">${pct}%</span><div class="rec-date">+${r.xp_earned||0}XP</div></div>`;
    list.appendChild(div);
  });
}

/* ================================================
   Result
================================================ */
async function showResult() {
  showScreen('screen-result');
  const total=quizList.length; const isPerfect=quizScore===total; const isDefeat=playerHP<=0;
  const xpGained=quizScore*10+(isPerfect?50:0)+(currentStage&&isPerfect?currentStage*5:0);

  // ステージ進捗を保存
  if (currentStage) { await saveStageProgress(currentStage, quizScore, total, isPerfect); }

  // XP保存
  const newXP=(currentProfile.xp||0)+xpGained;
  const oldLv=RPG.getLevel(currentProfile.xp||0); const newLv=RPG.getLevel(newXP); const lvUp=newLv>oldLv;
  await sb.from('profiles').update({xp:newXP,level:newLv,updated_at:new Date().toISOString()}).eq('id',currentUser.id);
  currentProfile.xp=newXP; currentProfile.level=newLv; RPG.updateHeader();
  await saveRecord(curMode,quizScore,total,xpGained,isPerfect);
  loadRecords();

  const icon=document.getElementById('rIcon'); const title=document.getElementById('rTitle'); const sub=document.getElementById('rSub');
  if(isPerfect){
    icon.textContent='🏆'; title.textContent='PERFECT!'; title.className='result-title win';
    const stageName = currentStage ? `ステージ${currentStage}「${STAGE_LABELS[currentStage-1]}」` : 'クエスト';
    sub.textContent=`${stageName} 全問正解！伝説の勇者！`;
    confetti({particleCount:200,spread:80,colors:['#ffd764','#ffe99a','#fff','#c9a227']});
    setTimeout(()=>confetti({particleCount:80,spread:60,origin:{x:.2,y:.6}}),500);
    setTimeout(()=>confetti({particleCount:80,spread:60,origin:{x:.8,y:.6}}),1000);
    setTimeout(showCert,2000);
  } else if(isDefeat){
    icon.textContent='💀'; title.textContent='DEFEAT...'; title.className='result-title lose';
    sub.textContent='HPが尽きた...もう一度挑もう！';
  } else {
    icon.textContent='⚔️'; title.textContent='VICTORY!'; title.className='result-title win';
    sub.textContent=`${Math.round((quizScore/total)*100)}% — 満点で次のステージへ！`;
  }

  // ステージ解放通知
  if (currentStage && isPerfect && currentStage < STAGE_COUNT) {
    const nextStage = currentStage + 1;
    setTimeout(()=>showToast(`🎉 ステージ${nextStage}「${STAGE_LABELS[nextStage-1]}」が解放されました！`), 1000);
  }

  document.getElementById('rsCorrect').textContent=quizScore;
  document.getElementById('rsWrong').textContent=total-quizScore;
  document.getElementById('rsXP').textContent=`+${xpGained}`;
  const lvArea=document.getElementById('lvUpArea');
  if(lvUp){lvArea.style.display='block';document.getElementById('lvUpText').textContent=`🎉 LEVEL UP! → Lv.${newLv} ${RPG.getClass(newLv)}`;}
  else lvArea.style.display='none';

  const wrongPanel=document.getElementById('wrongPanel');
  const wrongItems=reviewData.filter(r=>!r.isCorrect);
  if(wrongItems.length){wrongPanel.style.display='block';document.getElementById('wrongCount').textContent=wrongItems.length;}
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
  if(!wd.length)return;
  currentStage=null; // 再戦はステージ記録しない
  _buildQuiz(wd,curMode);
  document.getElementById('battleLog').innerHTML='<div>🔥 再戦！弱点克服！</div>';
  showScreen('screen-battle'); renderQuestion();
}

function exportWrong() {
  const wd=reviewData.filter(r=>!r.isCorrect).map(w=>({year:w.year,event:w.event}));
  if(!wd.length)return;
  const blob=new Blob([JSON.stringify(wd,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`weak-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  showToast('💾 弱点リストを保存しました');
}

/* ================================================
   Certificate
================================================ */
function showCert() {
  const now=new Date();
  document.getElementById('certName').textContent=`${currentProfile?.display_name||'冒険者'} 殿`;
  const stageLabel = currentStage ? `（ステージ${currentStage}「${STAGE_LABELS[currentStage-1]}」）` : '';
  document.getElementById('certDate').textContent=`令和${now.getFullYear()-2018}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分 ${stageLabel}`;
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
  document.getElementById(id).classList.add('active'); window.scrollTo(0,0);
}
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
  if(tab==='records')loadRecords();
}
function goHome() { showScreen('screen-main'); switchTab('quest'); }
function showToast(msg) {
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500);
}

/* ================================================
   Init
================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('fileInput').addEventListener('change',e=>processFiles(Array.from(e.target.files)));
  document.getElementById('importInput').addEventListener('change',importData);
  document.getElementById('battleInput').addEventListener('keydown',e=>{
    if(e.key==='Enter'&&document.getElementById('btnAttack').style.display!=='none')checkAnswer();
  });
});
