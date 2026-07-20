-- ═══════════════════════════════════════════════════════════════════════════
-- Angola360 — Schema da Base de Dados + Utilizador Admin inicial
-- ═══════════════════════════════════════════════════════════════════════════
-- COMO USAR:
--   1. Abre o phpMyAdmin na Hostinger
--   2. Seleciona a base de dados u144936411_angola360_
--   3. Vai ao separador "SQL"
--   4. Cola TODO este conteúdo e clica "Executar"
--
-- Podes executar quantas vezes quiserier: usa "CREATE TABLE IF NOT EXISTS"
-- e "ON DUPLICATE KEY UPDATE" para não duplicar dados.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- Tabela: users
-- ─────────────────────────────────────────────────────────────────────────────
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Tabela: passports
-- ─────────────────────────────────────────────────────────────────────────────
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
  `archetype`          VARCHAR(50)  NOT NULL DEFAULT '',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_passports_user` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Utilizador Admin inicial
-- ─────────────────────────────────────────────────────────────────────────────
-- Email:    admin@angola360.ao
-- Senha:    Angola360@2026   ← PROVISÓRIA. TROCAR LOGO APÓS O 1º LOGIN.
--
-- O hash abaixo foi gerado com bcrypt custo 12.
-- O login.php usa password_verify() que é compatível com este formato.
-- Para gerar um hash diferente (se quiseres outra senha):
--   - Via PHP:  echo password_hash('nova_senha', PASSWORD_DEFAULT);
--   - Via Python: python -c "import bcrypt; print(bcrypt.hashpw(b'nova', bcrypt.gensalt(12)).decode())"
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `status`)
VALUES (
  'Administrador',
  'admin@angola360.ao',
  '$2b$12$13vIi6NABcfC71ajnaSRs.BGEt1eYEP3wIYkdi0uLng48Bio7Cg6G',
  'SUPER_ADMIN',
  'Ativo'
)
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `role`          = VALUES(`role`),
  `status`        = VALUES(`status`);


-- ─────────────────────────────────────────────────────────────────────────────
-- Passaporte vazio para o admin (necessário para o sync funcionar)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO `passports` (`user_id`, `member_since`)
SELECT `id`, DATE_FORMAT(NOW(), '%d/%m/%Y')
FROM `users`
WHERE `email` = 'admin@angola360.ao'
ON DUPLICATE KEY UPDATE `member_since` = VALUES(`member_since`);
