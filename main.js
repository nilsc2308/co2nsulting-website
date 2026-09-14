(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // ---------- Lenis (Smooth Scroll) ----------
  let lenis;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = (el, off = -40) => lenis ? lenis.scrollTo(el, { offset: off, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const el = document.querySelector(id); if (!el) return;
    e.preventDefault(); closeMenu(); scrollToEl(el);
  }));

  // ---------- Menü ----------
  const burger = document.getElementById('burger'), menu = document.getElementById('menu');
  const closeMenu = () => { document.body.classList.remove('menu-open'); menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); };
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    document.body.classList.toggle('menu-open', open); menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open)); lenis && (open ? lenis.stop() : lenis.start());
    if (open) menu.querySelector('a').focus();
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); burger.focus(); } });
  document.querySelectorAll('.nav a.active').forEach(a => a.setAttribute('aria-current', 'page'));

  // Glas-Navigation: beim Runterscrollen ausblenden
  let last = 0; const nav = document.getElementById('nav');
  ScrollTrigger.create({ onUpdate: s => { const y = s.scroll(); nav.classList.toggle('hide', y > last && y > 120 && !document.body.classList.contains('menu-open')); last = y; } });

  // Wort-für-Wort-Reveals vorbereiten
  document.querySelectorAll('.split').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map(w => `<span class="line" aria-hidden="true"><span class="word">${w}</span></span>`).join(' ');
  });
  document.querySelectorAll('.layer h1, .layer h2').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map(w => `<span class="lw" aria-hidden="true"><span class="w">${w}</span></span>`).join(' ');
  });

  // ---------- Seitenübergang (Vorhang) + Brand-Intro nur beim ersten Besuch ----------
  const introCurtain = document.querySelector('.curtain.intro');
  let seen = false; try { seen = sessionStorage.getItem('co2-intro'); } catch (e) {}
  if (introCurtain && !seen && !reduce) {
    try { sessionStorage.setItem('co2-intro', '1'); } catch (e) {}
    document.body.classList.add('intro-on');
    setTimeout(() => document.body.classList.add('ready'), 1300);
  } else requestAnimationFrame(() => document.body.classList.add('ready'));
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || a.target === '_blank' || reduce) return;
    const href = a.getAttribute('href'), [path, hash] = href.split('#');
    const here = location.pathname.split('/').pop() || 'index.html';
    if (path === here) {
      const el = hash && document.getElementById(hash);
      e.preventDefault(); closeMenu(); if (el) scrollToEl(el); else scrollToEl(document.body, 0); return;
    }
    e.preventDefault(); document.body.classList.add('leaving');
    setTimeout(() => location.href = href, 650);
  }));
  window.addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });

  // Scroll-Fortschritt oben
  const prog = document.getElementById('progress');
  if (prog) ScrollTrigger.create({ onUpdate: s => prog.style.transform = `scaleX(${s.progress})` });

  // Mobile Sticky-CTA: auf der Startseite erst nach der Szene
  const sticky = document.querySelector('.sticky-cta'), scene = document.querySelector('.scene');
  if (sticky && scene && !reduce) { sticky.classList.add('off'); ScrollTrigger.create({ start: () => scene.offsetHeight - innerHeight * .6, end: 'max', onToggle: t => sticky.classList.toggle('off', !t.isActive) }); }
  document.querySelectorAll('.totop').forEach(a => a.addEventListener('click', e => { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: 'smooth' }); }));

  // ---------- Interaktive Elemente (auch bei reduzierter Bewegung) ----------
  // FAQ: nur eins offen
  document.querySelectorAll('.q').forEach(d => d.addEventListener('toggle', () => { if (d.open) document.querySelectorAll('.q[open]').forEach(o => { if (o !== d) o.open = false; }); ScrollTrigger.refresh(); }));

  // Karte erst per Klick (OpenStreetMap, keine Drittanbieter-Verbindung ohne Zustimmung)
  document.querySelectorAll('[data-map]').forEach(btn => btn.addEventListener('click', () => {
    const m = document.getElementById(btn.dataset.map); const [lat, lon] = btn.dataset.pos.split(',').map(Number);
    const d = .012; const bbox = `${lon - d * 1.6}%2C${lat - d}%2C${lon + d * 1.6}%2C${lat + d}`;
    m.innerHTML = `<iframe title="Karte: ${btn.dataset.title}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>`;
  }));

  // Kontaktformular: Prüfung vor dem Senden (Netlify Forms übernimmt den Versand)
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    const ok = form.checkValidity();
    if (!ok) { e.preventDefault(); form.reportValidity(); }
    else form.querySelector('button[type=submit]').textContent = 'Wird gesendet …';
  });

  // Förderrechner (vereinfachte Logik – siehe LAUNCH-CHECKLISTE)
  const inv = document.getElementById('inv');
  if (inv) {
    const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
    const seg = document.getElementById('seg'), isfp = document.getElementById('isfp');
    const out = { inv: document.getElementById('invOut'), f: document.getElementById('fOut'), l: document.getElementById('fLabel'), rInv: document.getElementById('rInv'), rF: document.getElementById('rF'), rRest: document.getElementById('rRest') };
    const shown = { v: 0 };
    const calc = () => {
      const btn = seg.querySelector('[aria-pressed=true]'); const base = +btn.dataset.rate; const hp = btn.dataset.kind === 'hp';
      const bonus = (!hp && isfp.checked) ? 5 : 0; const rate = Math.min(base + bonus, 70);
      const cap = hp ? 30000 : (isfp.checked ? 60000 : 30000); const v = +inv.value; const elig = Math.min(v, cap); const f = elig * rate / 100;
      out.inv.textContent = eur(v); out.rInv.textContent = eur(v); out.rF.textContent = '– ' + eur(f); out.rRest.textContent = eur(v - f);
      out.l.textContent = `geschätzte Förderung · ${rate} %` + (elig < v ? ` (förderfähig bis ${eur(cap)})` : '');
      gsap.to(shown, { v: f, duration: .6, ease: 'power3.out', onUpdate: () => out.f.textContent = eur(shown.v) });
    };
    inv.addEventListener('input', calc); isfp.addEventListener('change', calc);
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); calc(); }));
    calc();
  }

  // Beispiel-Fahrplan (fiktives Gebäude, klickbare Schritte, Live-Zahlen)
  const planSteps = document.getElementById('planSteps');
  if (planSteps) {
    const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
    // Klassen nach GEG-Anlage 10 (Endenergie kWh/m²·a)
    const classes = [['A+', '#1a9641', '< 30'], ['A', '#3fa53a', '30–50'], ['B', '#79b830', '50–75'], ['C', '#b5c920', '75–100'], ['D', '#e8c31b', '100–130'], ['E', '#f19a1a', '130–160'], ['F', '#e8661a', '160–200'], ['G', '#d93a2b', '200–250'], ['H', '#b3161b', '> 250']];
    const steps = [
      { cls: 8, kwh: 265, cost: 4400, inv: 0, f: 0, kicker: 'Ausgangszustand · Baujahr 1968' },
      { cls: 6, kwh: 190, cost: 3200, inv: 28000, f: .20, kicker: 'Nach Schritt 1 · Dach' },
      { cls: 5, kwh: 150, cost: 2500, inv: 22000, f: .20, kicker: 'Nach Schritt 2 · Fenster' },
      { cls: 3, kwh: 90, cost: 1500, inv: 45000, f: .20, kicker: 'Nach Schritt 3 · Fassade' },
      { cls: 1, kwh: 40, cost: 650, inv: 38000, f: .55, kicker: 'Ziel · Wärmepumpe + PV' },
    ];
    const scale = document.getElementById('escale');
    classes.forEach(([c, col, range], i) => {
      const row = document.createElement('div'); row.className = 'er';
      row.innerHTML = `<b style="background:${col}">${c}</b><i style="background:${col};width:${34 + i * 8}%"><span class="mark">Ihr Haus</span></i><span class="rng">${range}</span>`;
      scale.appendChild(row);
    });
    const rows = scale.querySelectorAll('.er');
    const el = { kwh: document.getElementById('planKwh'), cost: document.getElementById('planCost'), kicker: document.getElementById('planKicker'), glow: document.getElementById('planGlow'), inv: document.getElementById('sumInv'), f: document.getElementById('sumF'), save: document.getElementById('sumSave') };
    const num = { kwh: 265, cost: 4400, inv: 0, f: 0, save: 0 };
    const show = i => {
      const s = steps[i];
      planSteps.querySelectorAll('.pstep').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
      rows.forEach((r, k) => r.classList.toggle('on', k === s.cls));
      el.glow.style.background = classes[s.cls][1]; el.kicker.textContent = s.kicker;
      scale.setAttribute('aria-label', `Skala der Energieeffizienzklassen A+ bis H, aktuelle Klasse ${classes[s.cls][0]}`);
      let inv = 0, f = 0; for (let k = 1; k <= i; k++) { inv += steps[k].inv; f += steps[k].inv * steps[k].f; }
      const target = { kwh: s.kwh, cost: s.cost, inv, f, save: steps[0].cost - s.cost };
      const paint = () => { el.kwh.textContent = Math.round(num.kwh); el.cost.textContent = eur(num.cost); el.inv.textContent = eur(num.inv); el.f.textContent = eur(num.f); el.save.textContent = eur(num.save); };
      if (reduce) { Object.assign(num, target); paint(); }
      else gsap.to(num, { ...target, duration: .8, ease: 'power3.out', overwrite: true, onUpdate: paint });
    };
    planSteps.querySelectorAll('.pstep').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
    show(0);
  }

  // Quiz (3 Fragen): Antworten tragen data-v, Ergebnisse stehen in <template data-res="...">
  const quiz = document.getElementById('quizBox');
  if (quiz) {
    const qs = quiz.querySelectorAll('.qq'), bar = document.getElementById('quizBar'), res = document.getElementById('quizRes');
    const ans = []; let idx = 0;
    const go = i => { idx = i; qs.forEach((q, k) => q.classList.toggle('on', k === i)); bar.style.width = ((i + 1) / qs.length * 100) + '%'; };
    const finish = () => {
      qs.forEach(q => q.classList.remove('on')); bar.style.width = '100%'; res.classList.add('on');
      const key = ans.join('|');
      const tpl = [...quiz.querySelectorAll('template')].find(t => t.dataset.res.split(',').some(p => new RegExp('^' + p.replace(/\|/g, '\\|').replace(/\*/g, '[^|]*') + '$').test(key))) || quiz.querySelector('template[data-res="*"]');
      document.getElementById('resTitle').textContent = tpl.dataset.title; document.getElementById('resText').textContent = tpl.content.textContent.trim();
      document.getElementById('resLink').href = tpl.dataset.href;
      if (!reduce) gsap.from(res, { y: 20, opacity: 0, duration: .6, ease: 'power3.out' });
    };
    quiz.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
      ans[idx] = b.dataset.v; idx < qs.length - 1 ? go(idx + 1) : finish();
    }));
    document.getElementById('quizAgain').addEventListener('click', () => { ans.length = 0; res.classList.remove('on'); go(0); });
  }

  // Gebäude als System (Ebenen anklicken)
  const sysList = document.getElementById('sysList');
  if (sysList) {
    const view = { h: document.getElementById('sysTitle'), p: document.getElementById('sysText'), k: document.getElementById('sysKicker') };
    const rings = document.querySelectorAll('.rings circle');
    const pick = b => {
      sysList.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const i = +b.dataset.i; rings.forEach((c, k) => c.classList.toggle('on', k === i));
      view.k.textContent = `Ebene ${String(i + 1).padStart(2, '0')} / ${String(rings.length).padStart(2, '0')}`; view.h.textContent = b.dataset.title; view.p.textContent = b.dataset.text;
      if (!reduce) gsap.fromTo([view.h, view.p], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06, ease: 'power3.out' });
    };
    sysList.querySelectorAll('button').forEach(b => b.addEventListener('click', () => pick(b)));
    pick(sysList.querySelector('button'));
  }

  if (reduce) return;

  // ---------- Scroll-Reveals ----------
  document.querySelectorAll('.split').forEach(el => {
    gsap.to(el.querySelectorAll('.word'), { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.04, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  document.querySelectorAll('.count').forEach(el => {
    const to = +el.dataset.to, o = { v: 0 };
    gsap.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' }, onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('de-DE') });
  });
  // 3D-Tilt auf Karten
  if (window.matchMedia('(hover:hover)').matches) document.querySelectorAll('.card, .post, .loc').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: .6, ease: 'power3' });
    });
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: .8, ease: 'power3' }));
  });
  // Magnetische Buttons + Lichtreflex
  if (window.matchMedia('(hover:hover)').matches) document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px');
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
  });
  // Parallax für Seiten-Header-Bilder und Detail-Bilder
  document.querySelectorAll('.page-hero img').forEach(im => gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } }));
  document.querySelectorAll('.detail .media img').forEach(im => gsap.fromTo(im, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  // Horizontaler Ablauf
  const track = document.getElementById('track');
  if (track) ScrollTrigger.matchMedia({ '(min-width: 821px)': () => {
    const dist = () => track.scrollWidth - track.parentElement.clientWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.process', start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
  }});

  // ---------- Foto-Scroll-Through (Startseite) ----------
  if (scene) {
    const $ = s => scene.querySelector(s), $$ = s => [...scene.querySelectorAll(s)];
    const layers = $$('.layer');
    const maskText = $('#maskText'), maskSvg = $('.mask-svg');
    const strips = $$('.strip'), tiles = $$('.tile'), tilesWrap = $('.tiles-wrap');
    const shot3 = $('.shot-plan'), shot5 = $('.shot-stadt'), flash = $('.flash');
    const textIn = (layer, at, tl) => {
      const words = layer.querySelectorAll('.w');
      tl.set(layer, { opacity: 1 }, at);
      tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 3, stagger: .35, ease: 'power3.out' }, at);
      tl.fromTo(layer.querySelectorAll('.lead, .actions, .eyebrow'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, stagger: .5, ease: 'power3.out' }, at + 1);
    };
    const textOut = (layer, at, tl) => tl.to(layer, { opacity: 0, y: -40, duration: 3, ease: 'power2.in' }, at);

    // Hero-Text sofort einblenden (nicht scroll-gebunden)
    gsap.set(layers[0], { opacity: 1 });
    gsap.fromTo(layers[0].querySelectorAll('.w'), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .08, ease: 'power4.out', delay: seen ? .2 : 1.2 });
    gsap.fromTo(layers[0].querySelectorAll('.lead, .actions, .eyebrow'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out', delay: seen ? .6 : 1.6 });

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: .7 } });
    // Zeitachse: 0 … 100
    // 1) Holz: sanfter Zoom, dann Text raus
    tl.fromTo($('.mask-svg image'), { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.12, duration: 26 }, 0);
    textOut(layers[0], 9, tl);
    // 1 → 2  Text-Maske: „SUBSTANZ“ wächst und wird zum Fenster auf das Rathaus
    tl.fromTo(maskText, { attr: { 'font-size': 0.1 } }, { attr: { 'font-size': 620 }, duration: 16, ease: 'power2.in' }, 11);
    tl.to(maskSvg, { opacity: 0, duration: 2 }, 25);
    tl.fromTo(strips.map(s => s.firstElementChild), { scale: 1.18 }, { scale: 1, duration: 22 }, 11);
    textIn(layers[1], 24, tl);
    textOut(layers[1], 34, tl);
    // 2 → 3  Lamellen: Streifen fahren mit unterschiedlichem Tempo weg
    strips.forEach((s, i) => tl.to(s, { yPercent: (i % 2 ? 1 : -1) * 105, duration: 8 + (i % 3) * 3, ease: 'power2.in' }, 36 + i * .8));
    tl.fromTo(shot3.querySelector('img'), { scale: 1.25 }, { scale: 1.02, duration: 22 }, 36);
    textIn(layers[2], 46, tl);
    textOut(layers[2], 56, tl);
    // 3 → 4  Kachel-Montage: neun Kacheln fliegen von außen herein
    tl.set(tilesWrap, { opacity: 1 }, 57);
    tiles.forEach((t, i) => {
      const c = i % 3 - 1, r = Math.floor(i / 3) - 1;
      const dx = c === 0 ? (r === 0 ? 0 : 0) : c * 120, dy = r === 0 ? (c === 0 ? 0 : 0) : r * 120;
      const far = (c === 0 && r === 0);
      tl.fromTo(t, { xPercent: dx * 1.4, yPercent: dy * 1.4, opacity: 0, rotate: (c - r) * 6, scale: far ? .3 : 1 }, { xPercent: 0, yPercent: 0, opacity: 1, rotate: 0, scale: 1, duration: 9, ease: 'power3.out' }, 58 + (far ? 5 : (Math.abs(c) + Math.abs(r)) * 1.2));
    });
    textIn(layers[3], 68, tl);
    textOut(layers[3], 77, tl);
    // 4 → 5  Zoom-Dive + Lichtblitz, dann 3D-Kartenwechsel
    tl.to(tiles.map(t => t.firstElementChild), { scale: 1.9, transformOrigin: '62% 42%', duration: 8, ease: 'power2.in' }, 78);
    tl.fromTo(flash, { opacity: 0 }, { opacity: .9, duration: 1.2, ease: 'power2.in' }, 85.5).to(flash, { opacity: 0, duration: 2.5 }, 86.7);
    tl.to(tilesWrap, { scale: .55, borderRadius: 40, rotateY: -38, xPercent: -40, opacity: 0, duration: 8, ease: 'power2.inOut' }, 86);
    tl.fromTo(shot5, { scale: .32, borderRadius: 40, rotateY: 28, xPercent: 45, opacity: 0 }, { scale: 1, borderRadius: 0, rotateY: 0, xPercent: 0, opacity: 1, duration: 9, ease: 'power2.inOut' }, 86);
    tl.fromTo(shot5.querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 14 }, 86);
    textIn(layers[4], 93, tl);
    tl.to({}, { duration: 1 }, 100);
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => scrollToEl(el), 300);
  });
})();
