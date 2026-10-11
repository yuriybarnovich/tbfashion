(function () {
  'use strict';

  document.getElementById('year').textContent = String(new Date().getFullYear());

  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  if (!items.length) return;

  var box = document.getElementById('lightbox');
  var img = box.querySelector('.lightbox__img');
  var counter = box.querySelector('.lightbox__counter');
  var current = -1;
  var lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    var a = items[current];
    img.src = a.getAttribute('href');
    img.alt = a.querySelector('img').alt;
    counter.textContent = (current + 1) + ' / ' + items.length;
    preload(current + 1);
    preload(current - 1);
  }

  function preload(i) {
    var a = items[(i + items.length) % items.length];
    var p = new Image();
    p.src = a.getAttribute('href');
  }

  function open(i) {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add('no-scroll');
    show(i);
    box.querySelector('.lightbox__close').focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('no-scroll');
    img.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
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
