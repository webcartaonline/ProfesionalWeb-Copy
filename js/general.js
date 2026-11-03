/* =========================================================
   Profesional Web · JAVASCRIPT GENERAL
   Lo que funciona en todas las páginas:
   - animaciones al hacer scroll (las comunes)
   - página que se vuelve negra (Inicio y Servicios)
   - manchas de color, puntos y círculo que siguen al ratón
   - pausar animaciones que no se ven
   - menú del móvil
   - tarjetas que se inclinan, botón "imán" y brillo

   Lo que solo hace una página está en su propio archivo:
     inicio.js · servicios.js · proyectos.js · contacto.js
   Ese archivo se carga DESPUÉS de este y usa las herramientas
   que este deja preparadas en "PW" (mira el punto 1).

   Sin librerías: JavaScript normal (vanilla).
   Optimizado para que vaya fluido en cualquier móvil:
   - Los cálculos del scroll y del ratón se hacen como mucho
     una vez por fotograma.
   - Solo se escribe en la página cuando un valor cambia de verdad.
   - Cada variable se pone solo en el elemento que la usa.
   - Las animaciones que están fuera de la pantalla se pausan.
   ========================================================= */
(function () {
  'use strict';

  var root = document.querySelector('.pw');
  if (!root) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var live = !reduce;

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // Escribe una variable CSS solo si su valor ha cambiado
  function setVar(el, name, value) {
    var key = '_pw' + name;
    if (el[key] === value) return;
    el[key] = value;
    el.style.setProperty(name, value);
  }
  function setAttr(el, name, value) {
    if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  setAttr(root, 'data-live', live ? '1' : '0');

  /* ---------- 1. Animaciones según el scroll ----------
     Cada elemento con data-fx="tipo" recibe variables CSS (--p, --c, --e)
     que el CSS usa para moverlo, desenfocarlo o mostrarlo.

     Cada "tipo" es una pequeña función. Aquí están los que se usan
     en varias páginas. Los de una sola página se añaden desde su
     archivo con:  PW.efecto('tipo', function (el, r, vh, vw) { ... });
       el = el elemento · r = su posición en pantalla
       vh = alto de la pantalla · vw = ancho de la pantalla */
  var fxEls = root.querySelectorAll('[data-fx]');
  var progress = root.querySelector('.progress');
  var hero = root.querySelector('.hero');
  var raf = 0;
  var efectos = {};

  // Aparece al entrar en pantalla
  efectos['in'] = function (el, r, vh) {
    setVar(el, '--p', clamp01((vh - r.top) / (vh * 0.42)).toFixed(3));
  };
  // Se va "rellenando" mientras lo recorres (frases y pasos)
  efectos['fill'] = function (el, r, vh) {
    setVar(el, '--p', clamp01((vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.6)).toFixed(3));
  };
  // Nombre gigante del pie
  efectos['end'] = function (el, r, vh) {
    setVar(el, '--p', clamp01((vh - r.top) / r.height).toFixed(3));
  };

  // Sección que vuelve la página negra (data-dark-zone en el HTML)
  var darkZone = root.querySelector('[data-dark-zone]');

  if (!live) {
    // Sin movimiento: todo visible desde el principio
    each(fxEls, function (el) {
      setVar(el, '--p', '1');
      setVar(el, '--c', '0');
      setVar(el, '--e', '1');
    });
  }

  function update() {
    raf = 0;
    var sy = window.scrollY || window.pageYOffset || 0;
    setAttr(root, 'data-scrolled', sy > 40 ? '1' : '0');
    if (darkZone) {
      // Negro mientras la sección ocupa el centro de la pantalla
      var dz = darkZone.getBoundingClientRect();
      var vhh = window.innerHeight;
      setAttr(root, 'data-dark', dz.top < vhh * 0.6 && dz.bottom > vhh * 0.4 ? '1' : '0');
    }
    if (!live) return;

    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var max = document.documentElement.scrollHeight - vh;

    // Barra de progreso de lectura
    if (progress) setVar(progress, '--sp', max > 0 ? (sy / max).toFixed(4) : '0');
    // Efecto de la portada: solo mientras se ve
    if (hero) setVar(hero, '--sy', String(Math.round(Math.min(sy, 1400))));

    // Primero se leen todas las posiciones...
    var rects = [];
    for (var i = 0; i < fxEls.length; i++) rects.push(fxEls[i].getBoundingClientRect());

    // ...y después se escribe (así el navegador no recalcula la página a cada paso)
    for (var j = 0; j < fxEls.length; j++) {
      var fn = efectos[fxEls[j].getAttribute('data-fx')];
      if (fn) fn(fxEls[j], rects[j], vh, vw);
    }
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  update();

  /* ---------- 2. Ratón: manchas de color, puntos y círculo ----------
     Solo con ratón (en móviles y tablets no hace falta). */
  if (live && finePointer) {
    var parallaxEls = [];   // usan --mx / --my
    var pointerEls = [];    // usan --px / --py
    each(root.querySelectorAll('.orbs, .orbit'), function (el) { parallaxEls.push(el); });
    each(root.querySelectorAll('.chip'), function (el) {
      if (parallaxEls.indexOf(el.parentNode) < 0) parallaxEls.push(el.parentNode);
    });
    each(root.querySelectorAll('.cursor, .cursor-lens, .grid-glow'), function (el) { pointerEls.push(el); });

    var mx = 0, my = 0, mRaf = 0;
    var pointerShown = false;
    function applyPointer() {
      mRaf = 0;
      var x = (mx / window.innerWidth).toFixed(3);
      var y = (my / window.innerHeight).toFixed(3);
      var px = Math.round(mx) + 'px';
      var py = Math.round(my) + 'px';
      for (var i = 0; i < parallaxEls.length; i++) { setVar(parallaxEls[i], '--mx', x); setVar(parallaxEls[i], '--my', y); }
      for (var j = 0; j < pointerEls.length; j++) { setVar(pointerEls[j], '--px', px); setVar(pointerEls[j], '--py', py); }
    }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      mx = e.clientX; my = e.clientY;
      if (!pointerShown) { pointerShown = true; root.setAttribute('data-pointer', '1'); }
      if (!mRaf) mRaf = requestAnimationFrame(applyPointer);
    }, { passive: true });
  }

  /* ---------- 3. Pausar animaciones que no se ven ----------
     Las manchas de color, las órbitas, etc. se detienen cuando
     salen de la pantalla, para ahorrar batería y procesador. */
  if (live && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.removeAttribute('data-off');
        else en.target.setAttribute('data-off', '');
      });
    }, { rootMargin: '100px 0px' });
    each(root.querySelectorAll('.hero, .phead, .contact, .legal-head, .orbit-box, .evo-win, .cta'), function (el) { io.observe(el); });
  }

  /* ---------- 4. Menú del móvil ---------- */
  var burger = root.querySelector('.nav-burger');
  var panel = document.getElementById('menu-movil');
  function setMenu(open) {
    if (!burger || !panel) return;
    if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  if (burger && panel) {
    burger.addEventListener('click', function () { setMenu(panel.hasAttribute('hidden')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); }, { passive: true });
  }

  /* ---------- 5. Efectos solo para ratón ----------
     Tarjetas que se inclinan (data-tilt), botón "imán" (data-magnet)
     y brillo del bloque final (data-glow). */
  if (live && finePointer) {
    each(root.querySelectorAll('[data-tilt]'), function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        setVar(card, '--tx', (x - 0.5).toFixed(3));
        setVar(card, '--ty', (y - 0.5).toFixed(3));
        setVar(card, '--hx', (x * 100).toFixed(1) + '%');
        setVar(card, '--hy', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        setVar(card, '--tx', '0');
        setVar(card, '--ty', '0');
      });
    });

    each(root.querySelectorAll('[data-magnet]'), function (m) {
      m.addEventListener('pointermove', function (e) {
        var r = m.getBoundingClientRect();
        setVar(m, '--mbx', ((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1));
        setVar(m, '--mby', ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1));
      });
      m.addEventListener('pointerleave', function () {
        setVar(m, '--mbx', '0');
        setVar(m, '--mby', '0');
      });
    });

    each(root.querySelectorAll('[data-glow]'), function (g) {
      g.addEventListener('pointermove', function (e) {
        var r = g.getBoundingClientRect();
        setVar(g, '--gx', Math.round(e.clientX - r.left) + 'px');
        setVar(g, '--gy', Math.round(e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- 6. Herramientas para los archivos de cada página ---------- */
  window.PW = {
    root: root,               // el <div class="pw"> que envuelve la página
    live: live,               // false si la persona ha pedido "reducir movimiento"
    finePointer: finePointer, // true si se usa con ratón
    clamp: clamp,
    clamp01: clamp01,
    setVar: setVar,
    setAttr: setAttr,
    each: each,
    // Añade un tipo de animación de scroll (data-fx="tipo") y la aplica ya
    efecto: function (tipo, fn) {
      efectos[tipo] = fn;
      update();
    }
  };
})();
