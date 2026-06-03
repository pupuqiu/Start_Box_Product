const html = document.documentElement;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const langButtons = document.querySelectorAll("[data-set-lang]");
const yearNodes = document.querySelectorAll("[data-year]");
const revealNodes = document.querySelectorAll(".reveal");
const videoOpenButtons = document.querySelectorAll("[data-open-video]");
const videoModal = document.querySelector(".video-modal");
const modalClose = document.querySelector(".modal-close");
const gallery = document.querySelector("[data-gallery]");
const galleryTrack = gallery?.querySelector(".gallery-track");
const gallerySlides = gallery ? Array.from(gallery.querySelectorAll(".gallery-slide")) : [];
const galleryDots = Array.from(document.querySelectorAll("[data-gallery-dot]"));
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");

const lineBreakTargets = document.querySelectorAll(
  "main h1 .en, main h1 .zh, main h2 .en, main h2 .zh"
);

const setScrolled = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setLanguage = (lang) => {
  html.dataset.lang = lang;
  localStorage.setItem("starbox-standalone-lang", lang);
};

const initialLang = localStorage.getItem("starbox-standalone-lang") || "en";
setLanguage(initialLang);
yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const applyLanguageLineBreaks = () => {
  lineBreakTargets.forEach((node) => {
    const source = node.dataset.sourceText || node.textContent.replace(/\s*\n+\s*/g, " ").replace(/\s{2,}/g, " ").trim();
    node.dataset.sourceText = source;

    if (node.classList.contains("zh")) {
      node.innerHTML = source
        .replace(/([，。])/g, "$1<br />")
        .replace(/<br \/>$/g, "");
      return;
    }

    node.innerHTML = source
      .replace(/([.,])\s+/g, "$1<br />")
      .replace(/([.,])$/g, "$1");
  });
};

applyLanguageLineBreaks();

window.addEventListener("scroll", setScrolled, { passive: true });
setScrolled();

menuToggle?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.setLang);
    header?.classList.remove("is-open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealNodes.forEach((node) => observer.observe(node));

videoOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    videoModal?.classList.add("is-open");
    const video = videoModal?.querySelector("video");
    video?.play();
  });
});

const closeVideo = () => {
  if (!videoModal) return;
  const video = videoModal.querySelector("video");
  video?.pause();
  videoModal.classList.remove("is-open");
};

modalClose?.addEventListener("click", closeVideo);
videoModal?.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideo();
});

if (gallery && galleryTrack && gallerySlides.length > 0) {
  let activeGalleryIndex = 0;

  const renderGallery = () => {
    galleryTrack.style.transform = `translateX(-${activeGalleryIndex * 100}%)`;
    gallerySlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeGalleryIndex);
    });
    galleryDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeGalleryIndex);
    });
  };

  const goToGallerySlide = (index) => {
    activeGalleryIndex = (index + gallerySlides.length) % gallerySlides.length;
    renderGallery();
  };

  galleryPrev?.addEventListener("click", () => goToGallerySlide(activeGalleryIndex - 1));
  galleryNext?.addEventListener("click", () => goToGallerySlide(activeGalleryIndex + 1));
  galleryDots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToGallerySlide(index));
  });

  renderGallery();
}
