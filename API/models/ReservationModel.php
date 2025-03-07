<?php
class ReservationModel {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAllReservations() {
        $stmt = $this->pdo->query("SELECT * FROM reservations");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReservationById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM reservations WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createReservation($room_id, $user_name, $start_date, $end_date, $start_time, $end_time, $price) {
        $stmt = $this->pdo->prepare("
            INSERT INTO reservations (room_id, user_name, start_date, end_date, start_time, end_time, price)
            VALUES (:room_id, :user_name, :start_date, :end_date, :start_time, :end_time, :price)
        ");
        return $stmt->execute([
            'room_id' => $room_id,
            'user_name' => $user_name,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'price' => $price
        ]);
    }
    
    public function updateReservation($id, $data) {
        $data['start_date'] = date('Y-m-d', strtotime($data['start_date']));
        $data['end_date'] = date('Y-m-d', strtotime($data['end_date']));

        $stmt = $this->pdo->prepare("
            UPDATE reservations 
            SET room_id = :room_id, user_name = :user_name, start_date = :start_date, end_date = :end_date, 
                start_time = :start_time, end_time = :end_time, status = :status, price = :price 
            WHERE id = :id
        ");
        return $stmt->execute(array_merge($data, ['id' => $id]));
    }

    public function deleteReservation($id) {
        $stmt = $this->pdo->prepare("DELETE FROM reservations WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function deleteCancelledReservations() {
        try {
            // Consulta para eliminar reservaciones con estado 'cancelled'
            $stmt = $this->pdo->prepare("
                DELETE FROM reservations 
                WHERE status = 'cancelled'
            ");
            $stmt->execute();

            // Devolver el número de filas eliminadas
            return $stmt->rowCount();
        } catch (\Exception $e) {
            throw new \Exception("Error al eliminar reservaciones canceladas: " . $e->getMessage());
        }
    }

    public function checkReservationConflict($room_id, $start_date, $end_date, $start_time, $end_time) {
        // Consulta para detectar conflictos
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) AS conflict_count 
            FROM reservations 
            WHERE room_id = :room_id 
              AND (
                  (:start_date BETWEEN start_date AND end_date) OR 
                  (:end_date BETWEEN start_date AND end_date) OR 
                  (start_date BETWEEN :start_date AND :end_date)
              )
              AND (
                  (:start_time BETWEEN start_time AND end_time) OR 
                  (:end_time BETWEEN start_time AND end_time) OR 
                  (start_time BETWEEN :start_time AND :end_time)
              )
        ");
        $stmt->execute([
            'room_id' => $room_id,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'start_time' => $start_time,
            'end_time' => $end_time
        ]);
    
        // Obtener el resultado
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // Devolver true si hay un conflicto, false si no
        return $result['conflict_count'] > 0;
    }
}
?>
