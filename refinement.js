document.addEventListener('DOMContentLoaded', () => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Only enhance offscreen content; all content stays visible without JavaScript.
  if ('IntersectionObserver' in window && !motion.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        reveal.unobserve(entry.target);
      }
    }), {threshold:0.08});
    document.querySelectorAll('.impact-intro,.impact-stat,.portfolio-head,.project-card,.experience-points>div,.profile-summary,.link-grid').forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-ready');
        reveal.observe(el);
      }
    });
    motion.addEventListener('change', event => {
      if (event.matches) {reveal.disconnect();document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-revealed'));}
    });
  }
  const track = document.querySelector('#project-track');
  const previous = document.querySelector('[data-slide="prev"]');
  const next = document.querySelector('[data-slide="next"]');
  const updateTrack = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  track.addEventListener('scroll', updateTrack, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(updateTrack).observe(track);
  else window.addEventListener('resize', updateTrack);
  updateTrack();
  const links = [...document.querySelectorAll('.mast-nav a')];
  if ('IntersectionObserver' in window) {
    const navigation = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting) links.forEach(link=>{
        if(link.hash === '#' + entry.target.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }), {rootMargin:'-15% 0px -55% 0px',threshold:0});
    document.querySelectorAll('#main>.hero,#work,#experience,#links').forEach(el=>navigation.observe(el));
  }
  const backdrop = document.querySelector('#backdrop');
  const main = document.querySelector('main');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  let lastTrigger = null;
  document.querySelectorAll('.ticket').forEach(button=>button.addEventListener('click',()=>{lastTrigger=button;}));
  const syncModal = () => {
    const open = !backdrop.hidden;
    [main,header,footer].forEach(el=>el.inert=open);
    if(!open && lastTrigger?.isConnected) lastTrigger.focus({preventScroll:true});
  };
  new MutationObserver(syncModal).observe(backdrop,{attributes:true,attributeFilter:['hidden']});
  backdrop.addEventListener('keydown',event=>{
    if(event.key !== 'Tab') return;
    const focusable=[...backdrop.querySelectorAll('a[href],button,[tabindex="0"]')].filter(el=>el.getClientRects().length);
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  });
});
