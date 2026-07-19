<?php
/**
 * admin/users.php — Gestão de utilizadores (apenas admins)
 *
 * Segurança aplicada:
 *   - requireAdmin() bloqueia acesso não autorizado (V3)
 *   - Prepared statements
 *   - Não expõe password_hash
 *   - Erros genéricos em produção (V4)
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../security.php';

// 🛡️ GUARDA DE ADMIN — falha 401/403 se não autenticado ou não admin
$admin = requireAdmin();

$data = json_decode(file_get_contents('php://input'), true) ?: [];

// ─── Ação: atualizar role/status ──────────────────────────────────────────
if (($data['action'] ?? null) === 'update_user') {
    $userId = $data['user_id'] ?? '';
    if (!ctype_digit((string) $userId)) {
        fail('ID de utilizador inválido.');
    }
    $userId = (int) $userId;
    $role   = $data['role']   ?? null;
    $status = $data['status'] ?? null;

    // Validar valores permitidos
    $allowedRoles   = ['User', 'Admin'];
    $allowedStatus  = ['Ativo', 'Bloqueado'];
    if ($role !== null && !in_array($role, $allowedRoles, true)) $role = null;
    if ($status !== null && !in_array($status, $allowedStatus, true)) $status = null;

    // Impedir que um admin se bloqueie a si próprio ou bloqueie o único SUPER_ADMIN
    if ($status === 'Bloqueado' && $userId === (int) $admin['id']) {
        fail('Não pode bloquear a sua própria conta.');
    }

    try {
        if ($role !== null) {
            $stmt = $pdo->prepare('UPDATE users SET role = ? WHERE id = ?');
            $stmt->execute([$role, $userId]);
        }
        if ($status !== null) {
            $stmt = $pdo->prepare('UPDATE users SET status = ? WHERE id = ?');
            $stmt->execute([$status, $userId]);
        }
        jsonResponse(['success' => true]);
    } catch (Throwable $e) {
        jsonResponse(safeException($e), 500);
    }
}

// ─── Ação: listar utilizadores (GET ou POST vazio) ────────────────────────
try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
               p.stamps, p.avatar
        FROM users u
        LEFT JOIN passports p ON u.id = p.user_id
        ORDER BY u.created_at DESC
    ");
    $stmt->execute();
    $users = $stmt->fetchAll();

    $formatted = array_map(function ($u) {
        $stamps = json_decode($u['stamps'] ?? '[]', true) ?: [];
        $date   = $u['created_at'] ?? 'now';
        try {
            $joinDate = (new DateTime($date))->format('d M Y');
        } catch (Throwable $e) {
            $joinDate = $date;
        }
        return [
            'id'              => (string) $u['id'],
            'name'            => $u['name'],
            'email'           => $u['email'],
            'role'            => $u['role'] ?? 'User',
            'status'          => $u['status'] ?? 'Ativo',
            'joinDate'        => $joinDate,
            'stampsCollected' => count($stamps),
            'avatarUrl'       => $u['avatar'] ?? 'default',
        ];
    }, $users);

    jsonResponse(['success' => true, 'users' => $formatted]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
