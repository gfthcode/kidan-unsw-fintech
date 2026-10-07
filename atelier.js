(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const film = document.querySelector('.film');
  const portrait = document.querySelector('.portrait');
  const dark = document.querySelector('.scene-dark');
  const eyewear = document.querySelector('.eyewear');
  const intro = [...document.querySelectorAll('.hero-info,.hero-meta,.hero-name,.hero-bottom')];
  const scene = [...document.querySelectorAll('.scene-copy,.scene-foot')];
  const nav = [...document.querySelectorAll('.chapter-nav a')];
  const sections = nav.map(a => document.querySelector(a.hash));
  const clamp = n => Math.max(0, Math.min(1, n));
  const range = (n,a,b) => clamp((n-a)/(b-a));
  const ease = n => n*n*(3-2*n);
  let pending = false;
  const update = () => {
    pending = false;
    const rect = film.getBoundingClientRect();
    const p = reduced.matches ? 0 : clamp(-rect.top / Math.max(1,film.offsetHeight-innerHeight));
    const fade = ease(range(p,.05,.3));
    document.documentElement.style.setProperty('--progress',p);
    intro.forEach(el => {el.style.opacity=1-fade;el.style.visibility=fade>=1?'hidden':'visible';el.inert=fade>.9;});
    portrait.style.opacity=1-ease(range(p,.24,.55));
    portrait.style.transform=`translateX(-50%) scale(${1+p*.3})`;
    dark.style.opacity=ease(range(p,.3,.58));
    const zoom=ease(range(p,.08,.63));
    eyewear.style.opacity=ease(range(p,.08,.28));
    eyewear.style.transform=`translate(-50%,-50%) scale(${.12+zoom*.88}) rotate(${-13+ease(range(p,.3,1))*19}deg)`;
    const show = ease(range(p,.52,.75));
    scene.forEach(el=>{el.style.opacity=show;el.style.visibility=show>0?'visible':'hidden';el.inert=show<.85;});
    let current=0;sections.forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight*.45)current=i;});
    nav.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  };
  const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
  // All destinations are native anchors: history, direct links and keyboard navigation remain available.
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
    const destination=document.querySelector(a.hash);if(!destination)return;
    destination.setAttribute('tabindex','-1');destination.focus({preventScroll:true});
  }));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.06});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    document.documentElement.classList.add('js');
  }
  update();
})();
