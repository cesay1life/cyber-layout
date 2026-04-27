/* ================= MENU HAMBURGUESA ================= */

function initMenuToggle() {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!toggle || !navLinks) return;

  // Estado inicial accesible
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.classList.toggle("active");

    // Accesibilidad
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !expanded);
  });

  // Cerrar menú al hacer click en un link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}


/* ================= VARIABLES GLOBALES ================= */

const SELECTORS = {
  reveal: ".reveal",
  heroBg: ".hero-bg",
  sections: "section[id]",
  navLinks: ".nav a"
};

const CONFIG = {
  revealThreshold: 0.1,
  parallaxSpeed: 0.2,
  navOffset: 120
};

// Cache de elementos (🔥 mejora rendimiento)
let heroBg = null;
let sections = [];
let navLinks = [];


/* ================= UTIL: RAF THROTTLE ================= */

function rafThrottle(callback) {
  let ticking = false;

  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}


/* ================= INIT ================= */

function init() {
  heroBg = document.querySelector(SELECTORS.heroBg);
  sections = document.querySelectorAll(SELECTORS.sections);
  navLinks = document.querySelectorAll(SELECTORS.navLinks);

  initReveal();
  initScrollEvents();
  initMenuToggle();
}


/* ================= SCROLL REVEAL ================= */

function initReveal() {
  const elements = document.querySelectorAll(SELECTORS.reveal);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // 🔥 mejora rendimiento
      }
    });
  }, {
    threshold: CONFIG.revealThreshold,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(el => observer.observe(el));
}


/* ================= PARALLAX ================= */

function handleParallax(scrollY) {
  if (!heroBg) return;

  heroBg.style.transform = `translateY(${scrollY * CONFIG.parallaxSpeed}px)`;
}


/* ================= NAV ACTIVE ================= */

function handleNavActive(scrollY) {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - CONFIG.navOffset;
    const height = section.offsetHeight;

    if (scrollY >= top && scrollY < top + height) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}


/* ================= SCROLL HANDLER ================= */

function handleScroll() {
  const scrollY = window.scrollY;

  handleParallax(scrollY);
  handleNavActive(scrollY);
}

const optimizedScroll = rafThrottle(handleScroll);

function initScrollEvents() {
  window.addEventListener("scroll", optimizedScroll);
}


/* ================= START ================= */

document.addEventListener("DOMContentLoaded", init);