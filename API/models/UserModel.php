<?php

class UserModel {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    //verificar si un usuario existe por su nombre de usuario

    public function getUserByUsername($username) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllUsers() {
        $stmt = $this->pdo->prepare("SELECT id, username, role FROM users");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserById($userId) {
        $stmt = $this->pdo->prepare("SELECT id, username, role FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function createUser($username, $hashedPassword, $role = 'user') {
        $stmt = $this->pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $stmt->execute([$username, $hashedPassword, $role]);
    }

    public function updateUser($userId, $newUsername, $newPassword) {
        $stmt = $this->pdo->prepare("UPDATE users SET username = ?, password = ? WHERE id = ?");
        $stmt->execute([$newUsername, $newPassword, $userId]);
    }

    public function invalidateRefreshToken($token) {
        try {
            // Eliminar el Refresh Token de la tabla refresh_tokens
            $stmt = $this->pdo->prepare("DELETE FROM refresh_tokens WHERE token = ?");
            $stmt->execute([$token]);
            return true; // Operación exitosa
        } catch (\Exception $e) {
            return false; // Error al eliminar el token
        }
    }

    

    public function deleteUser($userId) {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
    }


    

}


?>