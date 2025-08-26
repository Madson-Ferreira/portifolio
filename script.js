document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const translatableTexts = document.querySelectorAll("[data-en]");
  const formInputs = document.querySelectorAll("#contact-form input, #contact-form textarea");
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const workCards = document.querySelectorAll(".service-card");
  const nav = document.querySelector(".nav-links");

  let currentLang = "pt";

  // Tema
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
    themeToggle.textContent = document.body.classList.contains("dark-theme") ? "🌙" : "☀️";
  });

  // Idioma
  langToggle.addEventListener("click", () => {
    if(currentLang==="pt") currentLang="en";
    else if(currentLang==="en") currentLang="it";
    else currentLang="pt";
    langToggle.textContent = currentLang.toUpperCase();

    translatableTexts.forEach(el=>{
      const text = el.dataset[currentLang];
      if(text) el.textContent=text;
    });

    formInputs.forEach(input=>{
      const placeholder = input.dataset[`placeholder${currentLang}`];
      if(placeholder) input.placeholder = placeholder;
    });

    const btn = contactForm.querySelector("button");
    const btnText = btn.dataset[currentLang];
    if(btnText) btn.textContent=btnText;
  });

  // Menu mobile
  menuToggle.addEventListener("click", ()=>{
    nav.classList.toggle("active");
  });

  // Scroll suave e highlight
  window.addEventListener("scroll", ()=>{
    let pos = window.scrollY + 100;
    navLinks.forEach(link=>{
      const section = document.querySelector(link.getAttribute("href"));
      if(section.offsetTop <= pos && section.offsetTop + section.offsetHeight > pos){
        navLinks.forEach(l=>l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });

  navLinks.forEach(link=>{
    link.addEventListener("click", e=>{
      e.preventDefault();
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      target.scrollIntoView({behavior:"smooth",block:"start"});
      nav.classList.remove("active");
    });
  });

  // Fade-in cards
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.2});
  workCards.forEach(card=>observer.observe(card));

  
  // Formspree
  contactForm.addEventListener("submit", e=>{
    e.preventDefault();
    const data = new FormData(contactForm);
    fetch(contactForm.action,{
      method:"POST",
      body:data,
      headers:{"Accept":"application/json"}
    }).then(response=>{
      if(response.ok){
        formMessage.textContent = currentLang==="pt"?"Mensagem enviada!":currentLang==="en"?"Message sent!":"Messaggio inviato!";
        contactForm.reset();
      } else {
        formMessage.textContent = currentLang==="pt"?"Erro ao enviar.":currentLang==="en"?"Error sending.":"Errore nell'invio.";
      }
    });
  });

});