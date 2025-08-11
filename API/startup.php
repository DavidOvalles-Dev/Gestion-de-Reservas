<?php
// Configuración DB
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'reservations_db';

try {
    // Conectar sin DB (para crearla)
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Conectado al servidor MySQL.<br>";

    // Crear DB si no existe
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "📦 Base de datos '$dbname' creada o ya existente.<br>";

    // Seleccionar DB
    $pdo->exec("USE $dbname");

    // Tabla users
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(150) UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Insertar admin si no existe
    $adminUsername = 'admin';
    $adminEmail = 'admin@example.com';
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt->execute([$adminUsername]);
    if ($stmt->fetchColumn() == 0) {
        $hashedPassword = password_hash('1234', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)")
            ->execute([$adminUsername, $adminEmail, $hashedPassword, 'admin']);
        echo "👤 Usuario admin creado (username: $adminUsername, password: 1234).<br>";
    }

    // Tabla rooms
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_number VARCHAR(50) NOT NULL UNIQUE,
            capacity INT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Insertar habitaciones de ejemplo
    $rooms = [
        ['101', 1, 50.00, true],
        ['102', 2, 75.00, true],
        ['201', 4, 120.00, true]
    ];
    foreach ($rooms as $room) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM rooms WHERE room_number = ?");
        $stmt->execute([$room[0]]);
        if ($stmt->fetchColumn() == 0) {
            $pdo->prepare("INSERT INTO rooms (room_number, capacity, price, available) VALUES (?, ?, ?, ?)")
                ->execute($room);
        }
    }
    echo "🏨 Habitaciones de ejemplo insertadas.<br>";

    // Tabla reservations
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reservations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT NOT NULL,
            user_name VARCHAR(50) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
        )
    ");

    // Insertar reserva de ejemplo (si no existe)
    $stmt = $pdo->query("SELECT COUNT(*) FROM reservations");
    if ($stmt->fetchColumn() == 0) {
        $pdo->prepare("
            INSERT INTO reservations (room_id, user_name, start_date, end_date, start_time, end_time, status, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ")->execute([
            1, 'admin', date('Y-m-d'), date('Y-m-d', strtotime('+2 days')),
            '14:00:00', '16:00:00', 'confirmed', 100.00
        ]);
        echo "📅 Reserva de ejemplo creada.<br>";
    }

    // Tabla refresh_tokens
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    echo "🔑 Tabla de refresh tokens creada.<br>";

    echo "<br>🚀 Base de datos y tablas listas.";

} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage());
}
