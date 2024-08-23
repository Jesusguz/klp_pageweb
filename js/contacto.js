const form = document.getElementById('contact-form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validación básica del lado del cliente
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        alert('Por favor, completa todos los campos.');
        return; // Detener el envío si hay campos vacíos
    }

    // Puedes agregar validaciones más avanzadas aquí, como verificar el formato del correo electrónico

    // Enviar los datos al backend usando AJAX (fetch)
    const data = {
        name: name,
        email: email,
        message: message
    };

    fetch('controller/send-email', { // Reemplaza '/send-email' con la ruta correcta de tu backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                // Mostrar mensaje de éxito
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
                form.reset(); // Limpiar el formulario
            } else {
                // Manejar errores
                alert('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
        });
});