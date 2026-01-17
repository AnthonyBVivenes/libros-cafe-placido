


function aggproducto(id, _cantidad = 1) {


    $.ajax({
        url: '/api/products/pedidos/agregar-producto', // URL del endpoint
        type: 'POST', // Método HTTP
        dataType: 'json', // Tipo de dato esperado en la respuesta
        data: { // Datos que envías al servidor
            idProducto: id,
            cantidad: _cantidad
        },
        success: function (response) {
            // Esta función se ejecuta si la petición es exitosa
            console.log('Respuesta del servidor:', response);
            showNotification(response.message);
            setTimeout(() => {
                location.reload();
            }, 1000);
        },
        error: function (xhr, status, error) {
            console.error('Error en la petición:', error);
            showNotification(
                'Error al agregar el producto: ' +
                xhr.responseJSON.message ||
                'Error desconocido',
                'error',
                10000
            );
        }
    });
}

function aggproductoFav(id) {


    $.ajax({
        url: '/api/products/fav', // URL del endpoint
        type: 'POST', // Método HTTP
        dataType: 'json', // Tipo de dato esperado en la respuesta
        data: { // Datos que envías al servidor
            idProducto: id,
        },
        success: function (response) {
            // Esta función se ejecuta si la petición es exitosa
            console.log('Respuesta del servidor:', response);
            showNotification(response.message);
            setTimeout(() => {
                location.reload();
            }, 1000);
        },
        error: function (xhr, status, error) {
            console.error('Error en la petición:', error);
            showNotification(
                'Error al agregar el producto: ' +
                xhr.responseJSON.message ||
                'Error desconocido',
                'error',
                10000
            );
        }
    });
}

function reducirProducto(id, _cantidad = 1) {
    $.ajax({
        url: '/api/products/reduceProd', // URL del endpoint
        type: 'POST', // Método HTTP
        dataType: 'json', // Tipo de dato esperado en la respuesta
        data: { // Datos que envías al servidor
            idProducto: id,
            cantidad: _cantidad
        },
        success: function (response) {
            // Esta función se ejecuta si la petición es exitosa
            console.log('Respuesta del servidor:', response);
            showNotification(response.message);

            // Actualizar la interfaz si es necesario
            if (response.success) {
                // Recargar la página para ver los cambios
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en la petición:', error);
            showNotification(
                'Error al reducir el producto: ' +
                (xhr.responseJSON ? xhr.responseJSON.message : 'Error desconocido'),
                'error',
                10000
            );
        }
    });
}

// Ejemplo de uso en HTML:
// <button onclick="reducirProducto(8, 1)">Reducir 1 unidad</button>
// <button onclick="reducirProducto(8, 2)">Reducir 2 unidades</button>


function procesarPago() {
    // Recoger datos del formulario principal

    const bankReference = document.getElementById('bank-reference').value;

    const datosPago = {
        nombres: $('#nombres').val(),
        apellidos: $('#apellidos').val(),
        cedula: $('#cedula').val(),
        correo: $('#correo').val(),
        telefono: $('#telefono').val(),
        direccion: $('#direccion').val(),
        banco: $('#banco').val(),
        estado: $('#estado').val(),
        ciudad: $('#ciudad').val(),
        municipio: $('#municipio').val(),
        retiroTienda: $('#retiroTienda').is(':checked'),
        envioAgencia: $('#envioAgencia').is(':checked'),
        metodoPago: $('input[name="payment"]:checked').attr('id'),
        referencia: $('#bank-reference').val()
    };

    // Recoger datos de envío si está activo
    if (datosPago.envioAgencia) {
        datosPago.datosEnvio = {
            nombre: $('#envioNombre').val(),
            apellido: $('#envioApellido').val(),
            correo: $('#envioCorreo').val(),
            telefono: $('#envioTelefono').val(),
            direccion: $('#envioDireccion').val(),
            direccionAlterna: $('#envioDireccionAlt').val(),
            agencia: $('#agencia').val(),
            estado: $('#envioEstado').val(),
            ciudad: $('#envioCiudad').val(),
            oficinaAgencia: $('#oficinaAgencia').val()
        };
    }

    // Validaciones básicas
    //alert( (datosPago.cedula.length) );typeof input === 'number'
    if (!datosPago.referencia) {
        showNotification('Por favor ingrese una referencia valida', 'error');
        return;
    }
    
    if (isNaN(datosPago.referencia) || datosPago.referencia.trim() === '') {
        showNotification('Por favor, la referencia debe ser numérica', 'error');
        return;
    }
    if (!(datosPago.referencia.length > 4)) {
        showNotification('Por favor ingrese una referencia valida mayor a 4 números', 'error');
        return;
    }

    if (!datosPago.cedula) {
        showNotification('Por favor ingrese una cédula válida', 'error');
        return;
    }
    if (!(datosPago.cedula.length > 6)) {
        showNotification('Por favor ingrese una cédula , mayor de 7', 'error');
        return;
    }


    if (!datosPago.telefono) {
        showNotification('Por favor ingrese un número válido', 'error');
        return;
    }
    if (!((datosPago.telefono.length > 10) && (datosPago.telefono.length < 13))) {
        showNotification('Por favor ingrese un número, mayor de 10 y menor de 13', 'error');
        return;
    }

    if (!datosPago.nombres || !datosPago.apellidos || !datosPago.cedula || !datosPago.telefono) {
        showNotification('Por favor complete los campos obligatorios', 'error');
        return;
    }

    if (!datosPago.metodoPago) {
        showNotification('Seleccione un método de pago', 'error');
        return;
    }

    // Enviar datos al servidor
    $.ajax({
        url: '/api/products/procesar-pago',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(datosPago),
        success: function (response) {
            if (response.success) {
                showNotification('Pago registrado exitosamente', 'success');
                // Redirigir o limpiar formulario
                setTimeout(() => {
                    window.location.href = '/confirmacion-pago';
                }, 2000);
            } else {
                showNotification(response.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al procesar pago:', error);
            showNotification('Error al procesar el pago', 'error');
        }
    });
}


function showNotification(message, type = 'default', duration = 5000) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Crear contenido de la notificación
    const title = document.createElement('div');
    title.className = 'notification-title';
    title.textContent = type === 'default' ? 'Notificación' :
        type === 'error' ? 'Error' :
            type === 'warning' ? 'Advertencia' : 'Información';

    const content = document.createElement('div');
    content.textContent = message;

    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => removeNotification(notification);

    const progressBar = document.createElement('div');
    progressBar.className = 'notification-progress';

    // Ensamblar la notificación
    notification.appendChild(closeBtn);
    notification.appendChild(title);
    notification.appendChild(content);
    notification.appendChild(progressBar);

    // Agregar al contenedor
    document.getElementById('notification-container').appendChild(notification);

    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');

        // Animar la barra de progreso
        progressBar.style.transitionDuration = `${duration}ms`;
        progressBar.style.width = '0';

        // Eliminar después de la duración
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }, 10);

    return notification;
}

function removeNotification(notification) {
    notification.classList.remove('show');

    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
        notification.remove();
    }, 500);
}

function showCustomNotification() {
    const message = document.getElementById('custom-message').value;
    const type = document.getElementById('notification-type').value;

    if (message.trim() === '') {
        showNotification('Por favor escribe un mensaje', 'error');
        return;
    }

    showNotification(message, type);
}






















































function showInfoPanel() {
    if (!$('#pago-movil').is(':checked')) {
        showCustomNotification('Selecione un método de pago', 'Advertencia')
    }
    const overlay = document.getElementById('info-panel-overlay');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function hideInfoPanel() {
    const overlay = document.getElementById('info-panel-overlay');
    overlay.classList.remove('show');
    document.body.style.overflow = ''; // Restaurar scroll
}

function markAsPaid() {
    // Obtener el valor de la referencia bancaria
    const bankReference = document.getElementById('bank-reference').value;

    // Validar que se haya ingresado una referencia
    if (!bankReference.trim()) {
        showNotification('Por favor ingrese la referencia bancaria', 'error');
        return;
    }

    // Aquí iría la lógica para procesar el pago con la referencia
    //showNotification(`Pago procesado correctamente. Referencia: ${bankReference}`, 'default');

    procesarPago();
    hideInfoPanel();

    // Opcional: Limpiar el campo para la próxima vez
    document.getElementById('bank-reference').value = '';
}

// Cerrar el panel al hacer clic fuera del contenido
document.getElementById('info-panel-overlay').addEventListener('click', function (e) {
    if (e.target === this) {
        hideInfoPanel();
    }
});








