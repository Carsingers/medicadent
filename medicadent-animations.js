/**
 * MedicaDent – Page Animations + FAQ Accordion
 * v2 – dual-page: Home (legacy layout9) + Home Copy (header36)
 * Dependencies: GSAP 3.12.5 + ScrollTrigger (loaded in Webflow page footer)
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // PAGE DETECTION
  // ─────────────────────────────────────────────
  var isHomeCopy = !!document.querySelector(".header36_component");
  var isHome     = !!document.querySelector(".section_layout9");

  // ─────────────────────────────────────────────
  // FAQ ACCORDION — generic, works for any faq*_question / faq*_answer pair
  // ─────────────────────────────────────────────
  function initAccordion(questionSel, answerSel, listSel) {
    var lists = document.querySelectorAll(listSel);
    lists.forEach(function (list) {
      var questions = list.querySelectorAll(questionSel);
      questions.forEach(function (question) {
        var item = question.closest("[class*='_item']") || question.parentElement;
        var answer = item ? item.querySelector(answerSel) : null;
        if (!question || !answer) return;

        answer.style.height    = "0px";
        answer.style.overflow  = "hidden";
        answer.style.transition = "height 0.35s ease";
        question.style.cursor  = "pointer";

        question.addEventListener("click", function () {
          var isOpen = answer.style.height !== "0px";
          if (isOpen) {
            answer.style.height = answer.scrollHeight + "px";
            answer.getBoundingClientRect(); // force reflow
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
    });
  }

  // Old Home: faq3
  initAccordion(".faq3_question", ".faq3_answer", ".faq3_list");

  // Home Copy: faq7 (first FAQ) and faq6 (second FAQ)
  initAccordion(".faq7_question", ".faq7_answer", ".faq7_list");
  initAccordion(".faq6_question", ".faq6_answer", ".faq6_list");

  // ─────────────────────────────────────────────
  // GSAP GUARD
  // ─────────────────────────────────────────────
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ─────────────────────────────────────────────
  // ─── HOME COPY ANIMATIONS ───────────────────
  // ─────────────────────────────────────────────
  if (isHomeCopy) {

    // ── HERO (on load) ──────────────────────────
    // Elements start hidden via <head> CSS (opacity:0; visibility:hidden)
    // gsap.set() adds the Y/X offset, then timeline reveals everything
    gsap.set([
      ".section_header36 .text-style-tagline",
      ".section_header36 .heading-style-h1",
      ".section_header36 .button-group",
    ], { y: 20 });

    gsap.set(".section_header36 .layout9_item",          { y: 14 });
    gsap.set(".section_header36 .header36_image-wrapper", { x: 28 });

    function runHomeCopyHero() {
      gsap.set([
        ".section_header36 .text-style-tagline",
        ".section_header36 .heading-style-h1",
        ".section_header36 .button-group",
        ".section_header36 .layout9_item",
        ".section_header36 .header36_image-wrapper",
      ], { visibility: "visible" });

      var tl = gsap.timeline({ delay: 0.1 });

      tl.to(".section_header36 .text-style-tagline", {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
      }, 0);

      tl.to(".section_header36 .heading-style-h1", {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      }, 0.18);

      tl.to(".section_header36 .button-group", {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
      }, 0.42);

      tl.to(".section_header36 .layout9_item", {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out",
      }, 0.52);

      tl.to(".section_header36 .header36_image-wrapper", {
        opacity: 1, x: 0, duration: 1.05, ease: "power2.out",
      }, 0.15);
    }

    if (document.readyState === "complete") {
      runHomeCopyHero();
    } else {
      window.addEventListener("load", runHomeCopyHero);
    }

    // ── HELPER: scroll fromTo ─────────────────
    function scrollFrom(targets, trigger, fromVars, toVars, offset) {
      if (!targets || (typeof targets === "string" && !document.querySelector(targets))) return;
      gsap.fromTo(targets, fromVars, Object.assign({}, toVars, {
        scrollTrigger: {
          trigger: trigger,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        delay: offset || 0,
      }));
    }

    // ── LAYOUT309 ────────────────────────────────
    // Two instances:
    //   #1 → 3-column grid: PIEZON / AIRFLOW / PERIOFLOW
    //   #2 → 8-step GBT numbered cards
    gsap.utils.toArray(".layout309_component").forEach(function (comp) {
      var heading = comp.querySelector(".layout309_content-left .heading-style-h3");
      var right   = comp.querySelector(".layout309_content-right");
      var items   = comp.querySelectorAll(".layout309_item");

      var tl = gsap.timeline({
        scrollTrigger: { trigger: comp, start: "top 80%", toggleActions: "play none none none" },
      });

      if (heading) {
        tl.fromTo(heading,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0
        );
      }
      if (right) {
        tl.fromTo(right,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
          heading ? 0.2 : 0
        );
      }
      if (items.length) {
        tl.fromTo(items,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.11, ease: "power2.out" },
          0.35
        );
      }
    });

    // ── LAYOUT31 ──────────────────────────────────
    // Two instances — image alternates left/right
    gsap.utils.toArray(".layout31_component").forEach(function (comp, i) {
      var imageWrapper = comp.querySelector(".layout31_image-wrapper");
      var items        = comp.querySelectorAll(".layout31_item");

      // Instance 0: image left → slide from left (-28)
      // Instance 1: image right → slide from right (28)
      var imageX = (i === 0) ? -28 : 28;

      var tl = gsap.timeline({
        scrollTrigger: { trigger: comp, start: "top 80%", toggleActions: "play none none none" },
      });

      if (imageWrapper) {
        tl.fromTo(imageWrapper,
          { opacity: 0, x: imageX },
          { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" },
          0
        );
      }
      if (items.length) {
        tl.fromTo(items,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
          imageWrapper ? 0.25 : 0
        );
      }
    });

    // ── LAYOUT21 ──────────────────────────────────
    gsap.utils.toArray(".layout21_component").forEach(function (comp) {
      var children = Array.from(comp.children);
      if (!children.length) return;

      gsap.fromTo(children,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    });

    // ── HEADER80 — Karolína section ───────────────
    (function () {
      var comp = document.querySelector(".header80_component");
      if (!comp) return;

      var images  = comp.querySelector(".header80_images-wrapper");
      var content = comp.querySelector(".header80_content");

      var tl = gsap.timeline({
        scrollTrigger: { trigger: comp, start: "top 80%", toggleActions: "play none none none" },
      });

      if (images) {
        tl.fromTo(images,
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, duration: 0.85, ease: "power2.out" },
          0
        );
      }
      if (content) {
        tl.fromTo(content,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          images ? 0.3 : 0
        );
      }
    })();

    // ── FAQ7 — first FAQ section ───────────────────
    (function () {
      var comp = document.querySelector(".faq7_component");
      if (!comp) return;

      var heading = comp.querySelector(".heading-style-h2") || comp.querySelector("h2");
      var items   = comp.querySelectorAll(".faq7_item, .faq7_accordion");

      var tl = gsap.timeline({
        scrollTrigger: { trigger: comp, start: "top 82%", toggleActions: "play none none none" },
      });

      if (heading) {
        tl.fromTo(heading,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
          0
        );
      }
      if (items.length) {
        tl.fromTo(items,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
          heading ? 0.2 : 0
        );
      } else if (comp.children.length > 1) {
        // Fallback: animate direct children
        tl.fromTo(Array.from(comp.children).slice(1),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
          0.2
        );
      }
    })();

    // ── FAQ6 — second FAQ section (image + accordion) ──
    gsap.from(".faq6_content-left .heading-style-h2", {
      scrollTrigger: { trigger: ".faq6_content-left", start: "top 80%", toggleActions: "play none none none" },
      opacity: 0, y: 20, duration: 0.9, ease: "power2.out",
    });

    gsap.from(".faq6_content-left .Image, .faq6_content-left img", {
      scrollTrigger: { trigger: ".faq6_content-left", start: "top 75%", toggleActions: "play none none none" },
      opacity: 0, scale: 0.98, duration: 1.1, ease: "power2.out", delay: 0.2,
    });

    // ── CTA29 — Peak-End final CTA ─────────────────
    (function () {
      var comp = document.querySelector(".cta29_component");
      if (!comp) return;

      var heading = comp.querySelector(".heading-style-h2") || comp.querySelector("h2");
      var sub     = comp.querySelector(".text-size-medium, p");
      var buttons = comp.querySelector(".button-group");

      var tl = gsap.timeline({
        scrollTrigger: { trigger: comp, start: "top 80%", toggleActions: "play none none none" },
      });

      if (heading) {
        tl.fromTo(heading,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" },
          0
        );
      }
      if (sub) {
        tl.fromTo(sub,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.2
        );
      }
      if (buttons) {
        tl.fromTo(buttons,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          0.38
        );
      }
    })();

  } // end isHomeCopy


  // ─────────────────────────────────────────────
  // ─── HOME (LEGACY) ANIMATIONS ───────────────
  // ─────────────────────────────────────────────
  if (isHome) {

    // Hide hero elements at correct start position
    gsap.set(".section_layout9 .text-style-tagline", { opacity: 0, y: 16 });
    gsap.set(".section_layout9 .heading-style-h1",   { opacity: 0, y: 24 });
    gsap.set(".layout9_component .text-size-medium",  { opacity: 0, y: 16 });
    gsap.set(".layout9_item",                         { opacity: 0, y: 12 });
    gsap.set(".layout9_image-wrapper",                { opacity: 0, x: 20 });
    gsap.set(".logo5_content",                        { opacity: 0, y: 12 });

    function runHomeHero() {
      gsap.set([
        ".section_layout9 .text-style-tagline",
        ".section_layout9 .heading-style-h1",
        ".layout9_component .text-size-medium",
        ".layout9_item",
        ".layout9_image-wrapper",
        ".logo5_content",
      ], { visibility: "visible" });

      var tl = gsap.timeline({ delay: 0.1 });

      tl.to(".section_layout9 .text-style-tagline", {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
      }, 0);

      tl.to(".section_layout9 .heading-style-h1", {
        opacity: 1, y: 0, duration: 1.0, ease: "power3.out",
      }, 0.2);

      tl.to(".layout9_component .text-size-medium", {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
      }, 0.4);

      tl.to(".layout9_item", {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
      }, 0.55);

      tl.to(".layout9_image-wrapper", {
        opacity: 1, x: 0, duration: 1.1, ease: "power2.out",
      }, 0.2);

      tl.to(".logo5_content", {
        opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
      }, 0.9);
    }

    if (document.readyState === "complete") {
      runHomeHero();
    } else {
      window.addEventListener("load", runHomeHero);
    }

    // Scroll triggers — Home
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

  } // end isHome

})();
