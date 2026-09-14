document.addEventListener("DOMContentLoaded", function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // "Lihat Karya" swaps the Portfolio section into its vaporwave background
  var lihatKaryaBtn = document.getElementById("lihat-karya-btn");
  var portfolioSection = document.getElementById("portfolio");

  if (lihatKaryaBtn && portfolioSection) {
    lihatKaryaBtn.addEventListener("click", function () {
      portfolioSection.classList.add("vaporwave-active");
    });
  }
});
