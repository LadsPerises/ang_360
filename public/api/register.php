<?php
// register.php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
    exit();
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$date = date('d/m/Y');

try {
    // Verificar se o email já existe
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Email já registado']);
        exit();
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$name, $email, $password]);
    
    $user_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO passports (user_id, member_since, stamps, wishlist, completed_missions, photos, treasures) VALUES (?, ?, '[]', '[]', '[]', '[]', '[]')");
    $stmt->execute([$user_id, $date]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email
        ]
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => 'Erro ao registar: ' . $e->getMessage()]);
}
?>
