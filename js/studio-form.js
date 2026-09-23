/* ============================================================
   Handles validation and submission for any <form data-studio-form>.

   Two delivery paths:
   1. PLACEHOLDER endpoint (action still has YOUR_FORM_ID) — the default
      today. On submit, this builds a pre-filled email (to the address in
      data/nav.js) and opens the visitor's own email app via a mailto:
      link. They still have to hit send themselves, but no third-party
      account or setup is required on Manika's end — it works right now.
   2. REAL endpoint (action replaced with a Formspree URL or similar) —
      once connected, submissions go silently via fetch() instead, with
      no extra step for the visitor. See README.md to switch this on.
   ============================================================ */
(function () {
  "use strict";

  function showFieldError(field, message) {
    const wrap = field.closest(".s-field");
    if (!wrap) return;
    wrap.classList.add("has-error");
    let err = wrap.querySelector(".s-field-error");
    if (!err) {
      err = document.createElement("span");
      err.className = "s-field-error";
      wrap.appendChild(err);
    }
    err.textContent = message;
  }

  function clearFieldError(field) {
    const wrap = field.closest(".s-field");
    if (!wrap) return;
    wrap.classList.remove("has-error");
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach(function (field) {
      clearFieldError(field);
      if (field.type === "checkbox" && !field.checked) {
        showFieldError(field, "Required to continue.");
        valid = false;
        return;
      }
      if (field.type !== "checkbox" && !field.value.trim()) {
        showFieldError(field, "This field is required.");
        valid = false;
        return;
      }
      if (field.type === "email" && field.value.trim()) {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!emailOk) {
          showFieldError(field, "Enter a valid email address.");
          valid = false;
        }
      }
    });
    return valid;
  }

  function isPlaceholderEndpoint(action) {
    return !action || action.indexOf("YOUR_FORM_ID") !== -1;
  }

  // Turns the form's fields into a readable plain-text summary, in the
  // order they appear, skipping the submit button and empty optional
  // fields, using each field's <label> text (not its `name`) so the
  // email reads naturally.
  function buildEmailBody(form) {
    const lines = [];
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      if (!field.name || field.type === "submit" || field.type === "hidden") return;
      const label = form.querySelector('label[for="' + field.id + '"]');
      const labelText = label ? label.textContent.trim() : field.name;
      let value = field.value ? field.value.trim() : "";
      if (field.type === "checkbox") value = field.checked ? "Yes" : "No";
      if (!value) return;
      lines.push(labelText + ": " + value);
    });
    return lines.join("\n");
  }

  function submitViaMailto(form, status) {
    const email = window.STUDIO_CONTACT
      ? (window.STUDIO_CONTACT.formEmail || window.STUDIO_CONTACT.email)
      : "";
    if (!email) {
      if (status) {
        status.textContent = "Couldn't find a contact email configured for this site.";
        status.classList.add("is-error");
      }
      return;
    }
    const formName = form.getAttribute("data-form-name") || "Website inquiry";
    const subject = encodeURIComponent(formName + " — from gotomarketaiinsight.com");
    const body = encodeURIComponent(buildEmailBody(form));
    const mailtoUrl = "mailto:" + email + "?subject=" + subject + "&body=" + body;

    if (status) {
      status.textContent =
        "Opening your email app with this filled in — just hit send to reach me.";
      status.classList.remove("is-error");
      status.classList.add("is-success");
    }
    window.location.href = mailtoUrl;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-studio-form]").forEach(function (form) {
      const status = form.querySelector(".s-form-status");

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (status) {
          status.textContent = "";
          status.classList.remove("is-error", "is-success");
        }

        if (!validateForm(form)) {
          if (status) {
            status.textContent = "Please fix the highlighted fields.";
            status.classList.add("is-error");
          }
          return;
        }

        if (isPlaceholderEndpoint(form.getAttribute("action"))) {
          submitViaMailto(form, status);
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            if (res.ok) {
              form.reset();
              if (status) {
                status.textContent = "Thanks — I'll get back to you within a business day.";
                status.classList.add("is-success");
              }
            } else {
              if (status) {
                status.textContent = "Something went wrong sending that. Please try emailing directly.";
                status.classList.add("is-error");
              }
            }
          })
          .catch(function () {
            if (status) {
              status.textContent = "Something went wrong sending that. Please try emailing directly.";
              status.classList.add("is-error");
            }
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    });
  });
})();
