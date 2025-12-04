const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const linkAnchors = document.querySelectorAll('.nav-links a');
const marqueeTrack = document.querySelector('.stack-marquee-track');
const marqueeGroup = document.querySelector('.stack-marquee-group');
const logo = document.querySelector('.logo');
const siteHeader = document.querySelector('.site-header');
const mobileNavQuery = window.matchMedia('(max-width: 900px)');
// hero marquee uses pure CSS animation, no JS needed

const keepNavExpandedOnMobile = () => {
  if (!siteHeader) return;
  if (mobileNavQuery.matches) {
    siteHeader.classList.remove('nav-collapsed');
    if (navLinks) navLinks.classList.remove('show');
  } else {
    if (navLinks) navLinks.classList.remove('show');
  }
};

// Ensure header starts expanded; constrain collapsing to desktop only
if (siteHeader) siteHeader.classList.remove('nav-collapsed');

keepNavExpandedOnMobile();
if (mobileNavQuery.addEventListener) {
  mobileNavQuery.addEventListener('change', keepNavExpandedOnMobile);
} else if (mobileNavQuery.addListener) {
  mobileNavQuery.addListener(keepNavExpandedOnMobile);
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    if (siteHeader) siteHeader.classList.remove('nav-collapsed');
  });

  linkAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('show');
    });
  });
}

if (linkAnchors.length) {
  linkAnchors.forEach(anchor => {
    anchor.addEventListener('click', event => {
      const targetId = anchor.getAttribute('href');
      if (targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

if (logo && siteHeader) {
  logo.addEventListener('click', () => {
    logo.classList.add('spin');
    if (mobileNavQuery.matches) {
      if (navLinks) navLinks.classList.toggle('show');
      siteHeader.classList.remove('nav-collapsed');
    } else {
      siteHeader.classList.toggle('nav-collapsed');
    }
  });

  logo.addEventListener('animationend', () => {
    logo.classList.remove('spin');
  });
}

if (marqueeTrack && marqueeGroup) {
  const syncMarquee = () => {
    const groupWidth = marqueeGroup.scrollWidth;
    if (!groupWidth) return;
    const pixelsPerSecond = 110;
    const trackStyles = getComputedStyle(marqueeTrack);
    const interGroupGap =
      parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;
    const offset = groupWidth + interGroupGap;
    const duration = offset / pixelsPerSecond;
    marqueeTrack.style.setProperty('--marquee-offset', `${offset}px`);
    marqueeTrack.style.setProperty('--marquee-duration', `${duration}s`);
  };

  window.addEventListener('resize', syncMarquee);
  window.addEventListener('load', syncMarquee);
  const marqueeImages = Array.from(marqueeGroup.querySelectorAll('img'));
  marqueeImages.forEach(img => {
    if (img.complete) return;
    img.addEventListener('load', syncMarquee, { once: true });
  });
  syncMarquee();
}

const pulseContainer = document.querySelector('.grid-pulses');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pulseResizeHandle;

const createGridPulses = () => {
  if (!pulseContainer || (prefersReducedMotion && prefersReducedMotion.matches)) return;
  pulseContainer.innerHTML = '';
  const gridSizeValue = getComputedStyle(document.documentElement).getPropertyValue('--grid-size');
  const gridSize = parseFloat(gridSizeValue) || 120;
  const dotSizeValue = getComputedStyle(pulseContainer).getPropertyValue('--dot-size');
  const dotSize = parseFloat(dotSizeValue) || 6;
  const halfDot = dotSize / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const offsetX = (vw % gridSize) / 2;
  const offsetY = (vh % gridSize) / 2;
  document.documentElement.style.setProperty('--grid-pos-x', `${offsetX}px`);
  document.documentElement.style.setProperty('--grid-pos-y', `${offsetY}px`);
  const horizontalLines = Math.ceil((vh + gridSize) / gridSize);
  const verticalLines = Math.ceil((vw + gridSize) / gridSize);
  const pulseCountX = Math.min(18, Math.max(8, Math.round(horizontalLines * 0.7)));
  const pulseCountY = Math.min(18, Math.max(8, Math.round(verticalLines * 0.7)));

  const randomDelay = duration => `${(-duration * Math.random()).toFixed(2)}s`;
  const randomScale = () => (0.7 + Math.random() * 0.6).toFixed(2);

  const makeDot = axis => {
    const dot = document.createElement('span');
    dot.className = axis === 'x' ? 'pulse-dot is-x' : 'pulse-dot is-y';
    const duration = 18 + Math.random() * 18;
    dot.style.animationDuration = `${duration}s`;
    dot.style.animationDelay = randomDelay(duration);
    dot.style.setProperty('--dot-scale', randomScale());

    if (axis === 'x') {
      const yIndex = Math.round(Math.random() * horizontalLines);
      dot.style.top = `${offsetY + yIndex * gridSize - halfDot}px`;
      dot.style.left = `${-dotSize}px`;
    } else {
      const xIndex = Math.round(Math.random() * verticalLines);
      dot.style.left = `${offsetX + xIndex * gridSize - halfDot}px`;
      dot.style.top = `${-dotSize}px`;
    }

    pulseContainer.appendChild(dot);
  };

  for (let i = 0; i < pulseCountX; i += 1) makeDot('x');
  for (let i = 0; i < pulseCountY; i += 1) makeDot('y');
};

window.addEventListener('resize', () => {
  if (pulseResizeHandle) clearTimeout(pulseResizeHandle);
  pulseResizeHandle = setTimeout(createGridPulses, 250);
});

window.addEventListener('load', createGridPulses);
createGridPulses();
