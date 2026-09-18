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

    eventModalBody.querySelectorAll(".gallery-video").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var src = btn.getAttribute("data-video-src");
        var posterImg = btn.querySelector("img");

        var wrapper = document.createElement("div");
        wrapper.className = "gallery-item gallery-video-playing";

        var video = document.createElement("video");
        video.src = src;
        if (posterImg) {
          video.poster = posterImg.src;
        }
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute("controlsList", "nodownload noremoteplayback");
        video.setAttribute("disablePictureInPicture", "");
        video.setAttribute("oncontextmenu", "return false;");

        var watermark = document.createElement("div");
        watermark.className = "video-watermark";
        watermark.setAttribute("aria-hidden", "true");
        for (var i = 0; i < 6; i++) {
          var span = document.createElement("span");
          span.textContent = "SUDDENLY CREATIVE";
          watermark.appendChild(span);
        }

        wrapper.appendChild(video);
        wrapper.appendChild(watermark);
        btn.replaceWith(wrapper);
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
    if (e.key === "Escape" && eventModal && eventModal.classList.contains("is-open")) {
      closeEventModal();
    }
  });
});
