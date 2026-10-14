/* Slideshow with a command line. Plain ES2020, no build step, GSAP core only.
   Parts: 0 pace  1 data  2 contact  3 state and swap  4 console  5 effects  6 transition timeline  7 input  8 animation switch  9 boot
   Rules this file keeps:
   - CSS never hides content. Start states are set with gsap.set at the moment a transition starts and are removed with
     clearProps when it ends, so a failed or skipped transition can only ever leave the finished page behind.
   - Real text is never rewritten. Typing is a stepped clip-path on the full text. Only the console and the log
     (aria-hidden, decorative) are built from strings.
   - Transform, autoAlpha and clip-path only.
   - Three kinds of run: the opening (landing on /hello), a first visit of a slide, a revisit. The pace of each is in the table below. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  /* The order of the slides: nav, keys 1 to 8, Left and Right, the counter and the stacked no-JS page all follow this list and the order of the <section>s. */
  const IDS = ['hello', 'path', 'skills', 'trinketbot', 'architecture', 'numbers', 'how-i-work', 'learning-curve'];
  const SLIDE = Object.fromEntries(IDS.map(id => [id, document.getElementById(id)]));
  window.__ok = true;                                    /* tells the inline failsafe that this script is alive */

  /* ================================================================ 0 pace: the one place to tune the speed */
  /* Seconds. SPEED scales every duration in the file (1.25 is a quarter faster, .8 a quarter slower).
     Targets at SPEED 1: opening about 7 s, first visit of a slide about 5 s, revisit about 2 s. A run sets data-state to running and back to idle, which is what to time.
     Both visits (first, quick) type the command, send it, print the boot log and write the slide in as the lines print:
       out    the old slide leaves        type, send  typing the command, the send flash
       span   boot log from first to last line; one line stays span / (lines - 1) s on screen, kept between gap[0] and gap[1]
       char   print time of one log character         hold, fade, prompt  the last log line stays, the log fades, the prompt line is typed back
       fx     factor on every reveal in the FX table (their base values are tuned for 1)
     The opening is different: the log prints first (gap per line), then the command is typed, then the parts are written in at the
     times in `at` (seconds after the command is sent: the name, the role line, the status panel, the buttons); collapse is when the console settles, counted from the send. */
  const SPEED = 1;
  const PACE = {
    first:   { out: .45, type: .85, send: .25, span: 2.5, gap: [.38, .8], char: .024, hold: .5, fade: .25, prompt: .5, fx: 2.4 },
    quick:   { out: .3,  type: .45, send: .12, span: .5,  gap: [.38, .8], char: .016, hold: .2, fade: .2,  prompt: .35, fx: 1.15 },
    opening: { gap: .45, char: .026, hold: .25, type: .5, send: .2, collapse: 3.8, fade: .25, prompt: .5, fx: 1.5,
               at: { name: 0, role: 1.05, panel: 1.7, links: 3.75 } },
  };
  const FAILSAFE = 11;   /* seconds. A run that has not finished by then is finished by force; at least 1.5 x the longest run, see play() */

  /* ================================================================ 1 data */
  /* One entry per log line: [text, step name, count]. {i} in the text is replaced by a running counter when count is set.
     Step names match data-step in the markup. Every line names a real part of the slide it loads. */
  const L = (log, step, count) => ({ log, step, count });
  const SCRIPT = {
    'hello':          [L('run /hello', 'name role'), L('print status', 'panel'), L('write links', 'links'), L('ready')],
    'path':           [L('run /path', 'title'), L('load path', 'rows'), L('load contact card', 'contact'), L('build address', 'address'), L('ready')],
    'skills':         [L('run /skills', 'title'), L('load front-end', 'front'), L('load back-end', 'back'), L('load project tags', 'tags'), L('ready')],
    'trinketbot':     [L('run /trinketbot', 'title'), L('draw alert illustration', 'alert'), L('write copy', 'copy'), L('draw dashboard panel', 'panel'), L('write links', 'links'), L('ready')],
    'architecture':   [L('run /architecture', 'title'), L('load layout', 'layout'), L('draw diagram {i}/6', 'diagram', 6), L('write notes', 'notes'), L('ready')],
    'numbers':        [L('run /numbers', 'title'), L('load layout', 'layout'), L('fill bars', 'bars'), L('write figures', 'figures'), L('ready')],
    'how-i-work':     [L('run /how-i-work', 'title'), L('load decisions', 'decisions'), L('load checks', 'checks'), L('write process', 'process'), L('ready')],
    'learning-curve': [L('run /learning-curve', 'title'), L('load row {i}/2', 'rows', 2), L('write entry {i}/9', 'entries', 9), L('load thumbnail {i}/9', 'thumbs', 9), L('ready')],   /* two rows (row labels), nine entries; the entries and thumbnails run through row one and then row two */
  };
  /* The opening prints these first. Real parts of this page only: no network, sizes, timings or versions. */
  const OPENING = ['start portfolio', 'load fonts', 'load layout', 'ready'];
  const TEXT = {                                         /* all UI strings that are not content */
    animOn: 'Animations on', animOff: 'Animations off', animSystem: 'Animations are off, following the system setting.',
    loaded: (id, n) => `Loaded /${id}, ${n} of ${IDS.length}.`,
    animNote: 'follows system setting',
    copied: 'Copied', selected: 'Selected',
    title: id => (id === 'hello' ? 'Mitja Savijärvi, software developer' : `/${id}, Mitja Savijärvi`),
  };

  /* ================================================================ 2 contact: the address is assembled here, never written in the markup */
  const addr = () => ['mitja', 'savijarvi'].join('.') + '@' + ['gmail', 'com'].join('.');
  (function contact() {
    const pairs = [[$('#mail-addr'), $('#mail-link'), $('#mail-copy'), $('#mail-note')], [$('#foot-mail'), null, $('#foot-copy'), $('#foot-note')]];
    pairs.forEach(([out, link, copy, note]) => {
      if (!out) return;
      out.textContent = addr();
      const say = t => { if (!note) return; note.textContent = t; setTimeout(() => { note.textContent = ''; }, 2200); };
      const mail = e => { e.preventDefault(); location.href = 'mailto:' + addr(); };
      if (link) { link.hidden = false; link.addEventListener('click', mail); }
      else out.addEventListener('click', mail);            /* footer address: the link itself opens the mail client */
      if (copy) {
        copy.hidden = false;
        copy.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(addr()); say(TEXT.copied); }
          catch { const r = document.createRange(); r.selectNodeContents(out); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say(TEXT.selected); }
        });
      }
    });
  })();
  /* One mode at a time. If a slide is missing, or the head script's 3.5 s failsafe fired before this file arrived (a slow connection), the visitor
     already has the complete stacked document and it stays that way: this file would otherwise drive slides that no longer have a slideshow around them. */
  if (IDS.some(id => !SLIDE[id]) || !root.classList.contains('slides')) { root.classList.remove('slides'); return; }

  /* ================================================================ 3 state and instant swap */
  const hasGsap = !!window.gsap;
  /* GSAP's clearProps, and by hand if GSAP itself is what is failing. 'all' is never used: inline custom properties such as --v must survive. */
  const CLEAR = 'opacity,visibility,transform,clipPath,strokeDasharray,strokeDashoffset,backgroundColor,borderColor';
  const CLEAR_CSS = ['opacity', 'visibility', 'transform', 'translate', 'rotate', 'scale', 'clip-path', 'stroke-dasharray', 'stroke-dashoffset', 'background-color', 'border-color'];
  const clear = els => { try { if (hasGsap && els.length) gsap.set(els, { clearProps: CLEAR }); } catch (e) { els.forEach(el => CLEAR_CSS.forEach(p => el.style && el.style.removeProperty(p))); } };
  const S = { cur: null, tl: null, running: false, run: 0, motion: false, visited: new Set(), failsafe: 0 };   /* motion: animations are on (section 8) */
  /* A throw inside a GSAP callback (a tl.call, onUpdate or onComplete) would be an uncaught exception on every frame. Every callback goes through G():
     the first throw ends the run in the settled rest state, once, with one console.warn; later throws of the same run are swallowed. */
  const G = fn => (...a) => { try { return fn(...a); } catch (e) { fail(e); } };
  /* At most one console.warn per run, whoever finds the failure first. */
  const warn = e => { if (S.failed === S.run) return false; S.failed = S.run; console.warn('Slide transition failed, showing the slide at once.', e); return true; };
  /* The steps that put the finished page together run one by one: a step that throws is warned about and the ones after it still run. */
  const each = (...steps) => steps.forEach(f => { try { f(); } catch (e) { warn(e); } });
  function fail(e) {
    if (!warn(e)) return;
    /* settle after the current tick: the timeline that threw is still rendering its other tweens, which would put start states back after the clean-up */
    const run = S.run; queueMicrotask(() => { if (S.running && S.run === run) { try { settle(S.cur, S.opts, S.opts && S.opts.initial); } catch (e2) { /* nothing left to do */ } } });
  }
  const navLinks = $$('#cmds a[data-go]');
  const live = $('#live'), countN = $('#count-n'), about = $('#about');
  const hashText = () => { try { return decodeURIComponent((location.hash || '').slice(1)); } catch (e) { return ''; } };   /* a mangled %-escape counts as no hash */
  const idFromHash = () => { const h = hashText(); return IDS.includes(h) ? h : 'hello'; };
  const headingOf = id => $('h1, h2', SLIDE[id]);

  function show(id, from) {                               /* make one slide the active one; others are hidden and inert */
    each(
      () => IDS.forEach(i => { const el = SLIDE[i], on = i === id || i === from; el.hidden = !on; el.inert = i !== id; }),
      () => root.setAttribute('data-slide', id),
      () => navLinks.forEach(a => { if (a.dataset.go === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }),
      () => { countN.textContent = IDS.indexOf(id) + 1; },
      () => { document.title = TEXT.title(id); },
      /* The page always has exactly one visible level-1 heading: the h1 on /hello, the slide title everywhere else.
         Headings below it are lowered by one level with aria-level, so the outline stays unbroken (1, 2, 3). */
      () => IDS.forEach(i => $$('h2, h3, h4', SLIDE[i]).forEach(h => { if (i === id && id !== 'hello') h.setAttribute('aria-level', String(+h.tagName[1] - 1)); else h.removeAttribute('aria-level'); })),
      () => scrollable(id));
  }
  /* A slide that scrolls inside itself must be reachable by keyboard: it becomes a tab stop only while it overflows. */
  let armed = false;   /* the browser applies #fragment focus until load has finished: do not make slides focusable before that */
  let used = false; ['keydown', 'pointerdown', 'touchstart'].forEach(e => addEventListener(e, () => { used = true; }, { capture: true, passive: true }));
  /* Chrome also focuses a scrollable #fragment target after parsing. A deep link must not show a focus ring on first paint, so drop that focus unless the visitor has already used the page. */
  addEventListener('load', () => setTimeout(() => { armed = true; if (!used && document.activeElement && document.activeElement.classList.contains('slide')) document.activeElement.blur(); scrollable(S.cur); }, 120));
  function scrollable(id) { if (!armed) return; const s = SLIDE[id]; if (s.scrollHeight > s.clientHeight + 1) s.setAttribute('tabindex', '0'); else s.removeAttribute('tabindex'); }
  function hideOthers(id) { IDS.forEach(i => { if (i !== id) { SLIDE[i].hidden = true; SLIDE[i].inert = true; } }); }

  /* ================================================================ 4 console */
  const C = { cin: $('.cin'), text: $('#cin-text'), chip: $('#cin-chip'), caret: $('#caret'), ph: $('#cin-ph'), prompt: $('#prompt'), log: $('#log'), logWin: $('.log-win'), logIn: $('#log-in'), fill: $('#pb-fill'), pct: $('#pct') };
  const setProg = p => { C.fill.style.transform = `scaleX(${p / 100})`; C.pct.textContent = Math.round(p) + '%'; };
  const promptText = id => `> /${id}  ready`;
  function consoleRest(id) {                              /* the calm state: empty input, one prompt line */
    each(
      () => clear([C.text, C.chip, C.caret, C.ph, C.prompt, C.log, C.logIn]),
      () => C.chip.classList.remove('on', 'sent'),
      () => C.caret.classList.remove('on'),
      () => { C.text.textContent = ''; },
      () => { C.logIn.textContent = ''; },
      () => { C.fill.style.transform = 'scaleX(0)'; },
      () => { C.pct.textContent = '0%'; },
      () => { C.prompt.textContent = promptText(id); });
  }
  const lineHTML = txt => {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const [verb, ...rest] = txt.split(' ');
    return `<span class="gt">&gt;</span> <span class="vb">${esc(verb)}</span> ` + esc(rest.join(' ')).replace(/(\d+(?:\/\d+)?)/g, '<span class="num">$1</span>');
  };

  /* ================================================================ 5 effects */
  /* Each effect has pre(el) (the hidden start state, applied before the slide is shown) and play(tl, el, at, k)
     (adds its tweens to the master timeline). k is 1 on a first visit and about .45 on a revisit. */
  const touched = new Set();
  const mark = els => { (els.length === undefined ? [els] : [...els]).forEach(e => touched.add(e)); return els; };
  const nLines = el => { const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize) || 16, lh = parseFloat(cs.lineHeight) || fs * 1.3;
    const h = el.getBoundingClientRect().height - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0); return Math.max(1, Math.round(h / lh)); };
  const CLIP0 = 'inset(0 100% 0 0)', CLIP1 = 'inset(0 0% 0 0)';
  const BOX0 = 'inset(-48px 100% -48px -48px)', BOX1 = 'inset(-48px -48px -48px -48px)';   /* a box wipe that keeps its glow */
  const chars = el => Math.max(1, el.textContent.trim().length);
  const NAME_PAD = '-.3em', NAME_ALL = `inset(${NAME_PAD} ${NAME_PAD} ${NAME_PAD} ${NAME_PAD})`;

  const FX = {
    cmd:  { pre: el => gsap.set(mark(el), { clipPath: CLIP0 }),
            play: (tl, el, at, k) => { const n = chars(el); tl.to(el, { clipPath: CLIP1, duration: Math.min(.5, n * .04) * k, ease: `steps(${n})` }, at); } },
    type: { pre: el => gsap.set(mark(el), { clipPath: CLIP0 }),
            play: (tl, el, at, k) => { const n = chars(el); tl.to(el, { clipPath: CLIP1, duration: Math.min(.45, n * .045) * k + .05, ease: `steps(${n})` }, at); } },
    /* The year on the /learning-curve rails: typed like `type`, but its clip keeps room around the box, because the year carries the diamond (and the glow of the last one) and the rail to the next diamond, which reach outside it. */
    rail: { pre: el => gsap.set(mark(el), { clipPath: 'inset(-48px 100% -48px 0px)' }),   /* nothing shows before the first step, not even the tip of the diamond */
            play: (tl, el, at, k) => { const n = chars(el); tl.to(el, { clipPath: BOX1, duration: Math.min(.45, n * .045) * k + .05, ease: `steps(${n})` }, at); } },
    lines:{ pre: el => { el.__n = nLines(el); gsap.set(mark(el), { clipPath: 'inset(0 0 100% 0)' }); },
            play: (tl, el, at, k) => tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: (el.__n * .08 + .06) * k, ease: `steps(${el.__n})` }, at) },
    wipe: { pre: el => gsap.set(mark(el), { clipPath: CLIP0 }),
            play: (tl, el, at, k) => tl.to(el, { clipPath: CLIP1, duration: .45 * k, ease: 'power2.out' }, at) },
    /* The name is written letter by letter. The real h1 text stays in the DOM untouched: every line is clipped to the right edge of
       its latest letter (measured with a Range) and a thin cursor, an aria-hidden span, follows the edge. */
    name: { pre: el => gsap.set(mark($$('.nm > span', el)), { clipPath: CLIP0 }),
            play: (tl, el, at, k) => {
              const lines = $$('.nm > span', el), caret = mark($('.name-caret', el)), lens = lines.map(s => s.textContent.length), total = lens.reduce((a, b) => a + b, 0), per = .06 * k;
              const state = { n: 0 };                         /* n = letters written so far, fractional */
              let m = null;                                   /* measured on the first frame of the writing, when the serif has certainly loaded */
              const measure = () => { const hb = el.getBoundingClientRect(); return lines.map(s => {
                const sb = s.getBoundingClientRect(), tn = s.firstChild, r = document.createRange(), e = [0];
                for (let j = 1; j <= tn.length; j++) { r.setStart(tn, 0); r.setEnd(tn, j); e.push(r.getBoundingClientRect().right - sb.left); }   /* e[j] = right edge after j letters */
                r.setStart(tn, 0); r.setEnd(tn, 1); const b = r.getBoundingClientRect(); return { e, w: sb.width, y: b.top - hb.top + b.height * .2 }; }); };
              const draw = n => {
                m = m || measure(); let left = n, cur = 0, cx = 0;
                lines.forEach((s, i) => {
                  const len = lens[i], v = Math.max(0, Math.min(len, left)), j = Math.floor(v), f = v - j; left -= len;
                  const x = v >= len ? m[i].e[len] : m[i].e[j] + (m[i].e[j + 1] - m[i].e[j]) * Math.min(1, f * 2);   /* each letter wipes in during the first half of its slot */
                  s.style.clipPath = v <= 0 ? CLIP0 : v >= len ? NAME_ALL : `inset(${NAME_PAD} ${m[i].w - x}px ${NAME_PAD} ${NAME_PAD})`;   /* the clip box keeps room above and below the line box: the serif's ascenders and the descender of the j are taller than a .9 line */
                  if (v > 0) { cur = i; cx = x; }
                });
                gsap.set(caret, { x: cx, y: m[cur].y });
              };
              tl.set(caret, { autoAlpha: 1 }, at)
                .to(state, { n: total, duration: total * per, ease: 'none', onUpdate: G(() => draw(state.n)) }, at)
                .to(caret, { autoAlpha: 0, duration: .2, ease: 'steps(2)' }, at + total * per + .15); } },   /* two hard blinks after the last letter */
    box:  { pre: el => gsap.set(mark(el), { clipPath: BOX0 }),
            play: (tl, el, at, k) => tl.to(el, { clipPath: BOX1, duration: .5 * k, ease: 'power3.out' }, at) },
    up:   { pre: el => gsap.set(mark(el), { autoAlpha: 0, y: 10 }),
            play: (tl, el, at, k) => tl.to(el, { autoAlpha: 1, y: 0, duration: .35 * k, ease: 'power3.out' }, at) },
    'pop-each': { pre: el => gsap.set(mark([...el.children]), { autoAlpha: 0, scale: .9, y: 6 }),
            play: (tl, el, at, k) => tl.to([...el.children], { autoAlpha: 1, scale: 1, y: 0, duration: .32 * k, stagger: .045 * k, ease: 'back.out(1.6)' }, at) },
    fill: { pre: el => gsap.set(mark(el), { scaleX: 0 }),
            play: (tl, el, at, k) => tl.to(el, { scaleX: 1, duration: .8 * k, ease: 'power3.out' }, at + (el.classList.contains('tests') ? .12 * k : 0)) },
    /* The status panel prints like terminal output: the frame opens, the prompt line is typed, then one row after the other, then the empty prompt with its cursor.
       The rows are real text (dt and dd), clipped and revealed in character steps, never rewritten. k is capped: the whole print takes about 2 s. */
    print: { pre: el => { gsap.set(mark(el), { clipPath: BOX0 }); gsap.set(mark([$('.who-prompt', el), ...$$('.who-row', el)]), { clipPath: CLIP0 }); gsap.set(mark($('.who-end', el)), { autoAlpha: 0 }); },
            play: (tl, el, at, k) => {
              const q = Math.min(k, 1.2), rows = $$('.who-row', el), pr = $('.who-prompt', el), end = $('.who-end', el), t0 = .5 * q, step = .17 * q;
              tl.to(el, { clipPath: BOX1, duration: .4 * q, ease: 'power3.out' }, at)
                .to(pr, { clipPath: CLIP1, duration: .3 * q, ease: `steps(${chars(pr)})` }, at + .25 * q);
              rows.forEach((r, i) => tl.to(r, { clipPath: CLIP1, duration: Math.min(.4, chars(r) * .012) * q + .08, ease: `steps(${chars(r)})` }, at + t0 + i * step));
              tl.to(end, { autoAlpha: 1, duration: .05 }, at + t0 + rows.length * step + .05 * q); } },
    dg:   { pre: el => { gsap.set(mark(el), { autoAlpha: 0 }); const a = $$('.arrow', el); if (a.length) { gsap.set(mark(a), { strokeDasharray: 1, strokeDashoffset: 1 }); gsap.set(mark($$('.head', el)), { autoAlpha: 0 }); } },
            play: (tl, el, at, k) => { tl.to(el, { autoAlpha: 1, duration: .3 * k, ease: 'power2.out' }, at);
              const a = $$('.arrow', el); if (a.length) { tl.to(a, { strokeDashoffset: 0, duration: .45 * k, ease: 'power2.inOut' }, at + .1 * k).to($$('.head', el), { autoAlpha: 1, duration: .12 * k }, at + .45 * k); } } },
    panel:{ pre: el => { const rows = $$('.sw-row', el), knobs = $$('.sw-toggle.is-on i', el), tracks = $$('.sw-toggle.is-on', el);
              gsap.set(mark(el), { clipPath: BOX0 }); gsap.set(mark(rows), { autoAlpha: 0, y: 8 }); gsap.set(mark(knobs), { x: -18 }); gsap.set(mark(tracks), { backgroundColor: '#0f1f45', borderColor: 'rgba(143,211,255,.38)' }); },
            play: (tl, el, at, k) => { tl.to(el, { clipPath: BOX1, duration: .45 * k, ease: 'power3.out' }, at)
              .to($$('.sw-row', el), { autoAlpha: 1, y: 0, duration: .3 * k, stagger: .07 * k, ease: 'power3.out' }, at + .15 * k)
              .to($$('.sw-toggle.is-on i', el), { x: 0, duration: .25 * k, stagger: .07 * k, ease: 'power2.out' }, at + .5 * k)
              .to($$('.sw-toggle.is-on', el), { backgroundColor: '#8fd3ff', borderColor: '#8fd3ff', duration: .25 * k, stagger: .07 * k }, at + .5 * k); } },
    alert:{ pre: el => {                                  /* the go-live alert: the only scripted scene inside a slide */
              const src = $('.src', el); src.classList.add('is-offline'); $('.src-state', el).textContent = 'Offline';
              gsap.set(mark([src, $('.beam', el)]), { autoAlpha: 0 });
              gsap.set(mark($('.win', el)), { clipPath: 'inset(-40px -40px 100% -40px)' });
              gsap.set(mark([$('.msg-prev', el), $('.msg-bot', el)]), { autoAlpha: 0, y: 12 });
              gsap.set(mark(['.embed-author', '.embed-title', '.embed-desc', '.thumb', '.embed-btn'].map(s => $(s, el))), { autoAlpha: 0, y: 10 });
              gsap.set(mark($('.embed-glow', el)), { autoAlpha: 0 }); gsap.set(mark($('.beam i', el)), { scaleY: 0 }); gsap.set(mark($('figcaption', el)), { autoAlpha: 0 }); },
            play: (tl, el, at, k) => {
              const src = $('.src', el), st = $('.src-state', el), parts = ['.embed-author', '.embed-title', '.embed-desc', '.thumb', '.embed-btn'].map(s => $(s, el));
              const a = gsap.timeline({ defaults: { ease: 'power3.out' } });
              a.to([src, $('.beam', el)], { autoAlpha: 1, duration: .2, stagger: .05 }, 0)
               .to($('.win', el), { clipPath: 'inset(-40px -40px -40px -40px)', duration: .55, ease: 'power2.out' }, .05)
               .to($('.msg-prev', el), { autoAlpha: 1, y: 0, duration: .3 }, .2)
               .call(G(() => { src.classList.remove('is-offline'); st.textContent = 'Live'; }), null, .3)
               .fromTo($$('.ring', el), { scale: 1, opacity: .9 }, { scale: 4.5, opacity: 0, duration: .8, stagger: .12, ease: 'power2.out', immediateRender: false }, .3)
               .to($('.beam i', el), { scaleY: 1, duration: .25, ease: 'power2.inOut' }, .35)
               .to($('.msg-bot', el), { autoAlpha: 1, y: 0, duration: .32 }, .55)
               .to($('.embed-glow', el), { autoAlpha: 1, duration: .25 }, .7)
               .to(parts, { autoAlpha: 1, y: 0, duration: .3, stagger: .05 }, .75)
               .to($('figcaption', el), { autoAlpha: 1, duration: .3 }, .85)
               .to($('.thumb-scan', el), { x: '240%', duration: .55, ease: 'power2.inOut' }, .8)
               .to($('.embed-glow', el), { opacity: .75, duration: .4, ease: 'power2.inOut' }, .95);
              a.timeScale(1 / Math.max(1, k * .8));             /* the scene is written for a 2 s visit: stretch it with the pace */
              mark($$('.ring, .thumb-scan, .beam i', el)); tl.add(a, at); },
            final: el => { const src = $('.src', el); src.classList.remove('is-offline'); $('.src-state', el).textContent = 'Live'; } },
  };
  /* On a revisit these scenes are not replayed, they simply wipe in finished. */
  const QUICK_FX = { alert: 'box', panel: 'box', print: 'box', dg: 'wipeg' };
  FX.wipeg = { pre: el => gsap.set(mark(el), { autoAlpha: 0 }), play: (tl, el, at, k) => tl.to(el, { autoAlpha: 1, duration: .3 * k }, at) };

  /* ================================================================ 6 transition */
  function finish(quiet) {                                /* any key, click or touch while running lands here; quiet: the caller announces and focuses what it needs, so this does neither */
    if (!S.running) return;
    try { S.tl.progress(1, true); } catch (e) { /* settle() below cleans up either way */ }   /* true: callbacks stay silent, so only the call below ends the run and it alone decides whether to announce */
    end(S.run, quiet);
  }
  function end(run, quiet) { if (S.running && run === S.run) settle(S.cur, S.opts, quiet); }
  /* The one way every run ends: the timeline finishing, a key, the failsafe, GSAP throwing, or no run at all (instant swap).
     Whatever happened before, the result is the finished page: no start state left on any part, the target slide shown, nav, prompt line and live region updated. */
  function settle(id, o, quiet) {
    o = o || {}; S.running = false;                       /* first: whatever fails below, the run is over */
    each(
      () => clearTimeout(S.failsafe),
      () => { if (S.tl) S.tl.kill(); },
      () => { S.tl = null; },
      () => clear([...touched, ...(o.from ? [SLIDE[o.from]] : [])]),
      () => touched.clear(),
      () => { SLIDE[id].style.zIndex = ''; },
      () => { if (id === 'trinketbot') FX.alert.final($('#stage')); },   /* the alert scene starts as Offline and goes Live; the finished page says Live */
      () => consoleRest(id),
      () => show(id),                                     /* hides and inerts every other slide */
      () => root.classList.add('ready'),
      () => S.visited.add(id),
      () => root.setAttribute('data-state', 'idle'),
      () => warm());
    if (quiet) return;
    each(
      () => { if (o.focus !== false) { const target = o.then === 'contact' ? $('#ct-h') : headingOf(id); if (target) target.focus({ preventScroll: true }); } },
      () => announce(TEXT.loaded(id, IDS.indexOf(id) + 1)));
  }
  /* The images of the other slides are lazy, so a plain load of /hello never requests them. After the first run has settled and the page has been
     quiet for a moment they are fetched in idle time: they sit in the cache when their slide is written in, with no pop-in. */
  function warm() {
    if (S.warmed) return; S.warmed = true;
    setTimeout(() => (window.requestIdleCallback || (f => f()))(() => $$('img[loading="lazy"]').forEach(i => { const im = new Image(); im.decoding = 'async'; im.src = i.currentSrc || i.getAttribute('src'); }), { timeout: 4000 }), 2500);
  }
  function announce(msg) { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 40); }

  function instant(id, o) {                               /* reduced motion, no GSAP, animations off: swap, update the prompt, done */
    S.cur = id; S.opts = o; S.run++; SLIDE[id].scrollTop = 0;   /* S.run++: its own run id, so the warning of an earlier run does not hide a failure here */
    settle(id, o, o.initial);
  }

  function play(id, o) {
    const from = o.initial ? null : S.cur, first = !S.visited.has(id);
    const variant = o.initial ? (id === 'hello' ? 'opening' : 'first') : (first && !o.quick ? 'first' : 'quick');
    const P = PACE[variant], quick = variant === 'quick', opening = variant === 'opening', k = P.fx;
    S.cur = id; S.opts = { ...o, from }; S.running = true; S.run++;
    root.setAttribute('data-state', 'running');
    const run = S.run, slide = SLIDE[id];

    /* 1. show the incoming slide, then set start states (same task, so there is no flash) */
    show(id, from); slide.inert = false; slide.scrollTop = 0; slide.style.zIndex = '2';
    if (from) SLIDE[from].inert = true;
    const script = opening ? OPENING.map(log => L(log)) : quick ? [SCRIPT[id][0], SCRIPT[id][SCRIPT[id].length - 1]] : SCRIPT[id];
    /* parts always come from the full script, even when the log is shortened. In the opening every part has its own start time. */
    const defs = opening ? Object.keys(P.at).map(name => ({ names: [name], when: P.at[name] })) : SCRIPT[id].filter(s => s.step).map(s => ({ s, names: s.step.split(' ') }));
    const plan = defs.map(d => ({ ...d, els: $$(d.names.map(n => `[data-step="${n}"]`).join(','), slide).filter(el => !el.closest('svg') || el.closest('svg').getBoundingClientRect().width > 0) }));
    plan.forEach(({ els }) => els.forEach(el => { const name = (quick && QUICK_FX[el.dataset.fx]) || el.dataset.fx; if (FX[name]) FX[name].pre(el); }));
    root.classList.add('ready');

    /* 2. timings. A normal run: type, send, then the log prints. The opening: the log prints, then the command is typed and sent. */
    const n = script.length;
    const gap = opening ? P.gap : Math.min(P.gap[1], Math.max(P.gap[0], P.span / (n - 1)));
    const LOG = opening ? .1 : (from ? .05 : 0) + P.type + P.send;          /* the first log line */
    const READY = LOG + (n - 1) * gap;
    const T_TYPE = opening ? READY + P.hold : (from ? .05 : 0), T_SEND = T_TYPE + P.type, GO = T_SEND + P.send;   /* GO: the command has been sent */
    const rows = Math.max(1, Math.round(C.logWin.getBoundingClientRect().height / 16));

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, paused: true, onComplete: G(() => end(run, S.opts.initial)) });   /* built paused, started at the end of play(); o.hold keeps it paused for frame capture */
    S.tl = tl; tl.timeScale(SPEED);
    /* labels: out, type, send, boot (first log line), l0..l<n-1> (one per log line), ready, and go. Every tween below is placed on one of them. */
    tl.addLabel('out', 0).addLabel('type', T_TYPE).addLabel('send', T_SEND).addLabel('go', GO).addLabel('boot', LOG);
    script.forEach((s, i) => tl.addLabel('l' + i, LOG + i * gap));
    tl.addLabel('ready', READY);

    /* 3. outgoing slide */
    if (from) {
      const dir = IDS.indexOf(id) > IDS.indexOf(from) ? 1 : -1;
      tl.to(SLIDE[from], { autoAlpha: 0, x: -24 * dir, duration: P.out, ease: 'power2.in' }, 'out');
    }

    /* 4. console: type the command, press send. The cursor is on from the start; the text is a clipped copy that is typed. */
    const cmd = '/' + id;
    C.text.textContent = cmd; C.chip.classList.add('on'); C.chip.classList.remove('sent');
    const chw = C.text.getBoundingClientRect().width / cmd.length;
    gsap.set(C.text, { clipPath: CLIP0 });
    gsap.set(C.caret, { x: 0 }); C.caret.classList.add('on');
    tl.to([C.ph, C.prompt], { autoAlpha: 0, duration: .1 }, opening ? 0 : 'type')
      .to(C.text, { clipPath: CLIP1, duration: P.type, ease: `steps(${cmd.length})` }, 'type')
      .to(C.caret, { x: cmd.length * chw, duration: P.type, ease: `steps(${cmd.length})` }, 'type')
      .call(G(() => C.chip.classList.add('sent')), null, 'send')
      .fromTo(C.chip, { backgroundColor: 'rgba(143,211,255,.5)' }, { backgroundColor: 'rgba(143,211,255,.14)', duration: P.send + .2, ease: 'power2.out', immediateRender: false }, 'send');
    const c0 = opening ? GO + P.collapse : READY + P.hold;                 /* the console settles: log and typed command leave, the prompt line comes back */
    tl.to([C.chip, C.caret], { autoAlpha: 0, y: -6, duration: .2 }, opening ? c0 : 'boot');

    /* 5. boot log and progress bar */
    tl.set(C.log, { autoAlpha: 1 }, 'boot');
    const lineEls = script.map(s => { const p = document.createElement('p'); p.className = 'ln'; p.innerHTML = lineHTML(s.log.replace('{i}', s.count ? '1' : '')); C.logIn.appendChild(p); return p; });
    script.forEach((s, i) => {
      const at = 'l' + i, p = lineEls[i], len = s.log.replace('{i}', '1').length + 2;
      tl.fromTo(p, { clipPath: CLIP0 }, { clipPath: CLIP1, duration: Math.min(gap * .8, len * P.char), ease: `steps(${len})` }, at);
      if (i > 0) tl.call(G(() => lineEls[i - 1].classList.add('old')), null, at);
      if (i >= rows) tl.set(C.logIn, { y: -(i - rows + 1) * 16 }, at);   /* the log scrolls one row at once, like a terminal: a slide would show the new line half inside the window, its descenders cut off, for a few frames */
    });
    const prog = { p: 0 };
    tl.to(prog, { p: 100, duration: Math.max(.2, READY - LOG + .12), ease: 'none', onUpdate: G(() => setProg(prog.p)) }, 'boot');

    /* 6. parts of the slide, written in: as their log line prints, or at their own time in the opening */
    plan.forEach(({ s, when, els }) => {
      const li = s ? SCRIPT[id].indexOf(s) : 0;
      const at = opening ? GO + when : quick ? LOG + li * .06 * k : tl.labels['l' + li] + .03;
      const groups = [...new Set(els.map(el => el.closest('[data-group]') || el))];
      const span = Math.max(.001, gap * 1.5);
      els.forEach((el, i) => {
        const name = (quick && QUICK_FX[el.dataset.fx]) || el.dataset.fx; if (!FX[name]) return;
        const gi = groups.indexOf(el.closest('[data-group]') || el);
        const counted = s && s.count;
        const t = counted && !quick ? at + gi * (span / Math.max(1, s.count)) : (counted ? at + gi * .03 : at + (name === 'pop-each' ? 0 : i * Math.min(.07, span / Math.max(1, els.length)) * (quick ? .4 : 1.5)));
        FX[name].play(tl, el, t, k);
        if (counted && !quick) tl.call(G(() => { lineEls[li].innerHTML = lineHTML(s.log.replace('{i}', String(gi + 1))); }), null, t);
      });
    });

    /* 7. the log collapses into the prompt breadcrumb */
    const pt = c0 + P.fade;
    tl.to(C.log, { autoAlpha: 0, duration: P.fade }, c0)
      .call(G(() => { C.prompt.textContent = promptText(id); }), null, pt)
      .fromTo(C.prompt, { autoAlpha: 1, clipPath: CLIP0 }, { clipPath: CLIP1, duration: P.prompt, ease: `steps(${promptText(id).length})`, immediateRender: false }, pt)
      .to(C.ph, { autoAlpha: 1, duration: .25 }, pt + P.prompt * .6);
    mark([C.text, C.chip, C.caret, C.ph, C.prompt, C.log, C.logIn]);

    window.__lastDuration = tl.duration() / SPEED; window.__variant = variant;       /* QA hooks */
    clearTimeout(S.failsafe);
    /* Guarantee: the finished page, whatever happens to the timeline. At least 1.5 x the run itself, never under FAILSAFE. */
    S.failsafe = setTimeout(() => { if (S.running && S.run === run) finish(S.opts.initial); }, Math.max(FAILSAFE, window.__lastDuration * 1.6) * 1000);
    if (!o.hold) tl.play();
  }

  /* ---- public entry: go to a slide ---- */
  function go(id, o = {}) {
    if (!IDS.includes(id)) id = 'hello';
    if (S.running) { if (id === S.cur && !o.initial) return; finish(); }
    closeMenu();
    if (id === S.cur && !o.initial) { if (o.focus !== false) { const t = o.then === 'contact' ? $('#ct-h') : headingOf(id); if (t) t.focus({ preventScroll: true }); } return; }
    if (o.push !== false && !o.initial) history.pushState({ s: id }, '', '#' + id);
    try {
      if (!hasGsap || !S.motion || o.instant) instant(id, o);
      else play(id, o);
    } catch (e) {                                         /* GSAP threw while the run was being built or started: end in the same finished state as the instant path */
      warn(e);
      settle(id, S.opts, o.initial);
    }
  }
  addEventListener('resize', () => scrollable(S.cur));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => scrollable(S.cur));
  window.__nav = { go, finish, S, IDS, boot: (id, o) => { if (S.running) finish(); play(id, { initial: true, focus: false, ...o }); } };   /* QA hooks: go, finish, state, and boot (the opening again, o.hold keeps the timeline paused for frames) */

  /* ================================================================ 7 input */
  const menuBtn = $('#menu-btn'), menu = $('#cmds');
  function openMenu() { menu.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); const cur = $('a[aria-current="page"]', menu) || $('a', menu); cur.focus(); }
  function closeMenu(back) { if (!menu.classList.contains('open')) return; menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); if (back) menuBtn.focus(); }
  const menuMode = () => getComputedStyle(menuBtn).display !== 'none';
  menuBtn.hidden = false;
  menuBtn.addEventListener('click', () => (menu.classList.contains('open') ? closeMenu(true) : openMenu()));
  menu.addEventListener('focusout', e => { if (menu.classList.contains('open') && !menu.contains(e.relatedTarget) && e.relatedTarget !== menuBtn) closeMenu(); });
  document.addEventListener('click', e => { if (menu.classList.contains('open') && !menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });

  document.addEventListener('click', e => {
    if (about.open && !about.contains(e.target)) about.open = false;   /* the About panel closes on any outside click */
    if (S.running) finish();                              /* a click or tap anywhere finishes the transition first */
    const sk = e.target.closest('a.skip');
    if (sk && !e.defaultPrevented) { e.preventDefault(); const h = headingOf(S.cur); if (h) h.focus({ preventScroll: true }); return; }   /* skip link: focus the slide heading, no hash change */
    const a = e.target.closest('a[data-go]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); go(a.dataset.go, { then: a.dataset.then });
  });
  const onSwitch = e => !!(e.target.closest && e.target.closest('#anim'));   /* the switch ends a run quietly: it announces "Animations off" itself, "Loaded /x" would come first */
  ['pointerdown', 'touchstart'].forEach(t => document.addEventListener(t, e => { if (S.running) finish(onSwitch(e)); }, { passive: true }));

  document.addEventListener('keydown', e => {
    /* Any key finishes the transition, then the key is handled normally. The finish must not take the focus away from what the key is meant for:
       Tab, Shift+Tab and the modifier keys move on from where the focus is, and Space or Enter on the switch or a nav link must still reach it.
       Otherwise the focus goes to the new slide's heading, as when a run ends by itself. */
    if (S.running) {
      const f = document.activeElement;
      if (/^(Tab|Shift|Control|Alt|AltGraph|Meta)$/.test(e.key) || e.ctrlKey || e.altKey || e.metaKey || (f && f !== document.body && !f.closest('.slide'))) S.opts.focus = false;
      finish(onSwitch(e) && (e.key === ' ' || e.key === 'Enter'));
    }
    if (e.key === 'Escape') { closeMenu(true); if (about.open) { about.open = false; $('summary', about).focus(); } return; }
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.isComposing) return;
    const t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    const i = IDS.indexOf(S.cur);
    if (e.key === 'ArrowRight' && i < IDS.length - 1) { e.preventDefault(); go(IDS[i + 1]); }
    else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); go(IDS[i - 1]); }
    else if (/^[1-9]$/.test(e.key) && +e.key <= IDS.length) { e.preventDefault(); go(IDS[+e.key - 1]); }
    else if (e.key === '/') { e.preventDefault(); if (menuMode()) openMenu(); else { const c = $('a[aria-current="page"]', menu); if (c) c.focus(); } }
    else if (e.key === 'ArrowDown' && menu.contains(t) && menu.classList.contains('open')) { e.preventDefault(); const a = $$('a', menu), j = a.indexOf(t); (a[j + 1] || a[0]).focus(); }
    else if (e.key === 'ArrowUp' && menu.contains(t) && menu.classList.contains('open')) { e.preventDefault(); const a = $$('a', menu), j = a.indexOf(t); (a[j - 1] || a[a.length - 1]).focus(); }
  });
  addEventListener('popstate', () => { const h = hashText(); if (h && !IDS.includes(h)) return; go(idFromHash(), { push: false, quick: true }); });   /* other hashes (#main, typos) are left alone */
  addEventListener('beforeprint', () => { finish(); about.open = true; });
  addEventListener('afterprint', () => { about.open = false; });

  /* ================================================================ 8 animation switch */
  /* Animations are on when GSAP loaded, the system does not ask for reduced motion and the visitor has not switched them off.
     The visitor's choice is kept in localStorage, which may be blocked: then it simply is not kept. With reduced motion the
     switch shows "off", cannot be turned on, and says why. */
  const KEY = 'anim';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pref = 'on'; try { pref = localStorage.getItem(KEY) === 'off' ? 'off' : 'on'; } catch (e) { /* blocked storage */ }
  const sw = $('#anim'), swBox = $('#anim-box'), swV = $('#anim-v');
  function applyAnim() {
    const on = hasGsap && !reduced.matches && pref !== 'off';
    S.motion = on; window.__status = on ? 'motion' : 'static';
    root.setAttribute('data-anim', on ? 'on' : 'off');
    if (!on) finish(true);                                /* switching off finishes a running animation at once */
    swBox.hidden = !hasGsap;                              /* without GSAP there is nothing to switch: the switch stays hidden (its space is reserved in CSS) rather than claim a state it cannot deliver */
    /* The note exists only while the system setting is what decides. Its space is reserved in CSS (a hidden pseudo-element), so adding or removing it does not move the footer. */
    let note = $('#anim-note');
    if (reduced.matches && !note) { note = document.createElement('span'); note.className = 'anim-note'; note.id = 'anim-note'; note.textContent = TEXT.animNote; swBox.appendChild(note); }
    else if (!reduced.matches && note) note.remove();
    sw.setAttribute('aria-checked', String(on)); swV.textContent = on ? 'on' : 'off';
    /* The note is the switch's description only while the system setting is what decides: elsewhere "follows system setting" would be false. */
    const sys = (a, v) => { if (reduced.matches) sw.setAttribute(a, v); else sw.removeAttribute(a); };
    sys('aria-disabled', 'true'); sys('aria-describedby', 'anim-note');
  }
  sw.addEventListener('click', () => {
    if (reduced.matches) { announce(TEXT.animSystem); return; }
    pref = pref === 'off' ? 'on' : 'off';
    try { localStorage.setItem(KEY, pref); } catch (e) { /* blocked storage */ }
    applyAnim(); announce(pref === 'off' ? TEXT.animOff : TEXT.animOn);   /* switching on takes effect from the next transition */
  });
  if (reduced.addEventListener) reduced.addEventListener('change', applyAnim);

  /* ================================================================ 9 boot */
  applyAnim();
  about.open = false;
  const first = idFromHash();
  if (location.hash && location.hash.slice(1) !== first) history.replaceState({ s: first }, '', '#' + first);
  else history.replaceState({ s: first }, '', location.hash || location.pathname + location.search);
  hideOthers(first);
  root.setAttribute('data-state', 'booting');
  if (hasGsap && S.motion) go(first, { initial: true, focus: false });
  else instant(first, { initial: true, focus: false });
})();
