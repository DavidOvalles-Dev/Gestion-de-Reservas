<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../UserModel.php';

class UserModelTest extends TestCase {
    private $pdo;
    private $userModel;

    protected function setUp(): void {
        // Usamos una base de datos SQLite en memoria
        $this->pdo = new PDO('sqlite::memory:');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Crear tabla users
        $this->pdo->exec("
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT
            );
        ");

        // Crear tabla refresh_tokens
        $this->pdo->exec("
            CREATE TABLE refresh_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT UNIQUE
            );
        ");

        $this->userModel = new UserModel($this->pdo);
    }

    public function testCreateAndGetUserByUsername() {
        $this->userModel->createUser('testuser', 'hashed123', 'admin');
        $user = $this->userModel->getUserByUsername('testuser');

        $this->assertIsArray($user);
        $this->assertEquals('testuser', $user['username']);
        $this->assertEquals('admin', $user['role']);
    }

    public function testGetAllUsers() {
        $this->userModel->createUser('user1', 'pass1');
        $this->userModel->createUser('user2', 'pass2');
        $users = $this->userModel->getAllUsers();

        $this->assertCount(2, $users);
    }

    public function testGetUserById() {
        $this->userModel->createUser('userX', 'passX');
        $user = $this->userModel->getUserByUsername('userX');
        $fetched = $this->userModel->getUserById($user['id']);

        $this->assertEquals('userX', $fetched['username']);
    }

    public function testUpdateUser() {
        $this->userModel->createUser('oldUser', 'oldPass');
        $user = $this->userModel->getUserByUsername('oldUser');
        $this->userModel->updateUser($user['id'], 'newUser', 'newPass');

        $updated = $this->userModel->getUserById($user['id']);
        $this->assertEquals('newUser', $updated['username']);
    }

    public function testDeleteUser() {
        $this->userModel->createUser('tempUser', 'tempPass');
        $user = $this->userModel->getUserByUsername('tempUser');
        $this->userModel->deleteUser($user['id']);

        $deleted = $this->userModel->getUserByUsername('tempUser');
        $this->assertFalse($deleted);
    }

    public function testInvalidateRefreshToken() {
        // Insertar token falso
        $this->pdo->prepare("INSERT INTO refresh_tokens (token) VALUES (?)")
            ->execute(['abc123']);

        $result = $this->userModel->invalidateRefreshToken('abc123');
        $this->assertTrue($result);

        $stmt = $this->pdo->prepare("SELECT * FROM refresh_tokens WHERE token = ?");
        $stmt->execute(['abc123']);
        $token = $stmt->fetch();

        $this->assertFalse($token);
    }
}
