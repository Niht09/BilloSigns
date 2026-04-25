/**
 * ═══════════════════════════════════════════════════════════════
 * BILLO SIGNS & GRAPHICS — script.js
 * Production JavaScript — billosigns.ca
 * Version: 5.0
 *
 * Modules:
 *  1.  Config & Utilities
 *  2.  Navigation — scroll state
 *  3.  Navigation — hamburger + mobile drawer
 *  4.  Navigation — active link highlighting
 *  5.  Scroll Reveal (IntersectionObserver)
 *  6.  Count-Up Animation
 *  7.  Quick Quote Funnel — 3-step wizard
 *  8.  Web3Forms — async form submission
 *  9.  FAQ Accordion
 * 10.  WhatsApp deep-link builder
 * 11.  Smooth scroll (anchor fallback)
 * 12.  Init
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIG & UTILITIES
───────────────────────────────────────────────────────────── */

const CONFIG = {
  WA_NUMBER:    '17801234567',
  EMAIL:        'hello@billosigns.ca',
  NAV_OFFSET:   80,   // px — scroll threshold before header "sticks"
  COUNT_DURATION: 1600, // ms
  REVEAL_MARGIN: '-40px',
  REVEAL_THRESHOLD: 0.10,
  FUNNEL_STEPS: 3,
};

/**
 * Shorthand query selectors
 */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Add multiple event listeners to one element
 */
function on(el, events, handler, opts) {
  if (!el) return;
  events.split(' ').forEach(e => el.addEventListener(e, handler, opts));
}

/**
 * Debounce — limits how often a function fires
 */
function debounce(fn, ms = 100) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/**
 * Easing — easeOutExpo for count-up
 */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ─────────────────────────────────────────────────────────────
   2. NAVIGATION — SCROLL STATE
───────────────────────────────────────────────────────────── */

function initNavScroll() {
  const header = qs('#siteHeader');
  if (!header) return;

  function update() {
    header.classList.toggle('scrolled', window.scrollY > CONFIG.NAV_OFFSET);
  }

  // Initial check (page may load mid-scroll)
  update();
  on(window, 'scroll', debounce(update, 10), { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   3. NAVIGATION — HAMBURGER + MOBILE DRAWER
───────────────────────────────────────────────────────────── */

function initHamburger() {
  const hamBtn = qs('#hamBtn');
  const drawer = qs('#mobileDrawer');
  if (!hamBtn || !drawer) return;

  let isOpen = false;

  function openDrawer() {
    isOpen = true;
    drawer.hidden = false;
    hamBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Allow reflow before animation
    requestAnimationFrame(() => drawer.classList.add('open'));
  }

  function closeDrawer() {
    isOpen = false;
    hamBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    drawer.classList.remove('open');
    // Wait for animation before hiding from DOM
    setTimeout(() => {
      if (!isOpen) drawer.hidden = true;
    }, 300);
  }

  function toggleDrawer() {
    isOpen ? closeDrawer() : openDrawer();
  }

  on(hamBtn, 'click', toggleDrawer);

  // Close on any drawer link click
  qsa('a', drawer).forEach(a => on(a, 'click', closeDrawer));

  // Close on Escape key
  on(document, 'keydown', e => {
    if (e.key === 'Escape' && isOpen) closeDrawer();
  });

  // Close on backdrop click (outside drawer)
  on(document, 'click', e => {
    if (isOpen && !drawer.contains(e.target) && !hamBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   4. NAVIGATION — ACTIVE LINK HIGHLIGHTING
───────────────────────────────────────────────────────────── */

function initActiveNav() {
  const navLinks = qsa('.nav-link[href^="#"]');
  if (!navLinks.length) return;

  // Build section map: { id → navLink }
  const sectionMap = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const section = qs(`#${id}`);
    if (section) sectionMap.set(section, link);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = sectionMap.get(entry.target);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sectionMap.forEach((_, section) => observer.observe(section));
}

/* ─────────────────────────────────────────────────────────────
   5. SCROLL REVEAL
───────────────────────────────────────────────────────────── */

function initReveal() {
  const elements = qsa('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold:  CONFIG.REVEAL_THRESHOLD,
    rootMargin: `0px 0px ${CONFIG.REVEAL_MARGIN} 0px`
  });

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   6. COUNT-UP ANIMATION
───────────────────────────────────────────────────────────── */

function initCountUp() {
  const counters = qsa('.count[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target  = parseInt(el.dataset.target, 10);
  const start   = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / CONFIG.COUNT_DURATION, 1);
    const eased = easeOutExpo(progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }

  requestAnimationFrame(frame);
}

/* ─────────────────────────────────────────────────────────────
   7. QUICK QUOTE FUNNEL — 3-STEP WIZARD
───────────────────────────────────────────────────────────── */

const FunnelState = {
  step:    1,
  service: '',
  budget:  '',
};

const FunnelUI = {
  progressBar: null,
  title:       null,
  stepLabel:   null,
  step1:       null,
  step2:       null,
  step3:       null,
  summary:     null,
  waBtn:       null,
  hiddenSvc:   null,
  hiddenBud:   null,
};

const FUNNEL_COPY = {
  1: { title: 'What do you need?',                      label: 'Step 1 of 3', progress: '33%'  },
  2: { title: "What's your budget range?",              label: 'Step 2 of 3', progress: '66%'  },
  3: { title: 'Almost done — how should we reach you?', label: 'Step 3 of 3', progress: '90%'  },
  4: { title: "You're all set!",                        label: 'Done',        progress: '100%' },
};

function initFunnel() {
  // Cache all funnel DOM references
  FunnelUI.progressBar = qs('#funnelProgressBar');
  FunnelUI.title       = qs('#funnelTitle');
  FunnelUI.stepLabel   = qs('#funnelStepLabel');
  FunnelUI.step1       = qs('#fStep1');
  FunnelUI.step2       = qs('#fStep2');
  FunnelUI.step3       = qs('#fStep3');
  FunnelUI.summary     = qs('#funnelSummary');
  FunnelUI.waBtn       = qs('#funnelWhatsApp');
  FunnelUI.hiddenSvc   = qs('#hiddenService');
  FunnelUI.hiddenBud   = qs('#hiddenBudget');

  // Guard — funnel may not exist on page
  if (!FunnelUI.step1) return;

  // Bind step 1 — service options
  qsa('.funnel-opt', FunnelUI.step1).forEach(btn => {
    on(btn, 'click', () => {
      FunnelState.service = btn.dataset.value;
      highlightSelected(FunnelUI.step1, btn);
      setTimeout(() => goToStep(2), 260);
    });
  });

  // Bind step 2 — budget options
  qsa('.funnel-opt', FunnelUI.step2).forEach(btn => {
    on(btn, 'click', () => {
      FunnelState.budget = btn.dataset.value;
      highlightSelected(FunnelUI.step2, btn);
      // Populate summary and WhatsApp link before showing step 3
      populateSummary();
      setTimeout(() => goToStep(3), 260);
    });
  });

  // Safety: always explicitly initialise step 1 so it can never start hidden
  goToStep(1);
}

/**
 * Transition to a numbered step.
 *
 * Uses element.style.setProperty('display', value, 'important') — this sets
 * an inline style with !important priority, which beats every stylesheet rule
 * including cached CSS. This is the only fully reliable cross-browser approach
 * when CSS caching is unpredictable (e.g. GitHub Pages CDN).
 */
function goToStep(n) {
  FunnelState.step = n;
  const copy = FUNNEL_COPY[n] || FUNNEL_COPY[CONFIG.FUNNEL_STEPS];

  // Update progress bar
  if (FunnelUI.progressBar) {
    FunnelUI.progressBar.style.width = copy.progress;
    FunnelUI.progressBar.parentElement.setAttribute('aria-valuenow',
      parseInt(copy.progress, 10)
    );
  }

  // Update labels
  if (FunnelUI.title)     FunnelUI.title.textContent     = copy.title;
  if (FunnelUI.stepLabel) FunnelUI.stepLabel.textContent = copy.label;

  // Show/hide steps using inline style — overrides ALL stylesheet rules
  const steps = [FunnelUI.step1, FunnelUI.step2, FunnelUI.step3];
  steps.forEach((s, i) => {
    if (!s) return;
    const isActive = (i + 1 === n);
    // setProperty with 'important' flag wins over any !important in CSS too
    s.style.setProperty('display', isActive ? 'block' : 'none', 'important');
    s.classList.toggle('active', isActive);
    // Remove any hidden attribute that may survive from HTML parsing
    if (isActive) s.removeAttribute('hidden');
  });
}

/**
 * Visually mark selected option and deselect others
 */
function highlightSelected(container, selected) {
  qsa('.funnel-opt', container).forEach(b => b.classList.remove('selected'));
  selected.classList.add('selected');
}

/**
 * Build summary line and WhatsApp deep-link from current state
 */
function populateSummary() {
  const { service, budget } = FunnelState;

  // Summary text
  if (FunnelUI.summary) {
    FunnelUI.summary.innerHTML =
      `<strong>Service:</strong> ${escapeHTML(service)} &nbsp;·&nbsp; ` +
      `<strong>Budget:</strong> ${escapeHTML(budget)}`;
  }

  // Populate hidden form fields
  if (FunnelUI.hiddenSvc) FunnelUI.hiddenSvc.value = service;
  if (FunnelUI.hiddenBud) FunnelUI.hiddenBud.value = budget;

  // Build WhatsApp pre-filled message
  const waMessage = encodeURIComponent(
    `Hi Billo Signs, I'd like a free quote.\n` +
    `Service: ${service}\n` +
    `Budget: ${budget}`
  );
  if (FunnelUI.waBtn) {
    FunnelUI.waBtn.href = `https://wa.me/${CONFIG.WA_NUMBER}?text=${waMessage}`;
  }
}

/**
 * Sanitize HTML to prevent XSS in summary
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─────────────────────────────────────────────────────────────
   8. WEB3FORMS — ASYNC FORM SUBMISSION
───────────────────────────────────────────────────────────── */

function initForm() {
  const form       = qs('#quoteForm');
  const submitBtn  = qs('#formSubmitBtn');
  const successMsg = qs('#formSuccess');
  const errorMsg   = qs('#formError');

  if (!form) return;

  on(form, 'submit', async e => {
    e.preventDefault();

    // Basic client-side validation
    const name  = qs('#fieldName',  form);
    const phone = qs('#fieldPhone', form);

    if (!name.value.trim()) {
      focusInvalid(name, 'Please enter your name.');
      return;
    }
    if (!phone.value.trim()) {
      focusInvalid(phone, 'Please enter your phone number.');
      return;
    }

    // Show loading state
    setSubmitLoading(submitBtn, true);
    hideMessages(successMsg, errorMsg);

    try {
      const data     = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   data,
      });

      const result = await response.json();

      if (result.success) {
        showSuccess(form, successMsg, submitBtn);
        // Also fire WhatsApp with full details as bonus conversion
        fireBonusWhatsApp(form);
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (err) {
      console.error('[BilloSigns Form]', err);
      showError(errorMsg, submitBtn);
    }
  });
}

function focusInvalid(input, message) {
  input.focus();
  input.style.borderColor = '#DC2626';
  setTimeout(() => (input.style.borderColor = ''), 2500);

  // Announce to screen readers
  const id = input.id + '-error';
  let errEl = qs(`#${id}`);
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.id = id;
    errEl.setAttribute('role', 'alert');
    errEl.style.cssText = 'font-size:12px;color:#FCA5A5;margin-top:4px;';
    input.parentNode.appendChild(errEl);
  }
  errEl.textContent = message;
  setTimeout(() => errEl.remove(), 3000);
}

function setSubmitLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Sending…' : 'Send My Free Quote Request →';
}

function hideMessages(...els) {
  els.forEach(el => { if (el) el.hidden = true; });
}

function showSuccess(form, successEl, btn) {
  setSubmitLoading(btn, false);
  if (successEl) {
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  // Clear sensitive fields
  form.reset();
  // Reset funnel hidden fields too
  if (FunnelUI.hiddenSvc) FunnelUI.hiddenSvc.value = '';
  if (FunnelUI.hiddenBud) FunnelUI.hiddenBud.value = '';
}

function showError(errorEl, btn) {
  setSubmitLoading(btn, false);
  if (errorEl) {
    errorEl.hidden = false;
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * After successful form submit, open WhatsApp with details
 * as a bonus lead confirmation (non-blocking, opens new tab)
 */
function fireBonusWhatsApp(form) {
  const name    = qs('#fieldName',  form)?.value || '';
  const phone   = qs('#fieldPhone', form)?.value || '';
  const service = FunnelState.service || 'Not specified';
  const budget  = FunnelState.budget  || 'Not specified';

  const msg = encodeURIComponent(
    `Hi Billo Signs! I just sent a quote request.\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Service: ${service}\n` +
    `Budget: ${budget}`
  );

  // Open after a short delay so it feels intentional
  setTimeout(() => {
    window.open(`https://wa.me/${CONFIG.WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
  }, 800);
}

/* ─────────────────────────────────────────────────────────────
   9. FAQ ACCORDION
───────────────────────────────────────────────────────────── */

function initFAQ() {
  const items = qsa('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = qs('.faq-btn',    item);
    const answer = qs('.faq-answer', item);
    if (!btn || !answer) return;

    on(btn, 'click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items first
      items.forEach(other => {
        const otherBtn    = qs('.faq-btn',    other);
        const otherAnswer = qs('.faq-answer', other);
        if (otherBtn && otherAnswer && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
          otherAnswer.hidden = false; // keep in DOM for animation
        }
      });

      // Toggle current
      const nextState = !isOpen;
      btn.setAttribute('aria-expanded', String(nextState));
      answer.classList.toggle('open', nextState);

      // Announce to screen readers
      if (nextState) {
        answer.removeAttribute('hidden');
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   10. WHATSAPP DEEP-LINK BUILDER
   Dynamically builds pre-filled WA links on page load
───────────────────────────────────────────────────────────── */

function initWhatsAppLinks() {
  // Generic fallback message for any WA link that goes to wa.me without text
  const genericMsg = encodeURIComponent(
    `Hi Billo Signs, I'd like to get a free quote for custom signage in Edmonton.`
  );
  const genericHref = `https://wa.me/${CONFIG.WA_NUMBER}?text=${genericMsg}`;

  qsa('a[href*="wa.me"]').forEach(link => {
    const href = link.getAttribute('href');
    // If link already has a text param, leave it alone
    if (href && !href.includes('text=')) {
      link.href = genericHref;
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   11. SMOOTH SCROLL — ANCHOR FALLBACK
   Handles clicks on #hash links that CSS scroll-behavior
   might not catch (e.g. mobile safari older versions)
───────────────────────────────────────────────────────────── */

function initSmoothScroll() {
  on(document, 'click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;

    const target = qs(`#${id}`);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top
              + window.scrollY
              - CONFIG.NAV_OFFSET;

    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL hash without jumping
    history.pushState(null, '', `#${id}`);
  });
}

/* ─────────────────────────────────────────────────────────────
   12. STICKY BAR — hide on scroll up, show on scroll down
   Improves UX when reading content
───────────────────────────────────────────────────────────── */

function initStickyBarBehavior() {
  const bar = qs('#stickyBar');
  if (!bar) return;

  let lastY = window.scrollY;
  let ticking = false;

  on(window, 'scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const scrollingUp = y < lastY;

      // Always show when near bottom of page
      const nearBottom =
        y + window.innerHeight >= document.body.scrollHeight - 200;

      if (scrollingUp || nearBottom) {
        bar.style.transform = 'translateY(0)';
      } else {
        // Only hide after scrolling down past the fold
        if (y > window.innerHeight * 0.5) {
          bar.style.transform = 'translateY(100%)';
        }
      }

      lastY = y;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  // Smooth transition for show/hide
  bar.style.transition = 'transform 0.35s cubic-bezier(.16,1,.3,1)';
}

/* ─────────────────────────────────────────────────────────────
   BONUS: LOGO FALLBACK
   If logo.svg fails to load, show text fallback
───────────────────────────────────────────────────────────── */

function initLogoFallback() {
  const logos = qsa('img[alt*="Billo Signs Logo"]');
  logos.forEach(img => {
    on(img, 'error', () => {
      // Replace broken img with styled text logo
      const fallback = document.createElement('span');
      fallback.className = 'logo-text-fallback';
      fallback.style.cssText =
        'font-family:"Montserrat",sans-serif;font-weight:900;' +
        'font-size:18px;letter-spacing:-.5px;color:#fff;';
      fallback.innerHTML = 'BILLO<span style="color:#C4A44A">.</span>SIGNS';

      img.parentNode.replaceChild(fallback, img);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   BONUS: PORTFOLIO IMAGE LAZY LOADING
   Ensures placeholder hides when real image loads
───────────────────────────────────────────────────────────── */

function initPortfolioImages() {
  const portImgs = qsa('.port-ph img');
  portImgs.forEach(img => {
    // If already loaded (cached)
    if (img.complete && img.naturalWidth > 0) {
      hidePlaceholder(img);
      return;
    }
    on(img, 'load', () => hidePlaceholder(img));
  });
}

function hidePlaceholder(img) {
  const placeholder = img.nextElementSibling;
  if (placeholder && placeholder.classList.contains('port-ph-placeholder')) {
    placeholder.style.display = 'none';
  }
}

/* ─────────────────────────────────────────────────────────────
   BONUS: FORM FIELD FOCUS ANIMATION
   Removes error styling on input focus
───────────────────────────────────────────────────────────── */

function initFieldBehavior() {
  qsa('.form-group input, .form-group textarea').forEach(field => {
    on(field, 'focus', () => {
      field.style.borderColor = '';
      const errEl = qs(`#${field.id}-error`);
      if (errEl) errEl.remove();
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   BONUS: SECTION ANALYTICS HOOKS
   Fires console events (replace with GA4 / GTM if needed)
───────────────────────────────────────────────────────────── */

function initSectionTracking() {
  const trackSections = ['#hero', '#quote', '#signage', '#print', '#portfolio'];

  trackSections.forEach(sel => {
    const el = qs(sel);
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        // Replace with: window.gtag?.('event', 'section_view', { section: sel });
        console.info(`[BilloSigns] Section viewed: ${sel}`);
        observer.unobserve(e.target);
      });
    }, { threshold: 0.3 });

    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────────────────────
   BONUS: CTA CLICK TRACKING HOOKS
   Ready for Google Analytics / GTM event integration
───────────────────────────────────────────────────────────── */

function initCTATracking() {
  // Track all gold CTA button clicks
  qsa('.btn-gold[href="#quote"]').forEach(btn => {
    on(btn, 'click', () => {
      // Replace with: window.gtag?.('event', 'cta_click', { cta: 'get_quote' });
      console.info('[BilloSigns] CTA clicked: Get Quote');
    });
  });

  // Track WhatsApp clicks
  qsa('a[href*="wa.me"]').forEach(link => {
    on(link, 'click', () => {
      // Replace with: window.gtag?.('event', 'whatsapp_click');
      console.info('[BilloSigns] WhatsApp link clicked');
    });
  });

  // Track phone call clicks
  qsa('a[href^="tel:"]').forEach(link => {
    on(link, 'click', () => {
      // Replace with: window.gtag?.('event', 'phone_call');
      console.info('[BilloSigns] Phone call initiated');
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   12. INIT — Run everything on DOMContentLoaded
───────────────────────────────────────────────────────────── */

function init() {
  // Core UI
  initNavScroll();
  initHamburger();
  initActiveNav();

  // Animations
  initReveal();
  initCountUp();

  // Interactive components
  initFunnel();
  initForm();
  initFAQ();

  // Helpers
  initSmoothScroll();
  initWhatsAppLinks();
  initStickyBarBehavior();
  initLogoFallback();
  initPortfolioImages();
  initFieldBehavior();

  // Analytics (comment out if not using)
  initSectionTracking();
  initCTATracking();

  console.info('[BilloSigns] ✓ All modules initialized — billosigns.ca');
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already ready (script loaded with defer/async)
  init();
}
