/* =========================================================
   Profesional Web · JavaScript SOLO de Contacto (contacto.html)
   Se carga después de general.js y usa sus herramientas (PW).
   ========================================================= */
(function () {
  'use strict';
  if (!window.PW) return;
  var PW = window.PW;
  var root = PW.root;

  /* ---------- 1. Preguntas frecuentes ----------
     Al abrir una pregunta se cierran las demás. */
  var questions = root.querySelectorAll('[data-faq]');
  PW.each(questions, function (q) {
    q.addEventListener('click', function () {
      var opening = q.getAttribute('aria-expanded') !== 'true';
      PW.each(questions, function (o) {
        var on = opening && o === q;
        o.setAttribute('aria-expanded', on ? 'true' : 'false');
        var item = o.closest('.faq-item');
        if (item) item.setAttribute('data-open', on ? 'true' : 'false');
        var answer = document.getElementById(o.getAttribute('aria-controls'));
        if (answer) { if (on) answer.removeAttribute('hidden'); else answer.setAttribute('hidden', ''); }
      });
    });
  });

  /* ---------- 2. Formulario de contacto ----------
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
