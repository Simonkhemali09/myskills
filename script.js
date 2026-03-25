/**
 * script.js — Simon Khemali Portfolio
 * Features:
 *  - Dark / Light theme toggle (persisted in localStorage)
 *  - Sticky navbar scroll shadow
 *  - Active nav-link highlight on scroll
 *  - Smooth scrolling (polyfill for browsers that ignore CSS scroll-behavior)
 *  - Scroll-triggered fade-in animations (IntersectionObserver)
 *  - Mobile hamburger menu
 *  - Back-to-top button
 *  - Contact form feedback
 */

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

// Apply saved theme on page load
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});


/* ============================================================
   2. NAVBAR — SCROLL SHADOW & ACTIVE LINK
   ============================================================ */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

// Add box-shadow when user scrolls down
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
  } else {
    navbar.style.boxShadow = 'none';
  }

  // Back-to-top button visibility
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link based on current section
  updateActiveLink();
}, { passive: true });

/** Highlight the nav link whose section is most visible in the viewport */
function updateActiveLink() {
  const scrollY = window.scrollY;
  const offset  = 100; // pixels from top of viewport

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - offset;
    const sectionBottom = sectionTop + section.offsetHeight;
    const id            = section.getAttribute('id');
    const link          = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// Run once on load to set the initial active link
updateActiveLink();


/* ============================================================
   3. SMOOTH SCROLLING (JS polyfill for nav links)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ============================================================
   4. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

/** Close mobile menu helper */
function closeMobileMenu() {
  navList.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});


/* ============================================================
   5. SCROLL-TRIGGERED FADE-IN ANIMATIONS
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Once visible, stop observing to save resources
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

fadeEls.forEach(el => observer.observe(el));


/* ============================================================
   6. BACK-TO-TOP BUTTON
   ============================================================ */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   7. CONTACT FORM — SIMPLE FEEDBACK
   (In a real deployment, replace with a FormSubmit / EmailJS call)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formNote.style.color = '#ef4444';
    formNote.textContent  = 'Please fill in all fields.';
    return;
  }

  // Simulate sending — swap this for a real API call
  const submitBtn  = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    // Sanitize name before inserting into DOM content
    const safeName = name.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    formNote.style.color  = '#22c55e';
    formNote.textContent  = `Thanks ${safeName}! Your message was received. I'll reply soon 🚀`;
    contactForm.reset();
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message ✉️';
  }, 1200);
});


/* ============================================================
   8. RESUME DOWNLOAD (placeholder)
   Swap RESUME_PATH once a real resume PDF is placed in /assets/
   ============================================================ */
const RESUME_PATH = 'assets/Simon_Khemali_Resume.pdf';

document.getElementById('resumeBtn').addEventListener('click', e => {
  const resumePath = RESUME_PATH;

  // Check if file likely exists by attempting fetch (graceful fallback)
  fetch(resumePath, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        const a    = document.createElement('a');
        a.href     = resumePath;
        a.download = 'Simon_Khemali_Resume.pdf';
        a.click();
      } else {
        alert('Resume will be available soon! Feel free to reach out via email in the meantime.');
      }
    })
    .catch(() => {
      alert('Resume will be available soon! Feel free to reach out via email in the meantime.');
    });

  e.preventDefault();
});
