<?php
require_once 'db.php';

// Verify file upload
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'Nenhum ficheiro enviado ou ocorreu um erro no upload.']);
    exit();
}

if (!isset($_POST['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'ID do utilizador ausente.']);
    exit();
}

$userId = (int)$_POST['user_id'];
$file = $_FILES['avatar'];

// Check file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(['success' => false, 'error' => 'Formato de imagem inválido. Apenas JPG, PNG e WebP são suportados.']);
    exit();
}

// Check size (max 2MB)
if ($file['size'] > 2 * 1024 * 1024) {
    echo json_encode(['success' => false, 'error' => 'A imagem não pode ter mais de 2MB.']);
    exit();
}

// Generate safe filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'user_' . $userId . '_' . time() . '.' . strtolower($ext);
$uploadDir = '../uploads/avatars/';

// Ensure dir exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$destination = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Update DB
    try {
        $avatarPath = '/uploads/avatars/' . $filename;
        $stmt = $pdo->prepare("UPDATE passports SET avatar = ? WHERE user_id = ?");
        $stmt->execute([$avatarPath, $userId]);
        
        echo json_encode(['success' => true, 'avatarPath' => $avatarPath]);
    } catch (Exception $e) {
        // Fallback cleanup
        unlink($destination);
        echo json_encode(['success' => false, 'error' => 'Erro ao guardar na base de dados: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Falha ao mover a imagem guardada.']);
}
?>
