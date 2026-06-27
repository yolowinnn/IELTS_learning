/* cover.js — 登录封面页 v4(premium):品牌渐变 + 玻璃卡片 + Google / 邮箱登录;离线/未配置可跳过本地用 */
(function () {
  const GOOGLE_G = '<svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>';

  // 品牌标:渐变圆角方 + 靶心 + 命中箭头(替代 🎯 emoji)
  const LOGO = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="IELTS 7.5">
      <defs>
        <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#6ee7b7"/><stop offset=".5" stop-color="#10b981"/><stop offset="1" stop-color="#0d9488"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="27" fill="url(#bm)"/>
      <rect x="6" y="6" width="88" height="46" rx="27" fill="#ffffff" opacity=".12"/>
      <circle cx="46" cy="54" r="23" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4.5"/>
      <circle cx="46" cy="54" r="13.5" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="4.5"/>
      <circle cx="46" cy="54" r="4.6" fill="#fff"/>
      <path d="M82 22 L48 56" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M82 22 l-13 2.2 M82 22 l-2.2 13" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/>
    </svg>`;

  function render() {
    const view = document.getElementById('view');
    document.body.classList.add('cover-mode');
    document.getElementById('tb-title').textContent = '';
    view.classList.remove('wide');
    view.innerHTML = '';
    const c = el(`
      <div class="cover2">
        <div class="cover2-orbs"><span></span><span></span><span></span></div>
        <div class="cover2-inner">
          <div class="brandmark">${LOGO}</div>
          <h1 class="cover2-title">IELTS <span class="grad7">7.5</span></h1>
          <p class="cover2-sub">Your 8-week sprint to a higher band</p>
          <div class="cover2-chips">
            <span>🗂️ 342 words</span><span>🎧 Real audio</span><span>🗣️ AI examiner</span>
          </div>
          <div class="auth-card">
            <button class="btn-google" id="gLogin">${GOOGLE_G}<span>Continue with Google</span></button>
            <div class="cover-or"><span>or</span></div>
            <input class="cover-input" id="emEmail" type="email" inputmode="email" placeholder="Email" autocomplete="email" />
            <input class="cover-input" id="emPw" type="password" placeholder="Password (min 6 characters)" autocomplete="current-password" />
            <button class="btn block" id="emLogin">Sign in</button>
            <div class="auth-links">
              <button id="emSignup">Create account</button>
              <button id="emForgot">Forgot password?</button>
            </div>
            <div class="cover-note" id="gNote"></div>
          </div>
          <button class="cover-skip" id="gSkip">Skip — explore locally →</button>
          <div class="cover-foot">Sign in to sync your progress across web &amp; phone</div>
        </div>
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
      note.textContent = 'Cloud sync is not set up on this device — you can use it locally';
    }
    loginBtn.onclick = () => { note.textContent = 'Opening Google sign-in…'; Sync.signIn(); };
    c.querySelector('#gSkip').onclick = () => { Store.set('guestMode', true); App.enterApp(); };

    function check() {
      const e = (emEmail.value || '').trim(), p = emPw.value || '';
      if (!emailRe.test(e)) { note.textContent = 'Enter a valid email'; return null; }
      if (p.length < 6) { note.textContent = 'Password must be at least 6 characters'; return null; }
      return { e, p };
    }
    async function doEmail(fn, label) {
      const v = check(); if (!v) return;
      note.textContent = label + '…';
      const r = await fn(v.e, v.p);
      if (!r || !r.ok) note.textContent = (r && r.error) || (label + ' failed');
      // 成功后 onAuth → gate → 自动进入 App
    }
    c.querySelector('#emLogin').onclick = () => doEmail(Sync.signInEmail, 'Sign in');
    c.querySelector('#emSignup').onclick = () => doEmail(Sync.signUpEmail, 'Sign up');
    c.querySelector('#emForgot').onclick = async () => {
      const e = (emEmail.value || '').trim();
      if (!emailRe.test(e)) { note.textContent = 'Enter your email above first, then tap forgot password'; return; }
      const r = await Sync.resetEmail(e);
      note.textContent = (r && r.ok) ? 'Reset email sent — check your inbox' : ((r && r.error) || 'Send failed');
    };
    emPw.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') c.querySelector('#emLogin').click(); });
  }

  function splash() {
    const view = document.getElementById('view');
    document.body.classList.add('cover-mode');
    document.getElementById('tb-title').textContent = '';
    view.innerHTML = `<div class="cover-splash"><div class="brandmark">${LOGO}</div><div class="spinner"></div><div class="faint mt12">Loading…</div></div>`;
  }

  function hide() { document.body.classList.remove('cover-mode'); }

  window.Cover = { render, splash, hide };
})();
