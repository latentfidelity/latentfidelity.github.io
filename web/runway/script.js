/* ========================================
   Generic Landing Page Mockup — Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Reveal ----
  const reveals = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach((el) => revealObserver.observe(el));

  // ---- Sticky Nav Background ----
  const nav = document.getElementById('nav-header');
  let lastScroll = 0;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Hero Category Switcher ----
  const categories = document.querySelectorAll('.hero-category');
  const heroImages = document.querySelectorAll('.hero-image');
  let activeIndex = 0;

  const updateHeroState = (idx) => {
    categories.forEach((c) => c.classList.remove('active'));
    heroImages.forEach((img) => img.classList.remove('active'));
    categories[idx].classList.add('active');
    heroImages[idx].classList.add('active');
  };

  // Auto-cycle categories purely on chronological time
  setInterval(() => {
    activeIndex = (activeIndex + 1) % categories.length;
    updateHeroState(activeIndex);
  }, 4500);

  // ---- Smooth parallax on hero image ----
  const heroBgLayer = document.querySelector('.hero-bg-layer');
  if (heroBgLayer) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrollY < heroHeight) {
        const translate = scrollY * 0.25;
        heroBgLayer.style.transform = `translateY(${translate}px) scale(1.05)`;
      }
    }, { passive: true });
  }
});
