/* player.js — 全站共用的音频播放器(听力真题 / 阅读文章朗读 / 写作范文朗读)。

   为什么要先缓冲再播放:用户网络慢。浏览器默认是「边下边播」,网速一抖就卡在中间,
   或者 play() 直接被拒绝,只留一句 "Tap again to start audio"。这里改成:
     进页面就开始下载 → 按钮显示 Loading 42% → 整段下完才允许播 → 播放途中不再取网络。
   点了播放但还没下完,不会报错,而是记下"想播",下完自动开始(点击时先 play/pause 解锁过
   媒体元素,所以后面非手势触发的 play() 不会被浏览器拦)。

   用法:
     const card = Player.file({ src, markers, tag, compact });
   返回一个 .card 元素,自带 进度条 / ±10s / 变速 / Repeat ×1 ×3 ×5 ×10 ∞。
*/
(function () {
  const GAP_MS = 1200;              // 循环之间的间隔,跟读时好换气
  const SLOW_HINT_MS = 2500;        // 超过这个时间还没下完,给个"可以直接播"的出口

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60), x = Math.floor(s % 60);
    return m + ':' + String(x).padStart(2, '0');
  }

  function file(opts) {
    opts = opts || {};
    const src = opts.src;
    const card = el(`
      <div class="card player">
        <audio preload="none"></audio>
        <div class="row" style="gap:12px;align-items:center">
          <button class="btn play-fab" data-p="play">▶</button>
          <div style="flex:1;min-width:0">
            <input type="range" data-p="seek" class="seek" min="0" max="1000" value="0" />
            <div class="bar" data-p="bufbar" style="height:4px;margin-top:-2px"><i data-p="buf" style="width:0%"></i></div>
            <div class="spread faint" style="font-size:12px"><span data-p="cur">0:00</span><span data-p="dur">--:--</span></div>
          </div>
        </div>
        <div class="row mt8" style="gap:8px;flex-wrap:wrap;align-items:center">
          <button class="btn ghost sm" data-p="b10">↺ 10s</button>
          <button class="btn ghost sm" data-p="f10">10s ↻</button>
          <label class="faint">Speed
            <select data-p="rate"><option value="0.75">0.75×</option><option value="0.9">0.9×</option><option value="1" selected>1.0×</option><option value="1.25">1.25×</option></select>
          </label>
          <label class="faint">Repeat
            <select data-p="loop"><option value="1">×1</option><option value="3">×3</option><option value="5">×5</option><option value="10">×10</option><option value="0">∞</option></select>
          </label>
          <span class="pill" data-p="loopN" style="display:none"></span>
          ${opts.tag ? `<span class="pill accent">${esc(opts.tag)}</span>` : ''}
        </div>
        <div class="faint mt8" data-p="state" style="font-size:12px;min-height:18px"></div>
        <div data-p="markers" class="row mt8" style="gap:6px;flex-wrap:wrap"></div>
      </div>`);

    const a = card.querySelector('audio');
    const playBtn = card.querySelector('[data-p="play"]');
    const seek = card.querySelector('[data-p="seek"]');
    const curEl = card.querySelector('[data-p="cur"]'), durEl = card.querySelector('[data-p="dur"]');
    const bufEl = card.querySelector('[data-p="buf"]');
    const stateEl = card.querySelector('[data-p="state"]');
    let dragging = false, ready = false, wantPlay = false, failed = false;
    let slowTimer = null;

    App.onLeave(() => { try { a.pause(); } catch (e) {} clearGap(); if (slowTimer) clearTimeout(slowTimer); });

    // ---- 下载(整段下完再播) ----
    // 不靠浏览器的 preload:Chrome 会在缓冲一段后主动 suspend,进度永远停在个位数。
    // 改成自己 fetch 成 Blob,进度是真实字节数,下完把 objectURL 交给 <audio>,
    // 之后播放完全在内存里,拖进度、循环、变速都不会再碰网络。
    let objUrl = null;
    App.onLeave(() => { if (objUrl) { try { URL.revokeObjectURL(objUrl); } catch (e) {} objUrl = null; } });

    function setPct(pct, note) {
      bufEl.style.width = Math.round(pct * 100) + '%';
      stateEl.textContent = note || `Downloading ${Math.round(pct * 100)}% — it starts on its own when the whole track is here.`;
    }
    function markReady(note) {
      if (ready) return;
      ready = true;
      if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
      bufEl.style.width = '100%';
      stateEl.textContent = note || 'Ready — plays from memory, no network needed.';
      playBtn.textContent = a.paused ? '▶' : '⏸';
      if (wantPlay) { wantPlay = false; start(); }
    }
    // fetch 不通(跨域没有 CORS、或者根本没有 fetch)时的退路:老老实实边下边播
    let streaming = false;
    function streamFallback(why) {
      if (!streaming) { streaming = true; a.preload = 'auto'; a.src = src; }
      markReady(why || 'Streaming — playback may pause if the connection drops.');
    }

    async function download() {
      failed = false;
      playBtn.textContent = '⋯';
      setPct(0, 'Starting download…');
      if (typeof fetch !== 'function') return streamFallback();
      try {
        const res = await fetch(src, { cache: 'force-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const total = Number(res.headers.get('content-length')) || 0;
        let blob;
        if (res.body && res.body.getReader && total) {
          const reader = res.body.getReader();
          const chunks = []; let got = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value); got += value.length;
            setPct(got / total);
          }
          blob = new Blob(chunks, { type: res.headers.get('content-type') || 'audio/mpeg' });
        } else {
          blob = await res.blob();                 // 没有 content-length 就没法报百分比
        }
        objUrl = URL.createObjectURL(blob);
        a.src = objUrl;
        markReady();
      } catch (e) {
        // 跨域被挡住时退回直接播;真的断网才算失败
        if (navigator.onLine === false) { onError(); return; }
        streamFallback('Could not preload it, streaming instead — it may pause to buffer.');
      }
    }

    function onError() {
      failed = true;
      ready = false;
      playBtn.textContent = '↻';
      stateEl.innerHTML = '';
      stateEl.appendChild(el('<span>Could not download the audio. </span>'));
      const retry = el('<button class="btn ghost sm">Try again</button>');
      retry.onclick = () => download();
      stateEl.appendChild(retry);
    }

    a.addEventListener('loadedmetadata', () => { durEl.textContent = fmt(a.duration); });
    a.addEventListener('waiting', () => { if (ready) stateEl.textContent = 'Buffering…'; });
    a.addEventListener('playing', () => { stateEl.textContent = ''; });
    a.addEventListener('error', () => { if (ready && !objUrl) onError(); });

    // 下载太久还没好:给一个"先播再说"的出口,但说清楚可能会卡
    slowTimer = setTimeout(() => {
      if (ready || failed) return;
      const b = el('<button class="btn ghost sm" style="margin-left:8px">Play now anyway</button>');
      b.onclick = () => { streamFallback('Playing while it downloads — it may pause to buffer.'); start(); };
      stateEl.appendChild(b);
    }, SLOW_HINT_MS);

    // ---- 循环 ----
    const loopSel = card.querySelector('[data-p="loop"]');
    const loopBadge = card.querySelector('[data-p="loopN"]');
    let done = 0, gapTimer = null;
    loopSel.value = String(Store.get('loopTimes', 1));
    function target() { return parseInt(loopSel.value, 10); }
    function paintLoop() {
      const t = target();
      if (t === 1) { loopBadge.style.display = 'none'; return; }
      loopBadge.style.display = '';
      loopBadge.textContent = t === 0 ? `loop ${done + 1} / ∞` : `loop ${Math.min(done + 1, t)} / ${t}`;
    }
    function clearGap() { if (gapTimer) { clearTimeout(gapTimer); gapTimer = null; } }
    loopSel.onchange = () => { Store.set('loopTimes', target()); done = 0; clearGap(); paintLoop(); };
    paintLoop();
    App.onLeave(clearGap);

    a.onended = () => {
      done++;
      const t = target();
      if (t === 0 || done < t) {
        paintLoop();
        playBtn.textContent = '⏸';
        clearGap();
        gapTimer = setTimeout(() => { gapTimer = null; a.currentTime = 0; a.play().catch(() => { playBtn.textContent = '▶'; }); }, GAP_MS);
        return;
      }
      playBtn.textContent = '▶';
      done = 0;
      paintLoop();
    };

    // ---- 播放 ----
    function start() {
      if (window.AudioFX) AudioFX.stop();
      if (a.ended || a.currentTime === 0) { done = 0; paintLoop(); }
      a.play().then(() => { playBtn.textContent = '⏸'; }).catch(() => { playBtn.textContent = '▶'; });
    }
    playBtn.onclick = () => {
      if (failed) { failed = false; ready = false; stateEl.textContent = 'Loading…'; a.load(); return; }
      if (gapTimer) { clearGap(); playBtn.textContent = '▶'; return; }   // 间隔期再点 = 停止循环
      if (!ready) {
        // 还没下完:先用这次手势"解锁"媒体元素,下完后自动播就不会被浏览器拦
        wantPlay = !wantPlay;
        if (wantPlay) {
          try { a.play().then(() => a.pause()).catch(() => {}); } catch (e) {}
          stateEl.textContent = 'Will start automatically once it has finished downloading.';
        } else {
          stateEl.textContent = 'Cancelled — tap ▶ again when you want it.';
        }
        return;
      }
      if (a.paused) start();
      else { a.pause(); playBtn.textContent = '▶'; }
    };

    a.ontimeupdate = () => {
      if (dragging || !a.duration) return;
      seek.value = Math.round(a.currentTime / a.duration * 1000);
      curEl.textContent = fmt(a.currentTime);
    };
    seek.oninput = () => { dragging = true; if (a.duration) curEl.textContent = fmt(seek.value / 1000 * a.duration); };
    seek.onchange = () => { if (a.duration) a.currentTime = seek.value / 1000 * a.duration; dragging = false; };
    card.querySelector('[data-p="b10"]').onclick = () => { a.currentTime = Math.max(0, a.currentTime - 10); };
    card.querySelector('[data-p="f10"]').onclick = () => { a.currentTime = Math.min(a.duration || 0, a.currentTime + 10); };
    card.querySelector('[data-p="rate"]').onchange = (e) => { a.playbackRate = parseFloat(e.target.value); };

    // 章节跳转
    const mk = card.querySelector('[data-p="markers"]');
    (opts.markers || []).forEach(m => {
      const b = el(`<button class="btn ghost sm">${esc(m.label)}</button>`);
      b.onclick = () => { a.currentTime = m.t; if (a.paused && ready) start(); };
      mk.appendChild(b);
    });

    download();
    return card;
  }

  window.Player = { file };
})();
