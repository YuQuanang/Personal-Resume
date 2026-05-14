'use strict';

/* ═══════════════════════════════════════════
   GSAP SETUP
═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   LENIS SMOOTH SCROLL  ←→  GSAP ticker
═══════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ═══════════════════════════════════════════
   PARALLAX BACKGROUND
   Shifts background-position-y 20% → 80% as page scrolls.
   Image is always cover-sized to viewport — can never "run out".
═══════════════════════════════════════════ */
const parallaxBg = document.getElementById('parallax-bg');
if (parallaxBg) {
  lenis.on('scroll', ({ scroll, limit }) => {
    // progress: 0 at top, 1 at bottom of page
    const progress = limit > 0 ? scroll / limit : 0;
    // shift focal point from 20% (top of image) to 80% (bottom of image)
    const bgY = 20 + progress * 60;
    parallaxBg.style.backgroundPositionY = bgY + '%';
  });
}

/* ═══════════════════════════════════════════
   LIVE CLOCK
═══════════════════════════════════════════ */
const heroTime = document.getElementById('hero-time');
const updateClock = () => {
  if (heroTime) heroTime.textContent =
    new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
updateClock();
setInterval(updateClock, 1000);

/* ═══════════════════════════════════════════
   CUSTOM CURSOR  —  lerp trailing ring
═══════════════════════════════════════════ */
const dot   = document.getElementById('cursor-dot');
const ring  = document.getElementById('cursor-ring');
const label = document.getElementById('cursor-label');

let mouse  = { x: window.innerWidth / 2,  y: window.innerHeight / 2 };
let ringXY = { x: window.innerWidth / 2,  y: window.innerHeight / 2 };
const LERP = 0.11;

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  gsap.set(dot, { x: mouse.x, y: mouse.y });
});
gsap.ticker.add(() => {
  ringXY.x += (mouse.x - ringXY.x) * LERP;
  ringXY.y += (mouse.y - ringXY.y) * LERP;
  gsap.set(ring, { x: ringXY.x, y: ringXY.y });
});

function setCursorHover(text = '') {
  document.body.classList.add('cursor-hover');
  if (label) label.textContent = text;
}
function clearCursorHover() {
  document.body.classList.remove('cursor-hover');
  if (label) label.textContent = '';
}

document.querySelectorAll('.project-card').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover('View'));
  el.addEventListener('mouseleave', clearCursorHover);
});
document.querySelectorAll('a, .pill-link').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover('→'));
  el.addEventListener('mouseleave', clearCursorHover);
});
document.querySelectorAll('.skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover(''));
  el.addEventListener('mouseleave', clearCursorHover);
});
document.querySelectorAll('button, .cta-button').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover(''));
  el.addEventListener('mouseleave', clearCursorHover);
});
document.addEventListener('mousedown', () => {
  document.body.classList.add('cursor-drag');
  gsap.to(ring, { scale: 0.75, duration: 0.2, ease: 'power2.out' });
});
document.addEventListener('mouseup', () => {
  document.body.classList.remove('cursor-drag');
  gsap.to(ring, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
});

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════ */
document.querySelectorAll('.cta-button, .nav-logo, .pill-link--accent').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) * 0.35;
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.35;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () =>
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
  );
});

/* ═══════════════════════════════════════════
   TEXT LINE SPLITTER
═══════════════════════════════════════════ */
function splitTextToLines(el) {
  const parts = el.innerHTML.split(/<br\s*\/?>/gi);
  el.innerHTML = parts.map(p =>
    `<span class="split-line"><span class="split-line-inner">${p}</span></span>`
  ).join('');
  return el.querySelectorAll('.split-line-inner');
}

/* ═══════════════════════════════════════════
   BIDIRECTIONAL SCROLL TRIGGER HELPER
   ─────────────────────────────────────────
   start: 'top bottom'    → trigger fires as element enters from bottom
                            AND when it fully exits at the bottom (onLeaveBack)
   end:   'bottom top'    → trigger fires when element is 100% gone at top (onLeave)
                            AND when it just re-enters from top (onEnterBack)
   This means reset only happens when element is FULLY off-screen.
═══════════════════════════════════════════ */
function bidir(triggerEl, {
  hiddenVars,
  visibleVars,
  resetVars,
  start = 'top bottom',
  end   = 'bottom top',
  targets,
}) {
  const els   = targets || triggerEl;
  const reset = resetVars || { ...hiddenVars, duration: undefined, delay: undefined, stagger: undefined };

  ScrollTrigger.create({
    trigger: triggerEl,
    start,
    end,
    onEnter:     () => gsap.to(els, { ...visibleVars }),
    onEnterBack: () => gsap.to(els, { ...visibleVars, delay: 0 }),
    onLeave:     () => gsap.set(els, reset),
    onLeaveBack: () => gsap.set(els, reset),
  });
}

/* ═══════════════════════════════════════════
   HERO ENTRANCE (one-shot on load)
═══════════════════════════════════════════ */
document.querySelectorAll('.hero-title-line').forEach(line => {
  if (!line.querySelector('.split-line-inner')) {
    line.innerHTML = `<span class="split-line-inner">${line.innerHTML}</span>`;
  }
  gsap.set(line.querySelector('.split-line-inner'), { y: '110%' });
});

function initHero() {
  const tl = gsap.timeline({ delay: 0.2 });
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1);
  tl.to(document.querySelectorAll('.hero-title-line .split-line-inner'),
    { y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.12 }, 0.3);
  tl.to('.hero-tagline', { opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.85);
  tl.to(['.hero-scroll-indicator', '.hero-meta'],
    { opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 1.1);
  gsap.to('.scroll-arrow',
    { y: 8, opacity: 0.4, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut', delay: 1.8 });
}
window.addEventListener('load', initHero);

/* ═══════════════════════════════════════════
   SECTION TITLE REVEALS — bidirectional mask
   start/end span full element so reset only
   happens when 100% off-screen
═══════════════════════════════════════════ */
document.querySelectorAll('.section-title, .contact-title').forEach(el => {
  const lines = splitTextToLines(el);
  gsap.set(lines, { y: '110%' });

  ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',    // element enters from bottom of viewport
    end:   'bottom top',    // element fully exits at top of viewport
    onEnter:     () => gsap.to(lines, { y: '0%', duration: 1.0, ease: 'power4.out', stagger: 0.1 }),
    onEnterBack: () => gsap.to(lines, { y: '0%', duration: 1.0, ease: 'power4.out', stagger: 0.1 }),
    onLeave:     () => gsap.set(lines, { y: '110%' }),
    onLeaveBack: () => gsap.set(lines, { y: '110%' }),
  });
});

/* ═══════════════════════════════════════════
   SECTION NUMBERS — bidirectional
═══════════════════════════════════════════ */
document.querySelectorAll('.section-number').forEach(el => {
  gsap.set(el, { opacity: 0, x: -32 });
  bidir(el, {
    hiddenVars:  { opacity: 0, x: -32 },
    visibleVars: { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
    resetVars:   { opacity: 0, x: -32 },
  });
});

/* ═══════════════════════════════════════════
   ABOUT — bio text, links, facts
═══════════════════════════════════════════ */
document.querySelectorAll('.about-lead, .about-body, .contact-body').forEach(el => {
  gsap.set(el, { opacity: 0, y: 32 });
  bidir(el, {
    hiddenVars:  { opacity: 0, y: 32 },
    visibleVars: { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
    resetVars:   { opacity: 0, y: 32 },
  });
});

const aboutLinks = document.querySelector('.about-links');
if (aboutLinks) {
  gsap.set(aboutLinks, { opacity: 0, y: 20 });
  bidir(aboutLinks, {
    hiddenVars:  { opacity: 0, y: 20 },
    visibleVars: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    resetVars:   { opacity: 0, y: 20 },
  });
}

document.querySelectorAll('.fact').forEach((fact, i) => {
  gsap.set(fact, { opacity: 0, x: 20 });
  bidir(fact, {
    hiddenVars:  { opacity: 0, x: 20 },
    visibleVars: { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.06 },
    resetVars:   { opacity: 0, x: 20 },
  });
});

/* ═══════════════════════════════════════════
   ABOUT PHOTO — clip-path wipe
═══════════════════════════════════════════ */
document.querySelectorAll('.about-photo-frame').forEach(el => {
  gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
  ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',
    end:   'bottom top',
    onEnter:     () => gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' }),
    onEnterBack: () => gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' }),
    onLeave:     () => gsap.set(el, { clipPath: 'inset(100% 0 0 0)' }),
    onLeaveBack: () => gsap.set(el, { clipPath: 'inset(100% 0 0 0)' }),
  });
});

/* ═══════════════════════════════════════════
   TIMELINE ITEMS — bidirectional stagger
═══════════════════════════════════════════ */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  gsap.set(item, { opacity: 0, y: 36 });
  ScrollTrigger.create({
    trigger: item,
    start: 'top bottom',
    end:   'bottom top',
    onEnter:     () => gsap.to(item, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: (i % 3) * 0.08 }),
    onEnterBack: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }),
    onLeave:     () => gsap.set(item, { opacity: 0, y: 36 }),
    onLeaveBack: () => gsap.set(item, { opacity: 0, y: 36 }),
  });
});

/* ═══════════════════════════════════════════
   SKILL CATEGORIES — bidirectional
═══════════════════════════════════════════ */
document.querySelectorAll('.skill-category').forEach((cat, i) => {
  gsap.set(cat, { opacity: 0, y: 28 });
  const tags = cat.querySelectorAll('.skill-tag');
  gsap.set(tags, { opacity: 0, y: 16 });

  ScrollTrigger.create({
    trigger: cat,
    start: 'top bottom',
    end:   'bottom top',
    onEnter: () => {
      gsap.to(cat,  { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out', delay: i * 0.08 });
      gsap.to(tags, { opacity: 1, y: 0, duration: 0.5,  ease: 'power3.out', stagger: 0.06, delay: i * 0.08 + 0.12 });
    },
    onEnterBack: () => {
      gsap.to(cat,  { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' });
      gsap.to(tags, { opacity: 1, y: 0, duration: 0.5,  ease: 'power3.out', stagger: 0.06, delay: 0.1 });
    },
    onLeave:     () => { gsap.set(cat, { opacity: 0, y: 28 }); gsap.set(tags, { opacity: 0, y: 16 }); },
    onLeaveBack: () => { gsap.set(cat, { opacity: 0, y: 28 }); gsap.set(tags, { opacity: 0, y: 16 }); },
  });
});

/* ═══════════════════════════════════════════
   PROJECT CARDS — bidirectional clip-path
═══════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach((card, i) => {
  gsap.set(card, { clipPath: 'inset(100% 0 0 0)', opacity: 1 });
  ScrollTrigger.create({
    trigger: card,
    start: 'top bottom',
    end:   'bottom top',
    onEnter:     () => gsap.to(card, { clipPath: 'inset(0% 0 0 0)', duration: 0.95, ease: 'power4.inOut', delay: (i % 3) * 0.1 }),
    onEnterBack: () => gsap.to(card, { clipPath: 'inset(0% 0 0 0)', duration: 0.95, ease: 'power4.inOut' }),
    onLeave:     () => gsap.set(card, { clipPath: 'inset(100% 0 0 0)' }),
    onLeaveBack: () => gsap.set(card, { clipPath: 'inset(100% 0 0 0)' }),
  });
});

/* ═══════════════════════════════════════════
   INTEREST ITEMS — bidirectional
═══════════════════════════════════════════ */
document.querySelectorAll('.interest-item').forEach((item, i) => {
  gsap.set(item, { opacity: 0, y: 28 });
  ScrollTrigger.create({
    trigger: item,
    start: 'top bottom',
    end:   'bottom top',
    onEnter:     () => gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.08 }),
    onEnterBack: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
    onLeave:     () => gsap.set(item, { opacity: 0, y: 28 }),
    onLeaveBack: () => gsap.set(item, { opacity: 0, y: 28 }),
  });
});

/* ═══════════════════════════════════════════
   CONTACT — eyebrow, cta, socials
═══════════════════════════════════════════ */
['.contact-eyebrow', '.cta-button', '.contact-socials'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  gsap.set(el, { opacity: 0, y: 24 });
  bidir(el, {
    hiddenVars:  { opacity: 0, y: 24 },
    visibleVars: { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: i * 0.1 },
    resetVars:   { opacity: 0, y: 24 },
  });
});

/* ═══════════════════════════════════════════
   SCROLL VELOCITY SKEW (Floema signature)
═══════════════════════════════════════════ */
let skewSetter  = gsap.quickSetter('.section', 'skewY', 'deg');
let clampSkew   = gsap.utils.clamp(-2.5, 2.5);
let lastScrollY = 0;

(function tick() {
  const velocity = (lenis.scroll - lastScrollY) * 0.05;
  lastScrollY = lenis.scroll;
  skewSetter(clampSkew(velocity));
  requestAnimationFrame(tick);
})();

lenis.on('scroll', () => {
  clearTimeout(window._skewReset);
  window._skewReset = setTimeout(() => {
    gsap.to('.section', { skewY: 0, duration: 0.8, ease: 'power3.out', overwrite: true });
  }, 160);
});

/* ═══════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════ */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

lenis.on('scroll', ({ scroll }) => nav.classList.toggle('scrolled', scroll > 60));

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  })
);

/* Active nav highlight */
const sectionEls = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navAnchors.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + id)
      );
    }
  });
}, { rootMargin: '-38% 0px -55% 0px' }).observe.bind(null);
sectionEls.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
        );
      }
    });
  }, { rootMargin: '-38% 0px -55% 0px' }).observe(s);
});

/* ═══════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (via Lenis)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.5 });
  });
});
