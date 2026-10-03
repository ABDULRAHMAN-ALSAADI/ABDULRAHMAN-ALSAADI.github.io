'use strict';
/* Anti-clickjacking: never render inside someone else's frame */
if (top !== self) { try { top.location = self.location; } catch (e) { document.documentElement.hidden = true; } }

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s), app = $('#app');
let SITE = {}, C = {}, DATA = [], EXP = [], mail = '', GAL = [], LBI = 0;
let LANG = localStorage.getItem('portfolio-lang') === 'ar' ? 'ar' : 'en';
const UI = {
  en: {home:'Home', about:'About', projects:'Projects', contact:'Get in touch', viewProjects:'View projects', downloadResume:'Download resume', experience:'Experience', repositories:'Repositories', resumes:'Resume downloads', coreStack:'Core engineering stack', selectedWork:'Selected engineering work', featured:'Featured projects', featuredLead:'The projects that best show how I work from requirements and CAD through integration, manufacturing, and physical validation.', career:'Career', background:'Background', industry:'Industry Experience', education:'Education', certs:'Certifications & Memberships', languages:'Languages', moreWork:'More work', explore:'Explore additional engineering projects', allProjects:'See all projects', selected:'Selected work', archiveLead:'Robotic and electromechanical systems, from first CAD sketch to simulation, prototype, bench test, and flight test.', filter:'Filter by category', all:'All', timeline:'Timeline', role:'Role', stack:'Stack', links:'Links', github:'GitHub', demo:'Demo video', cad:'CAD files', coming:'Coming soon', overview:'Overview', features:'Key features', architecture:'System architecture', results:'Results', gallery:'Gallery', previous:'Previous', next:'Next', connect:'Let\'s connect', cta:'Building something that moves, thinks, or both?', email:'Email me', arabic:'العربية', english:'EN', top:'Back to top', learning:'Learning & Technical Exercises', viewProject:'View project', viewExperience:'View experience', experienceLead:'Industry experience and hands-on engineering work.', notFound:'Project not found', notFoundExperience:'Experience not found', backProjects:'Back to projects', backExperience:'Back to experience', moreItems:'more', openMenu:'Open menu', closeMenu:'Close menu', switchArabic:'Switch to Arabic', switchEnglish:'Switch to English', enlarge:'Enlarge', imageWord:'image', ofWord:'of', certificateWord:'certificate', musnadLabel:'Musnad-inspired mark', status:'Status', contribution:'My contribution'},
  ar: {home:'الرئيسية', about:'عني', projects:'المشاريع', contact:'تواصل معي', viewProjects:'استعرض المشاريع', downloadResume:'السيرة الذاتية', experience:'الخبرات', repositories:'مستودعات GitHub', resumes:'السير الذاتية', coreStack:'التقنيات والأدوات', selectedWork:'مختارات من أعمالي', featured:'مشاريع مختارة', featuredLead:'ثلاثة مشاريع تلخّص طريقتي في العمل: من المتطلبات والتصميم الهندسي إلى التصنيع والتكامل والتحقق العملي.', career:'المسيرة', background:'الخبرات والمؤهلات', industry:'الخبرة المهنية', education:'التعليم', certs:'الشهادات والعضويات المهنية', languages:'اللغات', moreWork:'مشاريع أخرى', explore:'مشاريع وتمارين هندسية إضافية', allProjects:'استعرض كل المشاريع', selected:'مختارات', archiveLead:'مشاريع روبوتية وكهروميكانيكية تبدأ من الفكرة والتصميم، وتمتد إلى المحاكاة والنماذج الأولية والاختبارات العملية.', filter:'تصفية المشاريع حسب المجال', all:'الكل', timeline:'الفترة', role:'الدور', stack:'التقنيات والأدوات', links:'الروابط', github:'GitHub', demo:'فيديو المشروع', cad:'ملفات CAD', coming:'قريبًا', overview:'عن المشروع', features:'أبرز ما عملت عليه', architecture:'بنية النظام', results:'النتائج والتحقق', gallery:'الصور', previous:'السابق', next:'التالي', connect:'لنتواصل', cta:'تعمل على شيء يتحرّك، يفكّر... أو يجمع بينهما؟', email:'راسلني', arabic:'العربية', english:'EN', top:'العودة إلى الأعلى', learning:'مشاريع تعلّم وتمارين تقنية', viewProject:'عرض المشروع', viewExperience:'عرض تفاصيل التدريب', experienceLead:'خبرة مهنية عملية جمعت بين التصميم الميكانيكي والبرمجة والتحكم وتكامل الأنظمة الروبوتية.', notFound:'المشروع غير موجود', notFoundExperience:'الخبرة غير موجودة', backProjects:'العودة إلى المشاريع', backExperience:'العودة إلى الخبرات', moreItems:'تقنيات إضافية', openMenu:'فتح القائمة', closeMenu:'إغلاق القائمة', switchArabic:'التبديل إلى العربية', switchEnglish:'التبديل إلى الإنجليزية', enlarge:'تكبير', imageWord:'الصورة', ofWord:'من', certificateWord:'الشهادة', musnadLabel:'لمسة مستوحاة من خط المسند', status:'الحالة', contribution:'مساهمتي'}
};
const T = k => UI[LANG][k] || UI.en[k] || k;
function applyLangMeta(){ document.documentElement.lang = LANG === 'ar' ? 'ar' : 'en'; document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr'; document.body.classList.toggle('rtl', LANG === 'ar'); const b = document.getElementById('toTop'); if (b) b.setAttribute('aria-label', T('top')); }
function toggleLang(){ LANG = LANG === 'en' ? 'ar' : 'en'; localStorage.setItem('portfolio-lang', LANG); loadContent(); }

/* ---------- safety helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = u => { u = String(u ?? '').trim(); return /^(https?:\/\/|mailto:|#)/i.test(u) || (/^[\w./-]+$/.test(u)) ? u : '#'; };
const safeImg = u => { u = String(u ?? '').trim(); return /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u) || /^https?:\/\//i.test(u) || /^[\w./-]+$/.test(u) ? u : ''; };
const safePdf = u => { u = String(u ?? '').trim(); return /^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/.test(u) || /^https?:\/\//i.test(u) || /^[\w./-]+$/.test(u) ? u : ''; };
const slugFile = s => String(s || 'file').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'file';
const basename = p => String(p || '').split('/').pop();

/* ---------- icons ---------- */
const CAT_HUE = { 'UAVs & Drones': 158, 'Robotic Arms & Manipulation': 189, 'Mechanical Design & FEA': 38, 'Computer Vision & AI': 268, 'Embedded Systems': 28, 'Learning & Technical Exercises': 210, 'الطائرات بدون طيار والأنظمة الذاتية':158, 'الطائرات المسيّرة والأنظمة ذاتية التشغيل':158, 'الأذرع الروبوتية والمناولة':189, 'التعلّم والتمارين التقنية':210, 'مشاريع تعلّم وتمارين تقنية':210 };
function accentOf(p) {
  const base = CAT_HUE[p.category] ?? 158;
  let h = 0; for (const c of String(p.id)) h = (h * 31 + c.charCodeAt(0)) % 360;
  const hue = (base + (h % 31) - 15 + 360) % 360;
  return { acc: `hsl(${hue} 72% 58%)`, soft: `hsla(${hue},72%,58%,.1)`, bd: `hsla(${hue},72%,58%,.32)`, glow: `hsla(${hue},72%,55%,.4)` };
}
const CAT_ICON = {
  'UAVs & Drones': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.6"/><path d="M9.5 9.5 5 5M14.5 9.5 19 5M9.5 14.5 5 19M14.5 14.5 19 19"/><circle cx="5" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="19" cy="19" r="1.6"/></svg>',
  'Robotic Arms & Manipulation': '<svg viewBox="0 0 24 24"><circle cx="5" cy="19" r="1.8"/><path d="M5 17V13l6-3 6 3v2"/><circle cx="17" cy="6" r="1.8"/><path d="M17 8v3"/><path d="M14 15h6"/></svg>',
  'Mechanical Design & FEA': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  'Computer Vision & AI': '<svg viewBox="0 0 24 24"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>',
  'Embedded Systems': '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>'
};
CAT_ICON['الطائرات بدون طيار والأنظمة الذاتية'] = CAT_ICON['UAVs & Drones'];
CAT_ICON['الطائرات المسيّرة والأنظمة ذاتية التشغيل'] = CAT_ICON['UAVs & Drones'];
CAT_ICON['الأذرع الروبوتية والمناولة'] = CAT_ICON['Robotic Arms & Manipulation'];
CAT_ICON['التعلّم والتمارين التقنية'] = CAT_ICON['Mechanical Design & FEA'];
CAT_ICON['مشاريع تعلّم وتمارين تقنية'] = CAT_ICON['Mechanical Design & FEA'];
CAT_ICON['Learning & Technical Exercises'] = CAT_ICON['Mechanical Design & FEA'];
const catIcon = cat => `<span class="catIcon">${CAT_ICON[cat] || CAT_ICON['Mechanical Design & FEA']}</span>`;
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

const socials = (cls = '') => `<div class="soc"><a class="ib ${cls}" href="${esc(safeUrl(SITE.github))}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">${ICON.gh}</a><a class="ib ${cls}" href="${esc(safeUrl(SITE.linkedin))}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">${ICON.li}</a></div>`;

const logo = () => { const p = String(SITE.name || '').trim().split(/\s+/); return `<a class="logo${LANG === 'ar' ? ' logoAr' : ''}" href="#/" aria-label="${esc(SITE.name)}, ${T('home')}"><span>${esc(p[0] || '')}</span><span>${esc(p.slice(1).join(' '))}</span></a>`; };

const langBtn = (compact = false) => `<button class="langBtn${compact ? ' compact' : ''}" type="button" data-lang aria-label="${LANG === 'en' ? T('switchArabic') : T('switchEnglish')}">${LANG === 'en' ? T('arabic') : T('english')}</button>`;
const nav = page => `<nav>${logo()}<div class="navr"><div class="links">
<a class="${page === 'home' ? 'on' : ''}" href="#/">${T('home')}</a><a href="#/about" data-about>${T('about')}</a><a class="${page === 'projects' ? 'on' : ''}" href="#/projects">${T('projects')}</a><a class="${page === 'experience' ? 'on' : ''}" href="#/experience">${T('experience')}</a>${SITE.location ? `<span class="loc"><i></i>${esc(SITE.location)}</span>` : ''}</div>
${socials()}${langBtn()}<span class="navcta">${arrow(T('contact'), mail)}</span>
<button class="ib st menuBtn" type="button" aria-label="${T('openMenu')}" aria-expanded="false" aria-controls="mpanel" data-menu>${ICON.menu}</button></div>
<div class="mpanel" id="mpanel"><a href="#/">${T('home')}</a><a href="#/about" data-about>${T('about')}</a><a href="#/projects">${T('projects')}</a><a href="#/experience">${T('experience')}</a>${langBtn(true)}<a class="mc" href="${esc(safeUrl(mail))}">${T('contact')}</a></div></nav>`;

const card = (p, i) => `<a class="card reveal" style="transition-delay:${(i % 3) * 90}ms" href="#/projects/${esc(p.id)}">
<div class="thumb">${img(p.thumbnail, p.title, p.short)}<span class="chip">${esc(p.category)}</span></div>
<div class="b"><div class="meta mono"><span>${esc(p.year)}</span><span class="view">${T('viewProject')} &#8594;</span></div>${p.status ? `<div class="state">${esc(p.status)}</div>` : ''}<h3>${esc(p.title)}</h3>
<p class="mu">${esc(p.tagline)}</p>${p.metrics?.length ? `<div class="cardMetrics">${p.metrics.slice(0, 2).map(m => `<span><b>${esc(m.value)}</b><small>${esc(m.label)}</small></span>`).join('')}</div>` : ''}<div class="tags">${(p.tags || []).slice(0, 4).map(t => `<span>${esc(t)}</span>`).join('')}</div></div></a>`;

const foot = () => `<section class="cta reveal"><span class="k">${T('connect')}</span><h2>${T('cta')}</h2>${arrow(T('email'), mail, 'g')}${socials('lg')}</section>
<footer class="wrap"><span class="footerIdentity"><span class="musnadMark" title="${T('musnadLabel')}" aria-label="${T('musnadLabel')}">𐩧𐩥𐩨𐩥𐩩</span><span data-secret>&copy; ${new Date().getFullYear()} ${esc(SITE.name)}${SITE.location ? ' &middot; ' + esc(SITE.location) : ''}</span></span><span class="fl"><a href="${esc(safeUrl(SITE.github))}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="${esc(safeUrl(SITE.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a></span></footer>`;

const cvBtns = () => `<div class="cvb">${(SITE.cv || []).filter(c => c.file).map(c => `<a class="pill o" href="${esc(safePdf(c.file))}" download="${esc(c.file.startsWith('data:') ? slugFile(c.label) + '.pdf' : basename(c.file))}">${esc(c.label)}<em>&#8595;</em></a>`).join('')}</div>`;
const statsRow = () => `<div class="stats">${(C.stats || []).map((s, i) => `<div class="reveal" style="transition-delay:${i * 80}ms"><b>${esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join('')}</div>`;
const it = (t, s, d, pts) => `<div class="it reveal"><div class="meta"><b>${esc(t)}</b><span>${esc(d)}</span></div><p class="mu">${esc(s)}</p>${pts?.length ? `<ul>${pts.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
const certCard = (c, i) => `<div class="certcard reveal" style="transition-delay:${(i % 4) * 70}ms"><button type="button" class="cthumb" ${c.image ? `data-lbsrc="${esc(safeImg(c.image))}"` : 'disabled aria-hidden="true" tabindex="-1"'} aria-label="${LANG === 'ar' ? T('enlarge') + ' ' + T('certificateWord') + ' ' + esc(c.title) : T('enlarge') + ' ' + esc(c.title) + ' ' + T('certificateWord')}" style="${c.image ? '' : 'cursor:default'}">${img(c.image, c.title, T('certificateWord'))}</button><div class="cb"><b>${esc(c.title)}</b><span class="mu">${esc(c.issuer)}</span>${c.date ? `<span class="cd">${esc(c.date)}</span>` : ''}</div></div>`;
const experienceListCard = (e, i) => `<a class="card reveal" style="transition-delay:${(i % 3) * 90}ms" href="#/experience/${esc(e.id)}">
<div class="thumb">${img(e.thumbnail || e.image, e.title || e.company, e.role)}<span class="chip">${esc(e.category || T('industry'))}</span></div>
<div class="b"><div class="meta mono"><span>${esc(e.year || e.period)}</span><span class="view">${T('viewExperience')} &#8594;</span></div>${e.status ? `<div class="state">${esc(e.status)}</div>` : ''}<h3>${esc(e.title || e.role)}</h3>
<p class="mu">${esc(e.tagline || e.company)}</p>${e.metrics?.length ? `<div class="cardMetrics">${e.metrics.slice(0, 2).map(m => `<span><b>${esc(m.value)}</b><small>${esc(m.label)}</small></span>`).join('')}</div>` : ''}<div class="tags">${(e.tags || []).slice(0, 4).map(t => `<span>${esc(t)}</span>`).join('')}</div></div></a>`;
const grp = (h, body) => body ? `<div class="cols"><h3 class="reveal">${h}</h3><div>${body}</div></div>` : '';
function richText(text) {
  const lines = String(text || '').split(/\r?\n/).map(l => l.replace(/^[\s\-\u2022\*\u2013\u2014]+/, '').trim()).filter(Boolean);
  if (!lines.length) return '';
  if (lines.length > 1) return `<ul>${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`;
  return `<p>${esc(lines[0])}</p>`;
}

function normalizeGallery(items, captions) {
  const caps = Array.isArray(captions) ? captions : [];
  return (Array.isArray(items) ? items : []).map((item, i) => {
    if (typeof item === 'string') return { src: safeImg(item), caption: caps[i] || '', pos: '' };
    const src = safeImg(item?.src || item?.image || '');
    return { src, caption: item?.caption || caps[i] || '', pos: item?.pos || item?.position || '' };
  }).filter(g => g.src);
}

/* ---------- pages ---------- */
function backgroundExperienceTeaser() {
  const e = EXP && EXP.length ? EXP[0] : null;
  if (!e) return '';
  const tags = (e.tags || []).slice(0, 5);
  return `<a class="backgroundExp reveal" href="#/experience/${esc(e.id)}" aria-label="${esc(T('viewExperience') + ': ' + (e.company || e.title || ''))}">
    <div class="backgroundExpTop"><span class="k">${T('industry')}</span><span class="backgroundExpArrow" aria-hidden="true">&#8599;</span></div>
    <div class="backgroundExpHead"><div><h3>${esc(e.company || e.title)}</h3><p class="backgroundExpRole">${esc(e.role || e.title || '')}</p></div><span class="backgroundExpPeriod">${esc(e.timeline || '')}</span></div>
    <p class="backgroundExpSummary">${esc(e.summary || e.tagline || '')}</p>
    ${tags.length ? `<div class="tags backgroundExpTags">${tags.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
    <span class="backgroundExpLink">${T('viewExperience')} <b aria-hidden="true">&#8594;</b></span>
  </a>`;
}

function home() {
  const role = String(SITE.role || '').split(' ');
  const featured = DATA.slice(0, 3);
  const more = DATA.slice(3, 8), mid = (more.length - 1) / 2;
  const primaryCv = (SITE.cv || []).find(c => /robot|mechatronics/i.test(c.label || '') && c.file) || (SITE.cv || []).find(c => c.file);
  const heroCv = (SITE.cv || []).some(c => c.file) ? `<a class="pill o" href="#/resume">${T('downloadResume')}<em>&#8595;</em></a>` : '';
  return `<header class="hero" data-spot>${SITE.heroArt ? heroArt() : ''}<div class="spot"></div>
<div class="wrap wide hin">${nav('home')}
<div class="heroBody"><div><p class="hi">${esc(SITE.hello)}</p><h1><span>${esc(role[0])}</span><span class="grad">${esc(role.slice(1).join(' '))}</span></h1></div>
<aside><span class="k heroK">${esc(SITE.location)}</span><h3>${esc(SITE.pitch)}</h3><p class="mu">${esc(SITE.sub)}</p><div class="heroActions">${arrow(T('viewProjects'), '#/projects', 'g')}${heroCv}</div></aside></div>
<div class="pillars">${(SITE.pillars || []).map((p, i) => `<div><b>#0${i + 1}</b><br>${esc(p)}</div>`).join('')}</div></div></header>
<div class="wrap"><div class="strip"><small>${T('coreStack')}</small><ul>${(SITE.stack || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></div>
<section class="wrap sec featured"><span class="k reveal">${T('selectedWork')}</span><h2 class="reveal" style="margin-bottom:14px">${T('featured')}</h2><p class="mu reveal sectionLead">${T('featuredLead')}</p><div class="grid featuredGrid">${featured.map(card).join('')}</div></section>
<section class="wrap sec" id="about"><div class="cols" style="border:0;padding:0"><div><span class="k reveal">${T('about')}</span><h2 class="reveal">${esc(SITE.aboutTitle)}</h2></div><div><p class="reveal" style="font-size:clamp(17px,1.5vw,20px)">${esc(SITE.summary)}</p><div id="resume" class="resumeAnchor"><span class="k resumeLabel">${T('resumes')}</span>${cvBtns()}</div></div></div>
${statsRow()}
<div class="skills">${(C.skills || []).map((g, i) => `<div class="reveal" style="transition-delay:${i * 70}ms"><h3>${esc(g.group)}</h3><div class="tags">${(g.items || []).map(x => `<span>${esc(x)}</span>`).join('')}</div></div>`).join('')}</div></section>
<section class="wrap sec backgroundSection"><span class="k reveal">${T('career')}</span><h2 class="reveal" style="margin-bottom:24px">${T('background')}</h2>
${backgroundExperienceTeaser()}
${grp(T('education'), (C.education || []).map(e => it(e.degree, e.school, e.period)).join(''))}
${(C.certifications || []).length ? `<div class="cols" style="grid-template-columns:1fr"><h3 class="reveal">${T('certs')}</h3><div class="certs">${(C.certifications || []).map(certCard).join('')}</div></div>` : ''}
${grp(T('languages'), (C.languages || []).map(e => it(e.name, e.level, '')).join(''))}</section>
${more.length ? `<section class="wrap fanWrap moreWork"><span class="k reveal">${T('moreWork')}</span><h2 class="reveal">${T('explore')}</h2><div class="fan">${more.map((p, i) => { const o = i - mid; return `<a class="reveal" href="#/projects/${esc(p.id)}" style="transform:rotateY(${-o * 11}deg) translateY(${Math.abs(o) * 14}px)">${img(p.thumbnail, p.title, p.short)}<em>${esc(p.short || p.title)}</em></a>`; }).join('')}</div>${arrow(T('allProjects'), '#/projects')}</section>` : ''}${foot()}`;
}
function archive(cat) {
  cat = cat || T('all');
  const cats = [T('all'), ...new Set(DATA.map(p => p.category))];
  return `<header class="hero" style="min-height:0"><div class="wrap wide">${nav('projects')}<span class="k reveal" style="margin-top:clamp(36px,6vw,64px)">${T('selected')}</span><h1 class="reveal" style="font-size:clamp(56px,10vw,132px)">${T('projects')}</h1>
<p class="mu reveal" style="max-width:52ch;margin-top:20px">${T('archiveLead')}</p></div></header>
<section class="wrap"><div class="filters" role="group" aria-label="${T('filter')}">${cats.map(c => `<button type="button" class="${c === cat ? 'on' : ''}" aria-pressed="${c === cat}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
<div class="grid">${DATA.filter(p => cat === T('all') || p.category === cat).map(card).join('')}</div></section><div style="height:clamp(56px,8vw,96px)"></div>${foot()}`;
}

function experienceArchive() {
  return `<header class="hero" style="min-height:0"><div class="wrap wide">${nav('experience')}<span class="k reveal" style="margin-top:clamp(36px,6vw,64px)">${T('industry')}</span><h1 class="reveal" style="font-size:clamp(56px,10vw,132px)">${T('experience')}</h1>
<p class="mu reveal" style="max-width:52ch;margin-top:20px">${T('experienceLead')}</p></div></header>
<section class="wrap"><div class="grid experienceArchiveGrid">${EXP.map(experienceListCard).join('')}</div></section><div style="height:clamp(56px,8vw,96px)"></div>${foot()}`;
}
function experienceDetail(id) {
  const e = EXP.find(x => x.id === id);
  if (!e) return `<div class="wrap wide">${nav('experience')}<h2 style="margin:80px 0 24px">${T('notFoundExperience')}</h2>${arrow(T('backExperience'), '#/experience')}</div>`;
  const GALI = normalizeGallery(e.gallery, e.galleryCaptions); GAL = GALI.map(g => g.src);
  const A = accentOf(e);
  const links = [[T('github'), e.githubUrl], [T('demo'), e.videoUrl], [T('cad'), e.cadUrl]].filter(l => l[1]).map(l => `<a href="${esc(safeUrl(l[1]))}" target="_blank" rel="noopener noreferrer">${l[0]}</a>`).join('') || `<span class="mu">${T('coming')}</span>`;
  const sec = (h, body) => body ? `<div class="cols"><h3 class="reveal">${h}</h3><div>${body}</div></div>` : '';
  const stackPreview = (e.tags || []).slice(0, 5).join(', ') + ((e.tags || []).length > 5 ? ` +${e.tags.length - 5} ${T('moreItems')}` : '');
  return `<div class="proj experienceDetail" style="--acc:${A.acc};--acc-soft:${A.soft};--acc-bd:${A.bd};--acc-glow:${A.glow}">
<div class="cover">${img(e.cover || e.thumbnail || e.image, e.title || e.company, e.role)}<div class="wrap wide navwrap">${nav('experience')}</div>
<div class="ttl wrap wide"><span class="k">${esc(e.category || T('industry'))}</span><h1 style="font-size:clamp(42px,8vw,108px)">${esc(e.title || e.role)}</h1></div></div>
<main class="wrap"><p class="mu" style="font-size:clamp(18px,1.6vw,22px);max-width:60ch;margin-top:32px">${esc(e.tagline || e.company)}</p>${e.status ? `<div class="statusWrap"><span class="statusBadge">${esc(e.status)}</span></div>` : ''}
<div class="bar"><div><small>${T('timeline')}</small>${esc(e.timeline || e.period || e.year)}</div><div><small>${T('role')}</small>${esc(e.role || '—')}</div><div><small>${T('stack')}</small>${esc(stackPreview)}</div><div><small>${T('links')}</small>${links}</div></div>
${(e.tags || []).length > 5 ? `<div class="cloud">${e.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
${sec(T('overview'), richText(e.summary))}
${sec(T('contribution'), e.contribution?.length ? `<ul>${e.contribution.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : richText(e.contribution))}
${sec(T('features'), e.features?.length ? `<ul>${e.features.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : (e.points?.length ? `<ul>${e.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''))}
${sec(T('architecture'), richText(e.architecture))}
${sec(T('results'), richText(e.results) + (e.metrics?.length ? `<div class="metrics" style="margin-top:${e.results ? '24px' : '0'}">${e.metrics.map(m => `<div><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>` : ''))}
${GALI.length ? `<div class="cols" style="grid-template-columns:1fr"><h3 class="reveal">${T('gallery')}</h3><div class="gal">${GALI.map((g, gi) => `<figure class="gitem reveal" style="transition-delay:${(gi % 3) * 80}ms"><button type="button" data-gi="${gi}" aria-label="${T('enlarge')} ${T('imageWord')} ${gi + 1} ${T('ofWord')} ${GALI.length}">${img(g.src, e.company || e.title, '', g.pos)}</button>${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('')}</div></div>` : ''}
<div class="pn" style="grid-template-columns:1fr"><a href="#/experience"><small class="mu">&#8592; ${T('backExperience')}</small><h3>${T('experience')}</h3></a></div></main>${foot()}</div>`;
}

function detail(id) {
  const i = DATA.findIndex(p => p.id === id), p = DATA[i];
  if (!p) return `<div class="wrap wide">${nav('projects')}<h2 style="margin:80px 0 24px">${T('notFound')}</h2>${arrow(T('backProjects'), '#/projects')}</div>`;
  const GALI = normalizeGallery(p.gallery, p.galleryCaptions); GAL = GALI.map(g => g.src);
  const A = accentOf(p);
  const prev = DATA[(i - 1 + DATA.length) % DATA.length], next = DATA[(i + 1) % DATA.length];
  const links = [[T('github'), p.githubUrl], [T('demo'), p.videoUrl], [T('cad'), p.cadUrl]].filter(l => l[1]).map(l => `<a href="${esc(safeUrl(l[1]))}" target="_blank" rel="noopener noreferrer">${l[0]}</a>`).join('') || `<span class="mu">${T('coming')}</span>`;
  const sec = (h, body) => body ? `<div class="cols"><h3 class="reveal">${h}</h3><div>${body}</div></div>` : '';
  const stackPreview = (p.tags || []).slice(0, 5).join(', ') + ((p.tags || []).length > 5 ? ` +${p.tags.length - 5} ${T('moreItems')}` : '');
  return `<div class="proj" style="--acc:${A.acc};--acc-soft:${A.soft};--acc-bd:${A.bd};--acc-glow:${A.glow}">
<div class="cover">${img(p.cover || p.thumbnail, p.title, p.short, p.coverPos)}<div class="wrap wide navwrap">${nav('projects')}</div>
<div class="ttl wrap wide"><span class="k">${catIcon(p.category)}${esc(p.category)}</span><h1 style="font-size:clamp(42px,8vw,108px)">${esc(p.title)}</h1></div></div>
<main class="wrap"><p class="mu" style="font-size:clamp(18px,1.6vw,22px);max-width:60ch;margin-top:32px">${esc(p.tagline)}</p>${p.status ? `<div class="statusWrap"><span class="statusBadge">${esc(p.status)}</span></div>` : ''}
<div class="bar"><div><small>${T('timeline')}</small>${esc(p.timeline || p.year)}</div><div><small>${T('role')}</small>${esc(p.role || '—')}</div><div><small>${T('stack')}</small>${esc(stackPreview)}</div><div><small>${T('links')}</small>${links}</div></div>
${(p.tags || []).length > 5 ? `<div class="cloud">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
${sec(T('overview'), richText(p.summary))}
${sec(T('contribution'), p.contribution?.length ? `<ul>${p.contribution.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : richText(p.contribution))}
${sec(T('features'), p.features?.length ? `<ul>${p.features.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '')}
${sec(T('architecture'), richText(p.architecture))}
${sec(T('results'), richText(p.results) + (p.metrics?.length ? `<div class="metrics" style="margin-top:${p.results ? '24px' : '0'}">${p.metrics.map(m => `<div><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>` : ''))}
${GALI.length ? `<div class="cols" style="grid-template-columns:1fr"><h3 class="reveal">${T('gallery')}</h3><div class="gal">${GALI.map((g, gi) => `<figure class="gitem reveal" style="transition-delay:${(gi % 3) * 80}ms"><button type="button" data-gi="${gi}" aria-label="${T('enlarge')} ${T('imageWord')} ${gi + 1} ${T('ofWord')} ${GALI.length}">${img(g.src, p.title, '', g.pos)}</button>${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('')}</div></div>` : ''}
<div class="pn"><a href="#/projects/${esc(prev.id)}"><small class="mu">&#8592; ${T('previous')}</small><h3>${esc(prev.title)}</h3></a><a href="#/projects/${esc(next.id)}"><small class="mu">${T('next')} &#8594;</small><h3>${esc(next.title)}</h3></a></div></main>${foot()}</div>`;
}

/* ---------- routing ---------- */
const isHome = () => !location.hash || location.hash === '#/' || location.hash.startsWith('#/about') || location.hash.startsWith('#/resume');
function go(id) { document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
function render() {
  applyLangMeta();
  const h = location.hash.replace(/^#\/?/, '').split('/');
  let scrollTarget = '';
  if (h[0] === 'about') { app.innerHTML = home(); document.title = SITE.name + ' | ' + T('about'); scrollTarget = 'about'; }
  else if (h[0] === 'resume') { app.innerHTML = home(); document.title = SITE.name + ' | ' + T('downloadResume'); scrollTarget = 'resume'; }
  else if (h[0] === 'experience' && h[1]) { const id = decodeURIComponent(h[1]); app.innerHTML = experienceDetail(id); document.title = (EXP.find(e => e.id === id)?.title || T('experience')) + ' | ' + SITE.name; }
  else if (h[0] === 'experience') { app.innerHTML = experienceArchive(); document.title = T('experience') + ' | ' + SITE.name; }
  else if (h[0] === 'projects' && h[1]) { const id = decodeURIComponent(h[1]); app.innerHTML = detail(id); document.title = (DATA.find(p => p.id === id)?.title || 'Project') + ' | ' + SITE.name; }
  else if (h[0] === 'projects') { app.innerHTML = archive(); document.title = T('projects') + ' | ' + SITE.name; }
  else { app.innerHTML = home(); document.title = SITE.name + ' | ' + SITE.role; }
  closeMenu();
  if (scrollTarget) setTimeout(() => go(scrollTarget), 60); else scrollTo(0, 0);
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
function closeMenu() { document.querySelectorAll('.mpanel.open').forEach(m => m.classList.remove('open')); document.querySelectorAll('[data-menu]').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', T('openMenu')); }); }
function renderStick() {
  $('#stick').innerHTML = `<div class="wrap wide stickin">${logo()}<div class="navr"><div class="links"><a href="#/projects">${T('projects')}</a><a href="#/experience">${T('experience')}</a><a href="#/about" data-about>${T('about')}</a></div>${socials()}${langBtn(true)}<a class="ib st" href="${esc(safeUrl(mail))}" aria-label="${T('email')}" title="${T('email')}">${ICON.mail}</a></div></div>`;
  let t = false;
  addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { $('#stick').classList.toggle('show', scrollY > 480); t = false; }); }, { passive: true });
}
function openLB() {
  if (!GAL.length) return;
  const im = $('#lb img'); im.src = GAL[LBI]; im.alt = T('imageWord') + ' ' + (LBI + 1) + ' ' + T('ofWord') + ' ' + GAL.length;
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
  const ls = t.closest('[data-lbsrc]'); if (ls && !ls.disabled) { GAL = [ls.dataset.lbsrc]; LBI = 0; openLB(); return; }
  const n = t.closest('[data-lbnav]'); if (n) { LBI = (LBI + +n.dataset.lbnav + GAL.length) % GAL.length; openLB(); return; }
  if (t.id === 'lbClose' || t.id === 'lb' || t.closest('#lb img')) { closeLB(); return; }
  const lb = t.closest('[data-lang]'); if (lb) { toggleLang(); return; }
  const m = t.closest('[data-menu]');
  if (m) { const p = m.closest('nav').querySelector('.mpanel'), open = !p.classList.contains('open'); p.classList.toggle('open', open); m.setAttribute('aria-expanded', open); m.setAttribute('aria-label', open ? T('closeMenu') : T('openMenu')); return; }
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

/* back-to-top control */
const toTop = document.getElementById('toTop');
if (toTop) {
  const syncTop = () => toTop.classList.toggle('show', scrollY > 760);
  addEventListener('scroll', syncTop, { passive: true });
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));
  syncTop();
}

/* ---------- boot ---------- */
let draft = null;
if (location.search.includes('preview')) try { draft = JSON.parse(localStorage.getItem('draft')); } catch (e) { }
function loadContent(){
  const source = draft ? Promise.resolve(draft) : fetch(LANG === 'ar' ? 'content.ar.json' : 'content.json', { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  source.then(c => { C = c; SITE = c.profile; DATA = c.projects || []; EXP = c.experience || []; mail = 'mailto:' + SITE.email; applyLangMeta(); renderStick(); render(); })
    .catch(() => { app.innerHTML = `<div class="wrap" style="padding:80px 0"><h2>Could not load portfolio content</h2></div>`; });
}
loadContent();
