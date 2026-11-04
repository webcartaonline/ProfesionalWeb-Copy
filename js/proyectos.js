/* =========================================================
   Profesional Web · JavaScript SOLO de Proyectos (proyectos.html)
   Carrusel de ejemplos que funciona con el SCROLL:
   - La sección es más alta que la pantalla y el carrusel se queda fijo.
   - Según lo que hayas bajado se muestra un ejemplo u otro:
     el nuevo sube desde abajo y el anterior sale por arriba.
   - La franja de abajo y los puntos llevan al ejemplo que toca.
   - "Ver el ejemplo" abre el detalle; la X o la tecla Esc lo cierran.
   ========================================================= */
(function () {
  'use strict';

  var sec = document.querySelector('[data-sc-sec]');
  var sc = document.querySelector('[data-sc]');
  if (!sec || !sc) return;

  var slides = Array.prototype.slice.call(sc.querySelectorAll('.sc-slide'));
  var dots = sc.querySelectorAll('[data-sc-go]');
  var num = sc.querySelector('[data-sc-num]');
  var n = slides.length;
  var cur = 0;      // ejemplo que se ve
  var target = 0;   // ejemplo que toca según el scroll
  var busy = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = reduce ? 30 : 1100; // lo que dura el cambio (ms)

  function pad(v) { return (v < 10 ? '0' : '') + v; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  function setState(el, state) {
    el.classList.remove('is-active', 'is-up', 'is-down');
    el.classList.add(state);
  }

  function preload(i) {
    if (i < 0 || i >= n) return;
    Array.prototype.forEach.call(slides[i].querySelectorAll('img[loading="lazy"]'), function (img) { img.loading = 'eager'; });
  }

  function updateUi() {
    if (num) num.textContent = pad(cur + 1);
    Array.prototype.forEach.call(dots, function (d, i) {
      if (i === cur) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    slides.forEach(function (s, i) {
      if (i === cur) s.removeAttribute('inert');
      else s.setAttribute('inert', '');
    });
    sc.setAttribute('data-last', cur === n - 1 ? '1' : '0');
    preload(cur + 1);
  }

  // Muestra el ejemplo "to" con la animación vertical
  function show(to) {
    if (busy || to === cur) return;
    if (sc.classList.contains('is-open')) {
      close(true);
      busy = true;
      setTimeout(function () { busy = false; sync(); }, 650);
      return;
    }
    busy = true;
    var dir = to > cur ? 1 : -1;
    var a = slides[cur];
    var b = slides[to];

    // La nueva se coloca abajo (o arriba si vuelves) sin animación...
    b.classList.add('no-tr');
    setState(b, dir > 0 ? 'is-down' : 'is-up');
    void b.offsetWidth;
    b.classList.remove('no-tr');

    // ...y las dos se mueven a la vez
    setState(a, dir > 0 ? 'is-up' : 'is-down');
    setState(b, 'is-active');
    cur = to;
    updateUi();
    setTimeout(function () { busy = false; sync(); }, T);
  }

  // Si mientras se animaba el usuario siguió bajando, va al que toca
  function sync() { if (target !== cur) show(target); }

  /* ---------- Scroll ---------- */
  var raf = 0;
  function measure() {
    raf = 0;
    var r = sec.getBoundingClientRect();
    var dist = sec.offsetHeight - window.innerHeight;
    var p = dist > 0 ? clamp01(-r.top / dist) : 0;
    sc.style.setProperty('--sp', p.toFixed(4));
    target = Math.min(n - 1, Math.floor(p * n));
    sync();
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(measure); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Lleva el scroll al punto donde se ve el ejemplo i
  function scrollToSlide(i) {
    var top = sec.getBoundingClientRect().top + window.pageYOffset;
    var dist = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + dist * ((i + 0.5) / n), behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- Detalle ---------- */
  function open() {
    sc.classList.add('is-open');
    var det = slides[cur].querySelector('.sc-det');
    det.setAttribute('aria-hidden', 'false');
    var x = det.querySelector('[data-sc-close]');
    setTimeout(function () { if (x) x.focus({ preventScroll: true }); }, 600);
  }
  function close(silent) {
    if (!sc.classList.contains('is-open')) return;
    sc.classList.remove('is-open');
    var det = slides[cur].querySelector('.sc-det');
    det.setAttribute('aria-hidden', 'true');
    if (!silent) {
      var b = slides[cur].querySelector('[data-sc-open]');
      if (b) b.focus({ preventScroll: true });
    }
  }

  sc.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t || !sc.contains(t)) return;
    if (t.hasAttribute('data-sc-next')) scrollToSlide(cur + 1 >= n ? 0 : cur + 1);
    else if (t.hasAttribute('data-sc-open')) open();
    else if (t.hasAttribute('data-sc-close')) close();
    else if (t.hasAttribute('data-sc-go')) scrollToSlide(parseInt(t.getAttribute('data-sc-go'), 10));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  updateUi();
  measure();
})();
