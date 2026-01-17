
const serverUrl = 'http://localhost:3000/';




function toggleNavbar() {

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

async function buscarProductos(txt) {
    const url = 'api/products/buscar'; // URL sin parámetros en la query
    try {
        const response = await fetch(url, {
            method: 'POST', // Cambiar a POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txt: txt }) // Enviar el parámetro en el body como { "txt": "adi" }
        });
        if (!response.ok) {
            throw new Error('Error en la conexión a la API');
        }
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error dev:', error);
    }
}




function mostrarProductos(productos) {
    const listaResultado = document.getElementById('lista-resultado');

    console.log("---------------");
    console.log(listaResultado);
    listaResultado.innerHTML = ''; // Limpiar resultados anteriores
    productos.forEach(producto => {
        const itemHTML = `
        <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
            <div class="product-item bg-light mb-4">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="${serverUrl}uploads/productos/${JSON.parse(producto.imagenes)[0]}.jpg" alt="${producto.nombre}">
                    <div class="product-action">
                        <a class="btn btn-outline-dark btn-square" onclick="aggproducto(${producto.codigo})"><i class="fa fa-shopping-cart"></i></a>
                        <a class="btn btn-outline-dark btn-square" onclick="aggproductoFav(${producto.codigo})"><i class="far fa-heart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="">${producto.nombre}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>$${producto.precio.toFixed(2)}</h5>
                        <h6 class="text-muted ml-2"><del>$${producto.precioOriginal.toFixed(2)}</del></h6>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mb-1">
                        ${'<small class="fa fa-star text-primary mr-1"></small>'.repeat(Math.floor(producto.estrellas))}
                        ${producto.estrellas % 1 !== 0 ? '<small class="fa fa-star-half-alt text-primary mr-1"></small>' : ''}
                        <small>(${producto.comentarios})</small>
                    </div>
                </div>
            </div>
        </div>
        `;
        listaResultado.innerHTML += itemHTML;
    });
}







const urlParams = new URLSearchParams(window.location.search);
const param1 = urlParams.get('busqueda'); // "valor1"

if (param1) {

    //alert(param1);
    buscarProductos(param1);
}