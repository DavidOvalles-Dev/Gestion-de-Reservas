<?php
// Datos de conexión
$host = 'localhost';
$dbname = 'reservations_db';
$username = 'root'; // O el nombre de usuario que configuraste
$password = ''; // O la contraseña que configuraste

try {
    // Intentar conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Mostrar un mensaje de error si falla la conexión
    echo "Error al conectar a la base de datos: " . $e->getMessage();
}



?>