<?php
// login.php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Erro no login: ' . $e->getMessage()]);
}
?>
