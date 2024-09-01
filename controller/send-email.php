<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING); // Sanitización básica
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
     // Prevención de spam 
    if (!empty($_POST['website'])) { // 'website' es el nombre del campo oculto
        echo json_encode(array('success' => false, 'message' => 'Solicitud sospechosa. Por favor, inténtalo de nuevo.'));
        exit;
    }

    // Validaciones mejoradas (usa una librería para una validación de correo electrónico más robusta)
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, completa todos los campos correctamente.'));
        exit;
    }



    $to = "contacto@kplhuman.com.mx";
    $subject = "Nuevo mensaje de contacto desde el sitio web";
    $body = "Nombre: $name\nCorreo electrónico: $email\nMensaje: $message\n";
    $headers = "From: $email\nReply-To: $email\n";

    // Enviar el correo electrónico con manejo de errores
    if (@mail($to, $subject, $body, $headers)) {
        echo json_encode(array('success' => true, 'message' => '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.'));
    } else {
        // Registra el error en un log para depuración
        error_log("Error al enviar el correo electrónico: " . error_get_last()['message']);
        echo json_encode(array('success' => false, 'message' => 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde o contacta al administrador.'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Método de solicitud no válido.'));
}
?>