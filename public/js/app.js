
const serverUrl = 'http://localhost:3000/';

import { loadEntradas2 } from './funtions.js';






document.addEventListener('DOMContentLoaded', function () {
    const categoriesContainer = document.getElementById('row_categorias');

    // Función para obtener y mostrar categorías
    async function loadCategories() {
        try {
            const response = await fetch(serverUrl + 'api/products/categoriasData');
            const categorias = await response.json();

            // Limpiar contenedor primero
            categoriesContainer.innerHTML = '';

            // Generar HTML para cada categoría
            categorias.forEach((categoria, index) => {
                // Alternar entre items con y sin zoom (conservando el patrón original)
                const zoomClass = index % 2 === 0 ? '' : 'img-zoom';

                // Usar EXACTAMENTE la imagen que viene en el JSON
                const categoryHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                    <a class="text-decoration-none" href="tienda/${categoria.idcategorias}">
                        <div class="cat-item ${zoomClass} d-flex align-items-center mb-4">
                            <div class="overflow-hidden" style="width: 100px; height: 100px;">
                                <img class="img-fluid" src="${serverUrl}uploads/${categoria.img}.png" alt="${categoria.categoria}">
                            </div>
                            <div class="flex-fill pl-3">
                                <h6>${categoria.categoria}</h6>
                                <small class="text-body">100 Products</small>
                            </div>
                        </div>
                    </a>
                </div>
                `;

                categoriesContainer.insertAdjacentHTML('beforeend', categoryHTML);
            });

        } catch (error) {
            console.error('Error al cargar categorías:', error);
            categoriesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-danger">Error al cargar las categorías. Por favor intenta nuevamente.</p>
                </div>
            `;
        }
    }

    // Llamar a la función para cargar categorías
    loadCategories();
});


$(document).ready(function () {
    // Función para cargar las entradas y generar el carrusel
    function loadEntradas() {
        $.ajax({
            url: serverUrl+ 'api/products/entradas/1', // URL de la API
            method: 'GET',
            success: function (data) {
                // Limpiar el carrusel existente
                $('.carousel-inner').empty();

                // Iterar sobre los datos y crear los elementos del carrusel
                data.forEach((entrada) => {
                    // Obtener las imágenes, títulos y párrafos desde los campos correspondientes
                    const imagenes = JSON.parse(entrada.imagen); // Convertir el string a un array
                    const titulos = JSON.parse(entrada.titulo); // Convertir el string a un array
                    const parrafos = JSON.parse(entrada.parrafo); // Convertir el string a un array

                    // Crear el HTML para cada item del carrusel
                    imagenes.forEach((imagen, index) => {
                        const carouselItem = `
                            <div class="carousel-item position-relative ${index === 0 ? 'active' : ''}" style="height: 430px;">
                                <img class="position-absolute w-100 h-100" src="${serverUrl}uploads/entradas/${imagen}.jpg" style="object-fit: cover;">
                                <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                    <div class="p-3" style="max-width: 700px;">
                                        <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">${titulos[index]}</h1>
                                        <p class="mx-md-5 px-5 animate__animated animate__bounceIn">${parrafos[index]}</p>
                                        <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="tienda">Ver más</a>
                                    </div>
                                </div>
                            </div>
                        `;

                        // Agregar el item al carrusel
                        $('.carousel-inner').append(carouselItem);
                    });
                });
            },
            error: function (error) {
                console.error('Error al cargar las entradas:', error);
            }
        });
    }


    function loadProdtsDestacados() {
        $.ajax({
            url: serverUrl + 'api/products/destacados',
            method: 'GET',
            success: function (data) {
                console.log("Respuesta completa de la API:", data);

                // Limpiar el contenedor de productos
                $('#productosDestacados').empty();

                data.forEach((entrada, index) => {
                    console.group(`Producto ${index + 1}`);

                    try {
                        const producto = entrada[0]; // Acceder al primer elemento del array
                        console.log("Nombre:", producto.nombre);
                        console.log("Precio:", producto.precio);
                        console.log("Precio Original:", producto.precioOriginal);

                        // Parsear la cadena de imágenes
                        const imagenes = producto.imagenes ? JSON.parse(producto.imagenes) : [];
                        const primeraImagen = imagenes[0]; // Tomar solo la primera imagen
                        console.log("Primera Imagen:", primeraImagen);

                        console.log("Estrellas:", producto.estrellas);
                        console.log("Comentarios:", producto.comentarios);

                        // Crear el HTML para el item del carrusel
                        const carouselItem = `
                        <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                            <div class="product-item bg-light mb-4">
                                <div class="product-img position-relative overflow-hidden">
                                    <img class="img-fluid w-100" src="${serverUrl}uploads/productos/${primeraImagen}.jpg" alt="">
                                    <div class="product-action">
                                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-caret-left"></i></a>
                                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                        <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-caret-right"></i></a>
                                    </div>
                                </div>
                                <div class="text-center py-4">
                                    <a class="h6 text-decoration-none text-truncate" href="">${producto.nombre}</a>
                                    <div class="d-flex align-items-center justify-content-center mt-2">
                                        <h5>$${producto.precio.toFixed(2)}</h5>
                                        ${producto.precioOriginal > 0 ? `<h6 class="text-muted ml-2"><del>$${producto.precioOriginal.toFixed(2)}</del></h6>` : ''}
                                    </div>
                                    <div class="d-flex align-items-center justify-content-center mb-1">
                                        ${generateStars(producto.estrellas)}
                                        <small>(${producto.comentarios})</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                        // Agregar el item al contenedor de productos destacados
                        $('#productosDestacados').append(carouselItem);

                    } catch (error) {
                        console.error(`Error al procesar producto ${index + 1}:`, error);
                    }

                    console.groupEnd();
                });
            },
            error: function (error) {
                console.error('Error en la petición AJAX:', error);
            }
        });
    }

    // Función para generar estrellas
    function generateStars(estrellas) {
        const fullStars = Math.floor(estrellas); // Estrellas completas
        const halfStar = estrellas % 1 >= 0.5 ? 1 : 0; // Media estrella si es necesario
        const starsHtml = [];

        // Agregar estrellas completas
        for (let i = 0; i < fullStars; i++) {
            starsHtml.push('<small class="fa fa-star text-primary mr-1"></small>');
        }

        // Agregar media estrella si es necesario
        if (halfStar) {
            starsHtml.push('<small class="fa fa-star-half-alt text-primary mr-1"></small>');
        }

        // Agregar estrellas vacías hasta un total de 5
        for (let i = fullStars + halfStar; i < 5; i++) {
            starsHtml.push('<small class="fa fa-star text-muted mr-1"></small>');
        }

        return starsHtml.join('');
    }

    loadEntradas2();

    loadProdtsDestacados();

    // Llamar a la función al cargar la página
    loadEntradas();
});







