<?php
/**
 * debug_admin.php — Diagnóstico TEMPORÁRIO do login admin
 *
 * ⚠️ USO ÚNICO: abre no browser, lê o diagnóstico, e APAGA este ficheiro.
 *
 * O que faz:
 *   - Mostra se a ligação à BD funciona
 *   - Procura o admin@angola360.ao e mostra o seu estado (sem expor o hash completo)
 *   - Testa a verificação da senha 'Angola360@2026' contra o hash guardado
 *   - Mostra todas as colunas da tabela users (para detetar schema desatualizado)
 *   - Não precisa de login (é diagnóstico)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════════════════════\n";
echo " Angola360 — Diagnóstico de Login Admin\n";
echo " " . date('Y-m-d H:i:s') . "\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// 1. Ligação à BD
echo "[1] LIGAÇÃO À BASE DE DADOS\n";
echo "    DB_NAME: " . (getenv('DB_NAME') ?: '(não definido)') . "\n";
echo "    DB_USER: " . (getenv('DB_USER') ?: '(não definido)') . "\n";
echo "    DB_HOST: " . (getenv('DB_HOST') ?: '(não definido)') . "\n";
echo "    Status:  ✅ Ligado (se chegaste aqui)\n\n";

// 2. Tabela users existe?
echo "[2] TABELA 'users'\n";
try {
    $stmt = $pdo->query("SHOW COLUMNS FROM users");
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "    Colunas: " . implode(', ', $cols) . "\n";
} catch (Throwable $e) {
    echo "    ❌ Tabela 'users' não existe ou sem permissões.\n";
    echo "    Erro: " . $e->getMessage() . "\n";
    echo "    → Corre o schema.sql no phpMyAdmin!\n";
    exit;
}

// 3. Admin existe?
echo "\n[3] PROCURAR admin@angola360.ao\n";
try {
    $stmt = $pdo->prepare("SELECT id, name, email, role, status, LENGTH(password_hash) AS hash_len, LEFT(password_hash, 7) AS hash_prefix FROM users WHERE email = ?");
    $stmt->execute(['admin@angola360.ao']);
    $admin = $stmt->fetch();
} catch (Throwable $e) {
    echo "    ❌ Erro ao procurar: " . $e->getMessage() . "\n";
    exit;
}

if (!$admin) {
    echo "    ❌ ADMIN NÃO EXISTE na base de dados.\n";
    echo "    → Corre o schema.sql OU abre setup_admin.php para o criar.\n";
    exit;
}

echo "    ✅ Admin encontrado:\n";
echo "       id:         {$admin['id']}\n";
echo "       name:       {$admin['name']}\n";
echo "       email:      {$admin['email']}\n";
echo "       role:       {$admin['role']}\n";
echo "       status:     {$admin['status']}\n";
echo "       hash_len:   {$admin['hash_len']} (esperado: 60)\n";
echo "       hash_prefix: {$admin['hash_prefix']} (esperado: \$2y\$12\$ ou \$2b\$12\$)\n\n";

// 4. Validar role
echo "[4] VALIDAÇÃO DE ROLE\n";
if (in_array($admin['role'], ['Admin', 'SUPER_ADMIN'], true)) {
    echo "    ✅ Role '{$admin['role']}' é válida para admin.\n";
} else {
    echo "    ❌ Role '{$admin['role']}' NÃO permite acesso admin.\n";
    echo "    → No phpMyAdmin executa: UPDATE users SET role='SUPER_ADMIN' WHERE email='admin@angola360.ao';\n";
}

// 5. Validar status
echo "\n[5] VALIDAÇÃO DE STATUS\n";
if ($admin['status'] === 'Ativo') {
    echo "    ✅ Status 'Ativo'.\n";
} else {
    echo "    ❌ Status '{$admin['status']}' bloqueia o login.\n";
    echo "    → No phpMyAdmin: UPDATE users SET status='Ativo' WHERE email='admin@angola360.ao';\n";
}

// 6. Testar verificação da senha
echo "\n[6] TESTAR SENHA 'Angola360@2026'\n";
try {
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE email = ?");
    $stmt->execute(['admin@angola360.ao']);
    $hash = $stmt->fetchColumn();
    if (password_verify('Angola360@2026', $hash)) {
        echo "    ✅ Senha 'Angola360@2026' está CORRETA.\n";
    } else {
        echo "    ❌ Senha 'Angola360@2026' NÃO corresponde ao hash.\n";
        echo "    → O hash foi alterado ou a senha é diferente.\n";
        echo "    → Para redefinir, corre setup_admin.php novamente.\n";
    }
} catch (Throwable $e) {
    echo "    ❌ Erro ao verificar senha: " . $e->getMessage() . "\n";
}

// 7. Sessão
echo "\n[7] CONFIGURAÇÃO PHP\n";
echo "    session.save_path: " . ini_get('session.save_path') . "\n";
echo "    session.cookie_secure: " . ini_get('session.cookie_secure') . "\n";
echo "    session.cookie_httponly: " . ini_get('session.cookie_httponly') . "\n";

echo "\n═══════════════════════════════════════════════════════════════\n";
echo " ⚠️  APAGA ESTE FICHEIRO (debug_admin.php) AGORA!\n";
echo "═══════════════════════════════════════════════════════════════\n";
