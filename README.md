# GameZone - Desarrollo Frontend I (PFY2201) - Semana 6

## Actividad sumativa

**Optimizando la lógica y rendimiento de una página web con JavaScript**

El proyecto corresponde a la actividad sumativa de la Semana 6 de Desarrollo Frontend I (PFY2201).  
Se implementa un sitio web tipo e-commerce que combina Bootstrap 5 y JavaScript para mejorar la maquetación, la responsividad, la interactividad y la manipulación dinámica del DOM.

## Funcionalidades implementadas

- Diseño responsivo con Bootstrap 5.
- Navbar adaptable a escritorio, tablet y dispositivos móviles.
- Menú de productos con categorías simuladas:
  - Aventura
  - Carreras
  - Deportes
- Carrusel de videojuegos destacados.
- Catálogo cargado dinámicamente desde un archivo JSON local mediante Fetch API.
- Búsqueda de videojuegos por nombre o categoría mediante evento `submit`.
- Tarjetas de productos generadas dinámicamente con JavaScript.
- Botón **Agregar al carrito** mediante evento `click`.
- Carrito de compras dinámico con:
  - cantidad de productos;
  - subtotal por producto;
  - total de la compra;
  - eliminación de productos.
- Modal Bootstrap para visualizar detalles de cada videojuego.
- Manejo de errores en la carga de datos con un mensaje amigable para el usuario.
- Código JavaScript organizado en funciones reutilizables y comentadas.
- Uso de métodos de arrays como `forEach()`, `filter()`, `find()` y `reduce()`.
- Manipulación del DOM mediante `createElement()`, `appendChild()` y `DocumentFragment`.
- Accesibilidad mediante textos alternativos, atributos ARIA, regiones `aria-live` y foco visible.
- Ajuste de navegación interna mediante `scroll-padding-top`.

## Fetch API y archivo JSON

Los productos se almacenan en:

```text
assets/data/productos.json
```

El archivo `assets/js/app.js` utiliza Fetch API para cargar el catálogo de forma asíncrona.

Si la carga del JSON falla, la aplicación muestra un mensaje amigable y evita ejecutar búsquedas sobre datos no disponibles.

## Eventos implementados

### `submit`

El formulario de búsqueda permite filtrar los videojuegos por nombre o categoría.

### `click`

Se utiliza para:

- agregar videojuegos al carrito;
- quitar productos del carrito;
- seleccionar categorías desde la Navbar;
- abrir el modal de detalles de un producto.

## Manipulación dinámica del DOM

JavaScript genera y actualiza dinámicamente:

- las Cards del catálogo;
- los elementos del carrito;
- las cantidades;
- los subtotales;
- el total de la compra;
- los mensajes de estado;
- los datos mostrados en el modal.

## Estructura del proyecto

```text
PFY2201_Semana6_GameZone/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── data/
│   │   └── productos.json
│   ├── img/
│   │   ├── minecraft.jpg
│   │   ├── forza-horizon-5.jpg
│   │   ├── ea-sports-fc-26.jpg
│   │   └── carousel/
│   └── js/
│       └── app.js
└── capturas/
    ├── 01-Chrome-Desktop-Estructura.png
    ├── 02-Chrome-Busqueda-Carreras.png
    ├── 03-Chrome-Carrito-Producto.png
    ├── 04-Chrome-Fetch-Productos.png
    ├── 05-Chrome-Error-Fetch.png
    ├── 06-Chrome-Mobile-Menu.png
    ├── 07-Chrome-Tablet-Catalogo.png
    ├── 08-Chrome-Modal-Producto.png
    └── 09-Chrome-Carrito-Quitar.png
```

## Evidencias

Las capturas incluidas demuestran:

- estructura general de la página;
- funcionamiento responsivo en escritorio, tablet y móvil;
- búsqueda mediante evento `submit`;
- carga dinámica de productos mediante Fetch API;
- agregado de productos al carrito mediante evento `click`;
- actualización dinámica del carrito y del total;
- eliminación de productos;
- manejo de errores de carga;
- funcionamiento del Modal Bootstrap.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.3
- Fetch API
- JSON

## Ejecución

Para probar correctamente la carga del archivo JSON mediante Fetch API, el proyecto debe ejecutarse mediante un servidor web local o desde GitHub Pages.

## Entrega

El proyecto se entrega con la estructura solicitada para la Semana 6, incluyendo:

- `index.html`;
- carpeta `assets/js/`;
- carpeta `assets/css/`;
- carpeta `assets/img/`;
- archivo JSON utilizado por Fetch API;
- capturas de evidencia;
- repositorio público en GitHub;
- despliegue mediante `gh-pages`.

Los enlaces del repositorio y del despliegue público se incorporarán al momento de realizar la publicación final.
