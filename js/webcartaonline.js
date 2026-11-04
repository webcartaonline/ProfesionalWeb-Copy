/* =========================================================
   Profesional Web · sección WebCartaOnline (servicios.html)
   - Cuatro pestañas; el móvil de al lado enseña la elegida con un
     vídeo real (carta de prueba y editor adminApp en el móvil).
   - Avanzan solas mientras la sección se ve en pantalla; cada pestaña
     dura lo que su vídeo (atributo data-ms del botón).
   - Se paran al pasar el ratón o al pulsar una pestaña (pasa a manual).
   ========================================================= */
(function () {
  'use strict';

  var sec = document.querySelector('[data-wco]');
  if (!sec) return;
  var tabs = Array.prototype.slice.call(sec.querySelectorAll('[data-wco-tab]'));
  var phone = sec.querySelector('.wco-phone');
  var screens = phone ? Array.prototype.slice.call(phone.querySelectorAll('.wco-screen')) : [];
  var say = sec.querySelector('[data-wco-say]');
  if (!tabs.length || !phone) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = 0, late = 0, visible = false, manual = reduce, hover = false;

  function ms(i) { return parseInt(tabs[i].getAttribute('data-ms'), 10) || 6000; }

  function cargar(i) {
    var v = screens[i] && screens[i].querySelector('video');
    if (v && v.preload !== 'auto') { v.preload = 'auto'; try { v.load(); } catch (e) {} }
  }

  function parar() {
    clearTimeout(late);
    screens.forEach(function (s) {
      var v = s.querySelector('video');
      if (v) { v.pause(); try { v.currentTime = 0; } catch (e) {} v.classList.remove('is-on'); }
    });
  }

  function reproducir(v) {
    if (!v || reduce || !visible) return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function show(i) {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', k === cur ? 'true' : 'false');
      t.setAttribute('tabindex', k === cur ? '0' : '-1');
    });
    screens.forEach(function (s, k) { s.classList.toggle('is-on', k === cur); });
    phone.removeAttribute('data-step');
    void phone.offsetWidth;
    phone.setAttribute('data-step', String(cur));
    if (say) say.textContent = tabs[cur].querySelector('b').textContent + '.';

    // Barrita de progreso: dura lo mismo que el vídeo de la pestaña
    sec.style.setProperty('--wco-t', ms(cur) + 'ms');
    var bar = tabs[cur].querySelector('.wco-tab-bar');
    if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }

    // Vídeo de la pantalla elegida
    parar();
    var v = screens[cur] && screens[cur].querySelector('video');
    cargar(cur); cargar(cur + 1 < screens.length ? cur + 1 : 0);
    if (v && v.classList.contains('wco-vid-late')) {
      // Primero se ve el QR y al "escanearlo" se abre la carta
      late = setTimeout(function () { v.classList.add('is-on'); reproducir(v); }, reduce ? 0 : 2600);
      if (reduce) v.classList.add('is-on');
    } else {
      reproducir(v);
    }
  }

  function loop() {
    clearTimeout(timer);
    var auto = visible && !manual && !hover;
    sec.setAttribute('data-auto', manual ? '0' : '1');
    sec.setAttribute('data-paused', auto ? '0' : '1');
    if (auto) timer = setTimeout(function () { show(cur + 1); loop(); }, ms(cur));
  }

  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { manual = true; show(k); loop(); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!n) return;
      e.preventDefault();
      manual = true; show(cur + n); tabs[cur].focus(); loop();
    });
  });

  var body = sec.querySelector('.wco-body');
  if (body) {
    body.addEventListener('mouseenter', function () { hover = true; loop(); });
    body.addEventListener('mouseleave', function () { hover = false; loop(); });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var antes = visible;
      visible = en[0].isIntersecting;
      // Al entrar en pantalla empieza desde la pestaña actual; al salir, se para el vídeo
      if (visible && !antes) show(cur);
      if (!visible) parar();
      loop();
    }, { threshold: 0.35 }).observe(body || sec);
  } else { visible = true; }

  show(0);
  loop();
})();
