<?php
require_once ROOT_PATH . '/controllers/RoomController.php';
require_once ROOT_PATH . '/controllers/ReservationController.php';

// Inicializar los controladores
$roomController = new RoomController($pdo);
$reservationController = new ReservationController($pdo);

// Definir las rutas

//Rooms
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getRooms') {
    header('Content-Type: application/json'); // Asegúrate de que la respuesta sea JSON
    $roomController->getAllRooms();
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id']) && $_GET['action'] === 'getRoomById') {
    $roomController->getRoomById();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'createRoom') {
    $roomController->createRoom();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['action'] === 'updateRoom') {
    $roomController->updateRoom();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id']) && $_GET['action'] === 'deleteRoom') {
    $roomController->deleteRoom();
}

//Reservations

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'getReservations') {
    $reservationController->getAllReservations();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id']) && $_GET['action'] === 'getReservationById') {
    $reservationController->getReservationById($_GET['id']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'createReservation') {
    $reservationController->createReservation();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['action'] === 'updateReservation') {
    $reservationController->updateReservation();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id']) && $_GET['action'] === 'deleteReservation') {
    $reservationController->deleteReservation();
}

?>