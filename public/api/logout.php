<?php
/**
 * logout.php — Termina a sessão atual (utilizador comum e admin)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';

destroySession();

jsonResponse(['success' => true]);
