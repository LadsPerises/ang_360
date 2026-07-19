<?php
/**
 * me.php — Devolve o utilizador autenticado atual (para o frontend
 * restaurar a sessão após refresh).
 *
 * Permite ao AuthContext verificar se há sessão válida sem refazer login.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';

$user = getCurrentUser();

if ($user === null) {
    jsonResponse(['success' => false, 'authenticated' => false], 401);
}

jsonResponse([
    'success'       => true,
    'authenticated' => true,
    'user'          => $user,
]);
