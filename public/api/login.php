<?php
/**
 * login.php — Login de utilizador comum (frontend público)
 *
 * Segurança aplicada:
 *   - Rate limiting por IP (V9): 10 tentativas / 15 min
 *   - Senha verificada com password_verify (bcrypt)
 *   - Sessão PHP httpOnly + SameSite=Strict (anti-CSRF, anti-XSS-token-theft)
 *   - Resposta genérica em produção (V4)
 *   - Credenciais fora do código (V1, via db.php → .env)
 *   - CORS whitelist (V2, via db.php)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';

checkRateLimit('login_user', 10, 900);

$data = json_decode(file_get_contents('php://input'), true) ?: [];

if (empty($data['email']) || empty($data['password'])) {
    fail('Dados incompletos.');
}

$email = trim((string) $data['email']);
$password = (string) $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Email inválido.');
}

try {
    $stmt = $pdo->prepare('SELECT id, name, email, password_hash, role, status FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Resposta idêntica para "utilizador não existe" e "senha errada" (evita enumeração)
    if (!$user || !password_verify($password, $user['password_hash'])) {
        // Pausa artificial para dificultar timing attacks
        usleep(random_int(200000, 500000));
        fail('Credenciais inválidas.');
    }

    if (($user['status'] ?? 'Ativo') === 'Bloqueado') {
        fail('A sua conta está bloqueada. Contacte o suporte.');
    }

    startUserSession([
        'id'    => (string) $user['id'],
        'email' => $user['email'],
        'name'  => $user['name'],
        'role'  => $user['role'] ?? 'User',
    ]);
    clearRateLimit('login_user');

    jsonResponse([
        'success' => true,
        'user' => [
            'id'    => (string) $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'] ?? 'User',
        ],
    ]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
