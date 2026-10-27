(function () {
  const config = window.CMS_CONFIG || {};
  const projectId = String(config.projectId || "").trim();
  const dataset = config.dataset || "production";
  const apiVersion = config.apiVersion || "2026-10-26";
  const page = document.body.dataset.page || "home";

  function start() {
    if (typeof window.initSite === "function") window.initSite();
  }

  if (!projectId) {
    start();
    return;
  }

  const img = `{alt, "url": asset->url}`;

  const queries = {
    home: `{
      "settings": *[_id == "siteSettings"][0]{..., shareImage${img}},
      "home": *[_id == "homePage"][0]{
        ...,
        heroBackground${img},
        servicesImage${img},
        aboutPhoto${img},
        polaroidBack${img},
        polaroidFront${img},
        enquireBackground${img}
      },
      "portfolio": *[_type == "portfolioItem" && defined(image.asset)] | order(_createdAt desc)[0...15]{title, description, showPlay, image${img}},
      "packages": *[_type == "servicePackage"] | order(order asc),
      "testimonials": *[_type == "testimonial"] | order(_createdAt desc)[0...10]{..., photo${img}},
      "words": *[_id == "kindWordsPage"][0],
      "enquiry": *[_id == "enquiryPage"][0]
    }`,
    about: `{
      "settings": *[_id == "siteSettings"][0]{..., shareImage${img}},
      "about": *[_id == "aboutPage"][0]{..., photo${img}, polaroidBack${img}, polaroidFront${img}}
    }`,
    services: `{
      "settings": *[_id == "siteSettings"][0]{..., shareImage${img}},
      "services": *[_id == "servicesPage"][0]{..., photo${img}},
      "packages": *[_type == "servicePackage"] | order(order asc)
    }`,
    portfolio: `{
      "settings": *[_id == "siteSettings"][0]{..., shareImage${img}},
      "portfolioPage": *[_id == "portfolioPage"][0],
      "portfolio": *[_type == "portfolioItem" && defined(image.asset)] | order(order asc){title, description, showPlay, image${img}}
    }`,
    "kind-words": `{
      "settings": *[_id == "siteSettings"][0]{..., shareImage${img}},
      "words": *[_id == "kindWordsPage"][0],
      "testimonials": *[_type == "testimonial"] | order(_createdAt desc){..., photo${img}}
    }`,
    enquire: `{
      "settings": *[_id == "siteSettings"][0]{..., shareImage${img}},
      "enquiry": *[_id == "enquiryPage"][0]{..., pagePhoto${img}}
    }`
  };

  function text(el, value) {
    if (!el || value == null || String(value).trim() === "") return;
    el.textContent = value;
  }

  function lines(el, values, emphasis) {
    const clean = (values || []).filter((value) => value && String(value).trim());
    if (!el || !clean.length) return;
    el.replaceChildren();
    clean.forEach((value, index) => {
      if (index) el.append(document.createElement("br"));
      if (index === emphasis) {
        const em = document.createElement("em");
        em.textContent = value;
        el.append(em);
      } else {
        el.append(document.createTextNode(value));
      }
    });
  }

  function buttonLabel(el, label) {
    if (!el || !label) return;
    const arrow = el.querySelector("[aria-hidden='true']");
    const clone = arrow ? arrow.cloneNode(true) : null;
    el.textContent = `${label.trim()} `;
    if (clone) el.append(clone);
  }

  function imageUrl(image, width) {
    const url = image && image.url;
    if (!url) return "";
    const join = url.includes("?") ? "&" : "?";
    return `${url}${join}w=${width || 1600}&auto=format&fit=max`;
  }

  function paint(img, image, width) {
    const src = imageUrl(image, width);
    if (!img || !src) return;
    img.src = src;
    if (image.alt) img.alt = image.alt;
  }

  function photoVar(name, image, width) {
    const src = imageUrl(image, width);
    if (src) document.documentElement.style.setProperty(name, `url("${src}")`);
  }

  function applySettings(settings) {
    if (!settings) return;
    text(document.querySelector(".brand-name"), settings.businessName);
    text(document.querySelector(".brand-sub"), settings.tagline);
    const labels = {
      "index.html": settings.navHome,
      "about.html": settings.navAbout,
      "services.html": settings.navServices,
      "portfolio.html": settings.navPortfolio,
      "kind-words.html": settings.navKindWords,
      "enquire.html": settings.navEnquire
    };
    document.querySelectorAll(".nav a").forEach((link) => {
      text(link, labels[link.getAttribute("href")]);
    });
    const footer = document.querySelectorAll(".footer p");
    text(footer[0], settings.footerLine1);
    text(footer[1], settings.footerLine2);
    if (settings.phone && document.querySelector(".footer")) {
      let phone = document.querySelector(".footer-phone");
      if (!phone) {
        phone = document.createElement("p");
        phone.className = "footer-phone";
        document.querySelector(".footer").append(phone);
      }
      phone.textContent = settings.phone;
    }
    text(document.querySelector(".skip"), settings.skipLabel);
    text(document.querySelector(".menu-toggle .visually-hidden"), settings.menuLabel);
    if (settings.instagram) {
      const link = document.querySelector('.social a[aria-label="Instagram"], .social a[href*="instagram.com"]');
      if (link) link.href = settings.instagram;
    }
    if (settings.tiktok) {
      const link = document.querySelector('.social a[aria-label="TikTok"], .social a[href*="tiktok.com"]');
      if (link) link.href = settings.tiktok;
    }
    const email = document.querySelector('.social a[aria-label="Email Claude"], .social a[href="enquire.html"]');
    if (email && settings.emailLabel) email.setAttribute("aria-label", settings.emailLabel);
    if (email && settings.contactEmail) email.href = `mailto:${settings.contactEmail}`;
    photoVar("--share-image", settings.shareImage, 1200);
  }

  function applySeo(content, settings) {
    const title = content && content.seoTitle;
    const description = content && content.seoDescription;
    if (title) document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (description && meta) meta.setAttribute("content", description);
    const share = (content && content.shareImage) || (settings && settings.shareImage);
    const shareUrl = imageUrl(share, 1200);
    if (!shareUrl && !title && !description) return;
    function metaTag(property, value) {
      if (!value) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.append(tag);
      }
      tag.setAttribute("content", value);
    }
    metaTag("og:title", title);
    metaTag("og:description", description);
    metaTag("og:image", shareUrl);
  }

  function renderReel(items) {
    const strip = document.querySelector("#filmstrip");
    const usable = (items || []).filter((item) => item && item.url);
    if (!strip || !usable.length) return;
    strip.parentElement.style.setProperty("--film-count", String(usable.length));
    strip.replaceChildren();
    [false, true].forEach((hidden) => {
      usable.forEach((item) => {
        const figure = document.createElement("figure");
        figure.className = item.monochrome ? "frame is-mono" : "frame";
        if (hidden) figure.setAttribute("aria-hidden", "true");
        const image = document.createElement("img");
        image.src = imageUrl(item, 900);
        image.alt = hidden ? "" : item.alt || "";
        figure.append(image);
        strip.append(figure);
      });
    });
  }

  function renderShots(gallery, items) {
    if (!gallery || !Array.isArray(items)) return;
    const usable = items.filter((item) => item && item.image && item.image.url);
    gallery.replaceChildren();
    usable.forEach((item) => {
      const button = document.createElement("button");
      button.className = "shot";
      button.type = "button";
      const image = document.createElement("img");
      image.src = imageUrl(item.image, 1000);
      image.alt = item.image.alt || item.title || "";
      button.append(image);
      if (item.showPlay) {
        const play = document.createElement("span");
        play.className = "play";
        play.setAttribute("aria-hidden", "true");
        button.append(play);
      }
      gallery.append(button);
    });
  }

  function renderPackages(items) {
    const root = document.querySelector("#packages");
    if (!root || !items || !items.length) return;
    root.replaceChildren();
    items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "package";
      const button = document.createElement("button");
      button.className = "package-toggle";
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      const num = document.createElement("span");
      num.className = "num";
      num.textContent = String(index + 1).padStart(2, "0");
      const name = document.createElement("span");
      name.className = "package-name";
      const title = document.createElement("span");
      title.className = "package-title";
      title.textContent = item.title || "";
      const sub = document.createElement("span");
      sub.className = "package-sub";
      sub.textContent = item.summary || "";
      name.append(title, sub);
      if (item.price) {
        const price = document.createElement("span");
        price.className = "package-price";
        price.textContent = item.price;
        name.append(price);
      }
      const plus = document.createElement("span");
      plus.className = "plus";
      plus.setAttribute("aria-hidden", "true");
      button.append(num, name, plus);
      const panel = document.createElement("div");
      panel.className = "package-panel";
      const inner = document.createElement("div");
      inner.className = "package-panel-inner";
      const list = document.createElement("ul");
      (item.inclusions || []).forEach((inclusion) => {
        const li = document.createElement("li");
        li.textContent = inclusion;
        list.append(li);
      });
      inner.append(list);
      if (item.note) {
        const note = document.createElement("p");
        note.textContent = item.note;
        inner.append(note);
      }
      panel.append(inner);
      article.append(button, panel);
      root.append(article);
    });
  }

  function quoteCard(item) {
    const article = document.createElement("article");
    article.className = "quote-card";
    if (item.photo && item.photo.url) {
      const image = document.createElement("img");
      image.src = imageUrl(item.photo, 600);
      image.alt = item.photo.alt || "";
      article.append(image);
    }
    const copy = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = item.headline || "";
    const body = document.createElement("p");
    body.textContent = item.quote || "";
    const who = document.createElement("p");
    who.className = "who";
    who.textContent = item.date ? `${item.names || ""} · ${item.date}` : (item.names || "");
    copy.append(heading, body, who);
    article.append(copy);
    return article;
  }

  function renderQuotes(items) {
    const usable = (items || []).filter((item) => item && (item.headline || item.quote));
    if (!usable.length) return;
    const track = document.querySelector("#quotes-track");
    const list = document.querySelector(".quotes-list");
    if (track) {
      track.replaceChildren();
      usable.forEach((item) => track.append(quoteCard(item)));
    }
    if (list) {
      list.replaceChildren();
      usable.forEach((item) => list.append(quoteCard(item)));
    }
  }

  function renderPillars(items) {
    const list = document.querySelector(".pillars");
    if (!list || !items || !items.length) return;
    const icons = [...list.querySelectorAll(".pillar-icon")].map((icon) => icon.innerHTML);
    list.replaceChildren();
    items.forEach((item, index) => {
      const li = document.createElement("li");
      const icon = document.createElement("span");
      icon.className = "pillar-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = icons[index % Math.max(icons.length, 1)] || "";
      const heading = document.createElement("h3");
      heading.textContent = item.title || "";
      const copy = document.createElement("p");
      copy.textContent = item.text || "";
      li.append(icon, heading, copy);
      list.append(li);
    });
  }

  function scribble(a, b, c) {
    const el = document.querySelector(".scribble");
    if (!el || !a) return;
    el.replaceChildren();
    el.append(document.createTextNode(a), document.createElement("br"));
    el.append(document.createTextNode(b || ""), document.createElement("br"));
    el.append(document.createTextNode(`${c || ""} `));
    const heart = document.createElement("span");
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♡";
    el.append(heart);
  }

  function replaceParagraphs(container, items, closing) {
    if (!container || !items || !items.length) return;
    container.querySelectorAll("p:not(.eyebrow)").forEach((paragraph) => paragraph.remove());
    items.forEach((item) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = item;
      container.append(paragraph);
    });
    if (closing) {
      const paragraph = document.createElement("p");
      paragraph.className = "about-close";
      paragraph.textContent = closing;
      container.append(paragraph);
    }
  }

  function applyEnquiry(enquiry) {
    if (!enquiry) return;
    text(document.querySelector(".enquire-visual .eyebrow"), enquiry.eyebrow);
    lines(document.querySelector("#enquire-title"), [enquiry.scriptTitle1, enquiry.scriptTitle2]);
    lines(document.querySelector(".enquire-intro .display"), [enquiry.formTitle1, enquiry.formTitle2]);
    text(document.querySelector(".enquire-intro p"), enquiry.intro);
    const fields = {
      name: enquiry.nameLabel,
      email: enquiry.emailLabel,
      date: enquiry.dateLabel,
      venue: enquiry.venueLabel,
      message: enquiry.messageLabel
    };
    Object.entries(fields).forEach(([name, label]) => {
      const input = document.querySelector(`[name="${name}"]`);
      const span = input && input.parentElement.querySelector("span");
      text(span, label);
    });
    text(document.querySelector("#form-error"), enquiry.error);
    buttonLabel(document.querySelector("#enquiry-form .btn"), enquiry.submitLabel);
    text(document.querySelector("#thanks .display"), enquiry.thanksTitle);
    text(document.querySelector("#thanks p"), enquiry.thanksBody);
    buttonLabel(document.querySelector("#mailto-link"), enquiry.emailButton);
    text(document.querySelector("#another"), enquiry.anotherLabel);
    window.CMS_STATE = {
      contactEmail: (window.CMS_STATE && window.CMS_STATE.contactEmail) || "",
      enquirySubject: enquiry.subject || "Wedding enquiry"
    };
    photoVar("--enquire-page-image", enquiry.pagePhoto, 1600);
  }

  function apply(data) {
    applySettings(data.settings);
    window.CMS_STATE = window.CMS_STATE || {};
    if (data.settings && data.settings.contactEmail) window.CMS_STATE.contactEmail = data.settings.contactEmail;

    if (page === "home" && data.home) {
      const home = data.home;
      applySeo(home, data.settings);
      text(document.querySelector(".hero .eyebrow"), home.heroEyebrow);
      lines(document.querySelector(".hero h1"), [home.heroTitle, home.heroEmphasis], 1);
      text(document.querySelector(".lede"), home.heroLede);
      buttonLabel(document.querySelector(".hero .btn"), home.heroButton);
      if (home.heroTags) {
        const tags = document.querySelector(".hero-tags");
        const parts = home.heroTags.split("·").map((part) => part.trim()).filter(Boolean);
        if (tags && parts.length) {
          tags.replaceChildren();
          parts.forEach((part, index) => {
            if (index) {
              const dot = document.createElement("span");
              dot.textContent = "·";
              tags.append(dot);
              tags.append(document.createTextNode(` ${part}`));
            } else {
              tags.append(document.createTextNode(`${part} `));
            }
          });
        }
      }
      photoVar("--hero-image", home.heroBackground, 2000);
      const recentPhotos = Array.isArray(data.portfolio) ? data.portfolio : [];
      renderReel(recentPhotos.slice(0, 10).map((item) => ({
        url: item.image && item.image.url,
        alt: (item.image && item.image.alt) || item.title || ""
      })));
      lines(document.querySelector("#highlights-title"), [home.highlightsTitle1, home.highlightsTitle2]);
      text(document.querySelector(".highlights-intro p"), home.highlightsIntro);
      renderPillars(home.pillars);
      text(document.querySelector(".portfolio .eyebrow"), home.portfolioEyebrow);
      lines(document.querySelector("#portfolio-title"), [home.portfolioTitle1, home.portfolioTitle2]);
      buttonLabel(document.querySelector(".portfolio .text-link"), home.portfolioLink);
      renderShots(document.querySelector("#gallery"), recentPhotos.slice(10, 15));
      text(document.querySelector(".services .eyebrow"), home.servicesEyebrow);
      lines(document.querySelector("#services-title"), [home.servicesTitle1, home.servicesTitle2]);
      text(document.querySelector(".services-copy p"), home.servicesBody);
      buttonLabel(document.querySelector("#view-packages"), home.servicesButton);
      paint(document.querySelector(".services-visual img"), home.servicesImage, 1400);
      renderPackages(data.packages);
      text(document.querySelector(".about .eyebrow"), home.aboutEyebrow);
      text(document.querySelector("#about-title"), home.aboutTitle);
      replaceParagraphs(document.querySelector(".about-copy"), home.aboutParagraphs);
      paint(document.querySelector(".about-photo img"), home.aboutPhoto, 1400);
      paint(document.querySelector(".polaroid-back"), home.polaroidBack, 800);
      paint(document.querySelector(".polaroid img"), home.polaroidFront, 800);
      scribble(home.scribble1, home.scribble2, home.scribble3);
      text(document.querySelector(".kind-words .eyebrow"), home.wordsEyebrow);
      text(document.querySelector("#words-title"), home.wordsTitle);
      buttonLabel(document.querySelector(".words-line .text-link"), home.wordsLink);
      renderQuotes(data.testimonials);
      if (data.words && data.words.previousLabel) {
        const previous = document.querySelector("#quote-prev");
        if (previous) previous.setAttribute("aria-label", data.words.previousLabel);
      }
      if (data.words && data.words.nextLabel) {
        const next = document.querySelector("#quote-next");
        if (next) next.setAttribute("aria-label", data.words.nextLabel);
      }
      photoVar("--enquire-home-image", home.enquireBackground, 1600);
      applyEnquiry(data.enquiry);
      applySeo(home, data.settings);
    }

    if (page === "about" && data.about) {
      const about = data.about;
      applySeo(about, data.settings);
      text(document.querySelector(".about .eyebrow"), about.eyebrow);
      text(document.querySelector("#about-title"), about.title);
      replaceParagraphs(document.querySelector(".about-copy"), about.paragraphs, about.closing);
      paint(document.querySelector(".about-photo img"), about.photo, 1400);
      paint(document.querySelector(".polaroid-back"), about.polaroidBack, 800);
      paint(document.querySelector(".polaroid img"), about.polaroidFront, 800);
      scribble(about.scribble1, about.scribble2, about.scribble3);
    }

    if (page === "services" && data.services) {
      const services = data.services;
      applySeo(services, data.settings);
      text(document.querySelector(".services .eyebrow"), services.eyebrow);
      lines(document.querySelector("#services-title"), [services.title1, services.title2]);
      text(document.querySelector(".services-copy p"), services.body);
      buttonLabel(document.querySelector("#view-packages"), services.button);
      paint(document.querySelector(".services-visual img"), services.photo, 1400);
      renderPackages(data.packages);
    }

    if (page === "portfolio") {
      if (data.portfolioPage) {
        applySeo(data.portfolioPage, data.settings);
        text(document.querySelector(".portfolio .eyebrow"), data.portfolioPage.eyebrow);
        lines(document.querySelector("#portfolio-title"), [data.portfolioPage.title1, data.portfolioPage.title2]);
        const close = document.querySelector("#lightbox-close");
        if (close && data.portfolioPage.closeLabel) close.setAttribute("aria-label", data.portfolioPage.closeLabel);
      }
      renderShots(document.querySelector(".gallery"), data.portfolio);
    }

    if (page === "kind-words" && data.words) {
      applySeo(data.words, data.settings);
      text(document.querySelector(".kind-words .eyebrow"), data.words.eyebrow);
      text(document.querySelector("#words-title"), data.words.title);
      const previous = document.querySelector("#quote-prev");
      const next = document.querySelector("#quote-next");
      if (previous && data.words.previousLabel) previous.setAttribute("aria-label", data.words.previousLabel);
      if (next && data.words.nextLabel) next.setAttribute("aria-label", data.words.nextLabel);
      renderQuotes(data.testimonials);
    }

    if (page === "enquire") applyEnquiry(data.enquiry);
    if (page === "enquire" && data.enquiry) applySeo(data.enquiry, data.settings);
  }

  const query = queries[page];
  if (!query) {
    start();
    return;
  }

  const endpoint = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error("Sanity could not be reached");
      return response.json();
    })
    .then((payload) => {
      if (payload.result) apply(payload.result);
    })
    .catch(() => {})
    .finally(start);
})();
