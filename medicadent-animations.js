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
    // GSAP není — odkrýt hero elementy aby nezůstaly schované
    var els = document.querySelectorAll(
      ".section_layout9 .text-style-tagline, .section_layout9 .heading-style-h1, .layout9_component .text-size-medium, .layout9_item, .layout9_image-wrapper"
    );
    els.forEach(function(el) { el.style.opacity = "1"; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    var els2 = document.querySelectorAll(
      ".section_layout9 .text-style-tagline, .section_layout9 .heading-style-h1, .layout9_component .text-size-medium, .layout9_item, .layout9_image-wrapper"
    );
    els2.forEach(function(el) { el.style.opacity = "1"; });
    return;
  }

  // ─────────────────────────────────────────────
  // HERO — spustit až po plném načtení stránky
  // ─────────────────────────────────────────────
  window.addEventListener("load", function() {
    var heroTimeline = gsap.timeline();

    heroTimeline.from(".section_layout9 .text-style-tagline", {
      opacity: 0, y: 16, duration: 0.8, ease: "power2.out",
    });
    heroTimeline.from(".section_layout9 .heading-style-h1", {
      opacity: 0, y: 24, duration: 1.0, ease: "power3.out",
    }, "-=0.5");
    heroTimeline.from(".layout9_component .text-size-medium", {
      opacity: 0, y: 16, duration: 0.8, ease: "power2.out",
    }, "-=0.6");
    heroTimeline.from(".layout9_item", {
      opacity: 0, y: 12, duration: 0.7, stagger: 0.15, ease: "power2.out",
    }, "-=0.4");
    heroTimeline.from(".layout9_image-wrapper", {
      opacity: 0, x: 20, duration: 1.1, ease: "power2.out",
    }, "-=0.9");
  });

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
