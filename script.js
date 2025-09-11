(() => {
  const ring = document.getElementById('ring');
  const timeEl = document.getElementById('time');
  const minEl = document.getElementById('min');
  const secEl = document.getElementById('sec');

  const startPauseBtn = document.getElementById('startPause');
  const resetBtn = document.getElementById('reset');
  const preset3Btn = document.getElementById('preset3');
  const preset5Btn = document.getElementById('preset5');
  const plus1Btn = document.getElementById('plus1');
  const minus10Btn = document.getElementById('minus10');

  let isActive = false;   // カウント中か
  let total = 30;         // 合計秒
  let remaining = 30;     // 残り秒
  let endAt = 0;          // 終了予定時刻(ms)
  let tickTimer = null;

  // Web Audio: ビープ音
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }
  function beep() {
    if (!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    const now = audioCtx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    o.start(now);
    o.stop(now + 0.58);
  }

  function clampInputs() {
    let m = Math.max(0, Math.min(999, parseInt(minEl.value || '0', 10)));
    let s = Math.max(0, Math.min(59, parseInt(secEl.value || '0', 10)));
    minEl.value = m;
    secEl.value = s;
    return { m, s };
  }

  function getInputTotal() {
    const { m, s } = clampInputs();
    return m * 60 + s;
  }

  function setFromSeconds(sec, setInputs = false) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (setInputs) {
      minEl.value = m;
      secEl.value = s;
    }
    remaining = sec;
    if (!isActive) total = Math.max(remaining, 1); // 0割防止
    updateUI();
  }

  function formatMMSS(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateUI() {
    timeEl.textContent = formatMMSS(remaining);

    // 進捗リング
    const prog = total > 0 ? (total - remaining) / total : 0;
    const angle = Math.max(0, Math.min(1, prog)) * 360;
    ring.style.setProperty('--angle', `${angle}deg`);

    // タイトル
    if (isActive) {
      document.title = `⏳ ${formatMMSS(remaining)} - タイマー`;
    } else {
      document.title = 'タイマー';
    }

    // ボタン状態
    startPauseBtn.disabled = !isActive && remaining <= 0;
    startPauseBtn.textContent = isActive ? '一時停止' : (remaining > 0 ? '再開' : '開始');
    minEl.disabled = isActive;
    secEl.disabled = isActive;
  }

  function start() {
    if (isActive) return;
    const current = remaining > 0 ? remaining : getInputTotal();
    if (current <= 0) {
      updateUI();
      return;
    }
    remaining = current;
    total = Math.max(total, remaining);
    endAt = Date.now() + remaining * 1000;
    isActive = true;
    updateUI();
    runTick();
  }

  function pause() {
    if (!isActive) return;
    remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    isActive = false;
    clearInterval(tickTimer);
    tickTimer = null;
    updateUI();
  }

  function reset() {
    isActive = false;
    clearInterval(tickTimer);
    tickTimer = null;
    total = getInputTotal();
    remaining = total;
    updateUI();
  }

  function adjust(deltaSeconds) {
    // 実行中も残り時間に直接反映
    const wasActive = isActive;
    if (wasActive) pause();
    const next = Math.max(0, remaining + deltaSeconds);
    setFromSeconds(next, !wasActive); // 停止中は入力へも反映
    if (wasActive && next > 0) start();
  }

  function finish() {
    isActive = false;
    clearInterval(tickTimer);
    tickTimer = null;
    remaining = 0;
    updateUI();
    beep();
  }

  function runTick() {
    clearInterval(tickTimer);
    tickTimer = setInterval(() => {
      const leftMs = endAt - Date.now();
      if (leftMs <= 0) {
        finish();
        return;
      }
      const nextRemaining = Math.max(0, Math.ceil(leftMs / 1000));
      if (nextRemaining !== remaining) {
        remaining = nextRemaining;
        updateUI();
      }
    }, 200);
  }

  // イベント
  startPauseBtn.addEventListener('click', () => {
    ensureAudio();
    if (isActive) pause(); else start();
  });

  resetBtn.addEventListener('click', () => {
    ensureAudio();
    reset();
  });

  plus1Btn.addEventListener('click', () => {
    ensureAudio();
    adjust(60);
  });

  minus10Btn.addEventListener('click', () => {
    ensureAudio();
    adjust(-10);
  });

  // プリセット（3分 / 5分）
  function applyPreset(seconds) {
    ensureAudio();
    const wasActive = isActive;
    if (wasActive) pause();
    setFromSeconds(seconds, true);
  }
  preset3Btn.addEventListener('click', () => applyPreset(3 * 60));
  preset5Btn.addEventListener('click', () => applyPreset(5 * 60));

  minEl.addEventListener('change', () => {
    if (isActive) return;
    total = remaining = getInputTotal();
    updateUI();
  });
  secEl.addEventListener('change', () => {
    if (isActive) return;
    total = remaining = getInputTotal();
    updateUI();
  });

  // キーボードショートカット
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      startPauseBtn.click();
    } else if (e.key === 'r' || e.key === 'R') {
      resetBtn.click();
    }
  });

  // 初期表示（入力と同期）
  total = remaining = getInputTotal();
  updateUI();
})();
