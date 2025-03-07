<?php
header('Content-Type: application/json'); // Indica que la respuesta será en formato JSON

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Definir la ruta base del proyecto
define('ROOT_PATH', __DIR__); // __DIR__ es la ruta absoluta del directorio actual

// Manejar solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

require_once ROOT_PATH . '/config.php'; // Conexión a la base de datos
require_once ROOT_PATH . '/routes.php'; // Rutas

$reservationController->deleteCancelledReservations();

?>