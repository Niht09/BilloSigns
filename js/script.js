// =========================
// MOBILE MENU TOGGLE
// =========================

const menuToggle = document.createElement("button");
menuToggle.classList.add("menu-toggle");
menuToggle.innerHTML = "☰";

const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

header.appendChild(menuToggle);

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  menuToggle.classList.toggle("open");
});

// =========================
// STICKY HEADER EFFECT
// =========================

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
  } else {
    header.style.boxShadow = "none";
  }
});

// =========================
// SMOOTH SCROLL
// =========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    // Close mobile nav
    nav.classList.remove("active");
  });
});

// =========================
// FAQ ACCORDION
// =========================

const faqs = document.querySelectorAll("#faq h3");

faqs.forEach(faq => {
  faq.addEventListener("click", () => {
    const content = faq.nextElementSibling;

    if (!content) return;

    content.classList.toggle("open");

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// =========================
// SCROLL ANIMATIONS
// =========================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll("section").forEach(section => {
  observer.observe(section);
});

// =========================
// FORM VALIDATION + WHATSAPP
// =========================

const form = document.querySelector("form");

form.addEventListener("submit", function(e) {

  const name = form.querySelector("input[name='name']").value.trim();
  const phone = form.querySelector("input[name='phone']").value.trim();

  if (name.length < 2) {
    alert("Please enter a valid name.");
    e.preventDefault();
    return;
  }

  if (phone.length < 8) {
    alert("Please enter a valid phone number.");
    e.preventDefault();
    return;
  }

});

// =========================
// WHATSAPP DYNAMIC MESSAGE
// =========================

const whatsappBtn = document.querySelector(".btn-whatsapp");

if (whatsappBtn) {
  whatsappBtn.addEventListener("click", () => {

    const message = encodeURIComponent(
      "Hi Billo Signs, I need a quote for custom signage in Edmonton."
    );

    whatsappBtn.href = `https://wa.me/13439895043?text=${message}`;
  });
}

// =========================
// STICKY MOBILE CTA INJECTION
// =========================

const stickyBar = document.createElement("div");
stickyBar.classList.add("sticky-cta");

stickyBar.innerHTML = `
  <a href="tel:+13439895043" class="call">Call</a>
  <a href="https://wa.me/13439895043" class="whatsapp">WhatsApp</a>
  <a href="#quote" class="quote">Quote</a>
`;

document.body.appendChild(stickyBar);

// =========================
// PAGE LOAD ANIMATION
// =========================

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});