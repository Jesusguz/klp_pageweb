const form = document.getElementById('contact-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validaciones mejoradas
    if (!validarCampos(name, email, message)) {
        return;
    }

    // Enviar datos al backend (fetch)
    const data = { name, email, message };

    fetch('controller/send-email', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            form.reset();
        } else {
            alert('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
    });
});

function validarCampos(name, email, message) {
    // Validar campos vacíos
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        alert('Por favor, completa todos los campos.');
        return false;
    }

    // Validar formato de correo electrónico (expresión regular más robusta)
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return false;
    }

    // Sanitización básica para prevenir inyección de código (puedes usar una librería especializada si es necesario)
    const sanitizedName = name.replace(/<[^>]*>/g, ''); // Elimina etiquetas HTML
    const sanitizedMessage = message.replace(/<[^>]*>/g, '');

    // Validaciones adicionales según tus necesidades (longitud máxima, caracteres permitidos, etc.)

    return true;
}