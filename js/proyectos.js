/* =========================================================
   Profesional Web · JavaScript SOLO de Proyectos (proyectos.html)
   Se carga después de general.js y usa sus herramientas (PW).
   ========================================================= */
(function () {
  'use strict';
  if (!window.PW) return;
  var PW = window.PW;
  var root = PW.root;

  /* ---------- 1. Filtros ----------
     Botones con data-filter="web", "qr", "tienda" o "all".
     Cada proyecto lleva data-cat="..." para saber en qué filtro sale. */
  var pills = root.querySelectorAll('[data-filter]');
  PW.each(pills, function (pill) {
    pill.addEventListener('click', function () {
      var f = pill.getAttribute('data-filter');
      var n = 0;
      PW.each(pills, function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
      PW.each(root.querySelectorAll('[data-cat]'), function (card) {
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
})();
