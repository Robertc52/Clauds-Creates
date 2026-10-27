function initSite() {
mountGlassDates();
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
const lightboxVideo = document.querySelector("#lightbox-video");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");

function stopLightboxVideo() {
  if (!lightboxVideo) return;
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
  lightboxVideo.load();
  lightboxVideo.hidden = true;
}

function openLightbox(src, alt, videoUrl) {
  lightboxCaption.textContent = alt || "";
  if (videoUrl && lightboxVideo) {
    lightboxImg.hidden = true;
    lightboxImg.removeAttribute("src");
    lightboxVideo.hidden = false;
    lightboxVideo.src = videoUrl;
    const play = lightboxVideo.play();
    if (play && play.catch) play.catch(() => {});
  } else {
    stopLightboxVideo();
    lightboxImg.hidden = false;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
  }
  lightbox.hidden = false;
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.removeAttribute("src");
  lightboxImg.alt = "";
  stopLightboxVideo();
}

if (lightbox) {
  document.querySelectorAll(".shot").forEach((shot) => {
    shot.addEventListener("click", () => {
      const img = shot.querySelector("img");
      const preview = shot.querySelector("video");
      const alt = img ? img.alt : (preview ? preview.getAttribute("aria-label") : "");
      openLightbox(img ? img.src : "", alt, shot.dataset.video || "");
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
    if (!cards.length) return;
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

function mountGlassDates() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  function parseISO(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function iso(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  document.querySelectorAll(".enquiry-form input[type='date']").forEach((input) => {
    if (input.dataset.glazed) return;
    input.dataset.glazed = "true";
    input.classList.add("date-native");

    const wrap = document.createElement("div");
    wrap.className = "date-glass";
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "date-glass-trigger";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    const pop = document.createElement("div");
    pop.className = "date-glass-pop";
    pop.hidden = true;
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Choose a wedding date");
    wrap.append(trigger, pop);
    input.after(wrap);

    let view = new Date();

    function paintTrigger() {
      trigger.textContent = input.value
        ? parseISO(input.value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "Choose a date";
      trigger.classList.toggle("is-empty", !input.value);
    }

    function render() {
      pop.replaceChildren();
      const head = document.createElement("div");
      head.className = "date-glass-head";
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "date-glass-nav";
      prev.setAttribute("aria-label", "Previous month");
      prev.textContent = "‹";
      const title = document.createElement("p");
      title.className = "date-glass-title";
      title.textContent = `${months[view.getMonth()]} ${view.getFullYear()}`;
      const next = document.createElement("button");
      next.type = "button";
      next.className = "date-glass-nav";
      next.setAttribute("aria-label", "Next month");
      next.textContent = "›";
      head.append(prev, title, next);
      prev.addEventListener("click", () => {
        view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
        render();
      });
      next.addEventListener("click", () => {
        view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
        render();
      });

      const grid = document.createElement("div");
      grid.className = "date-glass-grid";
      weekdays.forEach((name) => {
        const label = document.createElement("span");
        label.className = "date-glass-dow";
        label.textContent = name;
        grid.append(label);
      });

      const firstWeekday = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
      for (let i = 0; i < firstWeekday; i += 1) grid.append(document.createElement("span"));

      const today = new Date();
      const todayValue = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= days; day += 1) {
        const date = new Date(view.getFullYear(), view.getMonth(), day);
        const value = iso(date);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "date-glass-day";
        button.textContent = String(day);
        if (value === input.value) button.classList.add("is-selected");
        if (value === todayValue) button.classList.add("is-today");
        button.addEventListener("click", () => {
          input.value = value;
          paintTrigger();
          close();
          trigger.focus();
        });
        grid.append(button);
      }
      pop.append(head, grid);
    }

    function place() {
      const triggerRect = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      pop.classList.toggle("is-up", spaceBelow < 340 && spaceAbove > spaceBelow);
    }

    function open() {
      const selected = input.value ? parseISO(input.value) : new Date();
      view = new Date(selected.getFullYear(), selected.getMonth(), 1);
      render();
      trigger.setAttribute("aria-expanded", "true");
      pop.hidden = false;
      place();
    }

    function close() {
      pop.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", () => {
      if (pop.hidden) open();
      else close();
    });
    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !pop.hidden) {
        close();
        trigger.focus();
      }
    });
    if (input.form) {
      input.form.addEventListener("reset", () => {
        window.setTimeout(paintTrigger, 0);
      });
    }
    paintTrigger();
  });
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

mountGlassDates();

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
