/**
 * MedicaDent – Page Animations + FAQ Accordion
 * v4 – dual-page: Home (legacy layout9) + Home Copy (header36)
 * Dependencies: GSAP 3.12.5 + ScrollTrigger (loaded in Webflow page footer)
 *
 * v4 change: LAYOUT31 height-sync now uses ResizeObserver instead of
 * relying only on load/resize events, plus a fonts.ready call — fixes
 * a bug where the image wrapper could end up with 0 height if this
 * script executed/loaded later than the window "load" event, or before
 * web fonts finished swapping in and changing the text column height.
 */
(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // PAGE DETECTION
  // ─────────────────────────────────────────────
  var isHomeCopy = !!document.querySelector(".header36_component");
  var isHome     = !!document.querySelector(".section_layout9");

  // ─────────────────────────────────────────────
  // LAYOUT31 — image height matching
  // CSS grid + aspect-ratio conflict → JS fix
  // Wrapper dostane explicitní výšku = výška content sloupce
  // ─────────────────────────────────────────────
  function syncLayout31Heights() {
    document.querySelectorAll(".layout31_component").forEach(function (comp) {
      var contentLeft  = comp.querySelector(".layout31_content-left");
      var imageWrapper = comp.querySelector(".layout31_image-wrapper");
      if (!contentLeft || !imageWrapper) return;
      imageWrapper.style.height = contentLeft.offsetHeight + "px";
    });
  }

  // Immediate + safety-net calls
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncLayout31Heights);
  } else {
    syncLayout31Heights();
  }
  window.addEventListener("load", syncLayout31Heights);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncLayout31Heights);
  }

  // Robustní varianta: sleduj změny výšky content-left přímo přes
  // ResizeObserver, nezávisle na tom, kdy se tento skript spustí nebo
  // kdy web font doběhne. Pokrývá i pozdní/asynchronní načtení skriptu.
  if ("ResizeObserver" in window) {
    var layout31Observer = new ResizeObserver(function () {
      syncLayout31Heights();
    });
    document.querySelectorAll(".layout31_content-left").forEach(function (el) {
      layout31Observer.observe(el);
    });
  } else {
    // fallback pro staré prohlížeče bez ResizeObserver
    var _layout31ResizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(_layout31ResizeTimer);
      _layout31ResizeTimer = setTimeout(syncLayout31Heights, 120);
    });
  }

  // ─────────────────────────────────────────────
  // BUTTON HOVER — text char roll + squish scale
  // Adapted from Osmo button-038 (osmo.supply)
  // Bezpečné: wrappuje jen text node, neruší DOM
  // ─────────────────────────────────────────────
  function initButtonHover() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var WIDTH_DELTA  = -10; // px squish (matches button-038 defaults)
    var HEIGHT_DELTA = -5;

    function splitBtnText(btn) {
      // Najdi první neprázdný text node (přeskočí SVG/ikony)
      var textNode = null;
      var walker = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          return n.textContent.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      }, false);
      textNode = walker.nextNode();
      if (!textNode) return;

      var text = textNode.textContent;
      var wrapper = document.createElement("span");
      wrapper.className = "md-btn-text";
      Array.from(text).forEach(function (char, i) {
        var span = document.createElement("span");
        span.textContent = char;
        span.className = "md-btn-char";
        span.style.setProperty("--ci", i);
        if (char === " ") span.style.whiteSpace = "pre";
        wrapper.appendChild(span);
      });
      textNode.parentNode.replaceChild(wrapper, textNode);
    }

    function calcScale(btn) {
      var w = btn.offsetWidth;
      var h = btn.offsetHeight;
      if (!w || !h) return;
      btn.style.setProperty("--md-btn-sx", ((w + WIDTH_DELTA) / w).toFixed(4));
      btn.style.setProperty("--md-btn-sy", ((h + HEIGHT_DELTA) / h).toFixed(4));

      // Výpočet shadow offsetu — shadow musí začínat POD spodní hranou buttonu
      // jinak je viditelný v default stavu (button může být vyšší než 1.3em)
      var textEl = btn.querySelector(".md-btn-text");
      var fontSize = parseFloat(getComputedStyle(btn).fontSize) || 16;
      var textOffsetTop = textEl ? textEl.offsetTop : 0;
      // Vzdálenost od horní hrany textu po dolní hranu buttonu + 8px rezerva
      var distPx = h - textOffsetTop + 8;
      btn.style.setProperty("--md-btn-offset", (distPx / fontSize).toFixed(3) + "em");
    }

    var btns = [];
    document.querySelectorAll(".button").forEach(function (btn) {
      if (btn.dataset.mdBtn) return;
      btn.dataset.mdBtn = "1";
      splitBtnText(btn);
      calcScale(btn);
      btns.push(btn);
    });

    var _btnResizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(_btnResizeTimer);
      _btnResizeTimer = setTimeout(function () { btns.forEach(calcScale); }, 120);
    });
  }

  // Spustit po načtení fontů — font ovlivní velikost buttonu
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      document.fonts.ready.then(initButtonHover);
    });
  } else {
    document.fonts.ready.then(initButtonHover);
  }

  // ─────────────────────────────────────────────
  // FAQ ACCORDION — generic
  // ─────────────────────────────────────────────
  function initAccordion(questionSel, answerSel, listSel) {
    var lists = document.querySelectorAll(listSel);
    lists.forEach(function (list) {
      var questions = list.querySelectorAll(questionSel);
      questions.forEach(function (question) {
        var item   = question.closest("[class*='_item']") || question.parentElement;
        var answer = item ? item.querySelector(answerSel) : null;
        if (!answer) return;

        answer.style.height     = "0px";
        answer.style.overflow   = "hidden";
        answer.style.transition = "height 0.35s ease";
        question.style.cursor   = "pointer";

        question.addEventListener("click", function () {
          var isOpen = answer.style.height !== "0px";
          if (isOpen) {
            answer.style.height = answer.scrollHeight + "px";
            answer.getBoundingClientRect();
            answer.style.height = "0px";
          } else {
            answer.style.height = answer.scrollHeight + "px";
            answer.addEventListener("transitionend", function () {
              if (answer.style.height !== "0px") answer.style.height = "auto";
            }, { once: true });
          }
        });
      });
    });
  }

  initAccordion(".faq3_question", ".faq3_answer", ".faq3_list");
  initAccordion(".faq7_question", ".faq7_answer", ".faq7_list");
  initAccordion(".faq6_question", ".faq6_answer", ".faq6_list");

  // ─────────────────────────────────────────────
  // GSAP GUARD
  // ─────────────────────────────────────────────
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ─────────────────────────────────────────────
  // EDITOR / DESIGNER GUARD
  // Webflow Designer přidá wf-design-mode na <html> synchronně.
  // Webflow Editor: Webflow.env('editor') je dostupné po načtení skriptů.
  // V obou případech přeskočíme animace — obsah musí být viditelný.
  // ─────────────────────────────────────────────
  var isEditorMode = document.documentElement.classList.contains("wf-design-mode") ||
    (window.Webflow && typeof window.Webflow.env === "function" && window.Webflow.env("editor"));
  if (isEditorMode) return;

  // ─────────────────────────────────────────────
  // HELPER — safe gsap.from() with ScrollTrigger
  // Používáme from() nikoliv fromTo() — elementy zůstávají viditelné
  // dokud ScrollTrigger neodpálí, pak se animují. Bezpečnější.
  // ─────────────────────────────────────────────
  function scrollFrom(targets, trigger, vars, delay) {
    var els = typeof targets === "string"
      ? document.querySelectorAll(targets)
      : targets;
    if (!els || (els.length !== undefined && els.length === 0)) return;

    gsap.from(els, Object.assign({
      opacity: 0,
      y: 22,
      duration: 0.7,
      ease: "power2.out",
      delay: delay || 0,
      scrollTrigger: {
        trigger: trigger || els,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }, vars));
  }

  // ═════════════════════════════════════════════
  // HOME COPY
  // ═════════════════════════════════════════════
  if (isHomeCopy) {

    // ── HERO (on load) ──────────────────────────
    // Elementy jsou skryté přes <head> CSS (opacity:0; visibility:hidden)
    // gsap.set() přidá Y offset UVNITŘ runHomeCopyHero — nevolá se v editoru
    function runHomeCopyHero() {
      // Nastav počáteční Y/X offsets těsně před animací
      gsap.set([
        ".section_header36 .text-style-tagline",
        ".section_header36 .heading-style-h1",
        ".section_header36 .button-group",
      ], { y: 20 });
      gsap.set(".section_header36 .layout9_item",           { y: 14 });
      gsap.set(".section_header36 .header36_image-wrapper", { x: 28 });

      // Odstraň visibility:hidden — GSAP pak animuje opacity
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

    // ── LAYOUT309 ────────────────────────────────
    // 2 instance: GBT technologie (3 karty) + GBT 8 kroků
    gsap.utils.toArray(".layout309_component").forEach(function (comp) {
      var tagline = comp.querySelector(".text-style-tagline, .overline-wrapper");
      var heading = comp.querySelector(".heading-style-h3, .heading-style-h2");
      var right   = comp.querySelector(".layout309_content-right");
      var items   = comp.querySelectorAll(".layout309_item");

      // Tagline + heading dohromady, staggered
      var topEls = [tagline, heading].filter(Boolean);
      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 22, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (right) {
        gsap.from(right, {
          opacity: 0, y: 18, duration: 0.65, ease: "power2.out", delay: 0.2,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (items.length) {
        gsap.from(items, {
          opacity: 0, y: 26, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.3,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    });

    // ── LAYOUT31 ──────────────────────────────────
    // 2 instance — foto střídá stranu
    gsap.utils.toArray(".layout31_component").forEach(function (comp, i) {
      var tagline      = comp.querySelector(".text-style-tagline, .overline-wrapper");
      var heading      = comp.querySelector(".heading-style-h3, .heading-style-h2");
      var imageWrapper = comp.querySelector(".layout31_image-wrapper");
      var items        = comp.querySelectorAll(".layout31_item");

      // Foto: instance 0 jde z leva, instance 1 z prava
      var imageX = (i === 0) ? -28 : 28;
      if (imageWrapper) {
        gsap.from(imageWrapper, {
          opacity: 0, x: imageX, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      var topEls = [tagline, heading].filter(Boolean);
      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 20, duration: 0.65, stagger: 0.12, ease: "power2.out", delay: 0.1,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (items.length) {
        gsap.from(items, {
          opacity: 0, y: 20, duration: 0.55, stagger: 0.1, ease: "power2.out", delay: 0.25,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    });

    // ── LAYOUT21 ──────────────────────────────────
    gsap.utils.toArray(".layout21_component").forEach(function (comp) {
      var tagline = comp.querySelector(".text-style-tagline, .overline-wrapper");
      var heading = comp.querySelector(".heading-style-h2, .heading-style-h3");
      var topEls  = [tagline, heading].filter(Boolean);

      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 20, duration: 0.65, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      var rest = Array.from(comp.children).filter(function (el) {
        return !topEls.includes(el);
      });
      if (rest.length) {
        gsap.from(rest, {
          opacity: 0, y: 22, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    });

    // ── HEADER80 — Karolína ───────────────────────
    (function () {
      var comp = document.querySelector(".header80_component");
      if (!comp) return;

      var tagline = comp.querySelector(".text-style-tagline, .overline-wrapper");
      var heading = comp.querySelector(".heading-style-h2, .heading-style-h3");
      var images  = comp.querySelector(".header80_images-wrapper");
      var content = comp.querySelector(".header80_content");

      if (images) {
        gsap.from(images, {
          opacity: 0, x: -28, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      var topEls = [tagline, heading].filter(Boolean);
      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 20, duration: 0.65, stagger: 0.12, ease: "power2.out", delay: 0.15,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (content) {
        gsap.from(content, {
          opacity: 0, y: 20, duration: 0.65, ease: "power2.out", delay: 0.25,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    })();

    // ── FAQ7 ──────────────────────────────────────
    (function () {
      var comp = document.querySelector(".faq7_component");
      if (!comp) return;

      var tagline = comp.querySelector(".text-style-tagline, .overline-wrapper");
      var heading = comp.querySelector(".heading-style-h2, h2");
      var items   = comp.querySelectorAll(".faq7_item, .faq7_accordion");

      var topEls = [tagline, heading].filter(Boolean);
      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 20, duration: 0.65, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (items.length) {
        gsap.from(items, {
          opacity: 0, y: 18, duration: 0.55, stagger: 0.09, ease: "power2.out", delay: 0.2,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    })();

    // ── FAQ6 ──────────────────────────────────────
    (function () {
      var comp = document.querySelector(".faq6_component");
      if (!comp) return;

      var tagline = comp.querySelector(".faq6_content-left .text-style-tagline, .faq6_content-left .overline-wrapper");
      var heading = comp.querySelector(".faq6_content-left .heading-style-h2");
      var image   = comp.querySelector(".faq6_content-left .Image, .faq6_content-left img");

      var topEls = [tagline, heading].filter(Boolean);
      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 20, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (image) {
        gsap.from(image, {
          opacity: 0, scale: 0.98, duration: 1.0, ease: "power2.out", delay: 0.2,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    })();

    // ── CTA29 — Peak-End ──────────────────────────
    (function () {
      var comp = document.querySelector(".cta29_component");
      if (!comp) return;

      var tagline = comp.querySelector(".text-style-tagline, .overline-wrapper");
      var heading = comp.querySelector(".heading-style-h2, h2");
      var sub     = comp.querySelector(".text-size-medium, p");
      var buttons = comp.querySelector(".button-group");

      var topEls = [tagline, heading, sub].filter(Boolean);
      if (topEls.length) {
        gsap.from(topEls, {
          opacity: 0, y: 22, duration: 0.7, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (buttons) {
        gsap.from(buttons, {
          opacity: 0, y: 16, duration: 0.55, ease: "power2.out", delay: 0.35,
          scrollTrigger: { trigger: comp, start: "top 85%", toggleActions: "play none none none" },
        });
      }
    })();

  } // end isHomeCopy

  // ═════════════════════════════════════════════
  // HOME (LEGACY)
  // ═════════════════════════════════════════════
  if (isHome) {
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
      tl.to(".section_layout9 .text-style-tagline", { opacity: 1, y: 0, duration: 0.8,  ease: "power2.out" }, 0);
      tl.to(".section_layout9 .heading-style-h1",   { opacity: 1, y: 0, duration: 1.0,  ease: "power3.out" }, 0.2);
      tl.to(".layout9_component .text-size-medium",  { opacity: 1, y: 0, duration: 0.8,  ease: "power2.out" }, 0.4);
      tl.to(".layout9_item",                         { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out" }, 0.55);
      tl.to(".layout9_image-wrapper",                { opacity: 1, x: 0, duration: 1.1,  ease: "power2.out" }, 0.2);
      tl.to(".logo5_content",                        { opacity: 1, y: 0, duration: 0.7,  ease: "power2.out" }, 0.9);
    }

    if (document.readyState === "complete") {
      runHomeHero();
    } else {
      window.addEventListener("load", runHomeHero);
    }

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
