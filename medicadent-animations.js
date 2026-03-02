/**
 * MedicaDent – Page Animations + FAQ Accordion
 * Dependencies: GSAP 3 + ScrollTrigger
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // FAQ ACCORDION (nahrazuje Webflow IX2)
  // ─────────────────────────────────────────────
  function initAccordion() {
    const accordions = document.querySelectorAll(".faq3_accordion");

    accordions.forEach(function (accordion) {
      const question = accordion.querySelector(".faq3_question");
      const answer = accordion.querySelector(".faq3_answer");

      if (!question || !answer) return;

      // Výchozí stav: zavřeno
      answer.style.height = "0px";
      answer.style.overflow = "hidden";
      answer.style.transition = "height 0.35s ease";

      question.style.cursor = "pointer";

      question.addEventListener("click", function () {
        const isOpen = answer.style.height !== "0px";

        if (isOpen) {
          // Zavřít
          answer.style.height = answer.scrollHeight + "px";
          // Force reflow
          answer.getBoundingClientRect();
          answer.style.height = "0px";
        } else {
          // Otevřít
          answer.style.height = answer.scrollHeight + "px";
          // Po animaci přepnout na auto (aby fungovalo při resize)
          answer.addEventListener(
            "transitionend",
            function () {
              if (answer.style.height !== "0px") {
                answer.style.height = "auto";
              }
            },
            { once: true }
          );
        }
      });
    });
  }

  initAccordion();

  // ─────────────────────────────────────────────
  // GSAP ANIMACE
  // ─────────────────────────────────────────────
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("MedicaDent: GSAP nebo ScrollTrigger není načtený.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  // Loga pojišťoven
  gsap.from(".logo5_logo", {
    scrollTrigger: {
      trigger: ".logo5_list",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 10,
    duration: 0.7,
    stagger: 0.1,
    ease: "power2.out",
  });

  // Formulář — nadpis
  gsap.from(".contact10_heading-wrapper", {
    scrollTrigger: {
      trigger: ".contact10_content-left",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 20,
    duration: 0.9,
    ease: "power2.out",
  });

  // Formulář — form block
  gsap.from(".contact10_form-block", {
    scrollTrigger: {
      trigger: ".contact10_form-block",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 24,
    duration: 1.0,
    ease: "power3.out",
    delay: 0.15,
  });

  // FAQ — accordion položky
  gsap.from(".faq3_accordion", {
    scrollTrigger: {
      trigger: ".faq3_list",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 16,
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
  });

  // FAQ — levý sloupec nadpis
  gsap.from(".faq6_content-left .heading-style-h2", {
    scrollTrigger: {
      trigger: ".faq6_content-left",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 20,
    duration: 0.9,
    ease: "power2.out",
  });

  // FAQ — obrázek
  gsap.from(".faq6_content-left .Image", {
    scrollTrigger: {
      trigger: ".faq6_content-left",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    scale: 0.98,
    duration: 1.1,
    ease: "power2.out",
    delay: 0.2,
  });

  // Hero sekce — čekáme na font
  document.fonts.ready.then(() => {
    const heroTimeline = gsap.timeline({ delay: 0.1 });

    heroTimeline.from(".section_layout9 .text-style-tagline", {
      opacity: 0,
      y: 16,
      duration: 0.8,
      ease: "power2.out",
    });

    heroTimeline.from(
      ".section_layout9 .heading-style-h1",
      {
        opacity: 0,
        y: 24,
        duration: 1.0,
        ease: "power3.out",
      },
      "-=0.5"
    );

    heroTimeline.from(
      ".layout9_component .text-size-medium",
      {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6"
    );

    heroTimeline.from(
      ".layout9_item",
      {
        opacity: 0,
        y: 12,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.4"
    );

    heroTimeline.from(
      ".layout9_image-wrapper",
      {
        opacity: 0,
        x: 20,
        duration: 1.1,
        ease: "power2.out",
      },
      "-=0.9"
    );
  });

})();
