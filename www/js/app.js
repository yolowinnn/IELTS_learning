/* app.js — 主控:标签路由、子页面栈、全局工具 */
(function () {
  const view = document.getElementById('view');
  const tabbar = document.getElementById('tabbar');
  const tbTitle = document.getElementById('tb-title');
  const streakNum = document.getElementById('streak-num');

  const TABS = {
    today:    { title: '今日学习', render: () => Dashboard.render(view) },
    vocab:    { title: '单词 · SRS', render: () => Vocab.render(view) },
    practice: { title: '题库练习', render: () => Practice.render(view) },
    me:       { title: '我的进度', render: () => Me.render(view) },
  };

  // 子页面注册表(从题库/今日进入)
  const MODULES = {
    reading:   (id) => Reading.render(view, id),
    listening: (id) => Listening.render(view, id),
    writing:   (id) => Writing.render(view, id),
    speaking:  (id) => Speaking.render(view, id),
  };

  let currentTab = 'today';

  // 页面离开时的清理(定时器、录音等),防止泄漏
  let cleanups = [];
  function registerCleanup(fn) { cleanups.push(fn); }
  function runCleanups() { cleanups.forEach(fn => { try { fn(); } catch (e) {} }); cleanups = []; if (window.AudioFX) AudioFX.stop(); else if (window.TTS) TTS.stopSeq(); }

  function setActiveTab(tab) {
    [...tabbar.querySelectorAll('.tab')].forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  }

  function go(tab) {
    runCleanups();
    view.classList.remove('wide');
    currentTab = tab;
    setActiveTab(tab);
    const t = TABS[tab];
    tbTitle.textContent = t.title;
    view.scrollTop = 0; window.scrollTo(0, 0);
    view.innerHTML = '';
    t.render();
    view.firstElementChild && view.firstElementChild.classList.add('fade-in');
    refreshStreak();
  }

  const MOD_TITLES = { reading: '阅读练习', listening: '听力练习', writing: '写作练习', speaking: '口语练习' };

  // 打开子页面(模块详情)
  function open(mod, id) {
    if (!MODULES[mod]) return;
    runCleanups();
    view.classList.toggle('wide', mod === 'reading' || mod === 'listening');
    view.scrollTop = 0; window.scrollTo(0, 0);
    if (MOD_TITLES[mod]) tbTitle.textContent = MOD_TITLES[mod];
    view.innerHTML = '';
    MODULES[mod](id);
    view.firstElementChild && view.firstElementChild.classList.add('fade-in');
    TTS.stopSeq();
  }

  function back() { go(currentTab); }

  function refreshStreak() { streakNum.textContent = Store.Streak.get(); }

  // 标签点击
  tabbar.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab'); if (!btn) return;
    TTS && TTS.stopSeq();
    go(btn.dataset.tab);
  });

  // ---- 全局工具 ----
  function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 1400);
    setTimeout(() => t.remove(), 1750);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // 庆祝彩屑
  function celebrate() {
    const colors = ['#6366f1', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];
    let box = document.getElementById('confetti');
    if (!box) { box = document.createElement('div'); box.id = 'confetti'; document.body.appendChild(box); }
    box.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const b = document.createElement('div');
      b.className = 'confetti-bit';
      b.style.left = Math.random() * 100 + 'vw';
      b.style.background = colors[i % colors.length];
      b.style.animationDuration = (1.6 + Math.random() * 1.5) + 's';
      b.style.animationDelay = (Math.random() * 0.5) + 's';
      b.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(b);
    }
    setTimeout(() => { if (box) box.innerHTML = ''; }, 3400);
  }

  window.App = { go, open, back, refreshStreak, el, onLeave: registerCleanup, currentTab: () => currentTab };
  window.Toast = toast;
  window.Celebrate = celebrate;
  window.el = el;
  window.esc = esc;

  // 词库去重:同一单词(忽略大小写)只保留首次出现,避免重复卡片
  (function dedupeVocab() {
    const seen = new Set();
    window.IELTS_DATA.vocab = (window.IELTS_DATA.vocab || []).filter(w => {
      const k = (w.word || '').trim().toLowerCase();
      if (!k || seen.has(k)) return false; seen.add(k); return true;
    });
  })();

  // 启动
  Store.startDate();          // 确保起始日已设
  Store.Streak.recompute();
  go('today');

  // 云同步(已配置 Firebase 则启用,否则仅本地)
  if (window.Sync) Sync.init();
})();
