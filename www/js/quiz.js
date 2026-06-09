/* quiz.js — 通用答题组件,供阅读/听力复用。支持 判断/选择/填空 */
(function () {
  const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN'];
  const YNNG = ['YES', 'NO', 'NOT GIVEN'];

  // questions: [{type, q, options?, answer, explanation}]
  // opts: { onComplete(correct,total), submitText }
  function render(container, questions, opts = {}) {
    const state = questions.map(() => ({ value: null }));
    let submitted = false;

    const box = el('<div></div>');
    questions.forEach((q, i) => {
      box.appendChild(renderQ(q, i, state, () => submitted));
    });

    const submit = el(`<button class="btn block mt12">${opts.submitText || '提交答案'}</button>`);
    submit.onclick = () => {
      if (submitted) { opts.onComplete && opts.onComplete(score(), questions.length, true); return; }
      // 校验是否都作答
      const unanswered = state.filter(s => s.value === null || s.value === '').length;
      if (unanswered > 0 && !confirm(`还有 ${unanswered} 题未作答,确认提交?`)) return;
      submitted = true;
      grade(box, questions, state);
      const sc = score();
      const res = el(`<div class="card mt12 center"><div class="card-title center" style="justify-content:center">得分 ${sc} / ${questions.length}</div><div class="bar mt8"><i style="width:${Math.round(sc / questions.length * 100)}%"></i></div></div>`);
      box.insertBefore(res, submit);
      submit.textContent = '完成,返回';
      submit.classList.add('good');
      opts.onComplete && opts.onComplete(sc, questions.length, false);
      res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    box.appendChild(submit);

    function score() {
      let c = 0;
      questions.forEach((q, i) => { if (isCorrect(q, state[i].value)) c++; });
      return c;
    }

    container.appendChild(box);
  }

  function renderQ(q, i, state, isSubmitted) {
    const wrap = el(`<div class="q"><div class="q-stem">${i + 1}. ${stem(q)}</div></div>`);
    const type = q.type || 'mc';

    if (type === 'tfng' || type === 'ynng') {
      const opts = type === 'tfng' ? TFNG : YNNG;
      opts.forEach(o => {
        const op = el(`<label class="opt">${o}</label>`);
        op.onclick = () => { if (isSubmitted()) return; state[i].value = o; mark(wrap, op); };
        op.dataset.val = o;
        wrap.appendChild(op);
      });
    } else if (type === 'mc') {
      q.options.forEach((o, oi) => {
        const op = el(`<label class="opt">${String.fromCharCode(65 + oi)}. ${esc(o)}</label>`);
        op.dataset.val = oi;
        op.onclick = () => { if (isSubmitted()) return; state[i].value = oi; mark(wrap, op); };
        wrap.appendChild(op);
      });
    } else if (type === 'gap') {
      const inp = el(`<input class="opt" style="width:100%;background:var(--bg-soft);color:var(--tx)" placeholder="填写答案(单词)" />`);
      inp.oninput = () => { state[i].value = inp.value.trim(); };
      wrap.appendChild(inp);
      wrap._input = inp;
    }
    return wrap;
  }

  function stem(q) {
    let s = esc(q.q || '');
    return s.replace(/_{2,}/g, '<u>&nbsp;&nbsp;&nbsp;&nbsp;</u>');
  }

  function mark(wrap, selected) {
    wrap.querySelectorAll('.opt').forEach(o => o.classList.remove('sel'));
    selected.classList.add('sel');
  }

  function isCorrect(q, val) {
    if (val === null || val === undefined || val === '') return false;
    const type = q.type || 'mc';
    if (type === 'gap') {
      const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
      return ans.some(a => norm(a) === norm(val));
    }
    if (type === 'mc') return Number(val) === Number(q.answer);
    return String(val).toUpperCase() === String(q.answer).toUpperCase();
  }

  function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }

  function grade(box, questions, state) {
    const qEls = box.querySelectorAll('.q');
    questions.forEach((q, i) => {
      const wrap = qEls[i];
      const correct = isCorrect(q, state[i].value);
      const type = q.type || 'mc';
      if (type === 'gap') {
        const inp = wrap._input;
        inp.classList.add(correct ? 'correct' : 'wrong');
        inp.disabled = true;
      } else {
        wrap.querySelectorAll('.opt').forEach(op => {
          const v = op.dataset.val;
          const isAns = (type === 'mc') ? Number(v) === Number(q.answer) : String(v).toUpperCase() === String(q.answer).toUpperCase();
          if (isAns) op.classList.add('correct');
          if (String(op.dataset.val) === String(state[i].value) && !correct) op.classList.add('wrong');
        });
      }
      const ansText = type === 'gap' ? (Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer)
        : type === 'mc' ? String.fromCharCode(65 + Number(q.answer)) + '. ' + esc(q.options[q.answer])
        : q.answer;
      wrap.appendChild(el(`<div class="explain"><b>${correct ? '✅ 正确' : '❌ 答案:' + esc(ansText)}</b>${q.explanation ? '<br>' + esc(q.explanation) : ''}</div>`));
    });
  }

  window.Quiz = { render };
})();
