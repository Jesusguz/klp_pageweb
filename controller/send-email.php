<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Validaciones (puedes agregar más según tus necesidades)
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, completa todos los campos.'));
        exit;
    }

    // Prevención de spam (puedes agregar más medidas aquí)
    // ... (Por ejemplo, puedes usar un captcha o un servicio de terceros para validar el envío)

    // Configuración del correo electrónico
    $to = "contacto@kplhuman.com.mx"; // Reemplaza con el correo de la empresa
    $subject = "Nuevo mensaje de contacto desde el sitio web";
    $body = "Nombre: $name\n";
    $body .= "Correo electrónico: $email\n";
    $body .= "Mensaje: $message\n";
    $headers = "From: $email\n"; // El correo se enviará desde la dirección del usuario
    $headers .= "Reply-To: $email\n"; // Permite responder directamente al usuario

    // Enviar el correo electrónico
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(array('success' => true, 'message' => '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Método de solicitud no válido.'));
}
?>