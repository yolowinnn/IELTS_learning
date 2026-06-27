/* tts.js — 文本转语音封装。网页用 Web Speech API;装进 App(Capacitor)时改用原生 TTS 插件(WebView 的 speechSynthesis 在部分安卓机不发声)。 */
(function () {
  const synth = window.speechSynthesis;
  let voices = [];
  let ready = false;

  // 原生 TTS(Capacitor @capacitor-community/text-to-speech);不存在则为 null,自动回退到 Web。
  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  function nativeTTS() { try { return (isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) || null; } catch (e) { return null; } }

  function loadVoices() {
    voices = synth ? synth.getVoices() : [];
    if (voices.length) ready = true;
  }
  if (synth) {
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  // 选英音优先,其次美音,其次任意英语
  function pickVoice(prefer) {
    if (!voices.length) loadVoices();
    const en = voices.filter(v => /en[-_]/i.test(v.lang));
    const want = Store.get('ttsVoice', prefer || 'en-GB');
    return (
      en.find(v => v.lang.replace('_', '-').toLowerCase() === want.toLowerCase()) ||
      en.find(v => /en[-_]GB/i.test(v.lang)) ||
      en.find(v => /en[-_]US/i.test(v.lang)) ||
      en[0] || voices[0] || null
    );
  }

  function listEnglishVoices() {
    if (!voices.length) loadVoices();
    return voices.filter(v => /en[-_]/i.test(v.lang));
  }

  let speaking = false;

  function speak(text, opts = {}) {
    // App 内:优先原生 TTS
    const N = nativeTTS();
    if (N) {
      const lang = (opts.voice && opts.voice.lang) || Store.get('ttsVoice', 'en-GB');
      speaking = true;
      return N.speak({ text: String(text || ''), lang: lang.replace('_', '-'), rate: opts.rate != null ? opts.rate : Store.get('ttsRate', 1.0) })
        .then(() => { speaking = false; }).catch(() => { speaking = false; });
    }
    if (!synth) { Toast && Toast('Speech synthesis is not supported here'); return Promise.resolve(); }
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      const v = opts.voice || pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = opts.rate != null ? opts.rate : Store.get('ttsRate', 1.0);
      u.pitch = opts.pitch != null ? opts.pitch : 1.0;
      u.onend = () => { speaking = false; resolve(); };
      u.onerror = () => { speaking = false; resolve(); };
      speaking = true;
      synth.speak(u);
    });
  }

  // 依次朗读多行(听力脚本),可在不同说话人用不同语音
  async function speakSequence(lines, opts = {}) {
    cancel();
    const vA = pickVoice('en-GB');
    const vB = listEnglishVoices().find(v => v !== vA) || vA;
    for (const ln of lines) {
      if (!_seqActive) break;
      const v = (ln.speaker && /B|2|woman|female|interviewer/i.test(ln.speaker)) ? vB : vA;
      await speak(ln.text, { voice: v, rate: opts.rate });
      await wait(250);
    }
    if (opts.onend) opts.onend();
  }

  let _seqActive = false;
  function startSeq() { _seqActive = true; }
  function stopSeq() { _seqActive = false; cancel(); }

  function cancel() { try { const N = nativeTTS(); if (N) N.stop(); } catch (e) {} if (synth) synth.cancel(); speaking = false; }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  function isSpeaking() { return speaking || (synth ? synth.speaking : false); }

  window.TTS = {
    speak, speakSequence, cancel, isSpeaking, listEnglishVoices, pickVoice,
    startSeq, stopSeq,
    get supported() { return !!nativeTTS() || !!synth; }
  };
})();
