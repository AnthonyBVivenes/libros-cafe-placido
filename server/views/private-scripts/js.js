const btnClickbtdfdfdonst = "fdd";



function btnPedidos_Click(opBtn) {
    //alert(opBtn);
    let elemento = document.getElementById(opBtn);

    if (elemento.style.display == 'inline') {
        elemento.style.display = 'none';
    } else {
        elemento.style.display = 'inline';

    }


    //let btn = document.getElementById('menuPedidos');


};


document.getElementById('aggproducto-imagenes').addEventListener('change', function (e) {
    const fileText = document.getElementById('file-chosen');
    if (this.files.length > 0) {
        fileText.textContent = this.files.length === 1
            ? this.files[0].name
            : `${this.files.length} archivos seleccionados`;
    } else {
        fileText.textContent = 'No hay archivos seleccionados';
    }
});





async function deleteProductoAsync(_id) {
    //alert(opBtn);
    const response = await fetch('/api/products/administracion/eliminarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: _id })
    });

    // Parse JSON response
    const result = await response.json();

    // Show success message
    alert(result.message || 'Producto eliminado correctamente');

    cargarProductos();

    return result;


    //let btn = document.getElementById('menuPedidos');


};



// JavaScript para la funcionalidad
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('context-menu');
    const tabla = document.getElementById('bdProductos-tabla');

    // Oculta el menú al hacer clic en cualquier lugar
    document.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    // Previene el menú contextual nativo
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Muestra el menú al hacer clic derecho en una fila
    tabla.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        // Posiciona el menú donde se hizo clic
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        menu.style.display = 'block';

        // Guarda la fila seleccionada
        const row = e.target.closest('tr');
        row.classList.add('selected-row');
    });

    // Acciones del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const selectedRow = document.querySelector('.selected-row');
            const action = e.currentTarget.classList[1];

            switch (action) {
                case 'ver':
                    console.log('Ver fila:', selectedRow.querySelector('td:first-child').textContent);
                    mostrarDetalleProducto(selectedRow.querySelector('td:first-child').textContent)
                    break;
                case 'editar':
                    console.log('Editar fila:', (selectedRow.querySelector('td:first-child').textContent));
                    abrirModalEdicion(selectedRow.querySelector('td:first-child').textContent);
                    break;
                case 'eliminar':
                    console.log('Eliminar fila:', selectedRow.querySelector('td:first-child').textContent);

                    deleteProductoAsync(selectedRow.querySelector('td:first-child').textContent);

                    break;
                case 'copiar':
                    console.log('Copiar ID de fila:', selectedRow);
                    break;
            }

            selectedRow.classList.remove('selected-row');
            menu.style.display = 'none';
        });
    });
});















$(document).ready(function () {
    // Manejador para mostrar archivos seleccionados
    const fileInput = document.getElementById('aggproducto-imagenes');
    const fileChosen = document.getElementById('aggproducto-filechosen');

    if (fileInput && fileChosen) {
        fileInput.addEventListener('change', function () {
            fileChosen.textContent = this.files.length > 0 ?
                `${this.files.length} archivo(s) seleccionado(s)` :
                'No hay archivos seleccionados';
        });
    }

    // Manejador del botón Agregar
    $('#aggproducto-btn').click(async function () {
        const $btn = $(this);
        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Procesando...');

        try {
            // Validar campos requeridos
            if (!$('#aggproducto-nombre').val() || !$('#aggproducto-precio').val()) {
                throw new Error('Nombre y precio son campos requeridos');
            }

            const formData = new FormData();
            formData.append('nombre', $('#aggproducto-nombre').val());
            formData.append('descripcion', $('#aggproducto-descripcion').val());
            formData.append('precio', $('#aggproducto-precio').val());
            formData.append('precioOriginal', $('#aggproducto-preciotachado').val() || 0);
            formData.append('estado', $('#aggproducto-estado').val());
            formData.append('cantidad', $('#aggproducto-cantidad').val() || 0);
            formData.append('peso', $('#aggproducto-peso').val() || 0);
            formData.append('talla', 'No especificado');
            formData.append('categorias', $('#aggproducto-categorias').val());
            formData.append('color', $('#aggproducto-color').val() || 'No especificado');
            formData.append('marca', $('#aggproducto-marca').val() || 'sin marca');

            // Agregar imágenes si existen
            const imagenes = $('#aggproducto-imagenes')[0].files;
            if (imagenes.length === 0) {
                formData.append('imagenes', '[]');
            } else {
                for (let i = 0; i < imagenes.length; i++) {
                    formData.append('imagenes', imagenes[i]);
                }
            }

            // Enviar datos
            const response = await fetch('/api/products/administracion/productos', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear producto');
            }

            alert(`Producto creado exitosamente (ID: ${data.id})`);
            location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            $btn.prop('disabled', false).html('Agregar');
        }
    });
});











/*bdd p */


document.addEventListener('DOMContentLoaded', () => {
    const tablaBody = document.getElementById('bdProductos-cuerpo');
    const inputBuscar = document.getElementById('bdProductos-nombre');
    const btnAnterior = document.getElementById('bdProductos-anterior');
    const btnSiguiente = document.getElementById('bdProductos-siguiente');
    const contadorPagina = document.getElementById('bdProductos-contador');

    let paginaActual = 1;
    const limite = 30;

    const cargarProductos = async () => {
        try {
            const respuesta = await fetch(`/api/products/administracion/productosView?buscar=${inputBuscar.value}&pagina=${paginaActual}&limite=${limite}`);
            const { productos, total } = await respuesta.json();

            tablaBody.innerHTML = productos.map(prod => `
                <tr>
                    <td>${prod.id}</td>
                    <td>${prod.nombre}</td>
                    <td><span class="estado ${prod.estado.toLowerCase()}">${prod.estado}</span></td>
                    <td>${prod.precio}$</td>
                    <td>${prod.cantidad}</td>
                </tr>
            `).join('');

            contadorPagina.textContent = paginaActual;

            // Deshabilitar botones según posición
            btnAnterior.disabled = paginaActual <= 1;
            btnSiguiente.disabled = (paginaActual * limite) >= total;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Event Listeners
    inputBuscar.addEventListener('input', () => {
        paginaActual = 1;
        cargarProductos();
    });

    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarProductos();
        }
    });

    btnSiguiente.addEventListener('click', () => {
        paginaActual++;
        cargarProductos();
    });

    // Carga inicial
    cargarProductos();
});















/* cargar */


const cargarProductos = async () => {
    try {
        const respuesta = await fetch(`/api/products/administracion/productosView?buscar=${inputBuscar.value}&pagina=${paginaActual}&limite=${limite}`);
        const {
            productos,
            total
        } = await respuesta.json();

        tablaBody.innerHTML = productos.map(prod => `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td><span class="estado ${prod.estado.toLowerCase()}">${prod.estado}</span></td>
                <td>${prod.precio}$</td>
                <td>${prod.cantidad}</td>
                <td><button class="ver-detalles-btn" onclick="mostrarDetalleProducto('${prod.id}')">Ver detalles</button></td>
            </tr>
        `).join('');

        contadorPagina.textContent = paginaActual;

        btnAnterior.disabled = paginaActual <= 1;
        btnSiguiente.disabled = (paginaActual * limite) >= total;
    } catch (error) {
        console.error("Error:", error);
    }
};

async function mostrarDetalleProducto(productoId) {
    alert(productoId);
    const overlay = document.getElementById('modal-detalle-overlay');
    const modal = document.getElementById('modal-detalle-producto');
    const loader = document.getElementById('loader');

    overlay.style.display = 'block';
    modal.style.display = 'block';
    loader.style.display = 'block';

    try {
        const response = await fetch('/api/products/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: productoId
            })
        });

        if (!response.ok) {
            throw new Error('No se pudo obtener la información del producto.');
        }

        const data = await response.json();
        const producto = data[0]; // El primer y único elemento del array

        document.getElementById('detalle-id').textContent = producto.id || productoId;
        document.getElementById('detalle-nombre').textContent = producto.nombre || 'N/A';
        document.getElementById('detalle-descripcion').textContent = producto.descripcion || 'N/A';
        document.getElementById('detalle-precio').textContent = (producto.precio ? producto.precio + '$' : 'N/A');
        document.getElementById('detalle-precioOriginal').textContent = (producto.precioOriginal ? producto.precioOriginal + '$' : 'N/A');
        document.getElementById('detalle-cantidad').textContent = producto.stock || 'N/A'; // Usando 'stock' en lugar de 'cantidad'
        document.getElementById('detalle-estado').textContent = (producto.estado == 1 ? 'Activo' : 'Inactivo') || 'N/A'; // Mapeo de estado
        document.getElementById('detalle-cantidad').textContent = producto.stock || 'N/A'; // Usando 'stock' en lugar de 'cantidad'

        document.getElementById('detalle-Marca').textContent = JSON.parse(producto.Marca)[0] || 'N/A'; // Usando 'stock' en lugar de 'cantidad'

    } catch (error) {
        console.error('Error al cargar los detalles:', error);
        alert('Ocurrió un error al cargar los detalles del producto.');
    } finally {
        loader.style.display = 'none';
    }
}

function cerrarDetalleProducto() {
    document.getElementById('modal-detalle-overlay').style.display = 'none';
    document.getElementById('modal-detalle-producto').style.display = 'none';
}
















/* EDICION */






// Funcionalidad de Edición
// Funcionalidad de Edición
async function abrirModalEdicion(productoId) {
    const overlay = document.getElementById('modal-edicion-overlay');
    const modal = document.getElementById('modal-edicion-producto');
    const loader = document.getElementById('loader');

    overlay.style.display = 'block';
    modal.style.display = 'block';
    loader.style.display = 'block';

    try {
        const response = await fetch('/api/products/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productoId })
        });

        if (!response.ok) {
            throw new Error('No se pudo obtener la información del producto para editar.');
        }

        const data = await response.json();
        // === CORRECCIÓN AQUI ===
        const producto = data[0]; // Accede al primer elemento del array
        // =======================

        if (!producto) {
            throw new Error('Producto no encontrado.');
        }

        alert(producto.nombre);
        console.log("editar=========", producto);

        // Rellenar los campos del formulario de edición
        document.getElementById('edit-id').value = productoId;
        document.getElementById('edit-nombre').value = producto.nombre || '';
        document.getElementById('edit-descripcion').value = producto.descripcion || '';
        document.getElementById('edit-precio').value = producto.precio || 0;
        document.getElementById('edit-preciotachado').value = producto.precioOriginal || 0;
        document.getElementById('edit-estado').value = producto.estado || 0;
        document.getElementById('edit-stock').value = producto.stock || 0;
        document.getElementById('edit-peso').value = producto.peso || 0;
        document.getElementById('edit-marca').value = JSON.parse(producto.Marca)[0] || '';

    } catch (error) {
        console.error('Error al cargar los detalles para edición:', error);
        alert('Ocurrió un error al cargar los detalles del producto.');
    } finally {
        loader.style.display = 'none';
    }
}

async function guardarEdicion() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    alert(parseInt(document.getElementById('edit-stock').value));
    const productoId = document.getElementById('edit-id').value;
    const datosActualizados = {
        id: productoId,
        nombre: document.getElementById('edit-nombre').value,
        descripcion: document.getElementById('edit-descripcion').value,
        precio: parseFloat(document.getElementById('edit-precio').value),
        precioOriginal: parseFloat(document.getElementById('edit-preciotachado').value),
        estado: parseInt(document.getElementById('edit-estado').value),
        cantidad: parseInt(document.getElementById('edit-stock').value),
        peso: parseFloat(document.getElementById('edit-peso').value),
        Marca: [document.getElementById('edit-marca').value]
    };

    try {
        const response = await fetch('/api/products/update', { // Nuevo endpoint de la API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.message);
            cerrarModalEdicion();
            cargarProductos();
        } else {
            throw new Error(resultado.message || 'Error desconocido.');
        }

    } catch (error) {
        console.error('Error al guardar la edición:', error);
        alert('Ocurrió un error al guardar los cambios del producto: ' + error.message);
    } finally {
        loader.style.display = 'none';
    }
}

function cerrarModalEdicion() {
    document.getElementById('modal-edicion-overlay').style.display = 'none';
    document.getElementById('modal-edicion-producto').style.display = 'none';
}

// Dentro de DOMContentLoaded, modifica el manejador del menú contextual
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const selectedRow = document.querySelector('.selected-row');
            const action = e.currentTarget.classList[1];
            const productoId = selectedRow.querySelector('td:first-child').textContent;

            switch (action) {
                case 'ver':
                    console.log('Ver fila:', productoId);
                    mostrarDetalleProducto(productoId);
                    break;
                case 'editar':
                    console.log('Editar fila:', productoId);
                    abrirModalEdicion(productoId);
                    break;
                case 'eliminar':
                    console.log('Eliminar fila:', productoId);
                    deleteProductoAsync(productoId);
                    break;
                case 'copiar':
                    console.log('Copiar ID de fila:', productoId);
                    navigator.clipboard.writeText(productoId).then(() => {
                        alert('ID copiado al portapapeles.');
                    }).catch(err => {
                        console.error('Error al copiar el ID:', err);
                    });
                    break;
            }
            selectedRow.classList.remove('selected-row');
            menu.style.display = 'none';
        });
    });
});























//######################Categorias#############################

$(document).ready(function () {
    // Manejador para mostrar archivos seleccionados
    const fileInput = document.getElementById('aggcategoria-imagenes');
    const fileChosen = document.getElementById('aggcategoria-filechosen');

    if (fileInput && fileChosen) {
        fileInput.addEventListener('change', function () {
            fileChosen.textContent = this.files.length > 0 ?
                `${this.files.length} archivo(s) seleccionado(s)` :
                'No hay archivos seleccionados';
        });
    }

    // Manejador del botón Agregar
    $('#aggcategoria-btn').click(async function () {
        const $btn = $(this);
        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Procesando...');

        try {
            // Validar campos requeridos
            if (!$('#aggcategoria-nombre').val()) {
                throw new Error('El nombre es un campo requerido');
            }

            const formData = new FormData();
            formData.append('nombre', $('#aggcategoria-nombre').val());
            formData.append('estado', $('#aggcategoria-estado').val());

            // Agregar imagen si existe
            const imagen = $('#aggcategoria-imagenes')[0].files[0];
            if (imagen) {
                formData.append('imagen', imagen);
            }

            // Enviar datos
            const response = await fetch('/admin/categorias/agg', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear categoría');
            }

            alert(`Categoría creada exitosamente (ID: ${data.id})`);
            // Limpiar formulario
            $('#aggcategoria-nombre').val('');
            $('#aggcategoria-imagenes').val('');
            $('#aggcategoria-filechosen').text('No hay archivos seleccionados');
            $('#aggcategoria-estado').val('1');
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            $btn.prop('disabled', false).html('Agregar');
        }
    });
});




$(document).ready(function () {
    let categoriasCargadas = false;
    let menuAbierto = false;
    
    // Función para cargar categorías
    async function cargarCategorias() {
        try {
            const response = await fetch('/api/products/categoriasData');
            
            if (!response.ok) {
                throw new Error('Error al cargar categorías');
            }
            
            const categorias = await response.json();
            const $select = $('#aggproducto-categorias');
            
            // Mantener solo la primera opción
            $select.find('option:not(:first)').remove();
            
            // Agregar cada categoría al select
            categorias.forEach(categoria => {
                $select.append($('<option>', {
                    value: categoria.idcategorias,
                    text: categoria.categoria
                }));
            });
            
            categoriasCargadas = true;
            console.log('Categorías cargadas exitosamente');
            
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }
    
    // Detectar cuando el dropdown se abre
    $('#aggproducto-categorias').on('focus', function() {
        menuAbierto = true;
        if (!categoriasCargadas) {
            cargarCategorias();
        }
    });
    
    // Detectar cuando el dropdown se cierra
    $('#aggproducto-categorias').on('blur', function() {
        menuAbierto = false;
    });
    
    // Prevenir recarga al cambiar selección
    $('#aggproducto-categorias').on('change', function() {
        // No hacer nada, solo prevenir recarga
    });
});

//#############################################################



// Agrega esta función a tu archivo js.js
function selectOption(id) {
    // Esconder todas las secciones de contenido
    
    // Mostrar la sección seleccionada
    $('#' + id).show();

    // Si la opción es "mensajes-mostrar", cargar los mensajes
    
        loadMessages();
    
     window.location.href= '#' + id;
}

// Agrega esta función a tu archivo js.js
async function loadMessages() {
    try {
        const response = await fetch('/api/contactos/get');
        if (!response.ok) {
            throw new Error('Error al cargar los mensajes');
        }
        
        const messages = await response.json();
        const tableBody = $('#messages-table-body');
        tableBody.empty(); // Limpiar la tabla antes de añadir nuevos datos

        if (messages.length > 0) {
            $('#no-messages-alert').hide();
            messages.forEach(msg => {
                const date = new Date(msg.receivedAt).toLocaleString();
                tableBody.append(`
                    <tr>
                        <td>${msg.name}</td>
                        <td>${msg.email}</td>
                        <td>${msg.subject}</td>
                        <td>${msg.message}</td>
                        <td>${date}</td>
                    </tr>
                `);
            });
        } else {
            $('#no-messages-alert').show();
        }

    } catch (error) {
        console.error('Error al cargar los mensajes:', error);
        $('#messages-table-body').empty();
        $('#messages-table-body').append(`<tr><td colspan="5" class="text-center">Error al cargar los mensajes. Intenta de nuevo.</td></tr>`);
    }
}