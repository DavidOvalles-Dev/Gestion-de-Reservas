<?php
require_once ROOT_PATH . '/models/ReservationModel.php';

class ReservationController {
    private $reservationModel;

    public function __construct($pdo) {
        $this->reservationModel = new ReservationModel($pdo);
    }

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

        if (!isset($data['room_id'], $data['user_name'], $data['start_date'], $data['end_date'], $data['start_time'], $data['end_time'], $data['price'])) {
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }

        $room_id = $data['room_id'];
        $user_name = $data['user_name'];
        $start_date = $data['start_date'];
        $end_date = $data['end_date'];
        $start_time = $data['start_time'];
        $end_time = $data['end_time'];
        $price = $data['price'];

        $id = $this->reservationModel->createReservation($room_id, $user_name, $start_date, $end_date, $start_time, $end_time, $price);

        echo json_encode(['id' => $id, 'message' => 'Reserva creada']);
    }

    public function updateReservation() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id'])) {
            echo json_encode(['error' => 'ID de la reservación no proporcionado']);
            return;
        }

        $id = $data['id'];
        unset($data['id']); 

        $requiredFields = ['room_id', 'user_name', 'start_date', 'end_date', 'start_time', 'end_time', 'status', 'price'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                echo json_encode(['error' => "Falta el campo: $field"]);
                return;
            }
        }

        $success = $this->reservationModel->updateReservation($id, $data);

        if ($success) {
            echo json_encode(['message' => 'Reservación actualizada correctamente']);
        } else {
            echo json_encode(['error' => 'Error al actualizar la reservación']);
        }
    }

    public function deleteReservation($id) {
        $success = $this->reservationModel->deleteReservation($id);

        if ($success) {
            echo json_encode(['message' => 'Reservación eliminada correctamente']);
        } else {
            echo json_encode(['error' => 'Error al eliminar la reservación']);
        }
    }

    public function deleteCancelledReservations() {
        try {
            // Llamar al método del modelo
            $deletedCount = $this->reservationModel->deleteCancelledReservations();

            // Registrar el número de reservaciones eliminadas
            if ($deletedCount > 0) {
                error_log("Reservaciones canceladas eliminadas automáticamente: " . $deletedCount);
            }
        } catch (\Exception $e) {
            error_log("Error al eliminar reservaciones canceladas: " . $e->getMessage());
        }
    }

    public function checkReservationConflict($data) {
        // Validar que se proporcionen todos los datos necesarios
        if (!isset($data['room_id'], $data['start_date'], $data['end_date'], $data['start_time'], $data['end_time'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }
    
        // Extraer datos
        $room_id = $data['room_id'];
        $start_date = $data['start_date'];
        $end_date = $data['end_date'];
        $start_time = $data['start_time'];
        $end_time = $data['end_time'];
    
        try {
            // Verificar conflictos
            $conflict = $this->reservationModel->checkReservationConflict($room_id, $start_date, $end_date, $start_time, $end_time);
    
            // Devolver el resultado
            echo json_encode(['conflict' => $conflict]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al verificar conflictos de reservación']);
        }
    }

    
}
?>
