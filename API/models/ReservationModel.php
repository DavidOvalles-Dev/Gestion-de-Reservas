<?php
class ReservationModel {
    private $pdo;

    // Constructor: Recibe la conexión a la base de datos
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todas las reservas
    public function getAllReservations() {
        // Ejecuta una consulta para obtener todas las reservas
        $stmt = $this->pdo->query("SELECT * FROM reservations");
        // Retorna todas las filas como un arreglo asociativo
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReservationById($id) {
        // Prepara una declaración para obtener una reserva por ID
        $stmt = $this->pdo->prepare("SELECT * FROM reservations WHERE id = :id");
        // Ejecuta la declaración con el parámetro proporcionado
        $stmt->execute(['id' => $id]);
        // Retorna la primera fila como un arreglo asociativo
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createReservation($room_id, $user_name, $start_date, $end_date, $start_time, $end_time) {
        $stmt = $this->pdo->prepare("
            INSERT INTO reservations (room_id, user_name, start_date, end_date, start_time, end_time)
            VALUES (:room_id, :user_name, :start_date, :end_date, :start_time, :end_time)
        ");
        return $stmt->execute([
            'room_id' => $room_id,
            'user_name' => $user_name,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'start_time' => $start_time,
            'end_time' => $end_time
        ]);
    }
    
    public function updateReservation($id, $data) {
        // Eliminar la parte de la hora de 'start_date' y 'end_date'
        $data['start_date'] = date('Y-m-d', strtotime($data['start_date']));
        $data['end_date'] = date('Y-m-d', strtotime($data['end_date']));
    
        $stmt = $this->pdo->prepare("
            UPDATE reservations 
            SET room_id = :room_id, user_name = :user_name, start_date = :start_date, end_date = :end_date, start_time = :start_time, end_time = :end_time, status = :status 
            WHERE id = :id
        ");
        return $stmt->execute(array_merge($data, ['id' => $id]));
    }


    // Eliminar una reserva
    public function deleteReservation($id) {
        // Prepara una declaración para eliminar una reserva
        $stmt = $this->pdo->prepare("DELETE FROM reservations WHERE id = :id");
        // Ejecuta la declaración con el parámetro proporcionado
        $stmt->execute(['id' => $id]);
        // Retorna true si se eliminó al menos una fila
        return $stmt->rowCount() > 0;
    }
}
?>