/* =========================================================
   Profesional Web · componentes compartidos
   El menú de arriba (navbar) y el pie de página (footer)
   están SOLO aquí. Si cambias algo en este archivo, cambia
   a la vez en todas las páginas.

   En cada página solo hay dos "etiquetas" que los colocan:
     <pw-nav pagina="servicios"></pw-nav>
     <pw-footer pagina="servicios"></pw-footer>
   "pagina" sirve para marcar en el menú la página en la que estás.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. TUS DATOS: cambia aquí lo que quieras
     --------------------------------------------------------- */

  // Enlaces del menú de arriba (en ordenador y en el móvil)
  var MENU = [
    { id: 'inicio',    texto: 'Inicio',    archivo: 'index.html' },
    { id: 'servicios', texto: 'Servicios', archivo: 'servicios.html' },
    { id: 'proyectos', texto: 'Proyectos', archivo: 'proyectos.html' },
    { id: 'estudio',   texto: 'Estudio',   archivo: 'estudio.html' }
  ];

  // Botón del menú
  var BOTON = { texto: 'Escríbenos', archivo: 'contacto.html' };

  // Pie de página
  var PIE = {
    marca: 'Profesional Web',
    descripcion: 'Diseño y desarrollo web a medida. Webs rápidas, elegantes y fáciles de usar.',

    // Columna "Páginas"
    paginas: [
      { texto: 'Inicio',    archivo: 'index.html' },
      { texto: 'Servicios', archivo: 'servicios.html' },
      { texto: 'Proyectos', archivo: 'proyectos.html' },
      { texto: 'Estudio',   archivo: 'estudio.html' },
      { texto: 'Contacto',  archivo: 'contacto.html' }
    ],

    // Columna "Servicios"
    servicios: [
      { texto: 'Diseño web',          archivo: 'servicios.html' },
      { texto: 'Desarrollo a medida', archivo: 'servicios.html' },
      { texto: 'Mantenimiento',       archivo: 'servicios.html' }
    ],

    // Columna "Contacto"
    email: 'webcartaonline@gmail.com',
    telefono: '72 22 072 15',
    ciudad: 'Murcia',

    // Línea de abajo del todo
    legales: [
      { id: 'aviso-legal', texto: 'Aviso legal',            archivo: 'aviso-legal.html' },
      { id: 'privacidad',  texto: 'Política de privacidad', archivo: 'privacidad.html' },
      { id: 'cookies',     texto: 'Política de cookies',    archivo: 'cookies.html' }
    ],
    frase: 'Esta podría ser tu web'
    // El año del © se pone solo (siempre el año actual)
  };

  /* ---------------------------------------------------------
     2. CÓMO SE DIBUJAN (normalmente no hace falta tocar esto)
     --------------------------------------------------------- */

  var LOGO = '<svg viewBox="2800 1075 910 325" width="101" height="36" role="img" aria-label="Profesional Web"><g fill="currentColor"><text class="lw-b" x="2808.28" y="1216" font-family="Google Sans, sans-serif" font-weight="700" font-size="165">Profesional</text><text class="lw-r" x="3355.52" y="1382" font-family="Google Sans, sans-serif" font-weight="400" font-size="165">Web</text><path d="M2822 1346.5C2822 1323.58 2840.58 1305 2863.5 1305L3268.5 1305C3291.42 1305 3310 1323.58 3310 1346.5C3310 1369.42 3291.42 1388 3268.5 1388L2863.5 1388C2840.58 1388 2822 1369.42 2822 1346.5Z"></path></g></svg>';

  // Dirección de cada enlace. En 404.html se usa raiz="/" para que
  // los enlaces funcionen aunque alguien entre en una dirección rara.
  function url(archivo, raiz) {
    if (!raiz) return archivo;
    return archivo === 'index.html' ? raiz : raiz + archivo;
  }
  // Marca el enlace de la página en la que estás
  function actual(id, pagina) {
    return id === pagina ? ' aria-current="page"' : '';
  }

  function htmlNav(pagina, raiz) {
    var enlaces = MENU.map(function (m) {
      return '<li><a href="' + url(m.archivo, raiz) + '"' + actual(m.id, pagina) + '>' + m.texto + '</a></li>';
    }).join('\n');
    var enlacesMovil = MENU.map(function (m) {
      return '<a href="' + url(m.archivo, raiz) + '"' + actual(m.id, pagina) + '>' + m.texto + '</a>';
    }).join('\n');
    var boton = url(BOTON.archivo, raiz);

    return '<div class="nav">\n' +
      '<div class="nav-in">\n' +
      '<a class="nav-logo" href="' + url('index.html', raiz) + '">' + LOGO + '</a>\n' +
      '<nav aria-label="Principal">\n<ul class="nav-links">\n' + enlaces + '\n</ul>\n</nav>\n' +
      '<a class="btn btn-dark btn-sm nav-cta" href="' + boton + '">' + BOTON.texto + '</a>\n' +
      '<button class="nav-burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-movil"><span></span><span></span></button>\n' +
      '</div>\n' +
      '<nav class="nav-panel" id="menu-movil" aria-label="Menú" hidden>\n' + enlacesMovil + '\n' +
      '<a class="btn btn-primary" href="' + boton + '">' + BOTON.texto + '</a>\n' +
      '</nav>\n' +
      '</div>';
  }

  function lista(items, raiz) {
    return '<ul>\n' + items.map(function (i) {
      return '<li><a href="' + url(i.archivo, raiz) + '">' + i.texto + '</a></li>';
    }).join('\n') + '\n</ul>';
  }

  function htmlFooter(pagina, raiz) {
    var legales = PIE.legales.map(function (l) {
      return '<a href="' + url(l.archivo, raiz) + '"' + actual(l.id, pagina) + '>' + l.texto + '</a>';
    }).join('');

    return '<footer class="foot">\n' +
      '<div class="wrap foot-in">\n' +
      '<div class="foot-brand">\n<strong>' + PIE.marca + '</strong>\n<p class="body-sm">' + PIE.descripcion + '</p>\n</div>\n' +
      '<div>\n<p class="foot-h">Páginas</p>\n' + lista(PIE.paginas, raiz) + '\n</div>\n' +
      '<div>\n<p class="foot-h">Servicios</p>\n' + lista(PIE.servicios, raiz) + '\n</div>\n' +
      '<div>\n<p class="foot-h">Contacto</p>\n<ul>\n' +
      '<li><a href="' + url('contacto.html', raiz) + '">' + PIE.email + '</a></li>\n' +
      '<li><span>' + PIE.telefono + '</span></li>\n' +
      '<li><span>' + PIE.ciudad + '</span></li>\n' +
      '</ul>\n</div>\n' +
      '</div>\n' +
      '<div class="wrap foot-bottom"><span>© ' + new Date().getFullYear() + ' ' + PIE.marca + '</span>' +
      '<nav class="foot-legal" aria-label="Textos legales">' + legales + '</nav>' +
      '<span>' + PIE.frase + '</span></div>\n' +
      '<p class="foot-giant" data-fx="end" aria-hidden="true"><span>' + PIE.marca + '</span></p>\n' +
      '</footer>';
  }

  // Cambia la etiqueta <pw-nav> o <pw-footer> por el HTML de verdad
  function pintar(el) {
    if (!el.parentNode) return;
    var pagina = el.getAttribute('pagina') || '';
    var raiz = el.getAttribute('raiz') || '';
    el.outerHTML = el.localName === 'pw-nav' ? htmlNav(pagina, raiz) : htmlFooter(pagina, raiz);
  }

  if (window.customElements) {
    // Navegadores actuales: se pintan en cuanto aparecen, sin parpadeo
    ['pw-nav', 'pw-footer'].forEach(function (nombre) {
      function Componente() { return Reflect.construct(HTMLElement, [], Componente); }
      Componente.prototype = Object.create(HTMLElement.prototype);
      Componente.prototype.constructor = Componente;
      Componente.prototype.connectedCallback = function () { pintar(this); };
      Object.setPrototypeOf(Componente, HTMLElement);
      customElements.define(nombre, Componente);
    });
  } else {
    // Navegadores muy antiguos: se pintan al terminar de leer la página
    // (antes de que arranque main.js)
    document.addEventListener('readystatechange', function () {
      if (document.readyState !== 'interactive') return;
      Array.prototype.forEach.call(document.querySelectorAll('pw-nav, pw-footer'), pintar);
    });
  }
})();
