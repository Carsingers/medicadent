/**
 * MedicaDent – Page Animations
 * Luxury, subtle, performance-first
 * Dependencies: GSAP 3 + ScrollTrigger
 */

(function () {
  "use strict";

  // Čekáme na GSAP
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("MedicaDent: GSAP nebo ScrollTrigger není načtený.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Respektujeme prefers-reduced-motion
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  // ─────────────────────────────────────────────
  // 1. HERO SEKCE — fade + slide při načtení
  // ─────────────────────────────────────────────
  const heroTimeline = gsap.timeline({ delay: 0.15 });

  // Tagline "SPOUŠTÍME PŘEDREGISTRACE"
  heroTimeline.from(".text-style-tagline", {
    opacity: 0,
    y: 16,
    duration: 0.8,
    ease: "power2.out",
  });

  // Hlavní nadpis
  heroTimeline.from(
    ".heading-style-h1",
    {
      opacity: 0,
      y: 24,
      duration: 1.0,
      ease: "power3.out",
    },
    "-=0.5"
  );

  // Perex text
  heroTimeline.from(
    ".text-size-medium",
    {
      opacity: 0,
      y: 16,
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.6"
  );

  // Feature položky (checkmarky) — staggered
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

  // Obrázek ordinace — jemný fade zleva
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

  // ─────────────────────────────────────────────
  // 2. LOGA POJIŠŤOVEN — fade při scrollu
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // 3. FORMULÁŘ SEKCE — elegantní fade-in
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // 4. FAQ SEKCE — accordion položky
  // ─────────────────────────────────────────────
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

  // FAQ nadpis sekce
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

  // Obrázek ordinace v FAQ sekci
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
})();
