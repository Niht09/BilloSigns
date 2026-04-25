let type = "";
let budget = "";

function nextStep(step, value){
  if(value){
    if(step === 1) type = value;
    if(step === 2) budget = value;
  }

  document.getElementById("step"+step).classList.add("hidden");
  document.getElementById("step"+(step+1)).classList.remove("hidden");

  updateProgress(step+1);

  if(step === 3){
    document.getElementById("projectType").value = type;
    document.getElementById("budgetRange").value = budget;
  }
}

function updateProgress(step){
  const bar = document.getElementById("progressBar");
  const percent = step * 25;
  bar.style.width = percent + "%";
}

/* NAV */
const ham = document.getElementById("hamBtn");
const nav = document.getElementById("mobileNav");

ham.onclick = () => nav.classList.toggle("open");

/* SCROLL REVEAL */
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight - 100){
      el.classList.add("show");
    }
  });
});