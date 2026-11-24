const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
let previousScroll = window.scrollY;

function updateScrollUI(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  const current = window.scrollY;
  if(current > 150 && current > previousScroll + 4 && !nav.classList.contains('open')) header.classList.add('header-hidden');
  else if(current < previousScroll - 4 || current < 80) header.classList.remove('header-hidden');
  previousScroll = current;
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
menuButton.addEventListener('click',()=>{
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  header.classList.remove('header-hidden');
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
}));
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
