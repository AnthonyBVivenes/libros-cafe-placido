

var vlogin=0;
function login(email, password) {
    $.ajax({
        url: 'api/products/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            Password: password
        }),
        success: function (data) {
            vlogin = 1;
            showNotification(data.message)
            // Manejar respuesta exitosa
            setTimeout(() => {
                // Code to be executed after the delay
                
            window.location.href = "/index";
            }, 2000);
        },
        error: function (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });
}




document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginContainer = document.querySelector('.login-container');

    // Toggle password visibility
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Form validation
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Email validation
        if (!validateEmail(emailInput.value)) {
            emailError.style.display = 'block';
            emailInput.classList.add('shake');
            isValid = false;
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('shake');
        }

        // Password validation
        if (passwordInput.value.length < 10) {
            passwordError.style.display = 'block';
            passwordInput.classList.add('shake');
            isValid = false;
        } else {
            passwordError.style.display = 'none';
            passwordInput.classList.remove('shake');
        }

        // Remove shake animation after it completes
        setTimeout(() => {
            emailInput.classList.remove('shake');
            passwordInput.classList.remove('shake');
        }, 500);

        // If valid, simulate login
        if (isValid) {
            loginContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                loginContainer.style.transform = 'scale(1)';
                // Llama a la función login pasando email y contraseña
                if(vlogin==0){
                    login(emailInput.value, passwordInput.value);
                }
                
                // alert('¡Inicio de sesión exitoso! Redirigiendo...');
                // Aquí normalmente redirigirías al usuario o harías una petición AJAX
            }, 300);
        }
    });

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add focus effects
    emailInput.addEventListener('focus', function () {
        loginContainer.style.boxShadow = '0 15px 30px rgba(79, 70, 229, 0.2)';
    });

    passwordInput.addEventListener('focus', function () {
        loginContainer.style.boxShadow = '0 15px 30px rgba(79, 70, 229, 0.2)';
    });

    emailInput.addEventListener('blur', function () {
        loginContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    });

    passwordInput.addEventListener('blur', function () {
        loginContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    });
});