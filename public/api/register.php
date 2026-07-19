<?php
/**
 * register.php — Registo de novo utilizador
 *
 * Segurança aplicada:
 *   - Rate limiting por IP (V9): 5 registos / hora
 *   - Política de senha forte (V10)
 *   - Validação de email
 *   - Sessão iniciada automaticamente após registo
 *   - Erros genéricos em produção (V4)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';

checkRateLimit('register', 5, 3600);

$data = json_decode(file_get_contents('php://input'), true) ?: [];

if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    fail('Dados incompletos.');
}

$name = trim((string) $data['name']);
$email = trim((string) $data['email']);
$password = (string) $data['password'];

// Validações
if (mb_strlen($name) < 2 || mb_strlen($name) > 80) {
    fail('Nome inválido (2-80 caracteres).');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    fail('Email inválido.');
}
$passwordError = validatePassword($password);
if ($passwordError !== '') {
    fail($passwordError);
}

try {
    // Verificar duplicado
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        // Mensagem genérica para evitar enumeração (mas registo precisa saber)
        fail('Email já registado.');
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $date = date('d/m/Y');

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())');
        $stmt->execute([$name, $email, $hash, 'User', 'Ativo']);
        $userId = (int) $pdo->lastInsertId();

        $stmt = $pdo->prepare("INSERT INTO passports (user_id, member_since, stamps, wishlist, completed_missions, photos, treasures, avatar) VALUES (?, ?, '[]', '[]', '[]', '[]', '[]', 'default')");
        $stmt->execute([$userId, $date]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    startUserSession([
        'id'    => (string) $userId,
        'email' => $email,
        'name'  => $name,
        'role'  => 'User',
    ]);
    clearRateLimit('register');

    jsonResponse([
        'success' => true,
        'user' => [
            'id'    => (string) $userId,
            'name'  => $name,
            'email' => $email,
            'role'  => 'User',
        ],
    ]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
