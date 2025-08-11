<?php
require_once ROOT_PATH . '/controllers/RoomController.php';
require_once ROOT_PATH . '/controllers/ReservationController.php';
require_once ROOT_PATH . '/controllers/UserController.php';

// Inicializar los controladores
$roomController = new RoomController($pdo);
$reservationController = new ReservationController($pdo);
$userController = new UserController($pdo);

// Leer datos enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true) ?? [];

// Obtener acción desde GET o rutas limpias
$action = $_GET['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

// Función auxiliar para obtener el token Bearer
function getBearerToken() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

try {
    // ==================== ROOMS ====================
    if ($method === 'GET' && $action === 'getRooms') {
        $roomController->getAllRooms();
        return;
    }

    if ($method === 'GET' && $action === 'getRoomById' && isset($_GET['id'])) {
        $roomController->getRoomById($_GET['id']);
        return;
    }

    if ($method === 'POST' && $action === 'createRoom') {
        $roomController->createRoom($data);
        return;
    }

    if ($method === 'PUT' && $action === 'updateRoom' && isset($_GET['id'])) {
        $roomController->updateRoom($data, $_GET['id']);
        return;
    }

    if ($method === 'DELETE' && $action === 'deleteRoom' && isset($_GET['id'])) {
        $roomController->deleteRoom($_GET['id']);
        return;
    }

    if ($method === 'PUT' && $action === 'changeAvailability' && isset($_GET['id'])) {
        $roomController->changeAvailability();
        return;
    }

    // ==================== RESERVATIONS ====================
    if ($method === 'GET' && $action === 'getReservations') {
        $reservationController->getAllReservations();
        return;
    }

    if ($method === 'GET' && $action === 'getReservationById' && isset($_GET['id'])) {
        $reservationController->getReservationById($_GET['id']);
        return;
    }

    if ($method === 'POST' && $action === 'createReservation') {
        $reservationController->createReservation($data);
        return;
    }

    if ($method === 'PUT' && $action === 'updateReservation' && isset($_GET['id'])) {
        $reservationController->updateReservation($data, $_GET['id']);
        return;
    }

    if ($method === 'DELETE' && $action === 'deleteReservation' && isset($_GET['id'])) {
        $reservationController->deleteReservation($_GET['id']);
        return;
    }

    if ($method === 'POST' && $action === 'checkReservationConflict') {
        $reservationController->checkReservationConflict($data);
        return;
    }

    // ==================== USERS ====================
    if ($method === 'POST' && $action === 'register') {
        $userController->register($data);
        return;
    }

    if ($method === 'POST' && $action === 'login') {
        $userController->login($data);
        return;
    }

    if ($method === 'POST' && $action === 'logout') {
        $userController->logout($data);
        return;
    }

    if ($method === 'POST' && $action === 'refreshToken') {
        $userController->refreshToken($data);
        return;
    }

    if ($method === 'GET' && $action === 'getAllUsers') {
        error_log("Entró a getAllUsers");
        $userController->getAllUsers();
        return;
    }

    if ($method === 'GET' && $action === 'getUserById' && isset($_GET['id'])) {
        $userController->getUserById($_GET['id']);
        return;
    }

    if ($method === 'PUT' && $action === 'update-user') {
        $token = getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no proporcionado']);
            return;
        }

        $secretKey = 'Llave secreta';
        try {
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($secretKey, 'HS256'));
            $userId = $decoded->user_id;
            $userController->updateUser($data, $userId);
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido o expirado']);
        }
        return;
    }

    if ($method === 'DELETE' && $action === 'delete-user' && isset($_GET['id'])) {
        $userController->deleteUserById($_GET['id']);
        return;
    }

    // Si no encontró la acción solicitada:
    http_response_code(404);
    echo json_encode(['error' => 'Acción no encontrada']);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}

