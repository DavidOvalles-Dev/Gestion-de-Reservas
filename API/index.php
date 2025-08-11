<?php
// 1. CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Responder inmediatamente a las preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Errores y JSON por defecto
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// 4. Definir ruta base
define('ROOT_PATH', __DIR__);

if (!isset($_GET['action']) && isset($_SERVER['PATH_INFO'])) {
    // Elimina la barra inicial del PATH_INFO
    $pathInfo = ltrim($_SERVER['PATH_INFO'], '/');
    // Divide la cadena en pares clave=valor si quieres
    parse_str($pathInfo, $queryParams);
    // Mezcla con $_GET
    $_GET = array_merge($_GET, $queryParams);
}


// 5. Resto del sistema
require_once ROOT_PATH . '/config.php';
require_once ROOT_PATH . '/routes.php';
