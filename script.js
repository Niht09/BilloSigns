const hamBtn = document.getElementById('hamBtn');
const mobileNav = document.getElementById('mobileNav');

hamBtn.onclick = () => {
  mobileNav.classList.toggle('open');
};

/* FUNNEL */
let project="", budget="";

function nextStep(step,val){
  if(step===1) project=val;
  if(step===2){
    budget=val;
    document.getElementById("estimate").innerText=val;
  }

  document.getElementById("step"+step).style.display="none";
  document.getElementById("step"+(step+1)).style.display="block";

  document.getElementById("projectType").value=project;
  document.getElementById("budgetRange").value=budget;

  updateProgress(step+1);
}

function updateProgress(step){
  let w = step===2?66:step===3?90:100;
  document.getElementById("progressBar").style.width=w+"%";
}