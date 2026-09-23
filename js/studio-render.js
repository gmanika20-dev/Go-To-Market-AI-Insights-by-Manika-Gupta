/* ============================================================
   Renders dynamic sections from the data/*.js files into their
   page mount points. Runs before studio-motion.js so GSAP has
   real elements to attach ScrollTriggers to.
   ============================================================ */
(function () {
  "use strict";

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function renderApproach() {
    const zonesMount = document.querySelector("[data-approach-zones]");
    const items = window.STUDIO_APPROACH;
    if (!zonesMount || !items || !items.length) return;

    zonesMount.innerHTML = "";
    items.forEach(function (item, i) {
      const bullets = item.bullets
        .map(function (b) { return "<li>" + b + "</li>"; })
        .join("");
      const btn = el(
        "button",
        "s-reveal-zone",
        "<span class=\"s-reveal-zone-title\">" + item.title + "</span>" +
        "<span class=\"s-reveal-zone-desc\">" + item.description + "</span>" +
        "<ul class=\"s-reveal-zone-bullets\">" + bullets + "</ul>"
      );
      btn.type = "button";
      btn.setAttribute("data-zone", "");
      btn.setAttribute("aria-label", item.title + " — " + item.description);

      const setActiveZone = function () {
        zonesMount.querySelectorAll("[data-zone]").forEach(function (z, zi) {
          z.classList.toggle("is-active", zi === i);
        });
      };
      btn.addEventListener("mouseenter", setActiveZone);
      btn.addEventListener("focus", setActiveZone);
      btn.addEventListener("click", function (e) {
        const isTouch = window.matchMedia("(hover: none)").matches;
        if (isTouch) e.preventDefault();
        setActiveZone();
      });

      zonesMount.appendChild(btn);
    });

    // The first box starts pre-lit rather than blank, so there's
    // something to read before the visitor hovers or taps anything.
    const firstZone = zonesMount.querySelector("[data-zone]");
    if (firstZone) firstZone.classList.add("is-active");
  }

  function renderSuiteProducts() {
    const mount = document.querySelector("[data-suite-products-mount]");
    if (!mount || !window.STUDIO_SUITE_PRODUCTS) return;
    mount.innerHTML = "";
    window.STUDIO_SUITE_PRODUCTS.forEach(function (p) {
      const card = el("div", "s-suite-card s-reveal");
      const checks = p.bullets
        .map(function (b) {
          return (
            '<li><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
            '<path d="M3 8.5L6.5 12L13 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            "</svg><span>" + b + "</span></li>"
          );
        })
        .join("");
      card.innerHTML =
        '<div class="s-suite-card-top">' +
        '<div class="s-suite-icon-chip"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">' + p.icon + "</svg></div>" +
        '<span class="s-suite-status s-suite-status--' + p.status + '">' + p.statusLabel + "</span>" +
        "</div>" +
        (p.link ? '<h3><a href="' + p.link + '" class="s-suite-card-title-link">' + p.title + "</a></h3>" : "<h3>" + p.title + "</h3>") +
        "<p>" + p.description + "</p>" +
        (p.video
          ? '<video class="s-suite-video" controls preload="metadata" poster="' + p.poster + '" ' +
            'controlsList="nodownload noremoteplayback" disablepictureinpicture playsinline ' +
            'oncontextmenu="return false;">' +
            '<source src="' + p.video + '" type="video/mp4">' +
            "</video>"
          : "") +
        '<ul class="s-suite-checklist">' + checks + "</ul>";
      mount.appendChild(card);
    });
  }

  function renderServices() {
    const mount = document.querySelector("[data-services-mount]");
    if (!mount || !window.STUDIO_SERVICES) return;
    mount.innerHTML = "";
    mount.className = "s-services-grid";
    window.STUDIO_SERVICES.forEach(function (s) {
      const tile = el("div", "s-service-tile s-reveal s-service-tile--" + s.size);
      tile.innerHTML =
        '<span class="s-service-category">' + s.category + "</span>" +
        "<h3>" + s.title + "</h3>" +
        "<p>" + s.description + "</p>";
      mount.appendChild(tile);
    });
  }

  function renderRoadmap() {
    const mount = document.querySelector("[data-roadmap-mount]");
    if (!mount || !window.STUDIO_WORKFLOW) return;
    mount.innerHTML = "";
    mount.className = "s-roadmap-steps";
    window.STUDIO_WORKFLOW.forEach(function (step) {
      const card = el("div", "s-roadmap-step");
      card.innerHTML =
        '<div class="n">' + String(step.n).padStart(2, "0") + "</div>" +
        "<h3>" + step.title + "</h3>" +
        "<p>" + step.description + "</p>";
      mount.appendChild(card);
    });
  }

  function renderCertifications() {
    const mount = document.querySelector("[data-certifications-mount]");
    if (!mount) return;
    const certs = window.STUDIO_CERTIFICATIONS || [];
    if (certs.length === 0) {
      // Nothing to show publicly yet — hide the block rather than
      // exposing an "add content here" note to site visitors.
      mount.style.display = "none";
      return;
    }
    mount.innerHTML = "";
    mount.className = "s-cert-list";
    certs.forEach(function (c) {
      const item = el("div", "s-tile s-reveal");
      item.innerHTML = "<h3>" + c.name + "</h3><p>" + c.issuer + " — " + c.year + "</p>";
      mount.appendChild(item);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderServices();
    renderApproach();
    renderSuiteProducts();
    renderRoadmap();
    renderCertifications();
  });
})();
