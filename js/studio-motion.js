/* ============================================================
   Scroll-driven motion for /studio, built on GSAP + ScrollTrigger
   (loaded via CDN in each page's <head>/<body> before this file).
   Respects prefers-reduced-motion throughout: if the user has
   that preference, or GSAP failed to load, content stays fully
   visible and static — nothing here should ever hide content
   permanently.
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapReady = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (!gsapReady || reduceMotion) {
    // No JS-driven motion: leave everything in its natural, visible state.
    return;
  }

  document.documentElement.classList.add("js-motion-ready");
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Maroon hero: two clip-path wipes tied to scroll ----------
       Wipe 1: a solid-maroon panel grows up from the bottom over the
       panning photo grid as the visitor scrolls through the hero, so the
       grid "fades from down to up" into a plain maroon background.
       Wipe 2: a solid-white panel does the same over the tail of the
       maroon zone (hero + intro), so the page settles to white right
       before the next (white) section begins. */
    const heroPan = document.querySelector("[data-hero-pan]");
    const maroonWipe = document.querySelector("[data-wipe-maroon]");
    if (heroPan && maroonWipe) {
      gsap.fromTo(
        maroonWipe,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: heroPan,
            start: "top top",
            end: "bottom top",
            scrub: 0.4
          }
        }
      );
    }

    const introMaroon = document.querySelector("[data-intro-maroon]");
    const whiteWipe = document.querySelector("[data-wipe-white]");
    if (introMaroon && whiteWipe) {
      gsap.fromTo(
        whiteWipe,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: introMaroon,
            start: "top top",
            end: "bottom top",
            scrub: 0.4
          }
        }
      );
    }

    /* ---------- Generic reveal-on-scroll for [data-reveal] groups ---------- */
    gsap.utils.toArray(".s-reveal").forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: (i % 4) * 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });

    /* ---------- Roadmap: highlight step as it enters view ---------- */
    gsap.utils.toArray(".s-roadmap-step").forEach(function (step) {
      ScrollTrigger.create({
        trigger: step,
        start: "top 65%",
        end: "bottom 35%",
        onEnter: function () { step.classList.add("is-active"); },
        onEnterBack: function () { step.classList.add("is-active"); },
        onLeave: function () { step.classList.remove("is-active"); },
        onLeaveBack: function () { step.classList.remove("is-active"); }
      });
    });

    /* ---------- Node graph pulse in the Intelligence Hub ---------- */
    const nodes = gsap.utils.toArray(".s-node");
    if (nodes.length) {
      gsap.to(nodes, {
        opacity: 0.4,
        duration: 1.6,
        ease: "sine.inOut",
        stagger: { each: 0.25, repeat: -1, yoyo: true }
      });
    }

    /* ---------- Founder Journey (About page): scroll-fill timeline rail ----------
       Builds one dot per chapter, positioned to line up with that chapter's
       top edge, then grows the rail's fill line and lights up each dot as
       its chapter scrolls through the middle of the viewport. */
    const journeyRail = document.querySelector("[data-journey-rail]");
    const journeyChapters = document.querySelectorAll("[data-journey-chapter]");
    if (journeyRail && journeyChapters.length) {
      const fill = journeyRail.querySelector(".s-journey-rail-fill");
      const chaptersWrap = document.querySelector("[data-journey-chapters]");

      journeyChapters.forEach(function (chapter) {
        const dot = document.createElement("div");
        dot.className = "s-journey-dot";
        dot.style.top = chapter.offsetTop + 6 + "px";
        journeyRail.appendChild(dot);

        ScrollTrigger.create({
          trigger: chapter,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: function () { dot.classList.add("is-active"); },
          onEnterBack: function () { dot.classList.add("is-active"); },
          onLeave: function () { dot.classList.remove("is-active"); },
          onLeaveBack: function () { dot.classList.remove("is-active"); }
        });
      });

      if (fill && chaptersWrap) {
        gsap.fromTo(
          fill,
          { height: 0 },
          {
            height: chaptersWrap.offsetHeight - 12 + "px",
            ease: "none",
            scrollTrigger: {
              trigger: chaptersWrap,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.4
            }
          }
        );
      }
    }

    /* ---------- Count-up stats: any [data-count] animates from 0 once visible ---------- */
    gsap.utils.toArray("[data-count]").forEach(function (el) {
      const target = parseFloat(el.getAttribute("data-count"));
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: function () {
          gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent = prefix + counter.val.toFixed(decimals) + suffix;
            }
          });
        }
      });
    });

    ScrollTrigger.refresh();
  });
})();
