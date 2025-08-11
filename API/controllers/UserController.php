<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require ROOT_PATH . '/models/UserModel.php';
require ROOT_PATH . '/vendor/autoload.php';

class UserController {
    private $userModel;
    private $secretKey = 'Llave secreta'; // Clave secreta para JWT

    public function __construct($pdo) {
        $this->userModel = new UserModel($pdo);
    }

    // Registro de usuario
    public function register($data) {
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }

        $username = trim($data['username']);
        $password = trim($data['password']);
        $role = $data['role'] ?? 'user';

        // Validar nombre de usuario
        if (strlen($username) < 4 || strlen($username) > 20) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre de usuario debe tener entre 4 y 20 caracteres']);
            return;
        }

        // Validar contraseña
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
            return;
        }

        // Verificar si el usuario ya existe
        $existingUser = $this->userModel->getUserByUsername($username);
        if ($existingUser) {
            http_response_code(400);
            echo json_encode(['error' => 'El usuario ya existe']);
            return;
        }

        // Hash de la contraseña
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Crear el usuario
        $this->userModel->createUser($username, $hashedPassword, $role);

        echo json_encode(['message' => 'Usuario creado correctamente']);
    }

    // Inicio de sesión
    public function login($data) {
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);

            echo json_encode(['error' => 'Faltan datos requeridos', 'data' => $data]);
            return;
        }

        $username = $data['username'];
        $password = $data['password'];

        try {
            // Buscar al usuario en la base de datos
            $user = $this->userModel->getUserByUsername($username);
            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciales inválidas']);
                return;
            }

            // Generar Access Token
            $accessTokenPayload = [
                'user_id' => $user['id'],
                'username' => $username,
                'role' => $user['role'],
                'exp' => time() + 3600 // Expira en 1 hora
            ];
            $accessToken = JWT::encode($accessTokenPayload, $this->secretKey, 'HS256');

            // Generar Refresh Token
            $refreshTokenPayload = [
                'user_id' => $user['id'],
                'exp' => time() + (7 * 24 * 60 * 60) // Expira en 7 días
            ];
            $refreshToken = JWT::encode($refreshTokenPayload, $this->secretKey, 'HS256');

            // Devolver ambos tokens
            echo json_encode([
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    // Cierre de sesión
    public function logout($data) {
        if (!isset($data['refresh_token'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Refresh Token no proporcionado']);
            return;
        }

        $refreshToken = $data['refresh_token'];

        // Invalidar el Refresh Token en la base de datos
        if ($this->userModel->invalidateRefreshToken($refreshToken)) {
            echo json_encode(['message' => 'Sesión cerrada correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo cerrar la sesión']);
        }
    }

    // Refresco de tokens
    public function refreshToken($data) {
        if (!isset($data['refresh_token'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Refresh Token no proporcionado']);
            return;
        }

        $refreshToken = $data['refresh_token'];

        try {
            // Decodificar el Refresh Token
            $decoded = JWT::decode($refreshToken, new Key($this->secretKey, 'HS256'));

            // Verificar si el usuario existe
            $user = $this->userModel->getUserById($decoded->user_id);
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Usuario no encontrado']);
                return;
            }

            // Generar un nuevo Access Token
            $accessTokenPayload = [
                'user_id' => $decoded->user_id,
                'username' => $user['username'],
                'role' => $user['role'],
                'exp' => time() + 3600 // Expira en 1 hora
            ];
            $newAccessToken = JWT::encode($accessTokenPayload, $this->secretKey, 'HS256');

            echo json_encode(['access_token' => $newAccessToken]);
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido']);
        }
    }

    // Obtener todos los usuarios
    public function getAllUsers() {
        try {
            $users = $this->userModel->getAllUsers();
            if ($users) {
                echo json_encode(['users' => $users]);
            } else {
                echo json_encode(['error' => 'No hay usuarios registrados']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error interno del servidor',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    // Obtener un usuario por ID
    public function getUserById($userId) {
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de usuario no proporcionado']);
            return;
        }

        try {
            $user = $this->userModel->getUserById($userId);
            if ($user) {
                echo json_encode(['user' => $user]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    // Actualizar un usuario
    public function updateUser($data, $userId) {
        if (!isset($data['username']) && !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No se proporcionaron datos para actualizar']);
            return;
        }

        try {
            $user = $this->userModel->getUserById($userId);
            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
                return;
            }

            $newUsername = $data['username'] ?? $user['username'];
            $newPassword = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : $user['password'];

            $this->userModel->updateUser($userId, $newUsername, $newPassword);
            echo json_encode(['message' => 'Datos actualizados correctamente']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    // Eliminar un usuario por ID
    public function deleteUserById($userId) {
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de usuario no proporcionado']);
            return;
        }

        try {
            $user = $this->userModel->getUserById($userId);
            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
                return;
            }

            $this->userModel->deleteUser($userId);
            echo json_encode(['message' => 'Usuario eliminado correctamente']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    // Obtener el token del encabezado de autorización
    private function getBearerToken() {
        $headers = apache_request_headers();
        if (isset($headers['Authorization']) && preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
        return null;
    }
}
?>