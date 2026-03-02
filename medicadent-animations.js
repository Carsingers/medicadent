/**
 * MedicaDent – Page Animations + FAQ Accordion
 * Dependencies: GSAP 3 + ScrollTrigger
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // FAQ ACCORDION
  // ─────────────────────────────────────────────
  function initAccordion() {
    var accordions = document.querySelectorAll(".faq3_accordion");
    accordions.forEach(function (accordion) {
      var question = accordion.querySelector(".faq3_question");
      var answer = accordion.querySelector(".faq3_answer");
      if (!question || !answer) return;

      answer.style.height = "0px";
      answer.style.overflow = "hidden";
      answer.style.transition = "height 0.35s ease";
      question.style.cursor = "pointer";

      question.addEventListener("click", function () {
        var isOpen = answer.style.height !== "0px";
        if (isOpen) {
          answer.style.height = answer.scrollHeight + "px";
          answer.getBoundingClientRect();
          answer.style.height = "0px";
        } else {
          answer.style.height = answer.scrollHeight + "px";
          answer.addEventListener("transitionend", function () {
            if (answer.style.height !== "0px") {
              answer.style.height = "auto";
            }
          }, { once: true });
        }
      });
    });
  }

  initAccordion();

  // ─────────────────────────────────────────────
  // GSAP
  // ─────────────────────────────────────────────
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Schovat hero elementy ihned přes GSAP (aby GSAP mohl animovat zpět)
  gsap.set([
    ".section_layout9 .text-style-tagline",
    ".section_layout9 .heading-style-h1",
    ".layout9_component .text-size-medium",
    ".layout9_item",
    ".layout9_image-wrapper"
  ], { opacity: 0 });

  // ─────────────────────────────────────────────
  // HERO animace
  // ─────────────────────────────────────────────
  function runHero() {
    var heroTimeline = gsap.timeline({ delay: 0.1 });

    heroTimeline.to(".section_layout9 .text-style-tagline", {
      opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
    });
    heroTimeline.to(".section_layout9 .heading-style-h1", {
      opacity: 1, y: 0, duration: 1.0, ease: "power3.out",
    }, "-=0.5");
    heroTimeline.to(".layout9_component .text-size-medium", {
      opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
    }, "-=0.6");
    heroTimeline.to(".layout9_item", {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
    }, "-=0.4");
    heroTimeline.to(".layout9_image-wrapper", {
      opacity: 1, x: 0, duration: 1.1, ease: "power2.out",
    }, "-=0.9");
  }

  if (document.readyState === "complete") {
    runHero();
  } else {
    window.addEventListener("load", runHero);
  }

  // ─────────────────────────────────────────────
  // SCROLL ANIMACE
  // ─────────────────────────────────────────────
  gsap.from(".logo5_logo", {
    scrollTrigger: { trigger: ".logo5_list", start: "top 85%", toggleActions: "play none none none" },
    opacity: 0, y: 10, duration: 0.7, stagger: 0.1, ease: "power2.out",
  });

  gsap.from(".contact10_heading-wrapper", {
    scrollTrigger: { trigger: ".contact10_content-left", start: "top 80%", toggleActions: "play none none none" },
    opacity: 0, y: 20, duration: 0.9, ease: "power2.out",
  });

  gsap.from(".contact10_form-block", {
    scrollTrigger: { trigger: ".contact10_form-block", start: "top 85%", toggleActions: "play none none none" },
    opacity: 0, y: 24, duration: 1.0, ease: "power3.out", delay: 0.15,
  });

  gsap.from(".faq3_accordion", {
    scrollTrigger: { trigger: ".faq3_list", start: "top 80%", toggleActions: "play none none none" },
    opacity: 0, y: 16, duration: 0.7, stagger: 0.12, ease: "power2.out",
  });

  gsap.from(".faq6_content-left .heading-style-h2", {
    scrollTrigger: { trigger: ".faq6_content-left", start: "top 80%", toggleActions: "play none none none" },
    opacity: 0, y: 20, duration: 0.9, ease: "power2.out",
  });

  gsap.from(".faq6_content-left .Image", {
    scrollTrigger: { trigger: ".faq6_content-left", start: "top 75%", toggleActions: "play none none none" },
    opacity: 0, scale: 0.98, duration: 1.1, ease: "power2.out", delay: 0.2,
  });

})();
