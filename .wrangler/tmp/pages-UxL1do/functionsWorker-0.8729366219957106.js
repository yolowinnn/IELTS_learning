var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/gemini.js
function examinerSystem(topic) {
  return `You are a warm, professional IELTS speaking examiner conducting a spoken mock test on the topic "${topic || "general"}".
- Ask ONE question at a time, then wait. Keep YOUR turns short and natural (1-2 sentences) \u2014 this is spoken aloud.
- Flow: a few Part 1 warm-ups \u2192 one Part 2 cue card (give prompt, tell them to talk ~2 min) \u2192 Part 3 deeper discussion.
- React briefly and naturally to the candidate's answer before the next question.
- Do NOT introduce yourself with any name or say "my name is". Never use brackets/placeholders or stage directions. Begin directly with a brief greeting and your first question.
- Speak English. If the candidate replies in Chinese, gently encourage English.`;
}
__name(examinerSystem, "examinerSystem");
function scoringSystem(topic) {
  return `You are a senior IELTS speaking examiner. You are given the candidate's ACTUAL spoken answers as AUDIO plus the conversation transcript, on the topic "${topic || "general"}".
Assess the real audio \u2014 pronunciation, intonation, fluency, hesitation, not only the words.
Return a clear report:
**Estimated Band Scores (0\u20139, .5 allowed)**
- Fluency & Coherence: X
- Lexical Resource: X
- Grammatical Range & Accuracy: X
- Pronunciation: X
- Overall: X
**What went well** (2\u20133 bullets, cite specifics they said)
**To improve** (4\u20135 concrete, specific tips with better example phrasings)
Be honest but encouraging. Plain text, no JSON.`;
}
__name(scoringSystem, "scoringSystem");
function partsFor(m) {
  if (m.audio && m.audio.data) return [{ inlineData: { mimeType: m.audio.mimeType || "audio/webm", data: m.audio.data } }, { text: "(candidate audio answer)" }];
  return [{ text: String(m.text || "") }];
}
__name(partsFor, "partsFor");
function pcmToWavB64(pcmB64, sampleRate) {
  const bin = atob(pcmB64);
  const pcm = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
  const channels = 1, bits = 16, byteRate = sampleRate * channels * bits / 8, blockAlign = channels * bits / 8;
  const buf = new ArrayBuffer(44 + pcm.length), dv = new DataView(buf);
  const ws = /* @__PURE__ */ __name((o, s) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i));
  }, "ws");
  ws(0, "RIFF");
  dv.setUint32(4, 36 + pcm.length, true);
  ws(8, "WAVE");
  ws(12, "fmt ");
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, channels, true);
  dv.setUint32(24, sampleRate, true);
  dv.setUint32(28, byteRate, true);
  dv.setUint16(32, blockAlign, true);
  dv.setUint16(34, bits, true);
  ws(36, "data");
  dv.setUint32(40, pcm.length, true);
  new Uint8Array(buf, 44).set(pcm);
  let out = "";
  const u8 = new Uint8Array(buf);
  for (let i = 0; i < u8.length; i++) out += String.fromCharCode(u8[i]);
  return btoa(out);
}
__name(pcmToWavB64, "pcmToWavB64");
var CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
var jsonResp = /* @__PURE__ */ __name((o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { "Content-Type": "application/json", ...CORS } }), "jsonResp");
async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
__name(onRequestOptions, "onRequestOptions");
async function onRequestPost(context) {
  try {
    const KEY = context.env.GEMINI_API_KEY;
    if (!KEY) return jsonResp({ error: "GEMINI_API_KEY not configured" }, 500);
    const MODEL = context.env.GEMINI_MODEL || "gemini-flash-latest";
    const body = await context.request.json().catch(() => ({}));
    const mode = body.mode || "chat";
    const topic = body.topic || "";
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    const sleep = /* @__PURE__ */ __name((ms) => new Promise((res) => setTimeout(res, ms)), "sleep");
    const call = /* @__PURE__ */ __name(async (payload, retries) => {
      retries = retries == null ? 1 : retries;
      const r = await fetch(url, { method: "POST", headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (r.status === 429 && retries > 0) {
        let wait = 3e3;
        try {
          const d = j.error && j.error.details || [];
          const ri = d.find((x) => String(x["@type"] || "").includes("RetryInfo"));
          if (ri && ri.retryDelay) {
            const s = parseFloat(ri.retryDelay);
            if (!isNaN(s)) wait = Math.min(6e3, Math.ceil(s * 1e3) + 200);
          }
        } catch (e) {
        }
        await sleep(wait);
        return call(payload, retries - 1);
      }
      const text = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts || []).map((p) => p.text || "").join("").trim();
      return { ok: r.ok, status: r.status, text, j };
    }, "call");
    const errResp = /* @__PURE__ */ __name((out2) => {
      if (out2.status === 429) {
        let ra = 20;
        try {
          const d = out2.j.error && out2.j.error.details || [];
          const ri = d.find((x) => String(x["@type"] || "").includes("RetryInfo"));
          if (ri && ri.retryDelay) {
            const s = parseFloat(ri.retryDelay);
            if (!isNaN(s)) ra = Math.ceil(s);
          }
        } catch (e) {
        }
        return jsonResp({ error: "rate_limited", rate: true, retryAfter: ra, detail: "\u514D\u8D39\u989D\u5EA6\u9650\u901F(\u7EA6 20 \u6B21/\u5206),\u8BF7\u7A0D\u7B49 " + ra + " \u79D2\u518D\u8BD5" }, 429);
      }
      const detail = out2.j && out2.j.error && out2.j.error.message || "Gemini API " + out2.status;
      return jsonResp({ error: "gemini_failed", status: out2.status, detail }, 502);
    }, "errResp");
    if (mode === "tts") {
      const text = String(body.text || "").slice(0, 1400);
      if (!text) return jsonResp({ error: "no text" }, 400);
      const voice = body.voice || "Kore";
      const style = body.style || "in a warm, clear, professional British IELTS examiner voice";
      const ttsModel = context.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
      const tr = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent`, { method: "POST", headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: `Say ${style}: ${text}` }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } } }) });
      const tj = await tr.json();
      const part = tj.candidates && tj.candidates[0] && tj.candidates[0].content && tj.candidates[0].content.parts && tj.candidates[0].content.parts[0];
      const inline = part && part.inlineData;
      if (!tr.ok || !inline || !inline.data) return jsonResp({ error: "tts", detail: JSON.stringify(tj).slice(0, 400) }, tr.status || 500);
      const rateM = /rate=(\d+)/.exec(inline.mimeType || "");
      const rate = rateM ? parseInt(rateM[1], 10) : 24e3;
      return jsonResp({ audio: pcmToWavB64(inline.data, rate), mimeType: "audio/wav" });
    }
    if (mode === "score") {
      const audios = Array.isArray(body.audios) ? body.audios : [];
      const transcript = messages.map((m) => (m.role === "model" || m.role === "assistant" ? "Examiner: " : "Candidate: ") + (m.text || "(audio)")).join("\n");
      const parts = [{ text: "Conversation transcript:\n" + transcript + "\n\nThe candidate audio answers follow. Score now." }];
      audios.slice(0, 4).forEach((a) => a && a.data && parts.push({ inlineData: { mimeType: a.mimeType || "audio/webm", data: a.data } }));
      const out2 = await call({ systemInstruction: { parts: [{ text: scoringSystem(topic) }] }, contents: [{ role: "user", parts }], generationConfig: { temperature: 0.4, maxOutputTokens: 900 } });
      if (!out2.ok) return errResp(out2);
      return jsonResp({ text: out2.text || "(no score)" });
    }
    const lastHasAudio = messages.length && messages[messages.length - 1].audio;
    if (lastHasAudio) {
      const au = messages[messages.length - 1].audio;
      const trOut = await call({
        systemInstruction: { parts: [{ text: "You are a precise speech-to-text transcriber. Transcribe the audio EXACTLY word-for-word as actually spoken. Do NOT paraphrase, translate, correct, complete, or invent ANY content \u2014 transcribe only what you truly hear. If the audio is silent/empty or you cannot make out any speech, output exactly: [inaudible]. Output ONLY the raw transcription, nothing else." }] },
        contents: [{ role: "user", parts: [{ inlineData: { mimeType: au.mimeType || "audio/wav", data: au.data } }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 500 }
      });
      if (!trOut.ok) return errResp(trOut);
      const transcript = (trOut.text || "").trim();
      if (!transcript || /^\[?\s*inaudible\s*\]?\.?$/i.test(transcript)) {
        return jsonResp({ transcript: "", reply: "Sorry, I didn't quite catch that \u2014 could you say your answer again, a little louder and closer to the mic?" });
      }
      const hist = messages.slice(-16, -1).map((m) => ({ role: m.role === "assistant" || m.role === "model" ? "model" : "user", parts: [{ text: String(m.text || "") }] }));
      hist.push({ role: "user", parts: [{ text: transcript }] });
      const rOut = await call({ systemInstruction: { parts: [{ text: examinerSystem(topic) }] }, contents: hist, generationConfig: { temperature: 0.85, maxOutputTokens: 400 } });
      if (!rOut.ok) return errResp(rOut);
      return jsonResp({ transcript, reply: rOut.text || "" });
    }
    const contents = messages.slice(-16).map((m) => ({ role: m.role === "assistant" || m.role === "model" ? "model" : "user", parts: partsFor(m) }));
    if (!contents.length) contents.push({ role: "user", parts: [{ text: "Please start the IELTS speaking mock with your first question." }] });
    const out = await call({ systemInstruction: { parts: [{ text: examinerSystem(topic) }] }, contents, generationConfig: { temperature: 0.85, maxOutputTokens: 600 } });
    if (!out.ok) return errResp(out);
    return jsonResp({ text: out.text || "(no reply)" });
  } catch (e) {
    return jsonResp({ error: String(e && e.message || e) }, 500);
  }
}
__name(onRequestPost, "onRequestPost");

// packs/[[path]].js
var STATIC_SUFFIX = /\.json$/i;
async function onRequestGet(context) {
  const { request, env, params } = context;
  const bucket = env.PACKS;
  if (!bucket) return context.next();
  const rel = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!rel || rel.includes("..")) return context.next();
  if (STATIC_SUFFIX.test(rel)) return context.next();
  const key = "packs/" + rel;
  const range = request.headers.get("range");
  const obj = await bucket.get(key, {
    range: range ? request.headers : void 0,
    onlyIf: request.headers
  });
  if (obj === null) return context.next();
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=604800");
  headers.set("access-control-allow-origin", "*");
  headers.set("accept-ranges", "bytes");
  if (!obj.body) return new Response(null, { status: 304, headers });
  if (obj.range && range) {
    const r = obj.range;
    const start = "offset" in r ? r.offset : obj.size - r.suffix;
    const len = "length" in r ? r.length : obj.size - start;
    headers.set("content-range", `bytes ${start}-${start + len - 1}/${obj.size}`);
    headers.set("content-length", String(len));
    return new Response(obj.body, { status: 206, headers });
  }
  headers.set("content-length", String(obj.size));
  return new Response(obj.body, { status: 200, headers });
}
__name(onRequestGet, "onRequestGet");
async function onRequestHead(context) {
  const res = await onRequestGet(context);
  return new Response(null, { status: res.status, headers: res.headers });
}
__name(onRequestHead, "onRequestHead");

// ../.wrangler/tmp/pages-UxL1do/functionsRoutes-0.9209905222930008.mjs
var routes = [
  {
    routePath: "/api/gemini",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/gemini",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/packs/:path*",
    mountPath: "/packs",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/packs/:path*",
    mountPath: "/packs",
    method: "HEAD",
    middlewares: [],
    modules: [onRequestHead]
  }
];

// ../../../../.npm/_npx/d77349f55c2be1c0/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
