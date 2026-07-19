ALTER TABLE passports ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT 'default';

-- Novas colunas para a tabela users (Painel de Administração)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'User';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Ativo';

-- Inserir o teu primeiro utilizador Administrador (A senha é 'admin123')
-- Atenção: Se o email já existir, muda o ROLE dele para 'Admin'
INSERT INTO users (name, email, password_hash, role, status)
VALUES ('Administrador', 'admin@angola360.ao', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Ativo')
ON DUPLICATE KEY UPDATE role = 'Admin';
