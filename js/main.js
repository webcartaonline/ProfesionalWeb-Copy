/* =========================================================
   Profesional Web · animaciones e interacciones
   Sin librerías: JavaScript normal (vanilla).

   Optimizado para que vaya fluido en cualquier móvil:
   - Los cálculos del scroll y del ratón se hacen como mucho
     una vez por fotograma.
   - Solo se escribe en la página cuando un valor cambia de verdad.
   - Cada variable se pone solo en el elemento que la usa
     (y no en toda la página), así el navegador recalcula mucho menos.
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
     Cada elemento con data-fx recibe variables CSS (--p, --c, --e)
     que el CSS usa para moverlo, desenfocarlo o mostrarlo. */
  var fxEls = root.querySelectorAll('[data-fx]');
  var progress = root.querySelector('.progress');
  var hero = root.querySelector('.hero');
  var raf = 0;

  if (!live) {
    // Sin movimiento: todo visible desde el principio
    each(fxEls, function (el) {
      setVar(el, '--p', '1');
      setVar(el, '--c', '0');
      setVar(el, '--e', '1');
      if (el.getAttribute('data-fx') === 'track') setAttr(el, 'data-step', '3');
    });
  }

  function update() {
    raf = 0;
    var sy = window.scrollY || window.pageYOffset || 0;
    setAttr(root, 'data-scrolled', sy > 40 ? '1' : '0');
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
      var el = fxEls[j];
      var r = rects[j];
      var type = el.getAttribute('data-fx');
      if (type === 'in') {
        // Aparece al entrar en pantalla
        setVar(el, '--p', clamp01((vh - r.top) / (vh * 0.42)).toFixed(3));
      } else if (type === 'fill') {
        // Se va "rellenando" mientras lo recorres (frases y pasos)
        setVar(el, '--p', clamp01((vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.6)).toFixed(3));
      } else if (type === 'line') {
        // Línea de tiempo de Servicios
        setVar(el, '--p', clamp01((vh * 0.6 - r.top) / r.height).toFixed(3));
      } else if (type === 'end') {
        // Nombre gigante del pie
        setVar(el, '--p', clamp01((vh - r.top) / r.height).toFixed(3));
      } else if (type === 'par') {
        // Filas de proyectos que se desplazan en sentidos opuestos
        var lim = 0.5 + r.height / (2 * vh);
        setVar(el, '--c', clamp((r.top + r.height / 2 - vh / 2) / vh, -lim, lim).toFixed(4));
      } else if (type === 'track') {
        // "Del código a la experiencia" (Inicio)
        var span = r.height - vh;
        var e = vw > 900 && span > 0 ? clamp01(-r.top / span) : 1;
        setVar(el, '--e', e.toFixed(4));
        setAttr(el, 'data-step', e < 0.42 ? '1' : e < 0.76 ? '2' : '3');
      }
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
     Tarjetas que se inclinan, botón "imán" y brillo del bloque final. */
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

  /* ---------- 6. Servicios: capas de la web ---------- */
  var tabs = root.querySelectorAll('[data-tab]');
  function selectTab(k) {
    k = String(k);
    each(tabs, function (t) { t.setAttribute('aria-selected', t.getAttribute('data-tab') === k ? 'true' : 'false'); });
    each(root.querySelectorAll('[data-panel]'), function (p) {
      if (p.getAttribute('data-panel') === k) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    });
  }
  each(tabs, function (t, i) {
    t.addEventListener('click', function () { selectTab(t.getAttribute('data-tab')); });
    if (finePointer) {
      t.addEventListener('pointerenter', function () {
        if (t.getAttribute('aria-selected') !== 'true') selectTab(t.getAttribute('data-tab'));
      });
    }
    t.addEventListener('keydown', function (e) {
      var next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null;
      if (next === null) return;
      e.preventDefault();
      var target = tabs[(next + tabs.length) % tabs.length];
      target.focus();
      selectTab(target.getAttribute('data-tab'));
    });
  });
  each(root.querySelectorAll('[data-goto]'), function (b) {
    b.addEventListener('click', function () { selectTab(b.getAttribute('data-goto')); });
  });

  /* ---------- 7. Proyectos: filtros ---------- */
  var pills = root.querySelectorAll('[data-filter]');
  each(pills, function (pill) {
    pill.addEventListener('click', function () {
      var f = pill.getAttribute('data-filter');
      var n = 0;
      each(pills, function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
      each(root.querySelectorAll('[data-cat]'), function (card) {
        var show = f === 'all' || card.getAttribute('data-cat') === f;
        if (show) {
          card.removeAttribute('hidden');
          card.style.setProperty('--i', n++);
          card.style.animation = 'none';
          void card.offsetWidth; // reinicia la animación de entrada
          card.style.animation = '';
        } else {
          card.setAttribute('hidden', '');
        }
      });
    });
  });

  /* ---------- 8. Preguntas frecuentes ---------- */
  var questions = root.querySelectorAll('[data-faq]');
  each(questions, function (q) {
    q.addEventListener('click', function () {
      var opening = q.getAttribute('aria-expanded') !== 'true';
      each(questions, function (o) {
        var on = opening && o === q;
        o.setAttribute('aria-expanded', on ? 'true' : 'false');
        var item = o.closest('.faq-item');
        if (item) item.setAttribute('data-open', on ? 'true' : 'false');
        var answer = document.getElementById(o.getAttribute('aria-controls'));
        if (answer) { if (on) answer.removeAttribute('hidden'); else answer.setAttribute('hidden', ''); }
      });
    });
  });

  /* ---------- 9. Formulario de contacto ----------
     Para que funcione de verdad, pega la dirección de tu servicio de
     formularios (por ejemplo Formspree) en el atributo data-endpoint
     del <form> en contacto.html. Mientras esté vacío, se muestra un
     aviso con tu email en lugar de fingir que se ha enviado. */
  var form = document.getElementById('contact-form');
  var sent = root.querySelector('.sent');
  if (form && sent) {
    var error = form.querySelector('.form-error');
    var button = form.querySelector('[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (error) error.setAttribute('hidden', '');
      var endpoint = (form.getAttribute('data-endpoint') || '').trim();
      if (!endpoint || !window.fetch) { if (error) error.removeAttribute('hidden'); return; }
      button.disabled = true;
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Error al enviar');
          form.reset();
          form.setAttribute('hidden', '');
          sent.removeAttribute('hidden');
        })
        .catch(function () { if (error) error.removeAttribute('hidden'); })
        .then(function () { button.disabled = false; });
    });
    var again = sent.querySelector('[data-reset]');
    if (again) again.addEventListener('click', function () {
      sent.setAttribute('hidden', '');
      form.removeAttribute('hidden');
    });
  }
})();
