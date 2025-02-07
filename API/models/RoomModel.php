<?php
class RoomModel {
    private $pdo;

    // Constructor: Recibe la conexión a la base de datos
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todas las habitaciones
    public function getAllRooms() {
        $stmt = $this->pdo->query("SELECT * FROM rooms");
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // Asegúrate de que esto devuelva solo JSON
    }

    // Obtener una habitación por ID
    public function getRoomById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM rooms WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC); // Devuelve una sola fila
    }

    // Crear una nueva habitación
    public function createRoom($room_number, $capacity, $price, $available) {
        $stmt = $this->pdo->prepare("INSERT INTO rooms (room_number, capacity, price, available) VALUES (:room_number, :capacity, :price, :available)");
        $stmt->execute([
            'room_number' => $room_number,
            'capacity' => $capacity,
            'price' => $price,
            'available' => $available
        ]);
        return $this->pdo->lastInsertId(); // Devuelve el ID de la nueva habitación
    }

    // Actualizar una habitación
    public function updateRoom($id, $room_number, $capacity, $price, $available) {
        $stmt = $this->pdo->prepare("UPDATE rooms SET room_number = :room_number, capacity = :capacity, price = :price, available = :available WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'room_number' => $room_number,
            'capacity' => $capacity,
            'price' => $price,
            'available' => $available
        ]);
        return $stmt->rowCount() > 0; // Retorna true si se actualizó al menos una fila
    }

    public function deleteRoom($id) {
        $stmt = $this->pdo->prepare("DELETE FROM rooms WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0; // Retorna true si se eliminó al menos una fila
    }
}
?>