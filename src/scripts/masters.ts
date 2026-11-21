function mountPortrait(slot: HTMLElement): void {
  if (slot.querySelector("img")) return;
  const avif = slot.dataset.avif;
  const webp = slot.dataset.webp;
  const src = slot.dataset.src;
  const alt = slot.dataset.alt ?? "";
  if (!src) return;

  const picture = document.createElement("picture");
  if (avif) {
    const s = document.createElement("source");
    s.type = "image/avif";
    s.srcset = avif;
    s.sizes = "(max-width: 767px) 92vw, (max-width: 1099px) 45vw, 22vw";
    picture.append(s);
  }
  if (webp) {
    const s = document.createElement("source");
    s.type = "image/webp";
    s.srcset = webp;
    s.sizes = "(max-width: 767px) 92vw, (max-width: 1099px) 45vw, 22vw";
    picture.append(s);
  }
  const img = document.createElement("img");
  img.className = "master-card__photo";
  img.src = src;
  img.alt = alt;
  img.width = 560;
  img.height = 700;
  img.loading = "lazy";
  img.decoding = "async";
  img.fetchPriority = "low";
  if (slot.dataset.objectPosition) {
    img.style.objectPosition = slot.dataset.objectPosition;
  }
  picture.append(img);
  slot.replaceChildren(picture);
}

function mountWorks(card: HTMLElement): void {
  const mount = card.querySelector<HTMLElement>("[data-master-works-mount]");
  if (!mount || mount.childElementCount > 0) return;

  let urls: string[] = [];
  try {
    urls = JSON.parse(card.dataset.masterWorks || "[]") as string[];
  } catch {
    return;
  }

  mount.innerHTML = urls
    .map(
      (src) =>
        `<img src="${src}" alt="" width="260" height="325" loading="lazy" decoding="async" fetchpriority="low" />`,
    )
    .join("");
}

export function initMasters(root: HTMLElement): void {
  const cards = root.querySelectorAll<HTMLElement>("[data-master-card]");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const slot = entry.target.querySelector<HTMLElement>("[data-master-portrait]");
          if (slot) mountPortrait(slot);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "200px 0px" },
    );
    cards.forEach((card) => io.observe(card));
  } else {
    cards.forEach((card) => {
      const slot = card.querySelector<HTMLElement>("[data-master-portrait]");
      if (slot) mountPortrait(slot);
    });
  }

  cards.forEach((card) => {
    const openCard = () => {
      mountWorks(card);
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    };

    const closeCard = () => {
      card.classList.remove("is-open");
      card.setAttribute("aria-expanded", "false");
    };

    const toggle = () => {
      if (card.classList.contains("is-open")) closeCard();
      else openCard();
    };

    card.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) openCard();
    });

    card.addEventListener("mouseleave", () => {
      if (window.matchMedia("(hover: hover)").matches) closeCard();
    });

    card.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-master-book]")) return;
      if (!window.matchMedia("(hover: hover)").matches) toggle();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if ((event.target as HTMLElement).closest("[data-master-book]")) return;
        event.preventDefault();
        toggle();
      }
    });
  });

  root.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-master-book]");
    if (!btn) return;
    const masterId = btn.dataset.masterBook;
    if (!masterId) return;
    document.dispatchEvent(
      new CustomEvent("gran:select-master", { detail: { masterId } }),
    );
  });
}
