(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  function countUp(el) {
    var target = +el.dataset.count, start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Abas em pílula
  var tabs = document.querySelectorAll('.tab'), panels = document.querySelectorAll('.panel');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('on'); });
      panels.forEach(function (p) { p.classList.remove('on'); });
      t.classList.add('on');
      panels[+t.dataset.tab].classList.add('on');
    });
  });

  // Parallax dos cards flutuantes + tilt do mockup
  var mock = document.querySelector('.mock');
  var floats = document.querySelectorAll('.float');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mock && !reduce) {
    var speeds = [0.06, -0.05, 0.08];
    window.addEventListener('scroll', function () {
      var r = mock.getBoundingClientRect();
      var off = (window.innerHeight / 2 - (r.top + r.height / 2));
      floats.forEach(function (f, i) { f.style.translate = '0 ' + (off * speeds[i]) + 'px'; });
    }, { passive: true });
    var win = mock.querySelector('.mock__win');
    mock.addEventListener('mousemove', function (e) {
      var r = mock.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      win.style.transition = 'transform .1s';
      win.style.transform = 'rotateY(' + x * 6 + 'deg) rotateX(' + (-y * 5) + 'deg)';
    });
    mock.addEventListener('mouseleave', function () {
      win.style.transition = 'transform .6s';
      win.style.transform = '';
    });
  }

  // Botões apenas visuais (sem integração)
  document.querySelectorAll('button.btn').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();

/* ===== 3D: tilt, cubos, cidade ===== */
(function () {
  var fine = window.matchMedia('(hover: hover)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tilt com brilho que segue o mouse
  if (fine && !reduce) {
    document.querySelectorAll('.card,.ben,.step,.pv-card,.kpi').forEach(function (el) {
      el.setAttribute('data-tilt', '');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('tilting');
        el.style.setProperty('--mx', x * 100 + '%');
        el.style.setProperty('--my', y * 100 + '%');
        el.style.transform = 'perspective(800px) rotateY(' + ((x - .5) * 16) + 'deg) rotateX(' + ((.5 - y) * 14) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('tilting');
        el.style.transform = '';
      });
    });

    // Cubos do hero reagem ao mouse (profundidade)
    var hero = document.querySelector('.hero');
    var cubes = document.querySelectorAll('.cube');
    hero.addEventListener('mousemove', function (e) {
      var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
      cubes.forEach(function (c) {
        var d = +c.dataset.depth;
        c.style.translate = (x * d * 2) + 'px ' + (y * d * 2) + 'px';
      });
    });
  }

  // Cidade 3D: rotação automática + arrastar
  var city = document.getElementById('city'), stage = document.getElementById('stage');
  if (city && stage) {
    var ry = 30, vel = 0.25, drag = false, lastX = 0, visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(city);
    function loop() {
      if (visible) {
        if (!drag && !reduce) ry += vel;
        stage.style.setProperty('--ry', ry + 'deg');
      }
      requestAnimationFrame(loop);
    }
    loop();
    city.addEventListener('pointerdown', function (e) { drag = true; lastX = e.clientX; city.style.cursor = 'grabbing'; city.setPointerCapture(e.pointerId); });
    city.addEventListener('pointermove', function (e) { if (!drag) return; ry += (e.clientX - lastX) * .5; lastX = e.clientX; });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      city.addEventListener(ev, function () { drag = false; city.style.cursor = 'grab'; });
    });
  }
})();
