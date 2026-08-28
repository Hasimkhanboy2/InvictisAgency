
document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 5, 4) * 90}ms`;
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));
  }

  const form = document.querySelector("#auditForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Challenge-only flow for now:
      // Later we can connect this form to your existing Google Sheet endpoint.
      window.location.href = "./thank-you/";
    });
  }
});
