<?php
require_once ROOT_PATH . '/models/RoomModel.php';

class RoomController {
    private $roomModel;

    // Constructor: Inicializa el modelo
    public function __construct($pdo) {
        $this->roomModel = new RoomModel($pdo);
    }

    // Obtener todas las habitaciones
    public function getAllRooms() {
        $rooms = $this->roomModel->getAllRooms();
        echo json_encode($rooms);
    }

    // Obtener una habitación por ID
    public function getRoomById() {
        $id = $_GET['id'];
    
        if (!isset($id)) {
            echo json_encode(['error' => 'ID de la habitación no proporcionado']);
            return;
        }
    
        $room = $this->roomModel->getRoomById($id);
    
        if ($room) {
            echo json_encode($room);
        } else {
            echo json_encode(['error' => 'Habitación no encontrada']);
        }
    }

    public function createRoom() {
        // Obtener los datos enviados en la solicitud (en formato JSON)
        $data = json_decode(file_get_contents('php://input'), true);

        // Validar que todos los campos necesarios estén presentes
        if (!isset($data['room_number'], $data['capacity'], $data['price'], $data['available'])) {
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }

        // Extraer los datos
        $room_number = $data['room_number'];
        $capacity = $data['capacity'];
        $price = $data['price'];
        $available = $data['available'];

        // Llamar al modelo para crear la habitación
        $id = $this->roomModel->createRoom($room_number, $capacity, $price, $available);

        // Devolver una respuesta con el ID de la nueva habitación
        echo json_encode(['id' => $id, 'message' => 'Habitación creada']);
    }

    // Actualizar una habitación
    public function updateRoom() {
        // Obtener los datos enviados en la solicitud (en formato JSON)
        $data = json_decode(file_get_contents('php://input'), true);

        // Validar que todos los campos necesarios estén presentes
        if (!isset($data['id'], $data['room_number'], $data['capacity'], $data['price'], $data['available'])) {
            echo json_encode([
                'error' => 'Faltan datos requeridos',
                'missing_fields' => array_diff(
                    ['id', 'room_number', 'capacity', 'price', 'available'],
                    array_keys($data)
                )
            ]);
            return;
        }
        

        // Extraer los datos
        $id = $data['id'];
        $room_number = $data['room_number'];
        $capacity = $data['capacity'];
        $price = $data['price'];
        $available = $data['available'];

        $result = $this->roomModel->updateRoom($id, $room_number, $capacity, $price, $available);

        if ($result) {
            echo json_encode(['message' => 'Habitación actualizada']);
        } else {
            echo json_encode(['error' => 'No se pudo actualizar la habitación', 'id' => $id]);
        }
        
    }

    public function deleteRoom() {
        $id = $_GET['id'];
    
        if ($this->roomModel->deleteRoom($id)) {
            echo json_encode(['message' => 'Habitación eliminada']);
        } else {
            echo json_encode(['error' => 'No se pudo eliminar la habitación']);
        }
    }
}
?>