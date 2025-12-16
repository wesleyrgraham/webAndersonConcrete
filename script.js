// Anderson's Concrete & Landscaping — minimal JS
// - mobile nav toggle
// - gallery filter
// - lightbox
// - quote form -> mailto draft (replace with Formspree/Basin later)

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close after clicking a link (mobile)
    $$("#site-nav a").forEach((a) => a.addEventListener("click", closeNav));

    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Gallery filter
  const chips = $$(".chip");
  const projects = $$(".project");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      const filter = chip.getAttribute("data-filter") || "all";
      projects.forEach((p) => {
        const cat = p.getAttribute("data-category");
        const show = filter === "all" || filter === cat;
        p.style.display = show ? "" : "none";
      });
    });
  });

  // Lightbox (dialog)
  const dialog = $("#lightbox");
  const dialogImg = $(".lightbox-img", dialog || undefined);
  const dialogCap = $(".lightbox-caption", dialog || undefined);
  const closeBtn = $(".lightbox-close", dialog || undefined);

  const openLightbox = (src, caption) => {
    if (!dialog || !dialogImg || !dialogCap) return;
    dialogImg.src = src;
    dialogImg.alt = caption || "Project photo";
    dialogCap.textContent = caption || "";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "open");
  };

  const closeLightbox = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };

  $$("[data-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-img");
      const cap = btn.getAttribute("data-caption");
      if (src) openLightbox(src, cap || "");
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (dialog) dialog.addEventListener("click", (e) => {
    // click outside the figure closes
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
    if (clickedOutside) closeLightbox();
  });

  // Quote form -> mailto (replace with Formspree/Basin)
  const form = $("#quote-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "");
      const phone = String(data.get("phone") || "");
      const email = String(data.get("email") || "");
      const service = String(data.get("service") || "");
      const details = String(data.get("details") || "");
      const method = String(data.get("contact_method") || "Call");

      const subject = encodeURIComponent("Quote request — Anderson's Concrete & Landscaping");
      const body = encodeURIComponent(
        [
          "New quote request:",
          "",
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Email: ${email}`,
          `Service: ${service}`,
          `Preferred contact: ${method}`,
          "",
          "Project details:",
          details
        ].join("\n")
      );

      // IMPORTANT: replace with your real email
      const to = "quotes@andersonsconcrete.com";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
