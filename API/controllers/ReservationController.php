<?php
require_once ROOT_PATH . '/models/ReservationModel.php';

class ReservationController {
    private $reservationModel;

    // Constructor: Inicializa el modelo
    public function __construct($pdo) {
        $this->reservationModel = new ReservationModel($pdo);
    }

    // Obtener todas las reservas
    public function getAllReservations() {
        $reservations = $this->reservationModel->getAllReservations();
        echo json_encode($reservations);
    }

    public function getReservationById($id) {
        $reservation = $this->reservationModel->getReservationById($id);
        if ($reservation) {
            echo json_encode($reservation);
        } else {
            echo json_encode(['error' => 'Reserva no encontrada']);
        }
    }

    public function createReservation() {
        $data = json_decode(file_get_contents('php://input'), true);
    
        // Validar que todos los campos necesarios estén presentes
        if (!isset($data['room_id'], $data['user_name'], $data['start_date'], $data['end_date'], $data['start_time'], $data['end_time'])) {
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }
    
        // Extraer los datos
        $room_id = $data['room_id'];
        $user_name = $data['user_name'];
        $start_date = $data['start_date'];
        $end_date = $data['end_date'];
        $start_time = $data['start_time'];
        $end_time = $data['end_time'];
    
        // Llamar al modelo para crear la reserva
        $id = $this->reservationModel->createReservation($room_id, $user_name, $start_date, $end_date, $start_time, $end_time);
    
        // Devolver una respuesta con el ID de la nueva reserva
        echo json_encode(['id' => $id, 'message' => 'Reserva creada']);
    }
    
    public function updateReservation() {
        // Obtener los datos enviados desde Postman
        $data = json_decode(file_get_contents('php://input'), true);
    
        // Validar que el ID esté presente
        if (!isset($data['id'])) {
            echo json_encode(['error' => 'ID de la reservación no proporcionado']);
            return;
        }
    
        $id = $data['id'];
        unset($data['id']); // Eliminar el ID del array de datos
    
        // Validar que todos los campos necesarios estén presentes
        $requiredFields = ['room_id', 'user_name', 'start_date', 'end_date', 'start_time', 'end_time', 'status'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                echo json_encode(['error' => "Falta el campo: $field"]);
                return;
            }
        }
    
        // Llamar al modelo para actualizar la reservación
        $success = $this->reservationModel->updateReservation($id, $data);
    
        if ($success) {
            echo json_encode(['message' => 'Reservación actualizada correctamente']);
        } else {
            echo json_encode(['error' => 'Error al actualizar la reservación']);
        }
    }

    public function deleteReservation() {
        $id = $_GET['id'];
    
        if ($this->reservationModel->deleteReservation($id)) {
            echo json_encode(['message' => 'Reserva eliminada']);
        } else {
            echo json_encode(['error' => 'No se pudo eliminar la reserva']);
        }
    }
}
?>