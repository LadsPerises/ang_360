<?php
require_once '../db.php';

try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $totalUsers = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE status = 'Ativo'");
    $activeUsers = $stmt->fetchColumn();

    // Uma estimativa aproximada dos "tours" vistos baseada no número de carimbos totais
    $stmt = $pdo->query("SELECT stamps FROM passports");
    $totalStamps = 0;
    while ($row = $stmt->fetch()) {
        $arr = json_decode($row['stamps'], true);
        if (is_array($arr)) {
            $totalStamps += count($arr);
        }
    }

    echo json_encode([
        'success' => true,
        'stats' => [
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'totalTours' => 32, // Tours simulados
            'toursViews' => $totalStamps * 15 // Lógica fictícia
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
