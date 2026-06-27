/* me.js — 我的:进度统计、打卡日历、设置 */
(function () {
  function render(view) {
    view.innerHTML = '';
    const wrap = el('<div></div>');
    wrap.appendChild(accountCard());
    const srs = SRS.stats();
    const scores = Store.get('scores', {});
    const progress = Store.get('progress', {});
    const tasksDone = Object.values(progress).reduce((a, d) => a + Object.values(d).filter(Boolean).length, 0);
    const activeDays = Store.get('activeDates', []).length;

    // 统计
    wrap.appendChild(el(`
      <div class="card">
        <div class="card-title mb8">📊 Overview</div>
        <div class="stat-grid">
          <div class="stat"><b style="color:var(--warn)">${Store.Streak.get()}</b><small>Day streak</small></div>
          <div class="stat"><b>Day ${Store.currentDay()}</b><small>Current day / 56</small></div>
          <div class="stat"><b style="color:var(--good)">${srs.learned}</b><small>Words learned</small></div>
          <div class="stat"><b style="color:var(--accent)">${srs.mastered}</b><small>Mastered</small></div>
          <div class="stat"><b>${activeDays}</b><small>Active days</small></div>
          <div class="stat"><b>${tasksDone}</b><small>Tasks done</small></div>
        </div>
      </div>
    `));

    // 技能平均分
    const avg = (arr) => arr && arr.length ? Math.round(arr.reduce((a, x) => a + (x.sc / x.total) * 100, 0) / arr.length) : null;
    const rAvg = avg(scores.reading), lAvg = avg(scores.listening);
    wrap.appendChild(el(`
      <div class="card">
        <div class="card-title mb8">🎯 Practice scores</div>
        ${skillRow('📖 Reading', scores.reading?.length || 0, rAvg)}
        ${skillRow('🎧 Listening', scores.listening?.length || 0, lAvg)}
        ${skillRow('✍️ Writing', scores.writing?.length || 0, null, 'essays')}
        ${skillRow('🗣️ Speaking', scores.speaking?.length || 0, null, 'sessions')}
      </div>
    `));

    // 打卡日历(56天)
    const cal = el('<div class="card"><div class="card-title mb8">🔥 Streak calendar (8 weeks)</div><div class="cal" id="cal"></div></div>');
    const calBox = cal.querySelector('#cal');
    const start = Store.startDate();
    const activeSet = new Set(Store.get('activeDates', []));
    const todayS = Store.todayStr();
    for (let i = 0; i < 56; i++) {
      const d = new Date(start + 'T00:00:00'); d.setDate(d.getDate() + i);
      const ds = Store.todayStr(d);
      const done = activeSet.has(ds);
      const cnt = done ? Object.values(progress[ds] || {}).filter(Boolean).length : 0;
      const lv = cnt >= 4 ? 'lv3' : cnt >= 2 ? 'lv2' : cnt >= 1 ? 'lv1' : '';
      calBox.appendChild(el(`<div class="cell ${lv} ${ds === todayS ? 'today' : ''}" title="${ds} · ${cnt} done"></div>`));
    }
    wrap.appendChild(cal);

    // 设置
    wrap.appendChild(settings(view));

    view.appendChild(wrap);
  }

  function accountCard() {
    const c = el('<div class="card"></div>');
    const u = window.Sync && Sync.currentUser && Sync.currentUser();
    if (!window.Sync || !Sync.configured()) {
      c.innerHTML = '<div class="card-title mb8">☁️ Cloud sync</div><div class="faint">Progress is stored on this device. Once cloud sync is set up, sign in with Google to sync between web and app.</div>';
      return c;
    }
    if (u) {
      c.appendChild(el(`
        <div class="row" style="gap:12px">
          ${u.photoURL ? `<img class="avatar" src="${esc(u.photoURL)}" onerror="this.style.display='none'"/>` : '<div class="avatar" style="display:flex;align-items:center;justify-content:center">👤</div>'}
          <div style="flex:1;min-width:0">
            <b style="font-size:15px">${esc(u.displayName || 'Signed in')}</b>
            <div class="faint" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(u.email || '')}</div>
          </div>
          <span class="pill good" id="syncPill">Synced</span>
        </div>`));
      const btns = el('<div class="row mt12" style="gap:8px"></div>');
      const pushBtn = el('<button class="btn ghost sm" style="flex:1">Sync now</button>');
      const outBtn = el('<button class="btn ghost sm" style="flex:1">Sign out</button>');
      pushBtn.onclick = async () => { await Sync.pushNow(); Toast('Uploaded ✅'); };
      outBtn.onclick = () => { Store.remove('guestMode'); Sync.signOut(); };
      btns.appendChild(pushBtn); btns.appendChild(outBtn); c.appendChild(btns);
      const pill = c.querySelector('#syncPill');
      Sync.onStatus(s => { if (!pill || !pill.isConnected) return; const m = { syncing: ['Syncing…', 'warn'], synced: ['Synced', 'good'], 'signed-in': ['Signed in', 'good'], error: ['Sync error', 'warn'], local: ['Local', ''] }; const v = m[s] || [s, '']; pill.textContent = v[0]; pill.className = 'pill ' + (v[1] || ''); });
    } else {
      c.innerHTML = '<div class="card-title mb8">☁️ Cloud sync</div><div class="faint mb8">Once signed in, your progress syncs automatically between web and phone — nothing is lost when you switch devices.</div>';
      const btn = el('<button class="btn block">Sign in with Google</button>');
      btn.onclick = () => Sync.signIn();
      c.appendChild(btn);
    }
    return c;
  }

  function skillRow(label, count, avg, unit) {
    return `<div class="set-row"><span>${label}</span><span class="muted">${count} ${unit || 'sets'}${avg != null ? ` · avg ${avg}%` : ''}</span></div>`;
  }

  function settings(view) {
    const c = el(`<div class="card"><div class="card-title mb8">⚙️ Settings</div><div id="set"></div></div>`);
    const box = c.querySelector('#set');

    // 每日新词
    const dn = Store.get('dailyNew', 20);
    const r1 = el(`<div class="set-row"><span>New words per day</span><select id="dn">${[10, 15, 20, 25, 30, 40].map(n => `<option value="${n}" ${n === dn ? 'selected' : ''}>${n}</option>`).join('')}</select></div>`);
    r1.querySelector('#dn').onchange = e => { Store.set('dailyNew', parseInt(e.target.value)); Toast('Saved'); };
    box.appendChild(r1);

    // 语速
    const rate = Store.get('ttsRate', 1.0);
    const r2 = el(`<div class="set-row"><span>Speech speed</span><select id="rt">${[0.7, 0.85, 1.0, 1.15, 1.3].map(n => `<option value="${n}" ${n === rate ? 'selected' : ''}>${n}×</option>`).join('')}</select></div>`);
    r2.querySelector('#rt').onchange = e => { Store.set('ttsRate', parseFloat(e.target.value)); Toast('Saved'); };
    box.appendChild(r2);

    // 语音
    const voices = TTS.listEnglishVoices();
    if (voices.length) {
      const cur = Store.get('ttsVoice', 'en-GB');
      const r3 = el(`<div class="set-row"><span>Accent</span><select id="vc"><option value="en-GB">British (default)</option><option value="en-US">American</option>${voices.map(v => `<option value="${v.lang}">${esc(v.name)} (${v.lang})</option>`).join('')}</select></div>`);
      r3.querySelector('#vc').value = cur;
      r3.querySelector('#vc').onchange = e => { Store.set('ttsVoice', e.target.value); Toast('Saved'); };
      box.appendChild(r3);
    }

    // 自动发音
    const auto = Store.get('autoSpeak', true);
    const r4 = el(`<div class="set-row"><span>Auto-pronounce in flashcards</span><input type="checkbox" id="as" style="width:22px;height:22px" ${auto ? 'checked' : ''}/></div>`);
    r4.querySelector('#as').onchange = e => { Store.set('autoSpeak', e.target.checked); };
    box.appendChild(r4);

    // 测试朗读
    const r5 = el(`<div class="set-row"><span>Test pronunciation (bundled audio)</span><button class="btn ghost sm" id="test">🔊 Play</button></div>`);
    r5.querySelector('#test').onclick = async () => {
      const ok = await AudioFX.playFile('audio/vocab/v001.mp3', 1.0);
      if (!ok && window.TTS) TTS.speak('Hello, this is your IELTS study assistant.');
      Toast(ok ? 'Played bundled audio ✅' : 'Fell back to system speech');
    };
    box.appendChild(r5);

    // 重设起始日
    const r6 = el(`<div class="set-row"><span>Start date</span><span class="muted">${Store.startDate()} <button class="btn ghost sm" id="rs" style="margin-left:8px">Reset to today</button></span></div>`);
    r6.querySelector('#rs').onclick = () => { if (confirm('Set today as Day 1? (Day count resets; learned words are kept.)')) { Store.set('startDate', Store.todayStr()); Toast('Reset done'); App.go('me'); } };
    box.appendChild(r6);

    // Export / Import
    const r7 = el(`<div class="set-row"><span>Back up progress</span><span><button class="btn ghost sm" id="exp">Export</button> <button class="btn ghost sm" id="imp">Import</button></span></div>`);
    r7.querySelector('#exp').onclick = exportData;
    r7.querySelector('#imp').onclick = importData;
    box.appendChild(r7);

    // 重置
    const r8 = el(`<div class="set-row"><span style="color:var(--bad)">Erase all progress</span><button class="btn bad sm" id="reset">Reset</button></div>`);
    r8.querySelector('#reset').onclick = () => {
      if (confirm('Erase all progress? This cannot be undone.')) {
        ['srs', 'progress', 'scores', 'writingDrafts', 'newLearned', 'activeDates', 'streak', 'startDate'].forEach(k => Store.remove(k));
        location.reload();
      }
    };
    box.appendChild(r8);

    return c;
  }

  function exportData() {
    const keys = ['srs', 'progress', 'scores', 'writingDrafts', 'newLearned', 'startDate', 'dailyNew', 'ttsRate', 'ttsVoice', 'autoSpeak'];
    const dump = {}; keys.forEach(k => dump[k] = Store.get(k, null));
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ielts_progress.json'; a.click();
    Toast('Exported ielts_progress.json');
  }
  function importData() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json';
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { const d = JSON.parse(rd.result); Object.keys(d).forEach(k => d[k] != null && Store.set(k, d[k])); location.reload(); } catch (e) { Toast('Invalid file'); } };
      rd.readAsText(f);
    };
    inp.click();
  }

  window.Me = { render };
})();
