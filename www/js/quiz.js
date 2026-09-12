/* quiz.js — 通用答题组件,供阅读/听力复用。
   题型:判断 tfng/ynng · 选择 mc · 填空 gap · 多选 multi(选 TWO) · 配对 match(A-G 题库)
   计分:每题默认 1 分;multi 可设 marks(如 Q14&15 计 2 分,按选对的个数给分)。 */
(function () {
  const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN'];
  const YNNG = ['YES', 'NO', 'NOT GIVEN'];

  function marksOf(q) { return Math.max(1, Number(q.marks) || 1); }

  // questions: [{type, q, options?, bank?, answer, marks?, explanation?}]
  // opts: { onComplete(score,total,again), submitText }
  function render(container, questions, opts = {}) {
    const state = questions.map(() => ({ value: null }));
    let submitted = false;
    const totalMarks = questions.reduce((a, q) => a + marksOf(q), 0);

    const box = el('<div></div>');
    questions.forEach((q, i) => {
      box.appendChild(renderQ(q, i, state, () => submitted));
    });

    const submit = el(`<button class="btn block mt12">${opts.submitText || 'Submit'}</button>`);
    submit.onclick = () => {
      if (submitted) { opts.onComplete && opts.onComplete(score(), totalMarks, true); return; }
      const unanswered = state.filter(s => s.value === null || s.value === '' ||
        (Array.isArray(s.value) && !s.value.length)).length;
      if (unanswered > 0 && !confirm(`${unanswered} unanswered — submit anyway?`)) return;
      submitted = true;
      grade(box, questions, state);
      const sc = score();
      const res = el(`<div class="card mt12 center"><div class="card-title center" style="justify-content:center">Score ${sc} / ${totalMarks}</div><div class="bar mt8"><i style="width:${Math.round(sc / totalMarks * 100)}%"></i></div></div>`);
      box.insertBefore(res, submit);
      submit.textContent = 'Done — back';
      submit.classList.add('good');
      opts.onComplete && opts.onComplete(sc, totalMarks, false);
      res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    box.appendChild(submit);

    function score() {
      return questions.reduce((a, q, i) => a + scoreOf(q, state[i].value), 0);
    }

    container.appendChild(box);
  }

  function renderQ(q, i, state, isSubmitted) {
    const wrap = el(`<div class="q"><div class="q-stem">${label(q, i)} ${stem(q)}</div></div>`);
    const type = q.type || 'mc';

    if (type === 'tfng' || type === 'ynng') {
      const opts = type === 'tfng' ? TFNG : YNNG;
      opts.forEach(o => {
        const op = el(`<label class="opt">${o}</label>`);
        op.dataset.val = o;
        op.onclick = () => { if (isSubmitted()) return; state[i].value = o; mark(wrap, op); };
        wrap.appendChild(op);
      });
    } else if (type === 'mc') {
      (q.options || []).forEach((o, oi) => {
        const op = el(`<label class="opt">${String.fromCharCode(65 + oi)}. ${esc(o)}</label>`);
        op.dataset.val = oi;
        op.onclick = () => { if (isSubmitted()) return; state[i].value = oi; mark(wrap, op); };
        wrap.appendChild(op);
      });
    } else if (type === 'multi') {
      const need = Number(q.pick) || (Array.isArray(q.answer) ? q.answer.length : 2);
      wrap.querySelector('.q-stem').insertAdjacentHTML('beforeend',
        ` <span class="pill accent" style="vertical-align:middle">choose ${need}</span>`);
      state[i].value = [];
      (q.options || []).forEach((o, oi) => {
        const op = el(`<label class="opt">${String.fromCharCode(65 + oi)}. ${esc(o)}</label>`);
        op.dataset.val = oi;
        op.onclick = () => {
          if (isSubmitted()) return;
          const sel = state[i].value || [];
          const at = sel.indexOf(oi);
          if (at >= 0) { sel.splice(at, 1); op.classList.remove('sel'); }
          else {
            if (sel.length >= need) { Toast(`Pick ${need} only — tap one again to unselect`); return; }
            sel.push(oi); op.classList.add('sel');
          }
          state[i].value = sel;
        };
        wrap.appendChild(op);
      });
    } else if (type === 'match') {
      const bank = q.bank || [];
      const sel = el(`<select class="opt match-sel"><option value="">— choose —</option>${bank
        .map(b => `<option value="${esc(b.k)}">${esc(b.k)}. ${esc(b.t)}</option>`).join('')}</select>`);
      sel.onchange = () => { state[i].value = sel.value || null; };
      wrap.appendChild(sel);
      wrap._select = sel;
    } else if (type === 'gap') {
      const inp = el(`<input class="opt" style="width:100%;background:var(--bg-soft);color:var(--tx)" placeholder="${esc(q.placeholder || 'Type your answer')}" />`);
      inp.oninput = () => { state[i].value = inp.value.trim(); };
      wrap.appendChild(inp);
      wrap._input = inp;
    }
    return wrap;
  }

  // 题号:数据里给了 no(真题题号)就用真题题号,否则用序号
  function label(q, i) {
    if (q.no) return String(q.no) + '.';
    return (i + 1) + '.';
  }

  function stem(q) {
    let s = esc(q.q || '');
    return s.replace(/_{2,}/g, '<u>&nbsp;&nbsp;&nbsp;&nbsp;</u>');
  }

  function mark(wrap, selected) {
    wrap.querySelectorAll('.opt').forEach(o => o.classList.remove('sel'));
    selected.classList.add('sel');
  }

  function norm(s) {
    return String(s).toLowerCase().trim()
      .replace(/[，,]/g, '')          // 1,000 kg → 1000 kg
      .replace(/[.。;；!！?？'"“”‘’]/g, '')
      .replace(/\s+/g, ' ');
  }

  // 得分(分数制:multi 按选对个数给分,其余对即满分)
  function scoreOf(q, val) {
    const type = q.type || 'mc';
    const m = marksOf(q);
    if (val === null || val === undefined || val === '') return 0;
    if (type === 'multi') {
      const ans = (q.answer || []).map(Number);
      const got = (val || []).map(Number).filter(v => ans.indexOf(v) >= 0).length;
      return Math.min(m, Math.round(got * m / Math.max(1, ans.length)));
    }
    return isCorrect(q, val) ? m : 0;
  }

  function isCorrect(q, val) {
    if (val === null || val === undefined || val === '') return false;
    const type = q.type || 'mc';
    if (type === 'gap') {
      const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
      return ans.some(a => norm(a) === norm(val) || norm(a).replace(/ /g, '') === norm(val).replace(/ /g, ''));
    }
    if (type === 'mc') return Number(val) === Number(q.answer);
    if (type === 'multi') {
      const ans = (q.answer || []).map(Number).sort();
      const got = (val || []).map(Number).sort();
      return ans.length === got.length && ans.every((v, i) => v === got[i]);
    }
    if (type === 'match') return String(val).toUpperCase() === String(q.answer).toUpperCase();
    return String(val).toUpperCase() === String(q.answer).toUpperCase();
  }

  function answerText(q) {
    const type = q.type || 'mc';
    if (type === 'gap') return Array.isArray(q.answer) ? q.answer.join(' / ') : String(q.answer);
    if (type === 'mc') return String.fromCharCode(65 + Number(q.answer)) + '. ' + (q.options || [])[q.answer];
    if (type === 'multi') return (q.answer || []).map(a => String.fromCharCode(65 + Number(a))).join(' + ');
    if (type === 'match') {
      const b = (q.bank || []).find(x => String(x.k).toUpperCase() === String(q.answer).toUpperCase());
      return q.answer + (b ? '. ' + b.t : '');
    }
    return String(q.answer);
  }

  function grade(box, questions, state) {
    const qEls = box.querySelectorAll('.q');
    questions.forEach((q, i) => {
      const wrap = qEls[i];
      const type = q.type || 'mc';
      const correct = isCorrect(q, state[i].value);
      const earned = scoreOf(q, state[i].value);
      if (type === 'gap') {
        const inp = wrap._input;
        inp.classList.add(correct ? 'correct' : 'wrong');
        inp.disabled = true;
      } else if (type === 'match') {
        const sel = wrap._select;
        sel.classList.add(correct ? 'correct' : 'wrong');
        sel.disabled = true;
      } else {
        wrap.querySelectorAll('.opt').forEach(op => {
          const v = op.dataset.val;
          const isAns = (type === 'mc') ? Number(v) === Number(q.answer)
            : (type === 'multi') ? (q.answer || []).map(Number).indexOf(Number(v)) >= 0
            : String(v).toUpperCase() === String(q.answer).toUpperCase();
          if (isAns) op.classList.add('correct');
          const picked = Array.isArray(state[i].value)
            ? state[i].value.map(String).indexOf(String(v)) >= 0
            : String(v) === String(state[i].value);
          if (picked && !isAns) op.classList.add('wrong');
        });
      }
      const head = correct ? '✅ Correct'
        : (earned > 0 ? `➖ ${earned}/${marksOf(q)} · Answer: ` + esc(answerText(q))
                      : '❌ Answer: ' + esc(answerText(q)));
      wrap.appendChild(el(`<div class="explain"><b>${head}</b>${q.explanation ? '<br>' + esc(q.explanation) : ''}${q.tip ? '<br>💡 ' + esc(q.tip) : ''}</div>`));
    });
    if (window.RunReport) {
      const corr = questions.reduce((a, q, i) => a + (isCorrect(q, state[i].value) ? 1 : 0), 0);
      RunReport(Math.min(20, 3 + corr * 2));
    }
  }

  window.Quiz = { render, isCorrect, scoreOf };
})();
