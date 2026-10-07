(() => {
  const dock = document.querySelector('.chapter-dock');
  const links = [...dock.querySelectorAll('[data-chapter]')];
  const sections = ['main','work','experience','about'].map(id=>document.getElementById(id));
  let queued=false;
  const update=()=>{
    queued=false;
    let current='main';
    for(const section of sections) if(section.getBoundingClientRect().top<=innerHeight*.4) current=section.id;
    for(const link of links){if(link.dataset.chapter===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
  // Native anchors preserve browser history, keyboard use, and no-JS navigation.
  document.querySelectorAll('.scene-button[href^="#"],.chapter-dock a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>{
      const target=document.getElementById(link.hash.slice(1));
      if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
    });
  });
})();
