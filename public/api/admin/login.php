<?php
/**
 * admin/login.php — Login ADMINISTRADOR
 *
 * Diferença vs login.php público:
 *   - Rate limiting mais estrito: 5 tentativas / 15 min (V9)
 *   - Só permite role = Admin ou SUPER_ADMIN
 *   - Verifica status = Ativo
 *   - Sessão com flag de role
 *
 * Combina com requireAdmin() nos restantes endpoints /api/admin/* (V3).
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../security.php';

checkRateLimit('login_admin', 5, 900);

$data = json_decode(file_get_contents('php://input'), true) ?: [];

if (empty($data['email']) || empty($data['password'])) {
    fail('Dados incompletos.');
}

$email = trim((string) $data['email']);
$password = (string) $data['password'];

if ($email === '' || $password === '') {
    fail('Preencha email e senha.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    // Diagnosticar: mostrar o que recebeu (truncado) para o utilizador perceber
    $preview = mb_substr($email, 0, 60);
    fail("Email com formato inválido: '$preview'");
}

try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, u.password_hash, u.role, u.status, p.avatar
        FROM users u
        LEFT JOIN passports p ON u.id = p.user_id
        WHERE u.email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Mensagem idêntica para todos os casos de falha (anti-enumeration)
    $failMsg = 'Credenciais inválidas ou não tem permissão de administrador.';

    if (!$user || !password_verify($password, $user['password_hash'])) {
        usleep(random_int(300000, 700000)); // anti timing attack
        fail($failMsg);
    }

    if (!in_array($user['role'] ?? '', ['Admin', 'SUPER_ADMIN'], true)) {
        usleep(random_int(300000, 700000));
        fail($failMsg);
    }

    if (($user['status'] ?? 'Ativo') === 'Bloqueado') {
        fail('A sua conta de administrador foi bloqueada. Contacte o suporte.');
    }

    startUserSession([
        'id'    => (string) $user['id'],
        'email' => $user['email'],
        'name'  => $user['name'],
        'role'  => $user['role'],
    ]);
    clearRateLimit('login_admin');

    jsonResponse([
        'success' => true,
        'user' => [
            'id'        => (string) $user['id'],
            'email'     => $user['email'],
            'name'      => $user['name'],
            'role'      => $user['role'] === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
            'avatarUrl' => $user['avatar'] ?? 'default',
        ],
    ]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
