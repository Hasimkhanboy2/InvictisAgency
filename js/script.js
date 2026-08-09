/* ============================================================
INVICTIS INTERACTIONS
EDIT: animation speed and star density can be adjusted here.
============================================================ */
const canvas=document.getElementById("starfield"),ctx=canvas.getContext("2d");
let stars=[],w=0,h=0;
function resize(){
  const d=Math.min(devicePixelRatio||1,2);
  w=innerWidth;h=innerHeight;
  canvas.width=w*d;canvas.height=h*d;
  canvas.style.width=w+"px";canvas.style.height=h+"px";
  ctx.setTransform(d,0,0,d,0,0);
  const n=Math.min(150,Math.max(70,Math.floor(w*h/11000)));
  stars=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,s:Math.random()*1.35+.25,v:Math.random()*.22+.05,o:Math.random()*.65+.15,dx:(Math.random()-.5)*.08}));
}
function starsFrame(){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){
    s.y+=s.v;s.x+=s.dx;
    if(s.y>h+4){s.y=-4;s.x=Math.random()*w}
    if(s.x<-4)s.x=w+4;if(s.x>w+4)s.x=-4;
    ctx.beginPath();ctx.arc(s.x,s.y,s.s,0,Math.PI*2);
    ctx.fillStyle=`rgba(211,193,255,${s.o})`;ctx.fill();
  }
  requestAnimationFrame(starsFrame);
}
addEventListener("resize",resize);resize();starsFrame();

/* Mobile menu */
const menu=document.querySelector(".menu"),nav=document.querySelector(".nav-links");
menu?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menu.setAttribute("aria-expanded",open);
});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  nav.classList.remove("open");menu.setAttribute("aria-expanded","false");
}));

/* Scroll reveal */
const observer=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}
}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));

/* ============================================================
ACTIVE HEADER NAV
The yellow line follows the section currently visible on screen.
============================================================ */
const navLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections=[...document.querySelectorAll('main section[id]')];
function setActive(id){
  navLinks.forEach(link=>{
    const active=link.getAttribute('href')===`#${id}`;
    link.classList.toggle('active',active);
    if(active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}
const sectionObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(visible) setActive(visible.target.id);
},{rootMargin:'-35% 0px -50% 0px',threshold:[0,.15,.35,.6]});
sections.forEach(section=>sectionObserver.observe(section));

/* Card stagger: apply small, consistent delays only to grouped cards. */
['.audiences','.services','.pillars','.work-grid','.process'].forEach(selector=>{
  const group=document.querySelector(selector);
  if(!group)return;
  group.querySelectorAll(':scope > .reveal').forEach((item,index)=>{
    item.style.transitionDelay=`${Math.min(index*100,400)}ms`;
  });
});

/* Smooth FAQ accordion */
const faqItems=[...document.querySelectorAll('.faq details')];
faqItems.forEach(details=>{
  const summary=details.querySelector('summary');
  const content=details.querySelector('p');
  if(!summary||!content)return;
  summary.addEventListener('click',event=>{
    event.preventDefault();
    const open=!details.classList.contains('is-open');
    faqItems.forEach(item=>{
      item.classList.remove('is-open');
      item.removeAttribute('open');
      const p=item.querySelector('p');
      if(p)p.style.maxHeight='0px';
    });
    if(open){
      details.classList.add('is-open');
      details.setAttribute('open','');
      content.style.maxHeight=content.scrollHeight+'px';
    }
  });
});

/* Process progression */
const process=document.querySelector('.process');
const steps=[...document.querySelectorAll('.step[data-step]')];
if(process && steps.length){
  const processObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    const current=Number(visible.target.dataset.step);
    process.dataset.progress=current;
    steps.forEach(step=>step.classList.toggle('is-active',Number(step.dataset.step)<=current));
  },{rootMargin:'-35% 0px -45% 0px',threshold:.2});
  steps.forEach(step=>processObserver.observe(step));
}

document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-placeholder]").forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  alert("Placeholder link. Replace this with your real project, social or booking URL before launch.");
}));

document.getElementById("review-form")?.addEventListener("submit",e=>{
  e.preventDefault();
  const b=e.currentTarget.querySelector("button"),old=b.innerHTML;
  b.innerHTML="Demo submitted ✓";b.disabled=true;
  setTimeout(()=>{b.innerHTML=old;b.disabled=false;e.currentTarget.reset()},2200);
});

/* ============================================================
CONTINUOUS TICKER
Important: do not use translateX(-50%) here. Percentage-based
marquees can reveal a blank area when the viewport is wider than
the content or when font metrics change. We measure one exact
content group in pixels, duplicate it enough times to cover the
viewport, and move exactly one group per cycle.
============================================================ */
(function initContinuousTicker(){
  const ticker=document.querySelector('.ticker');
  const track=ticker?.querySelector('.ticker-track');
  const source=track?.querySelector('.ticker-group');
  if(!ticker || !track || !source) return;

  let resizeObserver;

  function buildTicker(){
    // Keep the first group as the source. Remove previously generated copies.
    track.querySelectorAll('.ticker-group[data-ticker-clone="true"]').forEach(el=>el.remove());

    // Clone enough identical groups so the viewport is always filled
    // even during the transition/reset point.
    const sourceWidth=source.getBoundingClientRect().width;
    if(!sourceWidth) return;

    const minimumWidth=Math.max(window.innerWidth*2.5, sourceWidth*3);
    while(track.scrollWidth < minimumWidth){
      const clone=source.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      clone.setAttribute('data-ticker-clone','true');
      track.appendChild(clone);
    }

    // The animation travels exactly one source group. Because the next
    // group is identical, the end frame and start frame are visually equal.
    const shift=source.getBoundingClientRect().width;
    const duration=Math.max(12, Math.min(28, shift/42));

    track.style.setProperty('--ticker-shift', `${shift}px`);
    track.style.setProperty('--ticker-duration', `${duration}s`);
    track.classList.add('ticker-ready');
  }

  function start(){
    buildTicker();
    if(document.fonts?.ready){
      document.fonts.ready.then(buildTicker);
    }
  }

  start();

  if('ResizeObserver' in window){
    resizeObserver=new ResizeObserver(()=>buildTicker());
    resizeObserver.observe(source);
  }else{
    window.addEventListener('resize',buildTicker,{passive:true});
  }
})();

