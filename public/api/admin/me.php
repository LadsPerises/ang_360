<?php
/**
 * admin/me.php — Devolve o utilizador admin autenticado atual.
 *
 * Diferença crucial vs /api/me.php (público):
 *   - Este endpoint chama requireAdmin() → só responde 200 se a sessão
 *     pertencer a um Admin ou SUPER_ADMIN.
 *   - Um User comum autenticado pelo /api/login.php recebe 401 aqui.
 *
 * Isto impede que um utilizador comum aceda ao painel admin mesmo que
 * o cookie de sessão esteja presente.
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../security.php';

// 🛡️ GUARDA DE ADMIN — falha 401 se não for admin (mesmo que autenticado)
$admin = requireAdmin();

jsonResponse([
    'success'       => true,
    'authenticated' => true,
    'user'          => $admin,
]);
