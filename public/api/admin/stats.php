<?php
/**
 * admin/stats.php — Estatísticas para o dashboard (apenas admins)
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../security.php';

// 🛡️ GUARDA DE ADMIN
requireAdmin();

try {
    $stmt = $pdo->query('SELECT COUNT(*) FROM users');
    $totalUsers = (int) $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE status = 'Ativo'");
    $activeUsers = (int) $stmt->fetchColumn();

    // Soma de carimbos coletados
    $stmt = $pdo->query('SELECT stamps FROM passports');
    $totalStamps = 0;
    while ($row = $stmt->fetch()) {
        $arr = json_decode($row['stamps'] ?? '[]', true);
        if (is_array($arr)) $totalStamps += count($arr);
    }

    jsonResponse([
        'success' => true,
        'stats' => [
            'totalUsers'   => $totalUsers,
            'activeUsers'  => $activeUsers,
            'totalTours'   => 32,
            'toursViews'   => $totalStamps * 15,
        ],
    ]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
