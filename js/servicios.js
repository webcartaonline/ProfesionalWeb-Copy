/* =========================================================
   Profesional Web · JavaScript SOLO de Servicios (servicios.html)
   Se carga después de general.js y usa sus herramientas (PW).
   ========================================================= */
(function () {
  'use strict';
  if (!window.PW) return;
  var PW = window.PW;
  var root = PW.root;

  /* ---------- 1. Línea de tiempo ----------
     data-fx="line": la línea se va pintando al bajar. */
  PW.efecto('line', function (el, r, vh) {
    PW.setVar(el, '--p', PW.clamp01((vh * 0.6 - r.top) / r.height).toFixed(3));
  });

  /* ---------- 2. Capas de la web (pestañas) ----------
     Botones con data-tab="1", "2"... y paneles con data-panel="1", "2"...
     Los botones con data-goto="2" saltan a esa pestaña. */
  var tabs = root.querySelectorAll('[data-tab]');
  function selectTab(k) {
    k = String(k);
    PW.each(tabs, function (t) { t.setAttribute('aria-selected', t.getAttribute('data-tab') === k ? 'true' : 'false'); });
    PW.each(root.querySelectorAll('[data-panel]'), function (p) {
      if (p.getAttribute('data-panel') === k) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    });
  }
  PW.each(tabs, function (t, i) {
    t.addEventListener('click', function () { selectTab(t.getAttribute('data-tab')); });
    if (PW.finePointer) {
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
  PW.each(root.querySelectorAll('[data-goto]'), function (b) {
    b.addEventListener('click', function () { selectTab(b.getAttribute('data-goto')); });
  });
})();
