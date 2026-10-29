(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(function (el) {
        var t = +el.dataset.count, p = el.dataset.prefix || '', s = el.dataset.suffix || '', st = null;
        function step(ts) {
          if (!st) st = ts;
          var k = Math.min((ts - st) / 1400, 1);
          el.textContent = p + Math.round((1 - Math.pow(1 - k, 3)) * t) + s;
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();
