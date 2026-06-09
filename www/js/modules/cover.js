/* cover.js — 登录封面页:进入 App 前先走 Google 登录(离线/未配置可跳过本地用) */
(function () {
  const GOOGLE_G = '<svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>';

  function render() {
    const view = document.getElementById('view');
    document.body.classList.add('cover-mode');
    document.getElementById('tb-title').textContent = '';
    view.classList.remove('wide');
    view.innerHTML = '';
    const c = el(`
      <div class="cover">
        <div class="cover-hero">
          <div class="cover-logo">🎯</div>
          <h1 class="cover-title">雅思 7.5 冲刺</h1>
          <p class="cover-tag">8 周 · 每天听说读写词全练 · 进度云端同步</p>
        </div>
        <div class="cover-features">
          <div class="cfeat"><span class="cf-ic">🗂️</span><div><b>智能背单词</b><small>342 高频学术词 · 真人英音发音</small></div></div>
          <div class="cfeat"><span class="cf-ic">📖</span><div><b>读 · 听 · 写 · 说</b><small>文章题目同屏 · 范文 + AI 批改</small></div></div>
          <div class="cfeat"><span class="cf-ic">☁️</span><div><b>多端同步</b><small>网页 / 手机 学习进度无缝衔接</small></div></div>
        </div>
        <div class="cover-actions">
          <button class="btn-google" id="gLogin">${GOOGLE_G}<span>使用 Google 登录</span></button>
          <button class="cover-skip" id="gSkip">暂不登录,先本地体验 →</button>
          <div class="cover-note" id="gNote"></div>
        </div>
        <div class="cover-foot">登录后,网页与手机 App 的学习进度自动同步</div>
      </div>
    `);
    view.appendChild(c);

    const note = c.querySelector('#gNote');
    const loginBtn = c.querySelector('#gLogin');
    if (!window.Sync || !Sync.configured()) {
      loginBtn.disabled = true;
      note.textContent = '本设备暂未配置云同步,可直接本地体验';
    }
    loginBtn.onclick = () => { note.textContent = '正在打开 Google 登录…'; Sync.signIn(); };
    c.querySelector('#gSkip').onclick = () => { Store.set('guestMode', true); App.enterApp(); };
  }

  function splash() {
    const view = document.getElementById('view');
    document.body.classList.add('cover-mode');
    document.getElementById('tb-title').textContent = '';
    view.innerHTML = '<div class="cover-splash"><div class="cover-logo">🎯</div><div class="spinner"></div><div class="faint mt12">正在载入…</div></div>';
  }

  function hide() { document.body.classList.remove('cover-mode'); }

  window.Cover = { render, splash, hide };
})();
