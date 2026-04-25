/* =========================
   MOBILE MENU
========================= */

const hamBtn = document.getElementById('hamBtn');
const mobileNav = document.getElementById('mobileNav');

hamBtn?.addEventListener('click', () => {
  hamBtn.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* =========================
   FAQ ACCORDION
========================= */

document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    q.classList.toggle('open');
    const answer = q.nextElementSibling;
    answer.classList.toggle('open');
  });
});

/* =========================
   FUNNEL LOGIC
========================= */

let step = 1;
let selectedService = '';
let selectedBudget = '';

const steps = {
  1: document.getElementById('fStep1'),
  2: document.getElementById('fStep2'),
  3: document.getElementById('fStep3')
};

const progressBar = document.getElementById('fProgress');
const stepLabel = document.getElementById('fStepLbl');
const title = document.getElementById('fTitle');
const summary = document.getElementById('fSummary');

function updateStepUI() {
  Object.values(steps).forEach(s => s.classList.remove('active'));
  steps[step].classList.add('active');

  progressBar.style.width = (step * 33) + '%';
  stepLabel.innerText = `Step ${step} of 3`;

  if (step === 2) title.innerText = "What's your budget?";
  if (step === 3) title.innerText = "Your details";
}

function nextStep() {
  if (step < 3) {
    step++;
    updateStepUI();
  }
}

/* =========================
   STEP 1 — SERVICE
========================= */

document.querySelectorAll('#serviceOptions .f-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#serviceOptions .f-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    selectedService = btn.dataset.val;
    nextStep();
  });
});

/* =========================
   STEP 2 — BUDGET
========================= */

document.querySelectorAll('#budgetOptions .f-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#budgetOptions .f-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    selectedBudget = btn.dataset.val;

    summary.innerHTML = `
      You selected: <strong>${selectedService}</strong><br>
      Budget: <strong>${selectedBudget}</strong>
    `;

    nextStep();
  });
});

/* =========================
   STEP 3 — SUBMIT
========================= */

const submitBtn = document.getElementById('fSubmit');

submitBtn?.addEventListener('click', () => {
  const name = document.getElementById('fName').value;
  const phone = document.getElementById('fPhone').value;

  if (!name || !phone) {
    alert('Please fill in all fields');
    return;
  }

  // Populate hidden form values
  let hiddenService = document.createElement('input');
  hiddenService.type = 'hidden';
  hiddenService.name = 'service';
  hiddenService.value = selectedService;

  let hiddenBudget = document.createElement('input');
  hiddenBudget.type = 'hidden';
  hiddenBudget.name = 'budget';
  hiddenBudget.value = selectedBudget;

  document.querySelector('form').appendChild(hiddenService);
  document.querySelector('form').appendChild(hiddenBudget);

  document.querySelector('form').submit();
});

/* =========================
   WHATSAPP INTEGRATION
========================= */

const waBtn = document.getElementById('fWhatsApp');

waBtn?.addEventListener('click', () => {
  const name = document.getElementById('fName').value || '';
  const phone = document.getElementById('fPhone').value || '';

  const message = `
Hi Billo Signs,

I need a quote:

Service: ${selectedService}
Budget: ${selectedBudget}

Name: ${name}
Phone: ${phone}
  `;

  const encoded = encodeURIComponent(message);

  window.open(`https://wa.me/13439895043?text=${encoded}`, '_blank');
});

/* =========================
   STICKY CTA VISIBILITY
========================= */

const stickyBar = document.querySelector('.sticky-bar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    stickyBar.style.display = 'block';
  } else {
    stickyBar.style.display = 'none';
  }
});

/* =========================
   ANIMATION ON SCROLL
========================= */

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
});

document.querySelectorAll('.section').forEach(sec => {
  sec.style.opacity = 0;
  sec.style.transform = 'translateY(40px)';
  observer.observe(sec);
});