/* ================================================
   Supabase 初期化
================================================ */
const SUPABASE_URL = 'https://utjtlrmvleagdypcnfky.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0anRscm12bGVhZ2R5cGNuZmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODgzNTksImV4cCI6MjA4OTU2NDM1OX0.CoE2ZNMHZGaVBjsq28uAMt0bRg4RzfNtDiOKcH8huOM';

let sb = null;
try {
  if (typeof supabase === 'undefined') {
    alert('❌ 重大なエラー: Supabaseライブラリを読み込めませんでした。ネット接続を確認するか、一度ブラウザを閉じて開き直してください。');
  } else {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabaseクライアントの初期化に成功しました。');
  }
} catch (e) { console.error('Supabase初期化失敗:', e); }

let currentUser = null;
let currentProfile = null;

/* ================================================
   初期データ（100問）
================================================ */
const INITIAL_DATA = [
  {year:239,event:'邪馬台国の卑弥呼が魏に使いを送る'},{year:538,event:'百済から仏教が伝来する'},{year:593,event:'聖徳太子が推古天皇の摂政になる'},{year:607,event:'遣隋使として小野妹子を送る'},{year:645,event:'大化の改新で中大兄皇子、中臣鎌足が蘇我氏を倒す'},{year:672,event:'壬申の乱'},{year:701,event:'大宝律令'},{year:710,event:'元明天皇が平城京に遷都'},{year:723,event:'三世一身の法'},{year:743,event:'墾田永年私財法'},{year:794,event:'桓武天皇が平安京に遷都'},{year:894,event:'遣唐使廃止'},{year:939,event:'平将門の乱'},{year:939,event:'藤原純友の乱'},{year:1016,event:'藤原道長が摂政'},{year:1086,event:'白河上皇の院政開始'},{year:1156,event:'保元の乱'},{year:1159,event:'平治의乱'},{year:1167,event:'平清盛が太政大臣'},{year:1185,event:'壇ノ浦の戦い・守護地頭'},{year:1192,event:'源頼朝が征夷大将軍に任命された'},{year:1221,event:'後鳥羽上皇が承久の乱を起こした'},{year:1232,event:'北条泰時が御成敗式目を制定'},{year:1274,event:'文永の役'},{year:1281,event:'弘安の役'},{year:1333,event:'鎌倉幕府滅亡'},{year:1334,event:'後醍醐天皇の建武の新政'},{year:1338,event:'足利尊氏が室町幕府を開く'},{year:1392,event:'足利義満による南北朝統一'},{year:1428,event:'正長の土一揆'},{year:1467,event:'応仁の乱'},{year:1485,event:'山城の国一揆'},{year:1488,event:'加賀一向一揆'},{year:1543,event:'ポルトガル人が種子島に鉄砲伝来'},{year:1549,event:'キリスト教伝来'},{year:1573,event:'室町幕府滅亡'},{year:1575,event:'長篠の戦い'},{year:1582,event:'本能寺の変'},{year:1588,event:'刀狩'},{year:1590,event:'全国統一'},{year:1600,event:'関ヶ原の戦い'},{year:1603,event:'江戸幕府成立'},{year:1615,event:'武家諸法度'},{year:1635,event:'参勤交代'},{year:1637,event:'島原の乱'},{year:1639,event:'鎖国完成'},{year:1716,event:'享保の改革'},{year:1772,event:'田沼意次'},{year:1787,event:'寛政の改革'},{year:1825,event:'異国船打払令'},{year:1837,event:'大塩平八郎の乱'},{year:1841,event:'天保の改革'},{year:1853,event:'ペリー来航'},{year:1854,event:'日米和親条約'},{year:1858,event:'日米修好通商条約'},{year:1860,event:'桜田門外の変'},{year:1866,event:'薩長同盟'},{year:1867,event:'大政奉還'},{year:1868,event:'五箇条の御誓文'},{year:1871,event:'廃藩置県'},{year:1872,event:'学制発布'},{year:1873,event:'地租改正'},{year:1877,event:'西南戦争'},{year:1881,event:'自由民権運動'},{year:1885,event:'内閣制度'},{year:1889,event:'大日本帝国憲法'},{year:1890,event:'帝国議会'},{year:1894,event:'日清戦争'},{year:1895,event:'下関条約'},{year:1901,event:'八幡製鉄所'},{year:1902,event:'日英同盟'},{year:1904,event:'日露戦争'},{year:1905,event:'ポーツマス条約'},{year:1910,event:'韓国併合'},{year:1911,event:'関税自主権回復'},{year:1914,event:'第一次世界大戦'},{year:1915,event:'二十一か条の要求'},{year:1917,event:'ロシア革命'},{year:1918,event:'米騒動'},{year:1920,event:'国際連盟'},{year:1923,event:'関東大震災'},{year:1925,event:'普通選挙法・治安維持法'},{year:1929,event:'世界恐慌'},{year:1931,event:'満州事変'},{year:1932,event:'五・一五事件'},{year:1933,event:'国際連盟脱退'},{year:1936,event:'二・二六事件'},{year:1937,event:'日中戦争'},{year:1938,event:'国家総動員法'},{year:1939,event:'第二次世界大戦'},{year:1941,event:'太平洋戦争'},{year:1945,event:'終戦'},{year:1950,event:'朝鮮戦争'},{year:1951,event:'サンフランシスコ平和条約'},{year:1956,event:'国連加盟'},{year:1964,event:'東京オリンピック'},{year:1972,event:'沖縄返還'},{year:1978,event:'日中平和友好条約'},{year:1990,event:'東西ドイツ統一'},{year:1995,event:'阪神淡路大震災'},
];

const STAGE_COUNT = 10;
const STAGE_SIZE = 10;
const STAGE_LABELS = ['古代①','古代②','中世①','中世②','中世③','近世①','近世②','近代①','近代②','現代'];

function getStageItems(stageNum) {
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
  enemies: [{name:'年号ゴブリン',emoji:'👹'},{name:'歴史スライム',emoji:'🟢'},{name:'時空龍',emoji:'🐉'},{name:'古文書の亡霊',emoji:'👻'},{name:'忘却の魔王',emoji:'😈'},{name:'暗黒騎士',emoji:'🦹'},{name:'年表ゴーレム',emoji:'🗿'},{name:'記憶の怪物',emoji:'🧟'}],
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
   Auth & Global Error
================================================ */
window.onerror = function(m, u, l) { showToast('❌ ' + m); return false; };

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('loginForm').style.display = tab==='login'?'block':'none';
  document.getElementById('signupForm').style.display = tab==='signup'?'block':'none';
  document.querySelector(`.auth-tab:${tab==='login'?'first':'last'}-child`).classList.add('active');
  document.getElementById('authError').textContent = '';
}

async function handleLogin(e) {
  e.preventDefault();
  const b = document.getElementById('loginBtn'); const er = document.getElementById('authError');
  b.disabled = true; b.textContent = '通信中...'; er.textContent = '';
  try {
    const em = document.getElementById('loginEmail').value.trim(); const pw = document.getElementById('loginPassword').value;
    const t = new Promise((_, r) => setTimeout(() => r(new Error('タイムアウト')), 20000));
    const { error } = await Promise.race([sb.auth.signInWithPassword({ email:em, password:pw }), t]);
    if (error) { er.textContent = '失敗: ' + error.message; b.disabled = false; b.textContent = '冒険を始める'; }
  } catch (ex) { er.textContent = ex.message; b.disabled = false; b.textContent = '冒険を始める'; }
}

async function handleSignup(e) {
  e.preventDefault();
  const b = document.getElementById('signupBtn'); const er = document.getElementById('authError');
  b.disabled = true; b.textContent = '登録中...';
  try {
    const { error } = await sb.auth.signUp({ email: document.getElementById('signupEmail').value.trim(), password: document.getElementById('signupPassword').value, options: { data: { display_name: document.getElementById('signupName').value.trim() } } });
    if (error) { er.textContent = error.message; } else { er.textContent = '✅ 登録完了！ログインしてください。'; }
  } catch (ex) { er.textContent = ex.message; }
  b.disabled = false; b.textContent = '登録して冒険へ';
}

async function logout() { await sb.auth.signOut(); location.reload(); }

/* ================================================
   Main lifecycle
================================================ */
if (sb) {
  sb.auth.onAuthStateChange(async (e, s) => {
    if (s?.user) {
      currentUser = s.user;
      try { await loadProfile(); await loadData(); await loadStageProgress(); await loadRecords(); showScreen('screen-main'); }
      catch (err) { showCriticalError(err); }
    } else { currentUser = null; currentProfile = null; showScreen('screen-auth'); }
  });
}

function showCriticalError(err) {
  document.body.innerHTML = `<div style="background:#111; color:#f87171; padding:40px; height:100vh;"><h2>ロードエラー</h2><pre>${err.message}</pre><button onclick="location.reload()">再試行</button></div>`;
}

async function loadProfile() {
  const {data} = await sb.from('profiles').select('*').eq('id',currentUser.id).single();
  if (data) currentProfile = data;
  else {
    const n = currentUser.user_metadata?.display_name || '冒険者';
    const {data:np} = await sb.from('profiles').upsert({id:currentUser.id, display_name:n}).select().single();
    currentProfile = np;
  }
  RPG.updateHeader();
}

/* ================================================
   Stage & Data
================================================ */
let stageProgress = {}, selectedMode = 'yearToEvent', localData = [];

async function loadStageProgress() {
  const {data} = await sb.from('stage_progress').select('*').eq('user_id', currentUser.id);
  stageProgress = {}; if (data) data.forEach(r => stageProgress[r.stage] = r);
  renderStageGrid();
}

async function saveStageProgress(stage, score, total, isPerfect) {
  const p = stageProgress[stage];
  const dat = { user_id: currentUser.id, stage, cleared: isPerfect || (p?.cleared || false), best_score: Math.max(p?.best_score || 0, score), attempts: (p?.attempts || 0) + 1 };
  await sb.from('stage_progress').upsert(dat, { onConflict: 'user_id,stage' });
  stageProgress[stage] = dat; renderStageGrid();
}

function renderStageGrid() {
  const grid = document.getElementById('stageGrid'); if (!grid) return;
  let unlocked = 1; for (let s = 1; s <= 10; s++) { if (stageProgress[s]?.cleared) unlocked = s + 1; else break; }
  unlocked = Math.min(unlocked, 10); grid.innerHTML = '';
  for (let s = 1; s <= 10; s++) {
    const p = stageProgress[s]; const cl = p?.cleared; const isLocked = s > unlocked;
    const btn = document.createElement('button');
    btn.className = `stage-btn ${cl ? 'cleared' : isLocked ? 'locked' : 'available'} ${s===unlocked && !cl ? 'current' : ''}`;
    btn.innerHTML = `<span class="s-num">${s}</span><span class="s-era">${STAGE_LABELS[s-1]}</span><span class="s-stars">${cl ? '⭐⭐⭐' : isLocked ? '🔒' : '　'}</span>`;
    if (!isLocked) btn.onclick = () => startStageQuiz(s);
    grid.appendChild(btn);
  }
}

async function loadData() {
  const {data} = await sb.from('quiz_data').select('*').eq('user_id', currentUser.id).order('year');
  if (data) localData = data; renderDataList();
}

function renderDataList() {
  const list = document.getElementById('dataList');
  document.getElementById('dataCount').textContent = localData.length;
  list.innerHTML = '';
  localData.forEach(item => {
    const d = document.createElement('div'); d.className = 'd-item';
    d.innerHTML = `<span>${item.year}年: ${item.event}</span><button onclick="deleteEntry(${item.id})">✕</button>`;
    list.appendChild(d);
  });
}

async function deleteEntry(id) {
  await sb.from('quiz_data').delete().eq('id',id); localData = localData.filter(d => d.id !== id); renderDataList();
}

/* ================================================
   Quiz Engine
================================================ */
let quizList, quizIndex, quizScore, reviewData, playerHP, maxHP = 5;
let currentStage = null;

function startStageQuiz(stageNum) {
  currentStage = stageNum; _buildQuiz(getStageItems(stageNum), selectedMode);
  document.getElementById('battleLog').innerHTML = `<div>⚔️ ステージ${stageNum} 開始！</div>`;
  showScreen('screen-battle'); renderQuestion();
}

function startQuiz(mode) {
  _buildQuiz(localData.length ? localData : INITIAL_DATA, mode);
  document.getElementById('battleLog').innerHTML = '<div>⚔️ クエスト開始！</div>';
  showScreen('screen-battle'); renderQuestion();
}

function _buildQuiz(data, mode) {
  quizList = [...data].sort(() => Math.random() - 0.5).slice(0, 10).map(i => ({...i, type: mode==='yearToEvent'?1 : mode==='eventToYear'?2 : (Math.random()>0.5?1:2)}));
  quizIndex = 0; quizScore = 0; reviewData = []; playerHP = 5;
}

function renderQuestion() {
  const q = quizList[quizIndex]; const enemy = RPG.randomEnemy();
  document.getElementById('enemySprite').textContent = enemy.emoji;
  document.getElementById('battleQ').innerHTML = q.type === 1 ? `${q.year}年 出来事は？` : `${q.event} 年号は？`;
  const i = document.getElementById('battleInput'); i.type = q.type === 1 ? 'text' : 'number'; i.value = ''; i.disabled = false;
  document.getElementById('btnAttack').style.display = 'inline-flex';
  document.getElementById('btnNext').style.display = 'none';
  updatePlayerBar(); i.focus();
}

function updatePlayerBar() {
  document.getElementById('playerHPBar').style.width = `${(playerHP/maxHP)*100}%`;
  document.getElementById('pbHP').textContent = `HP ${playerHP}/${maxHP}`;
}

function checkAnswer() {
  const q = quizList[quizIndex]; const ua = document.getElementById('battleInput').value.trim();
  let ok = false;
  if (q.type === 1) {
    const sim = calculateSimilarity(q.event, ua);
    ok = (sim >= 0.6 || q.event.includes(ua));
    addLog(ok ? (sim < 1 ? `✨ ほぼ正解: ${q.event}` : `✨ 正解: ${q.event}`) : `💥 違います: ${q.event}`, ok ? 'log-ok' : 'log-ng');
  } else {
    ok = (Number(ua) === q.year);
    addLog(ok ? `✨ 正解: ${q.year}` : `💥 違います: ${q.year}`, ok ? 'log-ok' : 'log-ng');
  }
  if (ok) quizScore++; else playerHP--;
  document.getElementById('battleInput').disabled = true;
  document.getElementById('btnAttack').style.display = 'none';
  document.getElementById('btnNext').style.display = 'inline-flex';
  updatePlayerBar(); reviewData.push({ ...q, userAnswer: ua, isCorrect: ok });
}

function calculateSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const editDistance = (a, b) => {
    const t = []; for (let i = 0; i <= a.length; i++) t[i] = [i]; for (let j = 0; j <= b.length; j++) t[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) t[i][j] = Math.min(t[i-1][j]+1, t[i][j-1]+1, t[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
    }
    return t[a.length][b.length];
  };
  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

async function showResult() {
  showScreen('screen-result');
  const xp = quizScore * 10;
  await sb.from('profiles').update({xp: (currentProfile.xp || 0) + xp}).eq('id', currentUser.id);
  if (currentStage) await saveStageProgress(currentStage, quizScore, 10, quizScore === 10);
  document.getElementById('rsCorrect').textContent = quizScore;
  document.getElementById('rsXP').textContent = `+${xp}`;
  await loadRecords();
}

async function loadRecords() {
  const {data} = await sb.from('quiz_records').select('*').eq('user_id', currentUser.id).order('created_at', {ascending:false}).limit(10);
  const list = document.getElementById('recordsList'); if (!list) return;
  list.innerHTML = data?.length ? '' : '記録なし';
  data?.forEach(r => {
    const d = document.createElement('div'); d.className = 'rec-item';
    d.innerHTML = `<span>${r.mode}</span><span>${r.score}/${r.total}</span>`;
    list.appendChild(d);
  });
}

function addLog(msg, type) {
  const log = document.getElementById('battleLog'); const d = document.createElement('div'); d.className = type; d.textContent = msg;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function switchTab(t) {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
  document.querySelector(`[data-tab="${t}"]`).classList.add('active');
  document.getElementById(`tab-${t}`).classList.add('active');
}
function showToast(m) {
  const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('battleInput').addEventListener('keydown', e => { if(e.key === 'Enter') checkAnswer(); });
});
