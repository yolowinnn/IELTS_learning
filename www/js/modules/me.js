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
        <div class="card-title mb8">📊 总览</div>
        <div class="stat-grid">
          <div class="stat"><b style="color:var(--warn)">${Store.Streak.get()}</b><small>连续打卡(天)</small></div>
          <div class="stat"><b>Day ${Store.currentDay()}</b><small>当前进度 / 56</small></div>
          <div class="stat"><b style="color:var(--good)">${srs.learned}</b><small>已学单词</small></div>
          <div class="stat"><b style="color:var(--accent)">${srs.mastered}</b><small>已掌握</small></div>
          <div class="stat"><b>${activeDays}</b><small>学习天数</small></div>
          <div class="stat"><b>${tasksDone}</b><small>完成任务数</small></div>
        </div>
      </div>
    `));

    // 技能平均分
    const avg = (arr) => arr && arr.length ? Math.round(arr.reduce((a, x) => a + (x.sc / x.total) * 100, 0) / arr.length) : null;
    const rAvg = avg(scores.reading), lAvg = avg(scores.listening);
    wrap.appendChild(el(`
      <div class="card">
        <div class="card-title mb8">🎯 各项练习</div>
        ${skillRow('📖 阅读', scores.reading?.length || 0, rAvg)}
        ${skillRow('🎧 听力', scores.listening?.length || 0, lAvg)}
        ${skillRow('✍️ 写作', scores.writing?.length || 0, null, '篇')}
        ${skillRow('🗣️ 口语', scores.speaking?.length || 0, null, '次')}
      </div>
    `));

    // 打卡日历(56天)
    const cal = el('<div class="card"><div class="card-title mb8">🔥 打卡日历(8周)</div><div class="cal" id="cal"></div></div>');
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
      calBox.appendChild(el(`<div class="cell ${lv} ${ds === todayS ? 'today' : ''}" title="${ds} · ${cnt}项"></div>`));
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
      c.innerHTML = '<div class="card-title mb8">☁️ 云同步</div><div class="faint">进度当前保存在本机。云同步配置完成后,可用 Google 登录在网页 / App 之间同步。</div>';
      return c;
    }
    if (u) {
      c.appendChild(el(`
        <div class="row" style="gap:12px">
          ${u.photoURL ? `<img class="avatar" src="${esc(u.photoURL)}" onerror="this.style.display='none'"/>` : '<div class="avatar" style="display:flex;align-items:center;justify-content:center">👤</div>'}
          <div style="flex:1;min-width:0">
            <b style="font-size:15px">${esc(u.displayName || '已登录')}</b>
            <div class="faint" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(u.email || '')}</div>
          </div>
          <span class="pill good" id="syncPill">已同步</span>
        </div>`));
      const btns = el('<div class="row mt12" style="gap:8px"></div>');
      const pushBtn = el('<button class="btn ghost sm" style="flex:1">立即同步</button>');
      const outBtn = el('<button class="btn ghost sm" style="flex:1">退出登录</button>');
      pushBtn.onclick = async () => { await Sync.pushNow(); Toast('已上传 ✅'); };
      outBtn.onclick = () => { Store.remove('guestMode'); Sync.signOut(); };
      btns.appendChild(pushBtn); btns.appendChild(outBtn); c.appendChild(btns);
      const pill = c.querySelector('#syncPill');
      Sync.onStatus(s => { if (!pill || !pill.isConnected) return; const m = { syncing: ['同步中…', 'warn'], synced: ['已同步', 'good'], 'signed-in': ['已登录', 'good'], error: ['同步出错', 'warn'], local: ['本地', ''] }; const v = m[s] || [s, '']; pill.textContent = v[0]; pill.className = 'pill ' + (v[1] || ''); });
    } else {
      c.innerHTML = '<div class="card-title mb8">☁️ 云同步</div><div class="faint mb8">登录后,网页和手机 App 的学习进度自动同步,换设备也不丢。</div>';
      const btn = el('<button class="btn block">使用 Google 登录</button>');
      btn.onclick = () => Sync.signIn();
      c.appendChild(btn);
    }
    return c;
  }

  function skillRow(label, count, avg, unit) {
    return `<div class="set-row"><span>${label}</span><span class="muted">${count} ${unit || '套'}${avg != null ? ` · 平均 ${avg}%` : ''}</span></div>`;
  }

  function settings(view) {
    const c = el(`<div class="card"><div class="card-title mb8">⚙️ 设置</div><div id="set"></div></div>`);
    const box = c.querySelector('#set');

    // 每日新词
    const dn = Store.get('dailyNew', 20);
    const r1 = el(`<div class="set-row"><span>每日新词数</span><select id="dn">${[10, 15, 20, 25, 30, 40].map(n => `<option value="${n}" ${n === dn ? 'selected' : ''}>${n} 个</option>`).join('')}</select></div>`);
    r1.querySelector('#dn').onchange = e => { Store.set('dailyNew', parseInt(e.target.value)); Toast('已保存'); };
    box.appendChild(r1);

    // 语速
    const rate = Store.get('ttsRate', 1.0);
    const r2 = el(`<div class="set-row"><span>朗读语速</span><select id="rt">${[0.7, 0.85, 1.0, 1.15, 1.3].map(n => `<option value="${n}" ${n === rate ? 'selected' : ''}>${n}×</option>`).join('')}</select></div>`);
    r2.querySelector('#rt').onchange = e => { Store.set('ttsRate', parseFloat(e.target.value)); Toast('已保存'); };
    box.appendChild(r2);

    // 语音
    const voices = TTS.listEnglishVoices();
    if (voices.length) {
      const cur = Store.get('ttsVoice', 'en-GB');
      const r3 = el(`<div class="set-row"><span>朗读口音</span><select id="vc"><option value="en-GB">英音 (默认)</option><option value="en-US">美音</option>${voices.map(v => `<option value="${v.lang}">${esc(v.name)} (${v.lang})</option>`).join('')}</select></div>`);
      r3.querySelector('#vc').value = cur;
      r3.querySelector('#vc').onchange = e => { Store.set('ttsVoice', e.target.value); Toast('已保存'); };
      box.appendChild(r3);
    }

    // 自动发音
    const auto = Store.get('autoSpeak', true);
    const r4 = el(`<div class="set-row"><span>背单词自动发音</span><input type="checkbox" id="as" style="width:22px;height:22px" ${auto ? 'checked' : ''}/></div>`);
    r4.querySelector('#as').onchange = e => { Store.set('autoSpeak', e.target.checked); };
    box.appendChild(r4);

    // 测试朗读
    const r5 = el(`<div class="set-row"><span>测试发音(内置音频)</span><button class="btn ghost sm" id="test">🔊 试听</button></div>`);
    r5.querySelector('#test').onclick = async () => {
      const ok = await AudioFX.playFile('audio/vocab/v001.mp3', 1.0);
      if (!ok && window.TTS) TTS.speak('Hello, this is your IELTS study assistant.');
      Toast(ok ? '播放内置音频 ✅' : '回退系统朗读');
    };
    box.appendChild(r5);

    // 重设起始日
    const r6 = el(`<div class="set-row"><span>学习起始日</span><span class="muted">${Store.startDate()} <button class="btn ghost sm" id="rs" style="margin-left:8px">重设为今天</button></span></div>`);
    r6.querySelector('#rs').onclick = () => { if (confirm('把今天设为 Day 1?(进度天数会重置,已学单词保留)')) { Store.set('startDate', Store.todayStr()); Toast('已重设'); App.go('me'); } };
    box.appendChild(r6);

    // 导出 / 导入
    const r7 = el(`<div class="set-row"><span>备份进度</span><span><button class="btn ghost sm" id="exp">导出</button> <button class="btn ghost sm" id="imp">导入</button></span></div>`);
    r7.querySelector('#exp').onclick = exportData;
    r7.querySelector('#imp').onclick = importData;
    box.appendChild(r7);

    // 重置
    const r8 = el(`<div class="set-row"><span style="color:var(--bad)">清空所有进度</span><button class="btn bad sm" id="reset">重置</button></div>`);
    r8.querySelector('#reset').onclick = () => {
      if (confirm('确定清空全部学习进度?此操作不可恢复。')) {
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
    Toast('已导出 ielts_progress.json');
  }
  function importData() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json';
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { const d = JSON.parse(rd.result); Object.keys(d).forEach(k => d[k] != null && Store.set(k, d[k])); location.reload(); } catch (e) { Toast('文件无效'); } };
      rd.readAsText(f);
    };
    inp.click();
  }

  window.Me = { render };
})();
