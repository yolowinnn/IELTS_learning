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
          <h1 class="cover-title">IELTS 7.5 Sprint</h1>
          <p class="cover-tag">8 weeks · daily skills practice · cloud-synced progress</p>
        </div>
        <div class="cover-features">
          <div class="cfeat"><span class="cf-ic">🗂️</span><div><b>Smart vocabulary</b><small>342 academic words · native British audio</small></div></div>
          <div class="cfeat"><span class="cf-ic">📖</span><div><b>Read · Listen · Write · Speak</b><small>Side-by-side passages · model answers + AI grading</small></div></div>
          <div class="cfeat"><span class="cf-ic">☁️</span><div><b>Sync everywhere</b><small>Seamless progress across web & phone</small></div></div>
        </div>
        <div class="cover-actions">
          <button class="btn-google" id="gLogin">${GOOGLE_G}<span>Sign in with Google</span></button>
          <div class="cover-or"><span>or sign in / sign up with email</span></div>
          <input class="cover-input" id="emEmail" type="email" inputmode="email" placeholder="Email" autocomplete="email" />
          <input class="cover-input" id="emPw" type="password" placeholder="Password (min 6 chars)" autocomplete="current-password" />
          <div class="row" style="gap:10px">
            <button class="btn" id="emLogin" style="flex:1">Sign in</button>
            <button class="btn ghost" id="emSignup" style="flex:1">Sign up</button>
          </div>
          <div class="cover-note" id="gNote"></div>
          <div class="row" style="justify-content:space-between">
            <button class="cover-skip" id="emForgot" style="font-size:13px">Forgot password?</button>
            <button class="cover-skip" id="gSkip" style="font-size:13px">Skip for now — try it locally →</button>
          </div>
        </div>
        <div class="cover-foot">Sign in to sync your progress across web & phone</div>
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
    view.innerHTML = '<div class="cover-splash"><div class="cover-logo">🎯</div><div class="spinner"></div><div class="faint mt12">Loading…</div></div>';
  }

  function hide() { document.body.classList.remove('cover-mode'); }

  window.Cover = { render, splash, hide };
})();
