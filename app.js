/**
 * 歴史クエスト - RPG風クイズアプリ
 */
'use strict';

/* ================================================
   DataStore
================================================ */
const DataStore = {
  KEY: 'history_quiz_data',
  getAll() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  add(entry) {
    if (entry.year === null || entry.year === undefined || entry.year === '' || !entry.event) return false;
    const data = this.getAll();
    const y = Number(entry.year), e = String(entry.event).trim();
    if (data.some(d => Number(d.year) === y && String(d.event).trim() === e)) return false;
    data.push({ year: y, event: e });
    localStorage.setItem(this.KEY, JSON.stringify(data));
    return true;
  },
  remove(i) { const d = this.getAll(); d.splice(i, 1); localStorage.setItem(this.KEY, JSON.stringify(d)); },
  clear() { localStorage.removeItem(this.KEY); },
  exportJSON() {
    const d = this.getAll();
    const b = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = u; a.download = `history-quest-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(u);
  },
  async importJSON(file) {
    if (!file) return 0;
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = (e) => {
        try {
          const arr = JSON.parse(e.target.result);
          if (!Array.isArray(arr)) throw new Error('配列形式ではありません');
          let n = 0;
          for (const it of arr) {
            const y = it.year !== undefined ? it.year : it.Year;
            const ev = it.event !== undefined ? it.event : it.Event;
            if (y !== undefined && ev) { if (this.add({ year: y, event: ev })) n++; }
          }
          resolve(n);
        } catch (err) { reject(err); }
      };
      r.onerror = () => reject(new Error('ファイル読み込み失敗'));
      r.readAsText(file);
    });
  }
};

/* ================================================
   PDF & OCR Processor
================================================ */
const PDFProcessor = {
  async toImageBlobs(file, onProgress) {
    const ab = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    const blobs = [];
    const c = document.createElement('canvas'), ctx = c.getContext('2d');
    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress(i, pdf.numPages);
      const pg = await pdf.getPage(i);
      const vp = pg.getViewport({ scale: 2.0 });
      c.width = vp.width; c.height = vp.height;
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
      blobs.push(await new Promise(r => c.toBlob(r, 'image/png')));
    }
    return blobs;
  },
  isPDF(f) { return f.type === 'application/pdf' || f.name.endsWith('.pdf'); }
};

const OCRProcessor = {
  async processFiles(files, onProgress) {
    const all = [];
    let w = null;
    try {
      onProgress(0, files.length, '準備中...');
      w = await Tesseract.createWorker(['jpn', 'eng']);
      for (let i = 0; i < files.length; i++) {
        onProgress(i, files.length, `解読中 (${i+1}/${files.length})`);
        const { data: { text } } = await w.recognize(files[i]);
        all.push(...DataParser.parse(text));
      }
    } finally { if (w) await w.terminate(); }
    return all;
  }
};

const DataParser = {
  parse(text) {
    const results = [];
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/(\d{1,4})\s*[年\s]?\s*(.{3,})/);
      if (m) {
        const yr = parseInt(m[1], 10);
        const ev = m[2].replace(/^[年\s:：]+/, '').trim();
        if (yr && ev.length > 2) results.push({ year: yr, event: ev });
      }
    }
    return results;
  }
};

/* ================================================
   RPG システム
================================================ */
const RPG = {
  XP_KEY: 'history_quest_xp',
  
  getXP() { return parseInt(localStorage.getItem(this.XP_KEY) || '0', 10); },
  addXP(n) {
    const before = this.getXP();
    const after = before + n;
    localStorage.setItem(this.XP_KEY, String(after));
    return { before, after, leveledUp: this.getLevel(after) > this.getLevel(before) };
  },
  getLevel(xp) {
    if (xp === undefined) xp = this.getXP();
    if (xp < 50) return 1;
    if (xp < 150) return 2;
    if (xp < 300) return 3;
    if (xp < 500) return 4;
    if (xp < 800) return 5;
    if (xp < 1200) return 6;
    if (xp < 1800) return 7;
    if (xp < 2500) return 8;
    if (xp < 3500) return 9;
    return 10;
  },
  getClass(level) {
    const classes = [
      '🗡️ 見習い剣士', '🗡️ 剣士', '⚔️ 戦士',
      '🛡️ 衛兵', '🏹 弓騎士', '🔥 魔法剣士',
      '⭐ 英雄', '👑 聖騎士', '🐉 竜騎士', '🏯 歴史王'
    ];
    return classes[Math.min(level - 1, classes.length - 1)];
  },
  getXPForNextLevel(level) {
    const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, 9999];
    return thresholds[Math.min(level, thresholds.length - 1)];
  },
  
  // 敵のランダム生成
  enemies: [
    { name: '年号ゴブリン', emoji: '👹' },
    { name: '歴史スライム', emoji: '🟢' },
    { name: '時空のドラゴン', emoji: '🐉' },
    { name: '古文書の亡霊', emoji: '👻' },
    { name: '忘却の魔王', emoji: '😈' },
    { name: '暗黒騎士', emoji: '🖤' },
    { name: '年表ゴーレム', emoji: '🗿' },
    { name: '記憶の怪物', emoji: '🧟' },
  ],
  getRandomEnemy() {
    return this.enemies[Math.floor(Math.random() * this.enemies.length)];
  },
  
  updateStatusBar() {
    const xp = this.getXP();
    const lv = this.getLevel(xp);
    document.getElementById('playerLevel').textContent = `Lv.${lv}`;
    document.getElementById('playerClass').textContent = this.getClass(lv);
    document.getElementById('totalXP').textContent = xp;
    if (document.getElementById('playerNameBattle')) {
      document.getElementById('playerNameBattle').textContent = this.getClass(lv);
    }
  }
};

/* ================================================
   Quiz Engine & State
================================================ */
let currentQuizMode = 'random';
let currentQuizList = [];
let currentIndex = 0;
let score = 0;
let reviewData = [];
let playerHP = 5;
let maxHP = 5;
let currentEnemy = null;

const QuizEngine = {
  generate(data, mode, limit = 10, sourceData = null) {
    currentQuizMode = mode;
    const base = sourceData || data;
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(limit, base.length));
    
    currentQuizList = selected.map(item => {
      let type;
      if (mode === 'yearToEvent') type = 1;
      else if (mode === 'eventToYear') type = 2;
      else type = Math.random() > 0.5 ? 1 : 2;
      return { ...item, type, pattern: type === 1 ? '年号の試練' : '出来事の試練' };
    });
    
    currentIndex = 0;
    score = 0;
    reviewData = [];
    playerHP = 5;
    maxHP = 5;
    return currentQuizList[0];
  }
};

/* ================================================
   UI Controller
================================================ */
const UIController = {
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  },
  
  renderDataList() {
    const data = DataStore.getAll();
    const list = document.getElementById('dataList');
    document.getElementById('dataCount').textContent = data.length;
    list.innerHTML = data.length ? '' : '<div class="empty-state">まだ知識がありません。巻物をアップロードしましょう。</div>';
    data.forEach((it, i) => {
      const d = document.createElement('div');
      d.className = 'data-item';
      d.innerHTML = `<span class="year-badge">${it.year}年</span><span>${it.event}</span><button class="delete-btn" onclick="deleteData(${i})">✕</button>`;
      list.appendChild(d);
    });
    const hasData = data.length > 0;
    document.getElementById('btnStartMode1').disabled = !hasData;
    document.getElementById('btnStartMode2').disabled = !hasData;
    document.getElementById('btnStartMode3').disabled = !hasData;
  },
  
  renderQuestion() {
    const q = currentQuizList[currentIndex];
    currentEnemy = RPG.getRandomEnemy();
    
    // 敵
    const sprite = document.getElementById('enemySprite');
    sprite.textContent = currentEnemy.emoji;
    sprite.className = 'enemy-sprite';
    document.getElementById('enemyName').textContent = currentEnemy.name;
    
    const remaining = currentQuizList.length - currentIndex;
    document.getElementById('enemyHpFill').style.width = `${(remaining / currentQuizList.length) * 100}%`;
    document.getElementById('enemyHpText').textContent = `HP ${remaining}/${currentQuizList.length}`;
    
    // 問題
    document.getElementById('quizProgressText').textContent = `${currentIndex + 1} / ${currentQuizList.length}`;
    document.getElementById('quizPatternBadge').textContent = q.pattern;
    document.getElementById('quizQuestion').innerHTML = q.type === 1
      ? `⚡ <span style="color:var(--gold);font-size:1.4rem">${q.year}年</span> に何が起きた？`
      : `⚡ <span style="color:var(--gold)">${q.event}</span> は何年？`;
    
    const input = document.getElementById('answerInput');
    input.type = q.type === 1 ? 'text' : 'number';
    input.placeholder = q.type === 1 ? '出来事を入力...' : '西暦（数字）を入力...';
    input.value = '';
    input.disabled = false;
    input.className = 'rpg-input answer-input';
    
    document.getElementById('btnAnswer').style.display = 'inline-flex';
    document.getElementById('btnNext').style.display = 'none';
    
    // プレイヤーHP
    updatePlayerHP();
    
    setTimeout(() => input.focus(), 100);
  }
};

function updatePlayerHP() {
  const pct = (playerHP / maxHP) * 100;
  const fill = document.getElementById('playerHpFill');
  fill.style.width = `${pct}%`;
  fill.style.background = pct > 50 ? 'var(--hp-green)' : pct > 25 ? 'var(--hp-yellow)' : 'var(--hp-red)';
  document.getElementById('playerHpVal').textContent = playerHP;
  document.getElementById('playerHpText').innerHTML = `HP <span id="playerHpVal">${playerHP}</span>/${maxHP}`;
}

/* ================================================
   Actions
================================================ */
async function processFiles(files) {
  const wrap = document.getElementById('ocrProgressWrap');
  const bar = document.getElementById('ocrProgressBar');
  const txt = document.getElementById('ocrStatusText');
  wrap.classList.add('visible');

  const blobs = [];
  for (const f of files) {
    if (PDFProcessor.isPDF(f)) {
      const pb = await PDFProcessor.toImageBlobs(f, (p, t) => txt.textContent = `巻物展開中 (${p}/${t})`);
      blobs.push(...pb);
    } else blobs.push(f);
  }

  const entries = await OCRProcessor.processFiles(blobs, (d, t, m) => {
    bar.style.width = `${(d/t)*100}%`;
    txt.textContent = m;
  });

  let added = 0;
  entries.forEach(e => { if (DataStore.add(e)) added++; });
  wrap.classList.remove('visible');
  bar.style.width = '0%';
  UIController.renderDataList();
  showToast(added > 0 ? `✅ ${added}件の知識を獲得！` : '新しい知識は見つかりませんでした');
}

function manualAdd() {
  const y = document.getElementById('manualYear');
  const e = document.getElementById('manualEvent');
  if (DataStore.add({ year: Number(y.value), event: e.value.trim() })) {
    y.value = ''; e.value = '';
    UIController.renderDataList();
    showToast('📜 知識を記録しました');
  }
}

function deleteData(i) { DataStore.remove(i); UIController.renderDataList(); }
function clearAllData() { if (confirm('全データを消去しますか？')) { DataStore.clear(); UIController.renderDataList(); } }
function exportData() { DataStore.exportJSON(); showToast('💾 冒険の書を保存しました'); }
async function importData(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const added = await DataStore.importJSON(file);
    UIController.renderDataList();
    showToast(added > 0 ? `✅ ${added}件の知識を獲得！` : '⚠️ 新しいデータはありませんでした');
  } catch (err) { showToast('❌ 読み込み失敗: ' + err.message); }
  e.target.value = '';
}

function startQuiz(mode) {
  const data = DataStore.getAll();
  if (data.length === 0) return;
  QuizEngine.generate(data, mode);
  document.getElementById('battleLog').innerHTML = '<div class="log-entry">⚔️ 戦闘開始！歴史の迷宮に挑む！</div>';
  UIController.showScreen('screen-quiz');
  UIController.renderQuestion();
}

function addBattleLog(text, type) {
  const log = document.getElementById('battleLog');
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function checkAnswer() {
  const q = currentQuizList[currentIndex];
  const input = document.getElementById('answerInput');
  const userAnswer = input.value.trim();
  const isCorrect = q.type === 1
    ? (q.event.includes(userAnswer) && userAnswer.length > 1)
    : (Number(userAnswer) === q.year);

  input.disabled = true;
  document.getElementById('btnAnswer').style.display = 'none';
  document.getElementById('btnNext').style.display = 'inline-flex';

  const sprite = document.getElementById('enemySprite');

  if (isCorrect) {
    score++;
    sprite.classList.add('hit');
    setTimeout(() => sprite.classList.remove('hit'), 400);
    addBattleLog(`✨ ${q.year}年「${q.event}」正解！会心の一撃！`, 'log-correct');
  } else {
    playerHP--;
    updatePlayerHP();
    // プレイヤーダメージ演出
    const hpArea = document.querySelector('.player-hp-area');
    hpArea.classList.add('damaged');
    setTimeout(() => hpArea.classList.remove('damaged'), 300);
    addBattleLog(`💥 不正解... 正解は ${q.year}年「${q.event}」。ダメージを受けた！`, 'log-wrong');
  }

  reviewData.push({ ...q, userAnswer, isCorrect });
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < currentQuizList.length && playerHP > 0) {
    UIController.renderQuestion();
  } else {
    // 敵討伐演出
    const sprite = document.getElementById('enemySprite');
    sprite.classList.add('dead');
    setTimeout(() => showScore(), 800);
  }
}

function showScore() {
  UIController.showScreen('screen-score');

  const total = currentQuizList.length;
  const wrong = total - score;
  const isPerfect = score === total;
  const isDefeat = playerHP <= 0;
  const earnedXP = score * 10 + (isPerfect ? 50 : 0);

  // XP加算
  const xpResult = RPG.addXP(earnedXP);
  RPG.updateStatusBar();

  // バナー
  const banner = document.getElementById('resultBanner');
  const icon = document.getElementById('resultIcon');
  const title = document.getElementById('resultTitle');
  const sub = document.getElementById('resultSub');

  if (isPerfect) {
    icon.textContent = '🏆';
    title.textContent = 'PERFECT VICTORY!';
    title.className = 'result-title victory';
    sub.textContent = '全問正解！伝説の勇者よ！';
    // 紙吹雪
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 }, colors: ['#ffd764', '#ffe99a', '#fff', '#c9a227'] });
    setTimeout(() => confetti({ particleCount: 100, spread: 60, origin: { x: 0.2, y: 0.6 } }), 500);
    setTimeout(() => confetti({ particleCount: 100, spread: 60, origin: { x: 0.8, y: 0.6 } }), 1000);
    setTimeout(showCertificate, 2000);
  } else if (isDefeat) {
    icon.textContent = '💀';
    title.textContent = 'DEFEAT...';
    title.className = 'result-title defeat';
    sub.textContent = 'HPが尽きた...もう一度挑戦しよう！';
  } else {
    icon.textContent = '⚔️';
    title.textContent = 'VICTORY!';
    title.className = 'result-title victory';
    sub.textContent = '敵を討伐した！';
  }

  // 統計値
  document.getElementById('statCorrect').textContent = score;
  document.getElementById('statWrong').textContent = wrong;
  document.getElementById('statXP').textContent = `+${earnedXP}`;

  // XP バー演出
  const xpArea = document.getElementById('xpGainArea');
  xpArea.style.display = 'block';
  const lv = RPG.getLevel(xpResult.after);
  const xpForNext = RPG.getXPForNextLevel(lv);
  const xpForCurrent = RPG.getXPForNextLevel(lv - 1);
  const pct = Math.min(((xpResult.after - xpForCurrent) / (xpForNext - xpForCurrent)) * 100, 100);
  setTimeout(() => document.getElementById('xpBarFill').style.width = `${pct}%`, 300);

  if (xpResult.leveledUp) {
    document.getElementById('levelUpText').style.display = 'block';
    document.getElementById('levelUpText').textContent = `🎉 LEVEL UP! → Lv.${lv} ${RPG.getClass(lv)}`;
  } else {
    document.getElementById('levelUpText').style.display = 'none';
  }

  // 間違えた問題
  const wrongActions = document.getElementById('wrongActions');
  const wrongData = reviewData.filter(r => !r.isCorrect);
  if (wrongData.length > 0) {
    wrongActions.style.display = 'block';
    document.getElementById('wrongCount').textContent = wrongData.length;
  } else {
    wrongActions.style.display = 'none';
  }

  // レビューリスト
  const rList = document.getElementById('reviewList');
  rList.innerHTML = '';
  reviewData.forEach(r => {
    const d = document.createElement('div');
    d.style.cssText = 'padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:0.85rem;';
    d.innerHTML = `
      <div style="display:flex; justify-content:space-between">
        <span>${r.year}年: ${r.event}</span>
        <span style="color:${r.isCorrect ? 'var(--success)' : 'var(--error)'}">${r.isCorrect ? '○' : '×'}</span>
      </div>
      <div style="font-size:0.7rem; color:var(--text-muted)">回答: ${r.userAnswer || '未回答'}</div>
    `;
    rList.appendChild(d);
  });
}

function showCertificate() {
  const overlay = document.getElementById('certificateOverlay');
  const now = new Date();
  document.getElementById('certDate').textContent = `令和${now.getFullYear()-2018}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分`;
  overlay.style.display = 'flex';
  overlay.classList.add('active');
}
function closeCertificate() {
  const o = document.getElementById('certificateOverlay');
  o.classList.remove('active');
  setTimeout(() => o.style.display = 'none', 400);
}

function startWrongOnlyQuiz() {
  const wd = reviewData.filter(r => !r.isCorrect).map(w => ({ year: w.year, event: w.event }));
  if (!wd.length) return;
  QuizEngine.generate(null, currentQuizMode, 20, wd);
  document.getElementById('battleLog').innerHTML = '<div class="log-entry">🔥 再戦！弱点克服に挑む！</div>';
  UIController.showScreen('screen-quiz');
  UIController.renderQuestion();
}

function exportWrongData() {
  const wd = reviewData.filter(r => !r.isCorrect).map(w => ({ year: w.year, event: w.event }));
  if (!wd.length) return;
  const b = new Blob([JSON.stringify(wd, null, 2)], { type: 'application/json' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a'); a.href = u;
  a.download = `weak-points-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(u);
  showToast('💾 弱点リストを保存しました');
}

function goHome() { UIController.showScreen('screen-home'); }
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  UIController.renderDataList();
  RPG.updateStatusBar();
  document.getElementById('fileInput').addEventListener('change', e => processFiles(Array.from(e.target.files)));
  document.getElementById('importInput').addEventListener('change', importData);
  document.getElementById('answerInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !document.getElementById('btnAnswer').style.display.includes('none')) checkAnswer();
  });
});
