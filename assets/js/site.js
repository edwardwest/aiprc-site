/* AIPRC site behaviour. No dependencies. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: hide when scrolling down, show when scrolling up (as on the original). */
  var header = document.getElementById('site-header');
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header && !header.classList.contains('is-open')) {
      if (y > 40 && y > lastY) header.classList.add('is-hidden');
      else if (y < lastY) header.classList.remove('is-hidden');
    }
    lastY = y;
    if (scrollTopBtn) scrollTopBtn.classList.toggle('is-visible', y > 300);
    updateScrollCues();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* Mobile menu */
  var toggle = header && header.querySelector('.site-header__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { toggle.click(); toggle.focus(); }
    });
  }

  /* Scroll-to-top button */
  var scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* Entrance animations: [data-animate] fades in when it enters the viewport. */
  var animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    animated.forEach(function (el) { io.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* "Scroll down" chevron under page heroes fades out as it leaves the viewport. */
  var cues = document.querySelectorAll('.scroll-cue');
  function updateScrollCues() {
    if (reduceMotion) return;
    cues.forEach(function (cue) {
      var r = cue.getBoundingClientRect();
      var progress = 1 - (r.top + r.height) / (window.innerHeight + r.height); // 0 entering, 1 leaving
      var opacity = progress <= 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.3);
      cue.style.opacity = opacity.toFixed(3);
    });
  }
  updateScrollCues();

  /* Logo carousel (mobile affiliations / partners) */
  document.querySelectorAll('.logo-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.logo-carousel__track');
    var slides = track.children.length;
    var dotsWrap = carousel.querySelector('.logo-carousel__dots');
    var index = 0;
    var timer;
    var dots = [];
    for (var i = 0; i < slides; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', (function (n) { return function () { go(n); restart(); }; })(i));
      dotsWrap.appendChild(b);
      dots.push(b);
    }
    function go(n) {
      index = (n + slides) % slides;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(index + 1); }, 5000);
    }
    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });
    go(0);
    restart();
  });

  /* Popups: <a data-popup-open="id"> opens <div class="popup" id="id">. */
  function openPopup(popup) {
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = popup.querySelector('input, button, a');
    if (first) first.focus();
  }
  function closePopup(popup) {
    popup.hidden = true;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-popup-open]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var popup = document.getElementById(link.getAttribute('data-popup-open'));
      if (!popup) return;
      e.preventDefault();
      popup._opener = link;
      openPopup(popup);
    });
  });
  document.querySelectorAll('.popup').forEach(function (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup || e.target.closest('[data-popup-close]')) {
        closePopup(popup);
        if (popup._opener) popup._opener.focus();
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.popup:not([hidden])').forEach(function (p) { closePopup(p); });
  });

  /* Closed forms: show the form's message instead of submitting. */
  document.querySelectorAll('form[data-closed-message]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var box = form.querySelector('.form-message');
      box.textContent = form.getAttribute('data-closed-message');
      box.hidden = false;
    });
  });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  onScroll();
})();
