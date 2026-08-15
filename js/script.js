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

/* ============================================================
UNIFIED PROCESS
Website Development + Organic Social Media Marketing
============================================================ */
const process=document.querySelector('.process');
const steps=[...document.querySelectorAll('.step[data-step]')];
const processDetail=document.querySelector('.process-detail');

const processData=[
  {
    title:'UNDERSTAND',
    flow:'Business → Customer → Competitor → Goal',
    text:'Understand what you offer, who you want to reach, and what customers need before deciding what to build.'
  },
  {
    title:'FIND THE GAPS',
    flow:'Visibility → Trust → Clarity → Conversion',
    text:'Find weaknesses across your website and social presence that may be costing you attention or inquiries.'
  },
  {
    title:'BUILD THE PRESENCE',
    flow:'Website → Content → Social → Customer Journey',
    text:'Build the digital presence around how your customers actually discover, evaluate, and contact your business.'
  },
  {
    title:'ATTRACT & ENGAGE',
    flow:'Content → Reach → Trust → Action',
    text:'Create and publish useful organic content that keeps your business visible and gives potential customers reasons to trust you.'
  },
  {
    title:'MEASURE & IMPROVE',
    flow:'Review → Learn → Improve → Repeat',
    text:'Use real performance and feedback to improve the website, content, and customer journey over time.'
  }
];

let currentStep=1;

function renderProcessDetail(stepNumber,animate=true){
  if(!processDetail)return;
  const data=processData[stepNumber-1];

  const update=()=>{
    processDetail.querySelector('.process-detail-label span').textContent=String(stepNumber).padStart(2,'0');
    processDetail.querySelector('.process-detail-label b').textContent=data.title;
    processDetail.querySelector('.process-detail-main strong').textContent=data.flow;
    processDetail.querySelector('.process-detail-main p').textContent=data.text;
    processDetail.classList.remove('is-changing');
  };

  if(animate){
    processDetail.classList.add('is-changing');
    window.setTimeout(update,160);
  }else{
    update();
  }
}

function activateProcessStep(stepNumber,animate=true){
  currentStep=stepNumber;

  if(process){
    process.dataset.progress=String(stepNumber);
  }

  steps.forEach(step=>{
    const active=Number(step.dataset.step)===stepNumber;
    step.classList.toggle('is-active',active);
    step.setAttribute('aria-pressed',String(active));
  });

  renderProcessDetail(stepNumber,animate);
}

steps.forEach(step=>{
  step.addEventListener('click',()=>{
    activateProcessStep(Number(step.dataset.step),true);
  });

  step.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      activateProcessStep(Number(step.dataset.step),true);
    }
  });
});

if(process && steps.length){
  const processObserver=new IntersectionObserver(entries=>{
    const visible=entries
      .filter(e=>e.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];

    if(!visible)return;

    const current=Number(visible.target.dataset.step);
    if(current!==currentStep)activateProcessStep(current,false);
  },{rootMargin:'-35% 0px -45% 0px',threshold:.2});

  steps.forEach(step=>processObserver.observe(step));
}

renderProcessDetail(1,false);

document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-placeholder]").forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  alert("Placeholder link. Replace this with your real project, social or booking URL before launch.");
}));

/* ============================================================
INVICTIS LEAD FORM
Browser-resilient submission to Apps Script.
The backend remains the source of truth for validation/duplicates.
============================================================ */
(function initLeadForm(){
  const form = document.getElementById("review-form");
  if(!form) return;

  const ENDPOINT = "https://script.google.com/macros/s/AKfycby_AW-SQVPQTIaz0tzOmOtgLCg5Rj5NxZlrwBPLwXDs6T_Wcmsi_rPTRuSe0IyfIPHB/exec";
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById("form-status");

  function setStatus(message,state){
    if(!status) return;
    status.textContent=message;
    status.dataset.state=state||"";
  }

  function normalizePhone(value){
    let digits=String(value||"").replace(/\D/g,"");
    if(digits.startsWith("91") && digits.length===12) digits=digits.slice(2);
    return digits;
  }

  function validIndianPhone(value){
    return /^[6-9]\d{9}$/.test(normalizePhone(value));
  }

  function validEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||"").trim());
  }

  function showSuccess(){
    form.innerHTML =
      '<header><b>THANK YOU</b><small>Your details have been received.</small></header>' +
      '<div class="form-success">' +
      '<div class="form-success-mark" aria-hidden="true">✓</div>' +
      '<h3>We have your details.</h3>' +
      '<p>We\'ll review your business and contact you using the details you provided.</p>' +
      '<a class="btn btn-primary" href="#home">Back to website ↗</a>' +
      '</div>';
  }

  function restoreButton(){
    if(button){
      button.disabled=false;
      button.innerHTML='Send My Details ↗';
    }
    form.dataset.submitting="false";
  }

  form.addEventListener("submit", async function(event){
    event.preventDefault();
    if(form.dataset.submitting==="true") return;

    const formData = new FormData(form);
    const name=String(formData.get("name")||"").trim();
    const business=String(formData.get("business")||"").trim();
    const email=String(formData.get("email")||"").trim().toLowerCase();
    const phone=String(formData.get("phone")||"").trim();
    const honeypot=String(formData.get("website")||"").trim();

    if(honeypot){setStatus("Please submit the form normally.","error");return;}
    if(name.length<2){setStatus("Please enter your name.","error");form.elements.name?.focus();return;}
    if(business.length<2){setStatus("Please enter your business name.","error");form.elements.business?.focus();return;}
    if(!validEmail(email)){setStatus("Please enter a valid email address.","error");form.elements.email?.focus();return;}
    if(!validIndianPhone(phone)){setStatus("Please enter a valid 10-digit Indian mobile number.","error");form.elements.phone?.focus();return;}

    form.dataset.submitting="true";
    if(button){button.disabled=true;button.innerHTML="Sending...";}

    setStatus("Sending your details securely...","loading");

    try{
      /*
       * no-cors keeps this a simple cross-origin POST and avoids a CORS
       * preflight. Apps Script still receives and validates the lead.
       */
      await fetch(ENDPOINT,{
        method:"POST",
        mode:"no-cors",
        body:new URLSearchParams(
          Array.from(formData.entries()).map(([k,v])=>[k,String(v)])
        ),
        keepalive:true
      });

      /*
       * An opaque no-cors response cannot expose the backend JSON.
       * We therefore show success only after the browser successfully
       * hands the POST to the endpoint. The backend remains responsible
       * for rejecting duplicates/spam.
       */
      showSuccess();

    }catch(error){
      console.error("Invictis form submission failed:",error);
      setStatus("We couldn't send the form. Please try again or email hello@invictisagency.co.in.","error");
      restoreButton();
    }
  });
})();

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


/* ============================================================
v1.8 ADDITIONS
============================================================ */
(function(){
  const assistant = document.getElementById("assistant");
  const toggle = assistant?.querySelector(".assistant-toggle");
  const panel = document.getElementById("assistant-panel");
  const close = assistant?.querySelector(".assistant-close");
  const messages = document.getElementById("assistant-messages");
  const options = document.getElementById("assistant-options");
  const input = document.getElementById("assistant-input");
  const send = document.getElementById("assistant-send");

  if(!assistant || !toggle || !panel || !messages || !options) return;

  const topics = {
    website: {
      label:"Website",
      answer:"We build conversion-focused websites for local service and home/interior businesses. The founding trial starts with a strong one-page website foundation. Additional pages and ongoing website work can continue under a paid monthly plan.",
      options:["30-Day Trial","What is included?","Apply now"]
    },
    trial: {
      label:"30-Day Trial",
      answer:"The Founding Client Program is a 30-day free trial for the first 3 selected businesses. It starts with a business and online presence audit, a conversion-focused one-page website and agreed organic growth support.",
      options:["What happens after 30 days?","Apply now"]
    },
    services: {
      label:"Services",
      answer:"Our core services are Website Design & Development, Business & Website Audit, Organic Social Media and Content Strategy. We can also add analytics, Search Console, chat, email follow-up and other integrations when they make sense.",
      options:["Website","Organic Social","Apply now"]
    },
    growth: {
      label:"Organic Growth",
      answer:"Our growth direction combines content strategy, useful content, organic social publishing and measurement. The goal is to keep the business visible and give potential customers more reasons to trust and contact it.",
      options:["What is the 3-month plan?","Apply now"]
    },
    analytics: {
      label:"Analytics",
      answer:"Client websites can include Google Analytics 4 and Google Search Console setup so the business can understand traffic, search visibility and important customer actions.",
      options:["Website","Apply now"]
    },
    chat: {
      label:"Chat Assistant",
      answer:"We can add a lightweight website assistant that answers common questions, explains services, qualifies basic intent and directs visitors to the right next action. More advanced AI automation can be added later when it is justified.",
      options:["Apply now"]
    },
    apply: {
      label:"Apply",
      answer:"Tell us about your business using the application form. We will review the details and decide whether the founding program is a sensible fit.",
      options:["Open application"]
    }
  };

  function addMessage(text, type="bot"){
    const el=document.createElement("div");
    el.className="assistant-msg "+type;
    el.textContent=text;
    messages.appendChild(el);
    messages.scrollTop=messages.scrollHeight;
  }

  function renderOptions(list){
    options.innerHTML="";
    list.forEach(label=>{
      const b=document.createElement("button");
      b.type="button"; b.className="assistant-option"; b.textContent=label;
      b.addEventListener("click",()=>handle(label));
      options.appendChild(b);
    });
  }

  function handle(label){
    addMessage(label,"user");
    const q=label.toLowerCase();
    if(q.includes("apply") || q.includes("open application")){
      addMessage("The application form is at the bottom of the page. It sends the details to the Invictis lead inbox.");
      renderOptions(["Open application"]);
      document.getElementById("contact")?.scrollIntoView({behavior:"smooth"});
      return;
    }
    let key="services";
    if(q.includes("website")) key="website";
    else if(q.includes("trial") || q.includes("30")) key="trial";
    else if(q.includes("social") || q.includes("growth")) key="growth";
    else if(q.includes("analytics") || q.includes("search")) key="analytics";
    else if(q.includes("chat")) key="chat";
    const item=topics[key];
    addMessage(item.answer);
    renderOptions(item.options);
  }

  function openAssistant(){
    panel.hidden=false;
    toggle.setAttribute("aria-expanded","true");
    if(!messages.children.length){
      addMessage("Hi, I'm the Invictis Assistant. I can answer quick questions about websites, the founding trial, organic growth and what we can build.");
      renderOptions(["Website","30-Day Trial","Services","Organic Growth","Analytics","Chat Assistant"]);
    }
  }
  function closeAssistant(){
    panel.hidden=true;
    toggle.setAttribute("aria-expanded","false");
  }

  toggle.addEventListener("click",()=>panel.hidden ? openAssistant() : closeAssistant());
  close?.addEventListener("click",closeAssistant);
  send?.addEventListener("click",()=>{
    const value=input.value.trim();
    if(!value)return;
    addMessage(value,"user");
    input.value="";
    const q=value.toLowerCase();
    let key="services";
    if(q.includes("website")||q.includes("site")) key="website";
    else if(q.includes("trial")||q.includes("free")||q.includes("30 day")) key="trial";
    else if(q.includes("social")||q.includes("content")||q.includes("blog")) key="growth";
    else if(q.includes("analytics")||q.includes("ga4")||q.includes("search console")) key="analytics";
    else if(q.includes("chat")||q.includes("ai")) key="chat";
    else if(q.includes("apply")||q.includes("contact")||q.includes("start")) key="apply";
    const item=topics[key];
    addMessage(item.answer);
    renderOptions(item.options);
  });
  input?.addEventListener("keydown",e=>{if(e.key==="Enter")send.click()});
})();


