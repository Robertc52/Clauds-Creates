function initSite() {
const header = document.querySelector(".header");
const nav = document.querySelector("#nav");
const menuToggle = document.querySelector("#menu-toggle");

menuToggle.addEventListener("click", () => {
  const open = header.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = alt;
  lightbox.hidden = false;
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
}

if (lightbox) {
  document.querySelectorAll(".shot").forEach((shot) => {
    shot.addEventListener("click", () => {
      const img = shot.querySelector("img");
      openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

document.querySelectorAll(".package").forEach((pack) => {
  const toggle = pack.querySelector(".package-toggle");
  toggle.addEventListener("click", () => {
    const willOpen = !pack.classList.contains("is-open");
    document.querySelectorAll(".package").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".package-toggle").setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      pack.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

const viewPackages = document.querySelector("#view-packages");
if (viewPackages) {
  viewPackages.addEventListener("click", () => {
    const first = document.querySelector(".package");
    document.querySelector("#packages").scrollIntoView({ behavior: "smooth", block: "center" });
    if (!first.classList.contains("is-open")) first.querySelector(".package-toggle").click();
  });
}

const track = document.querySelector("#quotes-track");
const quotePrev = document.querySelector("#quote-prev");
const quoteNext = document.querySelector("#quote-next");

if (track && quotePrev && quoteNext) {
  const cards = [...track.children];
  let quoteIndex = 0;

  function perView() {
    return window.matchMedia("(max-width: 760px)").matches ? 1 : 2;
  }

  function renderQuotes() {
    const visible = perView();
    const max = Math.max(0, cards.length - visible);
    quoteIndex = Math.min(quoteIndex, max);
    const width = cards[0].getBoundingClientRect().width;
    const gap = 22;
    track.style.transform = `translateX(-${quoteIndex * (width + gap)}px)`;
  }

  function stepQuotes(direction) {
    const max = Math.max(0, cards.length - perView());
    quoteIndex = (quoteIndex + direction + max + 1) % (max + 1);
    renderQuotes();
  }

  quotePrev.addEventListener("click", () => stepQuotes(-1));
  quoteNext.addEventListener("click", () => stepQuotes(1));
  window.addEventListener("resize", renderQuotes);
  renderQuotes();
}

const form = document.querySelector("#enquiry-form");
const thanks = document.querySelector("#thanks");
const formError = document.querySelector("#form-error");
const mailtoLink = document.querySelector("#mailto-link");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const valid = form.checkValidity() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    formError.hidden = valid;
    if (!valid) return;

    const lines = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Wedding date: ${data.get("date") || "Not shared yet"}`,
      `Venue: ${data.get("venue") || "Not shared yet"}`,
      "",
      String(data.get("message") || "")
    ];
    const to = window.CMS_STATE && window.CMS_STATE.contactEmail ? window.CMS_STATE.contactEmail : "";
    const subjectPrefix = window.CMS_STATE && window.CMS_STATE.enquirySubject ? window.CMS_STATE.enquirySubject : "Wedding enquiry";
    mailtoLink.href = `mailto:${to}?subject=${encodeURIComponent(`${subjectPrefix} — ${data.get("name")}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
    form.hidden = true;
    thanks.hidden = false;
  });

  const another = document.querySelector("#another");
  if (another) {
    another.addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      thanks.hidden = true;
      formError.hidden = true;
    });
  }
}

const slideTargets = [
  ...document.querySelectorAll(".highlights"),
  ...document.querySelectorAll(".portfolio .section-head"),
  ...document.querySelectorAll(".services-visual, .services-copy, .packages"),
  ...document.querySelectorAll(".about-photo, .about-copy, .about-aside"),
  ...document.querySelectorAll(".kind-words .words-head"),
  ...document.querySelectorAll(".quotes"),
  ...document.querySelectorAll(".quotes-list .quote-card"),
  ...document.querySelectorAll(".enquire-visual, .enquire-panel")
];

document.querySelectorAll(".shot").forEach((shot, index) => {
  shot.style.setProperty("--d", String(index));
});

function alignShotRows() {
  document.querySelectorAll(".gallery").forEach((gallery) => {
    const shots = [...gallery.querySelectorAll(".shot")].filter(
      (shot) => getComputedStyle(shot).display !== "none"
    );
    const rows = [];
    shots.forEach((shot) => {
      const top = shot.offsetTop;
      const row = rows.find((entry) => Math.abs(entry.top - top) < 8);
      if (row) row.shots.push(shot);
      else rows.push({ top, shots: [shot] });
    });
    rows
      .sort((a, b) => a.top - b.top)
      .forEach((row, index) => {
        row.shots.forEach((shot) => shot.classList.toggle("from-right", index % 2 === 1));
      });
  });
}

alignShotRows();
window.addEventListener("resize", alignShotRows);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  slideTargets.forEach((el) => reveal.observe(el));

  document.querySelectorAll(".gallery").forEach((gallery) => {
    const shots = [...gallery.querySelectorAll(".shot")];
    const play = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        shots.forEach((shot) => shot.classList.add("is-in"));
        play.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    play.observe(gallery);
  });
} else {
  slideTargets.forEach((el) => el.classList.add("is-in"));
  document.querySelectorAll(".shot").forEach((shot) => shot.classList.add("is-in"));
}
}
window.initSite = initSite;
