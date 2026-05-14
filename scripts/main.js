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

// Bridge Lenis into GSAP's RAF
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Bridge Lenis scroll position to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

/* ═══════════════════════════════════════════
   LIVE CLOCK
═══════════════════════════════════════════ */
const heroTime = document.getElementById('hero-time');
const updateClock = () => {
  if (heroTime) heroTime.textContent =
    new Date().toLocaleTimeString('en-SG', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
};
updateClock();
setInterval(updateClock, 1000);

/* ═══════════════════════════════════════════
   CUSTOM CURSOR  —  lerp trailing ring
═══════════════════════════════════════════ */
const dot   = document.getElementById('cursor-dot');
const ring  = document.getElementById('cursor-ring');
const label = document.getElementById('cursor-label');

let mouse  = { x: window.innerWidth/2,  y: window.innerHeight/2 };
let ringXY = { x: window.innerWidth/2,  y: window.innerHeight/2 };
const LERP = 0.11;

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  gsap.set(dot, { x: mouse.x, y: mouse.y });
});

// Lerp ring with GSAP ticker
gsap.ticker.add(() => {
  ringXY.x += (mouse.x - ringXY.x) * LERP;
  ringXY.y += (mouse.y - ringXY.y) * LERP;
  gsap.set(ring, { x: ringXY.x, y: ringXY.y });
});

// Cursor hover state + label
function setCursorHover(text = '') {
  document.body.classList.add('cursor-hover');
  if (label) label.textContent = text;
}
function clearCursorHover() {
  document.body.classList.remove('cursor-hover');
  if (label) label.textContent = '';
}

// Project cards → "View"
document.querySelectorAll('.project-card').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover('View'));
  el.addEventListener('mouseleave', clearCursorHover);
});

// Links → "Go"
document.querySelectorAll('a, .pill-link').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover('→'));
  el.addEventListener('mouseleave', clearCursorHover);
});

// Skill tags → "Skill" (just expand, no text)
document.querySelectorAll('.skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover(''));
  el.addEventListener('mouseleave', clearCursorHover);
});

// Buttons → expand only
document.querySelectorAll('button, .cta-button').forEach(el => {
  el.addEventListener('mouseenter', () => setCursorHover(''));
  el.addEventListener('mouseleave', clearCursorHover);
});

// Click squish
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
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ═══════════════════════════════════════════
   TEXT LINE SPLITTER (no external lib)
   Wraps each line in .split-line > .split-line-inner
═══════════════════════════════════════════ */
function splitTextToLines(el) {
  const text = el.innerHTML;
  // Split on <br> tags
  const parts = text.split(/<br\s*\/?>/gi);
  el.innerHTML = parts.map(p =>
    `<span class="split-line"><span class="split-line-inner">${p}</span></span>`
  ).join('');
  return el.querySelectorAll('.split-line-inner');
}

/* ═══════════════════════════════════════════
   HERO ENTRANCE ANIMATION
═══════════════════════════════════════════ */
function initHero() {
  const tl = gsap.timeline({ delay: 0.2 });

  // Eyebrow
  tl.to('.hero-eyebrow', {
    opacity: 1, y: 0,
    duration: 0.8, ease: 'power3.out'
  }, 0.1);

  // Title lines — mask wipe-up
  const titleInners = document.querySelectorAll('.hero-title-line .split-line-inner');
  tl.to(titleInners, {
    y: '0%',
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.12
  }, 0.3);

  // Tagline
  tl.to('.hero-tagline', {
    opacity: 1,
    duration: 0.9, ease: 'power3.out'
  }, 0.85);

  // Meta + scroll indicator
  tl.to(['.hero-scroll-indicator', '.hero-meta'], {
    opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out'
  }, 1.1);

  // Scroll indicator bounce loop
  gsap.to('.scroll-arrow', {
    y: 8, opacity: 0.4,
    repeat: -1, yoyo: true,
    duration: 1.4, ease: 'sine.inOut',
    delay: 1.8
  });
}

// Prep hero title lines for mask animation
document.querySelectorAll('.hero-title-line').forEach(line => {
  const inner = line.querySelector('.split-line-inner') || line;
  if (!line.querySelector('.split-line-inner')) {
    const text = line.innerHTML;
    line.innerHTML = `<span class="split-line-inner">${text}</span>`;
  }
  gsap.set(line.querySelector('.split-line-inner'), { y: '110%' });
});

window.addEventListener('load', initHero);

/* ═══════════════════════════════════════════
   SECTION TITLE REVEALS (scroll-triggered mask)
═══════════════════════════════════════════ */
document.querySelectorAll('.section-title, .contact-title').forEach(el => {
  const lines = splitTextToLines(el);
  gsap.set(lines, { y: '110%' });

  ScrollTrigger.create({
    trigger: el,
    start: 'top 82%',
    onEnter: () => {
      gsap.to(lines, {
        y: '0%',
        duration: 1.0,
        ease: 'power4.out',
        stagger: 0.1
      });
    },
    once: true
  });
});

/* ═══════════════════════════════════════════
   SECTION NUMBERS  (fade + slide in)
═══════════════════════════════════════════ */
document.querySelectorAll('.section-number').forEach(el => {
  gsap.set(el, { opacity: 0, x: -12 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   ABOUT BIO TEXT — word/line reveal
═══════════════════════════════════════════ */
document.querySelectorAll('.about-lead, .about-body, .contact-body').forEach(el => {
  gsap.set(el, { opacity: 0, y: 28 });
  ScrollTrigger.create({
    trigger: el, start: 'top 82%',
    onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   CLIP-PATH REVEALS  (wipe-up effect)
   Used for: about photo, any .clip-reveal elements
═══════════════════════════════════════════ */
document.querySelectorAll('.about-photo-frame').forEach(el => {
  gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
  ScrollTrigger.create({
    trigger: el, start: 'top 80%',
    onEnter: () => gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.1, ease: 'power4.inOut'
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   ABOUT LINKS + FACTS (fade stagger)
═══════════════════════════════════════════ */
const aboutLinks = document.querySelector('.about-links');
const aboutFacts = document.querySelectorAll('.fact');

if (aboutLinks) {
  gsap.set(aboutLinks, { opacity: 0, y: 16 });
  ScrollTrigger.create({
    trigger: aboutLinks, start: 'top 85%',
    onEnter: () => gsap.to(aboutLinks, { opacity:1, y:0, duration:0.8, ease:'power3.out' }),
    once: true
  });
}

aboutFacts.forEach((fact, i) => {
  gsap.set(fact, { opacity: 0, x: 16 });
  ScrollTrigger.create({
    trigger: fact, start: 'top 88%',
    onEnter: () => gsap.to(fact, {
      opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.07
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   TIMELINE ITEMS — stagger reveal
═══════════════════════════════════════════ */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  ScrollTrigger.create({
    trigger: item, start: 'top 82%',
    onEnter: () => gsap.to(item, {
      opacity: 1, y: 0,
      duration: 0.85, ease: 'power3.out',
      delay: (i % 3) * 0.08   // relative stagger within sections
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   SKILL CATEGORIES — stagger
═══════════════════════════════════════════ */
document.querySelectorAll('.skill-category').forEach((cat, i) => {
  ScrollTrigger.create({
    trigger: cat, start: 'top 84%',
    onEnter: () => gsap.to(cat, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: i * 0.1
    }),
    once: true
  });
});

// Individual skill tags — pop in with stagger
document.querySelectorAll('.skill-category').forEach(cat => {
  const tags = cat.querySelectorAll('.skill-tag');
  gsap.set(tags, { opacity: 0, y: 14 });
  ScrollTrigger.create({
    trigger: cat, start: 'top 80%',
    onEnter: () => gsap.to(tags, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   PROJECT CARDS — clip-path wipe + stagger
═══════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach((card, i) => {
  gsap.set(card, { clipPath: 'inset(100% 0 0 0)', opacity: 1 });
  ScrollTrigger.create({
    trigger: card, start: 'top 85%',
    onEnter: () => gsap.to(card, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.95, ease: 'power4.inOut',
      delay: (i % 2) * 0.12
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   INTEREST ITEMS — stagger
═══════════════════════════════════════════ */
document.querySelectorAll('.interest-item').forEach((item, i) => {
  ScrollTrigger.create({
    trigger: item, start: 'top 84%',
    onEnter: () => gsap.to(item, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   CONTACT — eyebrow + cta
═══════════════════════════════════════════ */
const contactEyebrow = document.querySelector('.contact-eyebrow');
const ctaButton = document.querySelector('.cta-button');
const contactSocials = document.querySelector('.contact-socials');

[contactEyebrow, ctaButton, contactSocials].forEach((el, i) => {
  if (!el) return;
  gsap.set(el, { opacity: 0, y: 20 });
  ScrollTrigger.create({
    trigger: el, start: 'top 88%',
    onEnter: () => gsap.to(el, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: i * 0.12
    }),
    once: true
  });
});

/* ═══════════════════════════════════════════
   SCROLL VELOCITY SKEW (Floema signature)
═══════════════════════════════════════════ */
let skewSetter = gsap.quickSetter('.section', 'skewY', 'deg');
let clamp = gsap.utils.clamp(-2.5, 2.5);
let lastScrollTop = 0;
let velocity = 0;
let raf;

function updateSkew() {
  const scrollTop = lenis.scroll;
  velocity = (scrollTop - lastScrollTop) * 0.05;
  lastScrollTop = scrollTop;
  skewSetter(clamp(velocity));
  raf = requestAnimationFrame(updateSkew);
}
updateSkew();

// Ease back to 0 on scroll stop
lenis.on('scroll', () => {
  clearTimeout(window._skewReset);
  window._skewReset = setTimeout(() => {
    gsap.to('.section', {
      skewY: 0, duration: 0.8, ease: 'power3.out', overwrite: true
    });
  }, 180);
});

/* ═══════════════════════════════════════════
   NAVIGATION — scroll state + mobile toggle
═══════════════════════════════════════════ */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* Active nav highlight */
const sectionEls = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-38% 0px -55% 0px' });
sectionEls.forEach(s => sectionObs.observe(s));

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
