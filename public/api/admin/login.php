<?php
/**
 * admin/login.php — Login ADMINISTRADOR
 *
 * Rate limiting estrito (5/15min), só Admin/SUPER_ADMIN, sessão httpOnly.
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../security.php';

checkRateLimit('login_admin', 5, 900);

$data = json_decode(file_get_contents('php://input'), true) ?: [];

if (empty($data['email']) || empty($data['password'])) {
    fail('Preencha email e senha.');
}

$email = trim((string) $data['email']);
$password = (string) $data['password'];

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Email com formato inválido.');
}

try {
    // Buscar o utilizador (qualquer role — a verificação vem depois)
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

    // 1. Utilizador não existe?
    if (!$user) {
        usleep(random_int(300000, 700000));
        fail($failMsg);
    }

    // 2. Password errada?
    if (!password_verify($password, $user['password_hash'])) {
        usleep(random_int(300000, 700000));
        fail($failMsg);
    }

    // 3. Bloqueado?
    if (($user['status'] ?? 'Ativo') === 'Bloqueado') {
        fail('A sua conta de administrador foi bloqueada. Contacte o suporte.');
    }

    // 4. Não é admin? (mensagem genérica para não vazar informação)
    $role = $user['role'] ?? 'User';
    if (!in_array($role, ['Admin', 'SUPER_ADMIN'], true)) {
        usleep(random_int(300000, 700000));
        fail($failMsg);
    }

    // ✅ Sucesso — criar sessão
    startUserSession([
        'id'    => (string) $user['id'],
        'email' => $user['email'],
        'name'  => $user['name'],
        'role'  => $role,   // mantém o formato exato da BD ('Admin' ou 'SUPER_ADMIN')
    ]);
    clearRateLimit('login_admin');

    jsonResponse([
        'success' => true,
        'user' => [
            'id'        => (string) $user['id'],
            'email'     => $user['email'],
            'name'      => $user['name'],
            'role'      => $role,
            'avatarUrl' => $user['avatar'] ?? 'default',
        ],
    ]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
