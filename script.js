// NAV
const hamBtn = document.getElementById('hamBtn');
const mobileNav = document.getElementById('mobileNav');

hamBtn.onclick = () => mobileNav.classList.toggle('open');

// FUNNEL
let project="",budget="";

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
 let map={2:66,3:90,4:100};
 document.getElementById("progressBar").style.width=map[step]+"%";
}

// reveal animation
const reveals=document.querySelectorAll('.reveal');

function show(){
 const trigger=window.innerHeight*0.85;
 reveals.forEach(el=>{
   if(el.getBoundingClientRect().top<trigger){
     el.classList.add('show');
   }
 });
}

window.addEventListener('scroll',show);
window.addEventListener('load',show);