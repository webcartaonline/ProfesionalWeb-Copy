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
    { id: 'nosotros',  texto: 'Nosotros',  archivo: 'nosotros.html' }
  ];

  // Menú del móvil: las mismas páginas y, al final, Contacto
  var MENU_MOVIL = MENU.concat([{ id: 'contacto', texto: 'Contacto', archivo: 'contacto.html' }]);

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
      { texto: 'Nosotros',  archivo: 'nosotros.html' },
      { texto: 'Contacto',  archivo: 'contacto.html' }
    ],

    // Columna "Servicios"
    // (si el enlace empieza por https:// se abre en una pestaña nueva)
    servicios: [
      { texto: 'Diseño web',     archivo: 'servicios.html' },
      { texto: 'WebCartaOnline', archivo: 'https://webcartaonline.com' }
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
    if (/^https?:\/\//.test(archivo)) return archivo; // enlace a otra web: tal cual
    if (!raiz) return archivo;
    return archivo === 'index.html' ? raiz : raiz + archivo;
  }
  // Marca el enlace de la página en la que estás
  function actual(id, pagina) {
    return id === pagina ? ' aria-current="page"' : '';
  }

  // Nombre de la página en la que estás (para el botón del móvil)
  function nombreActual(pagina) {
    var todas = MENU_MOVIL.concat(PIE.legales);
    for (var i = 0; i < todas.length; i++) {
      if (todas[i].id === pagina) return todas[i].texto;
    }
    return 'Menú';
  }

  function htmlNav(pagina, raiz) {
    var enlaces = MENU.map(function (m) {
      return '<li><a href="' + url(m.archivo, raiz) + '"' + actual(m.id, pagina) + '>' + m.texto + '</a></li>';
    }).join('\n');
    // Enlaces de la ventana del móvil: texto + flecha; entran escalonados (--i)
    var enlacesMovil = MENU_MOVIL.map(function (m, i) {
      return '<li style="--i: ' + i + '"><a class="page-menu__link" href="' + url(m.archivo, raiz) + '"' + actual(m.id, pagina) + '>' +
        '<span>' + m.texto + '</span><span class="page-menu__arrow" aria-hidden="true"></span></a></li>';
    }).join('\n');
    var boton = url(BOTON.archivo, raiz);

    return '<div class="nav">\n' +
      '<div class="nav-in">\n' +
      '<a class="nav-logo" href="' + url('index.html', raiz) + '">' + LOGO + '</a>\n' +
      '<nav aria-label="Principal">\n<ul class="nav-links">\n' + enlaces + '\n</ul>\n</nav>\n' +
      '<a class="btn btn-dark btn-sm nav-cta" href="' + boton + '">' + BOTON.texto + '</a>\n' +
      // Botón del móvil: muestra la página actual y abre la ventana de navegación
      '<button class="nav-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="menu-movil" aria-haspopup="dialog">' +
      '<span class="pw-oculto">Página actual: </span><span class="nav-current">' + nombreActual(pagina) + '</span>' +
      '<span class="pw-oculto">. Abrir menú de páginas</span><span class="nav-chevron" aria-hidden="true"></span></button>\n' +
      '</div>\n' +
      // Ventana de navegación del móvil (oculta hasta que se abre)
      '<div class="page-menu" id="menu-movil" data-menu hidden>\n' +
      '<div class="page-menu__backdrop" data-menu-close></div>\n' +
      '<nav class="page-menu__panel" aria-label="Navegación móvil">\n' +
      '<p class="page-menu__eyebrow">Ir a</p>\n' +
      '<ul class="page-menu__list">\n' + enlacesMovil + '\n</ul>\n' +
      '</nav>\n' +
      '</div>\n' +
      '</div>';
  }

  /* Ventana de navegación del móvil (funciona igual que en webcartaonline.com):
     el botón la abre y la cierra; se cierra también con el velo, con Escape
     o al elegir una página. Mientras está abierta no se mueve la página de
     detrás y el foco se queda dentro (botón + enlaces). */
  function iniciarMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');
    if (!toggle || !menu || toggle._pwMenu) return;
    toggle._pwMenu = true;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
    var timer;

    function abierto() { return toggle.getAttribute('aria-expanded') === 'true'; }

    function abrir() {
      clearTimeout(timer);
      menu.hidden = false;
      void menu.offsetWidth; // fuerza el estado inicial antes de animar
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('pw-locked', 'pw-menu-open');
      var actualEl = menu.querySelector('[aria-current="page"]') || links[0];
      if (actualEl) actualEl.focus({ preventScroll: true });
    }

    function cerrar(devolverFoco) {
      if (!abierto()) return;
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('pw-locked');
      timer = setTimeout(function () {
        menu.hidden = true;
        document.body.classList.remove('pw-menu-open');
      }, reduce.matches ? 0 : 380);
      if (devolverFoco !== false) toggle.focus();
    }

    toggle.addEventListener('click', function () { if (abierto()) cerrar(); else abrir(); });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-menu-close]')) cerrar();
      else if (e.target.closest('a')) cerrar(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!abierto()) return;
      if (e.key === 'Escape') { cerrar(); return; }
      // El foco da vueltas entre el botón y los enlaces de la ventana
      if (e.key === 'Tab') {
        var items = [toggle].concat(links);
        var i = items.indexOf(document.activeElement);
        var sig = e.shiftKey ? i - 1 : i + 1;
        if (sig < 0) sig = items.length - 1;
        if (sig >= items.length) sig = 0;
        e.preventDefault();
        items[sig].focus();
      }
    });

    // Al pasar a ordenador la ventana deja de tener sentido
    var escritorio = window.matchMedia('(min-width: 901px)');
    var alCambiar = function (e) { if (e.matches) cerrar(false); };
    if (escritorio.addEventListener) escritorio.addEventListener('change', alCambiar);
    else escritorio.addListener(alCambiar);
  }

  function lista(items, raiz) {
    return '<ul>\n' + items.map(function (i) {
      var fuera = /^https?:\/\//.test(i.archivo) ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + url(i.archivo, raiz) + '"' + fuera + '>' + i.texto + '</a></li>';
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
    if (el.localName === 'pw-nav') iniciarMenu();
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
