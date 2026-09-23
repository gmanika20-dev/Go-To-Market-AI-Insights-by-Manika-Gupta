/* ============================================================
   Renders the header nav and footer nav from data/nav.js, sets
   the active-page indicator, wires the mobile menu toggle and
   fills in every element with data-contact-* attributes.
   Depends on window.STUDIO_NAV and window.STUDIO_CONTACT existing
   (loaded via data/nav.js before this file).
   ============================================================ */
(function () {
  "use strict";

  function currentPageKey() {
    return document.body.getAttribute("data-page") || "";
  }

  function buildNavList(container, isFooter) {
    if (!container || !window.STUDIO_NAV) return;
    const activeKey = currentPageKey();
    const ul = document.createElement("ul");
    ul.className = isFooter ? "s-footer-links" : "s-nav-links";
    if (!isFooter) {
      ul.id = "s-nav-links";
    }

    window.STUDIO_NAV.forEach(function (item) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      if (item.key === activeKey) {
        a.setAttribute("aria-current", "page");
      }
      li.appendChild(a);
      ul.appendChild(li);
    });

    container.replaceWith(ul);
  }

  function fillContactFields() {
    if (!window.STUDIO_CONTACT) return;
    const c = window.STUDIO_CONTACT;
    // Only overwrite textContent on leaf elements (no child elements),
    // so an <a> that wraps a label + a nested value <div> keeps its
    // structure intact — only its href (and any leaf text nodes) update.
    document.querySelectorAll("[data-contact-email]").forEach(function (el) {
      if (el.children.length === 0) el.textContent = c.email;
      if (el.tagName === "A") el.href = "mailto:" + c.email;
    });
    document.querySelectorAll("[data-contact-phone]").forEach(function (el) {
      if (el.children.length === 0) el.textContent = c.phone;
      if (el.tagName === "A") el.href = "tel:" + c.phoneHref;
    });
    document.querySelectorAll("[data-contact-linkedin]").forEach(function (el) {
      if (el.tagName === "A") el.href = c.linkedin;
    });
    document.querySelectorAll("[data-contact-instagram]").forEach(function (el) {
      if (el.tagName === "A") el.href = c.instagram;
    });
  }

  function wireMobileToggle() {
    const toggle = document.querySelector(".s-nav-toggle");
    const links = document.getElementById("s-nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    // Close menu on link click (mobile)
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildNavList(document.querySelector("[data-nav-mount]"), false);
    buildNavList(document.querySelector("[data-footer-nav-mount]"), true);
    fillContactFields();
    wireMobileToggle();
  });
})();
