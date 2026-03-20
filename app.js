'use strict';

/* ================================================
   Supabase 初期化
================================================ */
const SUPABASE_URL = 'https://utjtlrmvleagdypcnfky.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0anRscm12bGVhZ2R5cGNuZmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODgzNTksImV4cCI6MjA4OTU2NDM1OX0.CoE2ZNMHZGaVBjsq28uAMt0bRg4RzfNtDiOKcH8huOM';

let sb = null;
try {
  if (typeof supabase !== 'undefined') {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    alert('❌ Supabaseのロードに失敗しました。リロードしてください。');
  }
} catch (e) {
  console.error('Supabase init error:', e);
}

let currentUser = null;
let currentProfile = null;

/* ================================================
   初期データ（100問）
================================================ */
const INITIAL_DATA = [
  {year:239,event:'邪馬台国の卑弥呼が魏に使いを送る'},{year:538,event:'百済から仏教が伝来する'},{year:593,event:'聖徳太子が推古天皇の摂政になる'},{year:607,event:'遣隋使として小野妹子を送る'},{year:645,event:'大化の改新'},{year:672,event:'壬申の乱'},{year:701,event:'大宝律令'},{year:710,event:'元明天皇が平城京に遷都'},{year:723,event:'三世一身の法'},{year:743,event:'墾田永年私財法'},{year:794,event:'桓武天皇が平安京に遷都'},{year:894,event:'遣唐使廃止'},{year:939,event:'平将門の乱'},{year:939,event:'藤原純友の乱'},{year:1016,event:'藤原道長が摂政'},{year:1086,event:'白河上皇の院政開始'},{year:1156,event:'保元の乱'},{year:1159,event:'平治の乱'},{year:1167,event:'平清盛が太政大臣'},{year:1185,event:'壇ノ浦の戦い・守護地頭'},{year:1192,event:'源頼朝が征夷大将軍'},{year:1221,event:'承久の乱'},{year:1232,event:'御成敗式目'},{year:1274,event:'文永の役'},{year:1281,event:'弘安の役'},{year:1333,event:'鎌倉幕府滅亡'},{year:1334,event:'建武の新政'},{year:1338,event:'足利尊氏が室町幕府を開く'},{year:1392,event:'南北朝統一'},{year:1428,event:'正長の土一揆'},{year:1467,event:'応仁の乱'},{year:1485,event:'山城の国一揆'},{year:1488,event:'加賀一向一揆'},{year:1543,event:'鉄砲伝来'},{year:1549,event:'キリスト教伝来'},{year:1573,event:'室町幕府滅亡'},{year:1575,event:'長篠の戦い'},{year:1582,event:'本能寺の変'},{year:1588,event:'刀狩'},{year:1590,event:'豊臣秀吉の全国統一'},{year:1600,event:'関ヶ原の戦い'},{year:1603,event:'江戸幕府成立'},{year:1615,event:'武家諸法度'},{year:1635,event:'参勤交代'},{year:1637,event:'島原の乱'},{year:1639,event:'鎖国完成'},{year:1716,event:'享保の改革'},{year:1772,event:'田沼意次の政治'},{year:1787,event:'寛政の改革'},{year:1825,event:'異国船打払令'},{year:1837,event:'大塩平八郎の乱'},{year:1841,event:'天保の改革'},{year:1853,event:'ペリー来航'},{year:1854,event:'日米和親条約'},{year:1858,event:'日米修好通商条約'},{year:1860,event:'桜田門外の変'},{year:1866,event:'薩長同盟'},{year:1867,event:'大政奉還'},{year:1868,event:'五箇条の御誓文'},{year:1871,event:'廃藩置県'},{year:1872,event:'学制発布'},{year:1873,event:'地租改正'},{year:1877,event:'西南戦争'},{year:1881,event:'国会期成同盟'},{year:1885,event:'内閣制度'},{year:1889,event:'大日本帝国憲法'},{year:1890,event:'第1回帝国議会'},{year:1894,event:'日清戦争'},{year:1895,event:'下関条約'},{year:1901,event:'八幡製鉄所'},{year:1902,event:'日英同盟'},{year:1904,event:'日露戦争'},{year:1905,event:'ポーツマス条約'},{year:1910,event:'韓国併合'},{year:1911,event:'関税自主権回復'},{year:1914,event:'第一次世界大戦'},{year:1915,event:'二十一か条の要求'},{year:1917,event:'ロシア革命'},{year:1918,event:'米騒動'},{year:1920,event:'国際連盟加入'},{year:1923,event:'関東大震災'},{year:1925,event:'普通選挙法・治安維持法'},{year:1929,event:'世界恐慌'},{year:1931,event:'満州事変'},{year:1932,event:'五・一五事件'},{year:1933,event:'国際連盟脱退'},{year:1936,event:'二・二六事件'},{year:1937,event:'日中戦争'},{year:1938,event:'国家総動員法'},{year:1939,event:'第二次世界大戦'},{year:1941,event:'太平洋戦争'},{year:1945,event:'終戦（ポツダム宣言受諾）'},{year:1950,event:'朝鮮戦争'},{year:1951,event:'サンフランシスコ平和条約'},{year:1956,event:'日ソ共同宣言・国連加盟'},{year:1964,event:'東京オリンピック'},{year:1972,event:'沖縄返還'},{year:1978,event:'日中平和友好条約'},{year:1990,event:'東西ドイツ統一'},{year:1995,event:'阪神淡路大震災'}
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
  enemies: [
    {name:'年号ゴブリン',emoji:'👹'},{name:'歴史スライム',emoji:'🟢'},
    {name:'時空龍',emoji:'🐉'},{name:'古文書の亡霊',emoji:'👻'},
    {name:'忘却の魔王',emoji:'😈'},{name:'暗黒騎士',emoji:'🦹'},
    {name:'年表ゴーレム',emoji:'🗿'},{name:'記憶の怪物',emoji:'🧟'}
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
   エラーハンドリング
================================================ */
window.onerror = function(msg, url, lineNo) {
  showToast('❌ エラー: ' + msg);
  return false;
};

function showCriticalError(err) {
  console.error("Critical Error:", err);
  document.body.innerHTML = `
    <div style="background:#111; color:#f87171; padding:40px; height:100vh;">
      <h2 style="color:#ffd764;">⚔️ 致命的なエラー</h2>
      <pre style="background:#222; padding:16px; border-radius:8px; white-space:pre-wrap;">${err.message || err}</pre>
      <button onclick="location.reload()" style="padding:12px 24px; background:#ffd764; border:none; border-radius:8px; cursor:pointer; font-weight:bold; margin-top:20px;">リロードして再試行</button>
    </div>
  `;
}

/* ================================================
   Auth 関連
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
  const err = document.getElementById('authError');
  btn.disabled = true; btn.textContent = '通信中...';
  err.textContent = '';
  
  try {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Vercel API Route 経由でログイン（ブラウザの外部通信ブロックを回避）
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'ログインに失敗しました');
    }
    
    // トークンをローカルに保存し、手動で状態を切り替え
    localStorage.setItem('hq_access_token', data.access_token);
    localStorage.setItem('hq_refresh_token', data.refresh_token);
    currentUser = data.user;
    
    // Supabase クライアントにセッションを設定（setSession は試みるが timeout を設ける）
    if (sb) {
      const setSessionTimeout = new Promise((_, r) => setTimeout(() => r(new Error('skip')), 3000));
      try {
        await Promise.race([
          sb.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token }),
          setSessionTimeout
        ]);
      } catch (_) {
        // タイムアウトしても手動ユーザーで続行
        console.log('setSession skipped, using manual user data');
      }
    }
    
    // メイン画面へ進む（onAuthStateChange が発火しなくても動く）
    try {
      await loadProfile();
      await loadData();
      await loadStageProgress();
      await loadRecords();
      showScreen('screen-main');
    } catch (loadErr) {
      showCriticalError(loadErr);
    }
    
  } catch (ex) {
    err.style.color = 'var(--err)';
    err.textContent = ex.message === 'Failed to fetch' 
      ? '通信に失敗しました。ネット接続を確認してください。'
      : 'ログイン失敗: ' + ex.message;
    btn.disabled = false; btn.textContent = '冒険を始める';
  }
}


async function handleSignup(e) {
  e.preventDefault();
  if (!sb) return;
  const btn = document.getElementById('signupBtn');
  const err = document.getElementById('authError');
  btn.disabled = true; btn.textContent = '登録中...';
  err.textContent = '';

  try {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    const { data, error } = await sb.auth.signUp({
      email, password,
      options: { data: { display_name: name } }
    });
    
    if (error) {
      err.style.color = 'var(--err)';
      err.textContent = '登録失敗: ' + error.message;
    } else {
      err.style.color = 'var(--ok)';
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        err.textContent = '⚠️ すでに登録されています。ログインをお試しください。';
      } else {
        err.textContent = '✅ 登録完了！そのままログインをお試しください。';
      }
    }
  } catch (ex) {
    err.style.color = 'var(--err)';
    err.textContent = ex.message;
  }
  btn.disabled = false; btn.textContent = '登録して冒険へ';
}

async function logout() { 
  if(sb) await sb.auth.signOut(); 
  location.reload(); 
}

/* ================================================
   Supabase REST API ヘルパー（ライブラリ不使用・ハングなし）
================================================ */
function getToken() {
  return localStorage.getItem('hq_access_token') || '';
}

async function dbFetch(table, options = {}) {
  const {
    method = 'GET',
    filter = '',
    body = null,
    select = '*',
    single = false,
    upsert = false
  } = options;
  
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
  if (filter) url += '&' + filter;
  if (single) url += '&limit=1';
  
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
    'Prefer': single ? 'return=representation' : upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation'
  };
  
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `DB Error ${res.status}`);
  }
  
  const result = await res.json();
  return single ? { data: Array.isArray(result) ? result[0] : result } : { data: result };
}

/* ================================================
   ライフサイクル / データロード
================================================ */
if (sb) {
  // onAuthStateChange はバックアップとして使う（通常は handleLogin で直接遷移）
  sb.auth.onAuthStateChange(async (event, session) => {
    if (session?.user && !currentUser) {
      currentUser = session.user;
      try {
        await loadProfile();
        await loadData();
        await loadStageProgress();
        await loadRecords();
        showScreen('screen-main');
      } catch (err) {
        showCriticalError(err);
      }
    } else if (!session?.user && !currentUser) {
      showScreen('screen-auth');
    }
  });
}

async function loadProfile() {
  try {
    const {data} = await dbFetch('profiles', { filter: `id=eq.${currentUser.id}`, single: true });
    if (data && data.id) {
      currentProfile = data;
    } else {
      const name = currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || '冒険者';
      const {data:np} = await dbFetch('profiles', {
        method: 'POST',
        body: { id: currentUser.id, display_name: name, xp: 0, level: 1 },
        upsert: true, single: true
      });
      currentProfile = np || { id: currentUser.id, display_name: name, xp: 0, level: 1 };
    }
  } catch (err) {
    console.warn('loadProfile fallback:', err.message);
    currentProfile = { id: currentUser.id, display_name: '冒険者', xp: 0, level: 1 };
  }
  RPG.updateHeader();
}

let stageProgress = {};
async function loadStageProgress() {
  try {
    const {data} = await dbFetch('stage_progress', { filter: `user_id=eq.${currentUser.id}` });
    stageProgress = {};
    if (data) data.forEach(r => stageProgress[r.stage] = r);
  } catch (err) {
    console.warn('loadStageProgress fallback:', err.message);
    stageProgress = {};
  }
  renderStageGrid();
}


async function saveStageProgress(stage, score, total, isPerfect) {
  const p = stageProgress[stage];
  const dat = {
    user_id: currentUser.id,
    stage,
    cleared: isPerfect || (p?.cleared || false),
    best_score: Math.max(p?.best_score || 0, score),
    attempts: (p?.attempts || 0) + 1,
    updated_at: new Date().toISOString()
  };
  try {
    await dbFetch('stage_progress', {
      method: 'POST',
      body: dat,
      upsert: true
    });
  } catch(e) { console.error('saveStageProgress err:', e); }
  stageProgress[stage] = dat;
  renderStageGrid();
}

function renderStageGrid() {
  const grid = document.getElementById('stageGrid');
  if (!grid) return;
  // 最大開放ステージの計算
  let unlocked = 1; 
  for (let s = 1; s <= STAGE_COUNT; s++) {
    if (stageProgress[s]?.cleared) unlocked = s + 1;
    else break;
  }
  unlocked = Math.min(unlocked, STAGE_COUNT);
  
  grid.innerHTML = '';
  for (let s = 1; s <= STAGE_COUNT; s++) {
    const p = stageProgress[s];
    const cl = p?.cleared;
    const isLocked = s > unlocked;
    const best = p?.best_score || 0;
    
    let stateClass = '';
    if (cl) stateClass = 'cleared';
    else if (isLocked) stateClass = 'locked';
    else stateClass = 'available';
    if (s === unlocked && !cl) stateClass += ' current';
    
    const btn = document.createElement('button');
    btn.className = `stage-btn ${stateClass}`;
    const stars = cl ? '⭐⭐⭐' : best >= 7 ? '⭐⭐' : best >= 5 ? '⭐' : isLocked ? '🔒' : '　';
    const rangeStr = `${(s-1)*10+1}〜${s*10}`;
    
    btn.innerHTML = `
      <span class="s-num">${s}</span>
      <span class="s-era">${STAGE_LABELS[s-1]}</span>
      <span style="font-size:.6rem;opacity:.7">${rangeStr}</span>
      <span class="s-stars">${stars}</span>
    `;
    
    if (!isLocked) btn.onclick = () => startStageQuiz(s);
    grid.appendChild(btn);
  }
}

let localData = [];
async function loadData() {
  try {
    const {data} = await dbFetch('quiz_data', { filter: `user_id=eq.${currentUser.id}`, select: '*' });
    localData = data ? data.sort((a,b)=>a.year - b.year) : [];
  } catch (err) {
    console.warn('loadData fallback:', err.message);
    localData = [];
  }
  renderDataList();
}

function renderDataList() {
  const list = document.getElementById('dataList');
  document.getElementById('dataCount').textContent = localData.length;
  if (!localData.length) { 
    list.innerHTML = '<div class="empty-st">カスタムデータなし</div>'; 
    return; 
  }
  list.innerHTML = '';
  localData.forEach(item => {
    const d = document.createElement('div');
    d.className = 'd-item';
    d.innerHTML = `<span>${item.year}年: ${item.event}</span><button class="d-del" onclick="deleteEntry(${item.id})">✕</button>`;
    list.appendChild(d);
  });
}

async function addEntry(year, event) {
  const y = Number(year);
  const e = String(event).trim();
  if(!y || !e) return false;
  if(localData.some(d => d.year === y && d.event === e)) return false;
  
  try {
    const {data} = await dbFetch('quiz_data', {
      method: 'POST',
      body: { user_id: currentUser.id, year: y, event: e },
      single: true
    });
    if(data) { localData.push(data); return true; }
  } catch(err) { console.error('addEntry err:', err); }
  return false;
}

async function deleteEntry(id) {
  try {
    await dbFetch('quiz_data', { method: 'DELETE', filter: `id=eq.${id}&user_id=eq.${currentUser.id}` });
    localData = localData.filter(d => d.id !== id);
    renderDataList();
  } catch(err) {}
}

async function clearAllData() {
  if(!confirm('全てのカスタムデータを削除しますか？')) return;
  try {
    await dbFetch('quiz_data', { method: 'DELETE', filter: `user_id=eq.${currentUser.id}` });
    localData = [];
    renderDataList();
    showToast('🗑️ 全て削除しました');
  } catch(err) {}
}

async function manualAdd() {
  const y = document.getElementById('manualYear');
  const e = document.getElementById('manualEvent');
  const added = await addEntry(y.value, e.value);
  if(added) { y.value=''; e.value=''; renderDataList(); showToast('📜 知識を記録しました'); }
  else { showToast('⚠️ 追加できませんでした'); }
}

/* ================================================
   Quiz Engine
================================================ */
let selectedMode = 'yearToEvent';
function selectMode(m, el) {
  selectedMode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

let quizList = [];
let quizIndex = 0;
let quizScore = 0;
let reviewData = [];
let playerHP = 5;
let maxHP = 5;
let currentStage = null;
let curMode = 'yearToEvent';

function startStageQuiz(stageNum) {
  currentStage = stageNum;
  curMode = selectedMode;
  const items = getStageItems(stageNum);
  if(!items || items.length === 0) { showToast('ステージデータがありません'); return; }
  _buildQuiz(items, selectedMode);
  document.getElementById('battleLog').innerHTML = `<div>⚔️ ステージ${stageNum}「${STAGE_LABELS[stageNum-1]}」 開始！</div>`;
  showScreen('screen-battle');
  renderQuestion();
}

function startQuiz(mode) {
  const data = (localData && localData.length > 0) ? localData : INITIAL_DATA;
  if(!data || data.length === 0) return;
  currentStage = null;
  curMode = mode;
  _buildQuiz(data, mode);
  document.getElementById('battleLog').innerHTML = '<div>⚔️ クエスト開始！</div>';
  showScreen('screen-battle');
  renderQuestion();
}

function _buildQuiz(data, mode) {
  const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 10);
  quizList = shuffled.map(item => {
    let type = mode === 'yearToEvent' ? 1 : mode === 'eventToYear' ? 2 : (Math.random() > 0.5 ? 1 : 2);
    return { ...item, type, pattern: type === 1 ? '年号の試練' : '出来事の試練' };
  });
  quizIndex = 0; quizScore = 0; reviewData = []; playerHP = 5; maxHP = 5;
}

function renderQuestion() {
  const q = quizList[quizIndex];
  const enemy = RPG.randomEnemy();
  const sp = document.getElementById('enemySprite');
  sp.textContent = enemy.emoji; sp.className = 'enemy-sprite';
  document.getElementById('enemyName').textContent = enemy.name;
  document.getElementById('enemyHP').style.width = `${((quizList.length-quizIndex)/quizList.length)*100}%`;
  
  document.getElementById('battleBadge').textContent = currentStage ? `STAGE ${currentStage} - ${quizIndex+1}/10` : q.pattern;
  
  document.getElementById('battleQ').innerHTML = q.type === 1
    ? `⚡ <span style="color:var(--gold);font-size:1.3em">${q.year}年</span> に何が起きた？`
    : `⚡ <span style="color:var(--gold)">${q.event}</span> は何年？`;
    
  const input = document.getElementById('battleInput');
  input.type = q.type === 1 ? 'text' : 'number';
  input.placeholder = q.type === 1 ? '出来事を入力...' : '西暦数字...';
  input.value = '';
  input.disabled = false;
  
  document.getElementById('btnAttack').style.display = 'inline-flex';
  document.getElementById('btnNext').style.display = 'none';
  updatePlayerBar();
  setTimeout(() => input.focus(), 100);
}

function updatePlayerBar() {
  const pct = (playerHP / maxHP) * 100;
  const fill = document.getElementById('playerHPBar');
  fill.style.width = `${pct}%`;
  fill.style.background = pct > 50 ? 'var(--green)' : pct > 25 ? 'orange' : 'var(--err)';
  document.getElementById('pbHP').textContent = `HP ${playerHP}/${maxHP}`;
}

// レーベンシュタイン距離による類似度計算
function calculateSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  if(s1 === s2) return 1;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  const editD = (a, b) => {
    const t = [];
    for (let i=0; i<=a.length; i++) t[i] = [i];
    for (let j=0; j<=b.length; j++) t[0][j] = j;
    for (let i=1; i<=a.length; i++) {
      for (let j=1; j<=b.length; j++) {
        t[i][j] = Math.min(t[i-1][j]+1, t[i][j-1]+1, t[i-1][j-1] + (a[i-1]===b[j-1]?0:1));
      }
    }
    return t[a.length][b.length];
  };
  return (longer.length - editD(longer, shorter)) / longer.length;
}

// 差分ハイライト
function generateDiffHtml(correct, input) {
  let res = "";
  const cArr = Array.from(correct);
  const iSet = new Set(Array.from(input || ''));
  cArr.forEach(char => {
    if (iSet.has(char)) res += `<b style="color:var(--ok)">${char}</b>`;
    else res += `<s style="color:var(--err); opacity:0.6">${char}</s>`;
  });
  return res;
}

function checkAnswer() {
  const q = quizList[quizIndex];
  const ua = document.getElementById('battleInput').value.trim();
  let ok = false;
  let diffH = "";
  
  if (q.type === 1) {
    const sim = calculateSimilarity(q.event, ua);
    ok = (sim >= 0.6 || (q.event.includes(ua) && ua.length >= 3));
    diffH = generateDiffHtml(q.event, ua);
  } else {
    ok = (Number(ua) === q.year);
  }
  
  document.getElementById('battleInput').disabled = true;
  document.getElementById('btnAttack').style.display = 'none';
  document.getElementById('btnNext').style.display = 'inline-flex';
  
  const sp = document.getElementById('enemySprite');
  if (ok) {
    quizScore++;
    sp.classList.add('hit'); setTimeout(()=>sp.classList.remove('hit'), 400);
    const sim = q.type === 1 ? calculateSimilarity(q.event, ua) : 1;
    if (q.type === 1 && sim < 1) {
      addLog(`✨ 惜しい、ほぼ正解！ ${q.year}: ${q.event}`, 'log-ok');
      addLogHtml(`🔍 ${diffH}`);
    } else {
      addLog(`✨ 正解！ ${q.year}年: ${q.event}`, 'log-ok');
    }
  } else {
    playerHP--;
    document.querySelector('.player-bar').classList.add('shake');
    setTimeout(()=>document.querySelector('.player-bar').classList.remove('shake'), 300);
    addLog(`💥 不正解... 正解は ${q.year}年: ${q.event}`, 'log-ng');
    if(q.type === 1 && ua.length > 0) addLogHtml(`🔍 ${diffH}`);
    updatePlayerBar();
  }
  
  reviewData.push({ ...q, userAnswer: ua, isCorrect: ok });
}

function nextQuestion() {
  quizIndex++;
  if (quizIndex < quizList.length && playerHP > 0) {
    renderQuestion();
  } else {
    document.getElementById('enemySprite').classList.add('dead');
    setTimeout(showResult, 700);
  }
}

async function showResult() {
  showScreen('screen-result');
  const total = quizList.length;
  const isPerfect = (quizScore === total);
  const isDefeat = (playerHP <= 0);
  
  const xpGained = quizScore * 10 + (isPerfect ? 50 : 0) + (currentStage && isPerfect ? currentStage * 5 : 0);
  
  // DB保存やプロファイル更新は、失敗してもUI更新を止めないように try-catch で囲む
  try {
    if (currentStage) await saveStageProgress(currentStage, quizScore, total, isPerfect);
    
    await saveRecord(curMode, quizScore, total, xpGained, isPerfect);
    
    const newXP = (currentProfile.xp || 0) + xpGained;
    const oldLv = RPG.getLevel(currentProfile.xp || 0);
    const newLv = RPG.getLevel(newXP);
    await dbFetch('profiles', {
      method: 'PATCH',
      filter: `id=eq.${currentUser.id}`,
      body: { xp: newXP, level: newLv, updated_at: new Date().toISOString() }
    });
    currentProfile.xp = newXP;
    
    const lvArea = document.getElementById('lvUpArea');
    if (newLv > oldLv) {
      lvArea.style.display = 'block';
      document.getElementById('lvUpText').textContent = `🎉 LEVEL UP! → Lv.${newLv} ${RPG.getClass(newLv)}`;
    } else {
      lvArea.style.display = 'none';
    }
  } catch (err) {
    console.error('Data save failed, but continue UI render:', err);
  }
  
  RPG.updateHeader();
  
  const icon = document.getElementById('rIcon');
  const title = document.getElementById('rTitle');
  const sub = document.getElementById('rSub');
  
  if (isPerfect) {
    icon.textContent='🏆'; title.textContent='PERFECT!'; title.className='result-title win';
    sub.textContent = currentStage ? `STAGE ${currentStage} 完全制覇！` : '全問正解！素晴らしい！';
    confetti({particleCount:200,spread:80,colors:['#ffd764','#ffe99a','#fff','#c9a227']});
    if(currentStage) setTimeout(showCert, 1500);
  } else if (isDefeat) {
    icon.textContent='💀'; title.textContent='DEFEAT...'; title.className='result-title lose';
    sub.textContent='HPが尽きた...再挑戦しよう！';
  } else {
    icon.textContent='⚔️'; title.textContent='VICTORY!'; title.className='result-title win';
    sub.textContent=`${Math.round((quizScore/total)*100)}% 達成！`;
  }
  
  document.getElementById('rsCorrect').textContent = quizScore;
  document.getElementById('rsWrong').textContent = total - quizScore;
  document.getElementById('rsXP').textContent = `+${xpGained}`;
  
  const wp = document.getElementById('wrongPanel');
  const wrs = reviewData.filter(r => !r.isCorrect);
  if (wrs.length) { wp.style.display = 'block'; document.getElementById('wrongCount').textContent = wrs.length; }
  else { wp.style.display = 'none'; }
  
  const rl = document.getElementById('reviewList');
  rl.innerHTML = '';
  reviewData.forEach(r => {
    const d = document.createElement('div');
    d.style.cssText = 'padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:.82rem';
    d.innerHTML = `<div style="display:flex;justify-content:space-between"><span>${r.year}年: ${r.event}</span><span style="color:${r.isCorrect?'var(--ok)':'var(--err)'}">${r.isCorrect?'○':'×'}</span></div><div style="font-size:.7rem;color:var(--txt3)">回答: ${r.userAnswer||'未回答'}</div>`;
    rl.appendChild(d);
  });
  
  await loadRecords(); // 最後に記録一覧を更新
}

async function saveRecord(mode, score, total, xpEarned, isPerfect) {
  try {
    await dbFetch('quiz_records', {
      method: 'POST',
      body: { user_id: currentUser.id, mode, score, total, xp_earned: xpEarned, is_perfect: isPerfect }
    });
  } catch(err) { console.error('saveRecord err:', err); }
}

async function loadRecords() {
  let data = [];
  try {
    const res = await dbFetch('quiz_records', { filter: `user_id=eq.${currentUser.id}&order=created_at.desc&limit=20` });
    data = res.data || [];
  } catch(err) { console.warn('loadRecords err:', err); }
  
  if (!data) return;
  document.getElementById('statTotal').textContent = data.length;
  document.getElementById('statPerfect').textContent = data.filter(r=>r.is_perfect).length;
  document.getElementById('statTotalXP').textContent = data.reduce((s,r)=>s+(r.xp_earned||0),0);
  
  const l = document.getElementById('recordsList');
  if(!data.length) { l.innerHTML = '<div class="empty-st">記録がありません</div>'; return; }
  l.innerHTML = '';
  const ml = {yearToEvent:'年号の試練', eventToYear:'出来事の試練', random:'混沌の迷宮'};
  data.forEach(r => {
    const d = new Date(r.created_at);
    const dStr = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    const pct = Math.round((r.score/r.total)*100);
    const div = document.createElement('div'); div.className = 'rec-item';
    div.innerHTML = `<div><span class="rec-mode">${ml[r.mode]||r.mode}</span>${r.is_perfect?'<span class="rec-perfect"> ✨満点</span>':''}<div class="rec-date">${dStr}</div></div><div style="text-align:right"><span class="rec-score ${pct===100?'rec-perfect':''}">${pct}%</span><div class="rec-date">+${r.xp_earned||0}XP</div></div>`;
    l.appendChild(div);
  });
}

function retryWrong() {
  const wd = reviewData.filter(r => !r.isCorrect).map(w => ({...w}));
  if(!wd.length) return;
  currentStage = null;
  _buildQuiz(wd, curMode);
  document.getElementById('battleLog').innerHTML = '<div>🔥 再戦！弱点克服！</div>';
  showScreen('screen-battle');
  renderQuestion();
}

/* ================================================
   UI Utils / その他
================================================ */
function addLog(msg, type) {
  const log = document.getElementById('battleLog');
  const d = document.createElement('div');
  d.className = type; d.textContent = msg;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
}

function addLogHtml(html) {
  const log = document.getElementById('battleLog');
  const d = document.createElement('div');
  d.style.cssText = 'font-size:0.75rem; color:var(--txt3); margin-top:2px;';
  d.innerHTML = html;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active'); window.scrollTo(0,0);
}
function switchTab(t) {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
  document.querySelector(`[data-tab="${t}"]`).classList.add('active');
  document.getElementById(`tab-${t}`).classList.add('active');
  if(t === 'records') loadRecords();
}
function goHome() { showScreen('screen-main'); switchTab('quest'); }
function showToast(m) {
  const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function showCert() {
  const now = new Date();
  document.getElementById('certName').textContent = `${currentProfile?.display_name||'冒険者'} 殿`;
  const stg = currentStage ? `（STAGE ${currentStage}）` : '';
  document.getElementById('certDate').textContent = `令和${now.getFullYear()-2018}年${now.getMonth()+1}月${now.getDate()}日 ${stg}`;
  document.getElementById('certOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('certOverlay').classList.add('active'), 10);
}
function closeCert() {
  document.getElementById('certOverlay').classList.remove('active');
  setTimeout(() => document.getElementById('certOverlay').style.display = 'none', 300);
}

// ファイル解析周り
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
  const wrap = document.getElementById('ocrWrap'), bar = document.getElementById('ocrBar'), txt = document.getElementById('ocrStatus');
  wrap.classList.add('visible');
  const blobs = [];
  for(const f of files){
    if(PDFProcessor.isPDF(f)) { const pb = await PDFProcessor.toImageBlobs(f, (p,t)=>txt.textContent=`PDF展開中 (${p}/${t})`); blobs.push(...pb); }
    else blobs.push(f);
  }
  let worker = null;
  try{
    txt.textContent='OCR初期化中...'; worker=await Tesseract.createWorker(['jpn','eng']);
    let added=0;
    for(let i=0;i<blobs.length;i++){
      bar.style.width=`${(i/blobs.length)*100}%`; txt.textContent=`解読中 (${i+1}/${blobs.length})`;
      const {data:{text}}=await worker.recognize(blobs[i]);
      for(const line of text.split(/\r?\n/)){
        const m = line.match(/(\d{1,4})\s*[年\s]+(.{3,})/);
        if(m){ const ok = await addEntry(parseInt(m[1]), m[2].replace(/^[年\s:：]+/,'').trim()); if(ok)added++; }
      }
    }
    renderDataList(); showToast(added?`✅ ${added}件の知識を獲得！`:'📖 新しいデータは見つかりませんでした');
  } finally {
    if(worker) await worker.terminate();
    wrap.classList.remove('visible'); bar.style.width='0%';
  }
}

async function importData(e) {
  const f = e.target.files?.[0]; if(!f) return;
  try {
    const arr = JSON.parse(await f.text());
    let added = 0;
    for(const i of arr) { const y = i.year||i.Year, ev = i.event||i.Event; if(y&&ev&&await addEntry(y,ev)) added++; }
    renderDataList(); showToast(added ? `✅ ${added}件追加` : '⚠️ 新データなし');
  } catch(err) { showToast('❌ 読込失敗'); }
  e.target.value = '';
}

function exportData() {
  const blob = new Blob([JSON.stringify(localData.map(d=>({year:d.year,event:d.event})),null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `history-quest.json`; a.click(); URL.revokeObjectURL(url);
}
function exportWrong() {
  const wd = reviewData.filter(r=>!r.isCorrect).map(w=>({year:w.year,event:w.event}));
  if(!wd.length) return;
  const blob = new Blob([JSON.stringify(wd,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `weak-list.json`; a.click(); URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fileInput').addEventListener('change', e => processFiles(Array.from(e.target.files)));
  document.getElementById('importInput').addEventListener('change', importData);
  document.getElementById('battleInput').addEventListener('keydown', e => {
    if(e.key === 'Enter' && document.getElementById('btnAttack').style.display !== 'none') checkAnswer();
  });
});
