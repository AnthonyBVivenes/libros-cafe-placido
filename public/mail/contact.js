$(function () {
  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Mensajes de error o eventos adicionales
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Previene el comportamiento de envío del formulario HTML
      
      // Obtener valores del formulario
      var name = $("input#name").val();
      var email = $("input#email").val();
      var subject = $("input#subject").val();
      var message = $("textarea#message").val();
      var firstName = name; // Para el ejemplo de éxito
      
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      
      // Deshabilitar el botón de envío temporalmente
      $("#sendMessageButton").prop("disabled", true);
      
      // Aquí es donde harías la llamada AJAX
      $.ajax({
        url: "/contact", // <<-- REEMPLAZA ESTA URL CON TU API O SCRIPT DEL SERVIDOR
        type: "POST",
        data: {
          name: name,
          email: email,
          subject: subject,
          message: message
        },
        cache: false,
        success: function () {
          // Mostrar mensaje de éxito y limpiar el formulario
          $('#success').html("<div class='alert alert-success'>");
          $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-success')
            .append("<strong>Tu mensaje ha sido enviado.</strong>");
          $('#success > .alert-success')
            .append('</div>');
          
          $('#contactForm').trigger("reset");
        },
        error: function () {
          // Mostrar mensaje de error
          $('#success').html("<div class='alert alert-danger'>");
          $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-danger').append($("<strong>").text("Lo siento " + firstName + ", parece que nuestro servidor de correos no responde. Por favor, inténtalo de nuevo más tarde!"));
          $('#success > .alert-danger').append('</div>');
          
          $('#contactForm').trigger("reset");
        },
        complete: function () {
          setTimeout(function () {
            $("#sendMessageButton").prop("disabled", false); // Habilitar el botón nuevamente
          }, 1000);
        }
      });
    },
    filter: function () {
      return $(this).is(":visible");
    },
  });

  // Limpiar mensajes de error al escribir
  $("a[data-toggle=\"tab\"]").click(function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

// Limpiar campos del formulario al cargar la página (opcional)
$('#name').focus(function () {
  $('#success').html('');
});