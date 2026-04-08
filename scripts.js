/* ═══════════════════════════════════════════════════
   OLED BLACK — Portfolio Interactions
   GSAP + ScrollTrigger powered animations
   ═══════════════════════════════════════════════════ */

// ── REGISTER GSAP PLUGINS ────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── REDUCED MOTION CHECK ─────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



// ── PAGE LOADER ──────────────────────────────────────
const loader = document.getElementById('loader');
const loaderName = document.getElementById('loader-name');
const loaderBar = document.getElementById('loader-bar');
const loaderCounter = document.getElementById('loader-counter');

if (loader && !prefersReducedMotion) {
  const loaderTl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          initScrollAnimations();
        }
      });
    }
  });

  // Animate loader name in
  loaderTl.to(loaderName, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  });

  // Animate progress bar
  loaderTl.to(loaderBar, {
    width: '100%',
    duration: 1.4,
    ease: 'power2.inOut',
    onUpdate: function () {
      const progress = Math.round(this.progress() * 100);
      if (loaderCounter) {
        loaderCounter.textContent = String(progress).padStart(3, '0');
      }
    }
  }, '-=0.2');

  // Hold briefly
  loaderTl.to({}, { duration: 0.3 });
} else {
  // Skip loader for reduced motion
  if (loader) loader.style.display = 'none';
  initScrollAnimations();
}

// ── SCROLL ANIMATIONS ────────────────────────────────
function initScrollAnimations() {
  // Reveal elements on scroll
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Hero title line-by-line animation
  const titleLines = document.querySelectorAll('.title-line');
  titleLines.forEach((line, i) => {
    gsap.from(line, {
      yPercent: 100,
      duration: 0.9,
      delay: 0.15 * i,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top 80%'
      }
    });
  });

  // Stat counter animations
  const statNums = document.querySelectorAll('.stat-num[data-count], .gh-num[data-count]');
  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      textContent: target,
      duration: 1.5,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate: function () {
        el.textContent = Math.round(parseFloat(el.textContent));
      }
    });
  });
}

// ── NAVIGATION ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Nav background on scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.borderBottomColor = 'var(--border-visible)';
    } else {
      navbar.style.borderBottomColor = 'var(--border)';
    }
  }, { passive: true });
}




// ── CONTRIBUTION GRID (hover → "CONSISTENCY") ───────
const contribGrid = document.getElementById('contrib-grid');
if (contribGrid) {
  const rows = 7;
  const cols = Math.min(52, Math.floor(window.innerWidth / 20));

  // 4×5 pixel font (each letter is 4 wide, 5 tall)
  const FONT = {
    C: [1,1,1,1, 1,0,0,0, 1,0,0,0, 1,0,0,0, 1,1,1,1],
    O: [1,1,1,1, 1,0,0,1, 1,0,0,1, 1,0,0,1, 1,1,1,1],
    N: [1,0,0,1, 1,1,0,1, 1,0,1,1, 1,0,0,1, 1,0,0,1],
    S: [1,1,1,1, 1,0,0,0, 1,1,1,1, 0,0,0,1, 1,1,1,1],
    I: [1,1,1,1, 0,1,1,0, 0,1,1,0, 0,1,1,0, 1,1,1,1],
    T: [1,1,1,1, 0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0],
    E: [1,1,1,1, 1,0,0,0, 1,1,1,0, 1,0,0,0, 1,1,1,1],
  };

  const word = 'CONSISTENT';
  const letterW = 4;
  const letterH = 5;
  const gap = 1;
  const textW = word.length * (letterW + gap) - gap;
  const offsetC = Math.max(0, Math.floor((cols - textW) / 2));
  const offsetR = Math.max(0, Math.floor((rows - letterH) / 2));

  // Build text bitmap
  const textMap = new Set();
  for (let li = 0; li < word.length; li++) {
    const glyph = FONT[word[li]];
    if (!glyph) continue;
    const startCol = offsetC + li * (letterW + gap);
    for (let gr = 0; gr < letterH; gr++) {
      for (let gc = 0; gc < letterW; gc++) {
        if (glyph[gr * letterW + gc]) {
          const r = offsetR + gr;
          const c = startCol + gc;
          if (r < rows && c < cols) textMap.add(r + ',' + c);
        }
      }
    }
  }

  // Random level generator
  function randLevel() {
    const r = Math.random();
    if (r > 0.85) return 'l4';
    if (r > 0.7) return 'l3';
    if (r > 0.5) return 'l2';
    if (r > 0.3) return 'l1';
    return '';
  }

  // Build grid
  const cellGrid = [];
  const origLevels = [];
  for (let r = 0; r < rows; r++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'contrib-row';
    cellGrid[r] = [];
    origLevels[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      const lvl = randLevel();
      cell.className = 'contrib-cell' + (lvl ? ' ' + lvl : '');
      rowEl.appendChild(cell);
      cellGrid[r][c] = cell;
      origLevels[r][c] = lvl;
    }
    contribGrid.appendChild(rowEl);
  }

  // Hover: rearrange into text
  let showingText = false;
  const gridWrap = contribGrid.closest('.contribution-grid') || contribGrid;

  gridWrap.addEventListener('mouseenter', function() {
    if (showingText) return;
    showingText = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = cellGrid[r][c];
        const inText = textMap.has(r + ',' + c);
        const target = inText ? 'contrib-cell l4' : 'contrib-cell';
        const d = Math.random() * 0.4;
        gsap.to(cell, { duration: 0.3, delay: d, onComplete: function() { cell.className = target; } });
      }
    }
  });

  gridWrap.addEventListener('mouseleave', function() {
    if (!showingText) return;
    showingText = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = cellGrid[r][c];
        const lvl = origLevels[r][c];
        const target = 'contrib-cell' + (lvl ? ' ' + lvl : '');
        const d = Math.random() * 0.4;
        gsap.to(cell, { duration: 0.3, delay: d, onComplete: function() { cell.className = target; } });
      }
    }
  });
}

// ── MARQUEE SPEED SYNC ───────────────────────────────
const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack) {
  const items = marqueeTrack.children;
  const halfCount = Math.floor(items.length / 2);

  const syncMarqueeSpeed = () => {
    // Calculate the width of the first half (original set)
    let totalWidth = 0;
    for (let i = 0; i < halfCount; i++) {
      totalWidth += items[i].offsetWidth;
    }
    const pixelsPerSecond = 80;
    const duration = totalWidth / pixelsPerSecond;
    marqueeTrack.style.animationDuration = duration + 's';
  };

  window.addEventListener('load', syncMarqueeSpeed);
  window.addEventListener('resize', syncMarqueeSpeed);
  syncMarqueeSpeed();
}

// ── CONTACT FORM → MAILTO ────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const subject = encodeURIComponent('Portfolio Contact from ' + name);
    const body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
    window.location.href = 'mailto:Kevin@WOMBO.ai?subject=' + subject + '&body=' + body;
  });
}
