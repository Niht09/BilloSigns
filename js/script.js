// ==============================
// MOBILE MENU
// ==============================
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// ==============================
// SCROLL ANIMATIONS
// ==============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".card, section, img").forEach(el => {
  el.classList.add("fade-in");
  observer.observe(el);
});

// ==============================
// FORM HANDLING (WEB3FORMS)
// ==============================
const form = document.getElementById("quoteForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector("input[type='text']").value;
    const phone = form.querySelector("input[type='tel']").value;

    if (!name || !phone) {
      alert("Please fill all fields");
      return;
    }

    // ==========================
    // 1. SEND TO WEB3FORMS
    // ==========================
    const data = {
      access_key: "YOUR_ACCESS_KEY_HERE",
      name: name,
      phone: phone,
      subject: "New Billo Signs Lead"
    };

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

    } catch (err) {
      console.error("Form error:", err);
    }

    // ==========================
    // 2. WHATSAPP AUTO MESSAGE
    // ==========================
    const message = `Hi Billo Signs,%0A%0AI need a quote.%0AName: ${name}%0APhone: ${phone}`;

    const waLink = `https://wa.me/15485773748?text=${message}`;

    // ==========================
    // 3. SUCCESS UI
    // ==========================
    form.innerHTML = `
      <h3>✅ Request Sent</h3>
      <p>We’ll contact you within 24 hours.</p>
      <a href="${waLink}" class="btn whatsapp full" target="_blank">
        Continue on WhatsApp →
      </a>
    `;
  });
}

// ==============================
// WHATSAPP BUTTON AUTO MESSAGE
// ==============================
document.querySelectorAll(".btn.whatsapp").forEach(btn => {
  btn.addEventListener("click", () => {
    const message = "Hi Billo Signs, I need a quote.";
    btn.href = `https://wa.me/15485773748?text=${encodeURIComponent(message)}`;
  });
});

// ==============================
// SMOOTH SCROLL (better UX)
// ==============================
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});