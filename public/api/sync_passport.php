<?php
/**
 * sync_passport.php — Sincroniza o passaporte do utilizador autenticado
 *
 * Segurança aplicada:
 *   - requireUser() bloqueia acesso anônimo (V7)
 *   - IDOR fix: user_id é SEMPRE o da sessão, nunca o do payload.
 *     Antes: qualquer um podia sobrescrever o passaporte de qualquer user.
 *   - Validação de tipos nos campos
 *   - Erros genéricos em produção (V4)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/security.php';

// 🛡️ GUARDA DE UTILIZADOR
$sessionUser = requireUser();
$userId = (int) $sessionUser['id'];   // ← IDOR fix: ignorar qualquer user_id do cliente

$data = json_decode(file_get_contents('php://input'), true) ?: [];

// ─── SAVE (frontend → BD) ──────────────────────────────────────────────────
if (($data['action'] ?? null) === 'save') {
    $p = $data['passport'] ?? [];
    if (!is_array($p)) {
        fail('Dados de passaporte inválidos.');
    }

    // Helpers de cast segura
    $asStr   = fn($v, $d = '') => is_string($v) ? mb_substr($v, 0, 100) : $d;
    $asInt   = fn($v, $d = 0)   => is_int($v) ? $v : (is_numeric($v) ? (int) $v : $d);
    $asArr   = fn($v)           => is_array($v) ? json_encode(array_slice($v, 0, 500)) : '[]';

    $level         = $asStr($p['level'] ?? 'Novato', 'Novato');
    $stamps        = $asArr($p['stamps'] ?? []);
    $mileage       = $asInt($p['mileage'] ?? 0, 0);
    $wishlist      = $asArr($p['wishlist'] ?? []);
    $missions      = $asArr($p['completedMissions'] ?? []);
    $favorite      = $asStr($p['favoriteProvince'] ?? '', '');
    $photos        = $asArr($p['photos'] ?? []);
    $treasures     = $asArr($p['treasures'] ?? []);
    $avatar        = $asStr($p['avatar'] ?? 'default', 'default');
    $archetype     = $asStr($p['archetype'] ?? '', '');

    try {
        // Upsert: se não existir, cria
        $stmt = $pdo->prepare("
            INSERT INTO passports (user_id, member_since, level, stamps, mileage, wishlist, completed_missions, favorite_province, photos, treasures, avatar, archetype)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                level = VALUES(level),
                stamps = VALUES(stamps),
                mileage = VALUES(mileage),
                wishlist = VALUES(wishlist),
                completed_missions = VALUES(completed_missions),
                favorite_province = VALUES(favorite_province),
                photos = VALUES(photos),
                treasures = VALUES(treasures),
                avatar = VALUES(avatar),
                archetype = VALUES(archetype)
        ");
        $stmt->execute([
            $userId,
            date('d/m/Y'),
            $level, $stamps, $mileage, $wishlist, $missions, $favorite, $photos, $treasures, $avatar, $archetype,
        ]);

        jsonResponse(['success' => true]);
    } catch (Throwable $e) {
        jsonResponse(safeException($e), 500);
    }
}

// ─── LOAD (BD → frontend) ──────────────────────────────────────────────────
try {
    $stmt = $pdo->prepare('SELECT * FROM passports WHERE user_id = ?');
    $stmt->execute([$userId]);
    $passport = $stmt->fetch();

    if (!$passport) {
        // Cria um passaporte vazio para o utilizador se não existir
        $stmt = $pdo->prepare("
            INSERT INTO passports (user_id, member_since, stamps, wishlist, completed_missions, photos, treasures, avatar, archetype)
            VALUES (?, ?, '[]', '[]', '[]', '[]', '[]', 'default', '')
        ");
        $stmt->execute([$userId, date('d/m/Y')]);
        $passport = [
            'level'              => 'Novato',
            'stamps'             => '[]',
            'wishlist'           => '[]',
            'completed_missions' => '[]',
            'favorite_province'  => '',
            'photos'             => '[]',
            'treasures'          => '[]',
            'avatar'             => 'default',
            'archetype'          => '',
        ];
    }

    jsonResponse([
        'success'  => true,
        'passport' => [
            'level'             => $passport['level']              ?? 'Novato',
            'stamps'            => json_decode($passport['stamps'] ?? '[]', true) ?: [],
            'mileage'           => (int) ($passport['mileage']     ?? 0),
            'wishlist'          => json_decode($passport['wishlist'] ?? '[]', true) ?: [],
            'completedMissions' => json_decode($passport['completed_missions'] ?? '[]', true) ?: [],
            'favoriteProvince'  => $passport['favorite_province']  ?? '',
            'photos'            => json_decode($passport['photos'] ?? '[]', true) ?: [],
            'treasures'         => json_decode($passport['treasures'] ?? '[]', true) ?: [],
            'avatar'            => $passport['avatar']             ?? 'default',
            'archetype'         => $passport['archetype']            ?? '',
        ],
    ]);
} catch (Throwable $e) {
    jsonResponse(safeException($e), 500);
}
