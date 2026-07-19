<?php
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

// Ação de Bloquear / Ativar / Mudar Papel
if (isset($data['action']) && $data['action'] === 'update_user') {
    $userId = $data['user_id'];
    $role = $data['role'] ?? null;
    $status = $data['status'] ?? null;

    try {
        if ($role) {
            $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
            $stmt->execute([$role, $userId]);
        }
        if ($status) {
            $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
            $stmt->execute([$status, $userId]);
        }
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Erro ao atualizar: ' . $e->getMessage()]);
    }
    exit();
}

// Obter todos os utilizadores
try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, u.role, u.status, u.created_at, 
               p.level, p.stamps, p.avatar
        FROM users u 
        LEFT JOIN passports p ON u.id = p.user_id 
        ORDER BY u.created_at DESC
    ");
    $stmt->execute();
    $users = $stmt->fetchAll();

    $formattedUsers = array_map(function($user) {
        $stampsArray = json_decode($user['stamps'], true) ?: [];
        $joinDateObj = new DateTime($user['created_at']);

        return [
            'id' => (string)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'] ?? 'User',
            'status' => $user['status'] ?? 'Ativo',
            'joinDate' => $joinDateObj->format('d M Y'),
            'stampsCollected' => count($stampsArray),
            'avatarUrl' => $user['avatar'] ?? 'default'
        ];
    }, $users);

    echo json_encode(['success' => true, 'users' => $formattedUsers]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao listar: ' . $e->getMessage()]);
}
?>
