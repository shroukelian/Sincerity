document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  // Mobile menu
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // Header state + scroll progress
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll: replays every time an element enters or leaves the viewport
  var revealItems = document.querySelectorAll('.reveal');
  revealItems.forEach(function (el) {
    var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
    var idx = Array.prototype.indexOf.call(siblings, el);
    if (idx > -1) el.style.transitionDelay = (idx % 4) * 90 + 'ms';
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Highlight the nav link of the section being viewed
  var links = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          map[entry.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  // Gallery filter
  var filters = document.getElementById('filters');
  var items = document.querySelectorAll('.g-item');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filters.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var f = btn.getAttribute('data-filter');
      items.forEach(function (item) {
        var cats = (item.getAttribute('data-cat') || '').split(' ');
        item.classList.toggle('is-hidden', !(f === 'all' || cats.indexOf(f) > -1));
      });
    });
  }
});