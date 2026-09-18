// ============================================================
// Manika Gupta — site behaviour
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Resource / tool filter tabs ---------- */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const filterItems = document.querySelectorAll("[data-category]");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      filterItems.forEach((item) => {
        const show = filter === "all" || item.dataset.category === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });

  /* ----------------------------------------------------------
     Contact / inquiry forms
     ----------------------------------------------------------
     These forms are wired to submit to Formspree so they work
     the moment you host this on your own domain — no backend
     required. To activate:
       1. Create a free form at https://formspree.io
       2. Replace YOUR_FORM_ID below (and in each <form action="">)
          with the ID Formspree gives you.
     Until then, submissions are only confirmed in the browser
     and are NOT actually sent anywhere — replace the action URL
     before going live.
  ------------------------------------------------------------- */
  document.querySelectorAll("form[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      const status = form.querySelector(".form-status");
      const action = form.getAttribute("action") || "";

      // If the form still points at the placeholder Formspree ID,
      // don't attempt a real network call — just show a friendly
      // reminder so nothing appears to silently fail.
      if (action.includes("YOUR_FORM_ID")) {
        e.preventDefault();
        if (status) {
          status.textContent =
            "Form saved for preview only — connect a form endpoint (see comment in js/main.js) to start receiving real submissions.";
          status.classList.remove("err");
          status.classList.add("ok");
        }
        return;
      }

      // Real submission path (once action URL is configured).
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          if (status) {
            status.textContent = "Thanks — your message is in. I'll get back to you shortly.";
            status.classList.remove("err");
            status.classList.add("ok");
          }
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        if (status) {
          status.textContent = "Something went wrong sending this — please email or WhatsApp me directly instead.";
          status.classList.remove("ok");
          status.classList.add("err");
        }
      }
    });
  });

  /* ----------------------------------------------------------
     Payment modal (tools.html)
     ----------------------------------------------------------
     This opens a lightweight summary modal when someone clicks
     "Get started" on a tool/service. It is a UI placeholder —
     no payment is actually processed here.

     To take real payments, pick a gateway and swap the
     "startCheckout" function below for their checkout call, e.g.:

     Razorpay:
       const rzp = new Razorpay({ key: "YOUR_KEY_ID", amount, ... });
       rzp.open();

     Stripe:
       const stripe = Stripe("YOUR_PUBLISHABLE_KEY");
       stripe.redirectToCheckout({ sessionId: "..." });

     Both require a small backend (or their hosted Payment Link /
     Checkout page) to create the order/session securely — the
     secret key should never live in this front-end file.
  ------------------------------------------------------------- */
  const modalBackdrop = document.querySelector(".modal-backdrop");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalService = document.querySelector("[data-modal-service]");
  const modalPrice = document.querySelector("[data-modal-price]");
  const modalClose = document.querySelector(".modal-close");

  function startCheckout(name, price) {
    if (!modalBackdrop) return;
    if (modalTitle) modalTitle.textContent = name;
    if (modalService) modalService.textContent = name;
    if (modalPrice) modalPrice.textContent = price;
    modalBackdrop.classList.add("open");
  }

  document.querySelectorAll("[data-checkout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startCheckout(btn.dataset.name, btn.dataset.price);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", () => modalBackdrop.classList.remove("open"));
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove("open");
    });
  }
});
