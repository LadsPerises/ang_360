<?php
// sync_passport.php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'ID de utilizador necessário']);
    exit();
}

$userId = $data['user_id'];

// Se for um método POST para GUARDAR o passaporte (sincronizar do Frontend para a BD)
if (isset($data['action']) && $data['action'] === 'save') {
    try {
        $stmt = $pdo->prepare("UPDATE passports SET 
            level = ?, 
            stamps = ?, 
            mileage = ?, 
            wishlist = ?, 
            completed_missions = ?, 
            favorite_province = ?,
            photos = ?,
            treasures = ?
            WHERE user_id = ?");
            
        $stmt->execute([
            $data['passport']['level'] ?? 'Novato',
            json_encode($data['passport']['stamps'] ?? []),
            $data['passport']['mileage'] ?? 0,
            json_encode($data['passport']['wishlist'] ?? []),
            json_encode($data['passport']['completedMissions'] ?? []),
            $data['passport']['favoriteProvince'] ?? '',
            json_encode($data['passport']['photos'] ?? []),
            json_encode($data['passport']['treasures'] ?? []),
            $userId
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Erro ao gravar passaporte: ' . $e->getMessage()]);
    }
    exit();
}

// Caso contrário é para LER o passaporte (da BD para o Frontend)
try {
    $stmt = $pdo->prepare('SELECT * FROM passports WHERE user_id = ?');
    $stmt->execute([$userId]);
    $passport = $stmt->fetch();

    if ($passport) {
        // Deserializar os JSONs
        $passport['stamps'] = json_decode($passport['stamps'], true) ?: [];
        $passport['wishlist'] = json_decode($passport['wishlist'], true) ?: [];
        $passport['completedMissions'] = json_decode($passport['completed_missions'], true) ?: [];
        $passport['photos'] = json_decode($passport['photos'], true) ?: [];
        $passport['treasures'] = json_decode($passport['treasures'], true) ?: [];
        
        echo json_encode(['success' => true, 'passport' => $passport]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Passaporte não encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao carregar passaporte: ' . $e->getMessage()]);
}
?>
