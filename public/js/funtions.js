const serverUrl = 'http://localhost:3000/';

export function loadEntradas2() {

    $('#entradas-1-2').empty();

    $.ajax({
        url: 'api/products/entradas/2', // URL de la API
        method: 'GET',
        success: function (data) {
            // Limpiar el carrusel existente

            //alert("dd");
            // Iterar sobre los datos y crear los elementos del carrusel
            data.forEach((entrada) => {
                // Obtener las imágenes, títulos y párrafos desde los campos correspondientes
                const imagenes = JSON.parse(entrada.imagen); // Convertir el string a un array
                const titulos = JSON.parse(entrada.titulo); // Convertir el string a un array
                const parrafos = JSON.parse(entrada.parrafo); // Convertir el string a un array

                // Crear el HTML para cada item del carrusel
                imagenes.forEach((imagen, index) => {
                    const carouselItem = `
                            <div class="product-offer mb-30" style="height: 200px;">
                                <img class="img-fluid" src="uploads/entradas/${imagen}.jpg" alt="">
                                <div class="offer-text">
                                    <h6 class="text-white text-uppercase">${titulos[index]}</h6>
                                    <h3 class="text-white mb-3">${parrafos[index]}</h3>
                                    <a href="" class="btn btn-primary">Ver más</a>
                                </div>
                            </div>
                        `;

                    // Agregar el item al carrusel
                    $('#entradas-1-2').append(carouselItem);
                });

            });
        },
        error: function (error) {
            console.error('Error al cargar las entradas2:', error);
        }
    });


    $.ajax({
        url: 'api/products/entradas/3', // URL de la API
        method: 'GET',
        success: function (data) {
            // Limpiar el carrusel existente
            //alert("dd");
            // Iterar sobre los datos y crear los elementos del carrusel
            data.forEach((entrada) => {
                // Obtener las imágenes, títulos y párrafos desde los campos correspondientes
                const imagenes = JSON.parse(entrada.imagen); // Convertir el string a un array
                const titulos = JSON.parse(entrada.titulo); // Convertir el string a un array
                const parrafos = JSON.parse(entrada.parrafo); // Convertir el string a un array

                // Crear el HTML para cada item del carrusel
                imagenes.forEach((imagen, index) => {
                    const carouselItem = `
                            <div class="product-offer mb-30" style="height: 200px;">
                                <img class="img-fluid" src="uploads/entradas/${imagen}.jpg" alt="">
                                <div class="offer-text">
                                    <h6 class="text-white text-uppercase">${titulos[index]}</h6>
                                    <h3 class="text-white mb-3">${parrafos[index]}</h3>
                                    <a href="" class="btn btn-primary">Ver más</a>
                                </div>
                            </div>
                        `;

                    // Agregar el item al carrusel
                    $('#entradas-1-2').append(carouselItem);
                });

            });
        },
        error: function (error) {
            console.error('Error al cargar las entradas2:', error);
        }
    });






$('#entradas-4-5').empty();

$.ajax({
        url: 'api/products/entradas/4', // URL de la API
        method: 'GET',
        success: function (data) {
            // Limpiar el carrusel existente
            //alert("dd");
            // Iterar sobre los datos y crear los elementos del carrusel
            data.forEach((entrada) => {
                // Obtener las imágenes, títulos y párrafos desde los campos correspondientes
                const imagenes = JSON.parse(entrada.imagen); // Convertir el string a un array
                const titulos = JSON.parse(entrada.titulo); // Convertir el string a un array
                const parrafos = JSON.parse(entrada.parrafo); // Convertir el string a un array

                // Crear el HTML para cada item del carrusel
                imagenes.forEach((imagen, index) => {
                    const carouselItem = `
                        <div class="col-md-6">
                            <div class="product-offer mb-30" style="height: 200px;">
                                <img class="img-fluid" src="/uploads/entradas/${imagen}.jpg" alt="">
                                <div class="offer-text">
                                    <h6 class="text-white text-uppercase">${titulos[index]}</h6>
                                    <h3 class="text-white mb-3">${parrafos[index]}</h3>
                                    <a href="" class="btn btn-primary">Ver más</a>
                                </div>
                            </div>
                        </div>
                        `;

                    // Agregar el item al carrusel
                    $('#entradas-4-5').append(carouselItem);
                });

            });
        },
        error: function (error) {
            console.error('Error al cargar las entradas2:', error);
        }
    });





$.ajax({
        url: 'api/products/entradas/5', // URL de la API
        method: 'GET',
        success: function (data) {
            // Limpiar el carrusel existente
            //alert("dd");
            // Iterar sobre los datos y crear los elementos del carrusel
            data.forEach((entrada) => {
                // Obtener las imágenes, títulos y párrafos desde los campos correspondientes
                const imagenes = JSON.parse(entrada.imagen); // Convertir el string a un array
                const titulos = JSON.parse(entrada.titulo); // Convertir el string a un array
                const parrafos = JSON.parse(entrada.parrafo); // Convertir el string a un array

                // Crear el HTML para cada item del carrusel
                imagenes.forEach((imagen, index) => {
                    const carouselItem = `
                        <div class="col-md-6">
                            <div class="product-offer mb-30" style="height: 200px;">
                                <img class="img-fluid" src="uploads/entradas/${imagen}.jpg" alt="">
                                <div class="offer-text">
                                    <h6 class="text-white text-uppercase">${titulos[index]}</h6>
                                    <h3 class="text-white mb-3">${parrafos[index]}</h3>
                                    <a href="" class="btn btn-primary">Ver más</a>
                                </div>
                            </div>
                        </div>
                        `;

                    // Agregar el item al carrusel
                    $('#entradas-4-5').append(carouselItem);
                });

            });
        },
        error: function (error) {
            console.error('Error al cargar las entradas2:', error);
        }
    });







}


export function toggleNavbar() {

    fetch('api/products/categories')
        .then(response => response.json())
        .then(data => {
            const navDiv = document.querySelector('#navbar-vertical .navbar-nav');
            navDiv.innerHTML = ''; // Limpia las categorías actuales
            data.forEach(item => {
                const a = document.createElement('a');
                a.href = '';
                a.className = 'nav-item nav-link';
                a.textContent = item.categoria;
                navDiv.appendChild(a);
            });
        })
        .catch(error => {
            console.error('Error cargando categorías:', error);
        });

}
