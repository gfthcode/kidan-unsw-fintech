(() => {
 const $=s=>document.querySelector(s), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const stage=$('.show-stage'), model=$('.model-wrap'), visor=$('.visor-wrap'), nucleus=$('.nucleus-object'), court=$('.court-object'), backdrop=$('.warm-backdrop');
 const scenes=[...document.querySelectorAll('.scene-ui')], nav=[...document.querySelectorAll('.scene-nav a')];
 const clamp=n=>Math.max(0,Math.min(1,n)), ease=n=>n*n*(3-2*n), span=(p,a,b)=>ease(clamp((p-a)/(b-a)));
 const blend=(a,b,t)=>`rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')})`;
 let scheduled=false, lastScene=-1, activeDialog=null, opener=null;
 function update(){
  scheduled=false;
  const h=innerHeight, p=Math.max(0,Math.min(3,-$('.show-track').getBoundingClientRect().top/(h*1.1)));
  const current=Math.min(3,Math.floor(p+.45));
  const q=reduced.matches?current:p;
  const first=span(q,.12,.92), second=span(q,1.18,1.9), third=span(q,2.18,2.94);
  model.style.opacity=1-span(q,.25,.7);
  model.style.transform=`scale(${1+first*.32}) rotate(${first*-3}deg)`;
  visor.style.opacity=span(q,.3,.7)*(1-second);
  visor.style.transform=`translate(-50%,-50%) scale(${.24+first*.76+second*.35}) rotate(${-12+first*17+second*12}deg)`;
  backdrop.style.opacity=span(q,.35,.8)*(1-second);
  stage.style.background=blend([236,233,228],[218,226,211],second);
  if(third>0)stage.style.background=blend([218,226,211],[224,173,138],third);
  nucleus.style.opacity=second*(1-third);
  nucleus.style.transform=`translate(-50%,-50%) scale(${.65+second*.35-third*.15}) rotate(${(1-second)*-20+third*18}deg)`;
  court.style.opacity=third;
  court.style.transform=`translate(-50%,-50%) scale(${.65+third*.35}) rotate(${(1-third)*-15}deg)`;
  $('.stage-progress i').style.height=`${p/3*100}%`;
  if(current!==lastScene){scenes.forEach((s,i)=>{s.hidden=i!==current;s.inert=i!==current;});nav.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});document.body.classList.toggle('on-dark',current===1);lastScene=current;}
 }
 function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);reduced.addEventListener('change',queue);
 function openDetail(name,trigger){
  const dialog=document.getElementById(`detail-${name}`);if(!dialog)return;
  if(activeDialog)activeDialog.close();opener=trigger||document.activeElement;activeDialog=dialog;
  dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.sheet-body').scrollTop=0;
 }
 function closeDetail(){if(activeDialog)activeDialog.close();}
 document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openDetail(b.dataset.open,b)));
 document.querySelectorAll('dialog').forEach(d=>{
  d.querySelector('.close-sheet').addEventListener('click',closeDetail);
  d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
  d.addEventListener('close',()=>{document.body.style.overflow='';activeDialog=null;if(opener?.isConnected)opener.focus({preventScroll:true});});
  d.querySelectorAll('a[href="#main"]').forEach(a=>a.addEventListener('click',closeDetail));
 });
 // Preserve earlier shared section URLs and allow direct links to project details.
 function restoreHash(){const aliases={experience:'experience',work:'nucleus',about:'about',contact:'contact',links:'contact','project-1':'nucleus','project-2':'court'};const name=aliases[location.hash.slice(1)];if(name)openDetail(name,null);}
 addEventListener('hashchange',restoreHash);restoreHash();update();
})();
