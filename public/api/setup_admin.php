<?php
/**
 * setup_admin.php — Cria o schema + utilizador admin inicial
 *
 * COMO USAR:
 *   1. Faz deploy deste ficheiro para public_html/api/setup_admin.php
 *   2. Abre no browser: https://angola360.ao/api/setup_admin.php
 *   3. Segue as instruções no ecrã
 *   4. ⚠️ APAGA ESTE FICHEIRO imediatamente depois (segurança!)
 *
 * Este ficheiro é de USO ÚNICO. Nunca o deixes no servidor em produção.
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════════════════════\n";
echo " Angola360 — Setup inicial (schema + admin)\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// ─── 1. Criar tabela users ──────────────────────────────────────────────────
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
          `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `name`          VARCHAR(80)  NOT NULL,
          `email`         VARCHAR(254) NOT NULL,
          `password_hash` VARCHAR(255) NOT NULL,
          `role`          ENUM('User','Admin','SUPER_ADMIN') NOT NULL DEFAULT 'User',
          `status`        ENUM('Ativo','Bloqueado')          NOT NULL DEFAULT 'Ativo',
          `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uniq_email` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "[OK] Tabela 'users' criada/verificada.\n";
} catch (Throwable $e) {
    echo "[ERRO] Ao criar tabela 'users': " . $e->getMessage() . "\n";
    exit(1);
}

// ─── 2. Criar tabela passports ──────────────────────────────────────────────
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `passports` (
          `user_id`            INT UNSIGNED NOT NULL,
          `member_since`       VARCHAR(20)  NOT NULL DEFAULT '',
          `level`              VARCHAR(50)  NOT NULL DEFAULT 'Novato',
          `stamps`             JSON         NULL,
          `mileage`            INT          NOT NULL DEFAULT 0,
          `wishlist`           JSON         NULL,
          `completed_missions` JSON         NULL,
          `favorite_province`  VARCHAR(80)  NOT NULL DEFAULT '',
          `photos`             JSON         NULL,
          `treasures`          JSON         NULL,
          `avatar`             VARCHAR(255) NOT NULL DEFAULT 'default',
          PRIMARY KEY (`user_id`),
          CONSTRAINT `fk_passports_user` FOREIGN KEY (`user_id`)
            REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "[OK] Tabela 'passports' criada/verificada.\n";
} catch (Throwable $e) {
    echo "[ERRO] Ao criar tabela 'passports': " . $e->getMessage() . "\n";
    echo "       (Se a tabela já existe sem FK, pode ser necessário apagá-la primeiro.)\n";
}

// ─── 3. Criar admin ─────────────────────────────────────────────────────────
$adminEmail = 'admin@angola360.ao';
// Hash bcrypt da senha provisória 'Angola360@2026' (gerado offline)
$adminHash = '$2b$12$13vIi6NABcfC71ajnaSRs.BGEt1eYEP3wIYkdi0uLng48Bio7Cg6G';

try {
    $stmt = $pdo->prepare("
        INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `status`)
        VALUES (?, ?, ?, 'SUPER_ADMIN', 'Ativo')
        ON DUPLICATE KEY UPDATE
          `password_hash` = VALUES(`password_hash`),
          `role`          = VALUES(`role`),
          `status`        = VALUES(`status`)
    ");
    $stmt->execute(['Administrador', $adminEmail, $adminHash]);

    // Passaporte do admin
    $stmt = $pdo->prepare("
        INSERT INTO `passports` (`user_id`, `member_since`)
        SELECT `id`, ? FROM `users` WHERE `email` = ?
        ON DUPLICATE KEY UPDATE `member_since` = VALUES(`member_since`)
    ");
    $stmt->execute([date('d/m/Y'), $adminEmail]);

    echo "[OK] Admin criado/atualizado.\n";
} catch (Throwable $e) {
    echo "[ERRO] Ao criar admin: " . $e->getMessage() . "\n";
    exit(1);
}

// ─── 4. Confirmação final ───────────────────────────────────────────────────
echo "\n";
echo "═══════════════════════════════════════════════════════════════\n";
echo " ✅ SETUP CONCLUÍDO COM SUCESSO\n";
echo "═══════════════════════════════════════════════════════════════\n\n";
echo "Credenciais do admin:\n";
echo "  Email:  $adminEmail\n";
echo "  Senha:  Angola360@2026   (PROVISÓRIA — trocar após 1º login)\n\n";
echo "Agora podes fazer login em:\n";
echo "  https://angola360.ao/admin\n\n";
echo "⚠️  AÇÃO OBRIGATÓRIA:\n";
echo "  APAGA este ficheiro (setup_admin.php) do servidor AGORA!\n";
echo "  Via Gestor de Ficheiros da Hostinger → public_html/api/ → eliminar.\n";
