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

// Definir las rutas
// Rooms
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getRooms') {
    $roomController->getAllRooms();
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id']) && $_GET['action'] === 'getRoomById') {
    $roomController->getRoomById($_GET['id']);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'createRoom') {
    $roomController->createRoom($data);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['action'] === 'updateRoom') {
    $roomController->updateRoom($data, $_GET['id']);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id']) && $_GET['action'] === 'deleteRoom') {
    $roomController->deleteRoom($_GET['id']);
    return;
}

// Change room availability
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['action'] === 'changeAvailability' && isset($_GET['id'])) {
    $roomController->changeAvailability();
    return;
}

// Reservations
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getReservations') {
    $reservationController->getAllReservations();
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id']) && $_GET['action'] === 'getReservationById') {
    $reservationController->getReservationById($_GET['id']);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'createReservation') {
    $reservationController->createReservation($data);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['action'] === 'updateReservation') {
    $reservationController->updateReservation($data, $_GET['id']);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id']) && $_GET['action'] === 'deleteReservation') {
    $reservationController->deleteReservation($_GET['id']);
    return;
}



if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'checkReservationConflict') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $reservationController->checkReservationConflict($data);
    return;
}

// Users
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'register') {
    $userController->register($data);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'login') {
    $userController->login($data);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'logout') {
    $userController->logout($data);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'refreshToken') {
    $userController->refreshToken($data);
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getAllUsers') {
    $userController->getAllUsers();
    return;
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id']) && $_GET['action'] === 'getUserById') {
    $userController->getUserById($_GET['id']);
    return;
}

// Update User
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['action'] === 'update-user') {
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

// Delete User
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id']) && $_GET['action'] === 'delete-user') {
    $userController->deleteUserById($_GET['id']);
    return;
}

// Función para obtener el token JWT del encabezado Authorization
function getBearerToken() {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}