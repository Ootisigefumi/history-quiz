/**
 * 歴史年表クイズ アプリ (ローカルOCR版)
 */

'use strict';

/* ================================================
   DataStore - データの保存・読み込み
================================================ */
const DataStore = {
  KEY: 'history_quiz_data',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  add(entry) {
    // 年号が0（紀元前等）の場合も考慮し、null/undefined/空文字チェックにする
    if (entry.year === null || entry.year === undefined || entry.year === '' || !entry.event) return false;
    const data = this.getAll();
    const yearNum = Number(entry.year);
    const eventStr = String(entry.event).trim();
    
    const isDup = data.some(d => Number(d.year) === yearNum && String(d.event).trim() === eventStr);
    if (!isDup) {
      data.push({ year: yearNum, event: eventStr });
      localStorage.setItem(this.KEY, JSON.stringify(data));
      return true;
    }
    return false;
  },

  remove(index) {
    const data = this.getAll();
    data.splice(index, 1);
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  clear() {
    localStorage.removeItem(this.KEY);
  },

  exportJSON() {
    const data = this.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-quiz-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importJSON(file) {
    if (!file) return 0;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!Array.isArray(imported)) throw new Error('JSONの形式が正しくありません。配列である必要があります。');
          let added = 0;
          for (const item of imported) {
            // 大文字小文字の両方に対応させる
            const y = item.year !== undefined ? item.year : item.Year;
            const ev = item.event !== undefined ? item.event : item.Event;
            if (y !== undefined && ev !== undefined) {
              if (this.add({ year: y, event: ev })) added++;
            }
          }
          resolve(added);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsText(file);
    });
  }
};

/* ================================================
   PDF & OCR Processor
================================================ */
const PDFProcessor = {
  async toImageBlobs(file, onProgress) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const blobs = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress(i, pdf.numPages);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      blobs.push(await new Promise(r => canvas.toBlob(r, 'image/png')));
    }
    return blobs;
  },
  isPDF(file) { return file.type === 'application/pdf' || file.name.endsWith('.pdf'); }
};

const OCRProcessor = {
  async processFiles(files, onProgress) {
    const all = [];
    let worker = null;
    try {
      onProgress(0, files.length, '準備中...');
      worker = await Tesseract.createWorker(['jpn', 'eng']);
      for (let i = 0; i < files.length; i++) {
        onProgress(i, files.length, `読取中 (${i+1}/${files.length})`);
        const { data: { text } } = await worker.recognize(files[i]);
        all.push(...DataParser.parse(text));
      }
    } finally { if (worker) await worker.terminate(); }
    return all;
  }
};

const DataParser = {
  parse(text) {
    const results = [];
    const lines = text.split(/\r?\n/);
    const regex = /(\d{1,4})[年\s]?[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]{2,}/g;

    for (const line of lines) {
      let match;
      while ((match = regex.exec(line)) !== null) {
        const year = parseInt(match[1], 10);
        const event = line.replace(/\d+/g, '').replace(/[年月\s]/g, '').trim();
        if (year && event.length > 2) results.push({ year, event });
      }
    }
    return results;
  }
};

/* ================================================
   QuizEngine
================================================ */
let currentQuizMode = 'random';
let currentQuizList = [];
let currentIndex = 0;
let score = 0;
let reviewData = [];

const QuizEngine = {
  generate(data, mode, limit = 10, sourceData = null) {
    currentQuizMode = mode;
    const baseData = sourceData || data;
    const shuffled = [...baseData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(limit, baseData.length));
    
    currentQuizList = selected.map(item => {
      let type;
      if (mode === 'yearToEvent') type = 1;
      else if (mode === 'eventToYear') type = 2;
      else type = Math.random() > 0.5 ? 1 : 2;

      return {
        ...item,
        type, // 1: 年号->出来事, 2: 出来事->年号
        pattern: type === 1 ? '年号から出来事を当てよう' : '出来事から年号を当てよう'
      };
    });
    
    currentIndex = 0;
    score = 0;
    reviewData = [];
    return currentQuizList[0];
  }
};

/* ================================================
   UIController
================================================ */
const UIController = {
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  },

  renderDataList() {
    const data = DataStore.getAll();
    const listEl = document.getElementById('dataList');
    document.getElementById('dataCount').textContent = data.length;

    listEl.innerHTML = data.length ? '' : '<div class="empty-state">📋 画像をアップロードするか、手動で追加してください</div>';
    data.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'data-item';
      div.innerHTML = `
        <span class="year-badge">${item.year}年</span>
        <span class="event-text">${item.event}</span>
        <button class="delete-btn" onclick="deleteData(${i})">✕</button>
      `;
      listEl.appendChild(div);
    });

    const hasData = data.length > 0;
    document.getElementById('btnStartMode1').disabled = !hasData;
    document.getElementById('btnStartMode2').disabled = !hasData;
    document.getElementById('btnStartMode3').disabled = !hasData;
  },

  renderQuestion() {
    const q = currentQuizList[currentIndex];
    document.getElementById('quizProgressText').textContent = `問題 ${currentIndex + 1} / ${currentQuizList.length}`;
    document.getElementById('quizScoreText').textContent = `正解: ${score}`;
    document.getElementById('quizProgressBar').style.width = `${(currentIndex / currentQuizList.length) * 100}%`;
    
    document.getElementById('quizPatternBadge').textContent = q.pattern;
    document.getElementById('quizQuestion').innerHTML = q.type === 1 
      ? `<span class="highlight">${q.year}年</span> に起きた出来事は？`
      : `<span class="highlight">${q.event}</span> が起きた年は？`;
    
    const label = document.getElementById('answerLabel');
    const input = document.getElementById('answerInput');
    label.textContent = q.type === 1 ? '出来事を入力' : '西暦（数字のみ）を入力';
    input.type = q.type === 1 ? 'text' : 'number';
    input.value = '';
    input.className = 'answer-input';
    input.disabled = false;
    
    document.getElementById('btnAnswer').style.display = 'inline-flex';
    document.getElementById('btnNext').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    setTimeout(() => input.focus(), 100);
  }
};

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
      const pdfBlobs = await PDFProcessor.toImageBlobs(f, (p, tot) => txt.textContent = `PDF変換中 (${p}/${tot})`);
      blobs.push(...pdfBlobs);
    } else blobs.push(f);
  }

  const entries = await OCRProcessor.processFiles(blobs, (d, t, m) => {
    bar.style.width = `${(d/t)*100}%`;
    txt.textContent = m;
  });

  let added = 0;
  entries.forEach(e => { if (DataStore.add(e)) added++; });
  wrap.classList.remove('visible');
  UIController.renderDataList();
  showToast(added > 0 ? `✅ ${added}件追加しました` : 'データが見つかりませんでした');
}

function manualAdd() {
  const y = document.getElementById('manualYear');
  const e = document.getElementById('manualEvent');
  if (DataStore.add({ year: Number(y.value), event: e.value.trim() })) {
    y.value = ''; e.value = '';
    UIController.renderDataList();
    showToast('✅ 追加しました');
  }
}

function deleteData(i) { DataStore.remove(i); UIController.renderDataList(); }
function clearAllData() { if (confirm('全データを削除しますか？')) { DataStore.clear(); UIController.renderDataList(); } }
function exportData() { DataStore.exportJSON(); }
async function importData(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const added = await DataStore.importJSON(file);
    UIController.renderDataList();
    if (added > 0) {
      showToast(`✅ ${added}件のデータをインポートしました`);
    } else {
      showToast('⚠️ 新しいデータは見つかりませんでした（重複または形式不良）');
    }
  } catch (err) {
    console.error('Import Error:', err);
    showToast('❌ インポート失敗: ' + err.message);
  }
  e.target.value = ''; // 同じファイルを再度選べるようにリセット
}

function startQuiz(mode) {
  const data = DataStore.getAll();
  if (data.length === 0) return;
  QuizEngine.generate(data, mode);
  UIController.showScreen('screen-quiz');
  UIController.renderQuestion();
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
  
  const resArea = document.getElementById('resultArea');
  resArea.style.display = 'block';
  resArea.innerHTML = `
    <div class="card" style="border-color:${isCorrect ? 'var(--success)' : 'var(--error)'}">
      <h3>${isCorrect ? '⭕ 正解！' : '❌ 不正解...'}</h3>
      <p>正解: <b>${q.year}年 ${q.event}</b></p>
    </div>
  `;
  
  if (isCorrect) score++;
  reviewData.push({ ...q, userAnswer, isCorrect });
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < currentQuizList.length) {
    UIController.renderQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  UIController.showScreen('screen-score');
  const pct = Math.round((score / currentQuizList.length) * 100);
  document.getElementById('scoreNumber').textContent = `${pct}%`;
  document.getElementById('scoreCircle').style.setProperty('--pct', pct);
  document.getElementById('scoreMessage').textContent = pct === 100 ? '完璧です！' : 'お疲れ様でした！';
  document.getElementById('scoreText').textContent = `${currentQuizList.length}問中 ${score}問正解`;

  const rList = document.getElementById('reviewList');
  rList.innerHTML = '';
  const wrongData = reviewData.filter(r => !r.isCorrect);
  
  // 苦手克服アクションの表示切り替え
  const wrongActions = document.getElementById('wrongActions');
  if (wrongData.length > 0) {
    wrongActions.style.display = 'block';
    document.getElementById('wrongCount').textContent = wrongData.length;
  } else {
    wrongActions.style.display = 'none';
  }

  reviewData.forEach(r => {
    const div = document.createElement('div');
    div.style.padding = '8px';
    div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between">
        <span>${r.year}年: ${r.event}</span>
        <span style="color:${r.isCorrect ? 'var(--success)' : 'var(--error)'}">${r.isCorrect ? '○' : '×'}</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted)">あなたの回答: ${r.userAnswer || '未回答'}</div>
    `;
    rList.appendChild(div);
  });
}

function startWrongOnlyQuiz() {
  const wrongData = reviewData.filter(r => !r.isCorrect);
  if (wrongData.length === 0) return;
  // 出来事・年号それ自体の情報のみを抽出して新クイズに
  const source = wrongData.map(w => ({ year: w.year, event: w.event }));
  QuizEngine.generate(null, currentQuizMode, 20, source);
  UIController.showScreen('screen-quiz');
  UIController.renderQuestion();
}

function exportWrongData() {
  const wrongData = reviewData.filter(r => !r.isCorrect).map(w => ({ year: w.year, event: w.event }));
  if (wrongData.length === 0) return;
  
  const blob = new Blob([JSON.stringify(wrongData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `weak-points-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('💾 苦手リストを書き出しました');
}

function goHome() { UIController.showScreen('screen-home'); }
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  UIController.renderDataList();
  document.getElementById('fileInput').addEventListener('change', e => processFiles(Array.from(e.target.files)));
  document.getElementById('importInput').addEventListener('change', importData);
});
