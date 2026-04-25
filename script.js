const hamBtn = document.getElementById('hamBtn');
const mobileNav = document.getElementById('mobileNav');

hamBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

/* FUNNEL */
let project = "";
let budget = "";

function nextStep(step,value){
  if(step===1) project = value;
  if(step===2) {
    budget = value;
    document.getElementById("estimate").innerText = value;
  }

  document.getElementById("step"+step).style.display="none";
  document.getElementById("step"+(step+1)).style.display="block";

  document.getElementById("projectType").value = project;
  document.getElementById("budgetRange").value = budget;

  updateProgress(step+1);
}

function updateProgress(step){
  const map = {2:66,3:90,4:100};
  document.getElementById("progressBar").style.width = map[step]+"%";
}