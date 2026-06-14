/* audioplayer.js — 播放内置 MP3(云端预生成),缺失时退回系统 TTS。
   手机无语音引擎也能出声(HTML5 Audio 全平台支持)。 */
(function () {
  let cur = null;       // 当前 Audio 元素
  let seqActive = false;

  function idx() { return (window.IELTS_DATA && window.IELTS_DATA.audioIndex) || { vocab: {}, listening: {} }; }
  function hasVocab(id) { return !!(idx().vocab && idx().vocab[id]); }
  function listeningCount(id) { return (idx().listening && idx().listening[id]) || 0; }

  function stop() {
    seqActive = false;
    if (cur) { try { cur.pause(); cur.src = ''; } catch (e) {} cur = null; }
    if (window.TTS) TTS.stopSeq();
  }

  function playFile(url, rate) {
    return new Promise((resolve) => {
      try {
        const a = new Audio(url); cur = a; a.playbackRate = rate || 1.0;
        a.onended = () => resolve(true);
        a.onerror = () => resolve(false);
        a.play().catch(() => resolve(false));
      } catch (e) { resolve(false); }
    });
  }

  // 单词发音:优先 MP3,退回 TTS
  async function speakWord(id, word, rate) {
    if (hasVocab(id)) { const ok = await playFile('audio/vocab/' + id + '.mp3', 1.0); if (ok) return; }
    if (window.TTS && TTS.supported) TTS.speak(word, { rate: rate || 0.95 });
  }

  // 听力:优先逐句 MP3(不同说话人不同嗓音),退回 TTS 序列
  async function playListening(l, opts) {
    opts = opts || {};
    stop(); seqActive = true;
    const id = l.id, n = listeningCount(id);
    if (n > 0) {
      for (let i = 0; i < n; i++) {
        if (!seqActive) break;
        opts.onIndex && opts.onIndex(i + 1, n);
        const a = new Audio('audio/listening/' + id + '/' + i + '.mp3'); cur = a; a.playbackRate = opts.rate || 1.0;
        if (opts.onProgress) a.ontimeupdate = () => { const frac = a.duration ? (i + a.currentTime / a.duration) / n : i / n; opts.onProgress(Math.min(1, frac)); };
        const ok = await new Promise(r => { a.onended = () => r(true); a.onerror = () => r(false); a.play().catch(() => r(false)); });
        if (!ok && window.TTS) await TTS.speak(((l.lines || [])[i] || {}).text || '', { rate: opts.rate });
        opts.onProgress && opts.onProgress((i + 1) / n);
        if (!seqActive) break;
        await new Promise(r => setTimeout(r, 260));
      }
      seqActive = false; opts.onProgress && opts.onProgress(1); opts.onEnd && opts.onEnd(); return;
    }
    // 无内置音频 → 全退回 TTS
    if (window.TTS) {
      TTS.startSeq();
      let k = 0; const total = (l.lines || []).length;
      for (const ln of (l.lines || [])) { if (!seqActive) break; opts.onIndex && opts.onIndex(++k, total); await TTS.speak(ln.text, { rate: opts.rate }); opts.onProgress && opts.onProgress(k / total); await new Promise(r => setTimeout(r, 220)); }
    }
    seqActive = false; opts.onProgress && opts.onProgress(1); opts.onEnd && opts.onEnd();
  }

  function isPlaying() { return seqActive || (cur && !cur.paused); }
  function usingFiles(l) { return listeningCount(l.id) > 0; }

  window.AudioFX = { stop, playFile, speakWord, playListening, hasVocab, listeningCount, isPlaying, usingFiles };
})();
