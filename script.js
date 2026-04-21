(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Scroll-aware nav ----------
  var nav = document.getElementById('nav');
  if (nav) {
    var setScrolled = function () {
      if (window.scrollY > 8) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '-10% 0px', threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---------- FAQ: close other details when one opens ----------
  var faqDetails = document.querySelectorAll('.faq details');
  faqDetails.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        faqDetails.forEach(function (other) {
          if (other !== d && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // ---------- Smooth scroll for in-page nav links ----------
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
})();
