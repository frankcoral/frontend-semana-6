"use strict";

/* =========================================================
   GameZone - Desarrollo Frontend I (PFY2201) - Semana 6
   Catálogo, búsqueda, carrito y Fetch API
   ========================================================= */

const RUTA_PRODUCTOS = "assets/data/productos.json";

const estado = {
    productos: [],
    carrito: [],
    categoriaActiva: "Todas",
    cargaFallida: false
};

const contenedorProductos = document.getElementById("contenedor-productos");
const estadoCatalogo = document.getElementById("estado-catalogo");
const formularioBusqueda = document.getElementById("form-busqueda");
const campoBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("btn-buscar");
const enlacesCategoria = document.querySelectorAll(".categoria-link");

const listaCarrito = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const mensajeCarrito = document.getElementById("mensaje-carrito");
const totalCarrito = document.getElementById("total-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");

const modalProducto = document.getElementById("modalProducto");
const tituloModalProducto = document.getElementById("titulo-modal-producto");
const imagenModalProducto = document.getElementById("imagen-modal-producto");
const categoriaModalProducto = document.getElementById("categoria-modal-producto");
const descripcionModalProducto = document.getElementById("descripcion-modal-producto");
const precioModalProducto = document.getElementById("precio-modal-producto");

/**
 * Inicia la aplicación y registra los eventos principales.
 */
function inicializarAplicacion() {
    configurarEventos();
    cargarProductos();
    renderizarCarrito();
}

/**
 * Registra los eventos de búsqueda, categorías, catálogo y carrito.
 */
function configurarEventos() {
    formularioBusqueda.addEventListener("submit", procesarBusqueda);
    contenedorProductos.addEventListener("click", procesarClickCatalogo);
    listaCarrito.addEventListener("click", procesarClickCarrito);

    enlacesCategoria.forEach(function (enlace) {
        enlace.addEventListener("click", procesarCategoria);
    });
}

/**
 * Obtiene los productos desde el archivo JSON local mediante Fetch API.
 */
async function cargarProductos() {
    mostrarEstadoCatalogo("Cargando productos...");
    alternarBusqueda(false);

    try {
        const respuesta = await fetch(RUTA_PRODUCTOS);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const productos = await respuesta.json();

        if (!Array.isArray(productos) || productos.length === 0) {
            throw new Error("El archivo JSON no contiene una lista válida de productos.");
        }

        estado.productos = productos;
        estado.cargaFallida = false;

        renderizarProductos(estado.productos);
        alternarBusqueda(true);
    } catch (error) {
        estado.productos = [];
        estado.cargaFallida = true;

        limpiarElemento(contenedorProductos);
        mostrarEstadoCatalogo(
            "No fue posible cargar los productos. Intenta nuevamente más tarde.",
            true
        );

        console.error("Error al cargar los productos:", error);
    }
}

/**
 * Activa o desactiva el formulario mientras se cargan los datos.
 *
 * @param {boolean} habilitado Estado de los controles de búsqueda.
 */
function alternarBusqueda(habilitado) {
    campoBusqueda.disabled = !habilitado;
    botonBuscar.disabled = !habilitado;
}

/**
 * Renderiza el catálogo utilizando un fragmento para reducir actualizaciones del DOM.
 *
 * @param {Array} productos Productos que se mostrarán.
 */
function renderizarProductos(productos) {
    limpiarElemento(contenedorProductos);

    if (productos.length === 0) {
        mostrarEstadoCatalogo("No se encontraron videojuegos.");
        return;
    }

    const fragmento = document.createDocumentFragment();

    productos.forEach(function (producto) {
        fragmento.appendChild(crearTarjetaProducto(producto));
    });

    contenedorProductos.appendChild(fragmento);
    mostrarEstadoCatalogo("");
}

/**
 * Crea una Card Bootstrap a partir de un producto del JSON.
 *
 * @param {Object} producto Producto a representar.
 * @returns {HTMLElement} Columna Bootstrap con la tarjeta creada.
 */
function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-lg-4";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card product-card h-100 shadow-sm";

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = `Portada de ${producto.nombre}`;
    imagen.className = "card-img-top product-image";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const categoria = document.createElement("p");
    categoria.className = "text-body-secondary small mb-2";
    categoria.textContent = producto.categoria;

    const titulo = document.createElement("h3");
    titulo.className = "card-title";
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "fw-bold fs-5 mt-auto mb-3";
    precio.textContent = formatearPrecio(producto.precio);

    const acciones = document.createElement("div");
    acciones.className = "d-grid gap-2";

    const botonAgregar = document.createElement("button");
    botonAgregar.type = "button";
    botonAgregar.className = "btn btn-primary";
    botonAgregar.dataset.accion = "agregar";
    botonAgregar.dataset.id = producto.id;
    botonAgregar.textContent = "Agregar al carrito";

    const botonDetalle = document.createElement("button");
    botonDetalle.type = "button";
    botonDetalle.className = "btn btn-outline-secondary";
    botonDetalle.dataset.accion = "detalle";
    botonDetalle.dataset.id = producto.id;
    botonDetalle.textContent = "Ver detalles";

    acciones.appendChild(botonAgregar);
    acciones.appendChild(botonDetalle);

    cuerpo.appendChild(categoria);
    cuerpo.appendChild(titulo);
    cuerpo.appendChild(descripcion);
    cuerpo.appendChild(precio);
    cuerpo.appendChild(acciones);

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}

/**
 * Procesa el evento submit del formulario de búsqueda.
 *
 * @param {SubmitEvent} evento Evento submit.
 */
function procesarBusqueda(evento) {
    evento.preventDefault();

    if (estado.cargaFallida || estado.productos.length === 0) {
        mostrarEstadoCatalogo(
            "No es posible realizar la búsqueda porque el catálogo no está disponible.",
            true
        );
        return;
    }

    const termino = campoBusqueda.value.trim().toLowerCase();
    const resultados = filtrarProductos(termino, estado.categoriaActiva);

    renderizarProductos(resultados);
}

/**
 * Filtra el catálogo por texto y categoría.
 *
 * @param {string} termino Texto ingresado por el usuario.
 * @param {string} categoria Categoría seleccionada.
 * @returns {Array} Productos coincidentes.
 */
function filtrarProductos(termino, categoria) {
    return estado.productos.filter(function (producto) {
        const coincideTexto =
            termino === "" ||
            producto.nombre.toLowerCase().includes(termino) ||
            producto.categoria.toLowerCase().includes(termino);

        const coincideCategoria =
            categoria === "Todas" || producto.categoria === categoria;

        return coincideTexto && coincideCategoria;
    });
}

/**
 * Filtra productos al seleccionar una categoría desde la Navbar.
 *
 * @param {MouseEvent} evento Evento click del enlace.
 */
function procesarCategoria(evento) {
    if (estado.cargaFallida || estado.productos.length === 0) {
        return;
    }

    const categoria = evento.currentTarget.dataset.categoria;
    estado.categoriaActiva = categoria;
    campoBusqueda.value = "";

    const resultados = filtrarProductos("", categoria);
    renderizarProductos(resultados);
}

/**
 * Gestiona los botones dinámicos de cada tarjeta del catálogo.
 *
 * @param {MouseEvent} evento Evento click dentro del catálogo.
 */
function procesarClickCatalogo(evento) {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const idProducto = Number(boton.dataset.id);

    if (boton.dataset.accion === "agregar") {
        agregarAlCarrito(idProducto);
    }

    if (boton.dataset.accion === "detalle") {
        mostrarDetalleProducto(idProducto);
    }
}

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 *
 * @param {number} idProducto Identificador del producto.
 */
function agregarAlCarrito(idProducto) {
    const producto = estado.productos.find(function (item) {
        return item.id === idProducto;
    });

    if (!producto) {
        return;
    }

    const productoExistente = estado.carrito.find(function (item) {
        return item.id === idProducto;
    });

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        estado.carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    renderizarCarrito();
    mostrarMensajeCarrito(`${producto.nombre} fue agregado al carrito.`);
}

/**
 * Renderiza el resumen dinámico del carrito.
 */
function renderizarCarrito() {
    limpiarElemento(listaCarrito);

    if (estado.carrito.length === 0) {
        carritoVacio.hidden = false;
        cantidadCarrito.textContent = "0 productos";
        totalCarrito.textContent = formatearPrecio(0);
        return;
    }

    carritoVacio.hidden = true;

    const fragmento = document.createDocumentFragment();

    estado.carrito.forEach(function (producto) {
        const elemento = document.createElement("li");
        elemento.className =
            "list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 px-0";

        const resumen = document.createElement("div");

        const nombre = document.createElement("strong");
        nombre.textContent = producto.nombre;

        const detalle = document.createElement("span");
        detalle.className = "d-block text-body-secondary small";
        detalle.textContent =
            `${producto.cantidad} × ${formatearPrecio(producto.precio)}`;

        resumen.appendChild(nombre);
        resumen.appendChild(detalle);

        const acciones = document.createElement("div");
        acciones.className = "d-flex align-items-center gap-3";

        const subtotal = document.createElement("span");
        subtotal.className = "fw-bold";
        subtotal.textContent =
            formatearPrecio(producto.precio * producto.cantidad);

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-sm btn-outline-danger";
        botonEliminar.dataset.accion = "eliminar";
        botonEliminar.dataset.id = producto.id;
        botonEliminar.textContent = "Quitar";
        botonEliminar.setAttribute("aria-label", `Quitar ${producto.nombre} del carrito`);

        acciones.appendChild(subtotal);
        acciones.appendChild(botonEliminar);

        elemento.appendChild(resumen);
        elemento.appendChild(acciones);
        fragmento.appendChild(elemento);
    });

    listaCarrito.appendChild(fragmento);

    const cantidadTotal = estado.carrito.reduce(function (acumulado, producto) {
        return acumulado + producto.cantidad;
    }, 0);

    const total = estado.carrito.reduce(function (acumulado, producto) {
        return acumulado + producto.precio * producto.cantidad;
    }, 0);

    cantidadCarrito.textContent =
        `${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`;
    totalCarrito.textContent = formatearPrecio(total);
}

/**
 * Gestiona la eliminación de productos desde el carrito.
 *
 * @param {MouseEvent} evento Evento click dentro de la lista.
 */
function procesarClickCarrito(evento) {
    const boton = evento.target.closest('button[data-accion="eliminar"]');

    if (!boton) {
        return;
    }

    const idProducto = Number(boton.dataset.id);

    estado.carrito = estado.carrito.filter(function (producto) {
        return producto.id !== idProducto;
    });

    renderizarCarrito();
    mostrarMensajeCarrito("El producto fue retirado del carrito.");
}

/**
 * Completa y abre el Modal Bootstrap con los datos del producto.
 *
 * @param {number} idProducto Identificador del producto.
 */
function mostrarDetalleProducto(idProducto) {
    const producto = estado.productos.find(function (item) {
        return item.id === idProducto;
    });

    if (!producto) {
        return;
    }

    tituloModalProducto.textContent = producto.nombre;
    imagenModalProducto.src = producto.imagen;
    imagenModalProducto.alt = `Portada de ${producto.nombre}`;
    categoriaModalProducto.textContent = producto.categoria;
    descripcionModalProducto.textContent = producto.descripcion;
    precioModalProducto.textContent = formatearPrecio(producto.precio);

    const modal = bootstrap.Modal.getOrCreateInstance(modalProducto);
    modal.show();
}

/**
 * Muestra un mensaje breve asociado al carrito.
 *
 * @param {string} mensaje Texto a informar.
 */
function mostrarMensajeCarrito(mensaje) {
    mensajeCarrito.textContent = mensaje;
}

/**
 * Convierte un valor numérico al formato de moneda chilena.
 *
 * @param {number} valor Precio numérico.
 * @returns {string} Precio formateado.
 */
function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(valor);
}

/**
 * Actualiza el mensaje informativo del catálogo.
 *
 * @param {string} mensaje Texto a mostrar.
 * @param {boolean} esError Indica si corresponde a un error.
 */
function mostrarEstadoCatalogo(mensaje, esError = false) {
    estadoCatalogo.textContent = mensaje;
    estadoCatalogo.classList.toggle("text-danger", esError);
    estadoCatalogo.classList.toggle("text-body-secondary", !esError);
}

/**
 * Elimina todos los nodos hijos de un elemento.
 *
 * @param {HTMLElement} elemento Elemento a limpiar.
 */
function limpiarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

document.addEventListener("DOMContentLoaded", inicializarAplicacion);
