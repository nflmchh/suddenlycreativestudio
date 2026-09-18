document.addEventListener("DOMContentLoaded", function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Strip #anchor from the URL after the scroll happens, so a later
  // refresh/visit lands at the top instead of jumping back to that section.
  var cleanUrlHash = function () {
    window.setTimeout(function () {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }, 900);
  };

  if (window.location.hash) {
    cleanUrlHash();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", cleanUrlHash);
  });

  // Mobile menu toggle
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
      var isOpen = mobileMenu.classList.contains("is-open");
      toggle.innerHTML = isOpen ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        toggle.innerHTML = '<i class="ph ph-list"></i>';
      });
    });
  }

  // Scroll reveal with a gentle stagger for items grouped in the same grid
  var revealEls = document.querySelectorAll(".reveal");

  revealEls.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains("reveal");
    });
    var index = siblings.indexOf(el);
    if (!prefersReducedMotion && siblings.length > 1) {
      el.style.transitionDelay = Math.min(index, 8) * 70 + "ms";
    }
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Navbar swaps to the panel tint once the page scrolls
  var navbar = document.querySelector(".navbar");

  if (navbar) {
    var updateNavbar = function () {
      navbar.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
  }

  // Services coverflow carousel — center slide full size, neighbors shrink
  var track = document.getElementById("servicesTrack");

  if (track) {
    var slides = Array.prototype.slice.call(track.querySelectorAll(".service-slide"));
    var dotsWrap = document.getElementById("servicesDots");
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll(".dot")) : [];
    var slider = track.closest(".services-slider");
    var prevBtn = slider ? slider.querySelector(".slider-arrow.prev") : null;
    var nextBtn = slider ? slider.querySelector(".slider-arrow.next") : null;
    var activeIndex = 0;
    var ticking = false;

    var updateSlides = function () {
      var trackRect = track.getBoundingClientRect();
      var centerX = trackRect.left + trackRect.width / 2;
      var closestIndex = 0;
      var closestDist = Infinity;

      slides.forEach(function (slide, i) {
        var rect = slide.getBoundingClientRect();
        var slideCenter = rect.left + rect.width / 2;
        var dist = Math.abs(centerX - slideCenter);
        // Normalize against one slide-width (+ gap) so the *immediate*
        // neighbor already reads as visually smaller/dimmer — normalizing
        // against the full track width made the falloff imperceptible.
        var unit = rect.width + 16;
        var t = Math.min(dist / unit, 1);

        if (!prefersReducedMotion) {
          slide.style.transform = "scale(" + (1 - t * 0.32).toFixed(3) + ")";
        }
        slide.style.opacity = (1 - t * 0.65).toFixed(3);

        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      activeIndex = closestIndex;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === closestIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === closestIndex);
      });
    };

    track.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            updateSlides();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", updateSlides);

    var scrollToSlide = function (index) {
      var slide = slides[Math.max(0, Math.min(slides.length - 1, index))];
      if (!slide) return;
      var trackRect = track.getBoundingClientRect();
      var slideRect = slide.getBoundingClientRect();
      var offset = slideRect.left + slideRect.width / 2 - (trackRect.left + trackRect.width / 2);
      track.scrollBy({ left: offset, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollToSlide(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollToSlide(activeIndex + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        scrollToSlide(i);
      });
    });

    updateSlides();
  }

  // Portfolio category filter
  var filterPills = document.querySelectorAll(".filter-pill");
  var portfolioCards = document.querySelectorAll(".portfolio-card");

  filterPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      filterPills.forEach(function (p) {
        p.classList.remove("is-active");
      });
      pill.classList.add("is-active");

      var filter = pill.getAttribute("data-filter");
      portfolioCards.forEach(function (card) {
        var matches = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  // Event modal — clones a <template> so gallery media isn't fetched
  // until the visitor actually opens that event.
  var eventModal = document.getElementById("eventModal");
  var eventModalBody = document.getElementById("eventModalBody");
  var eventModalTitle = document.getElementById("eventModalTitle");
  var eventModalClose = document.getElementById("eventModalClose");

  // Media lightbox — opens a properly sized, themed player/viewer above the
  // event modal, with prev/next to step through that event's whole gallery
  // without closing and re-opening it for each item.
  var mediaLightbox = document.getElementById("mediaLightbox");
  var mediaLightboxContent = document.getElementById("mediaLightboxContent");
  var mediaLightboxClose = document.getElementById("mediaLightboxClose");
  var mediaLightboxTitle = document.getElementById("mediaLightboxTitle");
  var mediaLightboxPrev = document.getElementById("mediaLightboxPrev");
  var mediaLightboxNext = document.getElementById("mediaLightboxNext");

  var currentGalleryItems = [];
  var currentGalleryIndex = -1;

  var buildWatermark = function () {
    var watermark = document.createElement("div");
    watermark.className = "video-watermark";
    watermark.setAttribute("aria-hidden", "true");
    var span = document.createElement("span");
    span.textContent = "SUDDENLY CREATIVE";
    watermark.appendChild(span);
    return watermark;
  };

  var closeMediaLightbox = function () {
    if (!mediaLightbox) return;
    mediaLightbox.classList.remove("is-open");
    mediaLightbox.setAttribute("aria-hidden", "true");
    mediaLightboxContent.innerHTML = "";
    currentGalleryItems = [];
    currentGalleryIndex = -1;
  };

  var renderLightboxItem = function (index) {
    var item = currentGalleryItems[index];
    if (!item || !mediaLightbox) return;

    currentGalleryIndex = index;
    mediaLightboxContent.innerHTML = "";

    if (mediaLightboxTitle) {
      mediaLightboxTitle.textContent = item.title || (item.type === "video" ? "Video" : "Foto");
    }

    if (item.type === "video") {
      var video = document.createElement("video");
      video.src = item.src;
      if (item.poster) {
        video.poster = item.poster;
      }
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute("controlsList", "nodownload noremoteplayback");
      video.setAttribute("disablePictureInPicture", "");
      video.setAttribute("oncontextmenu", "return false;");
      mediaLightboxContent.appendChild(video);
      mediaLightboxContent.appendChild(buildWatermark());
    } else {
      var img = document.createElement("img");
      img.src = item.src;
      img.draggable = false;
      img.setAttribute("oncontextmenu", "return false;");
      mediaLightboxContent.appendChild(img);
    }

    var hasMultiple = currentGalleryItems.length > 1;
    if (mediaLightboxPrev) mediaLightboxPrev.disabled = !hasMultiple;
    if (mediaLightboxNext) mediaLightboxNext.disabled = !hasMultiple;

    mediaLightbox.classList.add("is-open");
    mediaLightbox.setAttribute("aria-hidden", "false");
  };

  var openLightboxAt = function (items, index) {
    currentGalleryItems = items;
    renderLightboxItem(index);
  };

  var stepLightbox = function (delta) {
    if (!currentGalleryItems.length) return;
    var next = (currentGalleryIndex + delta + currentGalleryItems.length) % currentGalleryItems.length;
    renderLightboxItem(next);
  };

  if (mediaLightboxPrev) {
    mediaLightboxPrev.addEventListener("click", function () {
      stepLightbox(-1);
    });
  }

  if (mediaLightboxNext) {
    mediaLightboxNext.addEventListener("click", function () {
      stepLightbox(1);
    });
  }

  if (mediaLightboxClose) {
    mediaLightboxClose.addEventListener("click", closeMediaLightbox);
    mediaLightboxClose.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeMediaLightbox();
      }
    });
  }

  if (mediaLightbox) {
    mediaLightbox.addEventListener("click", function (e) {
      if (e.target === mediaLightbox) {
        closeMediaLightbox();
      }
    });
  }

  var closeEventModal = function () {
    if (!eventModal) return;
    eventModal.classList.remove("is-open");
    eventModal.setAttribute("aria-hidden", "true");
    eventModalBody.innerHTML = "";
  };

  var openEventModal = function (targetId, title) {
    var template = document.querySelector('template[data-event-template="' + targetId + '"]');
    if (!template || !eventModal) return;

    eventModalBody.innerHTML = "";
    eventModalBody.appendChild(template.content.cloneNode(true));
    eventModalTitle.textContent = title || "event.exe";
    eventModal.classList.add("is-open");
    eventModal.setAttribute("aria-hidden", "false");

    var galleryButtons = Array.prototype.slice.call(eventModalBody.querySelectorAll(".gallery-item"));
    var galleryItems = galleryButtons.map(function (btn) {
      if (btn.classList.contains("gallery-video")) {
        var posterImg = btn.querySelector("img");
        return {
          type: "video",
          src: btn.getAttribute("data-video-src"),
          poster: posterImg ? posterImg.src : null,
          title: btn.getAttribute("data-media-title") || "Video",
        };
      }
      var img = btn.querySelector("img");
      return {
        type: "image",
        src: img ? img.src : "",
        title: btn.getAttribute("data-media-title") || "Foto",
      };
    });

    galleryButtons.forEach(function (btn, index) {
      btn.addEventListener("click", function () {
        openLightboxAt(galleryItems, index);
      });
    });
  };

  portfolioCards.forEach(function (card) {
    var activate = function () {
      openEventModal(card.getAttribute("data-event-target"), card.querySelector(".portfolio-info h3").textContent);
    };
    card.addEventListener("click", activate);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  if (eventModalClose) {
    eventModalClose.addEventListener("click", closeEventModal);
    eventModalClose.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeEventModal();
      }
    });
  }

  if (eventModal) {
    eventModal.addEventListener("click", function (e) {
      if (e.target === eventModal) {
        closeEventModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (mediaLightbox && mediaLightbox.classList.contains("is-open")) {
      if (e.key === "Escape") {
        closeMediaLightbox();
      } else if (e.key === "ArrowLeft") {
        stepLightbox(-1);
      } else if (e.key === "ArrowRight") {
        stepLightbox(1);
      }
    } else if (e.key === "Escape" && eventModal && eventModal.classList.contains("is-open")) {
      closeEventModal();
    }
  });
});
