# Profesional Web

Tu web como archivos normales: HTML, CSS y JavaScript, sin librerías ni nada que instalar.
Está optimizada para cargar rápido en cualquier navegador y móvil, y preparada para publicarse en **Cloudflare**.

## Qué hay en esta carpeta

| Archivo o carpeta | Qué es |
| --- | --- |
| `index.html` | Inicio |
| `servicios.html`, `proyectos.html`, `nosotros.html`, `contacto.html` | El resto de páginas |
| `aviso-legal.html`, `privacidad.html`, `cookies.html` | Textos legales |
| `404.html` | La página que ve alguien si entra en una dirección que no existe |
| `css/general.css` | El diseño que comparten **todas** las páginas: colores, letras, botones, menú, pie, cursor y modo oscuro. |
| `css/inicio.css`, `css/servicios.css`, `css/proyectos.css`, `css/nosotros.css`, `css/contacto.css` | El diseño que **solo** tiene esa página. |
| `css/legal.css` | El diseño de los tres textos legales (aviso legal, privacidad y cookies). Comparten archivo porque son iguales. |
| `js/componentes.js` | **El menú de arriba y el pie de página.** Están solo aquí: si cambias algo en este archivo, cambia en todas las páginas a la vez. |
| `js/general.js` | Lo que se mueve o reacciona en **todas** las páginas: animaciones al hacer scroll, menú del móvil, efectos del ratón y la página que se vuelve negra. |
| `js/inicio.js`, `js/servicios.js`, `js/proyectos.js`, `js/contacto.js` | Lo que **solo** hace esa página: precio y ventana animada (Inicio), pestañas y línea de tiempo (Servicios), filtros (Proyectos), preguntas frecuentes y formulario (Contacto). Nosotros y los textos legales no necesitan uno propio. |
| `assets/fonts/` | Las fuentes Google Sans y Google Sans Code. Están dentro de tu web, así que no se conecta a Google. |
| `assets/img/` | Icono, tu foto (en 3 formatos: `.avif`, `.webp` y `.jpg`) y dos imágenes del efecto cristal del círculo que sigue al ratón. |
| `favicon.ico` | El icono de la pestaña del navegador. |
| `wrangler.jsonc` | La configuración que lee Cloudflare al publicar. |
| `_headers` | Le dice a Cloudflare cuánto tiempo pueden guardar los navegadores cada archivo (para que la web vuele al volver a entrar) y añade seguridad básica. |
| `_redirects` | Hace que la portada se vea en `tudominio.es/` y que `tudominio.es/servicios` lleve a la página correcta. |
| `.assetsignore` | Archivos que no se publican (este LEEME, la configuración...). |
| `.gitignore` | Archivos que no se suben a GitHub. |

## Cómo verla en tu ordenador

**Opción rápida:** haz doble clic en `index.html`. Casi todo funciona, pero el efecto cristal del círculo puede no verse, porque el navegador bloquea algunas imágenes cuando abres archivos sueltos.

**Opción recomendada (se ve igual que publicada):**

1. Abre Visual Studio Code.
2. Menú **Archivo › Abrir carpeta** y elige la carpeta `Profesional Web`.
3. En la barra de la izquierda, pulsa el icono de los cuatro cuadraditos (Extensiones), busca **Live Server** e instálala.
4. Abre `index.html` y pulsa **Go Live**, abajo a la derecha. Se abrirá la web en tu navegador.

Los archivos `_headers`, `_redirects` y `404.html` solo hacen su trabajo cuando la web está publicada en Cloudflare. En tu ordenador no pasa nada si no se notan.

## Antes de publicar: rellena los huecos

Todo lo que tienes que completar está **entre corchetes**. En Visual Studio Code pulsa `Ctrl + Shift + F` y busca `[` para encontrarlos todos.

- `[tu@email.com]`, `[Tu teléfono]`, `[Tu ciudad]`: página de Contacto (en el pie ya están puestos, en `js/componentes.js`).
- `[Tu NIF]`, `[Tu dirección completa]`, `[tudominio.es]`: `aviso-legal.html` y `privacidad.html`.
- `[Proveedor de alojamiento]` (pon **Cloudflare**), `[Proveedor de correo]`, `[Servicio de formularios]`, `[12 meses]`: `privacidad.html`.
- `[X semanas]`: preguntas frecuentes de `contacto.html`.
- `[Unas líneas sobre ti…]`: `nosotros.html`.

## Activar el formulario de contacto

Tu web se publica como páginas fijas: por sí sola no puede enviar emails. Para recibir los mensajes necesitas un servicio de formularios, por ejemplo Formspree.

1. Crea una cuenta en formspree.io con tu email.
2. Crea un formulario nuevo. Te dará una dirección parecida a `https://formspree.io/f/abcdwxyz`.
3. Abre `contacto.html`, busca `data-endpoint=""` y pega esa dirección entre las comillas:
   `data-endpoint="https://formspree.io/f/abcdwxyz"`
4. Guarda el archivo. Desde ese momento, los mensajes te llegarán al email.
5. En `privacidad.html`, cambia `[Servicio de formularios]` por el nombre del servicio (por ejemplo, Formspree).

Mientras no lo actives, al pulsar «Enviar mensaje» aparece un aviso con tu email. Así nadie piensa que ha enviado algo que no te ha llegado.

## Publicar en Cloudflare

La idea: tu código vive en GitHub (copia de seguridad) y Cloudflare lo coge de ahí y lo publica. Cada vez que subas un cambio a GitHub, Cloudflare actualiza la web solo, en un minuto.

**1. Sube la carpeta a GitHub.** Sube **todo** lo que hay dentro de `Profesional Web`, también los archivos que empiezan por punto o guion bajo (`.assetsignore`, `.gitignore`, `_headers`, `_redirects`) y `wrangler.jsonc`.

**2. Crea el proyecto en Cloudflare:**

1. Entra en dash.cloudflare.com.
2. En el menú de la izquierda, entra en **Workers y Pages** (en inglés: *Workers & Pages*).
3. Pulsa **Crear aplicación** (*Create application*).
4. Elige la opción de **importar un repositorio de GitHub** (*Import a repository* / *Continue with GitHub*). Si te pregunta, elige **Worker**, no Pages.
5. Si es la primera vez, te pedirá permiso para conectar con tu GitHub: acéptalo y elige tu repositorio.
6. En **Nombre del proyecto** escribe exactamente: `profesional-web` (tiene que coincidir con el nombre que hay dentro de `wrangler.jsonc`; si pones otro, cámbialo también allí).
7. **Comando de compilación** (*Build command*): déjalo vacío. **Comando de despliegue** (*Deploy command*): `npx wrangler deploy` (normalmente ya viene puesto).
8. Pulsa **Guardar y desplegar** (*Save and Deploy*).

En un minuto tendrás tu web en una dirección parecida a `profesional-web.tu-cuenta.workers.dev`.

**3. (Opcional) Tu propio dominio:** dentro del proyecto, ve a **Configuración › Dominios y rutas** (*Settings › Domains & Routes*) › **Añadir** › **Dominio personalizado** y escribe tu dominio.

## Cambios habituales

- **Menú y pie de página:** abre `js/componentes.js`. Arriba del todo, en «TUS DATOS», están los enlaces del menú, el botón, tu email, teléfono, ciudad y la frase del pie. Cambias una vez y se cambia en todas las páginas.
  - Para **añadir una página al menú**, copia una línea de `MENU` (por ejemplo la de Nosotros) y cambia el texto y el archivo. En la página nueva pon `<pw-nav pagina="nombre"></pw-nav>` y `<pw-footer pagina="nombre"></pw-footer>`, donde `nombre` es el `id` que le has dado.
  - Si cambias `componentes.js`, sube su número `?v=` en las páginas (igual que con el CSS, mira más abajo).
- **Textos:** abre el `.html` de la página y cambia el texto directamente.
- **Dónde cambiar el diseño:** si es algo que se ve en todas las páginas (colores, botones, letras…), en `css/general.css`. Si solo sale en una página, en el CSS de esa página (por ejemplo, el bloque del precio está en `css/inicio.css`). Con el JavaScript igual: `js/general.js` o el de la página.
  - Cada página carga primero lo general y después lo suyo. Por eso, si pones la misma regla en los dos, gana la de la página.
- **Colores:** en `css/general.css`, busca `--blue`, `--green` y `--orange` (están al principio).
- **Proyectos:** en `proyectos.html`, cada proyecto es un bloque `<article class="pj-card" data-cat="...">`. `data-cat` decide en qué filtro aparece: `web`, `qr` o `tienda`.
- **Quitar la animación de entrada de Inicio:** en `index.html`, borra el bloque `<div class="intro">…</div>`. (Ahora solo sale la primera vez que alguien entra; si vuelve a Inicio desde otra página, ya no la ve.)

### Si cambias un CSS o un JavaScript

Para que la web vaya rápida, los navegadores guardan el CSS y el JavaScript durante 1 día. Si cambias alguno y quieres que tus visitantes vean el cambio **al momento**, sube su número `?v=`:

1. En Visual Studio Code pulsa `Ctrl + Shift + H` (buscar y reemplazar en todos los archivos).
2. Busca el archivo con su número actual, por ejemplo `inicio.css?v=1`, y reemplázalo por el siguiente: `inicio.css?v=2`. La próxima vez, `?v=3`, y así.
3. Pulsa **Reemplazar todo**.

Solo tienes que subir el número del archivo que has cambiado. Si cambias `general.css`, aparece en todas las páginas, y el reemplazo las cambia todas de una vez.

Si se te olvida no pasa nada grave: como mucho, alguien que ya visitó la web verá la versión anterior durante un día.

### Si cambias tu foto

Tu foto está en 3 formatos para que pese poco: `foto-camilo-2.avif`, `foto-camilo-2.webp` (y sus versiones pequeñas `-560`) y `foto-camilo-2.jpg`. Si pones una foto nueva:

- **Lo más fácil:** sustituye `foto-camilo-2.jpg` por la nueva (con el mismo nombre) y, en `nosotros.html`, borra las dos líneas que empiezan por `<source`. Funcionará igual, solo que pesará un poco más.
- **Lo mejor:** crea también las versiones `.avif` y `.webp` con la web squoosh.app (gratis, en el navegador) y sustituye las de la carpeta.

Las imágenes se guardan 7 días en el navegador de quien visita. Para que una imagen nueva se vea al momento, ponle un nombre nuevo (por ejemplo `foto-camilo-3.jpg`) y cámbialo también en el HTML.

## Qué se ha optimizado

- **Animaciones más ligeras:** las manchas de color ya no usan desenfoque (que es lo que más cuesta al procesador); se ven igual pero el móvil trabaja mucho menos. Las animaciones que no están en pantalla se pausan solas.
- **En móviles y tablets** se quitan los desenfoques que se recalculan al hacer scroll y el efecto cristal sobre fondos animados. El diseño es el mismo y el scroll va fluido incluso en móviles sencillos.
- **JavaScript más eficiente:** el scroll y el ratón se calculan como mucho una vez por fotograma, y solo se toca lo que cambia.
- **Menos peso:** la fuente principal pasa de 87 KB a 28 KB, los iconos se han comprimido sin perder calidad y tu foto se sirve en AVIF/WebP (de 87 KB a unos 20–40 KB según la pantalla). Se carga solo cuando llegas a ella.
- **Compatibilidad:** se han añadido alternativas para navegadores antiguos (Safari de iPhones viejos, Firefox antiguo…), para que nada se descoloque.
- **Cloudflare:** caché en el navegador, sin redirecciones al cambiar de página, página 404 propia y cabeceras de seguridad.

## Ten en cuenta

- El menú y el pie ya **no** están copiados en cada página: cada página solo tiene `<pw-nav>` y `<pw-footer>`, y `js/componentes.js` los rellena. Por eso necesitan JavaScript para verse (hoy en día lo tienen todos los navegadores).
- En `404.html` todas las direcciones empiezan por `/` (por ejemplo `/servicios.html`). Es a propósito: así funciona aunque alguien entre en una dirección rara como `/blog/algo`. Por eso sus componentes llevan `raiz="/"`, que hace lo mismo con los enlaces del menú y del pie.
- Si quien visita la web tiene activada la opción «reducir movimiento» en su ordenador o móvil, las animaciones se desactivan solas.
- El diseño original sigue en el lienzo de Claude, pero los cambios que hagas aquí no se pasan al lienzo, ni al revés. A partir de ahora, esta carpeta es la versión buena.
