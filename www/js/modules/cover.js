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
          <div class="cover-or"><span>或用邮箱登录 / 注册</span></div>
          <input class="cover-input" id="emEmail" type="email" inputmode="email" placeholder="邮箱" autocomplete="email" />
          <input class="cover-input" id="emPw" type="password" placeholder="密码(至少 6 位)" autocomplete="current-password" />
          <div class="row" style="gap:10px">
            <button class="btn" id="emLogin" style="flex:1">登录</button>
            <button class="btn ghost" id="emSignup" style="flex:1">注册</button>
          </div>
          <div class="cover-note" id="gNote"></div>
          <div class="row" style="justify-content:space-between">
            <button class="cover-skip" id="emForgot" style="font-size:13px">忘记密码?</button>
            <button class="cover-skip" id="gSkip" style="font-size:13px">暂不登录,本地体验 →</button>
          </div>
        </div>
        <div class="cover-foot">登录后,网页与手机 App 的学习进度自动同步</div>
      </div>
    `);
    view.appendChild(c);

    const note = c.querySelector('#gNote');
    const loginBtn = c.querySelector('#gLogin');
    const emEmail = c.querySelector('#emEmail');
    const emPw = c.querySelector('#emPw');
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!window.Sync || !Sync.configured()) {
      [loginBtn, c.querySelector('#emLogin'), c.querySelector('#emSignup')].forEach(b => b && (b.disabled = true));
      note.textContent = '本设备暂未配置云同步,可直接本地体验';
    }
    loginBtn.onclick = () => { note.textContent = '正在打开 Google 登录…'; Sync.signIn(); };
    c.querySelector('#gSkip').onclick = () => { Store.set('guestMode', true); App.enterApp(); };

    function check() {
      const e = (emEmail.value || '').trim(), p = emPw.value || '';
      if (!emailRe.test(e)) { note.textContent = '请输入有效邮箱'; return null; }
      if (p.length < 6) { note.textContent = '密码至少 6 位'; return null; }
      return { e, p };
    }
    async function doEmail(fn, label) {
      const v = check(); if (!v) return;
      note.textContent = label + '中…';
      const r = await fn(v.e, v.p);
      if (!r || !r.ok) note.textContent = (r && r.error) || (label + '失败');
      // 成功后 onAuth → gate → 自动进入 App
    }
    c.querySelector('#emLogin').onclick = () => doEmail(Sync.signInEmail, '登录');
    c.querySelector('#emSignup').onclick = () => doEmail(Sync.signUpEmail, '注册');
    c.querySelector('#emForgot').onclick = async () => {
      const e = (emEmail.value || '').trim();
      if (!emailRe.test(e)) { note.textContent = '先在上方填好邮箱,再点忘记密码'; return; }
      const r = await Sync.resetEmail(e);
      note.textContent = (r && r.ok) ? '重置邮件已发送,请查收' : ((r && r.error) || '发送失败');
    };
    emPw.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') c.querySelector('#emLogin').click(); });
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
