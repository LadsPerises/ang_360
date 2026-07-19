<?php
/**
 * upload_avatar.php — Upload seguro do avatar do utilizador autenticado
 *
 * Segurança aplicada:
 *   - requireUser() — só autenticados (V7)
 *   - IDOR fix: user_id é o da sessão, não do POST (V7)
 *   - Hardening de upload (V5):
 *       * MIME validado por mime_content_type
 *       * getimagesize confirma que é imagem real
 *       * Extensão derivada do MIME (nunca do nome enviado pelo cliente)
 *       * Limite 2MB
 *       * Nome sanitizado
 *   - Rate limiting: 10 uploads / hora
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';

// 🛡️ GUARDA DE UTILIZADOR + RATE LIMIT
$sessionUser = requireUser();
$userId = (int) $sessionUser['id'];   // ← IDOR fix

checkRateLimit('upload_avatar', 10, 3600);

if (empty($_FILES['avatar'])) {
    fail('Nenhum ficheiro enviado.');
}

try {
    // Sanitiza e guarda (lança fail() se inválido)
    $avatarPath = sanitizeAndSaveAvatar($_FILES['avatar'], $userId);

    $stmt = $pdo->prepare('UPDATE passports SET avatar = ? WHERE user_id = ?');
    $stmt->execute([$avatarPath, $userId]);

    clearRateLimit('upload_avatar');

    jsonResponse(['success' => true, 'avatarPath' => $avatarPath]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
