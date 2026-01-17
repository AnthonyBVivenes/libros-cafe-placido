




$('#togglePassword').on('click', function () {
    const passwordInput = $('#password');
    const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
    passwordInput.attr('type', type);
    $(this).text(type === 'password' ? '👁️' : '👁️‍🗨️');
});

// Validación básica del formulario
$('#registerForm').on('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Validar nombre
    if ($('#name').val().trim() === '') {
        $('#name-error').show();
        valid = false;
    } else {
        $('#name-error').hide();
    }

    // Validar email
    const email = $('#email').val().trim();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        $('#email-error').show();
        valid = false;
    } else {
        $('#email-error').hide();
    }

    // Validar contraseña
    const password = $('#password').val();
    if (password.length < 10) {
        $('#password-error').show();
        valid = false;
    } else {
        $('#password-error').hide();
    }

    // Validar confirmación de contraseña
    if (password !== $('#confirmPassword').val()) {
        $('#confirmPassword-error').show();
        valid = false;
    } else {
        $('#confirmPassword-error').hide();
    }

    if (valid) {
        // Aquí puedes hacer el registro vía AJAX
        //alert('¡Registro exitoso!');

        registro(email, password, $('#name').val());
        sleep(1000);
        window.location.href = "Login.html";
    }
});




function registro(email, password, name) {
    $.ajax({
        url: 'api/products/signup',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password,
            nombre: name
        }),
        success: function (data) {
            alert(data.message);
            // Manejar respuesta exitosa
            //sleep(1000);
            window.location.href = "index.html";
        },
        error: function (error) {
            // Asegúrate de que el mensaje de error esté en el objeto de error
            const errorMessage = error.responseJSON ? error.responseJSON.message : 'Error desconocido';
            alert(errorMessage);
            console.error('Error al registrar:', error);
        }
    });
}



