/* =========================================================
   Profesional Web · JavaScript SOLO de Inicio (index.html)
   Se carga después de general.js y usa sus herramientas (PW).
   ========================================================= */
(function () {
  'use strict';
  if (!window.PW) return;
  var PW = window.PW;

  /* ---------- 1. Filas de proyectos que se desplazan en sentidos opuestos ----------
     data-fx="par" */
  PW.efecto('par', function (el, r, vh) {
    var lim = 0.5 + r.height / (2 * vh);
    PW.setVar(el, '--c', PW.clamp((r.top + r.height / 2 - vh / 2) / vh, -lim, lim).toFixed(4));
  });

  /* ---------- 2. Bloque del precio ----------
     data-fx="price": aparece y las barras crecen al bajar.
     El número cuenta de 0 a 600 la primera vez que se ve. */
  var priceVal = PW.root.querySelector('.price-val');
  var priceDone = false;
  function countPrice() {
    priceDone = true;
    var target = parseInt(priceVal.textContent, 10) || 600;
    var t0 = 0;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 1600);
      var eased = 1 - Math.pow(1 - k, 4);
      priceVal.textContent = String(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(step);
    }
    priceVal.textContent = '0';
    requestAnimationFrame(step);
  }
  PW.efecto('price', function (el, r, vh) {
    var pp = PW.clamp01((vh * 0.92 - r.top) / (vh * 0.5 + r.height * 0.45));
    PW.setVar(el, '--p', pp.toFixed(3));
    if (!priceDone && priceVal && pp > 0.12) countPrice();
  });

  /* ---------- 3. "Del boceto a tu web en línea" ----------
     data-fx="track": la ventana pasa de boceto a código y a web al bajar. */
  PW.efecto('track', function (el, r, vh, vw) {
    var span = r.height - vh;
    var e = vw > 900 && span > 0 ? PW.clamp01(-r.top / span) : 1;
    PW.setVar(el, '--e', e.toFixed(4));
    PW.setAttr(el, 'data-step', e < 0.42 ? '1' : e < 0.76 ? '2' : '3');
  });
  if (!PW.live) {
    // Sin movimiento: se ve directamente el último paso
    PW.each(PW.root.querySelectorAll('[data-fx="track"]'), function (el) { PW.setAttr(el, 'data-step', '3'); });
  }
})();
