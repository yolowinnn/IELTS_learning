/* writing.js — 写作:题目 + 结构 + 句型 + 写作区 + 范文 + 自查清单 */
(function () {
  function find(id) { return (window.IELTS_DATA.writing || []).find(w => w.id === id) || (window.IELTS_DATA.writing || [])[0]; }

  function render(view, id) {
    const w = find(id);
    if (!w) return empty(view);
    view.innerHTML = '';
    const wrap = el('<div></div>');
    const minW = w.min_words || (w.task === 1 ? 150 : 250);

    wrap.appendChild(el(`
      <div class="subhead">
        <button class="back" onclick="App.back()">←</button>
        <div><h2>Task ${w.task} · ${esc(w.title)}</h2><div class="faint">${esc(w.type || '')} · 建议 ${w.task === 1 ? '20' : '40'} 分钟 · ≥${minW} 词</div></div>
      </div>
    `));

    // 题目
    wrap.appendChild(el(`<div class="card"><div class="card-title mb8">📋 题目</div><div>${esc(w.prompt)}</div></div>`));

    // 结构模板
    if (w.outline && w.outline.length) {
      const o = el(`<div class="card"><div class="spread"><div class="card-title">🧱 写作结构</div><button class="btn ghost sm" id="toO">展开</button></div><div id="oBody" class="hidden mt12"></div></div>`);
      const body = o.querySelector('#oBody');
      w.outline.forEach(step => body.appendChild(el(`<div class="phrase">${esc(step)}</div>`)));
      o.querySelector('#toO').onclick = (e) => { body.classList.toggle('hidden'); e.target.textContent = body.classList.contains('hidden') ? '展开' : '收起'; };
      wrap.appendChild(o);
    }

    // 句型
    if (w.useful_phrases && w.useful_phrases.length) {
      const p = el(`<div class="card"><div class="spread"><div class="card-title">💡 实用句型</div><button class="btn ghost sm" id="toP">展开</button></div><div id="pBody" class="hidden mt12"></div></div>`);
      const body = p.querySelector('#pBody');
      w.useful_phrases.forEach(ph => body.appendChild(el(`<div class="phrase">${esc(ph.en || ph)}${ph.zh ? `<span class="ph-zh">${esc(ph.zh)}</span>` : ''}</div>`)));
      p.querySelector('#toP').onclick = (e) => { body.classList.toggle('hidden'); e.target.textContent = body.classList.contains('hidden') ? '展开' : '收起'; };
      wrap.appendChild(p);
    }

    // 写作区
    const drafts = Store.get('writingDrafts', {});
    const editor = el(`
      <div class="card">
        <div class="spread mb8"><div class="card-title">✍️ 我的作文</div><div class="faint" id="timer">⏱️ 00:00</div></div>
        <textarea class="input" id="essay" placeholder="在这里写作文…">${esc(drafts[w.id]?.text || '')}</textarea>
        <div class="wordcount"><span id="wc">0</span> 词 / 目标 ≥${minW}</div>
        <button class="btn good block mt8" id="aigrade">🤖 用 Gemini AI 批改作文</button>
        <div class="row mt8" style="gap:8px">
          <button class="btn" id="save" style="flex:1">保存并完成</button>
          <button class="btn ghost" id="model" style="flex:1">查看范文</button>
        </div>
      </div>
    `);
    wrap.appendChild(editor);

    // 范文(隐藏)
    const modelCard = el(`<div class="card hidden" id="modelCard"><div class="card-title mb8">📕 参考范文(Band 8+)</div><div class="passage">${(w.model_answer || '').split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join('')}</div>${w.band_tips ? `<div class="explain mt8"><b>提分点</b><br>${esc(w.band_tips)}</div>` : ''}</div>`);
    wrap.appendChild(modelCard);

    // 自查清单
    if (w.checklist && w.checklist.length) {
      const c = el(`<div class="card"><div class="card-title mb8">✅ 评分自查(对照四项评分标准)</div><div id="cl"></div></div>`);
      const cl = c.querySelector('#cl');
      w.checklist.forEach((item, i) => {
        const row = el(`<label class="row" style="padding:8px 0;cursor:pointer"><input type="checkbox" style="width:20px;height:20px"/> <span>${esc(item)}</span></label>`);
        cl.appendChild(row);
      });
      wrap.appendChild(c);
    }

    view.appendChild(wrap);

    // 逻辑
    const ta = wrap.querySelector('#essay');
    const wc = wrap.querySelector('#wc');
    const count = () => { const n = (ta.value.trim().match(/\b[\w''-]+\b/g) || []).length; wc.textContent = n; wc.style.color = n >= minW ? 'var(--good)' : 'var(--tx-faint)'; };
    ta.oninput = count; count();

    // 计时
    let sec = 0; const timerEl = wrap.querySelector('#timer');
    const timer = setInterval(() => { sec++; const m = String(Math.floor(sec / 60)).padStart(2, '0'), s = String(sec % 60).padStart(2, '0'); timerEl.textContent = `⏱️ ${m}:${s}`; }, 1000);
    // 切走时清理
    const cleanup = () => clearInterval(timer);
    App.onLeave(cleanup);

    wrap.querySelector('#save').onclick = () => {
      Store.update('writingDrafts', {}, m => { m[w.id] = { text: ta.value, date: Store.todayStr(), words: (ta.value.trim().match(/\b[\w''-]+\b/g) || []).length }; return m; });
      Store.markTask('writing', true);
      App.refreshStreak();
      cleanup();
      Toast('已保存,写作完成 ✅');
    };
    wrap.querySelector('#model').onclick = (e) => {
      modelCard.classList.toggle('hidden');
      e.target.textContent = modelCard.classList.contains('hidden') ? '查看范文' : '收起范文';
      if (!modelCard.classList.contains('hidden')) modelCard.scrollIntoView({ behavior: 'smooth' });
    };

    wrap.querySelector('#aigrade').onclick = async () => {
      const text = ta.value.trim();
      if (text.length < 20) { Toast('先写一点内容再批改'); ta.focus(); return; }
      await copyText(gradePrompt(w, text));
      Toast('作文+批改提示词已复制,正在打开 Gemini');
      openGemini();
    };
  }

  function gradePrompt(w, text) {
    const crit = w.task === 1 ? 'Task Achievement' : 'Task Response';
    return `You are a strict but fair IELTS Writing examiner. Assess my Task ${w.task} answer using the official band descriptors: ${crit}, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.\n\nQUESTION:\n${w.prompt}\n\nMY ANSWER:\n${text}\n\nPlease give:\n1) A band score (0-9, half-bands allowed) for EACH of the four criteria, plus an overall band.\n2) The 3 most impactful weaknesses, each with a specific quote from my text.\n3) Concrete, actionable fixes for each.\n4) A model rewrite of my answer at band 8.\nBe honest and specific; do not inflate the score.`;
  }
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; }
    catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e2) {} ta.remove(); return true; }
  }
  function openGemini() {
    try { window.open('https://gemini.google.com/app', '_blank'); } catch (e) {}
  }

  function empty(view) { view.innerHTML = `<div class="empty"><div class="big">✍️</div><p>暂无写作题目</p><button class="btn" onclick="App.go('today')">返回</button></div>`; }

  window.Writing = { render };
})();
