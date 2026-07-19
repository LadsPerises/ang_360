<?php
/**
 * security.php — Helpers de segurança reutilizáveis
 *
 * Inclui:
 *   - requireAdmin()      → bloqueia acesso não autenticado/não-admin (V3, V7)
 *   - getCurrentUser()    → lê utilizador da sessão atual
 *   - startUserSession()  → cria sessão após login bem-sucedido
 *   - destroySession()    → logout seguro
 *   - checkRateLimit()    → rate limiting por IP em endpoints sensíveis (V9)
 *   - validatePassword()  → política de senha forte (V10)
 *   - sanitizeAvatar()    → hardening do upload de avatar (V5)
 *
 * Depende de db.php (que carrega o .env e define $pdo + helpers env()).
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    // Sessão apenas via cookie httpOnly — token em JS é vulnerável a XSS.
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => true,                 // HTTPS obrigatório
        'httponly' => true,                 // não acessível via JS
        'samesite' => 'Strict',             // proteção CSRF
    ]);
    session_name('ANGOLA360_SID');
    session_start();
}

// ─────────────────────────────────────────────────────────────────────────────
// Resposta JSON canónica + logger de erro
// ─────────────────────────────────────────────────────────────────────────────
function jsonResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit();
}

function fail(string $message, int $status = 400, ?string $logDetail = null): void {
    if ($logDetail !== null) {
        error_log('[API] ' . $logDetail);
    }
    jsonResponse(['success' => false, 'error' => $message], $status);
}

/**
 * Converte exceções em mensagens genéricas em produção (V4).
 * Log interno mantém o detalhe para debug.
 */
function safeException(Throwable $e): array {
    error_log('[API] Exceção: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
    $isProd = (getenv('APP_ENV') !== false ? getenv('APP_ENV') : 'production') === 'production';
    return [
        'success' => false,
        'error'   => $isProd
            ? 'Ocorreu um erro inesperado. Tente novamente.'
            : $e->getMessage(),
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — sessão PHP persistente (cookie httpOnly)
// ─────────────────────────────────────────────────────────────────────────────

/** Lê o utilizador autenticado na sessão atual (ou null). */
function getCurrentUser(): ?array {
    if (empty($_SESSION['user_id'])) return null;
    return [
        'id'    => (string) $_SESSION['user_id'],
        'email' => (string) ($_SESSION['user_email'] ?? ''),
        'name'  => (string) ($_SESSION['user_name'] ?? ''),
        'role'  => (string) ($_SESSION['user_role'] ?? 'User'),
    ];
}

/** Cria a sessão após login validado. Regenera ID para evitar fixation. */
function startUserSession(array $user): void {
    session_regenerate_id(true);
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name']  = $user['name'];
    $_SESSION['user_role']  = $user['role'] ?? 'User';
    $_SESSION['login_at']   = time();
}

function destroySession(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/**
 * Guarda de admin: bloqueia o request se o utilizador não estiver autenticado
 * ou não for Admin/SUPER_ADMIN. (V3)
 */
function requireAdmin(): array {
    $user = getCurrentUser();
    if ($user === null) {
        fail('Não autenticado.', 401);
    }
    $role = $user['role'] ?? '';
    if (!in_array($role, ['Admin', 'SUPER_ADMIN'], true)) {
        fail('Permissões insuficientes.', 403);
    }
    return $user;
}

/**
 * Guarda de utilizador comum: bloqueia se não autenticado. (V7)
 */
function requireUser(): array {
    $user = getCurrentUser();
    if ($user === null) {
        fail('Não autenticado.', 401);
    }
    return $user;
}

// ─────────────────────────────────────────────────────────────────────────────
// RATE LIMITING — por IP, usando ficheiro temporário (V9)
// (Suficiente para Hostinger; para escala usar Redis/Memcached.)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Limita tentativas por IP. A ser chamado em endpoints sensíveis (login, register).
 *
 * @param string $action  Identificador da ação (ex: "login")
 * @param int    $max     Máximo de tentativas...
 * @param int    $window  ...na janela de N segundos
 */
function checkRateLimit(string $action, int $max = 5, int $window = 900): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    // Por trás de proxy/CDN, respeitar X-Forwarded-For apenas se confiável
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip  = trim($ips[0]);
    }
    $ip = preg_replace('/[^0-9a-fA-F.:]/', '', $ip);

    $file = sys_get_temp_dir() . '/angola360_rl_' . md5($action . $ip) . '.json';

    $now    = time();
    $data   = ['count' => 0, 'first' => $now, 'locked_until' => 0];
    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if ($raw !== false) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) $data = $decoded + $data;
        }
    }

    // Reset se a janela expirou
    if ($now - $data['first'] > $window) {
        $data = ['count' => 0, 'first' => $now, 'locked_until' => 0];
    }

    // Ainda bloqueado?
    if ($data['locked_until'] > $now) {
        $mins = (int) ceil(($data['locked_until'] - $now) / 60);
        fail("Demasiadas tentativas. Tente novamente em $mins minuto(s).", 429);
    }

    $data['count']++;
    if ($data['count'] > $max) {
        $data['locked_until'] = $now + $window;
        @file_put_contents($file, json_encode($data), LOCK_EX);
        fail("Demasiadas tentativas. Conta bloqueada por " . ($window / 60) . " minutos.", 429);
    }

    @file_put_contents($file, json_encode($data), LOCK_EX);
}

/** Limpa o contador de rate limit após sucesso (ex: login bem-sucedido). */
function clearRateLimit(string $action): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip  = trim($ips[0]);
    }
    $ip   = preg_replace('/[^0-9a-fA-F.:]/', '', $ip);
    $file = sys_get_temp_dir() . '/angola360_rl_' . md5($action . $ip) . '.json';
    if (is_file($file)) @unlink($file);
}

// ─────────────────────────────────────────────────────────────────────────────
// POLÍTICA DE SENHA FORTE (V10)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida força da senha. Retorna string de erro ou '' se OK.
 */
function validatePassword(string $password): string {
    if (strlen($password) < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (strlen($password) > 128) return 'Senha demasiado longa.';
    if (!preg_match('/[A-Za-z]/', $password)) return 'A senha deve conter letras.';
    if (!preg_match('/[0-9]/', $password)) return 'A senha deve conter números.';
    // Optional: exigir especial. Descomentar para mais rigor.
    // if (!preg_match('/[^A-Za-z0-9]/', $password)) return 'A senha deve conter caracteres especiais.';
    return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// HARDENING DE UPLOAD DE AVATAR (V5)
// ─────────────────────────────────────────────────────────────────────────────

/** Mime types permitidos → extensão canónica confiável. */
const AVATAR_MIME_TO_EXT = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

/**
 * Valida e move um upload de avatar de forma segura.
 *
 * @return string Caminho público do avatar (ex: /uploads/avatars/user_5_xxx.jpg)
 */
function sanitizeAndSaveAvatar(array $file, int $userId): string {
    if (!isset($file['tmp_name']) || ($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        fail('Nenhum ficheiro enviado ou erro no upload.');
    }
    if ($file['size'] > 2 * 1024 * 1024) {
        fail('A imagem não pode ter mais de 2MB.');
    }

    // 1. Validar MIME real (não confiar no nome do ficheiro)
    $mime = mime_content_type($file['tmp_name']);
    if ($mime === false || !isset(AVATAR_MIME_TO_EXT[$mime])) {
        fail('Formato inválido. Apenas JPG, PNG e WebP são suportados.');
    }

    // 2. Confirmar que É uma imagem (getimagesize exige GD e valida cabeçalho)
    $imageInfo = @getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        fail('Ficheiro corrompido ou não é uma imagem válida.');
    }

    // 3. Extensão derivada do MIME (nunca do nome enviado pelo cliente)
    $ext = AVATAR_MIME_TO_EXT[$mime];

    // 4. Nome seguro: user_ID_TIMESTAMP.EXT
    $filename = 'user_' . $userId . '_' . time() . '.' . $ext;

    // 5. Diretório FORA do reach de execução PHP (idealmente). Aqui em /uploads.
    $uploadDir = __DIR__ . '/../uploads/avatars/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $destination = $uploadDir . $filename;
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        fail('Falha ao guardar a imagem.', 500, 'move_uploaded_file falhou');
    }

    return '/uploads/avatars/' . $filename;
}
