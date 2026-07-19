<?php
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

try {
    // Verificar se o utilizador existe e se é admin
    $stmt = $pdo->prepare("
        SELECT u.*, p.avatar 
        FROM users u 
        LEFT JOIN passports p ON u.id = p.user_id 
        WHERE u.email = ? AND (u.role = 'Admin' OR u.role = 'SUPER_ADMIN')
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        if ($user['status'] === 'Bloqueado') {
            echo json_encode(['success' => false, 'error' => 'A sua conta de administrador foi bloqueada.']);
            exit();
        }

        echo json_encode([
            'success' => true,
            'user' => [
                'id' => (string)$user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'] === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
                'avatarUrl' => $user['avatar'] ?? 'default'
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas ou não tens permissão de Administrador']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Erro no login: ' . $e->getMessage()]);
}
?>
