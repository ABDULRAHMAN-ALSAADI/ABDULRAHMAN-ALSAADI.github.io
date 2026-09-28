'use strict';
/* Anti-clickjacking: never render inside someone else's frame */
if (top !== self) { try { top.location = self.location; } catch (e) { document.documentElement.hidden = true; } }

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s), app = $('#app');
let SITE = {}, C = {}, DATA = [], mail = '', GAL = [], LBI = 0;

/* ---------- safety helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = u => { u = String(u ?? '').trim(); return /^(https?:\/\/|mailto:|#)/i.test(u) || (/^[\w./-]+$/.test(u)) ? u : '#'; };
const safeImg = u => { u = String(u ?? '').trim(); return /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u) || /^https?:\/\//i.test(u) || /^[\w./-]+$/.test(u) ? u : ''; };
const basename = p => String(p || '').split('/').pop();

/* ---------- icons ---------- */
const ICON = {
  gh: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
  li: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};

/* ---------- hero artwork: blueprint robotics + Saudi palms + Yemeni (Shibam) towers ---------- */
function heroArt() {
  const f = v => v.toFixed(1);
  const gear = (cx, cy, ro, ri, n) => {
    let d = ''; const s = Math.PI * 2 / n;
    for (let i = 0; i < n; i++) {
      const a = i * s, q = (r, t) => f(cx + r * Math.cos(a + t * s)) + ' ' + f(cy + r * Math.sin(a + t * s));
      d += (i ? 'L' : 'M') + q(ri, 0) + 'L' + q(ro, .16) + 'L' + q(ro, .40) + 'L' + q(ri, .56);
    }
    return d + 'Z';
  };
  const palm = (x, y, h) => {
    const cx = x + h * .07, cy = y - h, L = h * .5;
    let d = `M${x} ${y}Q${f(x + h * .12)} ${f(y - h * .5)} ${f(cx)} ${f(cy)}`;
    [-168, -138, -108, -78, -48, -14].forEach(a => {
      const r = a * Math.PI / 180;
      d += `M${f(cx)} ${f(cy)}Q${f(cx + L * .55 * Math.cos(r))} ${f(cy + L * .55 * Math.sin(r) - L * .2)} ${f(cx + L * Math.cos(r))} ${f(cy + L * Math.sin(r) + L * .38)}`;
    });
    return d;
  };
  const tower = (x, w, h, b) => {
    const t = b - h; let d = `M${x} ${b}V${t}H${x + w}V${b}M${x - 3} ${t + 7}H${x + w + 3}`;
    for (let r = 0; r < Math.floor((h - 26) / 30); r++) { const wy = t + 24 + r * 30; d += `M${f(x + w * .2)} ${wy}h5v10h-5zM${f(x + w * .62)} ${wy}h5v10h-5z`; }
    return d;
  };
  const B = 690;
  const towers = [[520, 44, 150], [568, 38, 205], [612, 50, 245], [666, 40, 180], [710, 46, 135], [940, 42, 170], [986, 50, 226], [1040, 40, 190], [1084, 46, 250], [1134, 38, 160]];
  const palms = [[800, B, 215], [872, B, 150], [1176, B, 170]];
  const cross = (x, y) => `M${x - 6} ${y}h12M${x} ${y - 6}v12`;
  return `<svg class="heroArt" viewBox="0 0 1200 700" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false">
<g class="ln">
 <g class="spin"><path d="${gear(1010, 140, 78, 66, 18)}"/><circle cx="1010" cy="140" r="30"/><circle cx="1010" cy="140" r="9"/></g>
 <g class="spin rev"><path d="${gear(1146, 262, 56, 46, 13)}"/><circle cx="1146" cy="262" r="16"/></g>
 <g class="spin rev"><path d="${gear(578, 92, 38, 30, 10)}"/><circle cx="578" cy="92" r="10"/></g>
 <path class="fine" d="M470 168H600l26 26H770M520 214H640l20 20h96M480 128H540"/>
 <circle cx="770" cy="194" r="3.5"/><circle cx="756" cy="234" r="3.5"/>
 <path class="fine" d="${cross(700, 60)}${cross(1180, 400)}${cross(540, 300)}"/>
 <rect x="820" y="410" width="210" height="26" rx="8"/>
 <rect x="884" y="150" width="82" height="260" rx="10"/>
 <path class="fine" d="M906 160v240M944 160v240"/>
 <rect x="730" y="196" width="230" height="52" rx="26"/>
 <circle cx="925" cy="222" r="18"/><circle cx="925" cy="222" r="6"/>
 <circle cx="756" cy="222" r="16"/><circle cx="756" cy="222" r="5"/>
 <g transform="translate(756 222) rotate(128)"><rect x="-22" y="-19" width="236" height="38" rx="19"/><circle r="9"/><circle cx="214" r="9"/></g>
 <path d="M624 400v42M604 442h40M608 442v24M640 442v24"/>
 <path class="dash" d="M700 222H990M925 120V452M560 480H1100"/>
 <path class="fine" d="M696 222A60 60 0 0 0 719 269"/>
 <path class="fine" d="M624 496v26M925 496v26M624 509H925M624 509l9-4.5v9zM925 509l-9-4.5v9z"/>
 <path class="fine" d="M1012 150v260M1002 150h20M1002 410h20"/>
</g>
<g class="sk">
 <path d="M470 ${B}H1200"/>
 ${towers.map(t => `<path d="${tower(t[0], t[1], t[2], B)}"/>`).join('')}
 ${palms.map(p => `<path class="palm" d="${palm(p[0], p[1], p[2])}"/>`).join('')}
</g>
</svg>`;
}

/* ---------- shared components ---------- */
const img = (src, t, label, pos) => { const s = safeImg(src); return `<div class="ph phd"><span>${esc(label || t)}</span></div>${s ? `<img class="ph" data-fb src="${esc(s)}" alt="${esc(t)}" loading="lazy" decoding="async"${pos ? ` style="object-position:${esc(String(pos).replace(/[^0-9% .-]/g, ''))}"` : ''}>` : ''}`; };
const arrow = (label, href, cls = '') => `<a class="pill ${cls}" href="${esc(safeUrl(href))}">${label}<em>&#8594;</em></a>`;

const socials = (cls = '') => `<div class="soc"><a class="ib ${cls}" href="${esc(safeUrl(SITE.github))}" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" title="GitHub">${ICON.gh}</a><a class="ib ${cls}" href="${esc(safeUrl(SITE.linkedin))}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" title="LinkedIn">${ICON.li}</a></div>`;

const logo = () => { const p = String(SITE.name || '').split(' '); return `<a class="logo" href="#/" aria-label="${esc(SITE.name)}, home"><span>${esc(p[0])}</span><span>${esc(p.slice(1).join(' '))}</span></a>`; };

const nav = page => `<nav>${logo()}<div class="navr"><div class="links">
<a class="${page === 'home' ? 'on' : ''}" href="#/">Home</a><a href="#/about" data-about>About</a><a class="${page === 'projects' ? 'on' : ''}" href="#/projects">Projects</a>${SITE.location ? `<span class="loc"><i></i>${esc(SITE.location)}</span>` : ''}</div>
${socials()}<span class="navcta">${arrow('Get in touch', mail)}</span>
<button class="ib st menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mpanel" data-menu>${ICON.menu}</button></div>
<div class="mpanel" id="mpanel"><a href="#/">Home</a><a href="#/about" data-about>About</a><a href="#/projects">Projects</a><a class="mc" href="${esc(safeUrl(mail))}">Get in touch</a></div></nav>`;

const card = (p, i) => `<a class="card reveal" style="transition-delay:${(i % 3) * 90}ms" href="#/projects/${esc(p.id)}">
<div class="thumb">${img(p.thumbnail, p.title, p.short)}<span class="chip">${esc(p.category)}</span></div>
<div class="b"><div class="meta mono"><span>${esc(p.year)}</span><span class="view">View project &#8594;</span></div><h3>${esc(p.title)}</h3>
<p class="mu">${esc(p.tagline)}</p><div class="tags">${(p.tags || []).slice(0, 4).map(t => `<span>${esc(t)}</span>`).join('')}</div></div></a>`;

const foot = () => `<section class="cta reveal"><span class="k">Let's connect</span><h2>Have a machine that<br>needs building?</h2>${arrow('Email me', mail, 'g')}${socials('lg')}</section>
<footer class="wrap"><span data-secret>&copy; ${new Date().getFullYear()} ${esc(SITE.name)}${SITE.location ? ' &middot; ' + esc(SITE.location) : ''}</span><span class="fl"><a href="${esc(safeUrl(SITE.github))}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="${esc(safeUrl(SITE.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a></span></footer>`;

const cvBtns = () => `<div class="cvb">${(SITE.cv || []).map(c => `<a class="pill o" href="${esc(safeUrl(c.file))}" download="${esc(basename(c.file))}">${esc(c.label)}<em>&#8595;</em></a>`).join('')}</div>`;
const statsRow = () => `<div class="stats">${(C.stats || []).map((s, i) => `<div class="reveal" style="transition-delay:${i * 80}ms"><b>${esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join('')}</div>`;
const it = (t, s, d, pts) => `<div class="it reveal"><div class="meta"><b>${esc(t)}</b><span>${esc(d)}</span></div><p class="mu">${esc(s)}</p>${pts?.length ? `<ul>${pts.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
const grp = (h, body) => body ? `<div class="cols"><h3 class="reveal">${h}</h3><div>${body}</div></div>` : '';

/* ---------- pages ---------- */
function home() {
  const role = String(SITE.role || '').split(' ');
  const fan = DATA.slice(0, 8), mid = (fan.length - 1) / 2;
  return `<header class="hero" data-spot>${SITE.heroArt ? heroArt() : ''}<div class="spot"></div>
<div class="wrap wide hin">${nav('home')}
<div class="heroBody"><div><p class="hi">${esc(SITE.hello)}</p><h1><span>${esc(role[0])}</span><span class="grad">${esc(role.slice(1).join(' '))}</span></h1></div>
<aside><h3>${esc(SITE.pitch)}</h3><p class="mu">${esc(SITE.sub)}</p></aside></div>
<div class="pillars">${(SITE.pillars || []).map((p, i) => `<div><b>#0${i + 1}</b><br>${esc(p)}</div>`).join('')}</div></div></header>
<div class="wrap"><div class="strip"><small>Built with tools I ship with</small><ul>${(SITE.stack || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></div>
<section class="wrap fanWrap"><span class="k reveal">Selected work</span><h2 class="reveal">Curious what else I've built?</h2>
<div class="fan">${fan.map((p, i) => { const o = i - mid; return `<a class="reveal" href="#/projects/${esc(p.id)}" style="transform:rotateY(${-o * 11}deg) translateY(${Math.abs(o) * 14}px)">${img(p.thumbnail, p.title, p.short)}<em>${esc(p.short || p.title)}</em></a>`; }).join('')}</div>
${arrow('See all projects', '#/projects')}</section>
<section class="wrap sec"><h2 class="reveal" style="margin-bottom:40px">Featured projects</h2><div class="grid">${DATA.slice(0, 3).map(card).join('')}</div></section>
<section class="wrap sec" id="about"><div class="cols" style="border:0;padding:0"><div><span class="k reveal">About</span><h2 class="reveal">${esc(SITE.aboutTitle)}</h2></div><div><p class="reveal" style="font-size:clamp(17px,1.5vw,20px)">${esc(SITE.summary)}</p>${cvBtns()}</div></div>
${statsRow()}
<div class="skills">${(C.skills || []).map((g, i) => `<div class="reveal" style="transition-delay:${i * 70}ms"><h3>${esc(g.group)}</h3><div class="tags">${(g.items || []).map(x => `<span>${esc(x)}</span>`).join('')}</div></div>`).join('')}</div></section>
<section class="wrap sec"><span class="k reveal">Career</span><h2 class="reveal" style="margin-bottom:24px">Background</h2>
${grp('Experience', (C.experience || []).map(e => it(e.role, e.company + (e.place ? ', ' + e.place : ''), e.period, e.points)).join(''))}
${grp('Education', (C.education || []).map(e => it(e.degree, e.school, e.period)).join(''))}
${grp('Certifications', (C.certifications || []).map(e => it(e.title, e.issuer, e.date)).join(''))}
${grp('Languages', (C.languages || []).map(e => it(e.name, e.level, '')).join(''))}</section>${foot()}`;
}

function archive(cat = 'All') {
  const cats = ['All', ...new Set(DATA.map(p => p.category))];
  return `<header class="hero" style="min-height:0"><div class="wrap wide">${nav('projects')}<span class="k reveal" style="margin-top:clamp(36px,6vw,64px)">Selected work</span><h1 class="reveal" style="font-size:clamp(56px,10vw,132px)">Projects</h1>
<p class="mu reveal" style="max-width:52ch;margin-top:20px">Robots, aircraft, and control systems, from first CAD sketch to bench and flight test.</p></div></header>
<section class="wrap"><div class="filters" role="group" aria-label="Filter by category">${cats.map(c => `<button type="button" class="${c === cat ? 'on' : ''}" aria-pressed="${c === cat}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
<div class="grid">${DATA.filter(p => cat === 'All' || p.category === cat).map(card).join('')}</div></section><div style="height:clamp(56px,8vw,96px)"></div>${foot()}`;
}

function detail(id) {
  const i = DATA.findIndex(p => p.id === id), p = DATA[i];
  if (!p) return `<div class="wrap wide">${nav('projects')}<h2 style="margin:80px 0 24px">Project not found</h2>${arrow('Back to projects', '#/projects')}</div>`;
  GAL = (p.gallery || []).map(safeImg).filter(Boolean);
  const prev = DATA[(i - 1 + DATA.length) % DATA.length], next = DATA[(i + 1) % DATA.length];
  const links = [['GitHub', p.githubUrl], ['Demo video', p.videoUrl], ['CAD files', p.cadUrl]].filter(l => l[1]).map(l => `<a href="${esc(safeUrl(l[1]))}" target="_blank" rel="noopener noreferrer">${l[0]}</a>`).join('') || '<span class="mu">Coming soon</span>';
  const sec = (h, body) => body ? `<div class="cols"><h3 class="reveal">${h}</h3><div>${body}</div></div>` : '';
  return `<div class="cover">${img(p.cover || p.thumbnail, p.title, p.short, p.coverPos)}<div class="wrap wide navwrap">${nav('projects')}</div>
<div class="ttl wrap wide"><span class="k">${esc(p.category)}</span><h1 style="font-size:clamp(42px,8vw,108px)">${esc(p.title)}</h1></div></div>
<main class="wrap"><p class="mu" style="font-size:clamp(18px,1.6vw,22px);max-width:60ch;margin-top:32px">${esc(p.tagline)}</p>
<div class="bar"><div><small>Timeline</small>${esc(p.timeline || p.year)}</div><div><small>Role</small>${esc(p.role || '—')}</div><div><small>Stack</small>${esc((p.tags || []).join(', '))}</div><div><small>Links</small>${links}</div></div>
${sec('Overview', `<p>${esc(p.summary)}</p>`)}
${sec('Key features', p.features?.length ? `<ul>${p.features.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '')}
${sec('System architecture', p.architecture ? `<p>${esc(p.architecture)}</p>` : '')}
${sec('Results', (p.results ? `<p style="margin-bottom:24px">${esc(p.results)}</p>` : '') + (p.metrics?.length ? `<div class="metrics">${p.metrics.map(m => `<div><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>` : ''))}
${GAL.length ? `<div class="cols"><h3 class="reveal">Gallery</h3><div class="gal">${GAL.map((g, gi) => `<button type="button" class="reveal" style="transition-delay:${(gi % 3) * 80}ms" data-gi="${gi}" aria-label="Enlarge image ${gi + 1} of ${GAL.length}">${img(g, p.title)}</button>`).join('')}</div></div>` : ''}
<div class="pn"><a href="#/projects/${esc(prev.id)}"><small class="mu">&#8592; Previous</small><h3>${esc(prev.title)}</h3></a><a href="#/projects/${esc(next.id)}"><small class="mu">Next &#8594;</small><h3>${esc(next.title)}</h3></a></div></main>${foot()}`;
}

/* ---------- routing ---------- */
const isHome = () => !location.hash || location.hash === '#/' || location.hash.startsWith('#/about');
function go(id) { document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
function render() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  let toAbout = false;
  if (h[0] === 'about') { app.innerHTML = home(); document.title = SITE.name + ' | About'; toAbout = true; }
  else if (h[0] === 'projects' && h[1]) { const id = decodeURIComponent(h[1]); app.innerHTML = detail(id); document.title = (DATA.find(p => p.id === id)?.title || 'Project') + ' | ' + SITE.name; }
  else if (h[0] === 'projects') { app.innerHTML = archive(); document.title = 'Projects | ' + SITE.name; }
  else { app.innerHTML = home(); document.title = SITE.name + ' | ' + SITE.role; }
  closeMenu();
  if (toAbout) setTimeout(() => go('about'), 60); else scrollTo(0, 0);
  afterRender();
}

let io;
function afterRender() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (REDUCED || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); }
  else {
    io = io || new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(e => io.observe(e));
  }
  const hero = document.querySelector('.hero[data-spot]');
  if (hero && !REDUCED && matchMedia('(hover:hover)').matches) hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true });
}

/* ---------- menu, sticky bar, lightbox ---------- */
function closeMenu() { document.querySelectorAll('.mpanel.open').forEach(m => m.classList.remove('open')); document.querySelectorAll('[data-menu]').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Open menu'); }); }
function renderStick() {
  $('#stick').innerHTML = `<div class="wrap wide stickin"><a class="logo" href="#/" aria-label="${esc(SITE.name)}, home">${esc(SITE.name)}</a><div class="navr"><div class="links"><a href="#/projects">Projects</a><a href="#/about" data-about>About</a></div>${socials()}<a class="ib st" href="${esc(safeUrl(mail))}" aria-label="Send an email" title="Email">${ICON.mail}</a></div></div>`;
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { $('#stick').classList.toggle('show', scrollY > 480); t = false; }); }, { passive: true });
}
function openLB() {
  if (!GAL.length) return;
  const im = $('#lb img'); im.src = GAL[LBI]; im.alt = 'Project image ' + (LBI + 1) + ' of ' + GAL.length;
  $('#lbCount').textContent = (LBI + 1) + ' / ' + GAL.length;
  document.querySelectorAll('[data-lbnav]').forEach(b => b.style.display = GAL.length > 1 ? 'grid' : 'none');
  $('#lb').classList.add('on'); $('#lbClose').focus();
}
function closeLB() { $('#lb').classList.remove('on'); }

let secretN = 0, secretT;
document.addEventListener('click', e => {
  const t = e.target;
  const f = t.closest('[data-c]');
  if (f) { const y = scrollY; app.innerHTML = archive(f.dataset.c); afterRender(); scrollTo(0, y); return; }
  const g = t.closest('[data-gi]'); if (g) { LBI = +g.dataset.gi; openLB(); return; }
  const n = t.closest('[data-lbnav]'); if (n) { LBI = (LBI + +n.dataset.lbnav + GAL.length) % GAL.length; openLB(); return; }
  if (t.id === 'lbClose' || t.id === 'lb' || t.closest('#lb img')) { closeLB(); return; }
  const m = t.closest('[data-menu]');
  if (m) { const p = m.closest('nav').querySelector('.mpanel'), open = !p.classList.contains('open'); p.classList.toggle('open', open); m.setAttribute('aria-expanded', open); m.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); return; }
  const ab = t.closest('[data-about]');
  if (ab) { closeMenu(); if (isHome()) { e.preventDefault(); history.replaceState(null, '', '#/about'); go('about'); } return; }
  if (t.closest('.mpanel a')) closeMenu();
  if (t.closest('[data-secret]')) { secretN++; clearTimeout(secretT); secretT = setTimeout(() => secretN = 0, 900); if (secretN >= 3) { secretN = 0; location.href = 'admin.html'; } }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
  if (!$('#lb').classList.contains('on')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') { LBI = (LBI - 1 + GAL.length) % GAL.length; openLB(); }
  if (e.key === 'ArrowRight') { LBI = (LBI + 1) % GAL.length; openLB(); }
});
/* broken images fall back to the gradient placeholder (no inline handlers, so CSP can stay strict) */
document.addEventListener('error', e => { const t = e.target; if (t && t.tagName === 'IMG' && t.hasAttribute('data-fb')) t.remove(); }, true);
addEventListener('hashchange', render);

/* ---------- boot ---------- */
let draft = null;
if (location.search.includes('preview')) try { draft = JSON.parse(localStorage.getItem('draft')); } catch (e) { }
(draft ? Promise.resolve(draft) : fetch('content.json', { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }))
  .then(c => { C = c; SITE = c.profile; DATA = c.projects || []; mail = 'mailto:' + SITE.email; renderStick(); render(); })
  .catch(() => { app.innerHTML = '<div class="wrap" style="padding:80px 0"><h2>Could not load content.json</h2><p class="mu" style="margin-top:16px">Serve this folder over HTTP (for example <code>python3 -m http.server</code>) or deploy it to GitHub Pages.</p></div>'; });
