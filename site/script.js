(function () {
  'use strict';

  document.documentElement.classList.add('js');
  document.getElementById('year').textContent = String(new Date().getFullYear());

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Nav: white over the hero, solid cream bar once the hero scrolls away ----------
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');
  var heroMedia = hero && hero.querySelector('.hero__media');
  var heroShade = hero && hero.querySelector('.hero__shade');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      if (!hero) return;
      var y = window.scrollY || window.pageYOffset;
      var h = hero.offsetHeight;
      if (nav) nav.classList.toggle('nav--solid', y >= h - nav.offsetHeight);
      // Parallax + shade on the hero only
      if (!reduceMotion && heroMedia) {
        if (y < h) {
          heroMedia.style.transform = 'translate3d(0,' + Math.round(y * 0.3) + 'px,0)';
          heroShade.style.opacity = String(Math.min((y / h) * 0.9, 0.65));
        }
      }
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // ---------- Reveal on scroll ----------
  var revealTargets = document.querySelectorAll(
    '.gallery__item, .section__title, .stats__list > div, .contact__lead, .contact__list'
  );
  if (!reduceMotion && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(batch * 70, 420) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
        batch += 1;
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(revealTargets, function (el) { io.observe(el); });
  }

  // ---------- Lightbox ----------
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  if (!items.length) return;

  var box = document.getElementById('lightbox');
  var img = box.querySelector('.lightbox__img');
  var counter = box.querySelector('.lightbox__counter');
  var current = -1;
  var lastFocus = null;
  var closing = false;

  function loadFull(i) {
    var a = items[i];
    var hi = new Image();
    hi.onload = function () { if (current === i) img.src = a.getAttribute('href'); };
    hi.src = a.getAttribute('href');
  }

  function show(i) {
    current = (i + items.length) % items.length;
    var a = items[current];
    var thumb = a.querySelector('img');
    img.style.transition = 'none';
    img.style.transform = '';
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    counter.textContent = (current + 1) + ' / ' + items.length;
    loadFull(current);
    preload(current + 1);
    preload(current - 1);
  }

  function preload(i) {
    var a = items[(i + items.length) % items.length];
    var p = new Image();
    p.src = a.getAttribute('href');
  }

  // FLIP: animate the full image from the thumbnail's position to its final place
  function flipFrom(a, reverse, done) {
    var from = a.querySelector('img').getBoundingClientRect();
    var to = img.getBoundingClientRect();
    if (!to.width || !to.height) { if (done) done(); return; }
    var sx = from.width / to.width;
    var sy = from.height / to.height;
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    var t = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    img.style.transition = 'none';
    img.style.transform = reverse ? '' : t;
    void img.offsetWidth; // flush
    img.style.transition = 'transform .55s cubic-bezier(.2,.7,.2,1)';
    img.style.transform = reverse ? t : '';
    if (done) window.setTimeout(done, 420);
  }

  function open(i) {
    lastFocus = document.activeElement;
    closing = false;
    box.classList.remove('lightbox--closing');
    box.hidden = false;
    document.body.classList.add('no-scroll');
    show(i);
    if (!reduceMotion) {
      window.requestAnimationFrame(function () { flipFrom(items[current], false); });
    }
    box.querySelector('.lightbox__close').focus();
  }

  function finishClose() {
    box.hidden = true;
    box.classList.remove('lightbox--closing');
    document.body.classList.remove('no-scroll');
    img.style.transition = 'none';
    img.style.transform = '';
    img.src = '';
    closing = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function close() {
    if (closing || box.hidden) return;
    if (reduceMotion) { finishClose(); return; }
    closing = true;
    box.classList.add('lightbox--closing');
    flipFrom(items[current], true, finishClose);
  }

  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      open(i);
    });
  });

  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.classList.contains('lightbox__figure')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  // Touch swipe
  var startX = 0, startY = 0;
  box.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  box.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });
})();
