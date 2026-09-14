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
  // Über der Foto-Szene ist die Leiste transparent (weiße Schrift), danach Glas
  const sceneEl = document.querySelector('.scene');
  if (sceneEl) {
    nav.classList.add('over');
    ScrollTrigger.create({ trigger: sceneEl, start: 'top top', end: () => 'bottom ' + Math.round(innerHeight * .35) + 'px', onToggle: t => nav.classList.toggle('over', t.isActive), onRefresh: t => nav.classList.toggle('over', t.isActive) });
  }
  // Leiste bleibt beim Scrollen immer sichtbar (kein Ausblenden).

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

  // ---------- Cookie-Einwilligung + Google Analytics (lädt erst nach Zustimmung) ----------
  const GA_ID = 'G-XXXXXXXXXX'; // Mess-ID aus Google Analytics eintragen (siehe LAUNCH-CHECKLISTE)
  const consent = document.getElementById('consent');
  if (consent) {
    const KEY = 'co2-consent';
    const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
    const write = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
    window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } window.gtag = gtag;
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    let loaded = false;
    const loadGA = () => {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      if (loaded || GA_ID === 'G-XXXXXXXXXX') return; loaded = true;
      const sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(sc);
      gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
    };
    const revoke = () => { gtag('consent', 'update', { analytics_storage: 'denied' }); document.cookie.split(';').forEach(c => { const n = c.split('=')[0].trim(); if (/^_ga/.test(n)) document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, ''); }); };
    const show = () => { consent.hidden = false; };
    const hide = () => { consent.hidden = true; };
    document.getElementById('consentAll').addEventListener('click', () => { write('all'); hide(); loadGA(); });
    document.getElementById('consentNone').addEventListener('click', () => { write('none'); hide(); revoke(); });
    document.querySelectorAll('[data-consent-open]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); show(); consent.querySelector('button').focus(); }));
    const saved = read();
    if (saved === 'all') loadGA(); else if (saved !== 'none') show();
  }

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

  // Heizkosten- & CO2-Check (Startseite)
  const ckYear = document.getElementById('ckYear');
  if (ckYear) {
    const $ = id => document.getElementById(id);
    const area = $('ckArea'), heat = $('ckHeat'), san = $('ckSan');
    // typischer Endenergiebedarf je Baualtersklasse (kWh/m²·a, Richtwerte)
    const kwhByYear = y => y < 1919 ? 225 : y < 1949 ? 215 : y < 1958 ? 220 : y < 1969 ? 205 : y < 1979 ? 190 : y < 1984 ? 165 : y < 1995 ? 135 : y < 2002 ? 105 : y < 2010 ? 80 : y < 2016 ? 60 : 45;
    // Preis €/kWh Endenergie und CO2 kg/kWh (Richtwerte 2026); Wärmepumpe über Jahresarbeitszahl 3,5
    const fuels = { gas: { p: .12, co2: .20, n: 'Gas' }, oel: { p: .11, co2: .27, n: 'Öl' }, fern: { p: .14, co2: .18, n: 'Fernwärme' }, wp: { p: .32 / 3.5, co2: .38 / 3.5, n: 'Wärmepumpe' }, pellet: { p: .08, co2: .02, n: 'Pellets' } };
    const classes = [['A+', 30, '#1a9641'], ['A', 50, '#3fa53a'], ['B', 75, '#79b830'], ['C', 100, '#b5c920'], ['D', 130, '#e8c31b'], ['E', 160, '#f19a1a'], ['F', 200, '#e8661a'], ['G', 250, '#d93a2b'], ['H', 1e9, '#b3161b']];
    const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
    const num = { cost: 0, co2: 0, save: 0, trees: 0 };
    const paint = () => { $('ckCost').textContent = eur(num.cost); $('ckCo2').textContent = (Math.round(num.co2 * 10) / 10).toLocaleString('de-DE') + ' t'; $('ckSave').textContent = eur(num.save); $('ckTrees').textContent = Math.round(num.trees).toLocaleString('de-DE'); };
    const calc = () => {
      const y = +ckYear.value, a = +area.value, f = fuels[heat.querySelector('[aria-pressed=true]').dataset.k];
      let kwh = kwhByYear(y); if (san.checked && y < 2002) kwh = Math.round(kwh * .7);
      const cls = classes.find(c => kwh < c[1]); const target = 45; // Effizienzhaus-Niveau
      const total = kwh * a, cost = total * f.p, co2 = total * f.co2 / 1000, save = (kwh - target) * a * f.p;
      $('ckYearOut').value = y; $('ckAreaOut').value = a + ' m²'; $('ckKwh').textContent = kwh; $('ckCls').textContent = cls[0]; $('ckCls').style.background = cls[2];
      $('ckBar').style.left = Math.min(98, Math.max(2, kwh / 260 * 100)) + '%';
      $('ckHint').textContent = kwh <= 50 ? `Ihr Haus liegt bereits auf einem sehr guten Niveau. Sinnvoll: Heizungsoptimierung und Eigenstrom – wir prüfen, was sich noch lohnt.` : `Ein Haus dieser Baualtersklasse mit ${f.n} verbraucht typischerweise rund ${total.toLocaleString('de-DE')} kWh im Jahr. Mit einem Sanierungsfahrplan lässt sich der Bedarf Schritt für Schritt Richtung Klasse A senken – förderfähig und in der richtigen Reihenfolge.`;
      const t = { cost, co2, save: Math.max(0, save), trees: co2 * 1000 / 12.5 };
      if (reduce) { Object.assign(num, t); paint(); } else gsap.to(num, { ...t, duration: .7, ease: 'power3.out', overwrite: true, onUpdate: paint });
    };
    [ckYear, area].forEach(el => el.addEventListener('input', calc)); san.addEventListener('change', calc);
    heat.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { heat.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); calc(); }));
    calc();
  }

  // FAQ-Suche
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    const items = [...document.querySelectorAll('.q')].map(q => ({ q, s: q.querySelector('summary span'), a: q.querySelector('.a p'), st: q.querySelector('summary span').textContent, at: q.querySelector('.a p').textContent }));
    const count = document.getElementById('faqCount'), empty = document.getElementById('faqEmpty');
    const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mark = (el, text, term) => { el.innerHTML = term ? text.replace(new RegExp('(' + esc(term) + ')', 'gi'), '<mark>$1</mark>') : text; };
    faqSearch.addEventListener('input', () => {
      const term = faqSearch.value.trim().toLowerCase(); let n = 0;
      items.forEach(it => { const hit = !term || it.st.toLowerCase().includes(term) || it.at.toLowerCase().includes(term); it.q.classList.toggle('hide', !hit); if (hit) n++; mark(it.s, it.st, term); mark(it.a, it.at, term); if (term && hit) it.q.open = true; if (!term) it.q.open = false; });
      count.textContent = term ? `${n} von ${items.length}` : ''; empty.hidden = n > 0; ScrollTrigger.refresh();
    });
  }

  // Kontakt: Thema per Kachel wählen (auch per ?thema=… in der Adresse)
  const pick = document.getElementById('pick');
  if (pick) {
    const sel = document.getElementById('thema');
    const choose = v => { pick.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); sel.value = v; };
    pick.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { choose(b.dataset.v); if (!reduce) gsap.fromTo(b, { scale: .94 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.5)' }); }));
    sel.addEventListener('change', () => choose(sel.value));
    const q = new URLSearchParams(location.search).get('thema'); if (q) { const b = [...pick.querySelectorAll('button')].find(x => x.dataset.v.toLowerCase().includes(q.toLowerCase())); if (b) choose(b.dataset.v); }
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
    strips.forEach((s, i) => tl.to(s, { yPercent: (i % 2 ? 1 : -1) * 105, duration: 7 + (i % 3) * 2, ease: 'power2.in' }, 36 + i * .6));
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
