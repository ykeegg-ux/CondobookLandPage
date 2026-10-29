(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mock = document.querySelector('.mock');
  if (mock && !reduce && window.matchMedia('(hover: hover)').matches) {
    mock.addEventListener('mousemove', function (e) {
      if (!mock.classList.contains('in')) return;
      var r = mock.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      mock.style.transition = 'transform .15s';
      mock.style.transform = 'perspective(1200px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 4) + 'deg)';
    });
    mock.addEventListener('mouseleave', function () {
      mock.style.transition = 'transform .6s';
      mock.style.transform = '';
    });
  }
})();
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var city = document.getElementById('city'), stage = document.getElementById('stage');
  if (city && stage) {
    var ry = 30, vel = 0.25, drag = false, lastX = 0, visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(city);
    (function loop() {
      if (visible) {
        if (!drag && !reduce) ry += vel;
        stage.style.setProperty('--ry', ry + 'deg');
      }
      requestAnimationFrame(loop);
    })();
    city.addEventListener('pointerdown', function (e) { drag = true; lastX = e.clientX; city.style.cursor = 'grabbing'; city.setPointerCapture(e.pointerId); });
    city.addEventListener('pointermove', function (e) { if (!drag) return; ry += (e.clientX - lastX) * .5; lastX = e.clientX; });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      city.addEventListener(ev, function () { drag = false; city.style.cursor = 'grab'; });
    });
  }
})();
