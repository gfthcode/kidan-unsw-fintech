document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('#intro');
  const finishIntro = () => { if (!intro || intro.classList.contains('is-finished')) return; intro.classList.add('is-finished'); window.setTimeout(() => intro.remove(), 550); };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) finishIntro(); else window.setTimeout(finishIntro, 2350);
  document.querySelector('#skip-intro')?.addEventListener('click', finishIntro);

  const backdrop = document.querySelector('#backdrop');
  const modal = document.querySelector('.detail-modal');
  const title = document.querySelector('#modal-title');
  const kicker = document.querySelector('#modal-kicker');
  const content = document.querySelector('#modal-content');
  const closeButton = document.querySelector('.modal-close');
  const triggers = [...document.querySelectorAll('.ticket')];
  const mood = document.querySelector('#mood-note');
  const moods = {projects:'一起拆解一个问题。',experience:'从用户的真实反馈出发。',github:'想法落进代码，才算开始。',about:'你好，我是陈高波。'};
  let returnFocus = null;
  let closeTimer = 0;
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const makeSection = section => {
    let html = `<article class="detail-section"><div class="detail-eyebrow">${esc(section.eyebrow || '')}</div><h3>${esc(section.title || '')}</h3>`;
    if (section.text) html += `<p>${esc(section.text)}</p>`;
    if (section.bullets) html += `<ul>${section.bullets.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
    if (section.subsections) html += `<div class="detail-subsections">${section.subsections.map(([heading, text])=>`<div><h4>${esc(heading)}</h4><p>${esc(text)}</p></div>`).join('')}</div>`;
    if (section.repos) html += `<div class="repo-list">${section.repos.map(([name,desc,url])=>`<a class="repo-row" href="${esc(url)}" target="_blank" rel="noreferrer"><span><b>${esc(name)}</b><small>${esc(desc)}</small></span><i>↗</i></a>`).join('')}</div>`;
    if (section.tags) html += `<div class="skill-tags">${section.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>`;
    if (section.links) html += `<div class="detail-links">${section.links.map(([label,url])=>`<a href="${esc(url)}" ${url.startsWith('http')?'target="_blank" rel="noreferrer"':''}>${esc(label)} <b>↗</b></a>`).join('')}</div>`;
    return html + '</article>';
  };
  const openPanel = key => {
    const panel = window.PORTFOLIO_CONTENT?.panels?.[key]; if (!panel) return;
    window.clearTimeout(closeTimer);
    returnFocus = document.activeElement; kicker.textContent = `${panel.number} / ${panel.label}`; title.textContent = panel.title;
    content.innerHTML = panel.sections.map(makeSection).join(''); content.scrollTop = 0;
    backdrop.hidden = false; requestAnimationFrame(() => { backdrop.classList.add('is-open'); closeButton.focus({preventScroll:true}); });
    document.body.classList.add('modal-open');
  };
  const closePanel = () => {
    if (backdrop.hidden) return; backdrop.classList.remove('is-open'); document.body.classList.remove('modal-open');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => { backdrop.hidden = true; if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); }, 180);
  };
  triggers.forEach(button => {
    button.addEventListener('click', () => openPanel(button.dataset.panel));
    button.addEventListener('pointerenter', () => { mood.textContent = moods[button.dataset.panel]; document.querySelector('#portrait-wrap').dataset.pose = button.dataset.panel; });
    button.addEventListener('pointerleave', () => { if (document.activeElement !== button) { mood.textContent = '先从一个好问题开始。'; delete document.querySelector('#portrait-wrap').dataset.pose; } });
    button.addEventListener('focus', () => { mood.textContent = moods[button.dataset.panel]; document.querySelector('#portrait-wrap').dataset.pose = button.dataset.panel; });
    button.addEventListener('blur', () => { mood.textContent = '先从一个好问题开始。'; delete document.querySelector('#portrait-wrap').dataset.pose; });
  });
  closeButton.addEventListener('click', closePanel);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closePanel(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanel(); });

  const track = document.querySelector('#project-track');
  const cards = [...(track?.querySelectorAll('.project-card') || [])];
  const moveTrack = direction => {
    if (!track || !cards.length) return;
    const step = cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    track.scrollBy({left: direction * step, behavior: reduced ? 'auto' : 'smooth'});
  };
  document.querySelector('[data-slide="prev"]')?.addEventListener('click', () => moveTrack(-1));
  document.querySelector('[data-slide="next"]')?.addEventListener('click', () => moveTrack(1));
  track?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); moveTrack(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveTrack(-1); }
  });
});

