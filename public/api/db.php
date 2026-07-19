<?php
/**
 * db.php — Ligação à base de dados MySQL (PDO)
 *
 * SEGURANÇA:
 * - Credenciais lidas de variáveis de ambiente (ficheiro .env fora de public/).
 * - CORS restrito a whitelist de domínios (ALLOWED_ORIGINS).
 * - Mensagens de erro genéricas em produção (sem leak de estrutura da BD).
 * -Rate limiting e auth são geridos por helpers em security.php.
 *
 * Este ficheiro deve ser incluído (require_once) no topo de todos os endpoints.
 */

declare(strict_types=1);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Carregar .env (procura no diretório pai do public/)
// ─────────────────────────────────────────────────────────────────────────────
$envPaths = [
    __DIR__ . '/../.env',       // local: raiz do projeto
    __DIR__ . '/../../.env',    // produção Hostinger: fora de public_html
    realpath(__DIR__ . '/..') . '/.env',
];

foreach ($envPaths as $envPath) {
    if (is_file($envPath)) {
        loadEnv($envPath);
        break;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Helpers
// ─────────────────────────────────────────────────────────────────────────────
function loadEnv(string $path): void {
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (!str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        // Remover aspas envolventes
        if ((strlen($value) >= 2) && ($value[0] === $value[-1]) && in_array($value[0], ['"', "'"], true)) {
            $value = substr($value, 1, -1);
        }
        if (!array_key_exists($key, $_SERVER) && !array_key_exists($key, $_ENV)) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

function env(string $key, $default = null) {
    $value = getenv($key);
    return ($value === false || $value === '') ? $default : $value;
}

function isProduction(): bool {
    return env('APP_ENV', 'production') === 'production';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORS restrito a whitelist
// ─────────────────────────────────────────────────────────────────────────────
$allowedOrigins = array_filter(array_map('trim', explode(',', env('ALLOWED_ORIGINS', ''))));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PDO (prepared statements por defeito)
// ─────────────────────────────────────────────────────────────────────────────
try {
    $host = env('DB_HOST', 'localhost');
    $name = env('DB_NAME');
    $user = env('DB_USER');
    $pass = env('DB_PASS', '');

    if ($name === null || $user === null) {
        throw new RuntimeException('Credenciais BD em falta no .env');
    }

    $dsn = "mysql:host=$host;dbname=$name;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
    ]);
} catch (Throwable $e) {
    // Em produção: mensagem genérica (não vazar detalhes).
    // Log interno para debug.
    error_log('[DB] Falha de ligação: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => isProduction()
            ? 'Servidor indisponível. Tente novamente.'
            : 'Falha na ligação à base de dados: ' . $e->getMessage(),
    ]);
    exit();
}
